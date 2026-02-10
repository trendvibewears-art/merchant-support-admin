// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyA2E8L9VDUWXyJ1UgqlvTFpqYvRVNDUfho",
    authDomain: "support-chat-6391e.firebaseapp.com",
    databaseURL: "https://support-chat-6391e-default-rtdb.firebaseio.com",
    projectId: "support-chat-6391e",
    storageBucket: "support-chat-6391e.firebasestorage.app",
    messagingSenderId: "817965074720",
    appId: "1:817965074720:web:365b7c175189150b11af45",
    measurementId: "G-BBQ6TPTJW5"
});

const messaging = firebase.messaging();

// Handle background messages (when app is closed)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'New Message';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message',
        icon: '/icon.png', // You should add an icon.png file
        badge: '/badge.png', // You should add a badge.png file
        data: {
            url: window.location.origin,
            sessionId: payload.data?.sessionId,
            type: payload.data?.type || 'message'
        },
        tag: payload.data?.sessionId || 'chat-notification',
        requireInteraction: true
    };

    // Show notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received:', event);
    
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || window.location.origin;
    
    // Focus or open window
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            // Check if there's already a window/tab open
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Optional: Add install event for caching
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Service Worker installing...');
    self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Service Worker activating...');
    event.waitUntil(clients.claim()); // Take control of all clients immediately
});
