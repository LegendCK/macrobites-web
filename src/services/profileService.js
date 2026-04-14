import { api } from './api.js'

export const profileService = {
  async getProfile() {
    const response = await api.get('/profile')
    return response.data.profile
  },

  async updateProfile(updates) {
    const response = await api.put('/profile', updates)
    return response.data.profile
  },

  async getWeeklyMacros() {
    const response = await api.get('/profile/macros')
    return response.data.weekly
  },
}