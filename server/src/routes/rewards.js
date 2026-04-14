import express from 'express'
import { getRewards, getUserPoints, redeemReward } from '../controllers/rewardsController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAuth, getRewards)
router.get('/points', requireAuth, getUserPoints)
router.post('/:id/redeem', requireAuth, redeemReward)

export default router
