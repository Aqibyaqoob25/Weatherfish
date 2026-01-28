import React, { useEffect, useState } from "react";
import { getWeatherIcon, mapOvercastToCondition } from "../utils/weatherHelpers";

interface DailyEntry {
  maxtemp: number;
  mintemp: number;
  maxwindgusts: number;
  maxwindspeed: number;
  overcast: string;
  precipitation: string;
}

interface WeatherData {
  daily_weekone: Record<string, DailyEntry>;
  daily_weektwo: Record<string, DailyEntry>;
}

interface WeeklyForecastProps {
  plz: string;
  week: 1 | 2;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ plz, week }) => {
  const [forecastData, setForecastData] = useState<Record<string, DailyEntry> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/structured_data/${plz}_structured.json`);
        const data: WeatherData = await response.json();
        const selectedWeek = week === 1 ? data.daily_weekone : data.daily_weektwo;
        setForecastData(selectedWeek);
      } catch (error) {
        console.error("Fehler beim Laden der Wochendaten:", error);
        setForecastData(null);
      }
    };

    fetchData();
  }, [plz, week]);

  if (!forecastData || Object.keys(forecastData).length === 0) {
    return <p className="text-gray-600">Keine Wetterdaten verfügbar für {week === 1 ? "Woche 1" : "Woche 2"}.</p>;
  }

  const renderDay = (date: string, entry: DailyEntry) => {
    const condition = entry.precipitation === "rain" ? "reg" : mapOvercastToCondition(entry.overcast);
    const icon = getWeatherIcon(condition);

    return (
        <div key={date} className="bg-white shadow-sm rounded-xl p-4 text-center">
          <h4 className="text-gray-600 mb-2">{new Date(date).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "2-digit" })}</h4>
          <div className="flex justify-center mb-2">
            <img src={icon} alt={condition} className="w-12 h-12" />
          </div>
          <p className="text-lg font-semibold">{entry.maxtemp}° / {entry.mintemp}°</p>
          <p className="text-sm text-gray-600">🌬️ {entry.maxwindspeed} km/h</p>
          <p className="text-sm text-gray-600">💨 Böen: {entry.maxwindgusts} km/h</p>
        </div>
    );
  };

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(forecastData).map(([date, entry]) => renderDay(date, entry))}
      </div>
  );
};

export default WeeklyForecast;
