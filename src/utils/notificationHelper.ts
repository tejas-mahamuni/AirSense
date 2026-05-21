/**
 * Safely trigger notifications across desktop and mobile devices.
 * Mobile browsers require using the service worker registration to show notifications,
 * while desktop browsers support the `new Notification()` constructor.
 * This helper handles both and guarantees it won't throw exceptions that crash the app.
 */
export async function showSafeNotification(title: string, options: NotificationOptions = {}) {
  if (typeof window === 'undefined') return;

  if (!('Notification' in window)) {
    console.warn('[AirSense] Notifications are not supported in this browser.');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('[AirSense] Notification permission is not granted.');
    return;
  }

  const notificationOptions: NotificationOptions = {
    icon: '/airsense.png',
    badge: '/airsense.png',
    ...options,
  };

  // Try using Service Worker registration first (standard and required on mobile devices)
  if ('serviceWorker' in navigator) {
    try {
      // Get the active registration, timeout after 250ms to prevent hanging in non-PWA/dev envs
      const registration = await Promise.race([
        navigator.serviceWorker.getRegistration(),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 250))
      ]);
      
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, notificationOptions);
        return;
      }
    } catch (e) {
      console.warn('[AirSense] ServiceWorker not ready or failed, trying fallback:', e);
    }
  }

  // Fallback to standard Notification constructor (works on desktop)
  try {
    // Some mobile browsers (like iOS Safari / Chrome on Android) have the constructor
    // but throw a TypeError when called in the main window context.
    const notif = new Notification(title, notificationOptions);
    return notif;
  } catch (e) {
    console.error('[AirSense] Notification constructor failed:', e);
  }
}
