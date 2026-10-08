import cors from 'cors'
import express from 'express'
import { HttpError } from './http'
import { optionalAuth } from './auth'
import { analyticsRouter, catalogRouter, customersRouter, supportRouter } from './routes/rest'
import { authRouter } from './routes/auth'
import { nfcRouter } from './routes/nfc'
import { ordersRouter } from './routes/orders'
import { profilesRouter } from './routes/profiles'

const PORT = Number(process.env.PORT ?? 4000)
const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())

const app = express()
app.use(cors({ origin: origins, credentials: true }))
app.use(express.json({ limit: '6mb' }))
app.use(optionalAuth)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'nfc-be', mock: true })
})

app.use('/api/auth', authRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/nfc-cards', nfcRouter)
app.use('/api/customers', customersRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/support', supportRouter)
app.use('/api/catalog', catalogRouter)

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, code: error.code })
    return
  }
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`NFC-BE listening on http://localhost:${PORT}`)
})
