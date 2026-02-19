// Service Worker for background notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Handle push notifications in the background
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const options = {
    body: event.data?.text() || 'New notification from Shopify Admin',
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png',
    vibrate: [200, 100, 200],
    data: {
      url: self.location.origin + '/admin.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Shopify Admin', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return clients.openWindow('/admin.html');
      })
  );
});
