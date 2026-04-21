import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

const TEAM_NAME = 'Team MacroBites'
const MAX_BASE64_IMAGE_LENGTH = 3 * 1024 * 1024

function normalizeBase64Image(base64) {
  if (!base64) {
    return ''
  }

  if (typeof base64 !== 'string') {
    return null
  }

  const trimmed = base64.trim()
  const isValidDataUrl = /^data:image\/(png|jpe?g|webp);base64,/i.test(trimmed)

  if (!isValidDataUrl) {
    return null
  }

  if (trimmed.length > MAX_BASE64_IMAGE_LENGTH) {
    return null
  }

  return trimmed
}

function normalizeMember(member) {
  const hobbies = Array.isArray(member.hobbies) ? member.hobbies : []
  return {
    id: member._id?.toString() || member._id,
    name: member.name,
    rollNumber: member.rollNumber || '',
    year: member.year || '',
    degree: member.degree || '',
    aboutProject: member.aboutProject || '',
    hobbies,
    hobbiesText: hobbies.join(', '),
    certificate: member.certificate || '',
    internship: member.internship || '',
    aboutAim: member.aboutAim || '',
    role: member.role,
    contactInfo: member.contactInfo,
    bio: member.bio,
    profilePictureBase64: member.profilePictureBase64 || '',
    profilePictureUrl: member.profilePictureUrl || '',
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }
}

function parseHobbies(hobbiesText) {
  if (!hobbiesText) {
    return []
  }

  if (Array.isArray(hobbiesText)) {
    return hobbiesText.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof hobbiesText !== 'string') {
    return []
  }

  return hobbiesText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function getTeamMembers(req, res) {
  const members = await TeamMember.find({ isActive: true }).sort({ createdAt: -1 }).lean()
  return res.json({
    teamName: TEAM_NAME,
    members: members.map(normalizeMember),
  })
}

export async function createTeamMember(req, res) {
  const {
    name,
    rollNumber,
    year,
    degree,
    aboutProject,
    hobbies,
    certificate,
    internship,
    aboutAim,
    profilePictureBase64,
  } = req.body

  if (!name?.trim() || !rollNumber?.trim() || !year?.trim() || !degree?.trim()) {
    return res.status(400).json({ error: 'Name, roll number, year, and degree are required' })
  }

  const normalizedBase64Image = normalizeBase64Image(profilePictureBase64)
  if (profilePictureBase64 && !normalizedBase64Image) {
    return res.status(400).json({ error: 'Invalid image format. Please upload PNG, JPG, JPEG, or WEBP.' })
  }

  const profilePictureUrl = req.file?.filename ? `/uploads/team-members/${req.file.filename}` : ''

  const normalizedHobbies = parseHobbies(hobbies)

  const member = await TeamMember.create({
    name: name.trim(),
    rollNumber: rollNumber.trim(),
    year: year.trim(),
    degree: degree.trim(),
    aboutProject: aboutProject?.trim() || '',
    hobbies: normalizedHobbies,
    certificate: certificate?.trim() || '',
    internship: internship?.trim() || '',
    aboutAim: aboutAim?.trim() || '',
    profilePictureBase64: normalizedBase64Image || '',
    profilePictureUrl,
  })

  return res.status(201).json({
    teamName: TEAM_NAME,
    member: normalizeMember(member),
  })
}

export async function getTeamMemberById(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid member id' })
  }

  const member = await TeamMember.findOne({ _id: id, isActive: true }).lean()
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' })
  }

  return res.json({
    teamName: TEAM_NAME,
    member: normalizeMember(member),
  })
}