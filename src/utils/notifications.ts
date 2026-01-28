// Lightweight notification scheduler for daily notifications
// Uses the standard Notification API and stores the schedule in localStorage.

type DailyNotificationConfig = {
  enabled: boolean;
  hour?: number;
  minute?: number;
  title?: string;
  body?: string;
};

let timeoutId: number | undefined;
let intervalId: number | undefined;

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) return 'denied';
  return await Notification.requestPermission();
};

export const showNotification = (title: string, body?: string) => {
  try {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  } catch (e) {
    console.warn('Failed to show notification', e);
  }
};

export const scheduleDailyNotification = (
  hour = 8,
  minute = 0,
  title = 'APWWS Wetter',
  body = 'Tägliches Wetter-Update'
) => {
  cancelDailyNotification();

  const cfg: DailyNotificationConfig = { enabled: true, hour, minute, title, body };
  localStorage.setItem('dailyNotification', JSON.stringify(cfg));

  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  const delay = next.getTime() - now.getTime();

  // Schedule the first notification at the computed time
  timeoutId = window.setTimeout(() => {
    showNotification(title, body);
    // Afterwards schedule every 24h
    intervalId = window.setInterval(() => showNotification(title, body), 24 * 60 * 60 * 1000);
  }, delay) as unknown as number;
};

export const cancelDailyNotification = () => {
  localStorage.setItem('dailyNotification', JSON.stringify({ enabled: false }));
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }
};

export const loadScheduledNotificationFromStorage = () => {
  try {
    const raw = localStorage.getItem('dailyNotification');
    if (!raw) return;
    const cfg = JSON.parse(raw) as DailyNotificationConfig;
    if (cfg.enabled) {
      scheduleDailyNotification(cfg.hour ?? 8, cfg.minute ?? 0, cfg.title ?? 'APWWS Wetter', cfg.body ?? 'Tägliches Wetter-Update');
    }
  } catch (e) {
    console.warn('Malformed dailyNotification config in localStorage');
  }
};

export const isDailyNotificationEnabled = (): boolean => {
  try {
    const raw = localStorage.getItem('dailyNotification');
    if (!raw) return false;
    const cfg = JSON.parse(raw) as DailyNotificationConfig;
    return Boolean(cfg.enabled);
  } catch {
    return false;
  }
};

export const getDailyNotificationConfig = (): DailyNotificationConfig => {
  try {
    const raw = localStorage.getItem('dailyNotification');
    if (!raw) return { enabled: false, hour: 8, minute: 0, title: 'APWWS Wetter', body: 'Tägliches Wetter-Update' };
    const cfg = JSON.parse(raw) as DailyNotificationConfig;
    return {
      enabled: Boolean(cfg.enabled),
      hour: typeof cfg.hour === 'number' ? cfg.hour : 8,
      minute: typeof cfg.minute === 'number' ? cfg.minute : 0,
      title: cfg.title ?? 'APWWS Wetter',
      body: cfg.body ?? 'Tägliches Wetter-Update',
    };
  } catch (e) {
    console.warn('Malformed dailyNotification config in localStorage');
    return { enabled: false, hour: 8, minute: 0, title: 'APWWS Wetter', body: 'Tägliches Wetter-Update' };
  }
};

export const setDailyNotificationConfig = (cfg: DailyNotificationConfig) => {
  try {
    localStorage.setItem('dailyNotification', JSON.stringify(cfg));
    if (cfg.enabled) {
      scheduleDailyNotification(cfg.hour ?? 8, cfg.minute ?? 0, cfg.title ?? 'APWWS Wetter', cfg.body ?? 'Tägliches Wetter-Update');
    } else {
      cancelDailyNotification();
    }
  } catch (e) {
    console.warn('Failed to set dailyNotification config', e);
  }
};

export const testNotification = (title?: string, body?: string) => {
  showNotification(title ?? 'APWWS Wetter', body ?? 'Testbenachrichtigung');
};
