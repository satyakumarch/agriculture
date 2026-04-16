import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, IndianRupee, Sprout, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const cropData: Record<string, { yieldPerAcre: number; marketPrice: number; riskFactor: number }> = {
  Wheat: { yieldPerAcre: 18, marketPrice: 2200, riskFactor: 0.15 },
  Rice: { yieldPerAcre: 22, marketPrice: 2100, riskFactor: 0.2 },
  Corn: { yieldPerAcre: 25, marketPrice: 1800, riskFactor: 0.18 },
  Cotton: { yieldPerAcre: 8, marketPrice: 6500, riskFactor: 0.25 },
  Sugarcane: { yieldPerAcre: 350, marketPrice: 350, riskFactor: 0.12 },
  Tomato: { yieldPerAcre: 120, marketPrice: 1200, riskFactor: 0.35 },
  Potato: { yieldPerAcre: 100, marketPrice: 900, riskFactor: 0.22 },
  Soybean: { yieldPerAcre: 12, marketPrice: 4200, riskFactor: 0.2 },
};

const unitConversion: Record<string, number> = {
  Acre: 1, Bigha: 0.625, Kattha: 0.05, 'Sq. Meter': 0.000247,
};

interface PredictionResult {
  expectedYield: number;
  grossRevenue: number;
  netProfit: number;
  roi: number;
  riskPercent: number;
  breakEven: number;
  monthlyExpense: number;
}

const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];

const ProfitPrediction = () => {
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('Acre');
  const [seedCost, setSeedCost] = useState('');
  const [fertilizerCost, setFertilizerCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [otherCost, setOtherCost] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = () => {
    if (!crop || !area) return;
    const areaInAcres = parseFloat(area) * unitConversion[unit];
    const data = cropData[crop];
    const totalExpenses = (parseFloat(seedCost) || 0) + (parseFloat(fertilizerCost) || 0) + (parseFloat(laborCost) || 0) + (parseFloat(otherCost) || 0);
    const expectedYield = data.yieldPerAcre * areaInAcres;
    const grossRevenue = expectedYield * data.marketPrice;
    const netProfit = grossRevenue - totalExpenses;
    const roi = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100) : 0;
    const riskPercent = Math.round(data.riskFactor * 100 + (totalExpenses > grossRevenue * 0.7 ? 10 : 0));
    const breakEven = totalExpenses / data.marketPrice;

    setResult({ expectedYield, grossRevenue, netProfit, roi, riskPercent, breakEven, monthlyExpense: totalExpenses / 4 });
  };

  const chartData = result ? [
    { name: 'Revenue', value: result.grossRevenue },
    { name: 'Expenses', value: result.grossRevenue - result.netProfit },
    { name: 'Profit', value: Math.max(result.netProfit, 0) },
  ] : [];

  const pieData = result ? [
    { name: 'Profit', value: Math.max(result.netProfit, 0) },
    { name: 'Expenses', value: result.grossRevenue - result.netProfit },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>AI Profit Predictor</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Profit Prediction System</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Input your crop details and expenses to get AI-powered yield, profit, and risk predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sprout className="h-5 w-5 text-green-500" /> Farm Input Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Crop Type</label>
                    <Select onValueChange={setCrop}>
                      <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
                      <SelectContent>{Object.keys(cropData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Land Unit</label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.keys(unitConversion).map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Land Area ({unit})</label>
                  <Input type="number" placeholder={`Enter area in ${unit}`} value={area} onChange={e => setArea(e.target.value)} />
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Expenses (₹)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Seed Cost</label>
                      <Input type="number" placeholder="₹0" value={seedCost} onChange={e => setSeedCost(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Fertilizer Cost</label>
                      <Input type="number" placeholder="₹0" value={fertilizerCost} onChange={e => setFertilizerCost(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Labor Cost</label>
                      <Input type="number" placeholder="₹0" value={laborCost} onChange={e => setLaborCost(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Other Costs</label>
                      <Input type="number" placeholder="₹0" value={otherCost} onChange={e => setOtherCost(e.target.value)} />
                    </div>
                  </div>
                </div>
                <Button onClick={handlePredict} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!crop || !area}>
                  <BarChart3 className="h-4 w-4 mr-2" /> Predict Profit & Risk
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {!result ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] glass-card rounded-xl p-8 text-center">
                  <TrendingUp className="h-16 w-16 text-green-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Awaiting Input</h3>
                  <p className="text-gray-500">Fill in your farm details to see profit predictions and risk analysis.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Expected Yield</p>
                      <p className="text-2xl font-bold text-green-600">{result.expectedYield.toFixed(0)} <span className="text-sm">qtl</span></p>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-500 mb-1">Gross Revenue</p>
                      <p className="text-2xl font-bold">₹{result.grossRevenue.toLocaleString('en-IN')}</p>
                    </div>
                    <div className={`glass-card rounded-xl p-4 text-center ${result.netProfit >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                      <p className="text-xs text-gray-500 mb-1">Net Profit/Loss</p>
                      <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.netProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        ₹{Math.abs(result.netProfit).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className={`glass-card rounded-xl p-4 text-center ${result.riskPercent > 30 ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500'}`}>
                      <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                      <p className={`text-2xl font-bold ${result.riskPercent > 30 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {result.riskPercent}%
                      </p>
                      <Badge variant={result.riskPercent > 30 ? 'destructive' : 'default'} className="text-xs mt-1">
                        {result.riskPercent > 30 ? 'High Risk' : result.riskPercent > 20 ? 'Medium Risk' : 'Low Risk'}
                      </Badge>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue vs Expenses</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                          <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <div className="glass-card rounded-xl p-4">
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" /> ROI: <span className={`font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{result.roi.toFixed(1)}%</span>
                    </p>
                    <p className="text-xs text-gray-500">Break-even yield: {result.breakEven.toFixed(1)} qtl | Monthly expense: ₹{result.monthlyExpense.toLocaleString('en-IN')}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfitPrediction;
