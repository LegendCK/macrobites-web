import mongoose from 'mongoose'

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    pointsCost: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    image: String,
    category: String,
  },
  { timestamps: true }
)

export default mongoose.model('Reward', rewardSchema)
