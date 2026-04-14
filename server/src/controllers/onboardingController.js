import User from '../models/User.js'

function calculateMacroTargets(data) {
  const weight = Number(data.weight) || 70
  const height = Number(data.height) || 170
  const age = Number(data.age) || 28
  const activityFactor = data.activityLevel === 'active' ? 1.7 : data.activityLevel === 'moderate' ? 1.5 : 1.3
  const maintenanceCalories = Math.round(10 * weight + 6.25 * height - 5 * age + 5) * activityFactor
  const calories = data.goal === 'gain_muscle' ? maintenanceCalories + 250 : data.goal === 'lose_fat' ? maintenanceCalories - 300 : maintenanceCalories
  const protein = Math.round(weight * 2)
  const fats = Math.max(20, Math.round((calories * 0.25) / 9))
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fats * 9) / 4))
  return { protein, carbs, fats, calories }
}

export async function submitOnboarding(req, res) {
  const payload = req.body
  const requiredFields = ['goal', 'activityLevel', 'age', 'weight', 'height', 'gender', 'dietType']

  if (!requiredFields.every((field) => payload[field])) {
    return res.status(400).json({ error: 'All onboarding fields are required' })
  }

  const macroTargets = calculateMacroTargets(payload)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      isOnboarded: true,
      onboardingData: payload,
      macros: { weekly: { protein: { actual: macroTargets.protein * 7, target: macroTargets.protein * 8 }, carbs: { actual: macroTargets.carbs * 7, target: macroTargets.carbs * 8 }, fats: { actual: macroTargets.fats * 7, target: macroTargets.fats * 8 } } },
    },
    { new: true }
  )

  return res.json({ onboardingData: user.onboardingData, macroTargets })
}
