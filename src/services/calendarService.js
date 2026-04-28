// src/services/calendarService.js
//
// Works fully offline using local mock data.
// Real API calls are attempted first; any failure falls back to localStorage.

import { generateMonthlySchedule } from '../data/calendarData'
import { api } from './api.js'

// ---------------------------------------------------------------------------
// Local schedule store (user overrides persisted to localStorage)
// ---------------------------------------------------------------------------
const LOCAL_KEY = '__macrobites_schedules__'

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') } catch { return {} }
}
const saveLocal = (s) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(s)) } catch {}
}

let _local = loadLocal()

// Seed cache — generated once per year-month
const _seeds = {}
const getSeed = (year, month) => {
  const key = `${year}-${String(month).padStart(2, '0')}`
  if (!_seeds[key]) _seeds[key] = generateMonthlySchedule(year, month)
  return _seeds[key]
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
export const formatDateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * A date is locked if it is TODAY or in the PAST.
 * Users may only edit dates that are at least tomorrow (≥ 24 h ahead).
 */
export const isDateLocked = (date) => {
  const now = new Date()
  // Normalise both to midnight so we compare calendar days, not clock time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // Locked if target is today or earlier
  return target <= today
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All schedules for a month (tries API, falls back to local mock). */
export const getCalendarSchedules = async (_userId, year, month) => {
  try {
    const res = await api.get('/calendar', { params: { year, month } })
    if (res.data && Object.keys(res.data).length > 0) return res.data
    throw new Error('empty')
  } catch {
    const seed = getSeed(year, month)
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    const merged = { ...seed }

    // Apply saved user overrides for this month
    Object.entries(_local).forEach(([k, v]) => {
      if (k.startsWith(prefix)) merged[k] = { ...merged[k], ...v }
    })

    // Re-stamp locked status based on correct logic
    Object.keys(merged).forEach((dateStr) => {
      const d = new Date(dateStr + 'T00:00:00')
      merged[dateStr] = { ...merged[dateStr], isLocked: isDateLocked(d) }
    })

    return merged
  }
}

/** Schedule for a single date (async, with fallback). */
export const getScheduleForDate = async (dateStr) => {
  try {
    const res = await api.get(`/calendar/${dateStr}`)
    if (res.data?.dietType) return res.data
    throw new Error('empty')
  } catch {
    return getScheduleForDateSync(dateStr)
  }
}

/** Synchronous fallback — always works without network. */
export const getScheduleForDateSync = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00')
  const locked = isDateLocked(date)

  if (_local[dateStr]) {
    return { dietType: _local[dateStr].dietType, isLocked: locked }
  }

  const seed = getSeed(date.getFullYear(), date.getMonth() + 1)
  return { dietType: seed[dateStr]?.dietType ?? 'veg', isLocked: locked }
}

/** Persist a diet change. Saves locally immediately; tries API in background. */
export const updateSchedule = async (dateStr, dietType) => {
  _local = { ..._local, [dateStr]: { dietType } }
  saveLocal(_local)

  try {
    const res = await api.patch(`/calendar/${dateStr}`, { dietType })
    return res.data
  } catch {
    return { dateStr, dietType, updatedAt: new Date().toISOString() }
  }
}

/** Veg / non-veg / vegan percentages for a schedule map. */
export const calculateMonthlyOutlook = (schedules) => {
  const dates = Object.keys(schedules)
  if (!dates.length) return { veg: 0, nonVeg: 0, vegan: 0 }
  const c = { veg: 0, nonVeg: 0, vegan: 0 }
  dates.forEach((k) => {
    const t = schedules[k]?.dietType
    if (t === 'veg') c.veg++
    else if (t === 'non-veg') c.nonVeg++
    else if (t === 'vegan') c.vegan++
  })
  const total = dates.length
  return {
    veg: Math.round((c.veg / total) * 100),
    nonVeg: Math.round((c.nonVeg / total) * 100),
    vegan: Math.round((c.vegan / total) * 100),
  }
}