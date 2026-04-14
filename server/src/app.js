/* global process */
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import profileRoutes from './routes/profile.js'
import mealRoutes from './routes/meals.js'
import calendarRoutes from './routes/calendar.js'
import onboardingRoutes from './routes/onboarding.js'
import rewardsRoutes from './routes/rewards.js'
import planRoutes from './routes/plans.js'
import nutritionistRoutes from './routes/nutritionists.js'

const app = express()

app.disable('etag')

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/meals', mealRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/onboarding', onboardingRoutes)
app.use('/api/rewards', rewardsRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/nutritionists', nutritionistRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

export default app
