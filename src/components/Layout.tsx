import React, { useEffect, useState } from 'react';
import Header from './Header';
import TextReport from './TextReport';
import WeatherVisuals from './WeatherVisuals';
import SavedLocations from './SavedLocations';
import WeatherSidebar from './WeatherSidebar';
import { useWeather } from '../contexts/WeatherContext';
import { useLocation } from '../contexts/LocationContext';

type BackgroundType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

interface LayoutProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ selectedIndex, setSelectedIndex }) => {
  const { currentWeather } = useWeather();
  const { currentLocation, savedLocations } = useLocation();
  const [background, setBackground] = useState<BackgroundType>('sunny');

  useEffect(() => {
    if (!currentWeather) return;

    if (currentWeather.condition.includes('rain')) {
      setBackground('rainy');
    } else if (currentWeather.condition.includes('cloud')) {
      setBackground('cloudy');
    } else if (currentWeather.condition.includes('snow')) {
      setBackground('snowy');
    } else if (currentWeather.condition.includes('thunder')) {
      setBackground('stormy');
    } else {
      setBackground('sunny');
    }
  }, [currentWeather]);

  return (
    <div className="min-h-screen relative">
      <div className={`weather-background ${background}`} />
      
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-3 py-4 relative max-w-md">
          {/* Header */}
          <Header />

          {/* Location Management - Collapsible on Mobile */}
          <div className="mt-4 mb-6">
            <WeatherSidebar />
          </div>

          {/* Main Content */}
          <main className="space-y-4">
            {/* Text Report - Optimized for mobile */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 relative">
              <TextReport />
            </div>

            {/* Weather Visuals - Stack vertically on mobile */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
              <WeatherVisuals location={currentLocation} selectedIndex={selectedIndex} />
            </div>

            {/* Saved Locations - Compact mobile view */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
              <SavedLocations />
            </div>
          </main>
        </div>
      </div>

      {/* Desktop Layout - EXACTLY as original */}
      <div className="hidden lg:flex">
        <WeatherSidebar
          currentLocation={currentLocation?.name || 'Kein Standort'}
          savedLocations={savedLocations.map(loc => loc.name)}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-6 relative">
            <Header />

            <main className="mt-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 relative">
                <TextReport />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <WeatherVisuals location={currentLocation} selectedIndex={selectedIndex} />
                </div>
                <div>
                  <SavedLocations />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;