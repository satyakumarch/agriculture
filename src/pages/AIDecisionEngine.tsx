import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Droplets, Sprout, Users, AlertTriangle, CheckCircle, TrendingUp, Thermometer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const crops = ['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Soybean'];
const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty', 'Chalky'];
const cropStages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvesting'];
const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

interface Recommendation {
  category: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  timing: string;
}

const generateRecommendations = (crop: string, soil: string, stage: string, temp: number, moisture: number): Recommendation[] => {
  const recs: Recommendation[] = [];

  if (moisture < 30) {
    recs.push({
      category: 'Irrigation',
      icon: <Droplets className="h-5 w-5" />,
      priority: 'high',
      action: 'Irrigate immediately',
      reason: `Soil moisture at ${moisture}% — below critical threshold of 30% for ${crop}`,
      timing: 'Within 24 hours'
    });
  } else if (moisture < 50) {
    recs.push({
      category: 'Irrigation',
      icon: <Droplets className="h-5 w-5" />,
      priority: 'medium',
      action: 'Schedule irrigation in 2-3 days',
      reason: `Soil moisture at ${moisture}% — approaching lower optimal range`,
      timing: '2-3 days'
    });
  }

  if (stage === 'Vegetative' || stage === 'Flowering') {
    recs.push({
      category: 'Fertilizer',
      icon: <Sprout className="h-5 w-5" />,
      priority: 'high',
      action: `Apply NPK 20-20-20 fertilizer for ${crop}`,
      reason: `${stage} stage requires high nutrient uptake. Nitrogen boosts leaf growth.`,
      timing: 'This week'
    });
  }

  if (stage === 'Harvesting') {
    recs.push({
      category: 'Labor',
      icon: <Users className="h-5 w-5" />,
      priority: 'high',
      action: 'Hire 4-6 laborers for harvesting',
      reason: `${crop} is at harvest stage. Delay may cause yield loss.`,
      timing: 'Immediately'
    });
  }

  if (temp > 38) {
    recs.push({
      category: 'Alert',
      icon: <AlertTriangle className="h-5 w-5" />,
      priority: 'high',
      action: 'Apply heat stress management',
      reason: `Temperature ${temp}°C exceeds optimal range. Risk of crop damage.`,
      timing: 'Today'
    });
  }

  recs.push({
    category: 'Crop Health',
    icon: <CheckCircle className="h-5 w-5" />,
    priority: 'low',
    action: `Monitor ${crop} for pest activity`,
    reason: `${season_check(temp)} conditions increase pest risk. Weekly scouting recommended.`,
    timing: 'Weekly'
  });

  recs.push({
    category: 'Profit Tip',
    icon: <TrendingUp className="h-5 w-5" />,
    priority: 'medium',
    action: `Consider intercropping with legumes`,
    reason: `${soil} soil benefits from nitrogen fixation. Increases overall farm income.`,
    timing: 'Next season planning'
  });

  return recs;
};

const season_check = (temp: number) => temp > 30 ? 'Hot and humid' : 'Moderate';

const priorityColor = { high: 'destructive', medium: 'default', low: 'secondary' } as const;
const priorityBg = {
  high: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
  low: 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20',
};

const AIDecisionEngine = () => {
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('');
  const [stage, setCropStage] = useState('');
  const [season, setSeason] = useState('');
  const [temperature, setTemperature] = useState(28);
  const [moisture, setMoisture] = useState(45);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!crop || !soil || !stage) {
      toast({ title: 'Missing fields', description: 'Please fill in crop, soil type, and crop stage.', variant: 'destructive' });
      return;
    }
    const recs = generateRecommendations(crop, soil, stage, temperature, moisture);
    setRecommendations(recs);
    setAnalyzed(true);
    toast({ title: 'Analysis Complete', description: `${recs.length} recommendations generated for your farm.` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-3 py-1 text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Intelligence</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">AI Farm Decision Engine</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter your farm conditions and get intelligent, actionable recommendations for irrigation, fertilization, labor, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" /> Farm Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Crop Type</label>
                  <Select onValueChange={setCrop}>
                    <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                    <SelectContent>{crops.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Soil Type</label>
                  <Select onValueChange={setSoil}>
                    <SelectTrigger><SelectValue placeholder="Select soil" /></SelectTrigger>
                    <SelectContent>{soilTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Crop Stage</label>
                  <Select onValueChange={setCropStage}>
                    <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                    <SelectContent>{cropStages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Season</label>
                  <Select onValueChange={setSeason}>
                    <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
                    <SelectContent>{seasons.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Thermometer className="h-4 w-4" /> Temperature: {temperature}°C
                  </label>
                  <input type="range" min={10} max={50} value={temperature} onChange={e => setTemperature(Number(e.target.value))}
                    className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                    <Droplets className="h-4 w-4" /> Soil Moisture: {moisture}%
                  </label>
                  <input type="range" min={0} max={100} value={moisture} onChange={e => setMoisture(Number(e.target.value))}
                    className="w-full accent-blue-500" />
                </div>
                <Button onClick={handleAnalyze} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Brain className="h-4 w-4 mr-2" /> Analyze & Recommend
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {!analyzed ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] glass-card rounded-xl p-8 text-center">
                  <Brain className="h-16 w-16 text-purple-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500">Fill in your farm conditions and click "Analyze & Recommend" to get AI-powered insights.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recommendations for {crop}</h2>
                    <Badge variant="outline">{recommendations.length} actions</Badge>
                  </div>
                  {recommendations.map((rec, i) => (
                    <div key={i} className={`glass-card rounded-xl p-4 ${priorityBg[rec.priority]}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-gray-600 dark:text-gray-300">{rec.icon}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{rec.category}</span>
                              <Badge variant={priorityColor[rec.priority]} className="text-xs">{rec.priority} priority</Badge>
                            </div>
                            <p className="font-medium text-sm mb-1">{rec.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{rec.reason}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{rec.timing}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
