import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('TeamMember', teamMemberSchema)