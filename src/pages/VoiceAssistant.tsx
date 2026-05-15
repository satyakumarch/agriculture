import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Volume2, MessageSquare, Globe, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳', name: 'हिंदी' },
  { code: 'ne-NP', label: 'Nepali', flag: '🇳🇵', name: 'नेपाली' },
  { code: 'pa-IN', label: 'Punjabi', flag: '🇮🇳', name: 'ਪੰਜਾਬੀ' },
  { code: 'en-IN', label: 'English', flag: '🇬🇧', name: 'English' },
];

// Comprehensive farming knowledge base
const knowledgeBase: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['irrigat', 'paani', 'water', 'sinchai', 'pani'], answer: 'Irrigation timing depends on your crop and soil. For wheat: irrigate at Crown Root Initiation (21 days), Tillering (45 days), Jointing (65 days), Flowering (85 days), and Grain Filling (105 days). For rice: maintain 2–5 cm standing water during vegetative stage. For vegetables: irrigate every 3–5 days in summer, every 7–10 days in winter. Use drip irrigation to save 40–60% water. Irrigate in early morning (5–8 AM) to reduce evaporation.' },
  { keywords: ['fertilizer', 'khad', 'urea', 'npk', 'dap', 'nutrient', 'nitrogen', 'potash'], answer: 'Fertilizer recommendations by crop: Wheat — apply DAP 50 kg/acre at sowing, Urea 25 kg/acre at tillering and jointing. Rice — apply DAP 50 kg/acre + MOP 20 kg/acre at transplanting, Urea 30 kg/acre at tillering. Cotton — NPK 12:32:16 at sowing, Urea top-dressing at squaring and boll formation. Tomato — apply 10 tons FYM/acre before planting, then NPK 19:19:19 every 15 days via fertigation. Always do soil testing before applying fertilizers to avoid over-application.' },
  { keywords: ['pest', 'keet', 'insect', 'bug', 'aphid', 'whitefly', 'bollworm', 'locust'], answer: 'Integrated Pest Management (IPM): 1) Monitor crops weekly — scout 20 plants per acre. 2) Use yellow sticky traps for whiteflies and aphids. 3) Economic Threshold Level (ETL): spray only when pest population crosses ETL. 4) Neem oil (5 ml/L water) controls 200+ soft-bodied insects organically. 5) For bollworm in cotton: use Bt spray or Coragen 18.5 SC at 60 ml/acre. 6) For stem borer in rice: use Chlorpyrifos 20 EC at 1.5 L/acre. 7) Spray in early morning or evening to protect beneficial insects.' },
  { keywords: ['disease', 'bimari', 'fungus', 'blight', 'rust', 'mildew', 'wilt', 'rot'], answer: 'Common crop diseases and treatment: 1) Wheat Rust — spray Propiconazole 25 EC at 200 ml/acre. 2) Rice Blast — apply Tricyclazole 75 WP at 120 g/acre. 3) Late Blight in Potato/Tomato — spray Mancozeb 75 WP at 600 g/acre every 7 days. 4) Powdery Mildew — apply Sulfur 80 WP at 500 g/acre or Karathane. 5) Bacterial Wilt — remove infected plants, drench soil with Copper Oxychloride. 6) Use our Disease Scanner to upload a photo for accurate diagnosis.' },
  { keywords: ['harvest', 'katai', 'kataai', 'reap', 'yield', 'fasal'], answer: 'Harvesting guidelines: Wheat — harvest when grain moisture is 14–18%, straw turns golden, and grains are hard. Rice — harvest when 80–85% grains turn golden/straw-colored, grain moisture 20–25%. Cotton — pick bolls when fully open, white, and fluffy. Tomato — harvest at breaker stage (25% red color) for long-distance transport, or fully red for local market. Potato — harvest 10–15 days after vine death. Sugarcane — harvest at 10–12 months when Brix value is 18–20%.' },
  { keywords: ['soil', 'mitti', 'ph', 'loam', 'clay', 'sandy', 'organic', 'compost'], answer: 'Soil health management: 1) Test soil pH every 2 years — ideal range is 6.0–7.0 for most crops. 2) To increase pH: apply agricultural lime at 2–4 tons/acre. 3) To decrease pH: apply sulfur at 200–400 kg/acre. 4) Sandy soil: add organic matter (FYM 10 tons/acre) to improve water retention. 5) Clay soil: add sand + organic matter to improve drainage. 6) Vermicompost (2–3 tons/acre) improves soil structure and provides slow-release nutrients. 7) Get free Soil Health Card from government — apply at nearest KVK.' },
  { keywords: ['seed', 'beej', 'variety', 'hybrid', 'certified', 'germination'], answer: 'Seed selection guide: 1) Always buy BIS-certified seeds from government-approved dealers. 2) Hybrid seeds give 20–30% higher yield but cannot be saved for next season. 3) Seed treatment: soak seeds in Thiram 75 WP (2.5 g/kg seed) or Carbendazim 50 WP (2 g/kg) before sowing to prevent damping-off. 4) Germination test: place 10 seeds on wet cloth — if 7+ germinate in 5 days, batch is good. 5) Recommended varieties: Wheat HD-2967/HD-3086, Rice Pusa Basmati 1121, Cotton Bollgard II, Tomato Hybrid Red King.' },
  { keywords: ['weather', 'mausam', 'rain', 'temperature', 'forecast', 'barish', 'drought'], answer: 'Weather-based farming advice: 1) Check 5-day forecast before irrigation — avoid irrigating before rain. 2) Do not spray pesticides on windy days (wind > 15 km/h) or before rain. 3) Frost alert: cover seedlings with plastic sheets when temperature drops below 4°C. 4) Heat stress: irrigate crops in evening when temperature exceeds 40°C. 5) Drought management: use mulching to retain soil moisture, switch to drought-tolerant varieties. 6) Use our Weather page for hyperlocal forecasts with agricultural advisories.' },
  { keywords: ['profit', 'income', 'price', 'msp', 'market', 'sell', 'mandi', 'bhav'], answer: 'Maximizing farm profit: 1) MSP 2024-25: Wheat ₹2,275/quintal, Rice ₹2,300/quintal, Cotton ₹7,121/quintal (long staple). 2) Sell at eNAM (National Agriculture Market) for better price discovery — register at enam.gov.in. 3) Join Farmer Producer Organization (FPO) for collective bargaining power. 4) Value addition: sell processed products (flour, oil, pickles) for 2–3x higher returns. 5) Use our Profit Prediction tool to calculate expected yield and profit before sowing.' },
  { keywords: ['scheme', 'subsidy', 'government', 'yojana', 'loan', 'insurance', 'kisan'], answer: 'Key government schemes for farmers: 1) PM-KISAN: ₹6,000/year direct income support — register at pmkisan.gov.in. 2) PMFBY: Crop insurance at 1.5–5% premium — covers natural calamities, pests, diseases. 3) Kisan Credit Card: crop loans up to ₹3 lakh at 4% interest. 4) Soil Health Card: free soil testing every 2 years. 5) PM Krishi Sinchai Yojana: 55–90% subsidy on drip/sprinkler irrigation. 6) PKVY: ₹50,000/hectare for organic farming over 3 years. Visit our Government Schemes page for complete details.' },
  { keywords: ['organic', 'jaivik', 'natural', 'bio', 'compost', 'vermi'], answer: 'Organic farming practices: 1) Vermicompost: apply 2–3 tons/acre — improves soil structure and provides NPK slowly. 2) Green manure: grow Dhaincha or Sunhemp and incorporate before flowering — adds 60–80 kg N/acre. 3) Neem cake: apply 200 kg/acre as basal dose — controls soil-borne pests and adds nutrients. 4) Jeevamrit: mix 10 kg cow dung + 10 L cow urine + 2 kg jaggery + 2 kg gram flour in 200 L water, ferment 48 hours, apply 200 L/acre. 5) PKVY scheme provides ₹50,000/hectare support for organic certification.' },
  { keywords: ['drip', 'sprinkler', 'micro', 'irrigation system', 'trickle'], answer: 'Drip and sprinkler irrigation: Drip irrigation saves 40–60% water vs flood irrigation and increases yield by 20–50%. Best for: vegetables, fruits, sugarcane, cotton. Cost: ₹40,000–80,000/acre (55–90% subsidy available under PM Krishi Sinchai Yojana). Sprinkler irrigation: best for wheat, vegetables, orchards. Saves 30–40% water. Cost: ₹15,000–25,000/acre. Maintenance: flush drip lines monthly, check emitters for clogging, clean filters weekly.' },
  { keywords: ['crop rotation', 'rotation', 'intercrop', 'mixed', 'sequence'], answer: 'Crop rotation benefits and recommendations: 1) Wheat → Rice → Mustard: most common in North India, but depletes soil. 2) Better rotation: Wheat → Maize → Mustard or Wheat → Soybean → Wheat. 3) Legume rotation: include gram, soybean, or groundnut every 3rd season — fixes 40–80 kg N/acre naturally. 4) Intercropping: Wheat + Mustard (9:1 ratio), Cotton + Moong, Sugarcane + Garlic. 5) Benefits: breaks pest/disease cycles, improves soil health, reduces fertilizer costs by 20–30%.' },
];

const getSmartResponse = (query: string, langCode: string): string => {
  const lower = query.toLowerCase();
  let bestMatch = { score: 0, answer: '' };
  for (const entry of knowledgeBase) {
    const score = entry.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestMatch.score) bestMatch = { score, answer: entry.answer };
  }

  // Translate response based on selected language
  const translateToLang = (text: string, lang: string): string => {
    if (lang.startsWith('en')) return text;

    // Hindi responses
    if (lang.startsWith('hi')) {
      if (lower.includes('irrigat') || lower.includes('paani') || lower.includes('sinchai') || lower.includes('pani')) {
        return 'सिंचाई का समय फसल और मिट्टी पर निर्भर करता है। गेहूं के लिए: CRI (21 दिन), कल्ले निकलते समय (45 दिन), जोड़ बनते समय (65 दिन), फूल आने पर (85 दिन), और दाना भरते समय (105 दिन) सिंचाई करें। चावल के लिए: वानस्पतिक अवस्था में 2-5 सेमी पानी बनाए रखें। सब्जियों के लिए: गर्मियों में हर 3-5 दिन, सर्दियों में हर 7-10 दिन सिंचाई करें। ड्रिप सिंचाई से 40-60% पानी बचता है। सुबह 5-8 बजे सिंचाई करें।';
      }
      if (lower.includes('fertilizer') || lower.includes('khad') || lower.includes('urea') || lower.includes('dap')) {
        return 'उर्वरक सिफारिश: गेहूं — बुवाई पर DAP 50 किग्रा/एकड़, कल्ले निकलते समय यूरिया 25 किग्रा/एकड़। चावल — रोपाई पर DAP 50 किग्रा + MOP 20 किग्रा/एकड़, कल्ले निकलते समय यूरिया 30 किग्रा/एकड़। कपास — बुवाई पर NPK 12:32:16, फूल और टिंडे बनते समय यूरिया। उर्वरक लगाने से पहले हमेशा मिट्टी परीक्षण करवाएं।';
      }
      if (lower.includes('pest') || lower.includes('keet') || lower.includes('insect')) {
        return 'एकीकृत कीट प्रबंधन (IPM): 1) हर हफ्ते 20 पौधे/एकड़ की जांच करें। 2) सफेद मक्खी और माहू के लिए पीले चिपचिपे जाल लगाएं। 3) नीम का तेल (5 मिली/लीटर पानी) 200+ कीटों को जैविक तरीके से नियंत्रित करता है। 4) कपास में बॉलवर्म के लिए Coragen 18.5 SC 60 मिली/एकड़ छिड़कें। 5) सुबह या शाम को छिड़काव करें।';
      }
      if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('subsidy') || lower.includes('kisan')) {
        return 'किसानों के लिए मुख्य सरकारी योजनाएं: 1) PM-KISAN: ₹6,000/वर्ष — pmkisan.gov.in पर पंजीकरण करें। 2) PMFBY: 1.5-5% प्रीमियम पर फसल बीमा। 3) किसान क्रेडिट कार्ड: 4% ब्याज पर ₹3 लाख तक ऋण। 4) PM कृषि सिंचाई योजना: ड्रिप/स्प्रिंकलर पर 55-90% सब्सिडी। 5) मृदा स्वास्थ्य कार्ड: मुफ्त मिट्टी परीक्षण।';
      }
      if (lower.includes('weather') || lower.includes('mausam') || lower.includes('rain') || lower.includes('barish')) {
        return 'मौसम आधारित खेती सलाह: 1) सिंचाई से पहले 5 दिन का पूर्वानुमान देखें — बारिश से पहले सिंचाई न करें। 2) तेज हवा (15 किमी/घंटा से अधिक) या बारिश से पहले कीटनाशक न छिड़कें। 3) पाला पड़ने पर: 4°C से नीचे तापमान होने पर पौधों को प्लास्टिक से ढकें। 4) गर्मी में: 40°C से अधिक तापमान पर शाम को सिंचाई करें।';
      }
      return `आपने "${query}" के बारे में पूछा है। मैं आपकी मदद कर सकता हूं: सिंचाई, उर्वरक, कीट नियंत्रण, रोग पहचान, फसल कटाई, मिट्टी स्वास्थ्य, बीज चयन, मौसम योजना, सरकारी योजनाएं। कृपया अधिक विशिष्ट प्रश्न पूछें जैसे "गेहूं में कब सिंचाई करें?" या "चावल के लिए कौन सा खाद?"`;
    }

    // Punjabi responses
    if (lang.startsWith('pa')) {
      if (lower.includes('irrigat') || lower.includes('paani') || lower.includes('sinchai') || lower.includes('pani')) {
        return 'ਸਿੰਚਾਈ ਦਾ ਸਮਾਂ ਫਸਲ ਅਤੇ ਮਿੱਟੀ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ। ਕਣਕ ਲਈ: CRI (21 ਦਿਨ), ਕਲੇ ਨਿਕਲਣ ਵੇਲੇ (45 ਦਿਨ), ਜੋੜ ਬਣਨ ਵੇਲੇ (65 ਦਿਨ), ਫੁੱਲ ਆਉਣ ਤੇ (85 ਦਿਨ) ਸਿੰਚਾਈ ਕਰੋ। ਡ੍ਰਿੱਪ ਸਿੰਚਾਈ ਨਾਲ 40-60% ਪਾਣੀ ਬਚਦਾ ਹੈ। ਸਵੇਰੇ 5-8 ਵਜੇ ਸਿੰਚਾਈ ਕਰੋ।';
      }
      if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('subsidy')) {
        return 'ਕਿਸਾਨਾਂ ਲਈ ਮੁੱਖ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ: 1) PM-KISAN: ₹6,000/ਸਾਲ। 2) PMFBY: ਫਸਲ ਬੀਮਾ। 3) ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ: 4% ਵਿਆਜ ਤੇ ₹3 ਲੱਖ ਤੱਕ ਕਰਜ਼ਾ। 4) PM ਕ੍ਰਿਸ਼ੀ ਸਿੰਚਾਈ ਯੋਜਨਾ: ਡ੍ਰਿੱਪ/ਸਪ੍ਰਿੰਕਲਰ ਤੇ 55-90% ਸਬਸਿਡੀ।';
      }
      return `ਤੁਸੀਂ "${query}" ਬਾਰੇ ਪੁੱਛਿਆ ਹੈ। ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ: ਸਿੰਚਾਈ, ਖਾਦ, ਕੀਟ ਨਿਯੰਤਰਣ, ਮੌਸਮ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਵਧੇਰੇ ਖਾਸ ਸਵਾਲ ਪੁੱਛੋ।`;
    }

    // Nepali responses
    if (lang.startsWith('ne')) {
      if (lower.includes('irrigat') || lower.includes('paani') || lower.includes('sinchai') || lower.includes('pani')) {
        return 'सिँचाइको समय बाली र माटोमा निर्भर गर्दछ। गहुँको लागि: CRI (२१ दिन), कल्ला निस्कँदा (४५ दिन), जोड बन्दा (६५ दिन), फूल फुल्दा (८५ दिन) सिँचाइ गर्नुहोस्। ड्रिप सिँचाइले ४०-६०% पानी बचाउँछ। बिहान ५-८ बजे सिँचाइ गर्नुहोस्।';
      }
      if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('subsidy')) {
        return 'किसानहरूका लागि मुख्य सरकारी योजनाहरू: १) PM-KISAN: ₹६,०००/वर्ष। २) PMFBY: बाली बीमा। ३) किसान क्रेडिट कार्ड: ४% ब्याजमा ₹३ लाखसम्म ऋण। ४) PM कृषि सिँचाइ योजना: ड्रिप/स्प्रिंकलरमा ५५-९०% अनुदान।';
      }
      return `तपाईंले "${query}" बारे सोध्नुभयो। म मद्दत गर्न सक्छु: सिँचाइ, मल, कीट नियन्त्रण, मौसम, सरकारी योजनाहरू। कृपया थप विशिष्ट प्रश्न सोध्नुहोस्।`;
    }

    return text; // English fallback
  };

  if (bestMatch.score > 0) return translateToLang(bestMatch.answer, langCode);
  return translateToLang(`I understand you're asking about "${query}". For accurate farming advice, I can help with: irrigation schedules, fertilizer doses, pest control, disease identification, harvest timing, soil health, seed selection, weather planning, government schemes, and profit calculation. Please ask a more specific question like "When should I irrigate wheat?" or "What fertilizer for rice?" for detailed guidance.`, langCode);
};

interface Message { role: 'user' | 'assistant'; text: string; timestamp: Date; }

const VoiceAssistant = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'नमस्ते! मैं आपका AI कृषि सहायक हूं। आप मुझसे सिंचाई, खाद, कीट नियंत्रण, मौसम, फसल कटाई, मिट्टी स्वास्थ्य, बीज चयन, सरकारी योजनाओं के बारे में पूछ सकते हैं।', timestamp: new Date() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Stop speech when user navigates away ──────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  // ── Stop speech when language changes ─────────────────────────────────
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [selectedLang]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast({ title: 'Not Supported', description: 'Voice recognition requires Chrome browser.', variant: 'destructive' }); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.continuous = false;
    recognition.interimResults = true;
    let finalTranscript = '';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      finalTranscript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(finalTranscript);
    };
    recognition.onend = () => { setIsListening(false); if (finalTranscript) handleSubmit(finalTranscript); };
    recognition.onerror = () => { setIsListening(false); toast({ title: 'Mic Error', description: 'Allow microphone permission in browser settings.', variant: 'destructive' }); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.85;

    // Try to find a voice matching the selected language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(selectedLang.code.split('-')[0]))
      || voices.find(v => v.lang === selectedLang.code)
      || voices.find(v => v.lang.startsWith('hi')) // Hindi fallback for Indian languages
      || null;
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);
    setTranscript(''); setTextInput('');
    setIsProcessing(true);
    setTimeout(() => {
      const response = getSmartResponse(text, selectedLang.code);
      setMessages(prev => [...prev, { role: 'assistant', text: response, timestamp: new Date() }]);
      setIsProcessing(false);
      speak(response);
    }, 700);
  };

  const quickQuestions = selectedLang.code.startsWith('hi')
    ? ['गेहूं में कब सिंचाई करें?', 'चावल के लिए खाद', 'कीट नियंत्रण', 'PM-KISAN योजना', 'मिट्टी pH सुधार', 'ड्रिप सिंचाई', 'जैविक खेती', 'फसल बीमा']
    : selectedLang.code.startsWith('pa')
    ? ['ਕਣਕ ਵਿੱਚ ਸਿੰਚਾਈ ਕਦੋਂ?', 'ਚਾਵਲ ਲਈ ਖਾਦ', 'ਕੀਟ ਨਿਯੰਤਰਣ', 'PM-KISAN ਯੋਜਨਾ', 'ਮਿੱਟੀ pH', 'ਡ੍ਰਿੱਪ ਸਿੰਚਾਈ', 'ਜੈਵਿਕ ਖੇਤੀ', 'ਫਸਲ ਬੀਮਾ']
    : selectedLang.code.startsWith('ne')
    ? ['गहुँमा सिँचाइ कहिले?', 'धानको लागि मल', 'कीट नियन्त्रण', 'PM-KISAN योजना', 'माटो pH', 'ड्रिप सिँचाइ', 'जैविक खेती', 'बाली बीमा']
    : ['When to irrigate wheat?', 'Fertilizer for rice', 'Pest control tips', 'Wheat harvest time', 'Soil pH correction', 'PM-KISAN scheme', 'Drip irrigation cost', 'Organic farming'];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
              <Mic className="h-4 w-4" /><span>Voice AI Assistant</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farming Voice Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300">Ask farming questions by voice or text in Hindi, Nepali, Punjabi, or English.</p>
          </div>

          <div className="flex gap-2 justify-center mb-6 flex-wrap">
            {languages.map(lang => (
              <button key={lang.code} onClick={() => setSelectedLang(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedLang.code === lang.code ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
                <span>{lang.flag}</span> {lang.label} <span className="text-xs opacity-70">({lang.name})</span>
              </button>
            ))}
          </div>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Conversation
                <Badge variant="outline" className="ml-auto">{selectedLang.flag} {selectedLang.label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'}`}>
                      {msg.text}
                      <div className="text-xs mt-1 opacity-60">{msg.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                {isProcessing && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2"><Loader2 className="h-4 w-4 animate-spin" /></div></div>}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          <div className="glass-card rounded-xl p-4 space-y-3">
            {transcript && <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm text-blue-800 dark:text-blue-300"><span className="font-medium">Hearing: </span>{transcript}</div>}
            <div className="flex gap-2">
              <Input value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type your farming question..." onKeyDown={e => e.key === 'Enter' && handleSubmit(textInput)} className="flex-1" />
              <Button onClick={() => handleSubmit(textInput)} disabled={!textInput.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-3"><Send className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={isListening ? stopListening : startListening}
                className={`flex-1 h-12 font-semibold rounded-xl ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                {isListening ? <><MicOff className="h-5 w-5 mr-2" /> Stop</> : <><Mic className="h-5 w-5 mr-2" /> Speak</>}
              </Button>
              {isSpeaking && <Button variant="outline" onClick={() => window.speechSynthesis.cancel()} className="h-12 px-4"><Volume2 className="h-5 w-5 text-blue-500 animate-pulse" /></Button>}
            </div>
            <p className="text-xs text-center text-gray-500"><Globe className="h-3 w-3 inline mr-1" />Speaking in {selectedLang.label} — Chrome browser recommended for voice</p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map(q => (
                <button key={q} onClick={() => handleSubmit(q)} className="text-xs px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">{q}</button>
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
