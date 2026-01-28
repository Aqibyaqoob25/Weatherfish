import React, { useState } from 'react';
import DailyForecast from './DailyForecast';
import WeeklyForecast from './WeeklyForecast';
import { Location } from '../types/location';

interface WeatherVisualsProps {
    location: Location | null;
}

type ForecastView = 'today' | 'week1' | 'week2';

const WeatherVisuals: React.FC<WeatherVisualsProps> = ({ location }) => {
    const [forecastView, setForecastView] = useState<ForecastView>('today');

    if (!location) {
        return (
            <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <p className="text-center text-gray-500">Bitte wählen Sie einen Standort</p>
            </div>
        );
    }

    const plz = location.id; // z. B. "92421"

    return (
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
                Visuelle Ausgabe für den aktuellen Standort {location.name}
            </h2>

            <div className="flex justify-center mb-6 gap-4">
                <button
                    className={`px-4 py-2 border-b-2 ${forecastView === 'today' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                    onClick={() => setForecastView('today')}
                >
                    heute
                </button>
                <button
                    className={`px-4 py-2 border-b-2 ${forecastView === 'week1' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                    onClick={() => setForecastView('week1')}
                >
                    1. Woche
                </button>
                <button
                    className={`px-4 py-2 border-b-2 ${forecastView === 'week2' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}
                    onClick={() => setForecastView('week2')}
                >
                    2. Woche
                </button>
            </div>

            {forecastView === 'today' && <DailyForecast plz={plz} />}
            {forecastView === 'week1' && <WeeklyForecast week={1} plz={plz} />}
            {forecastView === 'week2' && <WeeklyForecast week={2} plz={plz} />}
        </div>
    );
};

export default WeatherVisuals;
