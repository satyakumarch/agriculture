
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GetStartedModal from '@/components/modals/GetStartedModal';
import { useLanguage } from '@/hooks/use-language';

const CTASection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);

  const handleGetStarted = () => setGetStartedModalOpen(true);
  const handleExploreFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">{t.cta.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="bg-white text-green-700 hover:bg-green-50 border-white group" onClick={handleGetStarted}>
            {t.cta.startTrial}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10" onClick={handleExploreFeatures}>
            {t.cta.scheduleDemo}
          </Button>
        </div>
      </div>
      <GetStartedModal open={getStartedModalOpen} onOpenChange={setGetStartedModalOpen} />
    </section>
  );
};

export default CTASection;
