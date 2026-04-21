import express from 'express'
import { createTeamMember, getTeamMemberById, getTeamMembers } from '../controllers/teamMemberController.js'

const router = express.Router()

router.get('/', getTeamMembers)
router.post('/', createTeamMember)
router.get('/:id', getTeamMemberById)

export default router