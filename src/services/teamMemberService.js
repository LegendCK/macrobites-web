import { api } from './api.js'

export async function getTeamMembers() {
  const response = await api.get('/team-members')
  return response.data
}

export async function createTeamMember(payload) {
  const response = await api.post('/team-members', payload)
  return response.data
}

export async function getTeamMemberById(memberId) {
  const response = await api.get(`/team-members/${memberId}`)
  return response.data
}