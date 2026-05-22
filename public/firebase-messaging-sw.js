importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Parse query parameters from service worker script URL
const urlParams = new URL(location).searchParams;
const apiKey = urlParams.get("apiKey");

if (apiKey) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: urlParams.get("authDomain") || "",
    projectId: urlParams.get("projectId") || "",
    storageBucket: urlParams.get("storageBucket") || "",
    messagingSenderId: urlParams.get("messagingSenderId") || "",
    appId: urlParams.get("appId") || "",
    measurementId: urlParams.get("measurementId") || ""
  };

  firebase.initializeApp(firebaseConfig);

  try {
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
      );
      
      const notificationTitle = payload.notification?.title || "AirSense Alert";
      const notificationOptions = {
        body: payload.notification?.body || "",
        icon: "/airsense.png",
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to initialize messaging:", error);
  }
} else {
  console.warn("[firebase-messaging-sw.js] No Firebase configuration passed in script query parameters. Firebase notifications will be disabled.");
}

