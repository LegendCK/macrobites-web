import { create } from 'zustand'
import { profileService } from '../services/profileService'

export const useProfileStore = create((set) => ({
  profile: null,
  weeklyMacros: null,
  isLoading: false,
  error: '',

  fetchProfile: async () => {
    set({ isLoading: true, error: '' })
    try {
      const profile = await profileService.getProfile()
      set({ profile, isLoading: false })
      return profile
    } catch {
      set({ isLoading: false, error: 'Failed to load profile' })
      return null
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: '' })
    try {
      const updatedProfile = await profileService.updateProfile(updates)
      set({ profile: updatedProfile, isLoading: false })
      return updatedProfile
    } catch {
      set({ isLoading: false, error: 'Failed to update profile' })
      return null
    }
  },

  fetchWeeklyMacros: async () => {
    set({ isLoading: true, error: '' })
    try {
      const weeklyMacros = await profileService.getWeeklyMacros()
      set({ weeklyMacros, isLoading: false })
      return weeklyMacros
    } catch {
      set({ isLoading: false, error: 'Failed to load macros' })
      return null
    }
  },
}))