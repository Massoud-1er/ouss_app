import mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId

const schema = new mongoose.Schema({
  publisher_id: { type: ObjectId, ref: 'user' },
  name: String,
  ingredients: [String],
  created: { type: Date, default: () => new Date() },
  certified: { type: Boolean, default: 0 },
  data: {
    '1-2': { steps: [String], doses: [String], duration: Number },
    '4-6': { steps: [String], doses: [String], duration: Number },
    '6-8': { steps: [String], doses: [String], duration: Number },
    '+8': { steps: [String], doses: [String], duration: Number }
  }
})

export const Recipe = mongoose.model('recipe', schema, 'recipe')
