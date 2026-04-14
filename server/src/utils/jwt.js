/* global process */
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretdevkey'
const JWT_EXPIRES_IN = '7d'

export function createAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET)
}
