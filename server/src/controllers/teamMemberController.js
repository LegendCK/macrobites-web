import mongoose from 'mongoose'
import TeamMember from '../models/TeamMember.js'

const TEAM_NAME = 'MacroBites Product Team'

function normalizeMember(member) {
  return {
    id: member._id?.toString() || member._id,
    name: member.name,
    role: member.role,
    contactInfo: member.contactInfo,
    bio: member.bio,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  }
}

export async function getTeamMembers(req, res) {
  const members = await TeamMember.find({ isActive: true }).sort({ createdAt: -1 }).lean()
  return res.json({
    teamName: TEAM_NAME,
    members: members.map(normalizeMember),
  })
}

export async function createTeamMember(req, res) {
  const { name, role, contactInfo, bio } = req.body

  if (!name?.trim() || !role?.trim() || !contactInfo?.trim()) {
    return res.status(400).json({ error: 'Name, role, and contact info are required' })
  }

  const member = await TeamMember.create({
    name: name.trim(),
    role: role.trim(),
    contactInfo: contactInfo.trim(),
    bio: bio?.trim() || '',
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