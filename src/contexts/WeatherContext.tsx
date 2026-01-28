import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherData, DailyForecast } from '../types/weather';
import { Location } from '../types/location';
import { useLocation } from './LocationContext';
import { fetchMockWeatherData } from '../services/weatherService';

interface WeatherContextType {
  currentWeather: WeatherData | null;
  weeklyForecast: DailyForecast[] | null;
  extendedForecast: DailyForecast[] | null;
  isLoading: boolean;
  error: string | null;
  getWeatherForLocation: (locationId: string) => WeatherData | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<DailyForecast[] | null>(null);
  const [extendedForecast, setExtendedForecast] = useState<DailyForecast[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationWeatherCache, setLocationWeatherCache] = useState<Record<string, WeatherData>>({});
  
  const { currentLocation } = useLocation();
  
  useEffect(() => {
    if (!currentLocation) return;
    
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, we would call a weather API here
        const { current, weekly, extended } = await fetchMockWeatherData(currentLocation);
        
        setCurrentWeather(current);
        setWeeklyForecast(weekly);
        setExtendedForecast(extended);
        
        // Update cache
        setLocationWeatherCache(prev => ({
          ...prev,
          [currentLocation.id]: current
        }));
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
  }, [currentLocation]);
  
  const getWeatherForLocation = (locationId: string): WeatherData | null => {
    return locationWeatherCache[locationId] || null;
  };
  
  const value = {
    currentWeather,
    weeklyForecast,
    extendedForecast,
    isLoading,
    error,
    getWeatherForLocation
  };
  
  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};