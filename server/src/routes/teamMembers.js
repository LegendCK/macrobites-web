import express from 'express'
import { createTeamMember, getTeamMemberById, getTeamMembers } from '../controllers/teamMemberController.js'
import { teamMemberUpload } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', getTeamMembers)
router.post('/', teamMemberUpload.single('profilePicture'), createTeamMember)
router.get('/:id', getTeamMemberById)

export default router