// firebase-messaging-sw.js - COMPLETE FIXED VERSION
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Your Firebase config
firebase.initializeApp({
    apiKey: "AIzaSyA2E8L9VDUWXyJ1UgqlvTFpqYvRVNDUfho",
    authDomain: "support-chat-6391e.firebaseapp.com",
    databaseURL: "https://support-chat-6391e-default-rtdb.firebaseio.com",
    projectId: "support-chat-6391e",
    storageBucket: "support-chat-6391e.firebasestorage.app",
    messagingSenderId: "817965074720",
    appId: "1:817965074720:web:365b7c175189150b11af45"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('[Service Worker] Background message:', payload);
    
    const notificationTitle = payload.notification?.title || 'Shopify Support';
    const notificationOptions = {
        body: payload.notification?.body || 'New message',
        icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
        vibrate: [200, 100, 200],
        data: payload.data || { url: '/admin.html' },
        requireInteraction: true,
        silent: false,
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'close', title: 'Dismiss' }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    const urlToOpen = event.notification.data?.url || '/admin.html';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(urlToOpen);
            })
    );
});

// Service worker lifecycle
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(clients.claim());
});
