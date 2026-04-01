import React, { useEffect, useState } from 'react';
import styles from './CustomerReviews.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import { Star, CheckCircle2, PenLine } from 'lucide-react';
import Link from 'next/link';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  title: string;
  content: string;
  verified_purchase: boolean;
  created_at: string;
  images?: string[];
}

interface CustomerReviewsProps {
  initialReviews?: Review[];
}

export default function CustomerReviews({ initialReviews = [] }: CustomerReviewsProps) {
  const { lang } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loading, setLoading] = useState(initialReviews.length === 0);
  const supabase = createClient();

  useEffect(() => {
    if (initialReviews.length === 0) {
      async function fetchReviews() {
        const { data, error } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setReviews(data);
        }
        setLoading(false);
      }
      fetchReviews();
    }
  }, [initialReviews.length]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 
      : 0
  }));

  const texts = {
    en: {
      title: "Customer Reviews",
      subtitle: "Verified experiences from Kalsa Foods kitchens.",
      writeBtn: "Write a Review",
      verified: "Verified Purchase",
      noReviews: "No reviews yet. Be the first to share your experience!"
    },
    hi: {
      title: "ग्राहकों की समीक्षाएं",
      subtitle: "कलसा फूड्स की रसोई से प्रमाणित अनुभव।",
      writeBtn: "समीक्षा लिखें",
      verified: "प्रमाणित खरीद",
      noReviews: "अभी तक कोई समीक्षा नहीं है। अपना अनुभव साझा करने वाले पहले व्यक्ति बनें!"
    }
  }[lang];

  return (
    <section className={styles.reviewsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{texts.title}</h2>
          <p className={styles.subtitle}>{texts.subtitle}</p>
        </div>

        <div className={styles.mainGrid}>
          {/* Rating Summary Breakdown (Amazon Style) */}
          <div className={styles.summaryCard}>
            <div className={styles.avgRatingBlock}>
              <span className={styles.avgNumber}>{averageRating}</span>
              <div className={styles.avgStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    fill={i < Math.round(Number(averageRating)) ? "#fbbf24" : "none"} 
                    color={i < Math.round(Number(averageRating)) ? "#fbbf24" : "#e5e7eb"} 
                  />
                ))}
              </div>
              <span className={styles.totalCount}>{reviews.length} total ratings</span>
            </div>

            <div className={styles.histogram}>
              {ratingCounts.map((item) => (
                <div key={item.star} className={styles.histoRow}>
                  <span className={styles.histoLabel}>{item.star} star</span>
                  <div className={styles.barContainer}>
                    <div className={styles.barFill} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                  <span className={styles.histoPercent}>{Math.round(item.percentage)}%</span>
                </div>
              ))}
            </div>

            <Link href="/submit-review" className={styles.writeReviewBtn}>
              <PenLine size={20} /> {texts.writeBtn}
            </Link>
          </div>

          {/* Review List */}
          <div className={styles.reviewsList}>
            {loading ? (
              <div className={styles.loading}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className={styles.noReviews}>{texts.noReviews}</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewerHeader}>
                    <div className={styles.avatar}>{review.customer_name.charAt(0)}</div>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>{review.customer_name}</span>
                      {review.verified_purchase && (
                        <span className={styles.verifiedBadge}>
                          <CheckCircle2 size={12} /> {texts.verified}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < review.rating ? "#fbbf24" : "none"} 
                        color={i < review.rating ? "#fbbf24" : "#e5e7eb"} 
                      />
                    ))}
                    <span className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className={styles.reviewTitle}>{review.title}</h3>
                  <p className={styles.reviewContent}>{review.content}</p>

                  {review.images && review.images.length > 0 && (
                    <div className={styles.reviewImages}>
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt={`review-${i}`} className={styles.reviewPhoto} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
