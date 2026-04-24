import { ArrowLeft, Save, UserPlus, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { createTeamMember } from '../../services/teamMemberService'
import { useAuthStore } from '../../store/authStore'
import styles from './AddMemberPage.module.css'

export function AddMemberPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    year: '',
    degree: '',
    aboutProject: '',
    hobbies: '',
    certificate: '',
    internship: '',
    aboutAim: '',
    profilePicture: null,
    profilePictureBase64: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Unable to read the image file.'))
      reader.readAsDataURL(file)
    })

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Unable to process the selected image.'))
      image.src = src
    })

  const compressToBase64 = async (file) => {
    const originalDataUrl = await fileToDataUrl(file)
    const image = await loadImage(originalDataUrl)

    const maxDimension = 320
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Image processing is not supported in this browser.')
    }

    context.drawImage(image, 0, 0, width, height)
    return canvas.toDataURL('image/webp', 0.6)
  }

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const updateFile = async (event) => {
    const file = event.target.files[0]
    if (!file) {
      setFormData((prev) => ({ ...prev, profilePicture: null, profilePictureBase64: '' }))
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    try {
      const compressedBase64 = await compressToBase64(file)
      setError('')
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePictureBase64: compressedBase64,
      }))
    } catch (processingError) {
      setError(processingError.message || 'Unable to process selected image.')
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.rollNumber.trim() || !formData.year.trim() || !formData.degree.trim()) {
      setError('Name, roll number, year, and degree are required.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: formData.name,
        rollNumber: formData.rollNumber,
        year: formData.year,
        degree: formData.degree,
        aboutProject: formData.aboutProject,
        hobbies: formData.hobbies,
        certificate: formData.certificate,
        internship: formData.internship,
        aboutAim: formData.aboutAim,
        profilePictureBase64: formData.profilePictureBase64,
      }

      const data = await createTeamMember(payload)
      navigate(`/team/members/${data.member.id}`)
    } catch (requestError) {
      setError(requestError?.response?.data?.error || 'Unable to save member right now.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar loggedIn={isAuthenticated} />
      <main className={styles.main}>
        <PageWrapper className={styles.wrapper}>
          <Button variant="ghost" className={styles.backButton} onClick={() => navigate('/team')}>
            <ArrowLeft size={16} />
            Back to Team
          </Button>

          <section className={styles.card}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>Team Management</p>
              <h1>
                <UserPlus size={22} />
                Add Member
              </h1>
            </header>

            <form className={styles.form} onSubmit={onSubmit}>
              <Input id="memberName" label="Member Name" value={formData.name} onChange={updateField('name')} />
              <Input id="memberRollNumber" label="Roll Number" value={formData.rollNumber} onChange={updateField('rollNumber')} />
              <Input id="memberYear" label="Year" value={formData.year} onChange={updateField('year')} />
              <Input id="memberDegree" label="Degree" value={formData.degree} onChange={updateField('degree')} />

              <div className={styles.textareaWrap}>
                <label htmlFor="memberAboutProject" className={styles.textareaLabel}>
                  About Project
                </label>
                <textarea
                  id="memberAboutProject"
                  className={styles.textarea}
                  value={formData.aboutProject}
                  onChange={updateField('aboutProject')}
                />
              </div>

              <Input
                id="memberHobbies"
                label="Hobbies (comma separated)"
                value={formData.hobbies}
                onChange={updateField('hobbies')}
              />
              <Input id="memberCertificate" label="Certificate" value={formData.certificate} onChange={updateField('certificate')} />
              <Input id="memberInternship" label="Internship" value={formData.internship} onChange={updateField('internship')} />

              <div className={styles.textareaWrap}>
                <label htmlFor="memberAboutAim" className={styles.textareaLabel}>
                  About Your Aim
                </label>
                <textarea
                  id="memberAboutAim"
                  className={styles.textarea}
                  value={formData.aboutAim}
                  onChange={updateField('aboutAim')}
                />
              </div>

              {/* Profile picture upload with preview */}
              <div className={styles.fileUpload}>
                <label htmlFor="memberProfilePicture" className={styles.fileLabel}>
                  <ImageIcon size={16} /> Profile Picture
                </label>
                <input
                  id="memberProfilePicture"
                  type="file"
                  accept="image/*"
                  onChange={updateFile}
                />
                {formData.profilePicture ? <p className={styles.fileHint}>{formData.profilePicture.name}</p> : null}
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => navigate('/team/members')}>
                  View Members
                </Button>
                <Button type="submit" loading={isSaving}>
                  <Save size={16} />
                  Save Member
                </Button>
              </div>
            </form>
          </section>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}
