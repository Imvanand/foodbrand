"use client";

import Navbar from "@/components/Navbar/Navbar";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import ProductShowcase from "@/components/ProductShowcase/ProductShowcase";
import AvailableOnAmazon from "@/components/AvailableOnAmazon/AvailableOnAmazon";
import RecipesSection from "@/components/RecipesSection/RecipesSection";
import BulkOrder from "@/components/BulkOrder/BulkOrder";
import Footer from "@/components/Footer/Footer";
import CustomerReviews from "@/components/CustomerReviews/CustomerReviews";
import { Search } from 'lucide-react';
import styles from "@/app/page.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface HomeClientProps {
    data: {
        sliderImages: string[];
        productImages: string[];
        productData: any;
        reviews: any[];
        reviewStats: any;
    }
}

export default function HomeClient({ data }: HomeClientProps) {
  const { lang } = useLanguage();

  const t = {
    en: {
      promoLabel: "Bulk Order",
      promoText: "Planning a Bulk Order? | Online Inquiry",
      values: [
        {
          icon: "🌱",
          title: "Ethically Sourced",
          desc: "We work directly with small-scale farmers ensuring fair trade practices."
        },
        {
          icon: "🚜",
          title: "100% Organic",
          desc: "Everything we offer is certified organic and free from harmful pesticides."
        },
        {
          icon: "📦",
          title: "Sustainable Packing",
          desc: "Our packaging is designed to be eco-friendly and minimize plastic waste."
        }
      ]
    },
    hi: {
      promoLabel: "बल्क ऑर्डर",
      promoText: "बल्क ऑर्डर की योजना बना रहे हैं? | ऑनलाइन पूछताछ",
      values: [
        {
          icon: "🌱",
          title: "नैतिक रूप से प्राप्त",
          desc: "हम उचित व्यापार प्रथाओं को सुनिश्चित करने के लिए सीधे छोटे किसानों के साथ काम करते हैं।"
        },
        {
          icon: "🚜",
          title: "100% ऑर्गेनिक",
          desc: "हम जो कुछ भी पेश करते हैं वह प्रमाणित ऑर्गेनिक है और हानिकारक कीटनाशकों से मुक्त है।"
        },
        {
          icon: "📦",
          title: "टिकाऊ पैकेजिंग",
          desc: "हमारी पैकेजिंग पर्यावरण के अनुकूल होने और प्लास्टिक कचरे को कम करने के लिए डिज़ाइन की गई है।"
        }
      ]
    }
  }[lang];

  return (
    <main className={styles.main}>
      <Navbar />
      <HeroSlider initialImages={data.sliderImages} />

      {/* Tracker Bar */}
      <div className={styles.promoBar} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className={styles.quickTracker} style={{ marginTop: 0 }}>
             <form onSubmit={(e) => {
                 e.preventDefault();
                 const q = (e.target as any).tracker.value;
                 if (q) window.location.href = `/track?q=${q.toUpperCase()}`;
             }}>
                <div className={styles.trackerWrapper}>
                    <input name="tracker" type="text" placeholder={lang === 'hi' ? "अपना ऑर्डर ट्रैक करें" : "Track Your Order Now"} />
                    <button type="submit">
                        <Search size={18} />
                        <span>{lang === 'hi' ? "खोजें" : "Track"}</span>
                    </button>
                </div>
             </form>
          </div>
        </div>
      </div>

      <div id="products">
        <ProductShowcase 
          initialProductImages={data.productImages} 
          initialProductData={data.productData}
        initialReviewStats={data.reviewStats}
        />
      </div>
      
      <div id="reviews">
        <CustomerReviews initialReviews={data.reviews} />
      </div>

      {/* Bulk Order Bar */}
      <div className={styles.promoBar}>
        <div className="container">
          <div className={styles.promoContent} style={{ justifyContent: 'center' }}>
            <span className={styles.promoLabel}>{t.promoLabel}</span>
            <p><a href="#bulk-order" style={{ textDecoration: 'underline' }}>{t.promoText}</a></p>
          </div>
        </div>
      </div>

      <CategoryBar />

      <section className={styles.values}>
        <div className="container">
          <div className={styles.valuesGrid}>
            {t.values.map((val: any, idx: number) => (
              <div key={idx} className={styles.valueItem}>
                <div className={styles.valueIcon}>{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RecipesSection />
      <AvailableOnAmazon />
      <BulkOrder />
      <Footer />
    </main>
  );
}
