import {
  Activity,
  CalendarClock,
  ChevronRight,
  Ruler,
  Scale,
  Target,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GoalCard } from '../../components/shared/GoalCard/GoalCard'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar'
import { ALLERGY_OPTIONS, DIET_OPTIONS, GENDER_OPTIONS, GOAL_OPTIONS, ACTIVITY_OPTIONS } from '../../data/onboarding'
import { useOnboardingStore } from '../../store/onboardingStore'
import styles from './OnboardingPage.module.css'

const STEP_META = {
  1: {
    eyebrow: 'Goal Setup',
    title: 'What is your primary goal?',
    subtitle: "We'll tailor your macro targets and meal recommendations based on your choice.",
  },
  2: {
    eyebrow: 'Activity Level',
    title: 'How active are you?',
    subtitle: 'This helps us calculate your daily caloric needs.',
  },
  3: {
    eyebrow: 'Personal Info',
    title: 'Tell us about yourself',
    subtitle: 'This helps us calculate your daily macro needs and calorie intake goals.',
  },
  4: {
    eyebrow: 'Diet & Allergies',
    title: 'Tell us about your diet.',
    subtitle: 'MacroBites uses this information to personalize your meal plans.',
  },
  5: {
    eyebrow: 'Onboarding Complete',
    title: 'Your personalized plan is ready!',
    subtitle: "We've tailored every meal to help you reach your peak performance.",
  },
}

function validateStep(step, data) {
  if (step === 1 && !data.goal) {
    return 'Please select your primary goal.'
  }

  if (step === 2 && !data.activityLevel) {
    return 'Please select your activity level.'
  }

  if (step === 3) {
    if (!data.age || Number(data.age) < 12) {
      return 'Please enter a valid age.'
    }
    if (!data.weight || Number(data.weight) < 30) {
      return 'Please enter a valid weight.'
    }
    if (!data.height || Number(data.height) < 120) {
      return 'Please enter a valid height.'
    }
    if (!data.gender) {
      return 'Please select your gender.'
    }
  }

  if (step === 4 && !data.dietType) {
    return 'Please choose a dietary lifestyle.'
  }

  return ''
}

function ActivityStep({ data, setField }) {
  return (
    <div className={[styles.activityList, 'stagger'].join(' ')}>
      {ACTIVITY_OPTIONS.map((option) => {
        const Icon = option.icon
        const selected = data.activityLevel === option.value
        return (
          <button
            key={option.value}
            type="button"
            className={[styles.activityItem, selected ? styles.selectedActivity : ''].filter(Boolean).join(' ')}
            onClick={() => setField('activityLevel', option.value)}
          >
            <span className={styles.activityIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.activityText}>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
            <span className={[styles.radioDot, selected ? styles.radioDotActive : ''].filter(Boolean).join(' ')} />
          </button>
        )
      })}
    </div>
  )
}

function PersonalInfoStep({ data, setField }) {
  return (
    <div className={styles.personalForm}>
      <Input
        id="age"
        label="Age"
        icon={<CalendarClock size={16} />}
        placeholder="e.g. 25"
        value={data.age}
        onChange={(event) => setField('age', event.target.value)}
      />

      <div className={styles.twoCol}>
        <Input
          id="weight"
          label="Weight (kg)"
          icon={<Scale size={16} />}
          placeholder="e.g. 70"
          value={data.weight}
          onChange={(event) => setField('weight', event.target.value)}
        />
        <Input
          id="height"
          label="Height (cm)"
          icon={<Ruler size={16} />}
          placeholder="e.g. 175"
          value={data.height}
          onChange={(event) => setField('height', event.target.value)}
        />
      </div>

      <label className={styles.selectLabel} htmlFor="gender">
        Gender
      </label>
      <select
        id="gender"
        className={styles.select}
        value={data.gender}
        onChange={(event) => setField('gender', event.target.value)}
      >
        <option value="">Select gender</option>
        {GENDER_OPTIONS.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>
    </div>
  )
}

function DietStep({ data, setField, toggleAllergy }) {
  return (
    <div className={styles.dietStep}>
      <div className={styles.dietOptions}>
        {DIET_OPTIONS.map((option) => {
          const Icon = option.icon
          const selected = data.dietType === option.value

          return (
            <button
              key={option.value}
              type="button"
              className={[styles.dietCard, selected ? styles.selectedDiet : ''].filter(Boolean).join(' ')}
              onClick={() => setField('dietType', option.value)}
            >
              <span className={styles.dietIcon}>
                <Icon size={18} />
              </span>
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </button>
          )
        })}
      </div>

      <div className={styles.allergySection}>
        <h3>Food Allergies</h3>
        <p>Any allergies or intolerances? Select all that apply.</p>
        <div className={styles.allergyWrap}>
          {ALLERGY_OPTIONS.map((allergy) => {
            const selected = data.allergies.includes(allergy)
            return (
              <button
                key={allergy}
                type="button"
                className={[styles.allergyChip, selected ? styles.allergyChipActive : ''].filter(Boolean).join(' ')}
                onClick={() => toggleAllergy(allergy)}
              >
                {allergy}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CompletionStep({ data, onSubmit, isSubmitting }) {
  const goalLabel =
    data.goal === 'gain_muscle' ? 'Build Muscle' : data.goal === 'lose_fat' ? 'Lose Fat' : 'Stay Fit'
  const dietLabel = data.dietType === 'non_veg' ? 'Non-Veg' : data.dietType === 'vegan' ? 'Vegan' : 'Veg'

  return (
    <section className={[styles.completionCard, 'scaleIn'].join(' ')}>
      <div className={styles.completionHero}>
        <h3>Your personalized plan is ready!</h3>
      </div>
      <div className={styles.completionBody}>
        <p>
          We&apos;ve tailored every meal to help you reach your peak performance. Here&apos;s what we&apos;ve built for you.
        </p>
        <div className={styles.summaryGrid}>
          <article>
            <Target size={18} />
            <span>Goal</span>
            <strong>{goalLabel}</strong>
          </article>
          <article>
            <UtensilsCrossed size={18} />
            <span>Diet Type</span>
            <strong>{dietLabel}</strong>
          </article>
          <article>
            <Activity size={18} />
            <span>Timeline</span>
            <strong>12 Weeks</strong>
          </article>
        </div>

        <Button size="lg" onClick={onSubmit} loading={isSubmitting}>
          View Dashboard
          {!isSubmitting ? <ChevronRight size={16} /> : null}
        </Button>
      </div>
    </section>
  )
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const step = useOnboardingStore((state) => state.step)
  const data = useOnboardingStore((state) => state.data)
  const error = useOnboardingStore((state) => state.error)
  const isSubmitting = useOnboardingStore((state) => state.isSubmitting)
  const setField = useOnboardingStore((state) => state.setField)
  const toggleAllergy = useOnboardingStore((state) => state.toggleAllergy)
  const nextStep = useOnboardingStore((state) => state.nextStep)
  const prevStep = useOnboardingStore((state) => state.prevStep)
  const submit = useOnboardingStore((state) => state.submit)
  const setError = useOnboardingStore((state) => state.setError)

  const meta = STEP_META[step]

  const onNext = () => {
    const validationError = validateStep(step, data)
    if (validationError) {
      setError(validationError)
      return
    }

    nextStep()
  }

  const onFinish = async () => {
    const success = await submit()
    if (success) {
      navigate('/home')
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <section className={[styles.wrapper, 'fadeInUp'].join(' ')}>
        <header className={styles.header}>
          <ProgressBar value={step} max={5} label={`Step ${step} of 5`} showPercent />
          <p className={styles.eyebrow}>{meta.eyebrow}</p>
          {step < 5 ? <h1 className={styles.title}>{meta.title}</h1> : null}
          {step < 5 ? <p className={styles.subtitle}>{meta.subtitle}</p> : null}
        </header>

        {step === 1 ? (
          <>
            <section className={[styles.goalGrid, 'stagger'].join(' ')}>
              {GOAL_OPTIONS.map((option) => (
                <GoalCard
                  key={option.value}
                  title={option.title}
                  description={option.description}
                  imageClass={option.imageClass}
                  selected={data.goal === option.value}
                  onClick={() => setField('goal', option.value)}
                />
              ))}
            </section>

            <footer className={styles.actions}>
              <Button size="lg" onClick={onNext}>
                Next Step
              </Button>
            </footer>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <ActivityStep data={data} setField={setField} />
            <footer className={styles.actionsRow}>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={onNext}>Next Step</Button>
            </footer>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <PersonalInfoStep data={data} setField={setField} />
            <footer className={styles.actionsRow}>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={onNext}>Next Step</Button>
            </footer>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <DietStep data={data} setField={setField} toggleAllergy={toggleAllergy} />
            <footer className={styles.actionsRow}>
              <Button variant="secondary" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={onNext}>Next</Button>
            </footer>
          </>
        ) : null}

        {step === 5 ? <CompletionStep data={data} onSubmit={onFinish} isSubmitting={isSubmitting} /> : null}

        {error ? <p className={styles.error}>{error}</p> : null}
      </section>
    </main>
  )
}
