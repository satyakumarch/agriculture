import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sprout, Droplets, Package, Sun, Shield, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import getStartedImage from '@/assets/get-started-farming.jpg';

interface GetStartedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    icon: Package,
    title: 'Choose Your Crops',
    description: 'Start with beginner-friendly crops like tomatoes, lettuce, or herbs. Consider your local climate and soil conditions.',
    detail: 'For Indian farmers: Kharif crops (rice, maize, cotton) are sown in June-July. Rabi crops (wheat, mustard, gram) are sown in October-November. Zaid crops (cucumber, watermelon) are grown in summer. Choose crops based on your state, water availability, and market demand. Use our Seed Guide to find the best variety for your region.',
    link: '/seed-guide',
    linkLabel: 'Open Seed Guide →',
  },
  {
    icon: Sun,
    title: 'Prepare Your Soil',
    description: 'Test soil pH and nutrients. Add compost or organic matter to improve soil structure and fertility.',
    detail: 'Ideal soil pH for most crops is 6.0–7.0. Sandy soil drains fast — add organic matter. Clay soil retains water — improve drainage with sand/compost. Get a free Soil Health Card from the government. Deep ploughing (20–25 cm) before sowing improves root penetration and yield by 15–20%.',
    link: '/ai-decision-engine',
    linkLabel: 'Get AI Soil Advice →',
  },
  {
    icon: Sprout,
    title: 'Select Quality Seeds',
    description: 'Choose certified seeds from reputable suppliers. Consider hybrid varieties for better disease resistance.',
    detail: 'Always buy seeds with BIS certification or from government-approved dealers. Hybrid seeds give 20–30% higher yield but cannot be saved for next season. Treat seeds with Thiram or Carbendazim fungicide before sowing to prevent damping-off disease. Seed germination test: place 10 seeds on wet cloth — if 7+ germinate in 5 days, the batch is good.',
    link: '/seed-guide',
    linkLabel: 'Browse Seed Catalog →',
  },
  {
    icon: Droplets,
    title: 'Set Up Irrigation',
    description: 'Plan your watering system. Drip irrigation is efficient for water conservation and targeted watering.',
    detail: 'Drip irrigation saves 40–60% water vs flood irrigation and increases yield by 20–50%. Sprinkler irrigation is best for wheat, vegetables, and orchards. Critical irrigation stages for wheat: Crown Root Initiation (21 DAS), Tillering (45 DAS), Jointing (65 DAS), Flowering (85 DAS). For rice: maintain 2–5 cm standing water during vegetative stage.',
    link: '/iot-monitoring',
    linkLabel: 'Monitor Soil Moisture →',
  },
  {
    icon: Shield,
    title: 'Practice Sustainability',
    description: 'Use organic fertilizers, practice crop rotation, and implement integrated pest management.',
    detail: 'Crop rotation breaks pest cycles and improves soil health. Legumes (gram, soybean) fix nitrogen — rotate with cereals. Vermicompost (2–3 tons/acre) improves soil structure and provides slow-release nutrients. Neem-based pesticides are effective against 200+ pests and are safe for beneficial insects. Apply when pest population crosses Economic Threshold Level (ETL).',
    link: '/government-schemes',
    linkLabel: 'Find Organic Farming Schemes →',
  },
];

const GetStartedModal = ({ open, onOpenChange }: GetStartedModalProps) => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleNavigate = (link: string) => {
    onOpenChange(false);
    navigate(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Get Started with Smart Farming</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Your step-by-step guide — click each step to expand full details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden">
            <img src={getStartedImage} alt="Farmer preparing field" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-semibold">Start Your Farming Journey Today</h3>
              <p className="text-sm opacity-90">Click any step below to learn more</p>
            </div>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <div key={index}
                className="rounded-xl border border-green-200 dark:border-green-800 overflow-hidden cursor-pointer"
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}>
                <div className={`flex items-center gap-4 p-4 transition-colors ${expandedStep === index ? 'bg-green-600 text-white' : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${expandedStep === index ? 'bg-white text-green-600' : 'bg-green-600 text-white'}`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4" />
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <p className={`text-sm mt-0.5 ${expandedStep === index ? 'text-green-100' : 'text-gray-600 dark:text-gray-300'}`}>{step.description}</p>
                  </div>
                  {expandedStep === index ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                </div>
                {expandedStep === index && (
                  <div className="p-4 bg-white dark:bg-gray-900 border-t border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{step.detail}</p>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-400 hover:bg-green-50"
                      onClick={e => { e.stopPropagation(); handleNavigate(step.link); }}>
                      {step.linkLabel}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-5 rounded-xl">
            <h4 className="font-semibold text-lg mb-2">💡 Pro Tips for Success</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• Start small and gradually expand your farming area</li>
              <li>• Keep detailed records of planting, watering, and harvesting</li>
              <li>• Connect with local farming communities for support</li>
              <li>• Stay updated with weather forecasts and seasonal changes</li>
              <li>• Apply for PM-KISAN (₹6,000/year) and Soil Health Card scheme</li>
            </ul>
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={() => handleNavigate('/register')} size="lg" className="group">
              Create Your Account Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetStartedModal;
