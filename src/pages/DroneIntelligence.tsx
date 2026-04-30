import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Upload, Brain, Map, Calendar, Radio, Lightbulb, BarChart3,
  AlertTriangle, CheckCircle, Droplets, Thermometer, Clock,
  IndianRupee, MapPin, TrendingUp, Activity, Zap, Leaf,
  RefreshCw, Satellite, Camera, ChevronDown, ChevronUp, X, FileImage
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const fields = [
  { id: 'A', name: 'Field A North', crop: 'Wheat', area: '2.4 acres', ndvi: 0.72, health: 'Good', lastScan: '2 hrs ago' },
  { id: 'B', name: 'Field B South', crop: 'Rice', area: '1.8 acres', ndvi: 0.45, health: 'Stressed', lastScan: '5 hrs ago' },
  { id: 'C', name: 'Field C East', crop: 'Cotton', area: '3.1 acres', ndvi: 0.85, health: 'Excellent', lastScan: '1 hr ago' },
  { id: 'D', name: 'Field D West', crop: 'Tomato', area: '0.9 acres', ndvi: 0.28, health: 'Critical', lastScan: '8 hrs ago' },
];

const bookings = [
  { id: 1, service: 'Pesticide Spraying', status: 'Confirmed', price: 1200, date: '15 Jun 2025' },
  { id: 2, service: 'Crop Monitoring', status: 'Pending', price: 800, date: '18 Jun 2025' },
  { id: 3, service: 'NDVI Mapping', status: 'Completed', price: 1500, date: '10 Jun 2025' },
];

const droneServices = [
  { id: 1, name: 'Pesticide Spraying', price: 1200, duration: '2-3 hrs', icon: Droplets },
  { id: 2, name: 'Crop Monitoring', price: 800, duration: '1-2 hrs', icon: Camera },
  { id: 3, name: 'NDVI Mapping', price: 1500, duration: '3-4 hrs', icon: Satellite },
  { id: 4, name: 'Thermal Imaging', price: 1800, duration: '2-3 hrs', icon: Thermometer },
  { id: 5, name: 'Seed Sowing', price: 2000, duration: '4-5 hrs', icon: Leaf },
  { id: 6, name: 'Fertilizer Spray', price: 1400, duration: '2-3 hrs', icon: Zap },
];

const advisories = [
  {
    priority: 'HIGH',
    field: 'Field D West',
    crop: 'Tomato',
    issue: 'Critical NDVI + No rain for 7 days',
    action: 'Irrigate immediately — soil moisture critically low',
    icon: AlertTriangle,
    color: 'red',
  },
  {
    priority: 'MEDIUM',
    field: 'Field B South',
    crop: 'Rice',
    issue: 'Stressed NDVI + High humidity (87%)',
    action: 'Apply fungicide — fungal disease risk elevated',
    icon: AlertTriangle,
    color: 'orange',
  },
  {
    priority: 'LOW',
    field: 'Field A North',
    crop: 'Wheat',
    issue: 'Good NDVI + Optimal temperature (24°C)',
    action: 'Continue current schedule — no intervention needed',
    icon: CheckCircle,
    color: 'green',
  },
];

const monthlyTrend = [
  { month: 'Jan', fieldA: 0.61, fieldB: 0.38, fieldC: 0.79, fieldD: 0.22 },
  { month: 'Feb', fieldA: 0.64, fieldB: 0.40, fieldC: 0.81, fieldD: 0.24 },
  { month: 'Mar', fieldA: 0.67, fieldB: 0.42, fieldC: 0.83, fieldD: 0.25 },
  { month: 'Apr', fieldA: 0.69, fieldB: 0.43, fieldC: 0.84, fieldD: 0.26 },
  { month: 'May', fieldA: 0.71, fieldB: 0.44, fieldC: 0.85, fieldD: 0.27 },
  { month: 'Jun', fieldA: 0.72, fieldB: 0.45, fieldC: 0.85, fieldD: 0.28 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ndviColor(ndvi: number): string {
  if (ndvi >= 0.7) return 'bg-green-500';
  if (ndvi >= 0.5) return 'bg-yellow-400';
  if (ndvi >= 0.35) return 'bg-orange-400';
  return 'bg-red-500';
}

function healthBadgeClass(health: string): string {
  switch (health) {
    case 'Excellent': return 'bg-green-100 text-green-800 border-green-300';
    case 'Good': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Stressed': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function priorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
    case 'MEDIUM': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DroneIntelligence: React.FC = () => {
  const { toast } = useToast();

  // ── Tab 1: Upload & Analyze ──
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [imageType, setImageType] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Tab 3: Book Service ──
  const [myBookings, setMyBookings] = useState(bookings);
  const [bookingField, setBookingField] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingService, setBookingService] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // ── Tab 4: Live Tracking ──
  const [dronePos, setDronePos] = useState({ row: 3, col: 4 });
  const [battery, setBattery] = useState(72);
  const [altitude, setAltitude] = useState(45);
  const [speed, setSpeed] = useState(8.5);
  const [flightTime, setFlightTime] = useState(1114); // seconds
  const [isTracking, setIsTracking] = useState(false);

  // ── Tab 5: Advisory ──
  const [expandedAdvisory, setExpandedAdvisory] = useState<number | null>(null);

  // ── Tab 2: Field Map ──
  const [selectedMapField, setSelectedMapField] = useState<string | null>(null);

  // Live tracking interval
  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => {
      setDronePos(p => {
        const newCol = (p.col + 1) % 10;
        const newRow = newCol === 0 ? (p.row + 1) % 10 : p.row;
        return { row: newRow, col: newCol };
      });
      setBattery(b => Math.max(0, b - 0.1));
      setAltitude(a => a + (Math.random() - 0.5) * 2);
      setSpeed(s => Math.max(0, s + (Math.random() - 0.5)));
      setFlightTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  // File upload handlers
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = e => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setAnalysisResult(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = () => {
    if (!selectedField || !imageType) {
      toast({ title: 'Missing fields', description: 'Please select a field and image type.', variant: 'destructive' });
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(true);
      toast({ title: '✅ Analysis Complete', description: 'AI has processed your drone imagery.' });
    }, 2500);
  };

  // Booking handler
  const handleBookService = (serviceName: string) => {
    setBookingService(serviceName);
    setShowBookingForm(true);
  };

  const confirmBooking = () => {
    if (!bookingField || !bookingDate || !bookingTime) {
      toast({ title: 'Missing details', description: 'Please fill field, date and time.', variant: 'destructive' });
      return;
    }
    const newBooking = {
      id: myBookings.length + 1,
      service: bookingService,
      status: 'Pending',
      price: droneServices.find(s => s.name === bookingService)?.price ?? 1000,
      date: new Date(bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setMyBookings(prev => [newBooking, ...prev]);
    setShowBookingForm(false);
    setBookingField(''); setBookingDate(''); setBookingTime('');
    toast({ title: '🚁 Booking Confirmed!', description: `${bookingService} scheduled for ${newBooking.date}` });
  };

  const cancelBooking = (id: number) => {
    setMyBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled.' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-green-100 text-green-800 border border-green-300 text-sm px-3 py-1">
              🚁 Drone Intelligence System
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drone Intelligence Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            AI-powered aerial crop monitoring, analysis, and precision agriculture services
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Map className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white">4</p><p className="text-sm text-gray-500 dark:text-gray-400">Total Fields</p></div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30"><Radio className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white">2</p><p className="text-sm text-gray-500 dark:text-gray-400">Active Drones</p></div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30"><Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white">7</p><p className="text-sm text-gray-500 dark:text-gray-400">Scans Today</p></div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white">3</p><p className="text-sm text-gray-500 dark:text-gray-400">Alerts</p></div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2 text-xs sm:text-sm">
              <Upload className="w-4 h-4" /> Upload &amp; Analyze
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2 text-xs sm:text-sm">
              <Radio className="w-4 h-4" /> Live Tracking
            </TabsTrigger>
            <TabsTrigger value="cropstatus" className="flex items-center gap-2 text-xs sm:text-sm">
              <Leaf className="w-4 h-4" /> Crop Status
            </TabsTrigger>
            <TabsTrigger value="animal" className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4" /> Animal Protection
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════════
              TAB 1 — Upload & Analyze
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="upload">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Panel */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-600" /> Upload Drone Imagery
                </h2>

                {/* Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center mb-5 transition-colors cursor-pointer ${dragOver ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-green-400'}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadPreview ? (
                    <div className="relative">
                      <img src={uploadPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={e => { e.stopPropagation(); setUploadedFile(null); setUploadPreview(''); setAnalysisResult(false); }}
                      ><X className="w-3 h-3" /></button>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                        <FileImage className="w-4 h-4" /> {uploadedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Drag &amp; drop drone images here</p>
                      <p className="text-sm text-gray-400 mt-1">Supports RGB, NDVI, Thermal formats (JPG, PNG)</p>
                      <Button variant="outline" className="mt-4" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse Files</Button>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }} />
                </div>

                {/* Field Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Field</label>
                  <Select onValueChange={setSelectedField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a field..." />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name} — {f.crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Type Selector */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Type</label>
                  <Select onValueChange={setImageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose image type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rgb">RGB (True Color)</SelectItem>
                      <SelectItem value="ndvi">NDVI (Vegetation Index)</SelectItem>
                      <SelectItem value="thermal">Thermal Imaging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain className="w-4 h-4 mr-2" /> Analyze with AI</>
                  )}
                </Button>
              </div>

              {/* Analysis Results */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" /> AI Analysis Results
                </h2>

                {!analysisResult ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Brain className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-center">Upload an image and click Analyze to see AI-powered insights</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Health + NDVI */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Crop Health</span>
                      <Badge className={healthBadgeClass('Good')}>Good</Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">NDVI Score</span>
                        <span className="font-semibold text-gray-900 dark:text-white">0.72</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Disease Risk</p>
                        <p className="font-semibold text-yellow-700 dark:text-yellow-400">Low (12%)</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pest Risk</p>
                        <p className="font-semibold text-green-700 dark:text-green-400">Minimal (5%)</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">Nutrient Deficiencies</p>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• Slight Nitrogen deficiency detected</li>
                        <li>• Potassium levels adequate</li>
                        <li>• Phosphorus within normal range</li>
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Irrigation Needed</p>
                        <p className="font-semibold text-cyan-700 dark:text-cyan-400">In 2 days</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Fertilizer</p>
                        <p className="font-semibold text-purple-700 dark:text-purple-400">Urea 20 kg/acre</p>
                      </div>
                    </div>
                    {/* Insight Cards */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        { label: 'Canopy Cover', value: '84%', icon: Leaf, color: 'green' },
                        { label: 'Stress Zones', value: '2 patches', icon: AlertTriangle, color: 'orange' },
                        { label: 'Growth Stage', value: 'Tillering', icon: TrendingUp, color: 'blue' },
                        { label: 'Est. Yield', value: '3.2 t/acre', icon: BarChart3, color: 'purple' },
                      ].map((insight) => (
                        <div key={insight.label} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-3">
                          <insight.icon className={`w-5 h-5 text-${insight.color}-500`} />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{insight.label}</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{insight.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════
              TAB 2 — Field Map
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="fieldmap">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-600" /> Field Health Map
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">NDVI-based crop health overview for all registered fields</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedMapField === field.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:shadow-md'}`}
                    onClick={() => setSelectedMapField(selectedMapField === field.id ? null : field.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{field.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{field.crop} · {field.area}</p>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>

                    {/* NDVI Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 dark:text-gray-400">NDVI</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{field.ndvi.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`${ndviColor(field.ndvi)} h-2.5 rounded-full transition-all`}
                          style={{ width: `${field.ndvi * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${healthBadgeClass(field.health)}`}>
                        {field.health}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {field.lastScan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* NDVI Legend */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">NDVI Color Legend</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { color: 'bg-green-500', label: '≥ 0.70 — Excellent / Good' },
                    { color: 'bg-yellow-400', label: '0.50–0.69 — Moderate' },
                    { color: 'bg-orange-400', label: '0.35–0.49 — Stressed' },
                    { color: 'bg-red-500', label: '< 0.35 — Critical' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════
              TAB 3 — Book Service
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="book">
            <div className="space-y-6">
              {/* Booking Form Modal */}
              {showBookingForm && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" /> Book: {bookingService}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Field *</label>
                      <Select onValueChange={setBookingField}>
                        <SelectTrigger><SelectValue placeholder="Choose field..." /></SelectTrigger>
                        <SelectContent>{fields.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                      <Input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Slot *</label>
                      <Select onValueChange={setBookingTime}>
                        <SelectTrigger><SelectValue placeholder="Choose time..." /></SelectTrigger>
                        <SelectContent>
                          {['06:00 AM','07:00 AM','08:00 AM','09:00 AM','10:00 AM','02:00 PM','03:00 PM','04:00 PM'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={confirmBooking}>Confirm Booking</Button>
                    <Button variant="outline" onClick={() => setShowBookingForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Service Cards */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" /> Available Drone Services
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {droneServices.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <service.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">{service.name}</p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-bold text-lg">{service.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                          <Clock className="w-3.5 h-3.5" /><span>{service.duration}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm" onClick={() => handleBookService(service.name)}>
                        Book Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Service</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Amount</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{booking.service}</td>
                          <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{booking.date}</td>
                          <td className="py-3 px-3 text-gray-700 dark:text-gray-300">
                            <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{booking.price.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadgeClass(booking.status)}`}>{booking.status}</span>
                          </td>
                          <td className="py-3 px-3">
                            {booking.status === 'Pending' && (
                              <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 text-xs" onClick={() => cancelBooking(booking.id)}>Cancel</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════
              TAB 4 — Live Tracking
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="tracking">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Drone Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-green-600" /> Drone Status
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={`flex items-center gap-1 ${isTracking ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                      <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      {isTracking ? 'Flying' : 'Idle'}
                    </Badge>
                    <Button size="sm" className={isTracking ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} onClick={() => setIsTracking(t => !t)}>
                      {isTracking ? 'Stop' : 'Start Tracking'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-yellow-600" /><span className="text-xs text-gray-500">Battery</span></div>
                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{battery.toFixed(0)}%</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div className={`h-1.5 rounded-full transition-all ${battery > 50 ? 'bg-green-500' : battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${battery}%` }} />
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-600" /><span className="text-xs text-gray-500">Altitude</span></div>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{altitude.toFixed(1)} m</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-purple-600" /><span className="text-xs text-gray-500">Speed</span></div>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{speed.toFixed(1)} km/h</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-green-600" /><span className="text-xs text-gray-500">Flight Time</span></div>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{formatTime(flightTime)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Satellite className="w-4 h-4" /> Live Telemetry
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GPS</span>
                    <span className="font-mono text-gray-900 dark:text-white text-xs">
                      {(28.6139 + dronePos.row * 0.001).toFixed(4)}°N, {(77.2090 + dronePos.col * 0.001).toFixed(4)}°E
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Signal</span>
                    <span className="text-green-600 font-medium">-42 dBm (Excellent)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance Covered</span>
                    <span className="text-gray-900 dark:text-white font-medium">{((dronePos.row * 10 + dronePos.col) * 0.024).toFixed(2)} km</span>
                  </div>
                </div>
              </div>

              {/* Flight Path Grid */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" /> Live Flight Path
                  {isTracking && <span className="text-xs text-green-600 font-normal animate-pulse">● Live</span>}
                </h2>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200 dark:border-green-800">
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
                    {Array.from({ length: 100 }).map((_, idx) => {
                      const row = Math.floor(idx / 10);
                      const col = idx % 10;
                      const isDrone = row === dronePos.row && col === dronePos.col;
                      const isPath = row < dronePos.row || (row === dronePos.row && col <= dronePos.col);
                      return (
                        <div key={idx} className={`w-full aspect-square rounded-sm transition-all duration-300 ${isDrone ? 'bg-red-500 scale-125 shadow-lg' : isPath ? 'bg-green-400 dark:bg-green-600' : 'bg-green-200 dark:bg-green-900/40'}`} />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm" /> Drone</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm" /> Path</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded-sm" /> Remaining</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {isTracking ? 'Drone moving automatically — updates every second' : 'Click "Start Tracking" to begin live simulation'}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════
              TAB 5 — Smart Advisory
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="advisory">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Advisory Cards */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" /> AI-Powered Smart Advisories
                </h2>
                {advisories.map((adv, idx) => (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-gray-900 border rounded-xl p-5 shadow-sm cursor-pointer transition-shadow hover:shadow-md ${
                      adv.color === 'red' ? 'border-red-200 dark:border-red-800' :
                      adv.color === 'orange' ? 'border-orange-200 dark:border-orange-800' :
                      'border-green-200 dark:border-green-800'
                    }`}
                    onClick={() => setExpandedAdvisory(expandedAdvisory === idx ? null : idx)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <adv.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          adv.color === 'red' ? 'text-red-500' :
                          adv.color === 'orange' ? 'text-orange-500' :
                          'text-green-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityBadgeClass(adv.priority)}`}>
                              {adv.priority}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{adv.field}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({adv.crop})</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{adv.issue}</p>
                        </div>
                      </div>
                      {expandedAdvisory === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    {expandedAdvisory === idx && (
                      <div className={`mt-4 pt-4 border-t ${
                        adv.color === 'red' ? 'border-red-100 dark:border-red-900' :
                        adv.color === 'orange' ? 'border-orange-100 dark:border-orange-900' :
                        'border-green-100 dark:border-green-900'
                      }`}>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommended Action:</p>
                        <p className={`text-sm font-semibold ${
                          adv.color === 'red' ? 'text-red-700 dark:text-red-400' :
                          adv.color === 'orange' ? 'text-orange-700 dark:text-orange-400' :
                          'text-green-700 dark:text-green-400'
                        }`}>{adv.action}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Weather Summary */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm h-fit">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" /> Weather Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Temperature', value: '24°C', icon: Thermometer, color: 'orange' },
                    { label: 'Humidity', value: '67%', icon: Droplets, color: 'blue' },
                    { label: 'Last Rain', value: '3 days ago', icon: Clock, color: 'gray' },
                    { label: 'Wind Speed', value: '12 km/h', icon: Activity, color: 'purple' },
                    { label: 'UV Index', value: '6 (High)', icon: Zap, color: 'yellow' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════════════════════════
              TAB 6 — Analytics
          ════════════════════════════════════════════════════════════ */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Avg NDVI', value: '0.58', icon: TrendingUp, color: 'green', sub: 'Across all fields' },
                  { label: 'Healthy Fields', value: '2 / 4', icon: CheckCircle, color: 'blue', sub: 'Good or better' },
                  { label: 'Scans This Month', value: '12', icon: Camera, color: 'purple', sub: 'Total drone scans' },
                  { label: 'Issues Detected', value: '5', icon: AlertTriangle, color: 'red', sub: 'Needs attention' },
                ].map((metric) => (
                  <div key={metric.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon className={`w-5 h-5 text-${metric.color}-500`} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{metric.sub}</p>
                  </div>
                ))}
              </div>

              {/* Monthly Health Trend Table */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" /> Monthly NDVI Health Trend
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Month</th>
                        <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Field A (Wheat)</th>
                        <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Field B (Rice)</th>
                        <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Field C (Cotton)</th>
                        <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">Field D (Tomato)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrend.map((row) => (
                        <tr key={row.month} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{row.month}</td>
                          {[row.fieldA, row.fieldB, row.fieldC, row.fieldD].map((val, i) => (
                            <td key={i} className="py-3 px-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-semibold text-gray-900 dark:text-white">{val.toFixed(2)}</span>
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div
                                    className={`${ndviColor(val)} h-1.5 rounded-full`}
                                    style={{ width: `${val * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Crop Health Distribution */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" /> Crop Health Distribution
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Excellent', count: 1, color: 'green', field: 'Field C' },
                    { label: 'Good', count: 1, color: 'blue', field: 'Field A' },
                    { label: 'Moderate', count: 0, color: 'yellow', field: '—' },
                    { label: 'Stressed', count: 1, color: 'orange', field: 'Field B' },
                    { label: 'Critical', count: 1, color: 'red', field: 'Field D' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl p-4 text-center border ${
                        item.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                        item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                        item.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                        item.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <p className={`text-3xl font-bold mb-1 ${
                        item.color === 'green' ? 'text-green-700 dark:text-green-400' :
                        item.color === 'blue' ? 'text-blue-700 dark:text-blue-400' :
                        item.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-400' :
                        item.color === 'orange' ? 'text-orange-700 dark:text-orange-400' :
                        'text-red-700 dark:text-red-400'
                      }`}>{item.count}</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.field}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default DroneIntelligence;
