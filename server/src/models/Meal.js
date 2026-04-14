import mongoose from 'mongoose'

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['veg', 'non-veg', 'vegan'], required: true },
    tags: [{ type: String }],
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number,
      calories: Number,
    },
    imageGradient: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Meal', mealSchema)
