import 'dotenv/config'
import mongoose from 'mongoose'
import { mockProfiles } from '../src/data/profiles'
import { DEMO_PASSWORD, mockUsers } from '../src/data/users'
import { CredentialModel, ProfileModel, UserModel } from '../src/models'

const demoEmails = ['krishna@nexalabs.dev', 'admin@yourdomain.com']

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is missing')

  await mongoose.connect(uri)

  const users = mockUsers.filter((user) => demoEmails.includes(user.email))
  for (const user of users) {
    await UserModel.updateOne({ id: user.id }, user, { upsert: true })
    await CredentialModel.updateOne(
      { userId: user.id },
      { userId: user.id, password: DEMO_PASSWORD },
      { upsert: true },
    )
    const profile = mockProfiles.find((item) => item.userId === user.id)
    if (profile) {
      await ProfileModel.updateOne({ id: profile.id }, profile, { upsert: true })
    }
    console.log(`upserted ${user.role}: ${user.email} / ${DEMO_PASSWORD}`)
  }

  await mongoose.disconnect()
}

await main()
