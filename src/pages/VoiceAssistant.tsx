import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, MessageSquare, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳', name: 'हिंदी' },
  { code: 'ne-NP', label: 'Nepali', flag: '🇳🇵', name: 'नेपाली' },
  { code: 'pa-IN', label: 'Punjabi', flag: '🇮🇳', name: 'ਪੰਜਾਬੀ' },
  { code: 'en-IN', label: 'English', flag: '🇬🇧', name: 'English' },
];

const farmingQA: Record<string, string> = {
  'irrigation': 'Irrigate your crops when soil moisture drops below 30%. For wheat, irrigate every 10-15 days. For rice, maintain 2-5 cm standing water.',
  'fertilizer': 'Apply NPK fertilizer at sowing. Use urea (nitrogen) during vegetative stage. Potash helps during flowering and fruiting.',
  'pest': 'Monitor crops weekly for pests. Use neem-based pesticides for organic control. Spray in early morning or evening.',
  'weather': 'Check weather forecast before irrigation and spraying. Avoid spraying on windy or rainy days.',
  'harvest': 'Harvest wheat when grain moisture is 14-18%. Rice should be harvested when 80% of grains turn golden.',
  'soil': 'Test soil pH every 2 years. Most crops prefer pH 6-7. Add lime to increase pH, sulfur to decrease it.',
  'seed': 'Use certified seeds for better yield. Treat seeds with fungicide before sowing to prevent soil-borne diseases.',
  'default': 'I can help you with irrigation, fertilizer, pest control, weather, harvesting, soil health, and seed selection. Please ask a specific farming question.'
};

const getAIResponse = (query: string): string => {
  const lower = query.toLowerCase();
  for (const key of Object.keys(farmingQA)) {
    if (lower.includes(key)) return farmingQA[key];
  }
  return farmingQA['default'];
};

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const VoiceAssistant = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'नमस्ते! मैं आपका AI कृषि सहायक हूं। आप मुझसे खेती के बारे में कोई भी सवाल पूछ सकते हैं।', timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Not Supported', description: 'Voice recognition is not supported in this browser. Try Chrome.', variant: 'destructive' });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (transcript) handleSubmit(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast({ title: 'Mic Error', description: 'Could not access microphone. Please allow mic permission.', variant: 'destructive' });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTranscript('');
    setIsProcessing(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const assistantMsg: Message = { role: 'assistant', text: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
      speak(response);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
              <Mic className="h-4 w-4" />
              <span>Voice AI Assistant</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farming Voice Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300">Ask farming questions in Hindi, Nepali, or Punjabi — get spoken answers instantly.</p>
          </div>

          {/* Language Selector */}
          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {languages.map(lang => (
              <button key={lang.code} onClick={() => setSelectedLang(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedLang.code === lang.code ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
                <span>{lang.flag}</span> {lang.label}
                <span className="text-xs opacity-70">({lang.name})</span>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Conversation
                <Badge variant="outline" className="ml-auto">{selectedLang.flag} {selectedLang.label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'}`}>
                      {msg.text}
                      <div className={`text-xs mt-1 opacity-60`}>{msg.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Voice Input */}
          <div className="glass-card rounded-xl p-4">
            {transcript && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Hearing: </span>{transcript}
              </div>
            )}
            <div className="flex items-center gap-3">
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 h-14 text-base font-semibold rounded-xl transition-all ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                {isListening ? <><MicOff className="h-5 w-5 mr-2" /> Stop Listening</> : <><Mic className="h-5 w-5 mr-2" /> Hold to Speak</>}
              </Button>
              {isSpeaking && (
                <Button variant="outline" onClick={() => window.speechSynthesis.cancel()} className="h-14 px-4">
                  <Volume2 className="h-5 w-5 text-blue-500 animate-pulse" />
                </Button>
              )}
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              <Globe className="h-3 w-3 inline mr-1" />
              Speaking in {selectedLang.label} ({selectedLang.name}) — Browser mic permission required
            </p>
          </div>

          {/* Quick Questions */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {['When to irrigate?', 'Fertilizer advice', 'Pest control tips', 'Harvest time?', 'Soil health'].map(q => (
                <button key={q} onClick={() => handleSubmit(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VoiceAssistant;
