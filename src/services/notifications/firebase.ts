import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOHIKPAt0INEeVeAEARWpttoMO-EXC0UU",
  authDomain: "airsense-app.firebaseapp.com",
  projectId: "airsense-app",
  storageBucket: "airsense-app.firebasestorage.app",
  messagingSenderId: "275672152038",
  appId: "1:275672152038:web:107c953880f15875f54827",
  measurementId: "G-EBE84CF46L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analyticsInstance: any = null;
if (typeof window !== "undefined") {
  try {
    analyticsInstance = getAnalytics(app);
  } catch (e) {
    console.warn("[AirSense] Firebase Analytics is not supported in this environment.", e);
  }
}
export const analytics = analyticsInstance;

let messagingInstance: any = null;
if (typeof window !== "undefined") {
  try {
    messagingInstance = getMessaging(app);
  } catch (e) {
    console.warn("[AirSense] Firebase Messaging is not supported in this environment.", e);
  }
}
export const messaging = messagingInstance;

// Replace with your VAPID key from Firebase Console -> Cloud Messaging
// Since we don't have one right now, we can still request permission, but token generation might need it in prod.
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
      // Get token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (token) {
        console.log('FCM Token:', token);
        // Here you would normally send the token to your backend
        return token;
      } else {
        console.warn('No registration token available.');
      }
    } else {
      console.warn('Notification permission not granted.');
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
