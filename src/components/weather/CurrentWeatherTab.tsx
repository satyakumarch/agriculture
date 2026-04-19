import React from 'react';
import {
  Thermometer, Droplets, Wind, Eye, Gauge, Sun, Sunrise, Sunset,
  CloudRain, AlertTriangle, CheckCircle, Leaf, Clock
} from 'lucide-react';

interface WeatherData {
  location: string;
  date: string;
  temperature: number;
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'stormy' | 'drizzle';
  humidity: number;
  windSpeed: number;
  precipitation: number;
  temperatureUnit?: string;
  description?: string;
  feelsLike?: number;
  pressure?: number;
  visibility?: number;
  sunrise?: string;
  sunset?: string;
}

interface CurrentWeatherTabProps {
  weatherData: WeatherData | null;
}

const weatherEmoji: Record<string, string> = {
  sunny: '☀️', cloudy: '☁️', rainy: '🌧️',
  snowy: '❄️', windy: '💨', stormy: '⛈️', drizzle: '🌦️',
};

function getUVIndex(temp: number, type: string) {
  if (type === 'sunny' && temp > 32) return { value: 9, label: 'Very High', color: 'text-red-600' };
  if (type === 'sunny' && temp > 25) return { value: 6, label: 'High',      color: 'text-orange-500' };
  if (type === 'cloudy')             return { value: 3, label: 'Moderate',  color: 'text-yellow-500' };
  if (type === 'rainy' || type === 'stormy') return { value: 1, label: 'Low', color: 'text-green-600' };
  return { value: 4, label: 'Moderate', color: 'text-yellow-500' };
}

function getDewPoint(temp: number, humidity: number) {
  // Magnus formula approximation
  return Math.round(temp - ((100 - humidity) / 5));
}

function getFarmingAdvice(data: WeatherData): { icon: React.ReactNode; text: string; ok: boolean }[] {
  const advice = [];
  const { temperature, humidity, windSpeed, weatherType, precipitation } = data;

  advice.push({
    ok: weatherType === 'sunny' || weatherType === 'cloudy',
    icon: <Leaf className="h-4 w-4" />,
    text: weatherType === 'sunny' || weatherType === 'cloudy'
      ? 'Good conditions for field operations today'
      : 'Avoid heavy field work — wet/stormy conditions',
  });

  advice.push({
    ok: windSpeed < 20,
    icon: <Wind className="h-4 w-4" />,
    text: windSpeed < 20
      ? `Wind ${windSpeed} km/h — safe for pesticide spraying`
      : `Wind ${windSpeed} km/h — too windy for spraying, drift risk`,
  });

  advice.push({
    ok: humidity < 80,
    icon: <Droplets className="h-4 w-4" />,
    text: humidity < 80
      ? `Humidity ${humidity}% — low fungal disease risk`
      : `Humidity ${humidity}% — high fungal risk, scout crops`,
  });

  advice.push({
    ok: temperature >= 15 && temperature <= 35,
    icon: <Thermometer className="h-4 w-4" />,
    text: temperature > 35
      ? `${temperature}°C — heat stress risk, irrigate in evening`
      : temperature < 15
      ? `${temperature}°C — cold stress possible, protect seedlings`
      : `${temperature}°C — ideal temperature for crop growth`,
  });

  advice.push({
    ok: precipitation === 0,
    icon: <CloudRain className="h-4 w-4" />,
    text: precipitation > 0
      ? `${precipitation.toFixed(1)} mm rain — skip irrigation today`
      : 'No rainfall — check soil moisture & irrigate if needed',
  });

  return advice;
}

const MetricCard = ({ label, value, sub, icon, color = 'text-gray-800 dark:text-gray-100' }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; color?: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const CurrentWeatherTab = ({ weatherData }: CurrentWeatherTabProps) => {
  if (!weatherData) return null;

  const uv = getUVIndex(weatherData.temperature, weatherData.weatherType);
  const dewPoint = getDewPoint(weatherData.temperature, weatherData.humidity);
  const farmingAdvice = getFarmingAdvice(weatherData);
  const emoji = weatherEmoji[weatherData.weatherType] ?? '🌤️';

  return (
    <div className="space-y-6">

      {/* ── Hero card ── */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
              <Clock className="h-3.5 w-3.5" /> {weatherData.date}
            </p>
            <h2 className="text-2xl font-bold mb-1">{weatherData.location}</h2>
            <p className="text-gray-500 dark:text-gray-400 capitalize">{weatherData.description ?? weatherData.weatherType}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-7xl">{emoji}</span>
            <div>
              <p className="text-6xl font-bold text-blue-600 dark:text-blue-400">{weatherData.temperature}°C</p>
              <p className="text-sm text-gray-500 mt-1">Feels like {weatherData.feelsLike ?? weatherData.temperature}°C</p>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
          {[
            { label: 'Humidity',    value: `${weatherData.humidity}%`,                icon: '💧' },
            { label: 'Wind',        value: `${weatherData.windSpeed} km/h`,            icon: '💨' },
            { label: 'Pressure',    value: `${weatherData.pressure ?? '—'} hPa`,       icon: '🌡️' },
            { label: 'Visibility',  value: `${weatherData.visibility ?? '—'} km`,      icon: '👁️' },
            { label: 'Dew Point',   value: `${dewPoint}°C`,                            icon: '🌫️' },
            { label: 'Rain',        value: `${weatherData.precipitation.toFixed(1)} mm`, icon: '🌧️' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg">{s.icon}</p>
              <p className="text-sm font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Metrics grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Temperature"
          value={`${weatherData.temperature}°C`}
          sub={`Feels ${weatherData.feelsLike ?? weatherData.temperature}°C`}
          icon={<Thermometer className="h-5 w-5 text-red-500" />}
          color="text-red-600"
        />
        <MetricCard
          label="Humidity"
          value={`${weatherData.humidity}%`}
          sub={weatherData.humidity > 80 ? 'High — fungal risk' : 'Normal range'}
          icon={<Droplets className="h-5 w-5 text-blue-500" />}
          color="text-blue-600"
        />
        <MetricCard
          label="Wind Speed"
          value={`${weatherData.windSpeed} km/h`}
          sub={weatherData.windSpeed > 20 ? 'Avoid spraying' : 'Safe for spraying'}
          icon={<Wind className="h-5 w-5 text-gray-500" />}
        />
        <MetricCard
          label="Pressure"
          value={`${weatherData.pressure ?? '—'} hPa`}
          sub={(weatherData.pressure ?? 1013) < 1000 ? 'Low — rain likely' : 'Stable conditions'}
          icon={<Gauge className="h-5 w-5 text-purple-500" />}
          color="text-purple-600"
        />
        <MetricCard
          label="Visibility"
          value={`${weatherData.visibility ?? '—'} km`}
          sub={(weatherData.visibility ?? 10) < 5 ? 'Poor — foggy' : 'Clear visibility'}
          icon={<Eye className="h-5 w-5 text-cyan-500" />}
          color="text-cyan-600"
        />
        <MetricCard
          label="UV Index"
          value={`${uv.value} — ${uv.label}`}
          sub="Protect workers in field"
          icon={<Sun className="h-5 w-5 text-yellow-500" />}
          color={uv.color}
        />
        <MetricCard
          label="Sunrise"
          value={weatherData.sunrise ?? '—'}
          sub="Start field work after"
          icon={<Sunrise className="h-5 w-5 text-orange-400" />}
          color="text-orange-500"
        />
        <MetricCard
          label="Sunset"
          value={weatherData.sunset ?? '—'}
          sub="Wrap up field work by"
          icon={<Sunset className="h-5 w-5 text-orange-600" />}
          color="text-orange-600"
        />
      </div>

      {/* ── Farming advice ── */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Today's Farming Advisory — {weatherData.location}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {farmingAdvice.map((a, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm
                ${a.ok
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}
            >
              <span className="shrink-0 mt-0.5">
                {a.ok
                  ? <CheckCircle className="h-4 w-4 text-green-600" />
                  : <AlertTriangle className="h-4 w-4 text-red-500" />
                }
              </span>
              <span className="flex items-center gap-1.5">{a.icon}{a.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alert banner ── */}
      <div className={`rounded-xl p-4 border flex items-start gap-3
        ${weatherData.temperature > 35 || weatherData.weatherType === 'stormy'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}
      >
        <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${
          weatherData.temperature > 35 || weatherData.weatherType === 'stormy'
            ? 'text-red-500' : 'text-green-600'
        }`} />
        <div>
          <p className="font-semibold text-sm mb-0.5">
            {weatherData.temperature > 35 || weatherData.weatherType === 'stormy'
              ? '⚠️ Weather Alert'
              : '✅ No Active Alerts'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {weatherData.temperature > 35
              ? `Extreme heat (${weatherData.temperature}°C) — irrigate crops in early morning or evening. Provide shade for livestock.`
              : weatherData.weatherType === 'stormy'
              ? 'Thunderstorm warning — secure farm equipment, avoid open fields, delay all spraying operations.'
              : weatherData.weatherType === 'rainy'
              ? `Rainfall recorded (${weatherData.precipitation.toFixed(1)} mm) — skip irrigation, check drainage channels.`
              : `Conditions are favourable for regular farming activities in ${weatherData.location}.`
            }
          </p>
        </div>
      </div>

    </div>
  );
};

export default CurrentWeatherTab;
