import React, { useEffect, useState } from "react";
import { getWeatherIcon, mapOvercastToCondition } from "../utils/weatherHelpers";

interface HourlyEntry {
  temperature: number;
  humidity: number;
  apparent_temperature: number;
  "precipitation probability": number;
  overcast: string;
}

interface WeatherData {
  hourly: Record<string, HourlyEntry>;
}

interface DailyForecastProps {
  plz: string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ plz }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/structured_data/${plz}_structured.json`);
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Fehler beim Laden der Wetterdaten:", err);
        setWeatherData(null);
      }
    };

    fetchData();
  }, [plz]);

  if (!weatherData) {
    return <p className="text-gray-600">Lade Wetterdaten...</p>;
  }

  const getPeriodData = (startHour: number, endHour: number) => {
    const hours = Object.entries(weatherData.hourly)
        .map(([hourStr, entry]) => ({ hour: parseInt(hourStr), ...entry }));

    const period = hours.filter(entry => {
      if (startHour <= endHour) {
        return entry.hour >= startHour && entry.hour <= endHour;
      } else {
        // Zeitraum über Mitternacht, z. B. 22–6 Uhr
        return entry.hour >= startHour || entry.hour <= endHour;
      }
    });

    if (period.length === 0) return null;

    const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    const mostCommon = (arr: string[]) =>
        arr.sort((a, b) =>
            arr.filter(v => v === b).length - arr.filter(v => v === a).length
        )[0];

    return {
      temperature: avg(period.map(e => e.temperature)),
      apparent: avg(period.map(e => e.apparent_temperature)),
      humidity: Math.max(...period.map(e => e.humidity)),
      precipPercent: Math.round(
          period.reduce((sum, e) => sum + e["precipitation probability"], 0) / period.length
      ),
      overcast: mostCommon(period.map(e => e.overcast))
    };
  };

  const renderPeriod = (title: string, time: string, data: any) => {
    if (!data) return <p className="text-center">Keine Daten</p>;

    const condition = data.precipPercent >= 50
        ? "reg"
        : mapOvercastToCondition(data.overcast);

    const icon = getWeatherIcon(condition);

    return (
        <div className="detail-card bg-white shadow-sm rounded-xl p-4">
          <h4 className="text-gray-600 mb-2 text-center">{title}<br />{time}</h4>
          <div className="flex justify-center mb-2">
            <img src={icon} alt={condition} className="w-16 h-16" />
          </div>
          <p className="text-center text-3xl font-semibold">{data.temperature}°</p>
          <p className="text-center">Gefühlt: {data.apparent}°</p>
          <p className="text-center">💧 {data.humidity}%</p>
          <p className="text-center">☔ {data.precipPercent}%</p>
        </div>
    );
  };

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderPeriod("Morgens", "06 - 12 Uhr", getPeriodData(6, 12))}
        {renderPeriod("Mittags", "12 - 18 Uhr", getPeriodData(12, 18))}
        {renderPeriod("Abends", "18 - 22 Uhr", getPeriodData(18, 22))}
        {renderPeriod("Nachts", "22 - 06 Uhr", getPeriodData(22, 23))}
      </div>
  );
};

export default DailyForecast;
