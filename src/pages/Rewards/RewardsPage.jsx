import { useEffect } from 'react';
import { Gift, Star } from 'lucide-react';
import { useRewardsStore } from '../../store/rewardsStore.js';
import { Footer } from '../../components/layout/Footer/Footer';
import { Navbar } from '../../components/layout/Navbar/Navbar';
import { PageWrapper } from '../../components/layout/PageWrapper/PageWrapper';
import { Button } from '../../components/ui/Button/Button';
import styles from './RewardsPage.module.css';

function RewardCard({ reward, userPoints, onRedeem }) {
  const canRedeem = userPoints >= reward.pointsCost;

  return (
    <article className={styles.card}>
      <div className={styles.image} style={{ background: reward.image }} aria-hidden="true">
        <Gift size={32} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{reward.title}</h3>
        <p className={styles.description}>{reward.description}</p>
        <div className={styles.points}>
          <Star size={16} />
          {reward.pointsCost} points
        </div>
      </div>
      <Button
        variant={canRedeem ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => onRedeem(reward.id)}
        disabled={!canRedeem}
      >
        {canRedeem ? 'Redeem' : 'Not Enough Points'}
      </Button>
    </article>
  );
}

export function RewardsPage() {
  const {
    rewards,
    userPoints,
    isLoading,
    error,
    fetchRewards,
    redeemReward,
  } = useRewardsStore();

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleRedeem = async (rewardId) => {
    try {
      const result = await redeemReward(rewardId);
      alert(result.message);
    } catch {
      alert('Failed to redeem reward. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar loggedIn />
      <main>
        <section className={styles.hero}>
          <PageWrapper>
            <div className={styles.heroContent}>
              <Gift size={28} />
              <h1>Rewards Store</h1>
              <p>
                Redeem your hard-earned points for exclusive rewards. Keep building your protein streak to unlock more!
              </p>
              <div className={styles.pointsDisplay}>
                <Star size={20} />
                <span>{userPoints} points available</span>
              </div>
            </div>
          </PageWrapper>
        </section>

        <section className={styles.gridSection}>
          <PageWrapper>
            {isLoading ? (
              <p className={styles.loading}>Loading rewards...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              <div className={styles.grid}>
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userPoints}
                    onRedeem={handleRedeem}
                  />
                ))}
              </div>
            )}
          </PageWrapper>
        </section>
      </main>
      <Footer />
    </div>
  );
}
