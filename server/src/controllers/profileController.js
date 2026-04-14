export async function getProfile(req, res) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const profile = req.user.toSafeObject()
  if (!profile.personalInfo && profile.onboardingData) {
    profile.personalInfo = {
      weight: profile.onboardingData.weight,
      height: profile.onboardingData.height,
      activityLevel: profile.onboardingData.activityLevel,
      goal: profile.onboardingData.goal,
    }
  }

  profile.memberSince = req.user.createdAt
  return res.json({ profile })
}

export async function updateProfile(req, res) {
  const updates = req.body
  const allowedFields = ['fullName', 'avatar', 'plan', 'personalInfo', 'subscription']
  const payload = {}

  Object.keys(updates).forEach((key) => {
    if (allowedFields.includes(key)) {
      payload[key] = updates[key]
    }
  })

  const user = await req.user.set(payload).save()
  return res.json({ profile: user.toSafeObject() })
}

export async function getWeeklyMacros(req, res) {
  const macros = req.user.macros?.weekly
  if (!macros) {
    return res.json({ weekly: null })
  }
  return res.json({ weekly: macros })
}
