import express from 'express'
import { getNutritionists, getBookedAppointments, bookNutritionist } from '../controllers/nutritionistController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getNutritionists)
router.get('/bookings', requireAuth, getBookedAppointments)
router.post('/:id/book', requireAuth, bookNutritionist)

export default router
