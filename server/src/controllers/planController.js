import Plan from '../models/Plan.js'

export async function getPlans(req, res) {
  const plans = await Plan.find().lean()
  return res.json(plans)
}
