importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCOHIKPAt0INEeVeAEARWpttoMO-EXC0UU",
  authDomain: "airsense-app.firebaseapp.com",
  projectId: "airsense-app",
  storageBucket: "airsense-app.firebasestorage.app",
  messagingSenderId: "275672152038",
  appId: "1:275672152038:web:107c953880f15875f54827",
  measurementId: "G-EBE84CF46L"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/airsense.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
