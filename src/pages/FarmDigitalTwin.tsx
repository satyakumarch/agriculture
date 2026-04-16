import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Droplets, Thermometer, Sprout, AlertTriangle, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type HealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

interface FarmSection {
  id: string;
  name: string;
  crop: string;
  area: string;
  health: HealthStatus;
  moisture: number;
  temperature: number;
  stage: string;
  lastActivity: string;
  notes: string;
}

const initialSections: FarmSection[] = [
  { id: 'A1', name: 'Plot A1 - North', crop: 'Wheat', area: '2.5 acres', health: 'excellent', moisture: 65, temperature: 24, stage: 'Flowering', lastActivity: 'Irrigated 2 days ago', notes: 'Healthy growth, no issues detected' },
  { id: 'A2', name: 'Plot A2 - NE', crop: 'Wheat', area: '2.0 acres', health: 'good', moisture: 48, temperature: 25, stage: 'Vegetative', lastActivity: 'Fertilized 5 days ago', notes: 'Slight nitrogen deficiency observed' },
  { id: 'B1', name: 'Plot B1 - East', crop: 'Rice', area: '3.0 acres', health: 'warning', moisture: 28, temperature: 30, stage: 'Seedling', lastActivity: 'Sowed 10 days ago', notes: 'Low moisture — irrigation needed soon' },
  { id: 'B2', name: 'Plot B2 - SE', crop: 'Tomato', area: '1.5 acres', health: 'critical', moisture: 18, temperature: 35, stage: 'Fruiting', lastActivity: 'Sprayed 7 days ago', notes: 'Heat stress + low moisture. Urgent action needed!' },
  { id: 'C1', name: 'Plot C1 - South', crop: 'Cotton', area: '4.0 acres', health: 'good', moisture: 55, temperature: 28, stage: 'Vegetative', lastActivity: 'Weeded 3 days ago', notes: 'Good growth. Monitor for bollworm.' },
  { id: 'C2', name: 'Plot C2 - SW', crop: 'Soybean', area: '2.5 acres', health: 'excellent', moisture: 70, temperature: 26, stage: 'Flowering', lastActivity: 'Irrigated yesterday', notes: 'Excellent condition. On track for harvest.' },
  { id: 'D1', name: 'Plot D1 - West', crop: 'Corn', area: '3.5 acres', health: 'good', moisture: 52, temperature: 27, stage: 'Vegetative', lastActivity: 'Fertilized 4 days ago', notes: 'Healthy. Tasseling expected in 2 weeks.' },
  { id: 'D2', name: 'Plot D2 - NW', crop: 'Potato', area: '1.0 acres', health: 'warning', moisture: 35, temperature: 22, stage: 'Tuber Formation', lastActivity: 'Hilled 6 days ago', notes: 'Moisture dropping. Schedule irrigation.' },
];

const healthConfig: Record<HealthStatus, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  excellent: { color: 'text-green-700', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-400', icon: <CheckCircle className="h-4 w-4 text-green-600" />, label: 'Excellent' },
  good: { color: 'text-blue-700', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-400', icon: <Activity className="h-4 w-4 text-blue-600" />, label: 'Good' },
  warning: { color: 'text-yellow-700', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400', icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />, label: 'Warning' },
  critical: { color: 'text-red-700', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-400', icon: <AlertTriangle className="h-4 w-4 text-red-600" />, label: 'Critical' },
};

const FarmDigitalTwin = () => {
  const [sections, setSections] = useState<FarmSection[]>(initialSections);
  const [selected, setSelected] = useState<FarmSection | null>(null);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const handleRefresh = () => {
    setSections(prev => prev.map(s => ({ ...s, moisture: Math.max(10, Math.min(90, s.moisture + (Math.random() * 6 - 3))), temperature: Math.max(15, Math.min(42, s.temperature + (Math.random() * 2 - 1))) })));
    toast({ title: 'Data Refreshed', description: 'Sensor data updated from IoT network.' });
  };

  const filtered = filter === 'all' ? sections : sections.filter(s => s.health === filter);

  const summary = {
    total: sections.length,
    excellent: sections.filter(s => s.health === 'excellent').length,
    good: sections.filter(s => s.health === 'good').length,
    warning: sections.filter(s => s.health === 'warning').length,
    critical: sections.filter(s => s.health === 'critical').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full px-3 py-1 text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-3">
              <Map className="h-4 w-4" />
              <span>Digital Twin</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farm Digital Twin</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Visual dashboard of your farm sections — crop health, soil status, and real-time activity tracking.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(['excellent', 'good', 'warning', 'critical'] as HealthStatus[]).map(h => (
              <div key={h} className={`rounded-xl p-4 text-center ${healthConfig[h].bg} border ${healthConfig[h].border}`}>
                <div className="flex justify-center mb-1">{healthConfig[h].icon}</div>
                <p className={`text-2xl font-bold ${healthConfig[h].color}`}>{summary[h]}</p>
                <p className={`text-xs font-medium ${healthConfig[h].color}`}>{healthConfig[h].label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plots</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">{filtered.length} plots</Badge>
            </div>
            <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh Sensors
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Farm Grid Map */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Map className="h-4 w-4" /> Farm Layout</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {filtered.map(section => {
                    const cfg = healthConfig[section.health];
                    return (
                      <button key={section.id} onClick={() => setSelected(section)}
                        className={`rounded-xl p-3 text-left border-2 transition-all hover:scale-105 ${cfg.bg} ${cfg.border} ${selected?.id === section.id ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm">{section.id}</span>
                          {cfg.icon}
                        </div>
                        <p className="text-xs font-medium truncate">{section.crop}</p>
                        <p className="text-xs text-gray-500">{section.area}</p>
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span>{section.moisture.toFixed(0)}%</span>
                          <Thermometer className="h-3 w-3 text-red-500 ml-1" />
                          <span>{section.temperature.toFixed(0)}°C</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <Card className={`border-2 ${healthConfig[selected.health].border}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      {healthConfig[selected.health].icon}
                      {selected.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{selected.crop}</span>
                      <Badge variant="outline" className="text-xs ml-auto">{selected.stage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 text-center">
                        <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-0.5" />
                        <p className="text-lg font-bold text-blue-600">{selected.moisture.toFixed(0)}%</p>
                        <p className="text-xs text-gray-500">Moisture</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-2 text-center">
                        <Thermometer className="h-4 w-4 text-red-500 mx-auto mb-0.5" />
                        <p className="text-lg font-bold text-red-600">{selected.temperature.toFixed(0)}°C</p>
                        <p className="text-xs text-gray-500">Temperature</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-gray-500 mb-0.5">Area</p>
                      <p className="font-medium">{selected.area}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-gray-500 mb-0.5">Last Activity</p>
                      <p className="font-medium">{selected.lastActivity}</p>
                    </div>
                    <div className={`rounded-lg p-2 text-xs ${healthConfig[selected.health].bg} ${healthConfig[selected.health].color}`}>
                      {selected.notes}
                    </div>
                    {selected.health === 'critical' && (
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" /> Take Immediate Action
                      </Button>
                    )}
                    {selected.health === 'warning' && (
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm">
                        Schedule Irrigation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="glass-card rounded-xl p-6 text-center h-full flex flex-col items-center justify-center min-h-[200px]">
                  <Map className="h-10 w-10 text-indigo-300 mb-3" />
                  <p className="text-sm text-gray-500">Click on a farm plot to see detailed status and recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FarmDigitalTwin;
