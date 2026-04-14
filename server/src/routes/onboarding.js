import express from 'express'
import { submitOnboarding } from '../controllers/onboardingController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, submitOnboarding)

export default router
