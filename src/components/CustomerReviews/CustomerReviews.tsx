import React, { useEffect, useState } from 'react';
import styles from './CustomerReviews.module.css';
import { useLanguage } from '@/context/LanguageContext';

// Define the structure of a review
interface Review {
  id: string | number;
  name: string;
  rating: number; // 1 to 5
  text: string;
  source?: string;
  date?: string;
}

// Dummy data (can be replaced with Google Sheets CSV fetch or hardcoded JSON export)
const defaultReviews: Review[] = [
  {
    id: 1,
    name: "Aarti Sharma",
    rating: 5,
    text: "The Spice Mix Masala is absolutely fantastic. It completely transformed my paneer sabzi. It has a very authentic and fresh aroma!",
    date: "12 Mar 2026"
  },
  {
    id: 2,
    name: "Vikram Singh",
    rating: 5,
    text: "I was skeptical about 'no added colors', but the taste speaks for itself. My family loved the curry I made with this.",
    date: "05 Mar 2026"
  },
  {
    id: 3,
    name: "Priya Mehta",
    rating: 4,
    text: "Very good quality spices. The packaging is premium and the delivery was fast. I will definitely reorder.",
    date: "28 Feb 2026"
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    rating: 5,
    text: "Authentic taste! Reminds me of the spices my grandmother used to make. Highly recommended for bulk orders.",
    date: "10 Feb 2026"
  }
];

export default function CustomerReviews() {
  const { lang, t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  const texts = {
    en: {
      title: "What Our Customers Say",
      subtitle: "Join thousands of happy customers who love the authentic taste of Kalsa Foods.",
    },
    hi: {
      title: "हमारे ग्राहकों की राय",
      subtitle: "उन हजारों खुश ग्राहकों में शामिल हों जो कलसा फूड्स के असली स्वाद को पसंद करते हैं।",
    }
  }[lang];

  return (
    <section className={styles.reviewsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{texts.title}</h2>
          <p className={styles.subtitle}>{texts.subtitle}</p>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.reviewText}>"{review.text}"</p>
              <div className={styles.authorSection}>
                <div className={styles.avatar}>{review.name.charAt(0)}</div>
                <div className={styles.authorInfo}>
                  <p className={styles.authorName}>{review.name}</p>
                  {review.date && <span className={styles.date}>{review.date}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
