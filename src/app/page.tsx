import Navbar from "@/components/Navbar/Navbar";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import ProductShowcase from "@/components/ProductShowcase/ProductShowcase";
import RecipesSection from "@/components/RecipesSection/RecipesSection";
import BulkOrder from "@/components/BulkOrder/BulkOrder";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function Home() {
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
            <span className={styles.promoLabel}>Bulk Order</span>
            <p><a href="#bulk-order" style={{ textDecoration: 'underline' }}>Planning a Bulk Order? | Online Inquiry</a></p>
          </div>
        </div>
      </div>

      <CategoryBar />

      <ProductShowcase />

      <section className={styles.values}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🌱</div>
              <h3>Ethically Sourced</h3>
              <p>We work directly with small-scale farmers ensuring fair trade practices.</p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>🚜</div>
              <h3>100% Organic</h3>
              <p>Everything we offer is certified organic and free from harmful pesticides.</p>
            </div>
            <div className={styles.valueItem}>
              <div className={styles.valueIcon}>📦</div>
              <h3>Sustainable Packing</h3>
              <p>Our packaging is designed to be eco-friendly and minimize plastic waste.</p>
            </div>
          </div>
        </div>
      </section>

      <RecipesSection />
      <BulkOrder />
      <Footer />
    </main>
  );
}
