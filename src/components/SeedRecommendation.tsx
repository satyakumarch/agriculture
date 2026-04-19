import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Droplets, Thermometer, Clock, Sprout, TrendingUp, CheckCircle } from 'lucide-react';

interface SeedInfo {
  id: string;
  name: string;
  image: string;
  season: string;
  soilType: string[];
  waterNeeds: 'Low' | 'Medium' | 'High';
  growthPeriod: string;
  idealTemp: string;
  yieldEstimate: string;
  description: string;
  matchScore: number;
}

const waterColor = { Low: 'text-yellow-600', Medium: 'text-blue-600', High: 'text-cyan-600' };

const SeedRecommendation: React.FC<{ seed: SeedInfo }> = ({ seed }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative">
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 rounded-full px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            {seed.matchScore}% Match
          </div>
          <img src={seed.image} alt={seed.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary hover:bg-primary">{seed.season}</Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2">{seed.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{seed.description}</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
            <div><span className="text-gray-500">Soil:</span><div className="font-medium">{seed.soilType.join(', ')}</div></div>
            <div><span className="text-gray-500">Water:</span><div className={`font-medium ${waterColor[seed.waterNeeds]}`}>{seed.waterNeeds}</div></div>
            <div><span className="text-gray-500">Growth:</span><div className="font-medium">{seed.growthPeriod}</div></div>
            <div><span className="text-gray-500">Temp:</span><div className="font-medium">{seed.idealTemp}</div></div>
          </div>
          <div className="text-center pt-2">
            <button className="text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 border border-primary hover:border-transparent">
              View Details
            </button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{seed.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img src={seed.image} alt={seed.name} className="w-full h-52 object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 rounded-full px-3 py-1 text-sm font-bold text-green-600">{seed.matchScore}% Match</div>
              <div className="absolute bottom-3 left-3"><Badge>{seed.season}</Badge></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{seed.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div><p className="text-xs text-gray-500">Water Needs</p><p className={`font-semibold ${waterColor[seed.waterNeeds]}`}>{seed.waterNeeds}</p></div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <div><p className="text-xs text-gray-500">Ideal Temp</p><p className="font-semibold">{seed.idealTemp}</p></div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div><p className="text-xs text-gray-500">Growth Period</p><p className="font-semibold">{seed.growthPeriod}</p></div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-xl p-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                <div><p className="text-xs text-gray-500">Yield Estimate</p><p className="font-semibold">{seed.yieldEstimate}</p></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><Sprout className="h-4 w-4 text-green-500" /> Suitable Soil Types</p>
              <div className="flex flex-wrap gap-2">{seed.soilType.map(s => <span key={s} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">{s}</span>)}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-3">
              <p className="text-sm font-medium mb-1 flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Why This Seed?</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">This seed scores {seed.matchScore}% match for your current season ({seed.season}) and soil conditions. It offers {seed.yieldEstimate} yield with {seed.waterNeeds.toLowerCase()} water requirements, making it ideal for your farm profile.</p>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setOpen(false)}>Got it!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeedRecommendation;
