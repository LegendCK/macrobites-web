import Reward from '../models/Reward.js'

export async function getRewards(req, res) {
  const rewards = await Reward.find({ isActive: true }).lean()
  return res.json(rewards)
}

export async function getUserPoints(req, res) {
  return res.json({ points: req.user.points || 0 })
}

export async function redeemReward(req, res) {
  const { id } = req.params
  const reward = await Reward.findById(id)

  if (!reward || !reward.isActive) {
    return res.status(404).json({ error: 'Reward not found' })
  }

  if (req.user.points < reward.pointsCost) {
    return res.status(400).json({ error: 'Not enough points to redeem this reward' })
  }

  req.user.points -= reward.pointsCost
  await req.user.save()

  return res.json({ success: true, message: `Successfully redeemed ${reward.title}!`, newPoints: req.user.points })
}
