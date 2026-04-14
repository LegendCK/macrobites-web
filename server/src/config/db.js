/* global process */
import mongoose from 'mongoose'
import { seedDatabase } from './seeds.js'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required')
  }

  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB Atlas connected')
    await seedDatabase()
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}
