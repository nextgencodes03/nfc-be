import 'dotenv/config'
import mongoose from 'mongoose'
import { profileUrl } from '../src/config/site'
import { CardModel, OrderModel } from '../src/models'

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is missing')
  await mongoose.connect(uri)

  const cards = await CardModel.find({ profileUrl: { $exists: true, $ne: '' } }).lean()
  for (const card of cards) {
    const match = String(card.profileUrl).match(/\/p\/([^/?#]+)/)
    if (!match) continue
    const next = profileUrl(match[1])
    await CardModel.updateOne({ id: card.id }, { $set: { profileUrl: next } })
    console.log(`card ${card.cardId}: ${next}`)
  }

  const orders = await OrderModel.find({ profileUrl: { $regex: 'yourdomain' } }).lean()
  for (const order of orders) {
    const match = String(order.profileUrl).match(/\/p\/([^/?#]+)/)
    if (!match) continue
    const next = `/p/${match[1]}`
    await OrderModel.updateOne({ id: order.id }, { $set: { profileUrl: next } })
  }

  await mongoose.disconnect()
}

await main()
