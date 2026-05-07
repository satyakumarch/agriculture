
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

// Import the utility functions
import { formatDate, mapWeatherTypeFromCode } from '@/components/weather/WeatherUtils';

// Import the component for each section
import Header from '@/components/weather/Header';
import SearchBar from '@/components/weather/SearchBar';
import CurrentWeatherTab from '@/components/weather/CurrentWeatherTab';
import ForecastTab from '@/components/weather/ForecastTab';
import AgriculturalCalendar from '@/components/weather/AgriculturalCalendar';
import WeatherFeatures from '@/components/weather/WeatherFeatures';

const Weather = () => {
  const [searchLocation, setSearchLocation] = useState('Mumbai');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Working API key
  const API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04';

  const fetchWeatherData = async (location: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
      );

      if (!currentRes.ok) {
        const errData = await currentRes.json();
        if (currentRes.status === 401) throw new Error('API key invalid. Showing demo data.');
        throw new Error('Location not found. Please try another city name.');
      }

      const currentData = await currentRes.json();

      // 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
      );
      if (!forecastRes.ok) throw new Error('Failed to fetch forecast data.');
      const forecastData = await forecastRes.json();

      const tz = currentData.timezone;

      const formattedCurrent = {
        location: `${currentData.name}, ${currentData.sys.country}`,
        date: formatDate(currentData.dt, tz),
        temperature: Math.round(currentData.main.temp),
        weatherType: mapWeatherTypeFromCode(currentData.weather[0].id),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        precipitation: currentData.rain ? currentData.rain['1h'] || 0 : 0,
        temperatureUnit: 'C',
        description: currentData.weather[0].description,
        feelsLike: Math.round(currentData.main.feels_like),
        pressure: currentData.main.pressure,
        visibility: Math.round((currentData.visibility || 10000) / 1000),
        sunrise: new Date((currentData.sys.sunrise + tz) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date((currentData.sys.sunset + tz) * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      const dailyForecasts: any[] = [];
      const processedDates = new Set();
      forecastData.list.forEach((item: any) => {
        const dateStr = new Date((item.dt + forecastData.city.timezone) * 1000).toISOString().split('T')[0];
        if (!processedDates.has(dateStr) && dateStr !== new Date().toISOString().split('T')[0]) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            location: `${forecastData.city.name}, ${forecastData.city.country}`,
            date: formatDate(item.dt, forecastData.city.timezone),
            temperature: Math.round(item.main.temp),
            weatherType: mapWeatherTypeFromCode(item.weather[0].id),
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            precipitation: item.rain ? item.rain['3h'] / 3 || 0 : 0,
            temperatureUnit: 'C',
          });
        }
      });

      setWeatherData(formattedCurrent);
      setForecastData(dailyForecasts.slice(0, 5));
      toast({ title: t.weather.weatherUpdated, description: `${t.weather.showingWeatherFor} ${formattedCurrent.location}` });

    } catch (err: any) {
      console.error('Weather fetch error:', err);
      // Show demo data so the page still works
      const demoData = {
        location: `${location} (Demo)`,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        temperature: 28,
        weatherType: 'sunny' as const,
        humidity: 65,
        windSpeed: 14,
        precipitation: 0,
        temperatureUnit: 'C',
        description: 'Clear sky',
        feelsLike: 30,
        pressure: 1013,
        visibility: 10,
        sunrise: '06:15 AM',
        sunset: '06:45 PM',
      };
      const demoForecast = ['Mon','Tue','Wed','Thu','Fri'].map((day, i) => ({
        location: `${location} (Demo)`,
        date: day,
        temperature: 25 + i,
        weatherType: (['sunny','cloudy','rainy','sunny','cloudy'] as const)[i],
        humidity: 60 + i * 3,
        windSpeed: 10 + i * 2,
        precipitation: i === 2 ? 5 : 0,
        temperatureUnit: 'C',
      }));
      setWeatherData(demoData);
      setForecastData(demoForecast);
      setError(`Note: ${err.message} — showing demo data.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      fetchWeatherData(searchLocation.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchWeatherData('Mumbai');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4">
          <Header />
          
          <div className="max-w-6xl mx-auto">
            <SearchBar 
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
              handleSearch={handleSearch}
              isLoading={isLoading}
              handleKeyPress={handleKeyPress}
            />
            
            {error && (
              <div className="mb-8 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
                {error}
              </div>
            )}
            
            {isLoading && !weatherData ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {weatherData && (
                  <Tabs defaultValue="current" className="mb-12">
                    <TabsList className="w-full max-w-sm mx-auto grid grid-cols-3 mb-8">
                      <TabsTrigger value="current">{t.weather.current}</TabsTrigger>
                      <TabsTrigger value="forecast">{t.weather.forecast}</TabsTrigger>
                      <TabsTrigger value="calendar">{t.weather.calendar}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="current">
                      <CurrentWeatherTab weatherData={weatherData} />
                    </TabsContent>
                    
                    <TabsContent value="forecast">
                      <ForecastTab forecastData={forecastData} weatherData={weatherData} />
                    </TabsContent>

                    <TabsContent value="calendar">
                      <AgriculturalCalendar weatherData={weatherData} />
                    </TabsContent>
                  </Tabs>
                )}
                
                <WeatherFeatures />
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Weather;
