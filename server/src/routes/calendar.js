import express from 'express'
import { getCalendarSchedules, getScheduleForDate, updateSchedule } from '../controllers/calendarController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getCalendarSchedules)
router.get('/:date', requireAuth, getScheduleForDate)
router.patch('/:date', requireAuth, updateSchedule)

export default router
