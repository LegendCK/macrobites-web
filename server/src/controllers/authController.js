/* global process */
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { createAccessToken } from '../utils/jwt.js'

const COOKIE_NAME = 'accessToken'
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function sendToken(res, user) {
  const token = createAccessToken({ userId: user._id })
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS)
  return res.json({ user: user.toSafeObject() })
}

export async function register(req, res) {
  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    fullName,
    email: email.toLowerCase().trim(),
    passwordHash,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    points: 250,
    subscription: {
      plan: 'Basic',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      price: 699,
    },
  })
  return sendToken(res, user)
}

export async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  return sendToken(res, user)
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { sameSite: 'none', secure: process.env.NODE_ENV === 'production' })
  return res.json({ success: true })
}

export async function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  return res.json({ user: req.user.toSafeObject() })
}
