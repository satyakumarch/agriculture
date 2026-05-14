import React from 'react';

const marqueeItems = [
  '🌾 Wheat MSP 2024-25: ₹2,275/quintal',
  '🌧️ Monsoon forecast: Normal rainfall expected this Kharif season',
  '🐛 Alert: Fall Armyworm risk high in Madhya Pradesh — scout maize fields',
  '💰 PM-KISAN: Next installment releasing soon — check pmkisan.gov.in',
  '🌡️ Heat wave warning: Rajasthan, UP — irrigate crops in evening',
  '🌱 Rabi sowing season begins October — prepare soil now',
  '📢 PMFBY enrollment open — insure your Kharif crops before deadline',
  '🚜 Kisan Credit Card: Apply for crop loan at 4% interest at nearest bank',
  '🌿 Organic farming subsidy: ₹50,000/hectare under PKVY scheme',
  '📊 Rice MSP 2024-25: ₹2,300/quintal — sell at eNAM for best price',
];

const MarqueeTicker: React.FC = () => (
  <>
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-700 text-white overflow-hidden" style={{ height: '36px' }}>
      <div className="flex animate-marquee whitespace-nowrap h-full items-center">
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="mx-10 shrink-0 font-semibold tracking-wide" style={{ fontSize: '15px' }}>{item}</span>
        ))}
      </div>
    </div>
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-marquee { animation: marquee 40s linear infinite; }
      .animate-marquee:hover { animation-play-state: paused; }
    `}</style>
  </>
);

export default MarqueeTicker;