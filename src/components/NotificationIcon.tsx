import React, { useEffect, useState, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import {
  requestNotificationPermission,
  loadScheduledNotificationFromStorage,
  getDailyNotificationConfig,
  setDailyNotificationConfig,
  testNotification,
  isDailyNotificationEnabled,
} from '../utils/notifications';

const pad = (n: number) => n.toString().padStart(2, '0');

const NotificationIcon: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [time, setTime] = useState<string>('08:00');
  const [title, setTitle] = useState<string>('APWWS Wetter');
  const [body, setBody] = useState<string>('Dein tägliches Wetter-Update');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // On mount restore schedule (if enabled) so timers are active for this session
    loadScheduledNotificationFromStorage();
    const cfg = getDailyNotificationConfig();
    setEnabled(Boolean(cfg.enabled));
    setTime(`${pad(cfg.hour ?? 8)}:${pad(cfg.minute ?? 0)}`);
    setTitle(cfg.title ?? 'APWWS Wetter');
    setBody(cfg.body ?? 'Dein tägliches Wetter-Update');

    const onClick = (e: MouseEvent) => {
      if (showSettings && ref.current && !ref.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [showSettings]);

  const openSettings = async () => {
    const permission = Notification.permission;
    if (permission !== 'granted' && permission !== 'denied') {
      // Request proactively so the save flow later is smoother
      await requestNotificationPermission();
    }
    setShowSettings(true);
  };

  const applySettings = async (enabledNow: boolean) => {
    const [hh, mm] = time.split(':').map((s) => parseInt(s, 10));
    const cfg = { enabled: enabledNow, hour: hh, minute: mm, title, body };
    if (enabledNow) {
      if (Notification.permission !== 'granted') {
        const p = await requestNotificationPermission();
        if (p !== 'granted') {
          alert('Bitte Benachrichtigungen zulassen, um tägliche Erinnerungen zu erhalten.');
          return;
        }
      }
    }
    setDailyNotificationConfig(cfg);
    setEnabled(enabledNow);
    setShowSettings(false);
  };

  const toggleQuick = async () => {
    if (!enabled) {
      // open settings instead to let the user pick a time
      openSettings();
    } else {
      // disable instantly
      setDailyNotificationConfig({ enabled: false });
      setEnabled(false);
    }
  };

  const handleTest = () => {
    testNotification(title, body);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className={`p-2 rounded-full hover:bg-blue-600 transition ${enabled ? 'bg-blue-600' : ''}`}
        onClick={toggleQuick}
        title={enabled ? 'Tägliche Benachrichtigungen deaktivieren / Einstellungen' : 'Tägliche Benachrichtigungen konfigurieren'}
      >
        <Bell size={24} />
      </button>
      {enabled && (
        <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
      )}

      {showSettings && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded-md shadow-lg z-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Tägliche Benachrichtigung</div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded hover:bg-gray-100"
                title="Schließen"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Uhrzeit</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-1 rounded border"
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-1 rounded border"
            />
          </div>

          <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Text</label>
            <input
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-1 rounded border"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => applySettings(true)}
                className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded"
              >
                <Check size={14} />
                <span className="text-sm">Aktivieren</span>
              </button>

              <button
                onClick={() => applySettings(false)}
                className="flex items-center space-x-1 bg-gray-200 text-black px-3 py-1 rounded"
              >
                <span className="text-sm">Deaktivieren</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleTest}
                className="text-sm text-blue-600 hover:underline"
              >
                Testen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
