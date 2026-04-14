import { api } from './api.js'

export const onboardingService = {
  async submitOnboarding(data) {
    const response = await api.post('/onboarding', data)
    return response.data
  },
}