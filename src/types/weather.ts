export interface WeatherData {
  temperature: number;
  minTemperature: number;
  maxTemperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  precipProbability: number;
  visibility: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  condition: string;
  precipProbability: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipProbability: number;
  windSpeed: number;
}

export interface TemperatureRange {
  min: number;
  max: number;
}

// 🚀 Hier kommt dein neues Interface für WeeklyForecast basierend auf deiner JSON:

export interface WeeklyDailyForecast {
  date: string;
  maxtemp: number;
  mintemp: number;
  maxwindspeed: number;
  maxwindgusts: number;
  overcast: string;
}

// Und das Gesamtinterface für den JSON-Fetch:

export interface WeeklyForecastData {
  daily: WeeklyDailyForecast[];
}
