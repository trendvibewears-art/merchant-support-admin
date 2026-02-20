// firebase-messaging-sw.js - MUST BE AT ROOT LEVEL
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

// Your Firebase config
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

// Handle background messages (when app is closed/minimized)
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);
    
    const notificationTitle = payload.notification?.title || 'Shopify Support';
    const notificationOptions = {
        body: payload.notification?.body || 'New message',
        icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        vibrate: [200, 100, 200],
        data: payload.data || {},
        actions: [
            {
                action: 'open',
                title: 'Open Admin'
            },
            {
                action: 'close',
                title: 'Dismiss'
            }
        ],
        requireInteraction: true,
        silent: false
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/admin.html';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(urlToOpen);
        })
    );
});

// Service worker install/activate
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(clients.claim());
});
