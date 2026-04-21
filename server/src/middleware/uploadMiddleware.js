/* global process */
import fs from 'fs'
import path from 'path'
import multer from 'multer'

const uploadsDir = path.resolve(process.cwd(), 'uploads', 'team-members')

function ensureUploadDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir()
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg'
    const safeBase = (path.basename(file.originalname || 'member', ext) || 'member')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 40)
    cb(null, `${Date.now()}-${safeBase}${ext}`)
  },
})

function imageFileFilter(req, file, cb) {
  if (!file.mimetype?.startsWith('image/')) {
    cb(new Error('Only image uploads are allowed'))
    return
  }
  cb(null, true)
}

export const teamMemberUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})
