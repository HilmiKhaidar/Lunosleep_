'use client'

import { useState, useEffect } from 'react'
import { Bell, Moon, Sun, Download, Trash2, Shield, Smartphone, Volume2, Clock, Settings as SettingsIcon, Lightbulb } from 'lucide-react'
import TimePicker from './TimePicker'

interface NotificationSettings {
  enabled: boolean
  bedtimeReminder: boolean
  bedtimeHour: number
  bedtimeMinute: number
  wakeupReminder: boolean
  wakeupHour: number
  wakeupMinute: number
  sound: boolean
}

interface AppSettings {
  notifications: NotificationSettings
  theme: 'light' | 'dark' | 'auto'
  dataRetention: number // days
  autoBackup: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      enabled: false,
      bedtimeReminder: true,
      bedtimeHour: 21,
      bedtimeMinute: 0,
      wakeupReminder: false,
      wakeupHour: 7,
      wakeupMinute: 0,
      sound: true
    },
    theme: 'light',
    dataRetention: 365,
    autoBackup: false
  })

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('lunosleep-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Check if app is installed (PWA) - improved detection
    const checkInstallStatus = () => {
      // Check for standalone mode (PWA installed)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      // Check for iOS Safari standalone
      const isInWebAppiOS = (window.navigator as any).standalone === true
      
      // Check for Android Chrome installed
      const isAndroidInstalled = window.matchMedia('(display-mode: minimal-ui)').matches
      
      // Check user agent for installed PWA indicators
      const userAgent = navigator.userAgent.toLowerCase()
      const isInstallIndicator = userAgent.includes('wv') || // WebView
                                userAgent.includes('standalone') ||
                                document.referrer.includes('android-app://')
      
      return isStandalone || isInWebAppiOS || isAndroidInstalled || isInstallIndicator
    }

    setIsInstalled(checkInstallStatus())

    // Listen for app install events
    const handleAppInstalled = () => setIsInstalled(true)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('lunosleep-settings', JSON.stringify(settings))
    
    // Setup notifications if enabled
    if (settings.notifications.enabled) {
      setupNotifications()
    }
  }, [settings])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)
        
        if (permission === 'granted') {
          setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, enabled: true }
          }))
          
          // Show test notification
          new Notification('Lunosleep', {
            body: 'Notifikasi berhasil diaktifkan! Anda akan mendapat pengingat sesuai jadwal.',
            icon: '/icon-192.svg',
            tag: 'test-notification'
          })
        } else if (permission === 'denied') {
          alert('Notifikasi diblokir. Silakan aktifkan melalui pengaturan browser.')
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error)
        alert('Gagal meminta izin notifikasi. Coba lagi atau aktifkan melalui pengaturan browser.')
      }
    } else {
      alert('Browser Anda tidak mendukung notifikasi.')
    }
  }

  const setupNotifications = () => {
    if (!settings.notifications.enabled || notificationPermission !== 'granted') return

    // Clear existing timeouts
    const existingTimeouts = JSON.parse(localStorage.getItem('lunosleep-timeouts') || '[]')
    existingTimeouts.forEach((timeoutId: number) => clearTimeout(timeoutId))
    localStorage.removeItem('lunosleep-timeouts')

    const newTimeouts: number[] = []

    // Schedule bedtime reminder
    if (settings.notifications.bedtimeReminder) {
      const timeoutId = scheduleDailyNotification(
        'bedtime',
        settings.notifications.bedtimeHour,
        settings.notifications.bedtimeMinute,
        'Waktu Istirahat',
        'Mungkin saatnya untuk mulai bersiap tidur. Tubuh Anda butuh istirahat yang berkualitas.'
      )
      if (timeoutId) newTimeouts.push(timeoutId)
    }

    // Schedule wakeup reminder
    if (settings.notifications.wakeupReminder) {
      const timeoutId = scheduleDailyNotification(
        'wakeup',
        settings.notifications.wakeupHour,
        settings.notifications.wakeupMinute,
        'Selamat Pagi',
        'Jangan lupa catat bagaimana perasaan Anda setelah bangun tidur hari ini.'
      )
      if (timeoutId) newTimeouts.push(timeoutId)
    }

    // Save timeout IDs for cleanup
    localStorage.setItem('lunosleep-timeouts', JSON.stringify(newTimeouts))
  }

  const scheduleDailyNotification = (type: string, hour: number, minute: number, title: string, body: string): number | null => {
    const now = new Date()
    const scheduledTime = new Date()
    scheduledTime.setHours(hour, minute, 0, 0)

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime()

    // Don't schedule if time is too far in the future (more than 24 hours)
    if (timeUntilNotification > 24 * 60 * 60 * 1000) {
      return null
    }

    const timeoutId = window.setTimeout(() => {
      if (notificationPermission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/icon-192.svg',
            badge: '/icon-192.svg',
            tag: type,
            requireInteraction: false,
            silent: !settings.notifications.sound,
            timestamp: Date.now()
          })
        } catch (error) {
          console.error('Error showing notification:', error)
        }
      }

      // Schedule next occurrence
      scheduleDailyNotification(type, hour, minute, title, body)
    }, timeUntilNotification)

    return timeoutId
  }

  const exportData = () => {
    const sleepEntries = localStorage.getItem('lunosleep-entries')
    const settingsData = localStorage.getItem('lunosleep-settings')
    
    const exportData = {
      entries: sleepEntries ? JSON.parse(sleepEntries) : [],
      settings: settingsData ? JSON.parse(settingsData) : {},
      exportDate: new Date().toISOString(),
      version: '1.0'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `lunosleep-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('lunosleep-entries')
      localStorage.removeItem('lunosleep-settings')
      alert('Semua data telah dihapus. Halaman akan dimuat ulang.')
      window.location.reload()
    }
  }

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h2>
        <p className="text-gray-600">Sesuaikan aplikasi dengan preferensi Anda</p>
      </div>

      {/* PWA Installation Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-mint-600" />
          Status Aplikasi
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                {isInstalled ? 'Aplikasi Terinstall' : 'Belum Terinstall'}
              </p>
              <p className="text-sm text-gray-600">
                {isInstalled 
                  ? 'Lunosleep sudah terpasang di perangkat Anda'
                  : 'Install aplikasi untuk pengalaman yang lebih baik'
                }
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-yellow-500'}`} />
          </div>
          
          {!isInstalled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3 text-blue-800 text-sm mb-3">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Tips:</strong> Install aplikasi ke home screen untuk akses yang lebih mudah dan notifikasi yang lebih reliable.
                </div>
              </div>
              <p className="text-blue-700 text-xs">
                Lihat panduan lengkap di tab <strong>Bantuan</strong> → <strong>Cara Install Aplikasi</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-mint-600" />
          Pengaturan Notifikasi
        </h3>

        {notificationPermission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              Notifikasi diblokir. Aktifkan melalui pengaturan browser untuk menggunakan fitur pengingat.
            </p>
          </div>
        )}

        {notificationPermission === 'default' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm mb-3">
              Izinkan notifikasi untuk mendapatkan pengingat tidur yang lembut.
            </p>
            <button onClick={requestNotificationPermission} className="btn-primary text-sm">
              Izinkan Notifikasi
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Aktifkan Notifikasi</p>
              <p className="text-sm text-gray-600">Pengingat lembut untuk rutinitas tidur</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, enabled: !prev.notifications.enabled }
              }))}
              disabled={notificationPermission !== 'granted'}
              className={`toggle-switch ${settings.notifications.enabled ? 'active' : ''} ${
                notificationPermission !== 'granted' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {settings.notifications.enabled && (
            <>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-900">Pengingat Tidur</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, bedtimeReminder: !prev.notifications.bedtimeReminder }
                    }))}
                    className={`toggle-switch ${settings.notifications.bedtimeReminder ? 'active' : ''}`}
                  />
                </div>
                
                {settings.notifications.bedtimeReminder && (
                  <div className="ml-6">
                    <TimePicker
                      value={{
                        hour: settings.notifications.bedtimeHour,
                        minute: settings.notifications.bedtimeMinute
                      }}
                      onChange={(time) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          bedtimeHour: time.hour,
                          bedtimeMinute: time.minute
                        }
                      }))}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-900">Pengingat Check-in Pagi</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, wakeupReminder: !prev.notifications.wakeupReminder }
                    }))}
                    className={`toggle-switch ${settings.notifications.wakeupReminder ? 'active' : ''}`}
                  />
                </div>
                
                {settings.notifications.wakeupReminder && (
                  <div className="ml-6">
                    <TimePicker
                      value={{
                        hour: settings.notifications.wakeupHour,
                        minute: settings.notifications.wakeupMinute
                      }}
                      onChange={(time) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          wakeupHour: time.hour,
                          wakeupMinute: time.minute
                        }
                      }))}
                      className="max-w-xs"
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Suara Notifikasi</span>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sound: !prev.notifications.sound }
                    }))}
                    className={`toggle-switch ${settings.notifications.sound ? 'active' : ''}`}
                  />
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => {
                      if (notificationPermission === 'granted') {
                        new Notification('Test Notifikasi', {
                          body: 'Ini adalah test notifikasi dari Lunosleep. Jika Anda melihat ini, notifikasi berfungsi dengan baik!',
                          icon: '/icon-192.svg',
                          tag: 'test',
                          silent: !settings.notifications.sound
                        })
                      } else {
                        alert('Izin notifikasi belum diberikan. Klik "Izinkan Notifikasi" terlebih dahulu.')
                      }
                    }}
                    disabled={notificationPermission !== 'granted'}
                    className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Test Notifikasi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-mint-600" />
          Manajemen Data
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Backup data tidur Anda ke file JSON</p>
            </div>
            <button onClick={exportData} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="font-medium text-red-900">Hapus Semua Data</p>
              <p className="text-sm text-red-600">Menghapus semua data tidur dan pengaturan</p>
            </div>
            <button onClick={clearAllData} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Aplikasi</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Versi:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Developer:</span>
            <span className="font-medium">Lunetix Health</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data Storage:</span>
            <span className="font-medium">Local Browser</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Privacy:</span>
            <span className="font-medium text-green-600">100% Private</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Display Mode:</span>
            <span className="font-medium text-xs">
              {typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Notification Support:</span>
            <span className="font-medium text-xs">
              {typeof window !== 'undefined' && 'Notification' in window ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Worker:</span>
            <span className="font-medium text-xs">
              {typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-r from-mint-50 to-teal-50 rounded-xl p-6 border border-mint-200">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-mint-600" />
          Privasi & Keamanan
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          Semua data Anda disimpan secara lokal di perangkat dan tidak pernah dikirim ke server. 
          Lunosleep menghormati privasi Anda dan tidak mengumpulkan data personal apapun. 
          Data hanya dapat diakses oleh Anda melalui browser yang sama.
        </p>
      </div>
    </div>
  )
}