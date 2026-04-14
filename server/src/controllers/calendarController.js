import CalendarSchedule from '../models/CalendarSchedule.js'

const DIET_TYPES = ['veg', 'non-veg', 'vegan']

function isDateLocked(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`)
  const now = new Date()
  const diffMs = date - now
  return diffMs < 24 * 60 * 60 * 1000
}

async function ensureScheduleForDate(userId, dateString) {
  let schedule = await CalendarSchedule.findOne({ user: userId, date: dateString })
  if (!schedule) {
    const day = Number(dateString.slice(-2))
    schedule = await CalendarSchedule.create({
      user: userId,
      date: dateString,
      dietType: DIET_TYPES[(day - 1) % DIET_TYPES.length],
      isLocked: isDateLocked(dateString),
    })
  }
  return schedule
}

export async function getCalendarSchedules(req, res) {
  const { year, month } = req.query
  const queryYear = Number(year) || new Date().getFullYear()
  const queryMonth = Number(month) || new Date().getMonth() + 1
  const daysInMonth = new Date(queryYear, queryMonth, 0).getDate()
  const start = `${queryYear}-${String(queryMonth).padStart(2, '0')}-01`
  const end = `${queryYear}-${String(queryMonth).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  const schedules = await CalendarSchedule.find({
    user: req.user._id,
    date: { $gte: start, $lte: end },
  }).lean()

  const scheduleMap = schedules.reduce((acc, item) => {
    acc[item.date] = item
    return acc
  }, {})

  const results = {}
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${queryYear}-${String(queryMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (scheduleMap[date]) {
      results[date] = scheduleMap[date]
    } else {
      const newSchedule = await ensureScheduleForDate(req.user._id, date)
      results[date] = newSchedule
    }
  }

  return res.json(results)
}

export async function getScheduleForDate(req, res) {
  const { date } = req.params
  const schedule = await ensureScheduleForDate(req.user._id, date)
  return res.json({
    date: schedule.date,
    dietType: schedule.dietType,
    isLocked: isDateLocked(schedule.date),
  })
}

export async function updateSchedule(req, res) {
  const { date } = req.params
  const { dietType } = req.body
  if (!dietType || !DIET_TYPES.includes(dietType)) {
    return res.status(400).json({ error: 'Valid dietType is required' })
  }

  if (isDateLocked(date)) {
    return res.status(403).json({ error: 'Changes must be made 24 hours before delivery' })
  }

  const schedule = await CalendarSchedule.findOneAndUpdate(
    { user: req.user._id, date },
    { dietType, isLocked: false },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  return res.json({ date: schedule.date, dietType: schedule.dietType, isLocked: schedule.isLocked })
}
