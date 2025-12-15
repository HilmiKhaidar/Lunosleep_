const CACHE_NAME = 'lunosleep-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  '/favicon.svg'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'sleep-reminder') {
    event.waitUntil(
      // Handle background sync for sleep reminders
      console.log('Background sync for sleep reminder')
    )
  }
})

// Push event (for future server-sent notifications)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Waktu untuk check-in tidur Anda',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Buka Aplikasi',
        icon: '/icon-192.svg'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Lunosleep', options)
  )
})