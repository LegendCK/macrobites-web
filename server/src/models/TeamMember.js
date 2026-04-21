import mongoose from 'mongoose'

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true },
    year: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    aboutProject: { type: String, trim: true },
    hobbies: [{ type: String, trim: true }],
    certificate: { type: String, trim: true },
    internship: { type: String, trim: true },
    aboutAim: { type: String, trim: true },
    role: { type: String, trim: true },
    contactInfo: { type: String, trim: true },
    bio: { type: String, trim: true },
    profilePictureBase64: { type: String, trim: true },
    profilePictureUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('TeamMember', teamMemberSchema)