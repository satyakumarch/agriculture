import React, { useEffect, useRef } from 'react';
import { Play, Instagram } from 'lucide-react';

const YT_VIDEO_ID = 'O4iuA4Q0zIo';
const IG_REEL_URL = 'https://www.instagram.com/reel/DXPpYSIEsng/';

// YouTube embed — autoplay, muted, looping
const ytSrc =
  `https://www.youtube.com/embed/${YT_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}` +
  `&controls=1&rel=0&playsinline=1&enablejsapi=1`;

const VideoSection = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Force-play YouTube via postMessage after load (handles browsers that block autoplay param)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const forcePlay = () => {
      try {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } catch (_) { /* cross-origin — autoplay param handles it */ }
    };
    iframe.addEventListener('load', forcePlay);
    const t = setTimeout(forcePlay, 1500);
    return () => { iframe.removeEventListener('load', forcePlay); clearTimeout(t); };
  }, []);

  // Load Instagram embed script once
  useEffect(() => {
    if (document.getElementById('ig-embed-script')) {
      // Script already present — re-process any new embeds
      (window as any).instgrm?.Embeds?.process();
      return;
    }
    const script = document.createElement('script');
    script.id = 'ig-embed-script';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => (window as any).instgrm?.Embeds?.process();
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50 dark:from-gray-950 dark:to-green-950/20">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
            <Play className="h-4 w-4 fill-current" />
            <span>See It In Action</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Smart Farming, Simplified</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Watch how AgriAssist helps farmers grow more, spend less, and make smarter decisions every day.
          </p>
        </div>

        {/* Two videos side by side */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">

          {/* ── YouTube Short ── */}
          <div className="flex flex-col items-center flex-1 max-w-xs mx-auto">
            <div className="flex items-center gap-2 mb-3">
              {/* YouTube icon */}
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">YouTube Short</span>
            </div>
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-4 ring-red-200 dark:ring-red-900"
              style={{ aspectRatio: '9 / 16' }}
            >
              <iframe
                ref={iframeRef}
                src={ytSrc}
                title="AgriAssist Smart Farming — YouTube Short"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Auto-plays on mute · use controls to unmute
            </p>
          </div>

          {/* ── Instagram Reel ── */}
          <div className="flex flex-col items-center flex-1 max-w-xs mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Instagram className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Instagram Reel</span>
            </div>

            {/* Instagram official blockquote embed */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl ring-4 ring-pink-200 dark:ring-pink-900">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={`${IG_REEL_URL}?utm_source=ig_embed`}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '16px',
                  boxShadow: 'none',
                  margin: 0,
                  maxWidth: '100%',
                  minWidth: '280px',
                  padding: 0,
                  width: '100%',
                }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
              Tap to watch on Instagram
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoSection;
