import { create } from 'zustand';
import { rewardsService } from '../services/rewardsService.js';

export const useRewardsStore = create((set) => ({
  rewards: [],
  userPoints: 0,
  isLoading: false,
  error: '',

  fetchRewards: async () => {
    set({ isLoading: true, error: '' });
    try {
      const rewards = await rewardsService.getRewards();
      const userPoints = await rewardsService.getUserPoints();
      set({ rewards, userPoints, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load rewards' });
    }
  },

  redeemReward: async (rewardId) => {
    set({ isLoading: true, error: '' });
    try {
      const result = await rewardsService.redeemReward(rewardId);
      if (result.success) {
        // Update user points
        set(() => ({
          userPoints: result.newPoints,
          isLoading: false,
        }));
        return result;
      }
    } catch {
      set({ isLoading: false, error: 'Failed to redeem reward' });
      throw new Error('Redemption failed');
    }
  },
}));
