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

const aiKnowledge: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['pest','keet','insect','aphid','whitefly','bollworm','locust','spray'], answer: '🤖 AI: For pest control, use IPM (Integrated Pest Management). Neem oil (5 ml/L water) controls 200+ soft-bodied insects organically. For bollworm in cotton: use Coragen 18.5 SC at 60 ml/acre. For aphids: spray Imidacloprid 17.8 SL at 100 ml/acre. Always spray in early morning or evening. Scout 20 plants/acre weekly to monitor pest levels before spraying.' },
  { keywords: ['water','paani','irrigat','sinchai','moisture','drip','sprinkler'], answer: '🤖 AI: Irrigation schedule by crop — Wheat: irrigate at 21, 45, 65, 85, 105 days after sowing. Rice: maintain 2–5 cm standing water. Vegetables: every 3–5 days in summer. Drip irrigation saves 40–60% water and increases yield by 20–50%. Irrigate in early morning (5–8 AM) to reduce evaporation by 30%. Avoid irrigation before rain — check 5-day forecast first.' },
  { keywords: ['fertilizer','khad','urea','npk','dap','nitrogen','potash','nutrient'], answer: '🤖 AI: Fertilizer guide — Wheat: DAP 50 kg/acre at sowing + Urea 25 kg/acre at tillering and jointing. Rice: DAP 50 kg + MOP 20 kg at transplanting + Urea 30 kg at tillering. Cotton: NPK 12:32:16 at sowing. Always do soil testing first. Split nitrogen application (2–3 doses) improves efficiency by 20–30% vs single application. Zinc deficiency is common — apply Zinc Sulfate 5 kg/acre.' },
  { keywords: ['disease','bimari','fungus','blight','rust','mildew','wilt','rot','blast'], answer: '🤖 AI: Disease management — Wheat Rust: spray Propiconazole 25 EC at 200 ml/acre. Rice Blast: apply Tricyclazole 75 WP at 120 g/acre. Late Blight (potato/tomato): Mancozeb 75 WP at 600 g/acre every 7 days. Powdery Mildew: Sulfur 80 WP at 500 g/acre. Use our Disease Scanner to upload a photo for accurate AI diagnosis. Early detection saves 30–50% of crop losses.' },
  { keywords: ['price','msp','market','mandi','sell','bhav','rate','income'], answer: '🤖 AI: MSP 2024-25 — Wheat ₹2,275/quintal, Rice ₹2,300/quintal, Cotton ₹7,121/quintal (long staple), Soybean ₹4,892/quintal, Mustard ₹5,650/quintal. Register on eNAM (enam.gov.in) for online mandi trading and better price discovery. Join a Farmer Producer Organization (FPO) for collective bargaining. Value addition (processing) can give 2–3x higher returns.' },
  { keywords: ['scheme','subsidy','government','yojana','loan','insurance','kisan','pm-kisan'], answer: '🤖 AI: Key schemes — PM-KISAN: ₹6,000/year (register at pmkisan.gov.in). PMFBY: crop insurance at 1.5–5% premium. Kisan Credit Card: loans up to ₹3 lakh at 4% interest. PM Krishi Sinchai Yojana: 55–90% subsidy on drip irrigation. Soil Health Card: free soil testing. PKVY: ₹50,000/hectare for organic farming. Visit our Government Schemes page for complete eligibility details.' },
  { keywords: ['soil','mitti','ph','loam','clay','sandy','organic','compost','health'], answer: '🤖 AI: Soil health tips — Test pH every 2 years (ideal: 6.0–7.0). Add lime to increase pH, sulfur to decrease it. Sandy soil: add 10 tons FYM/acre for water retention. Clay soil: add sand + organic matter for drainage. Vermicompost (2–3 tons/acre) improves structure and provides slow-release nutrients. Get free Soil Health Card from government — apply at nearest KVK or online at soilhealth.dac.gov.in.' },
  { keywords: ['seed','beej','variety','hybrid','certified','germination','sow','plant'], answer: '🤖 AI: Seed selection — Always buy BIS-certified seeds. Hybrid seeds give 20–30% higher yield. Seed treatment: soak in Thiram 75 WP (2.5 g/kg) before sowing. Germination test: 7/10 seeds should sprout in 5 days. Recommended varieties: Wheat HD-2967/HD-3086, Rice Pusa Basmati 1121, Cotton Bollgard II, Tomato Hybrid Red King. Use our Seed Guide for complete variety information.' },
  { keywords: ['harvest','katai','reap','yield','fasal','crop ready','mature'], answer: '🤖 AI: Harvest timing — Wheat: when grain moisture is 14–18% and straw turns golden. Rice: when 80–85% grains turn golden. Cotton: pick bolls when fully open and white. Tomato: at breaker stage (25% red) for transport, fully red for local market. Potato: 10–15 days after vine death. Sugarcane: at 10–12 months when Brix value is 18–20%. Delayed harvest causes 5–15% yield loss.' },
  { keywords: ['weather','mausam','rain','temperature','forecast','barish','drought','frost'], answer: '🤖 AI: Weather-based advice — Check 5-day forecast before irrigation and spraying. Do not spray on windy days (>15 km/h). Frost protection: cover seedlings when temp drops below 4°C. Heat stress: irrigate in evening when temp exceeds 40°C. Drought: use mulching to retain moisture, switch to drought-tolerant varieties. Use our Weather page for hyperlocal forecasts with crop-specific advisories for your city.' },
  { keywords: ['organic','jaivik','natural','bio','vermi','neem','compost'], answer: '🤖 AI: Organic farming — Vermicompost: 2–3 tons/acre improves soil and provides NPK. Jeevamrit: mix 10 kg cow dung + 10 L cow urine + 2 kg jaggery + 2 kg gram flour in 200 L water, ferment 48 hours, apply 200 L/acre. Neem cake: 200 kg/acre controls soil pests. Green manure: grow Dhaincha and incorporate before flowering — adds 60–80 kg N/acre. PKVY scheme gives ₹50,000/hectare for organic certification.' },
];

const getAIResponse = (text: string): string => {
  const lower = text.toLowerCase();
  let best = { score: 0, answer: '' };
  for (const entry of aiKnowledge) {
    const score = entry.keywords.filter(kw => lower.includes(kw)).length;
    if (score > best.score) best = { score, answer: entry.answer };
  }
  if (best.score > 0) return best.answer;
  return `🤖 AI Moderator: You asked about "${text}". I can provide detailed advice on: fertilizers, irrigation, pest control, diseases, market prices, government schemes, soil health, seed selection, harvest timing, weather planning, and organic farming. Please ask a specific question for accurate guidance!`;
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
