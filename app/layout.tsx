import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lunosleep - Kesadaran Tidur Harian',
  description: 'Aplikasi kesadaran tidur harian dari ekosistem Lunetix',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lunosleep'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#10B981'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Listen for updates
                      registration.addEventListener('updatefound', () => {
                        console.log('SW update found');
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
                
                // Listen for app install prompt
                let deferredPrompt;
                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  deferredPrompt = e;
                  console.log('Install prompt available');
                });
                
                // Listen for app installed
                window.addEventListener('appinstalled', (evt) => {
                  console.log('App installed');
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-gradient-to-br from-mint-50 to-teal-50 text-gray-800 overflow-x-hidden`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}