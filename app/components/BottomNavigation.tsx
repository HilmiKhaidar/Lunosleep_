'use client'

import { Sun, TrendingUp, Calendar, Settings, Heart, HelpCircle } from 'lucide-react'

type TabType = 'today' | 'stats' | 'weekly' | 'help' | 'settings'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const navItems: Array<{
    id: TabType
    label: string
    icon: any
    color: string
    activeColor: string
    disabled?: boolean
  }> = [
    { 
      id: 'today', 
      label: 'Check-in', 
      icon: Heart, 
      color: 'text-mint-600',
      activeColor: 'text-mint-600 bg-mint-50'
    },
    { 
      id: 'stats', 
      label: 'Dashboard', 
      icon: TrendingUp, 
      color: 'text-gray-500',
      activeColor: 'text-mint-600 bg-mint-50'
    },
    { 
      id: 'weekly', 
      label: 'Wawasan', 
      icon: Calendar, 
      color: 'text-gray-500',
      activeColor: 'text-mint-600 bg-mint-50'
    },
    { 
      id: 'help', 
      label: 'Bantuan', 
      icon: HelpCircle, 
      color: 'text-gray-500',
      activeColor: 'text-mint-600 bg-mint-50'
    },
    { 
      id: 'settings', 
      label: 'Pengaturan', 
      icon: Settings, 
      color: 'text-gray-500',
      activeColor: 'text-mint-600 bg-mint-50'
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom md:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onTabChange(item.id)}
              disabled={item.disabled}
              className={`flex flex-col items-center justify-center px-2 py-1 transition-colors ${
                isActive 
                  ? item.activeColor
                  : item.disabled 
                    ? 'text-gray-300 cursor-not-allowed'
                    : `${item.color} hover:text-mint-500 hover:bg-mint-50/50`
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}