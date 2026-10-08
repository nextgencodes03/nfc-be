import type { Response } from 'express'

export class HttpError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status = 400, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

export function sendError(res: Response, error: unknown): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message, code: error.code })
    return
  }
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
}
