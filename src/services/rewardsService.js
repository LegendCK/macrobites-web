import { api } from './api.js'

export const rewardsService = {
  async getRewards() {
    const response = await api.get('/rewards')
    return response.data
  },

  async getUserPoints() {
    const response = await api.get('/rewards/points')
    return response.data.points
  },

  async redeemReward(rewardId) {
    const response = await api.post(`/rewards/${rewardId}/redeem`)
    return response.data
  },
}
