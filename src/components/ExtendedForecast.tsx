import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { Location } from '../types/location';
import { getWeatherIcon } from '../utils/weatherHelpers';

interface ExtendedForecastProps {
    location: Location;
}

const ExtendedForecast: React.FC<ExtendedForecastProps> = ({ location }) => {
    const { extendedForecast } = useWeather();

    if (!extendedForecast || extendedForecast.length < 14) {
        return <p>Keine erweiterten Wetterdaten verfügbar</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {extendedForecast.slice(7, 14).map((day, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index + 7); // Zeigt Tage 8–14
                const formattedDate = date.toLocaleDateString('de-DE', {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit'
                });

                return (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                        <h3 className="font-medium text-center mb-2">{formattedDate}</h3>
                        <div className="flex justify-center mb-2">
                            <img
                                src={getWeatherIcon(day.condition)}
                                alt={day.condition}
                                className="w-16 h-16"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold">
                                {day.maxTemperature}°<span className="text-lg font-normal text-gray-500">/{day.minTemperature}°</span>
                            </p>
                            <p className="text-gray-600 mb-2">{day.condition}</p>
                            <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                                <p className="flex items-center">
                                    <span>☔ {day.precipProbability}%</span>
                                </p>
                                <p className="flex items-center">
                                    <span>🌬️ {day.windSpeed}km/h</span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


export default ExtendedForecast;