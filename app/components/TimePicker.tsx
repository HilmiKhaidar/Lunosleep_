'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Clock } from 'lucide-react'

interface TimePickerProps {
  value: { hour: number; minute: number }
  onChange: (time: { hour: number; minute: number }) => void
  label?: string
  className?: string
}

export default function TimePicker({ value, onChange, label, className = '' }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempHour, setTempHour] = useState(value.hour)
  const [tempMinute, setTempMinute] = useState(value.minute)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTempHour(value.hour)
    setTempMinute(value.minute)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const handleConfirm = () => {
    onChange({ hour: tempHour, minute: tempMinute })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempHour(value.hour)
    setTempMinute(value.minute)
    setIsOpen(false)
  }

  const adjustHour = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setTempHour(prev => prev === 23 ? 0 : prev + 1)
    } else {
      setTempHour(prev => prev === 0 ? 23 : prev - 1)
    }
  }

  const adjustMinute = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setTempMinute(prev => prev === 45 ? 0 : prev + 15)
    } else {
      setTempMinute(prev => prev === 0 ? 45 : prev - 15)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          {label}
        </label>
      )}
      
      {/* Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-900 hover:border-mint-300 focus:outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10 transition-all duration-200 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          {formatTime(value.hour, value.minute)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-900">Pilih Waktu</h4>
              <p className="text-sm text-gray-600">Atur jam dan menit</p>
            </div>
            
            {/* Time Selectors */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {/* Hour Selector */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => adjustHour('up')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-16 h-12 bg-mint-50 border-2 border-mint-200 rounded-lg flex items-center justify-center my-2">
                  <span className="text-xl font-bold text-mint-700">
                    {tempHour.toString().padStart(2, '0')}
                  </span>
                </div>
                
                <button
                  onClick={() => adjustHour('down')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="text-xs text-gray-500 mt-1">Jam</span>
              </div>

              {/* Separator */}
              <div className="text-2xl font-bold text-gray-400 mb-6">:</div>

              {/* Minute Selector */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => adjustMinute('up')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>
                
                <div className="w-16 h-12 bg-teal-50 border-2 border-teal-200 rounded-lg flex items-center justify-center my-2">
                  <span className="text-xl font-bold text-teal-700">
                    {tempMinute.toString().padStart(2, '0')}
                  </span>
                </div>
                
                <button
                  onClick={() => adjustMinute('down')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="text-xs text-gray-500 mt-1">Menit</span>
              </div>
            </div>

            {/* Quick Time Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: '21:00', hour: 21, minute: 0 },
                { label: '22:00', hour: 22, minute: 0 },
                { label: '23:00', hour: 23, minute: 0 },
                { label: '06:00', hour: 6, minute: 0 },
                { label: '07:00', hour: 7, minute: 0 },
                { label: '08:00', hour: 8, minute: 0 }
              ].map((time) => (
                <button
                  key={time.label}
                  onClick={() => {
                    setTempHour(time.hour)
                    setTempMinute(time.minute)
                  }}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    tempHour === time.hour && tempMinute === time.minute
                      ? 'bg-mint-100 border-mint-300 text-mint-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-mint-500 to-teal-500 hover:from-mint-600 hover:to-teal-600 rounded-lg transition-colors"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}