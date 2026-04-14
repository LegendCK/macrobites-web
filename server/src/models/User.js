import mongoose from 'mongoose'

const onboardingSchema = new mongoose.Schema(
  {
    goal: String,
    activityLevel: String,
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    dietType: String,
    allergies: [String],
  },
  { _id: false }
)

const macrosSchema = new mongoose.Schema(
  {
    weekly: {
      protein: {
        actual: Number,
        target: Number,
      },
      carbs: {
        actual: Number,
        target: Number,
      },
      fats: {
        actual: Number,
        target: Number,
      },
    },
  },
  { _id: false }
)

const subscriptionSchema = new mongoose.Schema(
  {
    plan: String,
    renewalDate: String,
    price: Number,
  },
  { _id: false }
)

const personalInfoSchema = new mongoose.Schema(
  {
    goal: String,
    activityLevel: String,
    weight: Number,
    height: Number,
  },
  { _id: false }
)

const appointmentSchema = new mongoose.Schema(
  {
    nutritionist: { type: mongoose.Schema.Types.ObjectId, ref: 'Nutritionist' },
    slot: String,
    bookedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: String,
    role: { type: String, enum: ['user', 'admin', 'nutritionist'], default: 'user' },
    isOnboarded: { type: Boolean, default: false },
    onboardingData: onboardingSchema,
    personalInfo: personalInfoSchema,
    macros: macrosSchema,
    plan: { type: String, default: 'basic' },
    subscription: subscriptionSchema,
    points: { type: Number, default: 0 },
    appointments: [appointmentSchema],
  },
  { timestamps: true }
)

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.__v
  return obj
}

export default mongoose.model('User', userSchema)
