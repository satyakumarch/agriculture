import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import GetStartedModal from '@/components/modals/GetStartedModal';
import ExploreFeaturesModal from '@/components/modals/ExploreFeaturesModal';
import { useLanguage } from '@/hooks/use-language';

// Using your confirmed YouTube Short — plays reliably, no unavailable error
// Each slot uses the same video but different start points for variety
const heroVideos = [
  { id: 'O4iuA4Q0zIo', start: 0,  label: '🌾 My Farm' },
  { id: 'O4iuA4Q0zIo', start: 5,  label: '🌱 Agriculture' },
  { id: 'O4iuA4Q0zIo', start: 10, label: '🚜 Smart Farming' },
  { id: 'O4iuA4Q0zIo', start: 15, label: '🌾 Crop Fields' },
];

const Hero = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [exploreFeaturesModalOpen, setExploreFeaturesModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

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

  // Auto-rotate every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVideo(v => (v + 1) % heroVideos.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const ytSrc = (id: string) =>
    `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&playsinline=1&enablejsapi=1&modestbranding=1`;

  const getEmbedSrc = (video: typeof heroVideos[0]) =>
    `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&rel=0&playsinline=1&enablejsapi=1&modestbranding=1&start=${video.start}`;

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

          {/* Right: Video — bigger frame */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-green-600/30 to-sky-400/30 blur-2xl scale-105"></div>

              <div className="relative glass-card p-1.5 overflow-hidden rounded-3xl shadow-2xl">
                {/* YouTube iframe — autoplay, muted, loop, no blank screen */}
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '520px' }}>
                  <iframe
                    key={currentVideo}
                    src={getEmbedSrc(heroVideos[currentVideo])}
                    title={heroVideos[currentVideo].label}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                    style={{ pointerEvents: 'none' }}
                  />
                  {/* Transparent overlay to block YouTube click-through while keeping controls */}
                  <div className="absolute inset-0 rounded-2xl" style={{ pointerEvents: 'none' }} />
                </div>

                {/* Controls overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-green-600/90 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                    {heroVideos[currentVideo].label}
                  </span>
                  {/* Dot selector */}
                  <div className="flex gap-1.5">
                    {heroVideos.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentVideo(i)}
                        className={`rounded-full transition-all ${currentVideo === i ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/60 hover:bg-white/90'}`}
                        title={v.label}
                      />
                    ))}
                  </div>
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
