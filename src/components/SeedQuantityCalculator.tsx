import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Leaf, Calendar } from 'lucide-react';

// Conversion to square meters
const unitToSqM: Record<string, number> = {
  'sq_meter': 1,
  'sq_foot': 0.0929,
  'sq_yard': 0.8361,
  'acre': 4046.86,
  'hectare': 10000,
  'sq_km': 1000000,
  'bigha_up': 2529,      // Bigha (UP/Bihar)
  'bigha_rajasthan': 1618, // Bigha (Rajasthan)
  'bigha_bengal': 1337,  // Bigha (West Bengal)
  'gunta': 101.17,
  'kanal': 505.857,
  'marla': 25.29,
  'kattha': 126.45,
};

const unitLabels: Record<string, string> = {
  'sq_meter': 'Square Meter (m²)',
  'sq_foot': 'Square Foot (ft²)',
  'sq_yard': 'Square Yard (yd²)',
  'acre': 'Acre',
  'hectare': 'Hectare (ha)',
  'sq_km': 'Square Kilometer (km²)',
  'bigha_up': 'Bigha (UP/Bihar)',
  'bigha_rajasthan': 'Bigha (Rajasthan)',
  'bigha_bengal': 'Bigha (West Bengal)',
  'gunta': 'Gunta / Guntha',
  'kanal': 'Kanal (Punjab/J&K)',
  'marla': 'Marla (Punjab)',
  'kattha': 'Kattha (Bihar/Bengal)',
};

// Seed rates in kg per 10,000 sq meters (1 hectare)
const seedRates: Record<string, { kgPerHa: number; spacing: string; bestMonths: string[]; germination: number; resistance: string }> = {
  wheat:    { kgPerHa: 100, spacing: '20–22 cm row spacing', bestMonths: ['Oct', 'Nov'], germination: 92, resistance: 'Medium' },
  rice:     { kgPerHa: 40,  spacing: '20×15 cm (transplanted)', bestMonths: ['Jun', 'Jul'], germination: 88, resistance: 'High' },
  corn:     { kgPerHa: 25,  spacing: '75 cm rows × 20 cm plants', bestMonths: ['Apr', 'May'], germination: 95, resistance: 'High' },
  soybean:  { kgPerHa: 80,  spacing: '30 cm rows × 5 cm plants', bestMonths: ['May', 'Jun'], germination: 90, resistance: 'Medium' },
  cotton:   { kgPerHa: 5,   spacing: '90 cm rows × 60 cm plants', bestMonths: ['May', 'Jun'], germination: 85, resistance: 'High' },
  potato:   { kgPerHa: 1500,spacing: '60 cm rows × 25 cm plants', bestMonths: ['Feb', 'Mar'], germination: 98, resistance: 'Medium' },
  tomato:   { kgPerHa: 0.5, spacing: '60 cm rows × 45 cm plants', bestMonths: ['Mar', 'Apr'], germination: 95, resistance: 'High' },
  sorghum:  { kgPerHa: 10,  spacing: '45 cm rows × 15 cm plants', bestMonths: ['Jun', 'Jul'], germination: 90, resistance: 'High' },
  mustard:  { kgPerHa: 5,   spacing: '30 cm rows × 10 cm plants', bestMonths: ['Oct', 'Nov'], germination: 88, resistance: 'Medium' },
  sugarcane:{ kgPerHa: 8000,spacing: '90 cm rows (sets)', bestMonths: ['Feb', 'Mar'], germination: 80, resistance: 'Medium' },
};

const SeedQuantityCalculator: React.FC<{ className?: string }> = ({ className }) => {
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('acre');
  const [seedType, setSeedType] = useState('wheat');
  const [result, setResult] = useState<{ kg: number; cost: number; details: typeof seedRates['wheat'] } | null>(null);

  const handleCalculate = () => {
    const numArea = parseFloat(area);
    if (!numArea || numArea <= 0) return;
    const sqMeters = numArea * unitToSqM[unit];
    const hectares = sqMeters / 10000;
    const seed = seedRates[seedType];
    const kg = seed.kgPerHa * hectares;
    const cost = kg * 85; // avg ₹85/kg
    setResult({ kg, cost, details: seed });
  };

  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Seed Quantity Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <Input type="number" min="0" placeholder="Enter area" value={area} onChange={e => setArea(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sq_meter">Square Meter (m²)</SelectItem>
                <SelectItem value="sq_foot">Square Foot (ft²)</SelectItem>
                <SelectItem value="sq_yard">Square Yard (yd²)</SelectItem>
                <SelectItem value="acre">Acre</SelectItem>
                <SelectItem value="hectare">Hectare (ha)</SelectItem>
                <SelectItem value="sq_km">Square Kilometer (km²)</SelectItem>
                <SelectItem value="bigha_up">Bigha (UP/Bihar)</SelectItem>
                <SelectItem value="bigha_rajasthan">Bigha (Rajasthan)</SelectItem>
                <SelectItem value="bigha_bengal">Bigha (West Bengal)</SelectItem>
                <SelectItem value="gunta">Gunta / Guntha</SelectItem>
                <SelectItem value="kanal">Kanal (Punjab/J&K)</SelectItem>
                <SelectItem value="marla">Marla (Punjab)</SelectItem>
                <SelectItem value="kattha">Kattha (Bihar/Bengal)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Seed Type</label>
          <Select value={seedType} onValueChange={setSeedType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(seedRates).map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCalculate} className="w-full bg-green-600 hover:bg-green-700 text-white">Calculate</Button>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 space-y-3">
            <h4 className="font-semibold text-green-800 dark:text-green-300">Results</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Seed Required</p>
                <p className="text-xl font-bold text-green-600">{result.kg < 1 ? (result.kg * 1000).toFixed(0) + ' g' : result.kg.toFixed(2) + ' kg'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Est. Cost</p>
                <p className="text-xl font-bold text-blue-600">₹{result.cost.toFixed(0)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-green-500" /> Germination: {result.details.germination}% | Resistance: {result.details.resistance}</p>
              <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-green-500" /> Best months: {result.details.bestMonths.join(', ')}</p>
              <p>Spacing: {result.details.spacing}</p>
              <p className="text-gray-400">Area = {(parseFloat(area) * unitToSqM[unit]).toFixed(0)} m² = {(parseFloat(area) * unitToSqM[unit] / 10000).toFixed(4)} ha</p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">Note: Calculations are estimates based on standard seeding rates. Actual requirements may vary by soil, seed quality, and local practices.</p>
      </div>
    </div>
  );
};

export default SeedQuantityCalculator;
