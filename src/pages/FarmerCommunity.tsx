import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Bot, Users, ThumbsUp, Flag, Sprout } from 'lucide-react';

interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
  likes: number;
  topic?: string;
}

const aiResponses: Record<string, string> = {
  'pest': '🤖 AI Moderator: For pest control, use integrated pest management (IPM). Neem oil spray (5ml/L) is effective for most soft-bodied insects. Apply in early morning.',
  'water': '🤖 AI Moderator: Drip irrigation saves 40-60% water vs flood irrigation. For wheat, critical irrigation stages are crown root initiation (21 DAS) and grain filling.',
  'fertilizer': '🤖 AI Moderator: Soil test before applying fertilizers. General recommendation: 120:60:40 kg NPK/hectare for wheat. Split nitrogen application improves efficiency.',
  'disease': '🤖 AI Moderator: Upload a photo to our Disease Scanner for accurate diagnosis. Common diseases: rust (wheat), blast (rice), wilt (cotton). Early detection is key.',
  'price': '🤖 AI Moderator: Check eNAM portal for live mandi prices. Wheat MSP 2024-25 is ₹2,275/quintal. Consider FPO membership for better price negotiation.',
  'default': '🤖 AI Moderator: Great question! I recommend consulting your local KVK (Krishi Vigyan Kendra) for region-specific advice. You can also check the PM-KISAN portal for government support.',
};

const getAIResponse = (text: string): string => {
  const lower = text.toLowerCase();
  for (const key of Object.keys(aiResponses)) {
    if (lower.includes(key)) return aiResponses[key];
  }
  return aiResponses['default'];
};

const initialMessages: ChatMessage[] = [
  { id: '1', author: 'Ramesh Kumar', avatar: 'RK', text: 'Kisi ko pata hai is season mein wheat ke liye best fertilizer kya hai?', timestamp: new Date(Date.now() - 3600000), likes: 5, topic: 'fertilizer' },
  { id: '2', author: 'AI Moderator', avatar: '🤖', text: '🤖 AI Moderator: For wheat this Rabi season, apply DAP at sowing (50 kg/acre) and urea in 2 splits — at tillering and jointing stage. Zinc sulfate (5 kg/acre) improves grain quality.', timestamp: new Date(Date.now() - 3500000), isAI: true, likes: 12, topic: 'fertilizer' },
  { id: '3', author: 'Sunita Devi', avatar: 'SD', text: 'Meri tomato crop mein yellow leaves aa rahi hain. Kya karna chahiye?', timestamp: new Date(Date.now() - 1800000), likes: 3, topic: 'disease' },
  { id: '4', author: 'Gurpreet Singh', avatar: 'GS', text: 'Punjab mein is baar cotton ka bhav bahut kam hai. Koi alternative crop suggest karo.', timestamp: new Date(Date.now() - 900000), likes: 8, topic: 'price' },
];

const topics = ['All', 'Fertilizer', 'Pest', 'Disease', 'Water', 'Price', 'Weather', 'General'];

const FarmerCommunity = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [activeTopic, setActiveTopic] = useState('All');
  const [userName] = useState('You');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      author: userName,
      avatar: 'YO',
      text: input,
      timestamp: new Date(),
      likes: 0,
    };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');

    // AI auto-response after 1.2s
    setTimeout(() => {
      const aiText = getAIResponse(userInput);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        author: 'AI Moderator',
        avatar: '🤖',
        text: aiText,
        timestamp: new Date(),
        isAI: true,
        likes: 0,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  const handleLike = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m));
  };

  const filteredMessages = activeTopic === 'All' ? messages : messages.filter(m => m.topic?.toLowerCase() === activeTopic.toLowerCase() || m.isAI);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 rounded-full px-3 py-1 text-sm font-medium text-teal-800 dark:text-teal-300 mb-3">
              <Users className="h-4 w-4" />
              <span>Farmer Community</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farmer Community Chat</h1>
            <p className="text-gray-600 dark:text-gray-300">Connect with farmers, share knowledge, and get AI-moderated answers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><Users className="h-4 w-4" /> Online Now</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {['Ramesh K.', 'Sunita D.', 'Gurpreet S.', 'Amit V.', 'Priya M.'].map(name => (
                    <div key={name} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {name}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Topics</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {topics.map(t => (
                    <button key={t} onClick={() => setActiveTopic(t)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${activeTopic === t ? 'bg-teal-600 text-white border-teal-600' : 'border-gray-300 dark:border-gray-600 hover:border-teal-400'}`}>
                      {t}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="glass-card rounded-xl flex flex-col h-[500px]">
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                  <MessageSquare className="h-4 w-4 text-teal-500" />
                  <span className="font-medium text-sm">Community Chat</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    <Bot className="h-3 w-3 mr-1 text-teal-500" /> AI Moderated
                  </Badge>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {filteredMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.author === userName ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isAI ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        {msg.isAI ? <Bot className="h-4 w-4" /> : msg.avatar}
                      </div>
                      <div className={`max-w-[75%] ${msg.author === userName ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{msg.author}</span>
                          <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div className={`rounded-2xl px-3 py-2 text-sm ${msg.isAI ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800' : msg.author === userName ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => handleLike(msg.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-500 transition-colors">
                            <ThumbsUp className="h-3 w-3" /> {msg.likes}
                          </button>
                          <button className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                            <Flag className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a farming question..." onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1" />
                    <Button onClick={handleSend} className="bg-teal-600 hover:bg-teal-700 text-white px-3">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Sprout className="h-3 w-3" /> AI moderator will respond to farming questions automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FarmerCommunity;
