import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/home/FeaturesSection';
import DashboardPreviewSection from '@/components/home/DashboardPreviewSection';
import AdditionalFeaturesSection from '@/components/home/AdditionalFeaturesSection';
import CTASection from '@/components/home/CTASection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';

const marqueeItems = [
  '🌾 Wheat MSP 2024-25: ₹2,275/quintal',
  '🌧️ Monsoon forecast: Normal rainfall expected this Kharif season',
  '🐛 Alert: Fall Armyworm risk high in Madhya Pradesh — scout maize fields',
  '💰 PM-KISAN: Next installment releasing soon — check pmkisan.gov.in',
  '🌡️ Heat wave warning: Rajasthan, UP — irrigate crops in evening',
  '🌱 Rabi sowing season begins October — prepare soil now',
  '📢 PMFBY enrollment open — insure your Kharif crops before deadline',
  '🚜 Kisan Credit Card: Apply for crop loan at 4% interest at nearest bank',
  '🌿 Organic farming subsidy: ₹50,000/hectare under PKVY scheme',
  '📊 Rice MSP 2024-25: ₹2,300/quintal — sell at eNAM for best price',
];

const chatKB: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['irrigat','water','paani','sinchai'], answer: 'Irrigation guide: Wheat — irrigate at 21, 45, 65, 85, 105 days after sowing. Rice — maintain 2–5 cm standing water. Vegetables — every 3–5 days in summer. Use drip irrigation to save 40–60% water. Irrigate in early morning (5–8 AM) to reduce evaporation.' },
  { keywords: ['fertilizer','khad','urea','npk','dap'], answer: 'Fertilizer guide: Wheat — DAP 50 kg/acre at sowing + Urea 25 kg/acre at tillering. Rice — DAP 50 kg + MOP 20 kg at transplanting. Always do soil testing first. Split nitrogen application improves efficiency by 20–30%.' },
  { keywords: ['pest','keet','insect','aphid','spray'], answer: 'Pest control: Use IPM (Integrated Pest Management). Neem oil (5 ml/L) controls 200+ insects organically. For bollworm: Coragen 18.5 SC at 60 ml/acre. Scout 20 plants/acre weekly. Spray in early morning or evening.' },
  { keywords: ['disease','bimari','blight','rust','mildew'], answer: 'Disease management: Wheat Rust — Propiconazole 25 EC at 200 ml/acre. Rice Blast — Tricyclazole 75 WP at 120 g/acre. Late Blight — Mancozeb 75 WP at 600 g/acre every 7 days. Use our Disease Scanner for photo-based diagnosis.' },
  { keywords: ['msp','price','market','mandi','sell'], answer: 'MSP 2024-25: Wheat ₹2,275/quintal, Rice ₹2,300/quintal, Cotton ₹7,121/quintal, Soybean ₹4,892/quintal. Register on eNAM (enam.gov.in) for online mandi trading and better price discovery.' },
  { keywords: ['scheme','subsidy','government','yojana','kisan'], answer: 'Key schemes: PM-KISAN ₹6,000/year, PMFBY crop insurance, Kisan Credit Card at 4% interest, PM Krishi Sinchai Yojana (55–90% drip irrigation subsidy), Soil Health Card (free). Visit our Government Schemes page for details.' },
  { keywords: ['soil','mitti','ph','compost','organic'], answer: 'Soil health: Test pH every 2 years (ideal 6.0–7.0). Add lime to increase pH, sulfur to decrease. Vermicompost (2–3 tons/acre) improves structure. Get free Soil Health Card from government at soilhealth.dac.gov.in.' },
  { keywords: ['seed','beej','variety','hybrid'], answer: 'Seed selection: Buy BIS-certified seeds. Hybrid seeds give 20–30% higher yield. Treat seeds with Thiram 75 WP (2.5 g/kg) before sowing. Recommended: Wheat HD-2967, Rice Pusa Basmati 1121, Cotton Bollgard II.' },
  { keywords: ['harvest','katai','yield','fasal'], answer: 'Harvest timing: Wheat — grain moisture 14–18%, straw golden. Rice — 80–85% grains golden. Cotton — bolls fully open and white. Tomato — breaker stage for transport. Delayed harvest causes 5–15% yield loss.' },
  { keywords: ['weather','mausam','rain','forecast'], answer: 'Weather advice: Check 5-day forecast before irrigation and spraying. Do not spray on windy days (>15 km/h). Frost protection: cover seedlings below 4°C. Use our Weather page for hyperlocal forecasts with crop advisories.' },
  { keywords: ['profit','income','roi','loss'], answer: 'Profit tips: Use our Profit Prediction tool to calculate expected yield and profit before sowing. Track all expenses in Expense Tracker. Join FPO for better market prices. Value addition (processing) gives 2–3x higher returns.' },
];

const getChatResponse = (q: string): string => {
  const lower = q.toLowerCase();
  let best = { score: 0, answer: '' };
  for (const e of chatKB) {
    const score = e.keywords.filter(k => lower.includes(k)).length;
    if (score > best.score) best = { score, answer: e.answer };
  }
  if (best.score > 0) return best.answer;
  return `I can help with: irrigation, fertilizers, pest control, diseases, market prices, government schemes, soil health, seed selection, harvest timing, and weather planning. Please ask a specific farming question for detailed guidance!`;
};

interface ChatMsg { role: 'user' | 'bot'; text: string; }

const weatherData = { location: 'Agriville', date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), temperature: 24, weatherType: 'sunny' as const, humidity: 45, windSpeed: 8, precipitation: 0 };
const mockSeedData = { id: 'seed-1', name: 'Premium Hybrid Corn', image: 'https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?w=800&q=80', season: 'Summer', soilType: ['Loamy', 'Sandy Loam'], waterNeeds: 'Medium' as const, growthPeriod: '90-120 days', idealTemp: '20-30°C', yieldEstimate: '8-10 tons/hectare', description: 'A high-yielding corn hybrid suitable for various soil types with excellent drought resistance and disease tolerance.', matchScore: 92 };
const sensorData = { id: 'sensor-1', name: 'Soil Moisture', location: 'Field A, North', type: 'moisture' as const, value: 37, unit: '%', timestamp: new Date().toISOString(), batteryLevel: 84, signalStrength: 92, status: 'normal' as const };

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: 'Hello! I am your AgriAssist AI chatbot. Ask me anything about farming — irrigation, fertilizers, pests, diseases, market prices, or government schemes!' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', text: getChatResponse(userMsg) }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Agriculture News Marquee */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-700 text-white text-xs py-1 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 shrink-0">{item}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>

      <div className="pt-6">
        <Hero />
        <FeaturesSection />
        <DashboardPreviewSection weatherData={weatherData} sensorData={sensorData} seedData={mockSeedData} />
        <AdditionalFeaturesSection />
        <CTASection />
        <Footer />
      </div>

      {/* Floating AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden" style={{ height: '420px' }}>
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <p className="font-semibold text-sm">AgriAssist AI</p>
                  <p className="text-xs opacity-80">Agriculture Expert</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex justify-start"><div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-3 py-2"><Loader2 className="h-3 w-3 animate-spin" /></div></div>}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about farming..." className="flex-1 text-xs h-8" onKeyDown={e => e.key === 'Enter' && sendChat()} />
              <Button onClick={sendChat} size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"><Send className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110">
          {chatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

export default Index;
