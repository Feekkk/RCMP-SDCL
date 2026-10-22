import express from 'express'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.js'
import { studentsRouter } from './routes/students.js'
import { adminRouter } from './routes/admin.js'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cookieParser())

  app.get('/api/health', (req, res) => res.json({ ok: true }))

  app.use('/api/auth', authRouter)
  app.use('/api/students', studentsRouter)
  app.use('/api/admin', adminRouter)

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
