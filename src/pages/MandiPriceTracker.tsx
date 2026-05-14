import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Search,
  RefreshCw,
  IndianRupee,
  Leaf,
  BarChart3,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ── Types ──────────────────────────────────────────────────────────────────
interface MandiRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const STATES = [
  'Maharashtra',
  'Punjab',
  'Uttar Pradesh',
  'Karnataka',
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Haryana',
  'Bihar',
  'West Bengal',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Telangana',
  'Odisha',
];

const COMMODITIES = [
  'Wheat',
  'Rice',
  'Tomato',
  'Potato',
  'Onion',
  'Cotton',
  'Soybean',
  'Mustard',
  'Sugarcane',
  'Maize',
  'Groundnut',
  'Chilli',
  'Garlic',
  'Cabbage',
  'Cauliflower',
];

const MOCK_DATA: MandiRecord[] = [
  {
    state: 'Maharashtra',
    district: 'Pune',
    market: 'Pune Mandi',
    commodity: 'Tomato',
    variety: 'Local',
    arrival_date: '14/05/2026',
    min_price: '800',
    max_price: '1200',
    modal_price: '1000',
  },
  {
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Ludhiana Mandi',
    commodity: 'Wheat',
    variety: 'Sharbati',
    arrival_date: '14/05/2026',
    min_price: '2100',
    max_price: '2400',
    modal_price: '2275',
  },
  {
    state: 'Uttar Pradesh',
    district: 'Agra',
    market: 'Agra Mandi',
    commodity: 'Potato',
    variety: 'Jyoti',
    arrival_date: '14/05/2026',
    min_price: '600',
    max_price: '900',
    modal_price: '750',
  },
  {
    state: 'Karnataka',
    district: 'Bangalore',
    market: 'APMC Bangalore',
    commodity: 'Onion',
    variety: 'Nasik Red',
    arrival_date: '14/05/2026',
    min_price: '1200',
    max_price: '1800',
    modal_price: '1500',
  },
  {
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Mandi',
    commodity: 'Soybean',
    variety: 'JS-335',
    arrival_date: '14/05/2026',
    min_price: '4500',
    max_price: '5200',
    modal_price: '4892',
  },
  {
    state: 'Rajasthan',
    district: 'Jaipur',
    market: 'Jaipur Mandi',
    commodity: 'Mustard',
    variety: 'Pusa Bold',
    arrival_date: '14/05/2026',
    min_price: '5200',
    max_price: '5800',
    modal_price: '5650',
  },
];

const BASE_URL =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aab0ddc33ad780ea4b&format=json&limit=50';

// ── Component ──────────────────────────────────────────────────────────────
const MandiPriceTracker = () => {
  const { toast } = useToast();

  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  // Filters
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [districtInput, setDistrictInput] = useState<string>('');

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchPrices = async (state: string, commodity: string) => {
    setLoading(true);
    setUsingMock(false);

    try {
      let url = BASE_URL;
      if (state) url += `&filters[state.keyword]=${encodeURIComponent(state)}`;
      if (commodity) url += `&filters[commodity]=${encodeURIComponent(commodity)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const records: MandiRecord[] = (json.records ?? []).map((r: Record<string, string>) => ({
        state: r['state'] ?? r['State'] ?? '',
        district: r['district'] ?? r['District'] ?? '',
        market: r['market'] ?? r['Market'] ?? '',
        commodity: r['commodity'] ?? r['Commodity'] ?? '',
        variety: r['variety'] ?? r['Variety'] ?? '',
        arrival_date: r['arrival_date'] ?? r['Arrival_Date'] ?? '',
        min_price: r['min_price'] ?? r['Min_x0020_Price'] ?? '',
        max_price: r['max_price'] ?? r['Max_x0020_Price'] ?? '',
        modal_price: r['modal_price'] ?? r['Modal_x0020_Price'] ?? '',
      }));

      if (records.length === 0) {
        setUsingMock(true);
        setRecords(MOCK_DATA);
        toast({
          title: 'No live data found',
          description: 'Showing sample data. Try different filters.',
        });
      } else {
        setRecords(records);
      }

      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch {
      setUsingMock(true);
      setRecords(MOCK_DATA);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
      toast({
        title: 'API unavailable',
        description: 'Showing fallback sample data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSearch = () => {
    fetchPrices(selectedState, selectedCommodity);
  };

  const handleClear = () => {
    setSelectedState('');
    setSelectedCommodity('');
    setDistrictInput('');
    fetchPrices('', '');
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const displayRecords = districtInput.trim()
    ? records.filter((r) =>
        r.district.toLowerCase().includes(districtInput.trim().toLowerCase())
      )
    : records;

  const uniqueStates = new Set(records.map((r) => r.state)).size;
  const uniqueCrops = new Set(records.map((r) => r.commodity)).size;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ── Header ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
              <BarChart3 className="h-4 w-4" />
              <span>📊 Mandi Price Tracker</span>
            </div>
            <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              Live Mandi Price Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm">
              Real-time crop prices from government mandis across India — powered by data.gov.in
            </p>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Records"
              value={displayRecords.length.toString()}
              icon={<BarChart3 className="h-5 w-5 text-green-600" />}
              bg="bg-green-50 dark:bg-green-900/20"
            />
            <StatCard
              label="States Covered"
              value={uniqueStates.toString()}
              icon={<MapPin className="h-5 w-5 text-blue-600" />}
              bg="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard
              label="Crops Tracked"
              value={uniqueCrops.toString()}
              icon={<Leaf className="h-5 w-5 text-emerald-600" />}
              bg="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <StatCard
              label="Last Updated"
              value={lastUpdated}
              icon={<RefreshCw className="h-5 w-5 text-purple-600" />}
              bg="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* ── Search & Filter Bar ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-end">
              {/* State */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  State
                </label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select state…" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Commodity */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Commodity
                </label>
                <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select crop…" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMODITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  District
                </label>
                <Input
                  placeholder="Filter by district…"
                  value={districtInput}
                  onChange={(e) => setDistrictInput(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search Prices
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={loading} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            {usingMock && (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                ⚠️ Showing sample data — live API may be unavailable or returned no results for these filters.
              </p>
            )}
          </div>

          {/* ── Loading Spinner ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="h-10 w-10 text-green-500 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Fetching latest mandi prices…</p>
            </div>
          )}

          {/* ── Price Cards Grid ── */}
          {!loading && (
            <>
              {displayRecords.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <Leaf className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">No records found</p>
                  <p className="text-sm mt-1">Try adjusting your filters or clearing the search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayRecords.map((record, idx) => (
                    <PriceCard key={idx} record={record} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}

const StatCard = ({ label, value, icon, bg }: StatCardProps) => (
  <div className={`rounded-xl p-4 flex items-center gap-3 ${bg} border border-transparent`}>
    <div className="shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
      <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

interface PriceCardProps {
  record: MandiRecord;
}

const PriceCard = ({ record }: PriceCardProps) => {
  const modalNum = parseInt(record.modal_price, 10);
  const minNum = parseInt(record.min_price, 10);
  const isTrendingUp = !isNaN(modalNum) && !isNaN(minNum) && modalNum > minNum;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1.5 shrink-0">
            <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">
              {record.commodity}
            </h3>
            {record.variety && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{record.variety}</p>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {isTrendingUp ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-400" />
          )}
        </div>
      </div>

      {/* Location badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-xs gap-1">
          <MapPin className="h-3 w-3" />
          {record.state}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {record.district}
        </Badge>
      </div>

      {/* Market name */}
      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <BarChart3 className="h-3.5 w-3.5 shrink-0" />
        {record.market}
      </p>

      {/* Price boxes */}
      <div className="grid grid-cols-3 gap-2">
        <PriceBox label="Min" value={record.min_price} color="blue" />
        <PriceBox label="Max" value={record.max_price} color="red" />
        <PriceBox label="Modal" value={record.modal_price} color="green" />
      </div>

      {/* Arrival date */}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
        Arrived: {record.arrival_date}
      </p>
    </div>
  );
};

interface PriceBoxProps {
  label: string;
  value: string;
  color: 'blue' | 'red' | 'green';
}

const colorMap = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
};

const PriceBox = ({ label, value, color }: PriceBoxProps) => (
  <div className={`rounded-lg p-2 text-center ${colorMap[color]}`}>
    <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">{label}</p>
    <p className="text-sm font-bold flex items-center justify-center gap-0.5">
      <IndianRupee className="h-3 w-3" />
      {value || '—'}
    </p>
  </div>
);

export default MandiPriceTracker;
