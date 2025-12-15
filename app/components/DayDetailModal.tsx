'use client'

import { X, Clock, Moon, Sun, Heart, Edit3, Calendar, Smile, Minus, Frown, Circle } from 'lucide-react'
import { SleepEntry } from '../types/sleep'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface DayDetailModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  entry?: SleepEntry
  onEdit?: (entry: SleepEntry) => void
}

export default function DayDetailModal({ isOpen, onClose, date, entry, onEdit }: DayDetailModalProps) {
  if (!isOpen) return null

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}j ${mins}m`
  }

  const getQualityInfo = (quality?: string) => {
    switch (quality) {
      case 'fresh':
        return { 
          label: 'Segar', 
          color: 'text-green-600 bg-green-50', 
          icon: <Smile className="w-6 h-6 text-green-600" /> 
        }
      case 'normal':
        return { 
          label: 'Biasa Saja', 
          color: 'text-yellow-600 bg-yellow-50', 
          icon: <Minus className="w-6 h-6 text-yellow-600" /> 
        }
      case 'tired':
        return { 
          label: 'Lelah', 
          color: 'text-red-600 bg-red-50', 
          icon: <Frown className="w-6 h-6 text-red-600" /> 
        }
      default:
        return { 
          label: 'Tidak ada data', 
          color: 'text-gray-600 bg-gray-50', 
          icon: <Circle className="w-6 h-6 text-gray-400" /> 
        }
    }
  }

  const qualityInfo = getQualityInfo(entry?.sleepQuality)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  
  const isToday = compareDate.getTime() === today.getTime()
  const isPast = compareDate < today

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {format(date, 'EEEE', { locale: id })}
            </h3>
            <p className="text-sm text-gray-600">
              {format(date, 'dd MMMM yyyy', { locale: id })}
            </p>
            {isToday && (
              <span className="inline-block px-2 py-1 bg-mint-100 text-mint-700 text-xs font-medium rounded-full mt-1">
                Hari Ini
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {entry ? (
            <div className="space-y-6">
              {/* Sleep Summary */}
              <div className="bg-gradient-to-br from-mint-50 to-teal-50 rounded-xl p-4 border border-mint-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Ringkasan Tidur</h4>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(entry)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-mint-600" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Moon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Tidur</p>
                    <p className="font-semibold text-gray-900">{entry.bedtime || '--:--'}</p>
                  </div>
                  
                  <div className="text-center">
                    <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Bangun</p>
                    <p className="font-semibold text-gray-900">{entry.wakeTime || '--:--'}</p>
                  </div>
                </div>
              </div>

              {/* Duration & Quality */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">Durasi</p>
                  <p className="font-semibold text-gray-900">
                    {entry.sleepDuration ? formatDuration(entry.sleepDuration) : '--'}
                  </p>
                </div>
                
                <div className={`rounded-lg p-4 text-center ${qualityInfo.color}`}>
                  <div className="flex justify-center mb-2">{qualityInfo.icon}</div>
                  <p className="text-xs mb-1">Perasaan</p>
                  <p className="font-semibold">{qualityInfo.label}</p>
                </div>
              </div>

              {/* Notes */}
              {entry.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Catatan</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{entry.notes}</p>
                </div>
              )}

              {/* Sleep Score */}
              {entry.sleepDuration && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Analisis Tidur</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Durasi:</span>
                      <span className={`font-medium ${
                        entry.sleepDuration >= 420 && entry.sleepDuration <= 540 
                          ? 'text-green-600' 
                          : entry.sleepDuration < 360 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {entry.sleepDuration >= 420 && entry.sleepDuration <= 540 
                          ? 'Ideal (7-9 jam)' 
                          : entry.sleepDuration < 360 
                            ? 'Kurang (<6 jam)' 
                            : 'Cukup'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kualitas:</span>
                      <span className={`font-medium ${
                        entry.sleepQuality === 'fresh' 
                          ? 'text-green-600' 
                          : entry.sleepQuality === 'tired' 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                      }`}>
                        {entry.sleepQuality === 'fresh' 
                          ? 'Sangat Baik' 
                          : entry.sleepQuality === 'tired' 
                            ? 'Perlu Perbaikan' 
                            : 'Cukup Baik'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              {entry.createdAt && (
                <div className="text-center text-xs text-gray-500">
                  Dicatat pada {format(new Date(entry.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Belum Ada Data</h4>
              <p className="text-gray-600 text-sm mb-4">
                {isPast 
                  ? 'Tidak ada pencatatan tidur untuk tanggal ini'
                  : 'Belum waktunya untuk mencatat tidur'
                }
              </p>
              
              {isToday && (
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Catat Tidur Sekarang
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {entry && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Tutup
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(entry)}
                  className="flex-1 btn-primary"
                >
                  Edit Data
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}