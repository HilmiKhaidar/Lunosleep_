'use client'

import { useMemo } from 'react'
import { Clock, Moon, Sun, TrendingUp, Calendar, BarChart3, Smile, Minus, Frown, Sparkles, Target } from 'lucide-react'
import { SleepEntry } from '../types/sleep'

interface SleepStatsProps {
  entries: SleepEntry[]
}

export default function SleepStats({ entries }: SleepStatsProps) {
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        averageDuration: 0,
        averageBedtime: '00:00',
        averageWakeTime: '00:00',
        qualityDistribution: { fresh: 0, normal: 0, tired: 0 },
        totalEntries: 0,
        longestSleep: 0,
        shortestSleep: 0,
        consistencyScore: 0
      }
    }

    // Calculate averages
    const validEntries = entries.filter(e => e.sleepDuration && e.sleepDuration > 0)
    const totalDuration = validEntries.reduce((sum, entry) => sum + (entry.sleepDuration || 0), 0)
    const averageDuration = totalDuration / validEntries.length

    // Calculate average bedtime and wake time
    const bedtimes = entries.filter(e => e.bedtime).map(e => {
      const [hour, min] = e.bedtime!.split(':').map(Number)
      return hour * 60 + min
    })
    
    const waketimes = entries.filter(e => e.wakeTime).map(e => {
      const [hour, min] = e.wakeTime!.split(':').map(Number)
      return hour * 60 + min
    })

    const avgBedtime = bedtimes.length > 0 ? bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length : 0
    const avgWaketime = waketimes.length > 0 ? waketimes.reduce((a, b) => a + b, 0) / waketimes.length : 0

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = Math.round(minutes % 60)
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }

    // Quality distribution
    const qualityDistribution = {
      fresh: entries.filter(e => e.sleepQuality === 'fresh').length,
      normal: entries.filter(e => e.sleepQuality === 'normal').length,
      tired: entries.filter(e => e.sleepQuality === 'tired').length
    }

    // Sleep duration range
    const durations = validEntries.map(e => e.sleepDuration!).sort((a, b) => a - b)
    const longestSleep = durations[durations.length - 1] || 0
    const shortestSleep = durations[0] || 0

    // Consistency score (based on standard deviation of sleep duration)
    const variance = validEntries.reduce((sum, entry) => {
      const diff = (entry.sleepDuration || 0) - averageDuration
      return sum + diff * diff
    }, 0) / validEntries.length
    
    const stdDev = Math.sqrt(variance)
    const consistencyScore = Math.max(0, Math.min(100, 100 - (stdDev / 60) * 10)) // Convert to 0-100 scale

    return {
      averageDuration,
      averageBedtime: formatTime(avgBedtime),
      averageWakeTime: formatTime(avgWaketime),
      qualityDistribution,
      totalEntries: entries.length,
      longestSleep,
      shortestSleep,
      consistencyScore
    }
  }, [entries])

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}j ${mins}m`
  }

  const getQualityPercentage = (count: number): number => {
    return stats.totalEntries > 0 ? Math.round((count / stats.totalEntries) * 100) : 0
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Mulai catat tidur Anda untuk melihat pola dan statistik yang bermakna. 
            Setiap pencatatan membantu membangun pemahaman yang lebih baik.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-mint-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
          <p className="text-sm text-gray-600">Hari Tercatat</p>
        </div>
        
        <div className="card text-center">
          <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.averageDuration)}</p>
          <p className="text-sm text-gray-600">Rata-rata Durasi</p>
        </div>
        
        <div className="card text-center">
          <Moon className="w-8 h-8 text-mint-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.averageBedtime}</p>
          <p className="text-sm text-gray-600">Rata-rata Tidur</p>
        </div>
        
        <div className="card text-center">
          <Sun className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.averageWakeTime}</p>
          <p className="text-sm text-gray-600">Rata-rata Bangun</p>
        </div>
      </div>

      {/* Sleep Quality Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-mint-600" />
          Distribusi Kualitas Tidur
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'fresh', label: 'Segar', icon: Smile, color: 'bg-green-500', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
            { key: 'normal', label: 'Biasa Saja', icon: Minus, color: 'bg-yellow-500', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
            { key: 'tired', label: 'Lelah', icon: Frown, color: 'bg-red-500', bgColor: 'bg-red-50', iconColor: 'text-red-600' }
          ].map(({ key, label, icon: IconComponent, color, bgColor, iconColor }) => {
            const count = stats.qualityDistribution[key as keyof typeof stats.qualityDistribution]
            const percentage = getQualityPercentage(count)
            
            return (
              <div key={key} className={`${bgColor} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${iconColor}`} />
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{count}</span>
                    <span className="text-sm text-gray-600 ml-1">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sleep Duration Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Durasi Tidur</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Terlama:</span>
              <span className="font-semibold text-green-600">{formatDuration(stats.longestSleep)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Terpendek:</span>
              <span className="font-semibold text-red-600">{formatDuration(stats.shortestSleep)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rata-rata:</span>
              <span className="font-semibold text-mint-600">{formatDuration(stats.averageDuration)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Konsistensi Tidur</h3>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray={`${stats.consistencyScore}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-mint-600">{Math.round(stats.consistencyScore)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Skor konsistensi menunjukkan seberapa teratur pola tidur Anda
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-mint-50 to-teal-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Refleksi Statistik</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {stats.averageDuration >= 420 && stats.averageDuration <= 540 && (
            <p className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Durasi tidur Anda berada dalam rentang yang sehat (7-9 jam)
            </p>
          )}
          {stats.consistencyScore >= 70 && (
            <p className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Pola tidur Anda cukup konsisten, ini menunjukkan ritme yang baik
            </p>
          )}
          {stats.qualityDistribution.fresh > stats.qualityDistribution.tired && (
            <p className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-green-600" />
              Lebih sering merasa segar setelah bangun - tanda tidur yang berkualitas
            </p>
          )}
          <p className="italic">
            "Setiap data adalah cerminan perjalanan unik Anda. Tidak ada standar yang harus dipaksakan, 
            yang penting adalah pemahaman dan kesadaran diri."
          </p>
        </div>
      </div>
    </div>
  )
}