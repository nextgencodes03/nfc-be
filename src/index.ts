import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { HttpError } from './http'
import { optionalAuth } from './auth'
import { connectDb, usingMongo } from './db'
import { analyticsRouter, catalogRouter, customersRouter, supportRouter } from './routes/rest'
import { authRouter } from './routes/auth'
import { nfcRouter } from './routes/nfc'
import { ordersRouter } from './routes/orders'
import { profilesRouter } from './routes/profiles'

const PORT = Number(process.env.PORT ?? 4000)

const app = express()
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json({ limit: '6mb' }))
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
app.use(optionalAuth)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'nfc-be', mongo: usingMongo, mock: !usingMongo })
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

await connectDb()

app.listen(PORT, '127.0.0.1', () => {
  console.log(`NFC-BE listening on http://127.0.0.1:${PORT}`)
})
