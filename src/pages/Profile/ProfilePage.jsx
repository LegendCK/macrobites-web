import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Camera,
  Edit,
  Lock,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  User,
  Eye,
  EyeOff,
  Check,
  X,
  Trophy,
} from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { Footer } from '../../components/layout/Footer/Footer'
import { useProfileStore } from '../../store/profileStore'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar'
import { Badge } from '../../components/ui/Badge/Badge'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { profile, weeklyMacros, fetchProfile, fetchWeeklyMacros, updateProfile } = useProfileStore()
  const { logout } = useAuthStore()
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingNotifications, setIsEditingNotifications] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const initialFormData = useMemo(() => ({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    weight: profile?.personalInfo?.weight || '',
    height: profile?.personalInfo?.height || '',
    activityLevel: profile?.personalInfo?.activityLevel || '',
    goal: profile?.personalInfo?.goal || '',
  }), [profile])

  const initialPasswordData = useMemo(() => ({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }), [])

  const [formData, setFormData] = useState(initialFormData)
  const [passwordData, setPasswordData] = useState(initialPasswordData)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    mealReminders: true,
    rewardAlerts: true,
    twoFactorAuth: false,
  })

  useEffect(() => {
    fetchProfile()
    fetchWeeklyMacros()
  }, [fetchProfile, fetchWeeklyMacros])

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  const handleSaveProfile = async () => {
    const updates = {
      fullName: formData.fullName,
      email: formData.email,
      personalInfo: {
        weight: parseInt(formData.weight),
        height: parseInt(formData.height),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
      },
    }
    await updateProfile(updates)
    setIsEditingProfile(false)
  }

  const handleCancelProfile = () => {
    setFormData(initialFormData)
    setIsEditingProfile(false)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }
    // Mock password change
    alert('Password changed successfully')
    setPasswordData(initialPasswordData)
    setIsEditingPassword(false)
  }

  const handleCancelPassword = () => {
    setPasswordData(initialPasswordData)
    setIsEditingPassword(false)
  }

  const handleSaveNotifications = () => {
    alert('Notification settings updated')
    setIsEditingNotifications(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  if (!profile) {
    return <div className={styles.loading}>Loading profile...</div>
  }

  return (
    <div className={styles.page}>
      <Navbar loggedIn={true} />

      <main>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>My Profile</h1>
          </div>

          <div className={styles.content}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* User Info Card */}
          <div className={styles.card}>
            <div className={styles.userInfo}>
              <div className={styles.avatarSection}>
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  className={styles.avatar}
                />
                <Button variant="secondary" size="sm" className={styles.editAvatar} title="Change avatar">
                  <Camera size={16} />
                </Button>
              </div>
              <div className={styles.userDetails}>
                <h2>{profile.fullName}</h2>
                <Badge variant="success">{profile.badge}</Badge>
                <p className={styles.memberSince}>
                  <Calendar size={14} />
                  Member since {new Date(profile.memberSince).toLocaleDateString('en-IN', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={styles.editButton}
              >
                <Edit size={16} />
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className={styles.card}>
            <h3>Personal Information</h3>
            {isEditingProfile ? (
              <div className={styles.form}>
                <div className={styles.formRow}>
                  <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className={styles.formRow}>
                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.selectWrapper}>
                    <label>Activity Level</label>
                    <select
                      value={formData.activityLevel}
                      onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                      className={styles.select}
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                    </select>
                  </div>
                  <div className={styles.selectWrapper}>
                    <label>Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className={styles.select}
                    >
                      <option value="lose_weight">Lose Weight</option>
                      <option value="maintain_weight">Maintain Weight</option>
                      <option value="gain_weight">Gain Weight</option>
                      <option value="build_muscle">Build Muscle</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <Button variant="outline" onClick={handleCancelProfile}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.infoDisplay}>
                <div className={styles.infoRow}>
                  <span>Name:</span>
                  <span>{profile.fullName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Weight:</span>
                  <span>{profile.personalInfo?.weight} kg</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Height:</span>
                  <span>{profile.personalInfo?.height} cm</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Activity Level:</span>
                  <span>{profile.personalInfo?.activityLevel?.replace(/_/g, ' ')}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Goal:</span>
                  <span>{profile.personalInfo?.goal?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Macro Breakdown */}
          <div className={styles.card}>
            <h3>Weekly Macro Breakdown</h3>
            {weeklyMacros && (
              <div className={styles.macros}>
                <div className={styles.macro}>
                  <div className={styles.macroHeader}>
                    <span className={styles.macroLabel}>Protein</span>
                    <span className={styles.macroValue}>
                      {weeklyMacros.protein.actual}g / {weeklyMacros.protein.target}g
                    </span>
                  </div>
                  <ProgressBar
                    value={(weeklyMacros.protein.actual / weeklyMacros.protein.target) * 100}
                    className={styles.macroBar}
                  />
                </div>
                <div className={styles.macro}>
                  <div className={styles.macroHeader}>
                    <span className={styles.macroLabel}>Carbs</span>
                    <span className={styles.macroValue}>
                      {weeklyMacros.carbs.actual}g / {weeklyMacros.carbs.target}g
                    </span>
                  </div>
                  <ProgressBar
                    value={(weeklyMacros.carbs.actual / weeklyMacros.carbs.target) * 100}
                    className={styles.macroBar}
                  />
                </div>
                <div className={styles.macro}>
                  <div className={styles.macroHeader}>
                    <span className={styles.macroLabel}>Fats</span>
                    <span className={styles.macroValue}>
                      {weeklyMacros.fats.actual}g / {weeklyMacros.fats.target}g
                    </span>
                  </div>
                  <ProgressBar
                    value={(weeklyMacros.fats.actual / weeklyMacros.fats.target) * 100}
                    className={styles.macroBar}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Calorie Trend Chart Placeholder */}
          <div className={styles.card}>
            <h3>Calorie Trend (7 Days)</h3>
            <div className={styles.chartPlaceholder}>
              <TrendingUp size={48} />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Consistency Score */}
          <div className={styles.card}>
            <h3>Consistency Score</h3>
            <div className={styles.consistencyScore}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNumber}>{profile.consistencyScore}%</span>
              </div>
              <div className={styles.streakInfo}>
                <Trophy size={20} />
                <span>{profile.streak} day streak!</span>
              </div>
            </div>
          </div>

          {/* Pro Plan Card */}
          <div className={styles.card}>
            <h3>Pro Plan</h3>
            <div className={styles.planInfo}>
              <div className={styles.planHeader}>
                <Badge variant="primary">{profile.subscription.plan}</Badge>
                <span className={styles.planPrice}>₹{profile.subscription.price}/month</span>
              </div>
              <p className={styles.renewal}>
                Renews on {new Date(profile.subscription.renewalDate).toLocaleDateString('en-IN')}
              </p>
              <Button variant="outline" size="sm" className={styles.manageButton}>
                Manage Subscription
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>
                <Lock size={18} />
                Change Password
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
              >
                {isEditingPassword ? <X size={16} /> : <Edit size={16} />}
              </Button>
            </div>
            {isEditingPassword ? (
              <div className={styles.passwordForm}>
                <div className={styles.passwordInput}>
                  <Input
                    label="Current Password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                  <button
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className={styles.passwordInput}>
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                  <button
                    className={styles.togglePassword}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className={styles.passwordInput}>
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                  <button
                    className={styles.togglePassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className={styles.passwordActions}>
                  <Button variant="outline" onClick={handleCancelPassword}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordChange}>
                    Update Password
                  </Button>
                </div>
              </div>
            ) : (
              <p className={styles.passwordNote}>Click edit to change your password</p>
            )}
          </div>

          {/* Notification Settings */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>
                <Settings size={18} />
                Notification Settings
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingNotifications(!isEditingNotifications)}
              >
                {isEditingNotifications ? <X size={16} /> : <Edit size={16} />}
              </Button>
            </div>
            {isEditingNotifications ? (
              <div className={styles.notificationForm}>
                <div className={styles.notificationToggle}>
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked,
                      })}
                    />
                    Email Notifications
                  </label>
                </div>
                <div className={styles.notificationToggle}>
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.mealReminders}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        mealReminders: e.target.checked,
                      })}
                    />
                    Meal Reminders
                  </label>
                </div>
                <div className={styles.notificationToggle}>
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.rewardAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        rewardAlerts: e.target.checked,
                      })}
                    />
                    Reward Alerts
                  </label>
                </div>
                <div className={styles.notificationToggle}>
                  <label>
                    <input
                      type="checkbox"
                      checked={notificationSettings.twoFactorAuth}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        twoFactorAuth: e.target.checked,
                      })}
                    />
                    Two-Factor Authentication
                  </label>
                </div>
                <div className={styles.notificationActions}>
                  <Button variant="outline" onClick={() => setIsEditingNotifications(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveNotifications}>
                    Save Settings
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.notificationDisplay}>
                <div className={styles.notificationItem}>
                  <span>Email Notifications:</span>
                  <span>{notificationSettings.emailNotifications ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className={styles.notificationItem}>
                  <span>Meal Reminders:</span>
                  <span>{notificationSettings.mealReminders ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className={styles.notificationItem}>
                  <span>Reward Alerts:</span>
                  <span>{notificationSettings.rewardAlerts ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className={styles.notificationItem}>
                  <span>Two-Factor Auth:</span>
                  <span>{notificationSettings.twoFactorAuth ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage