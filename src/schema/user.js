import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  email: { type: String, unique: true },
  pseudonym: String,
  created: { type: Date, default: () => new Date() },
  password: String,
  enabled: { type: Boolean, default: 0 }
})

export const User = mongoose.model('user', schema, 'user')
