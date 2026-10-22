import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function signSession(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
}

export function verifySession(token) {
  return jwt.verify(token, config.jwt.secret)
}
