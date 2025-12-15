'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Clock, Heart, TrendingUp, Calendar } from 'lucide-react'
import BottomNavigation from './components/BottomNavigation'
import HelpPage from './components/HelpPage'
import SettingsPage from './components/SettingsPage'
import SleepLogger from './components/SleepLogger'
import SleepStats from './components/SleepStats'
import WeeklySummary from './components/WeeklySummary'
import { SleepEntry } from './types/sleep'

export default function Home() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'weekly' | 'help' | 'settings'>('today')

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('lunosleep-entries')
    if (savedEntries) {
      setSleepEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('lunosleep-entries', JSON.stringify(sleepEntries))
  }, [sleepEntries])

  const addSleepEntry = (entry: Omit<SleepEntry, 'id'>) => {
    const newEntry: SleepEntry = {
      ...entry,
      id: Date.now().toString()
    }
    setSleepEntries(prev => [...prev, newEntry])
  }

  const updateSleepEntry = (id: string, updates: Partial<SleepEntry>) => {
    setSleepEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    )
  }

  const getTodayEntry = () => {
    const today = new Date().toDateString()
    return sleepEntries.find(entry => 
      new Date(entry.date).toDateString() === today
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-mint-100 sticky top-0 z-10 safe-area-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-mint-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lunosleep</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Kesadaran Tidur Harian</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-600">Department of Health</p>
              <p className="text-xs text-mint-600 font-medium">Lunetix</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Desktop */}
      <nav className="bg-white border-b border-gray-100 sticky top-[73px] z-10 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'today', label: 'Hari Ini', icon: Sun },
              { id: 'stats', label: 'Statistik', icon: TrendingUp },
              { id: 'weekly', label: 'Mingguan', icon: Calendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'text-mint-600 bg-mint-50 border-b-2 border-mint-500'
                    : 'text-gray-600 hover:text-mint-600 hover:bg-mint-50/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl mobile-safe-bottom">
        {/* Welcome Message */}
        <div className="mb-6 md:mb-8 text-center px-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Selamat datang di perjalanan kesadaran tidur Anda
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Lunosleep membantu Anda memahami pola istirahat secara sederhana dan manusiawi. 
            Setiap pencatatan adalah langkah menuju kesadaran diri yang lebih baik.
          </p>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'today' && (
            <SleepLogger
              todayEntry={getTodayEntry()}
              onAddEntry={addSleepEntry}
              onUpdateEntry={updateSleepEntry}
            />
          )}
          
          {activeTab === 'stats' && (
            <SleepStats entries={sleepEntries} />
          )}
          
          {activeTab === 'weekly' && (
            <WeeklySummary 
              entries={sleepEntries} 
              onEditEntry={(entry) => {
                // Switch to today tab and trigger edit mode
                setActiveTab('today')
                // You can add additional logic here to pre-populate edit form
              }}
            />
          )}
          
          {activeTab === 'help' && (
            <HelpPage />
          )}
          
          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}