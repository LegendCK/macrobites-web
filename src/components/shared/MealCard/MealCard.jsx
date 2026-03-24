import { Plus, Zap } from 'lucide-react'
import { Badge } from '../../ui/Badge/Badge'
import { Button } from '../../ui/Button/Button'
import styles from './MealCard.module.css'

export function MealCard({ meal, onAddToPlan }) {
  const imageStyle = { background: meal.imageGradient }

  return (
    <article className={[styles.card, 'fadeInUp'].join(' ')}>
      <div className={styles.imageWrap}>
        <div className={styles.image} style={imageStyle} role="img" aria-label={meal.name} />
        <Badge type={meal.type} className={styles.typeBadge} />

        <div className={styles.addOverlay}>
          <Button size="sm" onClick={() => onAddToPlan(meal)}>
            <Plus size={16} />
            Add to Plan
          </Button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{meal.name}</h3>
          <div>
            <p className={styles.protein}>{meal.macros.protein}g</p>
            <p className={styles.proteinLabel}>protein</p>
          </div>
        </div>

        <div className={styles.tags}>
          {meal.tags.map((tag) => (
            <Badge key={tag} variant="pill" label={tag} />
          ))}
        </div>

        <div className={styles.macros}>
          <p className={styles.calories}>
            <Zap size={14} className={styles.calorieIcon} />
            {meal.macros.calories} kcal
          </p>

          <div className={styles.macroItem}>
            <span className={styles.macroValue}>{meal.macros.fats}g</span>
            <span className={styles.macroLabel}>Fat</span>
          </div>

          <div className={styles.macroItem}>
            <span className={styles.macroValue}>{meal.macros.carbs}g</span>
            <span className={styles.macroLabel}>Carbs</span>
          </div>
        </div>
      </div>
    </article>
  )
}
