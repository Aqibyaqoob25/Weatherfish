import React, { useEffect, useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { getWeatherIcon, mapOvercastToCondition } from '../utils/weatherHelpers';

interface CurrentWeather {
    temperature: number;
    humidity: number;
    "feels like": number;
    overcast: string;
    current_precipitation: string; // "" oder "rain"
}

const SavedLocations: React.FC = () => {
    const { savedLocations } = useLocation();
    const [weatherData, setWeatherData] = useState<{ [plz: string]: CurrentWeather | null }>({});

    useEffect(() => {
        const fetchWeather = async () => {
            const results: { [plz: string]: CurrentWeather | null } = {};

            await Promise.all(
                savedLocations.map(async (loc) => {
                    try {
                        const res = await fetch(`/structured_data/${loc.id}_structured.json`);
                        const data = await res.json();
                        results[loc.id] = data.current;
                    } catch (err) {
                        console.error(`Fehler beim Laden von ${loc.id}_structured.json:`, err);
                        results[loc.id] = null;
                    }
                })
            );

            setWeatherData(results);
        };

        fetchWeather();
    }, [savedLocations]);

    if (!savedLocations.length) {
        return (
            <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Visuelle Ausgabe anderer gespeicherter Standorte</h2>
                <p className="text-center text-gray-500 py-4">
                    Keine Standorte gespeichert. Suchen Sie nach Orten, um sie zu Ihrer Liste hinzuzufügen.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Visuelle Ausgabe anderer gespeicherter Standorte</h2>

            <div className="space-y-4">
                {savedLocations.map((location, index) => {
                    const current = weatherData[location.id];

                    const condition = current
                        ? current.current_precipitation === "rain"
                            ? "reg"
                            : mapOvercastToCondition(current.overcast)
                        : "";

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">{location.name}</h3>
                                    <p className="text-gray-600 text-sm">
                                        {current
                                            ? current.current_precipitation === "rain"
                                                ? "Regen"
                                                : mapOvercastToCondition(current.overcast)
                                            : "Lädt..."}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    {current && (
                                        <>
                                            <img
                                                src={getWeatherIcon(condition)}
                                                alt={condition}
                                                className="w-10 h-10 mr-2"
                                            />
                                            <p className="text-2xl font-semibold">{current.temperature}°</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {current && (
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>Gefühlt: {current["feels like"]}°</span>
                                    <span>💧 {current.humidity}%</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedLocations;
