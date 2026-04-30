import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import GetStartedModal from '@/components/modals/GetStartedModal';
import ExploreFeaturesModal from '@/components/modals/ExploreFeaturesModal';
import { useLanguage } from '@/hooks/use-language';

const Hero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [exploreFeaturesModalOpen, setExploreFeaturesModalOpen] = useState(false);

  // Pause video when scrolled out of view, resume when back in view
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const iframe = iframeRef.current;
          if (!iframe?.contentWindow) return;
          if (entry.isIntersecting) {
            // Resume — send playVideo command
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
            );
          } else {
            // Pause — send pauseVideo command
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*'
            );
          }
        });
      },
      { threshold: 0.3 } // pause when less than 30% visible
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty('--x', `${(e.clientX - left) / width}`);
      containerRef.current.style.setProperty('--y', `${(e.clientY - top) / height}`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ '--x': '0.5', '--y': '0.5' } as React.CSSProperties}
    >
      {/* Animated blobs */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-green-200 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-sky-200 dark:bg-sky-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-green-100 dark:bg-green-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes blob { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left: Text */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              {t.hero.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              {t.hero.title1} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                {t.hero.title2}
              </span>
            </h1>
            {/* Hindi Tagline */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-2xl p-5 border-l-4 border-green-600 my-6">
              <p className="text-lg md:text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                कल की खेती आज के हाथों में।
              </p>
              <p className="text-base text-green-700 dark:text-green-400">
                AgriAssist के साथ अपने भविष्य को सुरक्षित और समृद्ध बनाएं।
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                Tomorrow's farming in today's hands. Make your future secure and prosperous with AgriAssist.
              </p>
            </div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="group" onClick={() => setGetStartedModalOpen(true)}>
                {t.hero.getStarted}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setExploreFeaturesModalOpen(true)}>
                {t.hero.exploreFeatures}
              </Button>
            </div>
          </div>

          {/* Right: Local Farmer Video */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-green-600/30 to-sky-400/30 blur-2xl scale-105"></div>

              <div className="relative glass-card p-1.5 overflow-hidden rounded-3xl shadow-2xl">
                <div
                  ref={videoContainerRef}
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{ height: '520px' }}
                >
                  <video
                    ref={iframeRef as unknown as React.RefObject<HTMLVideoElement>}
                    src="/farmer-video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="glass-card p-4 rounded-lg text-center">
                <div className="font-bold text-2xl text-green-600 dark:text-green-400">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t.hero.yieldIncrease}</div>
              </div>
              <div className="glass-card p-4 rounded-lg text-center">
                <div className="font-bold text-2xl text-green-600 dark:text-green-400">40%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t.hero.costReduction}</div>
              </div>
              <div className="glass-card p-4 rounded-lg text-center">
                <div className="font-bold text-2xl text-green-600 dark:text-green-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{t.hero.monitoring}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GetStartedModal open={getStartedModalOpen} onOpenChange={setGetStartedModalOpen} />
      <ExploreFeaturesModal open={exploreFeaturesModalOpen} onOpenChange={setExploreFeaturesModalOpen} />
    </div>
  );
};

export default Hero;
