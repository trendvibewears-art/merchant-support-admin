// firebase-messaging-sw.js - FIXED VERSION
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyA2E8L9VDUWXyJ1UgqlvTFpqYvRVNDUfho",
    authDomain: "support-chat-6391e.firebaseapp.com",
    databaseURL: "https://support-chat-6391e-default-rtdb.firebaseio.com",
    projectId: "support-chat-6391e",
    storageBucket: "support-chat-6391e.firebasestorage.app",
    messagingSenderId: "817965074720",
    appId: "1:817965074720:web:365b7c175189150b11af45",
    measurementId: "G-BBQ6TPTJW5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Background message received:', payload);
    const notificationTitle = payload.notification?.title || 'Shopify Support';
    const notificationOptions = {
        body: payload.notification?.body || 'New message',
        icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        vibrate: [200, 100, 200],
        data: payload.data || {},
        actions: [{ action: 'open', title: 'Open' }, { action: 'close', title: 'Dismiss' }],
        requireInteraction: true
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const urlToOpen = '/admin.html';
    event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url.includes('admin.html') && 'focus' in client) return client.focus();
        }
        return clients.openWindow(urlToOpen);
    }));
});

self.addEventListener('install', function(event) { self.skipWaiting(); });
self.addEventListener('activate', function(event) { event.waitUntil(clients.claim()); });
