export interface SleepEntry {
  id: string
  date: string // ISO date string
  bedtime?: string // HH:MM format
  wakeTime?: string // HH:MM format
  sleepDuration?: number // in minutes
  sleepQuality?: 'fresh' | 'normal' | 'tired' // segar, biasa saja, lelah
  notes?: string
  // New fields
  sleepLatency?: number // time to fall asleep in minutes
  nightWakeups?: number // number of times woke up
  environment?: {
    temperature?: 'cold' | 'cool' | 'comfortable' | 'warm' | 'hot'
    noise?: 'silent' | 'quiet' | 'moderate' | 'noisy' | 'very_noisy'
    light?: 'dark' | 'dim' | 'moderate' | 'bright' | 'very_bright'
  }
  mood?: {
    beforeSleep?: 'stressed' | 'anxious' | 'neutral' | 'calm' | 'relaxed'
    afterWakeup?: 'groggy' | 'tired' | 'neutral' | 'refreshed' | 'energetic'
  }
  activities?: {
    caffeine?: boolean
    alcohol?: boolean
    exercise?: boolean
    screenTime?: boolean
    meditation?: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface SleepGoals {
  targetDuration: number // in minutes
  targetBedtime: string // HH:MM
  targetWakeTime: string // HH:MM
  weeklyGoal: number // days per week
  isActive: boolean
}

export interface SleepStats {
  averageDuration: number
  averageBedtime: string
  averageWakeTime: string
  qualityDistribution: {
    fresh: number
    normal: number
    tired: number
  }
  totalEntries: number
}

export interface WeeklyData {
  weekStart: string
  entries: SleepEntry[]
  averageDuration: number
  mostCommonQuality: 'fresh' | 'normal' | 'tired'
  consistency: number // 0-100 score
}