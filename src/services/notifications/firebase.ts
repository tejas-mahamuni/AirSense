import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";

// Your web app's Firebase configuration loaded from env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase safely
let app: any = null;
let analyticsInstance: any = null;
let messagingInstance: any = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    
    if (typeof window !== "undefined") {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (e) {
        console.warn("[AirSense] Firebase Analytics is not supported in this environment.", e);
      }
      
      try {
        messagingInstance = getMessaging(app);
      } catch (e) {
        console.warn("[AirSense] Firebase Messaging is not supported in this environment.", e);
      }
    }
  } catch (error) {
    console.error("[AirSense] Error initializing Firebase:", error);
  }
} else {
  console.warn("[AirSense] Firebase API key is missing. Firebase notifications are disabled.");
}

export { app };
export const analytics = analyticsInstance;
export const messaging = messagingInstance;

// Replace with your VAPID key from Firebase Console -> Cloud Messaging
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined; 

export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.warn('[AirSense] Notifications are not supported in this browser/origin.');
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted' && messaging) {
      console.log('Notification permission granted.');
      
      // Register custom service worker with query params containing the config
      let registration: ServiceWorkerRegistration | undefined;
      if ('serviceWorker' in navigator && firebaseConfig.apiKey) {
        try {
          const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(firebaseConfig.apiKey)}` +
            `&authDomain=${encodeURIComponent(firebaseConfig.authDomain)}` +
            `&projectId=${encodeURIComponent(firebaseConfig.projectId)}` +
            `&storageBucket=${encodeURIComponent(firebaseConfig.storageBucket)}` +
            `&messagingSenderId=${encodeURIComponent(firebaseConfig.messagingSenderId)}` +
            `&appId=${encodeURIComponent(firebaseConfig.appId)}` +
            `&measurementId=${encodeURIComponent(firebaseConfig.measurementId)}`;
          
          registration = await navigator.serviceWorker.register(swUrl, {
            scope: '/'
          });
          console.log('[AirSense] ServiceWorker registered with Firebase config:', registration);
        } catch (swError) {
          console.error('[AirSense] Failed to register service worker with config:', swError);
        }
      }
      
      // Get token passing our service worker registration
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });
      
      if (token) {
        console.log('FCM Token:', token);
        // Here you would normally send the token to your backend
        return token;
      } else {
        console.warn('No registration token available.');
      }
    } else {
      console.warn('Notification permission not granted or messaging not initialized.');
    }
  } catch (error) {
    console.error('An error occurred while requesting permission ', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
        toast(payload.notification?.title || "New Alert", {
          description: payload.notification?.body || "",
        });
      });
    }
  });

