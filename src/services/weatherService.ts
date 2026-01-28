import { WeatherData, DailyForecast } from '../types/weather';
import { Location } from '../types/location';

// Mock weather data generator - In a real app, this would be replaced with API calls
export const fetchMockWeatherData = async (location: Location) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate random weather based on location
  const current = generateMockCurrentWeather(location);
  const weekly = generateMockWeeklyForecast(location);
  const extended = generateMockExtendedForecast(location);
  
  return { current, weekly, extended };
};

const generateMockCurrentWeather = (location: Location): WeatherData => {
  // Simple hash from location name to get consistent but different values
  const hash = [...location.name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseTemp = 15 + (hash % 15); // 15-30°C
  
  const conditions = [
    'Sonnig', 'Teilweise bewölkt', 'Bewölkt', 'Leicht bewölkt', 
    'Regnerisch', 'Gewitter', 'Nebelig', 'Schnee', 'Windig'
  ];
  
  const directionOptions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  return {
    temperature: baseTemp,
    minTemperature: baseTemp - 5,
    maxTemperature: baseTemp + 3,
    feelsLike: baseTemp - 1,
    humidity: 30 + (hash % 50), // 30-80%
    pressure: 1000 + (hash % 30), // 1000-1030 hPa
    windSpeed: 5 + (hash % 20), // 5-25 km/h
    windDirection: directionOptions[hash % directionOptions.length],
    condition: conditions[hash % conditions.length],
    precipProbability: hash % 100, // 0-99%
    visibility: 5 + (hash % 15), // 5-20 km
    uvIndex: 1 + (hash % 10) // 1-10
  };
};

const generateMockWeeklyForecast = (location: Location): DailyForecast[] => {
  const forecast: DailyForecast[] = [];
  const hash = [...location.name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseTemp = 15 + (hash % 15);
  
  const conditions = [
    'Sonnig', 'Teilweise bewölkt', 'Bewölkt', 'Leicht bewölkt', 
    'Regnerisch', 'Gewitter', 'Nebelig', 'Schnee', 'Windig'
  ];
  
  const directionOptions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Temperature varies a bit each day but follows a slight trend
    const dayVariation = ((i * 7) % 10) - 5; // -5 to +4
    const dayTemp = baseTemp + dayVariation;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      minTemperature: dayTemp - 5 - (i % 3),
      maxTemperature: dayTemp + 3 + (i % 3),
      condition: conditions[(hash + i) % conditions.length],
      precipProbability: ((hash + i * 11) % 100),
      humidity: 30 + ((hash + i * 7) % 50),
      windSpeed: 5 + ((hash + i * 3) % 20),
      windDirection: directionOptions[(hash + i) % directionOptions.length]
    });
  }
  
  return forecast;
};

const generateMockExtendedForecast = (location: Location): DailyForecast[] => {
  const forecast: DailyForecast[] = [];
  const hash = [...location.name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseTemp = 15 + (hash % 15);
  
  const conditions = [
    'Sonnig', 'Teilweise bewölkt', 'Bewölkt', 'Leicht bewölkt', 
    'Regnerisch', 'Gewitter', 'Nebelig', 'Schnee', 'Windig'
  ];
  
  const directionOptions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  for (let i = 0; i < 16; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Temperature varies more in extended forecast
    const dayVariation = ((i * 5) % 14) - 7; // -7 to +6
    const dayTemp = baseTemp + dayVariation;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      minTemperature: dayTemp - 6 - (i % 4),
      maxTemperature: dayTemp + 4 + (i % 4),
      condition: conditions[(hash + i * 3) % conditions.length],
      precipProbability: ((hash + i * 13) % 100),
      humidity: 30 + ((hash + i * 9) % 50),
      windSpeed: 5 + ((hash + i * 5) % 25),
      windDirection: directionOptions[(hash + i * 2) % directionOptions.length]
    });
  }
  
  return forecast;
};