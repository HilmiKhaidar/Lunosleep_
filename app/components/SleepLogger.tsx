'use client'

import { useState } from 'react'
import { Clock, Moon, Sun, Heart, Edit3, Save, X, Smile, Minus, Frown } from 'lucide-react'
import TimePicker from './TimePicker'
import { SleepEntry } from '../types/sleep'

interface SleepLoggerProps {
  todayEntry?: SleepEntry
  onAddEntry: (entry: Omit<SleepEntry, 'id'>) => void
  onUpdateEntry: (id: string, updates: Partial<SleepEntry>) => void
}

export default function SleepLogger({ todayEntry, onAddEntry, onUpdateEntry }: SleepLoggerProps) {
  const [isEditing, setIsEditing] = useState(!todayEntry)
  const [formData, setFormData] = useState({
    bedtime: todayEntry?.bedtime || '',
    wakeTime: todayEntry?.wakeTime || '',
    sleepQuality: todayEntry?.sleepQuality || 'normal' as const,
    notes: todayEntry?.notes || ''
  })

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    if (!bedtime || !wakeTime) return 0
    
    const [bedHour, bedMin] = bedtime.split(':').map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number)
    
    let bedMinutes = bedHour * 60 + bedMin
    let wakeMinutes = wakeHour * 60 + wakeMin
    
    // Handle overnight sleep
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60
    }
    
    return wakeMinutes - bedMinutes
  }

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}j ${mins}m`
  }

  const handleSave = () => {
    const duration = calculateDuration(formData.bedtime, formData.wakeTime)
    const now = new Date().toISOString()
    
    const entryData = {
      date: new Date().toISOString().split('T')[0],
      bedtime: formData.bedtime,
      wakeTime: formData.wakeTime,
      sleepDuration: duration,
      sleepQuality: formData.sleepQuality,
      notes: formData.notes,
      createdAt: todayEntry?.createdAt || now,
      updatedAt: now
    }

    if (todayEntry) {
      onUpdateEntry(todayEntry.id, entryData)
    } else {
      onAddEntry(entryData)
    }
    
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (todayEntry) {
      setFormData({
        bedtime: todayEntry.bedtime || '',
        wakeTime: todayEntry.wakeTime || '',
        sleepQuality: todayEntry.sleepQuality || 'normal',
        notes: todayEntry.notes || ''
      })
      setIsEditing(false)
    }
  }

  const qualityOptions = [
    { value: 'fresh', label: 'Segar', icon: 'Smile', color: 'text-green-600 bg-green-50 border-green-200' },
    { value: 'normal', label: 'Biasa Saja', icon: 'Minus', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { value: 'tired', label: 'Lelah', icon: 'Frown', color: 'text-red-600 bg-red-50 border-red-200' }
  ]

  const selectedQuality = qualityOptions.find(q => q.value === formData.sleepQuality)
  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'fresh': return Smile
      case 'normal': return Minus
      case 'tired': return Frown
      default: return Minus
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Today's Sleep Card */}
      <div className="card card-progress">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-mint-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tidur Hari Ini</h3>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          {!isEditing && todayEntry && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary !px-4 !py-2 text-sm"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            {/* Sleep Times */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TimePicker
                label="Waktu Tidur"
                value={{
                  hour: formData.bedtime ? parseInt(formData.bedtime.split(':')[0]) : 22,
                  minute: formData.bedtime ? parseInt(formData.bedtime.split(':')[1]) : 0
                }}
                onChange={(time) => {
                  const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
                  setFormData(prev => ({ ...prev, bedtime: timeString }))
                }}
              />
              
              <TimePicker
                label="Waktu Bangun"
                value={{
                  hour: formData.wakeTime ? parseInt(formData.wakeTime.split(':')[0]) : 7,
                  minute: formData.wakeTime ? parseInt(formData.wakeTime.split(':')[1]) : 0
                }}
                onChange={(time) => {
                  const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
                  setFormData(prev => ({ ...prev, wakeTime: timeString }))
                }}
              />
            </div>

            {/* Duration Display */}
            {formData.bedtime && formData.wakeTime && (
              <div className="bg-mint-50 rounded-lg p-4 text-center">
                <Clock className="w-5 h-5 text-mint-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Durasi Tidur</p>
                <p className="text-xl font-semibold text-mint-600">
                  {formatDuration(calculateDuration(formData.bedtime, formData.wakeTime))}
                </p>
              </div>
            )}

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bagaimana perasaan Anda setelah bangun tidur?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {qualityOptions.map((option) => {
                  const IconComponent = option.icon === 'Smile' ? Smile : option.icon === 'Minus' ? Minus : Frown;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, sleepQuality: option.value as any }))}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.sleepQuality === option.value
                          ? option.color
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-medium">{option.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (opsional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Bagaimana kualitas tidur Anda? Ada yang ingin dicatat?"
                className="input-field resize-none h-20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!formData.bedtime || !formData.wakeTime}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </button>
              
              {todayEntry && (
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  <X className="w-4 h-4 mr-2" />
                  Batal
                </button>
              )}
            </div>
          </div>
        ) : todayEntry ? (
          <div className="space-y-4">
            {/* Sleep Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <Moon className="w-5 h-5 text-mint-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Tidur</p>
                <p className="font-semibold">{todayEntry.bedtime}</p>
              </div>
              
              <div className="text-center">
                <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Bangun</p>
                <p className="font-semibold">{todayEntry.wakeTime}</p>
              </div>
              
              <div className="text-center">
                <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Durasi</p>
                <p className="font-semibold">{formatDuration(todayEntry.sleepDuration || 0)}</p>
              </div>
              
              <div className="text-center">
                <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Perasaan</p>
                <p className="font-semibold">{selectedQuality?.label}</p>
              </div>
            </div>

            {/* Notes */}
            {todayEntry.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{todayEntry.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Moon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Belum ada pencatatan tidur hari ini</p>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Mulai Catat Tidur
            </button>
          </div>
        )}
      </div>

      {/* Gentle Reminder */}
      <div className="bg-gradient-to-r from-mint-50 to-teal-50 rounded-xl p-6 text-center">
        <h4 className="font-semibold text-gray-900 mb-2">Refleksi Harian</h4>
        <p className="text-sm text-gray-600">
          "Setiap pencatatan adalah langkah menuju pemahaman yang lebih dalam tentang kebutuhan istirahat Anda. 
          Tidak ada yang salah dengan ritme tidur Anda - yang penting adalah kesadaran."
        </p>
      </div>
    </div>
  )
}