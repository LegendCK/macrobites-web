import { api } from './api.js'

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
const assetBase = apiBase.replace(/\/api\/?$/, '')

export function resolveTeamMemberImageUrl(profilePictureUrl) {
  if (!profilePictureUrl) {
    return ''
  }

  if (/^data:image\//i.test(profilePictureUrl)) {
    return profilePictureUrl
  }

  if (/^https?:\/\//i.test(profilePictureUrl)) {
    return profilePictureUrl
  }

  return `${assetBase}${profilePictureUrl.startsWith('/') ? '' : '/'}${profilePictureUrl}`
}

export function resolveTeamMemberImageSource(member) {
  if (!member) {
    return ''
  }

  if (/^data:image\//i.test(member.profilePictureBase64 || '')) {
    return member.profilePictureBase64
  }

  return resolveTeamMemberImageUrl(member.profilePictureUrl)
}

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