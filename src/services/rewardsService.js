import { rewards } from '../data/rewards.js';

// Mock API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const rewardsService = {
  async getRewards() {
    await delay(300);
    return rewards.filter((reward) => reward.isActive);
  },

  async getUserPoints() {
    await delay(200);
    // Mock user points - in real app, this would come from user data
    return 750;
  },

  async redeemReward(rewardId) {
    await delay(500);
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }
    // Mock redemption - in real app, this would call API
    return {
      success: true,
      message: `Successfully redeemed ${reward.title}!`,
      newPoints: 750 - reward.pointsCost, // Mock calculation
    };
  },
};
