import React, { useState, useEffect, useRef } from 'react';
import Mascot from './Mascot';
import { useLocation } from '../contexts/LocationContext';

type MascotType = 'mascotfish' | 'mascotmerkel' | 'mascothaftbefehl';

const mascotSuffixMap: Record<MascotType, string> = {
  mascotfish: 'Fisch',
  mascotmerkel: 'Merkel',
  mascothaftbefehl: 'Haftbefehl',
};

const TextReport: React.FC = () => {
  const { savedLocations } = useLocation();
  const [reportText, setReportText] = useState<string>('');
  const [activeMascot, setActiveMascot] = useState<MascotType>('mascotfish');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadReportText = async () => {
    if (savedLocations.length === 0) {
      setReportText('');
      return;
    }

    const suffix = mascotSuffixMap[activeMascot];
    const filename = `/weather_text_from_gpt/${suffix}.txt`;

    try {
      const response = await fetch(filename);
      const text = await response.text();
      setReportText(text);
    } catch (error) {
      console.error('Fehler beim Laden der Textdatei:', error);
      setReportText('Fehler beim Laden des Berichts.');
    }
  };

  useEffect(() => {
    loadReportText();
  }, [activeMascot, savedLocations.length]);

  useEffect(() => {
    if (savedLocations.length === 0 && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [savedLocations.length]);

  const handlePlay = () => {
    if (savedLocations.length === 0 || !audioRef.current) {
      console.warn('Keine gespeicherten Standorte – Audio wird nicht abgespielt.');
      return;
    }

    const suffix = mascotSuffixMap[activeMascot];
    const audioPath = `/speech/${suffix}.mp3`;

    if (!audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }

    audioRef.current.src = audioPath;
    audioRef.current.play().catch((err) => {
      console.error('Audio konnte nicht abgespielt werden:', err);
    });
  };

  return (
      <div className="text-report-container h-[300px]">
        {/* Desktop Layout - EXACTLY as original */}
        <div className="hidden lg:grid lg:grid-cols-[200px_1fr] h-full gap-4 items-center">
          <div className="flex justify-center items-center h-full">
            <Mascot activeMascot={activeMascot} />
          </div>

          <div className="flex flex-col h-full space-y-6 justify-start">
            <div className="pt-1">
              <h2 className="text-xl font-semibold mb-2">
                Wetterbericht für alle Standorte
              </h2>
              <div className="weather-report prose text-base max-h-[172px] overflow-auto">
                {savedLocations.length > 0 ? (
                    <p>{reportText}</p>
                ) : (
                    <p className="text-gray-500 italic">Bitte wählen Sie einen Standort</p>
                )}
              </div>
            </div>

            <div className="audio-controls flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Announcer:</span>
                <span
                    onClick={() => setActiveMascot('mascotfish')}
                    className={`cursor-pointer ${activeMascot === 'mascotfish' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors`}
                >
                Fisch
              </span>
                {' | '}
                <span
                    onClick={() => setActiveMascot('mascotmerkel')}
                    className={`cursor-pointer ${activeMascot === 'mascotmerkel' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors`}
                >
                Merkel
              </span>
                {' | '}
                <span
                    onClick={() => setActiveMascot('mascothaftbefehl')}
                    className={`cursor-pointer ${activeMascot === 'mascothaftbefehl' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors`}
                >
                Haftbefehl
              </span>
              </div>

              <div>
              <span
                  onClick={handlePlay}
                  className="cursor-pointer text-blue-500 hover:text-blue-700 focus:outline-none transition-colors"
              >
                Vorlesen
              </span>
                <audio ref={audioRef} hidden />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Mascot as background */}
        <div className="block lg:hidden h-full relative">
          {/* Mascot as background */}
          <div className="absolute inset-0 flex justify-start items-start opacity-30 pointer-events-none pt-4 pl-2">
            <div className="w-32 h-32 overflow-visible">
              <Mascot activeMascot={activeMascot} />
            </div>
          </div>

          {/* Text content with background mascot */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">
                Wetterbericht für alle Standorte
              </h2>
              <div className="weather-report prose text-sm max-h-[140px] overflow-y-auto overflow-x-hidden mb-4 break-words word-wrap">
                {savedLocations.length > 0 ? (
                    <p className="break-words overflow-wrap-anywhere">{reportText}</p>
                ) : (
                    <p className="text-gray-500 italic">Bitte wählen Sie einen Standort</p>
                )}
              </div>

              <div className="audio-controls flex flex-col gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-sm flex-shrink-0">Announcer:</span>
                  <span
                      onClick={() => setActiveMascot('mascotfish')}
                      className={`cursor-pointer text-sm ${activeMascot === 'mascotfish' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors flex-shrink-0`}
                  >
                  Fisch
                </span>
                  <span className="text-sm flex-shrink-0">|</span>
                  <span
                      onClick={() => setActiveMascot('mascotmerkel')}
                      className={`cursor-pointer text-sm ${activeMascot === 'mascotmerkel' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors flex-shrink-0`}
                  >
                  Merkel
                </span>
                  <span className="text-sm flex-shrink-0">|</span>
                  <span
                      onClick={() => setActiveMascot('mascothaftbefehl')}
                      className={`cursor-pointer text-sm ${activeMascot === 'mascothaftbefehl' ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-700 transition-colors flex-shrink-0`}
                  >
                  Haftbefehl
                </span>
                </div>

                <div>
                <span
                    onClick={handlePlay}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 focus:outline-none transition-colors text-sm"
                >
                  Vorlesen
                </span>
                  <audio ref={audioRef} hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TextReport;