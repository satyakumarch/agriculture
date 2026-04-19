import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Brain, Droplets, Sprout, Users, AlertTriangle, CheckCircle,
  TrendingUp, Thermometer, Ruler, Calendar, Bug,
  IndianRupee, Leaf, FlaskConical, Tractor,
  ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const crops = ['Wheat','Rice','Corn','Cotton','Sugarcane','Tomato','Potato','Soybean','Mustard','Groundnut','Onion','Chickpea'];
const soilTypes = ['Loamy','Sandy','Clay','Silty','Peaty','Chalky','Black Cotton','Red Laterite'];
const cropStages = ['Seedling','Vegetative','Flowering','Fruiting','Harvesting'];
const seasons = ['Kharif (Monsoon)','Rabi (Winter)','Zaid (Summer)'];
const irrigationSources = ['Canal','Borewell','Rainwater','Drip System','Sprinkler','River/Pond'];
const states = ['Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Maharashtra','Rajasthan','Gujarat','Bihar','West Bengal','Karnataka','Andhra Pradesh','Tamil Nadu','Other'];

const cropDB: Record<string, {
  idealTemp: string; idealMoisture: string; seedRate: string; spacing: string;
  npk: string; waterReq: string; growthDays: string; msp: string;
  yieldPerAcre: string; commonPests: string[]; diseases: string[];
  intercrop: string; harvestSign: string;
}> = {
  Wheat:     { idealTemp:'15–25°C', idealMoisture:'40–60%', seedRate:'100 kg/acre', spacing:'20 cm rows', npk:'120:60:40 kg/ha', waterReq:'4–6 irrigations', growthDays:'120–130 days', msp:'₹2,275/quintal', yieldPerAcre:'18–22 quintals', commonPests:['Aphids','Brown Wheat Mite','Termite'], diseases:['Yellow Rust','Loose Smut','Powdery Mildew'], intercrop:'Mustard', harvestSign:'Golden straw, grain moisture 14–18%' },
  Rice:      { idealTemp:'20–35°C', idealMoisture:'70–80%', seedRate:'40 kg/acre', spacing:'20×15 cm', npk:'120:60:60 kg/ha', waterReq:'Continuous flooding 2–5 cm', growthDays:'140–145 days', msp:'₹2,300/quintal', yieldPerAcre:'15–18 quintals', commonPests:['Stem Borer','Brown Planthopper','Leaf Folder'], diseases:['Blast','Sheath Blight','Bacterial Leaf Blight'], intercrop:'Azolla (green manure)', harvestSign:'80–85% grains golden, panicles bent' },
  Corn:      { idealTemp:'20–30°C', idealMoisture:'50–70%', seedRate:'25 kg/acre', spacing:'75×20 cm', npk:'150:75:75 kg/ha', waterReq:'5–6 irrigations', growthDays:'95–105 days', msp:'₹1,962/quintal', yieldPerAcre:'25–30 quintals', commonPests:['Fall Armyworm','Stem Borer','Aphids'], diseases:['Turcicum Blight','Downy Mildew','Smut'], intercrop:'Soybean', harvestSign:'Husk turns brown, kernels dent' },
  Cotton:    { idealTemp:'25–35°C', idealMoisture:'40–60%', seedRate:'5 kg/acre', spacing:'90×60 cm', npk:'120:60:60 kg/ha', waterReq:'6–8 irrigations', growthDays:'180–200 days', msp:'₹7,121/quintal', yieldPerAcre:'8–12 quintals', commonPests:['Bollworm','Whitefly','Jassid'], diseases:['Leaf Curl Virus','Fusarium Wilt','Alternaria Blight'], intercrop:'Groundnut', harvestSign:'Bolls fully open, white fluffy fibre' },
  Sugarcane: { idealTemp:'25–35°C', idealMoisture:'60–75%', seedRate:'8,000 kg/acre (sets)', spacing:'90 cm rows', npk:'250:100:120 kg/ha', waterReq:'Every 10–15 days', growthDays:'300–360 days', msp:'₹315/quintal (FRP)', yieldPerAcre:'300–400 quintals', commonPests:['Early Shoot Borer','Pyrilla','Termite'], diseases:['Red Rot','Smut','Grassy Shoot'], intercrop:'Onion/Garlic between rows', harvestSign:'Brix 18–20%, stalk turns yellow-green' },
  Tomato:    { idealTemp:'20–30°C', idealMoisture:'60–70%', seedRate:'0.5 kg/acre', spacing:'60×45 cm', npk:'120:80:80 kg/ha', waterReq:'Every 3–5 days', growthDays:'70–80 days', msp:'Market ₹800–2,000/quintal', yieldPerAcre:'25–30 tons', commonPests:['Fruit Borer','Whitefly','Thrips'], diseases:['Early Blight','Late Blight','Leaf Curl Virus'], intercrop:'Basil (repels pests)', harvestSign:'Fruits turn red/pink, firm texture' },
  Potato:    { idealTemp:'15–25°C', idealMoisture:'60–70%', seedRate:'1,500 kg/acre', spacing:'60×25 cm', npk:'180:80:100 kg/ha', waterReq:'Every 7–10 days', growthDays:'90–110 days', msp:'Market ₹600–1,200/quintal', yieldPerAcre:'15–20 tons', commonPests:['Aphids','Cutworm','Tuber Moth'], diseases:['Late Blight','Early Blight','Black Scurf'], intercrop:'Mustard border crop', harvestSign:'Foliage turns yellow, skin sets firm' },
  Soybean:   { idealTemp:'20–30°C', idealMoisture:'50–65%', seedRate:'80 kg/acre', spacing:'30×5 cm', npk:'30:60:40 kg/ha', waterReq:'4–5 irrigations', growthDays:'95–100 days', msp:'₹4,892/quintal', yieldPerAcre:'10–14 quintals', commonPests:['Girdle Beetle','Pod Borer','Stem Fly'], diseases:['Yellow Mosaic','Bacterial Pustule','Charcoal Rot'], intercrop:'Maize', harvestSign:'Leaves turn yellow, pods rattle' },
  Mustard:   { idealTemp:'10–25°C', idealMoisture:'35–50%', seedRate:'5 kg/acre', spacing:'30×10 cm', npk:'80:40:40 kg/ha', waterReq:'2–3 irrigations', growthDays:'110–120 days', msp:'₹5,650/quintal', yieldPerAcre:'6–8 quintals', commonPests:['Aphids','Painted Bug','Sawfly'], diseases:['White Rust','Alternaria Blight','Downy Mildew'], intercrop:'Wheat', harvestSign:'75% pods turn yellow-brown' },
  Groundnut: { idealTemp:'25–35°C', idealMoisture:'50–65%', seedRate:'80 kg/acre', spacing:'30×10 cm', npk:'20:60:40 kg/ha', waterReq:'Every 10–12 days', growthDays:'120–130 days', msp:'₹6,377/quintal', yieldPerAcre:'8–12 quintals', commonPests:['Leaf Miner','Thrips','White Grub'], diseases:['Tikka Leaf Spot','Stem Rot','Bud Necrosis'], intercrop:'Castor border crop', harvestSign:'Leaves turn yellow, pods with dark veins' },
  Onion:     { idealTemp:'13–24°C', idealMoisture:'50–65%', seedRate:'8–10 kg/acre', spacing:'15×10 cm', npk:'100:50:50 kg/ha', waterReq:'Every 7–10 days', growthDays:'120–130 days', msp:'Market ₹800–2,500/quintal', yieldPerAcre:'12–18 tons', commonPests:['Thrips','Onion Fly','Mites'], diseases:['Purple Blotch','Stemphylium Blight','Downy Mildew'], intercrop:'Carrot', harvestSign:'Tops fall over, neck becomes soft' },
  Chickpea:  { idealTemp:'15–25°C', idealMoisture:'35–50%', seedRate:'60–70 kg/acre', spacing:'30×10 cm', npk:'20:60:20 kg/ha', waterReq:'1–2 irrigations only', growthDays:'90–110 days', msp:'₹5,440/quintal', yieldPerAcre:'6–10 quintals', commonPests:['Pod Borer','Cutworm','Aphids'], diseases:['Wilt','Blight','Dry Root Rot'], intercrop:'Wheat or Mustard', harvestSign:'Pods turn brown, leaves dry' },
};

const getFertilizerSchedule = (crop: string, stage: string) => {
  const schedules = [
    { time: 'At Sowing (Basal)', fertilizer: 'DAP + MOP', dose: '50 kg DAP + 25 kg MOP/acre', method: 'Mix in soil before sowing' },
    { time: '20–25 Days After Sowing', fertilizer: 'Urea (1st top-dress)', dose: '25 kg/acre', method: 'Broadcast in moist soil' },
    { time: '45–50 Days After Sowing', fertilizer: 'Urea (2nd top-dress)', dose: '25 kg/acre', method: 'Side-dress near root zone' },
  ];
  if (stage === 'Flowering' || stage === 'Fruiting') {
    schedules.push({ time: 'Flowering Stage', fertilizer: '00-52-34 (MKP) foliar spray', dose: '5 g/litre water', method: 'Foliar spray in morning' });
  }
  if (stage === 'Vegetative') {
    schedules.push({ time: 'Vegetative Stage', fertilizer: 'Zinc Sulphate', dose: '10 kg/acre', method: 'Soil application or foliar 0.5%' });
  }
  return schedules;
};

const getIrrigationPlan = (crop: string, moisture: number, temp: number, source: string) => {
  const db = cropDB[crop];
  const urgent = moisture < 30;
  const needed = moisture < 50;
  return {
    status: urgent ? 'Critical — Irrigate Now' : needed ? 'Needed Soon' : 'Adequate',
    statusColor: urgent ? 'text-red-600' : needed ? 'text-yellow-600' : 'text-green-600',
    bgColor: urgent ? 'bg-red-50 dark:bg-red-900/20 border-red-200' : needed ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200' : 'bg-green-50 dark:bg-green-900/20 border-green-200',
    waterReq: db?.waterReq ?? 'As needed',
    nextIrrigation: urgent ? 'Today' : needed ? 'Within 2–3 days' : 'In 5–7 days',
    amount: temp > 35 ? '50–60 mm (extra due to heat)' : '40–50 mm per irrigation',
    bestTime: 'Early morning (5–8 AM) or evening (5–7 PM)',
    sourceTip: source === 'Drip System' ? 'Excellent! Drip saves 40–60% water vs flood irrigation.' : source === 'Sprinkler' ? 'Good coverage. Avoid spraying during peak heat hours.' : source ? `Using ${source} — schedule irrigation based on crop stage.` : 'Consider drip irrigation for water efficiency.',
    tip: urgent ? 'Immediate irrigation critical — yield loss risk if delayed beyond 24 hours.' : needed ? 'Plan irrigation within 2–3 days. Check soil at 6-inch depth.' : 'Soil moisture adequate. Monitor daily with finger test.',
  };
};

const getPestRisk = (crop: string, temp: number, moisture: number) => {
  const db = cropDB[crop];
  if (!db) return [];
  return db.commonPests.map((pest) => {
    const highRisk = temp > 30 && moisture > 60;
    const medRisk = temp > 25 || moisture > 50;
    const risk = highRisk ? 'High' : medRisk ? 'Medium' : 'Low';
    const level = highRisk ? 80 : medRisk ? 50 : 25;
    return {
      pest, risk, level,
      riskColor: risk === 'High' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : risk === 'Medium' ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 'text-green-600 bg-green-50 dark:bg-green-900/20',
      barColor: risk === 'High' ? 'bg-red-500' : risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500',
    };
  });
};

const getWeeklyPlan = (crop: string, stage: string, moisture: number, temp: number) => {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  return [
    { day: days[0], task: `Inspect ${crop} field for pest/disease symptoms`, icon: '🔍', priority: 'medium' as const },
    { day: days[1], task: moisture < 40 ? `Irrigate ${crop} — soil moisture critically low` : `Check soil moisture at 6-inch depth`, icon: '💧', priority: (moisture < 40 ? 'high' : 'low') as 'high'|'low' },
    { day: days[2], task: stage === 'Vegetative' ? `Apply urea top-dressing to ${crop}` : `Weed control — manual or herbicide spray`, icon: '🌿', priority: 'medium' as const },
    { day: days[3], task: `Scout for ${cropDB[crop]?.commonPests[0] ?? 'pests'} — check 20 plants/acre`, icon: '🐛', priority: 'medium' as const },
    { day: days[4], task: temp > 35 ? `Heat stress: mulch field & irrigate in evening` : `Apply foliar micronutrient spray`, icon: '🌡️', priority: (temp > 35 ? 'high' : 'low') as 'high'|'low' },
    { day: days[5], task: `Record farm observations — pest count, crop height, soil notes`, icon: '📝', priority: 'low' as const },
    { day: days[6], task: `Review week & plan next 7 days — check weather forecast`, icon: '📅', priority: 'low' as const },
  ];
};

const getProfitEstimate = (crop: string, area: number) => {
  const db = cropDB[crop];
  if (!db) return null;
  const yieldStr = db.yieldPerAcre.replace(/[^0-9–\-]/g, '');
  const parts = yieldStr.split(/[–\-]/);
  const yieldNum = parseFloat(parts[parts.length - 1]) || 20;
  const mspNum = parseFloat(db.msp.replace(/[^0-9]/g, '').slice(0, 6)) || 2000;
  const totalYield = yieldNum * area;
  const revenue = totalYield * mspNum;
  const inputCost = area * 15000;
  const profit = revenue - inputCost;
  return {
    totalYield: `${totalYield.toFixed(0)} quintals`,
    revenue: `₹${revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    inputCost: `₹${inputCost.toLocaleString('en-IN')}`,
    profit: `₹${Math.abs(profit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}${profit < 0 ? ' (Loss)' : ''}`,
    profitColor: profit > 0 ? 'text-green-600' : 'text-red-600',
    msp: db.msp,
    roi: `${((profit / inputCost) * 100).toFixed(0)}%`,
    isProfit: profit > 0,
  };
};

const priorityBg = {
  high:   'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
  low:    'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20',
};
const priorityColor = { high: 'destructive', medium: 'default', low: 'secondary' } as const;

const AIDecisionEngine = () => {
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('');
  const [stage, setCropStage] = useState('');
  const [season, setSeason] = useState('');
  const [temperature, setTemperature] = useState(28);
  const [moisture, setMoisture] = useState(45);
  const [area, setArea] = useState('1');
  const [location, setLocation] = useState('');
  const [irrigation, setIrrigation] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('overview');
  const { toast } = useToast();

  const db = cropDB[crop];
  const fertSchedule = analyzed ? getFertilizerSchedule(crop, stage) : [];
  const irrigPlan    = analyzed ? getIrrigationPlan(crop, moisture, temperature, irrigation) : null;
  const pestRisks    = analyzed ? getPestRisk(crop, temperature, moisture) : [];
  const weeklyPlan   = analyzed ? getWeeklyPlan(crop, stage, moisture, temperature) : [];
  const profit       = analyzed ? getProfitEstimate(crop, parseFloat(area) || 1) : null;

  const handleAnalyze = () => {
    if (!crop || !soil || !stage || !season) {
      toast({ title: 'Missing fields', description: 'Please fill Crop, Soil, Stage and Season.', variant: 'destructive' });
      return;
    }
    setAnalyzed(true);
    setOpenSection('overview');
    toast({ title: '✅ Farm Report Ready', description: `Full analysis generated for ${crop}.` });
    setTimeout(() => document.getElementById('report-top')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  const toggle = (s: string) => setOpenSection(prev => prev === s ? null : s);

  const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => toggle(id)}
      >
        <span className="flex items-center gap-2 font-semibold text-base">{icon}{title}</span>
        {openSection === id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {openSection === id && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">{children}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">
              <Brain className="h-4 w-4" /><span>AI-Powered Intelligence</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">AI Farm Decision Engine</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Fill in your farm details and get a complete farm report — irrigation plan, fertilizer schedule, pest risk, profit estimate, weekly action plan and more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Input Form ── */}
            <Card className="lg:col-span-1 h-fit lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" /> Farm Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Crop Type *</label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>{crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Soil Type *</label>
                  <Select value={soil} onValueChange={setSoil}>
                    <SelectTrigger><SelectValue placeholder="Select soil" /></SelectTrigger>
                    <SelectContent>{soilTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Crop Stage *</label>
                  <Select value={stage} onValueChange={setCropStage}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>{cropStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Season *</label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                    <SelectContent>{seasons.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Irrigation Source</label>
                  <Select value={irrigation} onValueChange={setIrrigation}>
                    <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>{irrigationSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State / Region</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" /> Farm Area (acres)
                  </label>
                  <Input type="number" min="0.1" step="0.5" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 2.5" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5" /> Temperature: {temperature}°C
                  </label>
                  <input type="range" min={10} max={50} value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-purple-500" />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>10°C</span><span>50°C</span></div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5" /> Soil Moisture: {moisture}%
                  </label>
                  <input type="range" min={0} max={100} value={moisture} onChange={e => setMoisture(Number(e.target.value))} className="w-full accent-blue-500" />
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>0%</span><span>100%</span></div>
                </div>
                <Button onClick={handleAnalyze} className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">
                  <Brain className="h-4 w-4 mr-2" /> Generate Full Farm Report
                </Button>
              </CardContent>
            </Card>

            {/* ── Report Output ── */}
            <div className="lg:col-span-2 space-y-4" id="report-top">
              {!analyzed ? (
                <div className="flex flex-col items-center justify-center min-h-[420px] glass-card rounded-2xl p-10 text-center">
                  <Brain className="h-20 w-20 text-purple-200 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500 max-w-sm mb-6">Fill in your farm conditions and click "Generate Full Farm Report" to get detailed AI-powered insights.</p>
                  <div className="grid grid-cols-2 gap-3 text-sm text-left w-full max-w-sm">
                    {['Crop Overview & Key Facts','Irrigation Plan','Fertilizer Schedule','Pest & Disease Risk','7-Day Action Plan','Profit & Revenue Estimate','Government Schemes'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary bar */}
                  <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-purple-50 to-green-50 dark:from-purple-950/30 dark:to-green-950/30">
                    <div className="flex flex-wrap items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg">{crop} — Full Farm Report</p>
                        <p className="text-xs text-gray-500 truncate">{soil} soil · {stage} stage · {season} · {temperature}°C · {moisture}% moisture{area ? ` · ${area} acres` : ''}{location ? ` · ${location}` : ''}</p>
                      </div>
                      <Badge className="bg-purple-600 text-white shrink-0">AI Generated</Badge>
                    </div>
                  </div>

                  {/* 1. Crop Overview */}
                  <Section id="overview" title="Crop Overview & Key Facts" icon={<Leaf className="h-5 w-5 text-green-600" />}>
                    {db ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Ideal Temperature', value: db.idealTemp,      icon: '🌡️' },
                          { label: 'Ideal Moisture',    value: db.idealMoisture,  icon: '💧' },
                          { label: 'Seed Rate',         value: db.seedRate,       icon: '🌱' },
                          { label: 'Row Spacing',       value: db.spacing,        icon: '📏' },
                          { label: 'Growth Duration',   value: db.growthDays,     icon: '📅' },
                          { label: 'Water Requirement', value: db.waterReq,       icon: '🚿' },
                          { label: 'NPK Requirement',   value: db.npk,            icon: '⚗️' },
                          { label: 'Yield / Acre',      value: db.yieldPerAcre,   icon: '📦' },
                          { label: 'MSP / Market Price',value: db.msp,            icon: '💰' },
                          { label: 'Intercrop',         value: db.intercrop,      icon: '🌾' },
                          { label: 'Harvest Sign',      value: db.harvestSign,    icon: '✂️' },
                          { label: 'Your Soil',         value: soil,              icon: '🪨' },
                        ].map((item, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-0.5">{item.icon} {item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500 text-sm">No data available for this crop.</p>}
                  </Section>

                  {/* 2. Irrigation Plan */}
                  <Section id="irrigation" title="Irrigation Plan" icon={<Droplets className="h-5 w-5 text-blue-600" />}>
                    {irrigPlan && (
                      <div className="space-y-3">
                        <div className={`rounded-xl p-4 border ${irrigPlan.bgColor}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">Moisture Status</span>
                            <span className={`font-bold text-lg ${irrigPlan.statusColor}`}>{irrigPlan.status}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                            <div className={`h-3 rounded-full transition-all ${moisture < 30 ? 'bg-red-500' : moisture < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${moisture}%` }} />
                          </div>
                          <p className="text-sm">Current: <strong>{moisture}%</strong> · Optimal for {crop}: <strong>{db?.idealMoisture ?? '40–60%'}</strong></p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Next Irrigation',  value: irrigPlan.nextIrrigation, icon: '📅' },
                            { label: 'Water Amount',     value: irrigPlan.amount,         icon: '💧' },
                            { label: 'Best Time',        value: irrigPlan.bestTime,       icon: '⏰' },
                            { label: 'Crop Requirement', value: irrigPlan.waterReq,       icon: '🌾' },
                          ].map((item, i) => (
                            <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                              <p className="text-xs text-gray-500">{item.icon} {item.label}</p>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{item.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-sm text-green-800 dark:text-green-300">
                          💡 {irrigPlan.sourceTip}
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{irrigPlan.tip}</span>
                        </div>
                      </div>
                    )}
                  </Section>

                  {/* 3. Fertilizer Schedule */}
                  <Section id="fertilizer" title="Fertilizer Schedule" icon={<FlaskConical className="h-5 w-5 text-purple-600" />}>
                    <div className="space-y-3">
                      {fertSchedule.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                          <span className="bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <div>
                            <p className="text-xs text-gray-500">⏱ {f.time}</p>
                            <p className="font-semibold text-sm">{f.fertilizer}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Dose: {f.dose}</p>
                            <p className="text-xs text-gray-500">Method: {f.method}</p>
                          </div>
                        </div>
                      ))}
                      {db && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                          <p className="font-semibold text-sm mb-1">📊 Total NPK for {crop}: <span className="text-purple-600">{db.npk}</span></p>
                          <p className="text-xs text-gray-400">Adjust based on soil test. FYM 5 tons/acre reduces chemical fertilizer need by 20–25%.</p>
                        </div>
                      )}
                    </div>
                  </Section>

                  {/* 4. Pest & Disease Risk */}
                  <Section id="pest" title="Pest & Disease Risk Assessment" icon={<Bug className="h-5 w-5 text-red-600" />}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">🐛 Pest Risk (based on {temperature}°C, {moisture}% moisture)</p>
                        {pestRisks.map((p, i) => (
                          <div key={i} className="flex items-center gap-3 mb-2">
                            <span className="text-sm w-40 shrink-0">{p.pest}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div className={`h-2.5 rounded-full transition-all ${p.barColor}`} style={{ width: `${p.level}%` }} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-16 text-center ${p.riskColor}`}>{p.risk}</span>
                          </div>
                        ))}
                      </div>
                      {db && (
                        <div>
                          <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">🦠 Disease Watch List</p>
                          <div className="flex flex-wrap gap-2">
                            {db.diseases.map((d, i) => (
                              <span key={i} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full">{d}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300">
                        <p className="font-semibold mb-1">💡 Scouting Protocol</p>
                        Scout 20 plants/acre every week. Check leaf undersides. Use yellow sticky traps for whitefly/thrips. Record pest counts in farm diary. Spray only when pest crosses economic threshold.
                      </div>
                    </div>
                  </Section>

                  {/* 5. Weekly Action Plan */}
                  <Section id="weekly" title="7-Day Action Plan" icon={<Calendar className="h-5 w-5 text-orange-600" />}>
                    <div className="space-y-2">
                      {weeklyPlan.map((task, i) => (
                        <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${priorityBg[task.priority]}`}>
                          <span className="text-xl shrink-0">{task.icon}</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">{task.day}</p>
                            <p className="text-sm font-medium">{task.task}</p>
                          </div>
                          <Badge variant={priorityColor[task.priority]} className="text-xs shrink-0">{task.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* 6. Profit Estimate */}
                  <Section id="profit" title="Profit & Revenue Estimate" icon={<IndianRupee className="h-5 w-5 text-green-600" />}>
                    {profit ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: 'Expected Yield', value: profit.totalYield, color: 'text-blue-600',  bg: 'bg-blue-50 dark:bg-blue-900/20' },
                            { label: 'Gross Revenue',  value: profit.revenue,    color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                            { label: 'Input Cost',     value: profit.inputCost,  color: 'text-red-600',   bg: 'bg-red-50 dark:bg-red-900/20' },
                            { label: profit.isProfit ? 'Net Profit' : 'Net Loss', value: profit.profit, color: profit.profitColor, bg: 'bg-gray-50 dark:bg-gray-800' },
                          ].map((item, i) => (
                            <div key={i} className={`rounded-xl p-3 text-center ${item.bg}`}>
                              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
                            <p className="text-xs text-gray-500">MSP / Market Price</p>
                            <p className="font-semibold text-yellow-700 dark:text-yellow-300">{profit.msp}</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                            <p className="text-xs text-gray-500">Return on Investment</p>
                            <p className={`font-bold text-lg ${profit.profitColor}`}>{profit.roi}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">* Estimates based on standard yield and MSP/market price for {area} acre(s). Actual results vary by field conditions and market rates.</p>
                      </div>
                    ) : <p className="text-gray-500 text-sm">Enter farm area to calculate profit estimate.</p>}
                  </Section>

                  {/* 7. Government Schemes */}
                  <Section id="schemes" title="Relevant Government Schemes" icon={<ShieldCheck className="h-5 w-5 text-indigo-600" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { name: 'PM-KISAN',           desc: '₹6,000/year direct income support to all farmers',          link: 'pmkisan.gov.in' },
                        { name: 'PMFBY Crop Insurance',desc: `Covers ${crop} yield loss due to weather & pests`,          link: 'pmfby.gov.in' },
                        { name: 'Kisan Credit Card',   desc: 'Crop loan at 4% interest up to ₹3 lakh',                   link: 'nabard.org' },
                        { name: 'Soil Health Card',    desc: 'Free soil testing & fertilizer recommendation',             link: 'soilhealth.dac.gov.in' },
                        { name: 'PM Krishi Sinchai',   desc: '55–90% subsidy on drip/sprinkler irrigation',              link: 'pmksy.gov.in' },
                        { name: 'eNAM Portal',         desc: `Sell ${crop} online at best mandi price across India`,      link: 'enam.gov.in' },
                      ].map((s, i) => (
                        <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 hover:shadow-sm transition-shadow">
                          <p className="font-semibold text-sm text-indigo-800 dark:text-indigo-300">{s.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.desc}</p>
                          <p className="text-xs text-indigo-500 mt-1">🔗 {s.link}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIDecisionEngine;
