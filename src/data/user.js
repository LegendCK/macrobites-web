export const MOCK_USER = {
  id: 'usr_aryan_01',
  fullName: 'Aryan Sharma',
  email: 'aryan@macrobites.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  memberSince: '2024-01-15',
  badge: 'Healthy Hero',
  isOnboarded: true,
  plan: 'pro',
  personalInfo: {
    weight: 75, // kg
    height: 175, // cm
    activityLevel: 'moderately_active',
    goal: 'maintain_weight',
  },
  macros: {
    weekly: {
      protein: { actual: 2100, target: 2450 }, // grams
      carbs: { actual: 2800, target: 3000 },
      fats: { actual: 980, target: 1100 },
    },
  },
  consistencyScore: 87,
  streak: 12, // days
  subscription: {
    plan: 'Pro',
    renewalDate: '2024-12-15',
    price: 2999, // INR
  },
}