import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plane, Activity, Droplets, RotateCcw, Leaf, Award, Brain, Mic, TrendingUp, ShoppingBag, Map, BookOpen, Shield, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import modernAgricultureImage from '@/assets/modern-agriculture-features.jpg';

interface ExploreFeaturesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  {
    icon: Brain,
    title: 'AI Farm Decision Engine',
    description: 'Intelligent system that analyzes weather, soil, and crop stage to give actionable recommendations.',
    detail: 'The AI engine processes your soil moisture, temperature, crop stage, and historical data to recommend: when to irrigate (based on soil moisture thresholds), which fertilizer to apply (NPK ratios by crop stage), when to hire labor (harvest timing), and pest risk alerts. It generates prioritized action cards with timing and reasoning for every recommendation.',
    link: '/ai-decision-engine',
    color: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-600',
  },
  {
    icon: Mic,
    title: 'Voice AI Assistant',
    description: 'Ask farming questions in Hindi, Nepali, or Punjabi and get spoken answers.',
    detail: 'Supports 4 languages: Hindi (हिंदी), Nepali (नेपाली), Punjabi (ਪੰਜਾਬੀ), and English. Uses browser Web Speech API for voice recognition and text-to-speech. Ask about irrigation schedules, fertilizer doses, pest identification, market prices, and government schemes. Works offline for basic queries.',
    link: '/voice-assistant',
    color: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Profit Prediction System',
    description: 'Predict expected yield, profit/loss, and risk percentage based on your inputs.',
    detail: 'Input your crop type, land area (supports acre, bigha, kattha, sq. meter), seed cost, fertilizer cost, labor cost, and other expenses. The system calculates: expected yield (quintals), gross revenue at current MSP, net profit/loss, ROI percentage, and risk level (low/medium/high). Visual bar charts show revenue vs expenses breakdown.',
    link: '/profit-prediction',
    color: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    iconBg: 'bg-green-600',
  },
  {
    icon: Activity,
    title: 'IoT Sensor Monitoring',
    description: 'Real-time monitoring of soil moisture, temperature, humidity, wind, and rainfall sensors.',
    detail: 'Connect or simulate IoT sensors across your farm plots. Monitor: soil moisture (%), temperature (°C), humidity (%), wind speed (km/h), and rainfall (mm). Each sensor shows battery level, signal strength, and status (normal/warning/critical). Automated irrigation alerts trigger when moisture drops below threshold. Add unlimited sensors with custom locations.',
    link: '/iot-monitoring',
    color: 'bg-sky-100 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800',
    iconBg: 'bg-sky-600',
  },
  {
    icon: Droplets,
    title: 'Hyperlocal Weather Forecast',
    description: 'Accurate local weather with pest risk alerts, drought warnings, and crop advisories.',
    detail: 'Powered by OpenWeatherMap API with worldwide city search. Shows: current temperature, humidity, wind speed, visibility, sunrise/sunset. 5-day forecast with daily min/max. Agricultural tab includes: crop-specific advisories, pest risk index, drought warning, frost alert, and irrigation recommendations based on weather. Supports any city worldwide.',
    link: '/weather',
    color: 'bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800',
    iconBg: 'bg-cyan-600',
  },
  {
    icon: Award,
    title: 'Government Scheme Recommender',
    description: 'Find subsidies, insurance, and government programs tailored to your farm profile.',
    detail: 'Database of 8+ major schemes: PM-KISAN (₹6,000/year income support), PMFBY (crop insurance), Kisan Credit Card (4% interest loans up to ₹3 lakh), Soil Health Card (free soil testing), eNAM (online mandi), PM Krishi Sinchai Yojana (55–90% subsidy on drip irrigation), RKVY (grants up to ₹25 lakh), and PKVY (organic farming support). Filter by state, crop, and land size.',
    link: '/government-schemes',
    color: 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    iconBg: 'bg-orange-600',
  },
  {
    icon: ShoppingBag,
    title: 'Farmer Marketplace',
    description: 'Buy/sell seeds, tools, equipment. Rent tractors and hire labor.',
    detail: 'Categories: Seeds (certified varieties), Tools (sprayers, drip kits), Equipment (rotavators, harvesters), Labor (harvesting/sowing teams), Tractor Rental. Each listing shows price, seller rating, location, and availability. Contact seller directly. Post your own listings. Search by location or category. Supports labor exchange and resource sharing between farmers.',
    link: '/marketplace',
    color: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    iconBg: 'bg-yellow-600',
  },
  {
    icon: Map,
    title: 'Farm Digital Twin',
    description: 'Visual dashboard of your farm sections with crop health and soil status.',
    detail: 'Visualize your entire farm as a grid of plots. Each plot shows: crop type, growth stage, soil moisture %, temperature, health status (excellent/good/warning/critical) with color coding. Click any plot for detailed status, last activity, and AI recommendations. Refresh button pulls latest sensor data. Filter plots by health status. Critical plots show urgent action buttons.',
    link: '/farm-digital-twin',
    color: 'bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    iconBg: 'bg-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Learning & Gamification Hub',
    description: 'Daily tips, quizzes, points, and achievements to grow your farming knowledge.',
    detail: 'Daily rotating farming tips covering irrigation, soil health, pest control, finance, and cropping. 5-question quiz with instant feedback and explanations. Points system: earn 20 points per correct answer. Level progression (Beginner → Experienced → Expert → Master Farmer). Achievements/badges for milestones. 7-day streak tracking. All content is agriculture-specific and India-focused.',
    link: '/learning-hub',
    color: 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-600',
  },
  {
    icon: Shield,
    title: 'Emergency SOS',
    description: 'Send instant SOS alerts with GPS location to emergency contacts.',
    detail: 'One-tap SOS button sends emergency alert to all saved contacts with your real-time GPS coordinates. Supports up to unlimited emergency contacts (family, sarpanch, police). Shows acknowledgment when contact responds. Alert history log. Pre-loaded national emergency numbers: Police (100), Ambulance (108), Fire (101), Disaster Management (1078), Kisan Call Center (1800-180-1551).',
    link: '/emergency-sos',
    color: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    iconBg: 'bg-red-600',
  },
];

const ExploreFeaturesModal = ({ open, onOpenChange }: ExploreFeaturesModalProps) => {
  const navigate = useNavigate();
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const handleNavigate = (link: string) => {
    onOpenChange(false);
    navigate(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">All Platform Features</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Click any feature to expand full details and navigate directly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img src={modernAgricultureImage} alt="Modern precision farming" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-semibold">The Future of Agriculture is Here</h3>
              <p className="text-sm opacity-90">{features.length} powerful features — click to explore each one</p>
            </div>
          </div>

          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div key={index}
                className={`rounded-xl border overflow-hidden cursor-pointer ${feature.color}`}
                onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}>
                <div className="flex items-center gap-4 p-4">
                  <div className={`flex-shrink-0 w-11 h-11 ${feature.iconBg} rounded-full flex items-center justify-center text-white`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{feature.description}</p>
                  </div>
                  {expandedFeature === index ? <ChevronUp className="h-5 w-5 shrink-0 text-gray-500" /> : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                </div>
                {expandedFeature === index && (
                  <div className="px-4 pb-4 bg-white/60 dark:bg-black/20 border-t border-white/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-3 mb-3">{feature.detail}</p>
                    <Button size="sm" onClick={e => { e.stopPropagation(); handleNavigate(feature.link); }}
                      className="text-white" style={{ backgroundColor: feature.iconBg.replace('bg-', '').includes('600') ? undefined : undefined }}>
                      Open {feature.title} <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={() => { onOpenChange(false); }} variant="outline" size="lg">
              Close & Explore
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExploreFeaturesModal;
