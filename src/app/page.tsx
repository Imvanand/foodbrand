import Navbar from "@/components/Navbar/Navbar";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import ProductShowcase from "@/components/ProductShowcase/ProductShowcase";
import RecipesSection from "@/components/RecipesSection/RecipesSection";
import BulkOrder from "@/components/BulkOrder/BulkOrder";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
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
