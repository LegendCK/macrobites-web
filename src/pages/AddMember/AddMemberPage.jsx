import { ArrowLeft, Save, UserPlus } from 'lucide-react'
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
    role: '',
    contactInfo: '',
    bio: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.name.trim() || !formData.role.trim() || !formData.contactInfo.trim()) {
      setError('Name, role, and contact info are required.')
      return
    }

    setIsSaving(true)
    try {
      const data = await createTeamMember(formData)
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
                Add Member Page
              </h1>
            </header>

            <form className={styles.form} onSubmit={onSubmit}>
              <Input id="memberName" label="Member Name" value={formData.name} onChange={updateField('name')} />
              <Input id="memberRole" label="Role" value={formData.role} onChange={updateField('role')} />
              <Input id="memberContact" label="Contact Info" value={formData.contactInfo} onChange={updateField('contactInfo')} />
              <Input id="memberBio" label="Bio (Optional)" value={formData.bio} onChange={updateField('bio')} />

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <Button variant="secondary" onClick={() => navigate('/team/members')}>
                  View Members Page
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
