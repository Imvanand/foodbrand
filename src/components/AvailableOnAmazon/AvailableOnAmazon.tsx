import React from 'react';
import styles from './AvailableOnAmazon.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function AvailableOnAmazon() {
  const { lang } = useLanguage();

  const t = {
    en: {
      title: "We are now LIVE on Amazon! 🎉",
      description: "Get your favorite Kalsa Spice Mix Masala delivered fast and easy across India.",
      button: "Shop on Amazon.in"
    },
    hi: {
      title: "अब हम अमेज़न पर भी उपलब्ध हैं! 🎉",
      description: "अपना पसंदीदा कलसा स्पाइस मिक्स मसाला अमेज़न के ज़रिए पूरे भारत में तेज़ी से मंगवाएं।",
      button: "अमेज़न पर खरीदें"
    }
  }[lang];

  const amazonUrl = "https://www.amazon.in/Kalsa-Foods-Masala-Authentic-Kitchen/dp/B0GS27VHFP/ref=sr_1_5?crid=SYF2RYMA011R&dib=eyJ2IjoiMSJ9.HOIQZzIM_abtQmnOJYn3-7MwpiiQCrKQ68t2g_domuiZ2X9wa9OKnfXJ8Trs6AkeQ2KxAQhyH0G_b8ZykJHi9jbW4ekBvEbVnLLVEzwjCSZSfaF2kG3d9X1OC6lGVDFCmwA1gh42NT80-nlAUyogta9noYrojs5FXOlLByizonkXHi5qU74RqzZPKD-8ty_YpfubHCNnnCz5rNZdtNFl0hL4UZEG0zk1LsiMhbjV7-UVgGVjf2uGILyyrLhMSStMh8KfQhW80y6rRQ9W8kow0VFgav24yz5EQFLvWIbOAZ4.EkoCiqEE_-U37GDVJbqqOmyMi5FMGZDlSlcX8hcmW4A&dib_tag=se&keywords=kalsa+spice+mix+masala&nsdOptOutParam=true&qid=1773613642&sprefix=%2Caps%2C389&sr=8-5";

  return (
    <section className={styles.amazonSection}>
      <div className="container">
        <div className={styles.amazonCard}>
          <div className={styles.content}>
            <h2 className={styles.title}>{t.title}</h2>
            <p className={styles.description}>{t.description}</p>
            <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className={styles.amazonButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {t.button}
            </a>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/Marketplace/Amazon.png" alt="Kalsa Spice Mix on Amazon" className={styles.productImage} />
          </div>
        </div>
      </div>
    </section>
  );
}
