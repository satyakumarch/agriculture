import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Leaf, Calendar, FlaskConical, Sprout } from 'lucide-react';
import { apiSaveSeedCalc } from '@/lib/api';

// Conversion to square meters
const unitToSqM: Record<string, number> = {
  'sq_meter': 1, 'sq_foot': 0.0929, 'sq_yard': 0.8361,
  'acre': 4046.86, 'hectare': 10000, 'sq_km': 1000000,
  'bigha_up': 2529, 'bigha_rajasthan': 1618, 'bigha_bengal': 1337,
  'gunta': 101.17, 'kanal': 505.857, 'marla': 25.29, 'kattha': 126.45,
};

// Seed rates per hectare
const seedRates: Record<string, {
  kgPerHa: number; spacing: string; bestMonths: string[];
  germination: number; resistance: string;
}> = {
  wheat:    { kgPerHa: 100, spacing: '20–22 cm row spacing',          bestMonths: ['Oct','Nov'], germination: 92, resistance: 'Medium' },
  rice:     { kgPerHa: 40,  spacing: '20×15 cm (transplanted)',        bestMonths: ['Jun','Jul'], germination: 88, resistance: 'High'   },
  corn:     { kgPerHa: 25,  spacing: '75 cm rows × 20 cm plants',      bestMonths: ['Apr','May'], germination: 95, resistance: 'High'   },
  soybean:  { kgPerHa: 80,  spacing: '30 cm rows × 5 cm plants',       bestMonths: ['May','Jun'], germination: 90, resistance: 'Medium' },
  cotton:   { kgPerHa: 5,   spacing: '90 cm rows × 60 cm plants',      bestMonths: ['May','Jun'], germination: 85, resistance: 'High'   },
  potato:   { kgPerHa: 1500,spacing: '60 cm rows × 25 cm plants',      bestMonths: ['Feb','Mar'], germination: 98, resistance: 'Medium' },
  tomato:   { kgPerHa: 0.5, spacing: '60 cm rows × 45 cm plants',      bestMonths: ['Mar','Apr'], germination: 95, resistance: 'High'   },
  sorghum:  { kgPerHa: 10,  spacing: '45 cm rows × 15 cm plants',      bestMonths: ['Jun','Jul'], germination: 90, resistance: 'High'   },
  mustard:  { kgPerHa: 5,   spacing: '30 cm rows × 10 cm plants',      bestMonths: ['Oct','Nov'], germination: 88, resistance: 'Medium' },
  sugarcane:{ kgPerHa: 8000,spacing: '90 cm rows (sets)',               bestMonths: ['Feb','Mar'], germination: 80, resistance: 'Medium' },
};

// Fertilizer requirements per hectare
const fertilizerDB: Record<string, {
  nitrogen: number;   // kg N per hectare
  phosphorus: number; // kg P2O5 per hectare
  potassium: number;  // kg K2O per hectare
  dap: number;        // kg DAP per hectare
  urea: number;       // kg Urea per hectare
  mop: number;        // kg MOP per hectare
  zinc: number;       // kg ZnSO4 per hectare
  schedule: { stage: string; fertilizer: string; dose: string }[];
}> = {
  wheat: {
    nitrogen: 120, phosphorus: 60, potassium: 40,
    dap: 130, urea: 261, mop: 67, zinc: 25,
    schedule: [
      { stage: 'At Sowing (Basal)', fertilizer: 'DAP + MOP + ZnSO4', dose: '130 kg DAP + 67 kg MOP + 25 kg ZnSO4 per hectare' },
      { stage: '21 Days (CRI Stage)', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: '45 Days (Tillering)', fertilizer: 'Urea (2nd dose)', dose: '87 kg Urea per hectare' },
      { stage: '65 Days (Jointing)', fertilizer: 'Urea (3rd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  rice: {
    nitrogen: 120, phosphorus: 60, potassium: 60,
    dap: 130, urea: 261, mop: 100, zinc: 25,
    schedule: [
      { stage: 'At Transplanting', fertilizer: 'DAP + MOP + ZnSO4', dose: '130 kg DAP + 100 kg MOP + 25 kg ZnSO4 per hectare' },
      { stage: '20 Days (Tillering)', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: '45 Days (Panicle Init.)', fertilizer: 'Urea (2nd dose)', dose: '87 kg Urea per hectare' },
      { stage: '65 Days (Flowering)', fertilizer: 'Urea (3rd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  corn: {
    nitrogen: 150, phosphorus: 75, potassium: 75,
    dap: 163, urea: 326, mop: 125, zinc: 25,
    schedule: [
      { stage: 'At Sowing (Basal)', fertilizer: 'DAP + MOP', dose: '163 kg DAP + 125 kg MOP per hectare' },
      { stage: 'Knee-High Stage', fertilizer: 'Urea (1st dose)', dose: '163 kg Urea per hectare' },
      { stage: 'Tasseling Stage', fertilizer: 'Urea (2nd dose)', dose: '163 kg Urea per hectare' },
    ],
  },
  soybean: {
    nitrogen: 30, phosphorus: 60, potassium: 40,
    dap: 130, urea: 65, mop: 67, zinc: 25,
    schedule: [
      { stage: 'At Sowing (Basal)', fertilizer: 'DAP + MOP + Rhizobium', dose: '130 kg DAP + 67 kg MOP + Rhizobium seed treatment' },
      { stage: '30 Days', fertilizer: 'Urea (light dose)', dose: '65 kg Urea per hectare' },
      { stage: 'Flowering', fertilizer: 'MKP Foliar Spray', dose: '5 g/L water — spray on leaves' },
    ],
  },
  cotton: {
    nitrogen: 120, phosphorus: 60, potassium: 60,
    dap: 130, urea: 261, mop: 100, zinc: 25,
    schedule: [
      { stage: 'At Sowing', fertilizer: 'DAP + MOP', dose: '130 kg DAP + 100 kg MOP per hectare' },
      { stage: '30 Days (Squaring)', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: '60 Days (Flowering)', fertilizer: 'Urea (2nd dose)', dose: '87 kg Urea per hectare' },
      { stage: '90 Days (Boll Dev.)', fertilizer: 'Urea (3rd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  potato: {
    nitrogen: 180, phosphorus: 80, potassium: 100,
    dap: 174, urea: 391, mop: 167, zinc: 25,
    schedule: [
      { stage: 'At Planting', fertilizer: 'DAP + MOP + ZnSO4', dose: '174 kg DAP + 167 kg MOP + 25 kg ZnSO4 per hectare' },
      { stage: '30 Days (Earthing Up)', fertilizer: 'Urea (1st dose)', dose: '196 kg Urea per hectare' },
      { stage: '50 Days', fertilizer: 'Urea (2nd dose)', dose: '195 kg Urea per hectare' },
    ],
  },
  tomato: {
    nitrogen: 120, phosphorus: 80, potassium: 80,
    dap: 174, urea: 261, mop: 133, zinc: 25,
    schedule: [
      { stage: 'At Transplanting', fertilizer: 'DAP + MOP', dose: '174 kg DAP + 133 kg MOP per hectare' },
      { stage: '20 Days', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: 'Flowering', fertilizer: 'Urea + MKP Foliar', dose: '87 kg Urea + 5 g MKP/L water spray' },
      { stage: 'Fruiting', fertilizer: 'Urea (3rd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  sorghum: {
    nitrogen: 80, phosphorus: 40, potassium: 40,
    dap: 87, urea: 174, mop: 67, zinc: 20,
    schedule: [
      { stage: 'At Sowing', fertilizer: 'DAP + MOP', dose: '87 kg DAP + 67 kg MOP per hectare' },
      { stage: '25 Days', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: '45 Days', fertilizer: 'Urea (2nd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  mustard: {
    nitrogen: 80, phosphorus: 40, potassium: 40,
    dap: 87, urea: 174, mop: 67, zinc: 25,
    schedule: [
      { stage: 'At Sowing (Basal)', fertilizer: 'DAP + MOP + ZnSO4', dose: '87 kg DAP + 67 kg MOP + 25 kg ZnSO4 per hectare' },
      { stage: '25 Days', fertilizer: 'Urea (1st dose)', dose: '87 kg Urea per hectare' },
      { stage: '45 Days (Flowering)', fertilizer: 'Urea (2nd dose)', dose: '87 kg Urea per hectare' },
    ],
  },
  sugarcane: {
    nitrogen: 250, phosphorus: 100, potassium: 120,
    dap: 217, urea: 543, mop: 200, zinc: 25,
    schedule: [
      { stage: 'At Planting', fertilizer: 'DAP + MOP + ZnSO4', dose: '217 kg DAP + 200 kg MOP + 25 kg ZnSO4 per hectare' },
      { stage: '30 Days', fertilizer: 'Urea (1st dose)', dose: '181 kg Urea per hectare' },
      { stage: '90 Days', fertilizer: 'Urea (2nd dose)', dose: '181 kg Urea per hectare' },
      { stage: '150 Days', fertilizer: 'Urea (3rd dose)', dose: '181 kg Urea per hectare' },
    ],
  },
};

const SeedQuantityCalculator: React.FC<{ className?: string }> = ({ className }) => {
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('acre');
  const [seedType, setSeedType] = useState('wheat');
  const [result, setResult] = useState<{
    kg: number; cost: number; details: typeof seedRates['wheat'];
    hectares: number;
  } | null>(null);

  const handleCalculate = () => {
    const numArea = parseFloat(area);
    if (!numArea || numArea <= 0) return;
    const sqMeters = numArea * unitToSqM[unit];
    const hectares = sqMeters / 10000;
    const seed = seedRates[seedType];
    const kg = seed.kgPerHa * hectares;
    const cost = kg * 85;
    setResult({ kg, cost, details: seed, hectares });

    // Save to MongoDB
    apiSaveSeedCalc({ seedType, area: numArea, areaUnit: unit, seedQtyKg: kg, estCost: cost }).catch(() => {});
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

        {result && (() => {
          const fert = fertilizerDB[seedType];
          const ha = result.hectares;
          return (
            <div className="space-y-3">
              {/* Seed Results */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 space-y-3">
                <h4 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Sprout className="h-4 w-4" /> Seed Requirement
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Seed Required</p>
                    <p className="text-xl font-bold text-green-600">{result.kg < 1 ? (result.kg * 1000).toFixed(0) + ' g' : result.kg.toFixed(2) + ' kg'}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Est. Seed Cost</p>
                    <p className="text-xl font-bold text-blue-600">₹{result.cost.toFixed(0)}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p className="flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-green-500" /> Germination: {result.details.germination}% | Resistance: {result.details.resistance}</p>
                  <p className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-green-500" /> Best months: {result.details.bestMonths.join(', ')}</p>
                  <p>Spacing: {result.details.spacing}</p>
                  <p className="text-gray-400">Area = {(parseFloat(area) * unitToSqM[unit]).toFixed(0)} m² = {ha.toFixed(4)} ha</p>
                </div>
              </div>

              {/* Fertilizer Results */}
              {fert && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" /> Fertilizer Requirement for {ha.toFixed(2)} ha
                  </h4>

                  {/* NPK Summary */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Nitrogen (N)', value: (fert.nitrogen * ha).toFixed(1), unit: 'kg', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
                      { label: 'Phosphorus (P₂O₅)', value: (fert.phosphorus * ha).toFixed(1), unit: 'kg', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
                      { label: 'Potassium (K₂O)', value: (fert.potassium * ha).toFixed(1), unit: 'kg', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-lg p-2 text-center ${item.color}`}>
                        <p className="text-xs font-medium">{item.label}</p>
                        <p className="text-lg font-bold">{item.value}</p>
                        <p className="text-xs">{item.unit}</p>
                      </div>
                    ))}
                  </div>

                  {/* Commercial Fertilizer Quantities */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">📦 Commercial Fertilizer Needed:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-gray-600 dark:text-gray-400">DAP (18:46:0)</span>
                        <span className="font-bold text-gray-900 dark:text-white">{(fert.dap * ha).toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-gray-600 dark:text-gray-400">Urea (46% N)</span>
                        <span className="font-bold text-gray-900 dark:text-white">{(fert.urea * ha).toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-gray-600 dark:text-gray-400">MOP (60% K₂O)</span>
                        <span className="font-bold text-gray-900 dark:text-white">{(fert.mop * ha).toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-gray-600 dark:text-gray-400">ZnSO₄ (Zinc)</span>
                        <span className="font-bold text-gray-900 dark:text-white">{(fert.zinc * ha).toFixed(1)} kg</span>
                      </div>
                    </div>
                    {/* Estimated fertilizer cost */}
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs">
                      <span className="text-gray-500">Est. Fertilizer Cost</span>
                      <span className="font-bold text-purple-600">
                        ₹{((fert.dap * ha * 27) + (fert.urea * ha * 6) + (fert.mop * ha * 18) + (fert.zinc * ha * 40)).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Application Schedule */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">📅 Application Schedule:</p>
                    <div className="space-y-2">
                      {fert.schedule.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 rounded-lg p-2.5">
                          <span className="bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">{s.stage}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{s.fertilizer}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {/* Scale dose to actual area */}
                              {s.dose.replace(/(\d+\.?\d*)\s*kg/g, (_, n) => `${(parseFloat(n) * ha).toFixed(1)} kg`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <p className="text-xs text-gray-500">Note: Calculations are estimates based on standard seeding rates. Actual requirements may vary by soil, seed quality, and local practices.</p>
      </div>
    </div>
  );
};

export default SeedQuantityCalculator;
