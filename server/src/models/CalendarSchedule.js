import mongoose from 'mongoose'

const calendarScheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    dietType: { type: String, enum: ['veg', 'non-veg', 'vegan'], required: true },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
)

calendarScheduleSchema.index({ user: 1, date: 1 }, { unique: true })

export default mongoose.model('CalendarSchedule', calendarScheduleSchema)
