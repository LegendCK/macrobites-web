import mongoose from 'mongoose'

const billingCycleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
)

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    features: [{ type: String }],
    billingCycles: [billingCycleSchema],
    highlighted: { type: Boolean, default: false },
    description: String,
  },
  { timestamps: true }
)

export default mongoose.model('Plan', planSchema)
