import { generateMonthlySchedule } from '../data/calendarData'
import { api } from './api.js'

const scheduleCache = {}

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isDateLocked = (date) => {
  const now = new Date()
  const timeDiff = date - now
  const hoursUntilDelivery = timeDiff / (1000 * 60 * 60)
  return hoursUntilDelivery < 24
}

const getMonthCacheKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`

const ensureMonthSchedule = (year, month) => {
  const monthKey = getMonthCacheKey(year, month)
  if (!scheduleCache[monthKey]) {
    scheduleCache[monthKey] = generateMonthlySchedule(year, month)
  }
  return scheduleCache[monthKey]
}

export const getCalendarSchedules = async (_userId, year, month) => {
  const response = await api.get('/calendar', { params: { year, month } })
  return response.data || {}
}

export const getScheduleForDate = async (dateStr) => {
  const response = await api.get(`/calendar/${dateStr}`)
  return response.data || {}
}

export const getScheduleForDateSync = (dateStr) => {
  const date = new Date(dateStr)
  return ensureMonthSchedule(date.getFullYear(), date.getMonth() + 1)[dateStr] || {
    dietType: 'veg',
    isLocked: false,
  }
}

export const updateSchedule = async (dateStr, dietType) => {
  const response = await api.patch(`/calendar/${dateStr}`, { dietType })
  return response.data
}

export const calculateMonthlyOutlook = (schedules) => {
  const dates = Object.keys(schedules)
  const counts = {
    veg: 0,
    nonVeg: 0,
    vegan: 0,
  }

  dates.forEach((dateStr) => {
    const dietType = schedules[dateStr].dietType
    if (dietType === 'veg') counts.veg += 1
    else if (dietType === 'non-veg') counts.nonVeg += 1
    else if (dietType === 'vegan') counts.vegan += 1
  })

  const total = dates.length
  return {
    veg: Math.round((counts.veg / total) * 100),
    nonVeg: Math.round((counts.nonVeg / total) * 100),
    vegan: Math.round((counts.vegan / total) * 100),
  }
}

export { formatDateKey, isDateLocked };
