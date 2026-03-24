const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function toNumber(value, fallback) {
  const numeric = Number(value)
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric
  }
  return fallback
}

function calculateMacroTargets(data) {
  const weight = toNumber(data.weight, 70)
  const height = toNumber(data.height, 170)
  const age = toNumber(data.age, 28)

  const bmr = 10 * weight + 6.25 * height - 5 * age + 5
  const activityFactor = data.activityLevel === 'active' ? 1.7 : data.activityLevel === 'moderate' ? 1.5 : 1.3
  const maintenanceCalories = Math.round(bmr * activityFactor)

  const calories =
    data.goal === 'gain_muscle' ? maintenanceCalories + 250 : data.goal === 'lose_fat' ? maintenanceCalories - 300 : maintenanceCalories

  const protein = Math.round(weight * 2)
  const fats = Math.round((calories * 0.25) / 9)
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fats * 9) / 4))

  return { protein, carbs, fats, calories }
}

export const onboardingService = {
  async submitOnboarding(data) {
    await wait(350)

    return {
      success: true,
      onboardingData: data,
      macroTargets: calculateMacroTargets(data),
    }
  },
}