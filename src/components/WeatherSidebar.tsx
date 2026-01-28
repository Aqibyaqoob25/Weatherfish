import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "../contexts/LocationContext";

interface PostalCodeEntry {
    plz: string;
    city: string;
}

export default function WeatherSidebar() {
    const {
        currentLocation,
        savedLocations,
        setCurrentLocation,
        addLocation,
        removeLocation
    } = useLocation();

    const [newZip, setNewZip] = useState("");
    const [newCity, setNewCity] = useState("");
    const [postalCodes, setPostalCodes] = useState<PostalCodeEntry[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(true); // Mobile: collapsed by default

    useEffect(() => {
        fetch("/postal_codes/postal_codes.json")
            .then((res) => res.json())
            .then((data) => setPostalCodes(data))
            .catch((err) =>
                console.error("Fehler beim Laden der PLZ-Daten:", err)
            );
    }, []);

    const handleAddLocation = () => {
        const trimmedZip = newZip.trim();
        const trimmedCity = newCity.trim();

        if (trimmedZip === "" || trimmedCity === "") return;
        if (savedLocations.length >= 4) {
            alert("Maximal 4 Standorte erlaubt.");
            return;
        }

        const match = postalCodes.find(
            (entry) =>
                entry.plz === trimmedZip &&
                entry.city.toLowerCase() === trimmedCity.toLowerCase()
        );

        if (!match) {
            alert("Ungültige PLZ/Ort Kombination.");
            return;
        }

        const id = match.plz;
        const name = `${match.plz} - ${match.city}`;
        addLocation({ id, name, lat: 0, lon: 0 });

        // 🔽 NEU: Request ans Backend
        console.log("🌍 Sende Request an Backend (Schritt 1-Test)…");
        fetch("http://localhost:8000/generate-documents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cities: [trimmedCity],
                zipcodes: [trimmedZip]
            })
        })
        .then((res) => {
            console.log("✅ Antwort vom Backend:", res);
            return res.json();
        })
        .then((data) => {
            console.log("📦 Antwortinhalt:", data);
            alert("Backend hat geantwortet: " + data.message);
        })
        .catch((err) => {
            console.error("❌ Fehler beim Backend-Request:", err);
            alert("Fehler beim Backend-Request.");
        });

        setNewZip("");
        setNewCity("");
    };


    return (
        <>
            {/* Mobile Collapsible Version */}
            <div className="block lg:hidden w-full bg-blue-100 rounded-2xl shadow-md overflow-hidden">
                {/* Header - Always visible */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full p-3 flex justify-between items-center bg-blue-200 hover:bg-blue-300 transition-colors"
                >
                    <h2 className="text-base font-semibold">Standortverwaltung</h2>
                    {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>

                {/* Collapsible Content */}
                {!isCollapsed && (
                    <div className="p-3 space-y-3">
                        {/* Add new location */}
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="PLZ"
                                    value={newZip}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,5}$/.test(value)) {
                                            setNewZip(value);
                                        }
                                    }}
                                    className="flex-1 p-1 text-xs rounded border border-blue-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Ort"
                                    value={newCity}
                                    onChange={(e) => setNewCity(e.target.value)}
                                    className="flex-1 p-1 text-xs rounded border border-blue-300"
                                />
                                <button
                                    className={`bg-blue-400 text-white rounded px-3 py-2 text-sm ${
                                        newZip && newCity ? "hover:bg-blue-500" : "opacity-50 cursor-not-allowed"
                                    }`}
                                    onClick={handleAddLocation}
                                    disabled={!newZip || !newCity}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Location grid - 2x2 on mobile for better space usage */}
                        <div className="grid grid-cols-1 gap-2">
                            {Array.from({ length: 4 }).map((_, index) => {
                                const location = savedLocations[index];

                                return (
                                    <div key={index} className="flex gap-2">
                                        <button
                                            onClick={() => location && setCurrentLocation(location)}
                                            className={`flex-1 p-2 rounded text-sm text-left min-h-[40px] transition-colors duration-200 ${
                                                location
                                                    ? currentLocation?.id === location.id
                                                        ? "bg-blue-400 text-white"
                                                        : "bg-blue-200 hover:bg-blue-300"
                                                    : "bg-gray-100 text-gray-400 cursor-default"
                                            }`}
                                            disabled={!location}
                                        >
                                            {location ? location.name : `Standort ${index + 1} leer`}
                                        </button>
                                        {location && (
                                            <button
                                                className="bg-red-400 text-white rounded w-8 h-8 flex items-center justify-center self-center hover:bg-red-500 transition-colors"
                                                onClick={() => {
                                                    const confirmed = window.confirm(
                                                        "Wollen Sie diesen Standort wirklich entfernen?"
                                                    );
                                                    if (confirmed) {
                                                        removeLocation(location.id);
                                                    }
                                                }}
                                            >
                                                −
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Version - EXACTLY as original */}
            <div className="hidden lg:block w-64 flex-shrink-0 bg-blue-100 p-3 mb-6 flex flex-col rounded-2xl shadow-md mt-[130px] ml-4">
                <h2 className="text-lg font-semibold text-center mb-4">
                    Standortverwaltung
                </h2>

                <div className="mb-4 space-y-2">
                    {/* Eingabe */}
                    <div className="flex mb-2 gap-2 w-full">
                        <input
                            type="text"
                            placeholder="PLZ"
                            value={newZip}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,5}$/.test(value)) {
                                    setNewZip(value);
                                }
                            }}
                            className="flex-1 w-[70px] p-2 text-sm rounded border border-blue-300"
                        />
                        <input
                            type="text"
                            placeholder="Ort"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            className="flex-1 w-[120px] p-2 text-sm rounded border border-blue-300"
                        />
                        <button
                            className={`bg-blue-400 text-white rounded px-3 py-1 ${
                                newZip && newCity ? "" : "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={handleAddLocation}
                            disabled={!newZip || !newCity}
                        >
                            +
                        </button>
                    </div>

                    {/* Standortliste */}
                    <div className="grid grid-rows-4 gap-2 w-full">
                        {Array.from({ length: 4 }).map((_, index) => {
                            const location = savedLocations[index];

                            return (
                                <div key={index} className="flex gap-2 w-full">
                                    <button
                                        onClick={() => location && setCurrentLocation(location)}
                                        className={`flex-1 p-2 rounded text-sm text-left min-h-[44px] transition-colors duration-200 ${
                                            location
                                                ? currentLocation?.id === location.id
                                                    ? "bg-blue-300 text-white"
                                                    : "bg-blue-200 hover:bg-blue-300"
                                                : "bg-gray-100 text-gray-400 cursor-default"
                                        }`}
                                        disabled={!location}
                                    >
                                        {location ? location.name : "Kein Standort eingetragen"}
                                    </button>
                                    {location && (
                                        <button
                                            className="bg-red-400 text-white rounded w-8 h-8 flex items-center justify-center self-center"
                                            onClick={() => {
                                                const confirmed = window.confirm(
                                                    "Wollen Sie diesen Standort wirklich entfernen?"
                                                );
                                                if (confirmed) {
                                                    removeLocation(location.id);
                                                }
                                            }}
                                        >
                                            −
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}