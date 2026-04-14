import { verifyAccessToken } from '../utils/jwt.js'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid authentication token' })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired authentication token' })
  }
}
