import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, BarChart3, Brain, Wifi, Cloud, Microscope, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/use-language';

const featureLinks = ['/seed-guide', '/expense-tracker', '/ai-decision-engine', '/iot-monitoring', '/weather', '/disease-scanner'];
const featureIcons = [Leaf, BarChart3, Brain, Wifi, Cloud, Microscope];
const featureIconClasses = [
  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
];

const FeaturesSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="features-section" className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">{t.features.badge}</div>
          <h2 className="text-3xl font-bold mb-4">{t.features.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t.features.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div key={index} className="glass-card rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={() => setExpanded(expanded === index ? null : index)}>
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${featureIconClasses[index]}`}><Icon className="h-6 w-6" /></div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    {expanded === index ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                </div>
                {expanded === index && (
                  <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 bg-gray-50/50 dark:bg-gray-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{feature.detail}</p>
                    <Button size="sm" onClick={e => { e.stopPropagation(); navigate(featureLinks[index]); }} className="bg-green-600 hover:bg-green-700 text-white">
                      {t.features.openFeature} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group" onClick={() => navigate('/ai-decision-engine')}>
            {t.features.exploreAll} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
