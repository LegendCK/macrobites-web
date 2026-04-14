import mongoose from 'mongoose'

const nutritionistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    credentials: String,
    experience: String,
    specializations: [{ type: String }],
    rating: Number,
    reviews: Number,
    available: [{ type: String }],
    avatar: String,
    bio: String,
  },
  { timestamps: true }
)

export default mongoose.model('Nutritionist', nutritionistSchema)
