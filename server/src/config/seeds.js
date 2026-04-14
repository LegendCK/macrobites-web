import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Meal from '../models/Meal.js'
import Plan from '../models/Plan.js'
import Nutritionist from '../models/Nutritionist.js'
import Reward from '../models/Reward.js'
import CalendarSchedule from '../models/CalendarSchedule.js'

const defaultMeals = [
  {
    name: 'Paneer Power Bowl',
    type: 'veg',
    tags: ['GF', 'HIGH-PROTEIN'],
    macros: { protein: 34, carbs: 38, fats: 16, calories: 468 },
    imageGradient: 'linear-gradient(135deg, #fef3c7, #f59e0b 70%)',
  },
  {
    name: 'Lemon Herb Chicken',
    type: 'non-veg',
    tags: ['LEAN', 'DAIRY-FREE'],
    macros: { protein: 42, carbs: 22, fats: 12, calories: 372 },
    imageGradient: 'linear-gradient(135deg, #fef3c7, #f97316 70%)',
  },
  {
    name: 'Tofu Quinoa Stir Fry',
    type: 'vegan',
    tags: ['VEGAN', 'FIBER-RICH'],
    macros: { protein: 31, carbs: 41, fats: 14, calories: 438 },
    imageGradient: 'linear-gradient(135deg, #dcfce7, #22c55e 70%)',
  },
  {
    name: 'Masala Egg Wrap',
    type: 'veg',
    tags: ['QUICK', 'BALANCED'],
    macros: { protein: 28, carbs: 33, fats: 11, calories: 351 },
    imageGradient: 'linear-gradient(135deg, #fde68a, #f59e0b 70%)',
  },
  {
    name: 'Smoked Fish Millet Plate',
    type: 'non-veg',
    tags: ['OMEGA-3', 'GF'],
    macros: { protein: 39, carbs: 27, fats: 13, calories: 404 },
    imageGradient: 'linear-gradient(135deg, #dbeafe, #2563eb 70%)',
  },
  {
    name: 'Chickpea Avocado Chaat',
    type: 'vegan',
    tags: ['HEART-HEALTHY', 'VEGAN'],
    macros: { protein: 24, carbs: 36, fats: 15, calories: 386 },
    imageGradient: 'linear-gradient(135deg, #dcfce7, #16a34a 70%)',
  },
  {
    name: 'Rajma Brown Rice Box',
    type: 'veg',
    tags: ['CLASSIC', 'HIGH-FIBER'],
    macros: { protein: 26, carbs: 49, fats: 9, calories: 398 },
    imageGradient: 'linear-gradient(135deg, #fee2e2, #b91c1c 70%)',
  },
  {
    name: 'Chicken Keema Lettuce Cups',
    type: 'non-veg',
    tags: ['LOW-CARB', 'HIGH-PROTEIN'],
    macros: { protein: 45, carbs: 13, fats: 14, calories: 365 },
    imageGradient: 'linear-gradient(135deg, #e5e7eb, #4b5563 70%)',
  },
]

const defaultPlans = [
  {
    name: 'Basic',
    slug: 'basic',
    description: 'Essential macros and meal planning support',
    highlighted: false,
    billingCycles: [
      { id: 'kickstarter', price: 140, discount: 0 },
      { id: 'weekly', price: 980, discount: 0 },
      { id: 'monthly', price: 4200, discount: 0 },
      { id: 'halfYearly', price: 25200, discount: 10 },
      { id: 'yearly', price: 50400, discount: 25 },
    ],
    features: ['Standard meals', 'Basic tracking', 'Weekly updates'],
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Advanced tracking with expert meal recommendations',
    highlighted: true,
    billingCycles: [
      { id: 'kickstarter', price: 300, discount: 0 },
      { id: 'weekly', price: 2100, discount: 0 },
      { id: 'monthly', price: 9000, discount: 0 },
      { id: 'halfYearly', price: 54000, discount: 10 },
      { id: 'yearly', price: 108000, discount: 20 },
    ],
    features: ['Customizable macros', 'Priority delivery', 'Nutrient analysis'],
  },
  {
    name: 'Elite',
    slug: 'elite',
    description: 'Premium plan with nutritionist support and gourmet meals',
    highlighted: false,
    billingCycles: [
      { id: 'kickstarter', price: 800, discount: 0 },
      { id: 'weekly', price: 5600, discount: 0 },
      { id: 'monthly', price: 24000, discount: 0 },
      { id: 'halfYearly', price: 144000, discount: 10 },
      { id: 'yearly', price: 288000, discount: 25 },
    ],
    features: ['Chef gourmet meals', '1-on-1 nutritionist', 'Bespoke tracking'],
  },
]

const defaultNutritionists = [
  {
    name: 'Dr. Neha Kapoor',
    credentials: 'MSc Nutrition, RDN',
    experience: '7 years',
    specializations: ['Weight Loss', 'Sports Nutrition', 'Gut Health'],
    rating: 4.9,
    reviews: 520,
    available: ['Mon 10:00 AM', 'Wed 4:00 PM', 'Fri 11:30 AM'],
    avatar: 'NK',
    bio: 'Certified nutritionist specializing in performance and wellness.',
  },
  {
    name: 'Rajiv Mehta',
    credentials: 'MSc Dietetics',
    experience: '5 years',
    specializations: ['Diabetes Care', 'Heart Health', 'Meal Planning'],
    rating: 4.8,
    reviews: 410,
    available: ['Tue 2:00 PM', 'Thu 5:00 PM', 'Sat 10:30 AM'],
    avatar: 'RM',
    bio: 'Expert in sustainable meal plans and long-term behavior change.',
  },
]

const defaultRewards = [
  {
    title: 'Free Nutritionist Session',
    description: 'One-on-one consultation with a certified nutritionist. 30 minutes.',
    pointsCost: 600,
    isActive: true,
    image: 'linear-gradient(135deg, #fce7f3, #db2777 70%)',
    category: 'Premium',
  },
  {
    title: 'Protein Snack Pack',
    description: 'High-protein snack bundle for muscle recovery.',
    pointsCost: 350,
    isActive: true,
    image: 'linear-gradient(135deg, #dbeafe, #2563eb 70%)',
    category: 'Nutrition',
  },
]

const defaultUser = {
  fullName: 'Aryan Sharma',
  email: 'aryan@macrobites.com',
  password: 'Password123!',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  isOnboarded: true,
  plan: 'pro',
  points: 750,
  subscription: {
    plan: 'Pro',
    renewalDate: '2024-12-15',
    price: 2999,
  },
  macros: {
    weekly: {
      protein: { actual: 2100, target: 2450 },
      carbs: { actual: 2800, target: 3000 },
      fats: { actual: 980, target: 1100 },
    },
  },
}

export async function seedDatabase() {
  const mealCount = await Meal.countDocuments()
  const planCount = await Plan.countDocuments()
  const nutritionistCount = await Nutritionist.countDocuments()
  const rewardCount = await Reward.countDocuments()
  const userCount = await User.countDocuments()

  if (mealCount === 0) {
    await Meal.insertMany(defaultMeals)
    console.log('Seeded meals')
  }

  if (planCount === 0) {
    await Plan.insertMany(defaultPlans)
    console.log('Seeded plans')
  } else {
    for (const planData of defaultPlans) {
      await Plan.updateOne({ slug: planData.slug }, { $set: { billingCycles: planData.billingCycles } })
    }
    console.log('Updated existing plan billing cycles')
  }

  if (nutritionistCount === 0) {
    await Nutritionist.insertMany(defaultNutritionists)
    console.log('Seeded nutritionists')
  }

  if (rewardCount === 0) {
    await Reward.insertMany(defaultRewards)
    console.log('Seeded rewards')
  }

  if (userCount === 0) {
    const passwordHash = await bcrypt.hash(defaultUser.password, 10)
    await User.create({
      fullName: defaultUser.fullName,
      email: defaultUser.email,
      passwordHash,
      avatar: defaultUser.avatar,
      isOnboarded: defaultUser.isOnboarded,
      plan: defaultUser.plan,
      points: defaultUser.points,
      subscription: defaultUser.subscription,
      macros: defaultUser.macros,
      personalInfo: {
        weight: 75,
        height: 175,
        activityLevel: 'moderately_active',
        goal: 'maintain_weight',
      },
    })
    console.log('Seeded default user')
  } else {
    const existingUser = await User.findOne({ email: defaultUser.email })
    if (existingUser && !existingUser.personalInfo) {
      existingUser.personalInfo = {
        weight: 75,
        height: 175,
        activityLevel: 'moderately_active',
        goal: 'maintain_weight',
      }
      await existingUser.save()
      console.log('Updated existing user personal info')
    }
  }

  const calendarCount = await CalendarSchedule.countDocuments()
  if (calendarCount === 0) {
    const user = await User.findOne({ email: defaultUser.email })
    if (user) {
      const schedule = []
      const today = new Date()
      for (let offset = 0; offset < 30; offset += 1) {
        const date = new Date(today)
        date.setDate(today.getDate() + offset)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateKey = `${year}-${month}-${day}`
        const dietTypes = ['veg', 'non-veg', 'vegan']
        schedule.push({
          user: user._id,
          date: dateKey,
          dietType: dietTypes[offset % dietTypes.length],
          isLocked: offset < 1,
        })
      }
      await CalendarSchedule.insertMany(schedule)
      console.log('Seeded calendar schedules')
    }
  }
}
