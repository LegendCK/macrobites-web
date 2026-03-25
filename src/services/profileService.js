import { MOCK_USER } from '../data/user'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const profileService = {
  async getProfile() {
    await wait(300)
    return MOCK_USER
  },

  async updateProfile(updates) {
    await wait(500)
    // In a real app, this would update the backend
    return {
      ...MOCK_USER,
      ...updates,
    }
  },

  async getWeeklyMacros() {
    await wait(200)
    return MOCK_USER.macros.weekly
  },
}