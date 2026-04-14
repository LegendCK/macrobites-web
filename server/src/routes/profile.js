import express from 'express'
import { getProfile, updateProfile, getWeeklyMacros } from '../controllers/profileController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getProfile)
router.put('/', requireAuth, updateProfile)
router.get('/macros', requireAuth, getWeeklyMacros)

export default router
