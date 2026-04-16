import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Landmark, Search, ExternalLink, CheckCircle, IndianRupee, FileText } from 'lucide-react';

const states = ['Uttar Pradesh', 'Punjab', 'Haryana', 'Maharashtra', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Gujarat', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'West Bengal'];
const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'];
const landSizes = ['Small (< 1 acre)', 'Medium (1-5 acres)', 'Large (> 5 acres)'];

interface Scheme {
  name: string;
  ministry: string;
  benefit: string;
  amount: string;
  eligibility: string[];
  category: 'subsidy' | 'insurance' | 'loan' | 'training';
  link: string;
  crops: string[];
}

const allSchemes: Scheme[] = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Direct income support of ₹6,000/year in 3 installments',
    amount: '₹6,000/year',
    eligibility: ['Small and marginal farmers', 'Land holding up to 2 hectares', 'Valid Aadhaar card'],
    category: 'subsidy',
    link: 'https://pmkisan.gov.in',
    crops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Crop insurance against natural calamities, pests, and diseases',
    amount: 'Up to full sum insured',
    eligibility: ['All farmers growing notified crops', 'Premium: 1.5-5% of sum insured', 'Kharif and Rabi crops'],
    category: 'insurance',
    link: 'https://pmfby.gov.in',
    crops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'Kisan Credit Card (KCC)',
    ministry: 'Ministry of Finance / NABARD',
    benefit: 'Short-term credit for crop cultivation at subsidized interest rates',
    amount: 'Up to ₹3 lakh at 4% interest',
    eligibility: ['All farmers', 'Tenant farmers', 'Self-help groups'],
    category: 'loan',
    link: 'https://www.nabard.org',
    crops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'Soil Health Card Scheme',
    ministry: 'Ministry of Agriculture',
    benefit: 'Free soil testing and nutrient recommendations for better yield',
    amount: 'Free service',
    eligibility: ['All farmers', 'Every 2 years per plot'],
    category: 'training',
    link: 'https://soilhealth.dac.gov.in',
    crops: ['Wheat', 'Rice', 'Cotton', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'National Agriculture Market (eNAM)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Online trading platform for better price discovery',
    amount: 'Better market prices',
    eligibility: ['All farmers with produce to sell', 'Registration required'],
    category: 'subsidy',
    link: 'https://enam.gov.in',
    crops: ['Wheat', 'Rice', 'Cotton', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'PM Krishi Sinchai Yojana',
    ministry: 'Ministry of Jal Shakti',
    benefit: 'Subsidy on micro-irrigation (drip/sprinkler) systems',
    amount: '55-90% subsidy on equipment',
    eligibility: ['All farmers', 'Priority to small/marginal farmers', 'Water-scarce regions'],
    category: 'subsidy',
    link: 'https://pmksy.gov.in',
    crops: ['Vegetables', 'Fruits', 'Sugarcane', 'Cotton'],
  },
  {
    name: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Grants for agricultural infrastructure and innovation',
    amount: 'Up to ₹25 lakh for projects',
    eligibility: ['Farmer groups', 'FPOs', 'Agri-startups'],
    category: 'loan',
    link: 'https://rkvy.nic.in',
    crops: ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
  {
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    ministry: 'Ministry of Agriculture',
    benefit: 'Support for organic farming certification and marketing',
    amount: '₹50,000/hectare over 3 years',
    eligibility: ['Farmers willing to adopt organic farming', 'Group of 50+ farmers'],
    category: 'training',
    link: 'https://pgsindia-ncof.gov.in',
    crops: ['Vegetables', 'Fruits', 'Pulses', 'Oilseeds'],
  },
];

const categoryColor = { subsidy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', insurance: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', loan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', training: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };

const GovernmentSchemes = () => {
  const [state, setState] = useState('');
  const [crop, setCrop] = useState('');
  const [landSize, setLandSize] = useState('');
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<Scheme[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    let results = allSchemes;
    if (crop) results = results.filter(s => s.crops.includes(crop));
    if (search) results = results.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.benefit.toLowerCase().includes(search.toLowerCase()));
    setFiltered(results);
    setSearched(true);
  };

  const displaySchemes = searched ? filtered : allSchemes;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 rounded-full px-3 py-1 text-sm font-medium text-orange-800 dark:text-orange-300 mb-3">
              <Landmark className="h-4 w-4" />
              <span>Government Schemes</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Government Scheme Recommender</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover subsidies, insurance programs, and government schemes tailored to your farm profile.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="glass-card rounded-xl p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                <SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select onValueChange={setCrop}>
                <SelectTrigger><SelectValue placeholder="Crop Type" /></SelectTrigger>
                <SelectContent>{cropTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select onValueChange={setLandSize}>
                <SelectTrigger><SelectValue placeholder="Land Size" /></SelectTrigger>
                <SelectContent>{landSizes.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={handleSearch} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Search className="h-4 w-4 mr-2" /> Find Schemes
              </Button>
            </div>
            <div className="mt-3">
              <Input placeholder="Search schemes by name or benefit..." value={search} onChange={e => setSearch(e.target.value)}
                className="max-w-md" onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(['subsidy', 'insurance', 'loan', 'training'] as const).map(cat => (
              <div key={cat} className={`rounded-xl p-3 text-center ${categoryColor[cat]}`}>
                <p className="text-2xl font-bold">{allSchemes.filter(s => s.category === cat).length}</p>
                <p className="text-xs font-medium capitalize">{cat} schemes</p>
              </div>
            ))}
          </div>

          {/* Schemes List */}
          <div className="space-y-4">
            {displaySchemes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No schemes found for the selected filters.</div>
            ) : (
              displaySchemes.map((scheme, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-base">{scheme.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${categoryColor[scheme.category]}`}>{scheme.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{scheme.benefit}</p>
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <IndianRupee className="h-3.5 w-3.5" /> {scheme.amount}
                          </span>
                          <span className="text-gray-500 flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> {scheme.ministry}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {scheme.eligibility.map((e, j) => (
                            <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-3 w-3 text-green-500 shrink-0" /> {e}
                            </div>
                          ))}
                        </div>
                      </div>
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="shrink-0">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Apply
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GovernmentSchemes;
