import { generateMonthlySchedule } from '../data/calendarData';

// Mock delay to simulate API call
const wait = (ms = 280) => new Promise((r) => setTimeout(r, ms));

const scheduleCache = {};

// Helper to check if date is locked (less than 24h before delivery)
const isDateLocked = (date) => {
  const now = new Date();
  const timeDiff = date - now;
  const hoursUntilDelivery = timeDiff / (1000 * 60 * 60);
  return hoursUntilDelivery < 24;
};

// Helper to format date as YYYY-MM-DD
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonthCacheKey = (year, month) => `${year}-${String(month).padStart(2, '0')}`;

const ensureMonthSchedule = (year, month) => {
  const monthKey = getMonthCacheKey(year, month);
  if (!scheduleCache[monthKey]) {
    scheduleCache[monthKey] = generateMonthlySchedule(year, month);
  }
  return scheduleCache[monthKey];
};

// Get all schedules for a month
export const getCalendarSchedules = async (_userId, year, month) => {
  await wait();
  return ensureMonthSchedule(year, month);
};

// Get schedule for a specific date
export const getScheduleForDate = async (dateStr) => {
  await wait();
  const date = new Date(dateStr);
  const schedule = ensureMonthSchedule(date.getFullYear(), date.getMonth() + 1)[dateStr] || {
    dietType: 'veg',
    isLocked: false,
  };
  const isLocked = isDateLocked(date);
  return {
    ...schedule,
    isLocked,
  };
};

// Get schedule instantly from cache/generated data for UI rendering
export const getScheduleForDateSync = (dateStr) => {
  const date = new Date(dateStr);
  return ensureMonthSchedule(date.getFullYear(), date.getMonth() + 1)[dateStr] || {
    dietType: 'veg',
    isLocked: false,
  };
};

// Update schedule for a date
export const updateSchedule = async (dateStr, dietType) => {
  await wait();
  // In real API, this would PATCH /api/calendar/:scheduleId
  const date = new Date(dateStr);
  const isLocked = isDateLocked(date);
  
  if (isLocked) {
    throw new Error('Changes must be made 24 hours in advance of the scheduled delivery date.');
  }

  // Mock update
  const monthSchedule = ensureMonthSchedule(date.getFullYear(), date.getMonth() + 1);
  monthSchedule[dateStr] = {
    dietType,
    isLocked: false,
  };

  return {
    dateStr,
    dietType,
    isLocked: false,
  };
};

// Calculate monthly outlook (percentage breakdown)
export const calculateMonthlyOutlook = (schedules) => {
  const dates = Object.keys(schedules);
  const counts = {
    veg: 0,
    nonVeg: 0,
    vegan: 0,
  };

  dates.forEach((dateStr) => {
    const dietType = schedules[dateStr].dietType;
    if (dietType === 'veg') counts.veg += 1;
    else if (dietType === 'non-veg') counts.nonVeg += 1;
    else if (dietType === 'vegan') counts.vegan += 1;
  });

  const total = dates.length;
  return {
    veg: Math.round((counts.veg / total) * 100),
    nonVeg: Math.round((counts.nonVeg / total) * 100),
    vegan: Math.round((counts.vegan / total) * 100),
  };
};

export { formatDateKey, isDateLocked };
