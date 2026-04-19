import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Wind, Thermometer, Sun, CloudRain, Sprout, Scissors, Bug, Tractor, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── Agricultural events per month (1-indexed) ──────────────────────────────
const MONTHLY_CROP_EVENTS: Record<number, { crop: string; activity: string; type: 'sow' | 'harvest' | 'spray' | 'irrigate' | 'fertilize' | 'prepare' }[]> = {
  1:  [ // January
    { crop: 'Wheat',     activity: 'Top-dress urea (2nd dose)',         type: 'fertilize' },
    { crop: 'Mustard',   activity: 'Irrigation at flowering stage',     type: 'irrigate'  },
    { crop: 'Potato',    activity: 'Earthing up & hilling',             type: 'prepare'   },
    { crop: 'Pea',       activity: 'Harvest early varieties',           type: 'harvest'   },
    { crop: 'Tomato',    activity: 'Transplanting in plains',           type: 'sow'       },
  ],
  2:  [ // February
    { crop: 'Wheat',     activity: 'Irrigation at grain filling',       type: 'irrigate'  },
    { crop: 'Sugarcane', activity: 'Sowing / ratoon management',        type: 'sow'       },
    { crop: 'Potato',    activity: 'Harvest early crop',                type: 'harvest'   },
    { crop: 'Onion',     activity: 'Transplanting Rabi onion',          type: 'sow'       },
    { crop: 'Mustard',   activity: 'Harvest when 75% pods turn yellow', type: 'harvest'   },
  ],
  3:  [ // March
    { crop: 'Wheat',     activity: 'Harvest (plains)',                  type: 'harvest'   },
    { crop: 'Sugarcane', activity: 'Apply nitrogen fertilizer',         type: 'fertilize' },
    { crop: 'Maize',     activity: 'Summer maize sowing begins',        type: 'sow'       },
    { crop: 'Groundnut', activity: 'Land preparation for Kharif',       type: 'prepare'   },
    { crop: 'Watermelon',activity: 'Sowing in sandy loam fields',       type: 'sow'       },
  ],
  4:  [ // April
    { crop: 'Wheat',     activity: 'Harvest (hills & late areas)',      type: 'harvest'   },
    { crop: 'Maize',     activity: 'Thinning & gap filling',            type: 'prepare'   },
    { crop: 'Sunflower', activity: 'Harvest summer crop',               type: 'harvest'   },
    { crop: 'Tomato',    activity: 'Spray for fruit borer',             type: 'spray'     },
    { crop: 'Mango',     activity: 'Spray for hopper & mealybug',       type: 'spray'     },
  ],
  5:  [ // May
    { crop: 'Cotton',    activity: 'Sowing begins (BT varieties)',      type: 'sow'       },
    { crop: 'Soybean',   activity: 'Land preparation',                  type: 'prepare'   },
    { crop: 'Maize',     activity: 'Harvest summer crop',               type: 'harvest'   },
    { crop: 'Groundnut', activity: 'Sowing Kharif groundnut',           type: 'sow'       },
    { crop: 'Sugarcane', activity: 'Irrigation every 10 days',          type: 'irrigate'  },
  ],
  6:  [ // June
    { crop: 'Rice',      activity: 'Nursery sowing (Kharif)',           type: 'sow'       },
    { crop: 'Soybean',   activity: 'Sowing after first rain',           type: 'sow'       },
    { crop: 'Cotton',    activity: 'Thinning & gap filling',            type: 'prepare'   },
    { crop: 'Maize',     activity: 'Kharif maize sowing',               type: 'sow'       },
    { crop: 'Turmeric',  activity: 'Planting rhizomes',                 type: 'sow'       },
  ],
  7:  [ // July
    { crop: 'Rice',      activity: 'Transplanting paddy',               type: 'sow'       },
    { crop: 'Soybean',   activity: 'Spray for stem fly & girdle beetle',type: 'spray'     },
    { crop: 'Cotton',    activity: 'Apply potash fertilizer',           type: 'fertilize' },
    { crop: 'Maize',     activity: 'Top-dress urea at knee height',     type: 'fertilize' },
    { crop: 'Groundnut', activity: 'Spray for tikka leaf spot',         type: 'spray'     },
  ],
  8:  [ // August
    { crop: 'Rice',      activity: 'Apply nitrogen top-dressing',       type: 'fertilize' },
    { crop: 'Soybean',   activity: 'Spray for pod borer',               type: 'spray'     },
    { crop: 'Cotton',    activity: 'Monitor for bollworm',              type: 'spray'     },
    { crop: 'Onion',     activity: 'Kharif onion transplanting',        type: 'sow'       },
    { crop: 'Wheat',     activity: 'Land preparation for Rabi',         type: 'prepare'   },
  ],
  9:  [ // September
    { crop: 'Rice',      activity: 'Drain field before harvest',        type: 'irrigate'  },
    { crop: 'Soybean',   activity: 'Harvest when leaves turn yellow',   type: 'harvest'   },
    { crop: 'Maize',     activity: 'Harvest Kharif crop',               type: 'harvest'   },
    { crop: 'Wheat',     activity: 'Seed treatment & procurement',      type: 'prepare'   },
    { crop: 'Potato',    activity: 'Land preparation',                  type: 'prepare'   },
  ],
  10: [ // October
    { crop: 'Wheat',     activity: 'Sowing begins (timely sown)',       type: 'sow'       },
    { crop: 'Rice',      activity: 'Harvest Kharif paddy',              type: 'harvest'   },
    { crop: 'Mustard',   activity: 'Sowing begins',                     type: 'sow'       },
    { crop: 'Potato',    activity: 'Sowing begins',                     type: 'sow'       },
    { crop: 'Chickpea',  activity: 'Sowing Rabi chickpea',              type: 'sow'       },
  ],
  11: [ // November
    { crop: 'Wheat',     activity: 'First irrigation (CRI stage)',      type: 'irrigate'  },
    { crop: 'Mustard',   activity: 'Thinning at 15 days',               type: 'prepare'   },
    { crop: 'Potato',    activity: 'Spray for late blight',             type: 'spray'     },
    { crop: 'Onion',     activity: 'Rabi onion nursery sowing',         type: 'sow'       },
    { crop: 'Sugarcane', activity: 'Harvest early maturing varieties',  type: 'harvest'   },
  ],
  12: [ // December
    { crop: 'Wheat',     activity: '2nd irrigation at tillering',       type: 'irrigate'  },
    { crop: 'Mustard',   activity: 'Spray for aphids',                  type: 'spray'     },
    { crop: 'Potato',    activity: 'Earthing up',                       type: 'prepare'   },
    { crop: 'Chickpea',  activity: 'Spray for pod borer',               type: 'spray'     },
    { crop: 'Sugarcane', activity: 'Main harvest season',               type: 'harvest'   },
  ],
};

// Weather advisory per season
const SEASON_ADVISORY: Record<string, { title: string; tips: string[] }> = {
  Winter: {
    title: 'Winter Advisory (Dec–Feb)',
    tips: [
      'Protect nurseries from frost using polythene covers at night',
      'Irrigate crops in the morning to reduce frost damage',
      'Avoid spraying pesticides on foggy days — poor absorption',
      'Monitor wheat for yellow rust after foggy spells',
      'Harvest mustard before heavy dew causes shattering',
    ],
  },
  Spring: {
    title: 'Spring Advisory (Mar–May)',
    tips: [
      'Harvest wheat before temperature exceeds 35°C to avoid grain shrivelling',
      'Irrigate summer crops in early morning or evening',
      'Watch for heat stress in vegetables — mulch to retain moisture',
      'Apply potash to improve heat tolerance in crops',
      'Scout for sucking pests (aphids, thrips) in warm dry conditions',
    ],
  },
  Monsoon: {
    title: 'Kharif / Monsoon Advisory (Jun–Sep)',
    tips: [
      'Ensure proper field drainage to prevent waterlogging',
      'Spray fungicides before heavy rain to prevent blight',
      'Do not apply urea just before heavy rain — leaching loss',
      'Scout for stem borer in rice after transplanting',
      'Use weather forecast before spraying — avoid rainy days',
    ],
  },
  Autumn: {
    title: 'Autumn Advisory (Oct–Nov)',
    tips: [
      'Complete Kharif harvest before unseasonal rain',
      'Treat wheat seed with Thiram 75 WP before sowing',
      'Sow mustard in well-prepared, moist soil',
      'Apply basal dose of DAP at sowing time',
      'Ensure irrigation infrastructure is ready for Rabi season',
    ],
  },
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const activityConfig = {
  sow:       { color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',   icon: <Sprout className="h-3 w-3" />,    label: 'Sow'       },
  harvest:   { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', icon: <Scissors className="h-3 w-3" />, label: 'Harvest'   },
  spray:     { color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',           icon: <Bug className="h-3 w-3" />,       label: 'Spray'     },
  irrigate:  { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',       icon: <Droplets className="h-3 w-3" />,  label: 'Irrigate'  },
  fertilize: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300', icon: <Sprout className="h-3 w-3" />, label: 'Fertilize' },
  prepare:   { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300', icon: <Tractor className="h-3 w-3" />, label: 'Prepare'   },
};

function getSeason(month: number): string {
  if (month >= 12 || month <= 2) return 'Winter';
  if (month >= 3  && month <= 5) return 'Spring';
  if (month >= 6  && month <= 9) return 'Monsoon';
  return 'Autumn';
}

// Generate a deterministic "weather hint" for any date
function getDayWeatherHint(day: number, month: number): { icon: React.ReactNode; text: string } {
  const seed = (day * 7 + month * 31) % 5;
  const hints = [
    { icon: <Sun className="h-4 w-4 text-yellow-500" />,       text: 'Sunny — good for field work' },
    { icon: <CloudRain className="h-4 w-4 text-blue-500" />,   text: 'Rain likely — avoid spraying' },
    { icon: <Wind className="h-4 w-4 text-gray-500" />,        text: 'Windy — delay pesticide spray' },
    { icon: <Thermometer className="h-4 w-4 text-red-500" />,  text: 'Hot day — irrigate in evening' },
    { icon: <Droplets className="h-4 w-4 text-cyan-500" />,    text: 'Humid — watch for fungal risk' },
  ];
  return hints[seed];
}

// ── Do's and Don'ts based on weather hint and month ──────────────────────
function getDosAndDonts(hint: string, month: number): { type: 'do' | 'dont'; text: string }[] {
  const isRainy   = hint.includes('Rain');
  const isWindy   = hint.includes('Windy');
  const isHot     = hint.includes('Hot');
  const isHumid   = hint.includes('Humid');
  const isSunny   = hint.includes('Sunny');
  const season    = getSeason(month);

  const items: { type: 'do' | 'dont'; text: string }[] = [];

  if (isSunny) {
    items.push({ type: 'do',   text: 'Ideal day for harvesting and threshing' });
    items.push({ type: 'do',   text: 'Apply foliar spray in early morning' });
    items.push({ type: 'dont', text: 'Avoid spraying after 10 AM — evaporation loss' });
  }
  if (isRainy) {
    items.push({ type: 'do',   text: 'Check field drainage channels' });
    items.push({ type: 'do',   text: 'Skip irrigation — rain is sufficient' });
    items.push({ type: 'dont', text: 'Do not apply fertilizer — leaching risk' });
    items.push({ type: 'dont', text: 'Avoid pesticide spraying — wash-off risk' });
  }
  if (isWindy) {
    items.push({ type: 'dont', text: 'Do not spray pesticides — drift hazard' });
    items.push({ type: 'do',   text: 'Secure polythene mulch and shade nets' });
    items.push({ type: 'do',   text: 'Good day for winnowing harvested grain' });
  }
  if (isHot) {
    items.push({ type: 'do',   text: 'Irrigate crops in evening (4–7 PM)' });
    items.push({ type: 'do',   text: 'Provide shade for nursery seedlings' });
    items.push({ type: 'dont', text: 'Avoid transplanting during peak heat' });
  }
  if (isHumid) {
    items.push({ type: 'do',   text: 'Scout crops for fungal disease symptoms' });
    items.push({ type: 'do',   text: 'Apply preventive fungicide if needed' });
    items.push({ type: 'dont', text: 'Avoid dense planting — poor air circulation' });
  }
  if (season === 'Winter') {
    items.push({ type: 'do',   text: 'Cover nursery beds at night against frost' });
    items.push({ type: 'dont', text: 'Avoid irrigating in the evening — frost risk' });
  }
  if (season === 'Monsoon') {
    items.push({ type: 'do',   text: 'Maintain bunds to conserve rainwater' });
    items.push({ type: 'dont', text: 'Do not leave harvested produce in open field' });
  }
  // Always add a general tip
  items.push({ type: 'do', text: 'Keep a farm diary — record activities & observations' });

  return items.slice(0, 6);
}

// ── Pest & disease risk by month ──────────────────────────────────────────
function getPestRisk(month: number): { name: string; level: number; label: string; color: string; textColor: string }[] {
  const risks: Record<number, { name: string; level: number }[]> = {
    1:  [{ name: 'Aphids (Wheat)',      level: 60 }, { name: 'Yellow Rust',       level: 50 }, { name: 'Late Blight (Potato)', level: 70 }],
    2:  [{ name: 'Aphids (Mustard)',    level: 75 }, { name: 'Powdery Mildew',    level: 55 }, { name: 'White Fly',            level: 40 }],
    3:  [{ name: 'Stem Borer',          level: 45 }, { name: 'Leaf Miner',        level: 50 }, { name: 'Fruit Fly',            level: 35 }],
    4:  [{ name: 'Fruit Borer',         level: 65 }, { name: 'Mango Hopper',      level: 80 }, { name: 'Thrips',               level: 55 }],
    5:  [{ name: 'Bollworm (Cotton)',   level: 50 }, { name: 'Whitefly',          level: 60 }, { name: 'Jassid',               level: 45 }],
    6:  [{ name: 'Stem Fly (Soybean)', level: 55 }, { name: 'Leaf Folder (Rice)',level: 40 }, { name: 'Downy Mildew',         level: 65 }],
    7:  [{ name: 'Stem Borer (Rice)',   level: 70 }, { name: 'Girdle Beetle',     level: 60 }, { name: 'Tikka Leaf Spot',      level: 55 }],
    8:  [{ name: 'Pod Borer',           level: 75 }, { name: 'Bollworm',          level: 80 }, { name: 'Blast (Rice)',         level: 65 }],
    9:  [{ name: 'Neck Blast (Rice)',   level: 60 }, { name: 'Sheath Blight',     level: 55 }, { name: 'Aphids',               level: 40 }],
    10: [{ name: 'Aphids (Wheat)',      level: 35 }, { name: 'Cut Worm',          level: 50 }, { name: 'Root Rot',             level: 40 }],
    11: [{ name: 'Late Blight',         level: 70 }, { name: 'Aphids (Mustard)',  level: 55 }, { name: 'White Grub',           level: 45 }],
    12: [{ name: 'Aphids (Wheat)',      level: 50 }, { name: 'Pod Borer (Gram)',  level: 60 }, { name: 'Powdery Mildew',       level: 45 }],
  };

  return (risks[month] ?? risks[1]).map(r => ({
    ...r,
    label: r.level >= 70 ? 'High' : r.level >= 50 ? 'Medium' : 'Low',
    color: r.level >= 70 ? 'bg-red-500' : r.level >= 50 ? 'bg-yellow-500' : 'bg-green-500',
    textColor: r.level >= 70 ? 'text-red-600' : r.level >= 50 ? 'text-yellow-600' : 'text-green-600',
  }));
}

interface AgriculturalCalendarProps {
  weatherData?: { location?: string } | null;
}

const AgriculturalCalendar: React.FC<AgriculturalCalendarProps> = ({ weatherData }) => {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const season   = getSeason(viewMonth);
  const advisory = SEASON_ADVISORY[season];
  const events   = MONTHLY_CROP_EVENTS[viewMonth] ?? [];

  // Build calendar grid
  const firstDow  = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear();

  const selectedHint = selectedDay ? getDayWeatherHint(selectedDay, viewMonth) : null;

  return (
    <div className="space-y-6">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Agricultural Calendar
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {weatherData?.location ?? 'Your Farm'} · Click any date for farming advice
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-semibold text-base w-40 text-center">{MONTHS[viewMonth - 1]} {viewYear}</span>
          <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Calendar grid ── */}
        <div className="lg:col-span-2 glass-card p-4 rounded-2xl">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">{d}</div>
            ))}
          </div>
          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const hint = getDayWeatherHint(day, viewMonth);
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    relative flex flex-col items-center justify-start rounded-xl p-1.5 min-h-[52px] text-sm transition-all
                    ${isToday(day) ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/30 font-bold' : ''}
                    ${selectedDay === day && !isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-400' : ''}
                    ${!isToday(day) && selectedDay !== day ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''}
                  `}
                >
                  <span className={`text-xs font-semibold ${isToday(day) ? 'text-green-700 dark:text-green-300' : ''}`}>{day}</span>
                  <span className="mt-0.5">{hint.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
            {Object.entries(activityConfig).map(([key, cfg]) => (
              <span key={key} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-4">

          {/* Selected day detail — FULL INFO */}
          {selectedDay ? (
            <div className="space-y-3">
              {/* Date header */}
              <div className="glass-card p-4 rounded-2xl border-l-4 border-blue-500">
                <h4 className="font-bold text-base mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {selectedDay} {MONTHS[viewMonth - 1]} {viewYear}
                </h4>
                {selectedHint && (
                  <div className="flex items-center gap-2 text-sm font-medium mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    {selectedHint.icon}
                    <span>{selectedHint.text}</span>
                  </div>
                )}
                {/* Best working hours */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                    <p className="text-green-700 dark:text-green-300 font-semibold">🌅 Best Morning</p>
                    <p className="font-bold text-green-800 dark:text-green-200">6:00 – 9:00 AM</p>
                    <p className="text-gray-500">Cool, low wind</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
                    <p className="text-orange-700 dark:text-orange-300 font-semibold">🌇 Best Evening</p>
                    <p className="font-bold text-orange-800 dark:text-orange-200">4:00 – 7:00 PM</p>
                    <p className="text-gray-500">After peak heat</p>
                  </div>
                </div>
              </div>

              {/* Crop activities */}
              <div className="glass-card p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  🌾 Crop Activities This Month
                </p>
                <div className="space-y-2">
                  {events.map((ev, i) => {
                    const cfg = activityConfig[ev.type];
                    return (
                      <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${cfg.color}`}>
                        <span className="mt-0.5 shrink-0">{cfg.icon}</span>
                        <div>
                          <span className="font-bold">{ev.crop}</span>
                          <span className="mx-1">—</span>
                          <span>{ev.activity}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Do's and Don'ts */}
              <div className="glass-card p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  ✅ Do's & ❌ Don'ts
                </p>
                <div className="space-y-1.5 text-xs">
                  {getDosAndDonts(selectedHint?.text ?? '', viewMonth).map((item, i) => (
                    <div key={i} className={`flex items-start gap-2 rounded-lg px-2 py-1.5
                      ${item.type === 'do'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}>
                      <span className="shrink-0 font-bold">{item.type === 'do' ? '✓' : '✗'}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pest & disease risk */}
              <div className="glass-card p-4 rounded-2xl">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  🐛 Pest & Disease Risk
                </p>
                {getPestRisk(viewMonth).map((risk, i) => (
                  <div key={i} className="flex items-center justify-between mb-2">
                    <span className="text-xs">{risk.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${risk.color}`} style={{ width: `${risk.level}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${risk.textColor}`}>{risk.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center text-gray-400">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Click any date to see full farming information</p>
            </div>
          )}

          {/* Season advisory */}
          <div className="glass-card p-4 rounded-2xl border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-600 text-white text-xs">{season}</Badge>
              <h4 className="font-semibold text-sm">{advisory.title}</h4>
            </div>
            <ul className="space-y-2">
              {advisory.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Monthly summary */}
          <div className="glass-card p-4 rounded-2xl">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-1">
              <Sprout className="h-4 w-4 text-green-600" />
              {MONTHS[viewMonth - 1]} at a Glance
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <p className="text-lg font-bold text-green-600">{events.filter(e => e.type === 'sow').length}</p>
                <p className="text-xs text-gray-500">Sowing</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2">
                <p className="text-lg font-bold text-yellow-600">{events.filter(e => e.type === 'harvest').length}</p>
                <p className="text-xs text-gray-500">Harvest</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <p className="text-lg font-bold text-blue-600">{events.filter(e => e.type === 'irrigate' || e.type === 'spray' || e.type === 'fertilize').length}</p>
                <p className="text-xs text-gray-500">Care</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Full month activity table ── */}
      <div className="glass-card p-5 rounded-2xl">
        <h4 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Tractor className="h-4 w-4 text-orange-500" />
          All Crop Activities — {MONTHS[viewMonth - 1]} {viewYear}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">Crop</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-600 dark:text-gray-300">Activity</th>
                <th className="text-left py-2 font-semibold text-gray-600 dark:text-gray-300">Type</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, i) => {
                const cfg = activityConfig[ev.type];
                return (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2.5 pr-4 font-medium">{ev.crop}</td>
                    <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-300">{ev.activity}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalCalendar;
