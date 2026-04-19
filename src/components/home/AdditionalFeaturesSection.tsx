import React, { useState } from 'react';
import { LineChart, Bell, Bug, Satellite, MessagesSquare, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/use-language';

const featureIcons = [
  <LineChart className="h-5 w-5 text-primary" />,
  <Bell className="h-5 w-5 text-primary" />,
  <Bug className="h-5 w-5 text-primary" />,
  <Satellite className="h-5 w-5 text-primary" />,
  <MessagesSquare className="h-5 w-5 text-primary" />,
];
const featureLinks = ['/expense-tracker', '/iot-monitoring', '/disease-scanner', '/farm-digital-twin', '/community'];

const AdditionalFeaturesSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
              {t.additionalFeatures.badge}
            </div>
            <h2 className="text-3xl font-bold mb-4">{t.additionalFeatures.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t.additionalFeatures.subtitle}</p>

            <div className="space-y-3">
              {t.additionalFeatures.items.map((feature, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-green-400 transition-colors"
                  onClick={() => setExpanded(expanded === index ? null : index)}>
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-shrink-0 mt-0.5">{featureIcons[index]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-semibold">{feature.title}</h4>
                        {expanded === index ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                  {expanded === index && (
                    <div className="px-4 pb-4 bg-green-50/50 dark:bg-green-950/10 border-t border-gray-100 dark:border-gray-800 pt-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{feature.detail}</p>
                      <Button size="sm" variant="outline" className="text-green-700 border-green-400 hover:bg-green-50"
                        onClick={e => { e.stopPropagation(); navigate(featureLinks[index]); }}>
                        {t.additionalFeatures.goToFeature} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:sticky lg:top-24">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-sky-500/20 blur-xl rounded-2xl"></div>
            <div className="relative glass-card p-6">
              {/* Farm images grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80" alt="Wheat field" className="w-full h-36 object-cover rounded-xl" />
                <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80" alt="Farm equipment" className="w-full h-36 object-cover rounded-xl" />
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" alt="Farming" className="w-full h-36 object-cover rounded-xl" />
                <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" alt="Irrigation" className="w-full h-36 object-cover rounded-xl" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">19+</p>
                  <p className="text-xs text-gray-500">{t.additionalFeatures.featuresCount}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">13</p>
                  <p className="text-xs text-gray-500">{t.additionalFeatures.languagesCount}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-600">24/7</p>
                  <p className="text-xs text-gray-500">{t.additionalFeatures.aiSupport}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalFeaturesSection;
