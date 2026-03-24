import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../../components/layout/Footer/Footer'
import { Navbar } from '../../components/layout/Navbar/Navbar'
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper'
import { MealCard } from '../../components/shared/MealCard/MealCard'
import { Button } from '../../components/ui/Button/Button'
import { getMeals } from '../../services/mealService'
import styles from './MealsPage.module.css'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Veg', value: 'veg' },
  { label: 'Non-Veg', value: 'non-veg' },
  { label: 'Vegan', value: 'vegan' },
]

export function MealsPage() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('protein')
  const [searchQuery, setSearchQuery] = useState('')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const data = await getMeals({
        type: typeFilter,
        sort: sortBy,
        search: searchQuery,
      })

      if (active) {
        setMeals(data)
        setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [typeFilter, sortBy, searchQuery])

  const heading = useMemo(() => 'Fuel Your Performance', [])

  return (
    <div className={styles.page}>
      <Navbar loggedIn />

      <main>
        <section className={styles.pageHeader}>
          <PageWrapper>
            <div className={[styles.headerRow, 'fadeInUp'].join(' ')}>
              <div>
                <h1 className={styles.pageTitle}>{heading}</h1>
                <p className={styles.pageSubtitle}>Choose from high-protein dishes crafted for your goal.</p>
              </div>

              <div className={styles.controls}>
                <label className={styles.searchWrap}>
                  <Search size={16} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search meals"
                    aria-label="Search meals"
                  />
                </label>

                <div className={styles.filterTabs}>
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      className={[styles.filterTab, typeFilter === filter.value ? styles.filterTabActive : '']
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setTypeFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <label className={styles.sortWrap}>
                  <SlidersHorizontal size={16} />
                  <span>Sort by</span>
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="protein">Highest Protein</option>
                  </select>
                </label>
              </div>
            </div>
          </PageWrapper>
        </section>

        <section>
          <PageWrapper>
            {loading ? <p className={styles.loading}>Loading meals...</p> : null}

            {!loading ? (
              <div className={styles.mealGrid}>
                {meals.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onAddToPlan={() => {
                      navigate('/plans')
                    }}
                  />
                ))}
              </div>
            ) : null}
          </PageWrapper>
        </section>

        <section className={styles.bottomCtaSection}>
          <PageWrapper>
            <div className={[styles.bottomCta, 'scaleIn'].join(' ')}>
              <div>
                <h2>Want a personalized meal plan?</h2>
                <p>Get a nutritionist-backed macro strategy tailored to your diet preference and goal.</p>
              </div>
              <Button size="lg" onClick={() => navigate('/plans')}>
                Build My Plan
              </Button>
            </div>
          </PageWrapper>
        </section>
      </main>

      <Footer />
    </div>
  )
}
