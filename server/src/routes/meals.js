import express from 'express'
import { getMeals } from '../controllers/mealController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getMeals)

export default router
