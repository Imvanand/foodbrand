"use client";

import Navbar from "@/components/Navbar/Navbar";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import ProductShowcase from "@/components/ProductShowcase/ProductShowcase";
import RecipesSection from "@/components/RecipesSection/RecipesSection";
import BulkOrder from "@/components/BulkOrder/BulkOrder";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Spice Mix Masala",
    "image": "https://kalsafoods.com/Front.png",
    "description": "Premium All-Purpose Indian Spice Blend for Sabzi, Paneer & Curry. Rich Aroma & Authentic Taste with No Added Colors.",
    "brand": {
      "@type": "Brand",
      "name": "Kalsa Foods"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://kalsafoods.com",
      "priceCurrency": "INR",
      "price": "89.00",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Kalsa Foods",
    "image": "https://kalsafoods.com/logo/logo.png",
    "@id": "https://kalsafoods.com",
    "url": "https://kalsafoods.com",
    "telephone": "+918709438350",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "K R Puram",
      "addressLocality": "Bangalore",
      "postalCode": "560036",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.9866,
      "longitude": 77.7011
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    }
  };

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <Navbar />
      <HeroSlider />

      {/* Promo Bar */}
      <div className={styles.promoBar}>
        <div className="container">
          <div className={styles.promoContent}>
            <span className={styles.promoLabel}>{t.promoLabel}</span>
            <p><a href="#bulk-order" style={{ textDecoration: 'underline' }}>{t.promoText}</a></p>
          </div>
        </div>
      </div>

      <CategoryBar />

      <ProductShowcase />

      <section className={styles.values}>
        <div className="container">
          <div className={styles.valuesGrid}>
            {t.values.map((val, idx) => (
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
      <BulkOrder />
      <Footer />
    </main>
  );
}
