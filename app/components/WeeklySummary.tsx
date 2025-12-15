'use client'

import { useMemo, useState } from 'react'
import { Calendar, Clock, TrendingUp, Moon, Sun, BarChart3, Smile, Minus, Frown, Circle, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react'
import DayDetailModal from './DayDetailModal'
import { SleepEntry } from '../types/sleep'
import { startOfWeek, endOfWeek, format, eachDayOfInterval, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'

interface WeeklySummaryProps {
  entries: SleepEntry[]
  onEditEntry?: (entry: SleepEntry) => void
}

export default function WeeklySummary({ entries, onEditEntry }: WeeklySummaryProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const weeklyData = useMemo(() => {
    const now = new Date()
    const weeks = []
    
    // Generate last 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekStart = startOfWeek(new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      
      const weekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= weekStart && entryDate <= weekEnd
      })
      
      const validEntries = weekEntries.filter(e => e.sleepDuration && e.sleepDuration > 0)
      const averageDuration = validEntries.length > 0 
        ? validEntries.reduce((sum, e) => sum + (e.sleepDuration || 0), 0) / validEntries.length 
        : 0
      
      // Most common quality
      const qualityCounts = {
        fresh: weekEntries.filter(e => e.sleepQuality === 'fresh').length,
        normal: weekEntries.filter(e => e.sleepQuality === 'normal').length,
        tired: weekEntries.filter(e => e.sleepQuality === 'tired').length
      }
      
      const mostCommonQuality = Object.entries(qualityCounts).reduce((a, b) => 
        qualityCounts[a[0] as keyof typeof qualityCounts] > qualityCounts[b[0] as keyof typeof qualityCounts] ? a : b
      )[0] as 'fresh' | 'normal' | 'tired'
      
      // Consistency score
      const durations = validEntries.map(e => e.sleepDuration!)
      const variance = durations.length > 1 
        ? durations.reduce((sum, d) => sum + Math.pow(d - averageDuration, 2), 0) / durations.length
        : 0
      const stdDev = Math.sqrt(variance)
      const consistency = Math.max(0, Math.min(100, 100 - (stdDev / 60) * 10))
      
      weeks.push({
        weekStart: format(weekStart, 'yyyy-MM-dd'),
        weekEnd: format(weekEnd, 'yyyy-MM-dd'),
        weekLabel: format(weekStart, 'dd MMM', { locale: id }),
        entries: weekEntries,
        averageDuration,
        mostCommonQuality,
        consistency,
        daysLogged: weekEntries.length
      })
    }
    
    return weeks.reverse() // Show oldest to newest
  }, [entries])

  const currentWeekData = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    return daysOfWeek.map(day => {
      const entry = entries.find(e => isSameDay(new Date(e.date), day))
      return {
        date: day,
        entry,
        dayName: format(day, 'EEE', { locale: id }),
        dayNumber: format(day, 'd')
      }
    })
  }, [entries])

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}j ${mins}m`
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'fresh': return 'bg-green-500'
      case 'normal': return 'bg-yellow-500'
      case 'tired': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'fresh': return <Smile className="w-4 h-4 text-green-600" />
      case 'normal': return <Minus className="w-4 h-4 text-yellow-600" />
      case 'tired': return <Frown className="w-4 h-4 text-red-600" />
      default: return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Current Week Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-mint-600" />
            Minggu Ini
          </h3>
          <div className="text-sm text-gray-600">
            {currentWeekData.length > 0 && (
              <>
                {format(currentWeekData[0].date, 'dd MMM', { locale: id })} - {format(currentWeekData[currentWeekData.length - 1].date, 'dd MMM yyyy', { locale: id })}
              </>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-mint-50 to-teal-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-mint-600" />
            <span><strong>Tip:</strong> Klik pada tanggal untuk melihat detail tidur atau menambah catatan</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {currentWeekData.map(({ date, entry, dayName, dayNumber }) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const compareDate = new Date(date)
            compareDate.setHours(0, 0, 0, 0)
            
            const isToday = compareDate.getTime() === today.getTime()
            const isPast = compareDate < today
            const isFuture = compareDate > today
            
            return (
              <div key={date.toISOString()} className="text-center">
                <div className="text-xs text-gray-600 mb-1 font-medium">{dayName}</div>
                <button
                  onClick={() => {
                    setSelectedDate(date)
                    setIsModalOpen(true)
                  }}
                  className={`w-14 h-14 mx-auto rounded-xl border-2 flex flex-col items-center justify-center text-xs transition-all duration-200 hover:scale-105 ${
                    isToday
                      ? 'border-mint-400 bg-mint-100 ring-2 ring-mint-200'
                      : entry 
                        ? 'border-mint-200 bg-mint-50 hover:border-mint-300 hover:bg-mint-100' 
                        : isFuture
                          ? 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                  } cursor-pointer`}
                >
                  <div className={`font-semibold ${
                    isToday ? 'text-mint-700' : 'text-gray-900'
                  }`}>
                    {dayNumber}
                  </div>
                  {entry && (
                    <div className="flex justify-center leading-none mt-0.5">
                      {getQualityIcon(entry.sleepQuality || '')}
                    </div>
                  )}
                  {!entry && isPast && (
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-0.5" />
                  )}
                </button>
                {entry && entry.sleepDuration && (
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    {formatDuration(entry.sleepDuration)}
                  </div>
                )}
                {isToday && (
                  <div className="text-xs text-mint-600 font-medium mt-0.5">
                    Hari Ini
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-mint-600" />
          Tren 4 Minggu Terakhir
        </h3>
        
        {weeklyData.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada data mingguan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div key={week.weekStart} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Minggu {week.weekLabel}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {week.daysLogged} hari tercatat
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex justify-center mb-1">
                      {getQualityIcon(week.mostCommonQuality)}
                    </div>
                    <div className="text-xs text-gray-600">Dominan</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="text-gray-600">Rata-rata</p>
                      <p className="font-medium">{formatDuration(week.averageDuration)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-mint-600" />
                    <div>
                      <p className="text-gray-600">Konsistensi</p>
                      <p className="font-medium">{Math.round(week.consistency)}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-gray-600">Pencatatan</p>
                      <p className="font-medium">{week.daysLogged}/7 hari</p>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar for consistency */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Konsistensi</span>
                    <span>{Math.round(week.consistency)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-mint-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${week.consistency}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Insights */}
      {weeklyData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Week */}
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Minggu Terbaik
            </h4>
            {(() => {
              const bestWeek = weeklyData.reduce((best, current) => 
                current.consistency > best.consistency ? current : best
              )
              return (
                <div className="space-y-2 text-sm">
                  <p className="text-green-700">
                    <strong>Minggu {bestWeek.weekLabel}</strong>
                  </p>
                  <p className="text-green-600">
                    Konsistensi: {Math.round(bestWeek.consistency)}%
                  </p>
                  <p className="text-green-600">
                    Rata-rata: {formatDuration(bestWeek.averageDuration)}
                  </p>
                </div>
              )
            })()}
          </div>

          {/* Recent Trend */}
          <div className="card bg-gradient-to-br from-mint-50 to-teal-50 border-mint-200">
            <h4 className="font-semibold text-mint-800 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Tren Terkini
            </h4>
            {(() => {
              const recentWeeks = weeklyData.slice(-2)
              if (recentWeeks.length < 2) {
                return <p className="text-sm text-mint-600">Butuh lebih banyak data</p>
              }
              
              const [prevWeek, currentWeek] = recentWeeks
              const durationChange = currentWeek.averageDuration - prevWeek.averageDuration
              const consistencyChange = currentWeek.consistency - prevWeek.consistency
              
              return (
                <div className="space-y-2 text-sm text-mint-700">
                  <p className="flex items-center gap-2">
                    <span>Durasi:</span>
                    {durationChange > 0 ? <ArrowUp className="w-3 h-3 text-green-600" /> : 
                     durationChange < 0 ? <ArrowDown className="w-3 h-3 text-red-600" /> : 
                     <ArrowRight className="w-3 h-3 text-gray-600" />}
                    <span>{Math.abs(Math.round(durationChange))} menit</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>Konsistensi:</span>
                    {consistencyChange > 0 ? <ArrowUp className="w-3 h-3 text-green-600" /> : 
                     consistencyChange < 0 ? <ArrowDown className="w-3 h-3 text-red-600" /> : 
                     <ArrowRight className="w-3 h-3 text-gray-600" />}
                    <span>{Math.abs(Math.round(consistencyChange))}%</span>
                  </p>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Weekly Reflection */}
      <div className="bg-gradient-to-r from-mint-50 to-teal-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">Refleksi Mingguan</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            "Pola mingguan menunjukkan ritme alami Anda. Setiap minggu adalah kesempatan baru 
            untuk memahami kebutuhan istirahat yang berubah seiring aktivitas dan kondisi hidup."
          </p>
          <p className="italic">
            Tidak ada minggu yang sempurna - yang penting adalah kesadaran dan pembelajaran 
            dari setiap pengalaman tidur Anda.
          </p>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDate(null)
          }}
          date={selectedDate}
          entry={entries.find(e => isSameDay(new Date(e.date), selectedDate))}
          onEdit={(entry) => {
            setIsModalOpen(false)
            setSelectedDate(null)
            onEditEntry?.(entry)
          }}
        />
      )}
    </div>
  )
}