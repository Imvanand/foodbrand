"use client";

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductShowcase.module.css';
import { getProductImages } from '@/lib/actions';
import CheckoutModal from '../CheckoutModal/CheckoutModal';

import { useLanguage } from '@/context/LanguageContext';

const ProductShowcase = () => {
    const { lang } = useLanguage();
    const [productImages, setProductImages] = useState<string[]>([]);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchImages = async () => {
            const images = await getProductImages();
            if (images.length > 0) {
                setProductImages(images);
                setActiveImage(images[0]);
            }
        };
        fetchImages();
    }, []);

    const content = {
        en: {
            breadcrumb: "Kalsa Foods > Spices & Masalas",
            name: "Kalsa foods 100% Natural Spice Mix Masala Powder 100gm",
            fullName: "Spice Mix Masala | All-Purpose Indian Spice Blend | For Sabzi, Paneer & Curry | Rich Aroma & Authentic Taste | No Added Colors | 100g",
            tagline: "Experience the true taste of homemade goodness",
            aboutTitle: "About this item",
            vegText: "Vegetarian",
            qtyLabel: "Quantity:",
            addBtn: `Add ${quantity} to Cart`,
            buyNowBtn: "Buy Now",
            infoTitle: "Product information",
            specTitle: "Specifications",
            additionalTitle: "Additional Information",
            offerTitle: "🚀 Launch Offer",
            offerText: "Buy 3 or more Packs & Get Free Delivery (₹60 charge for 1-2 packs)",
            moqNotice: "Special Offer: 3+ Packs for Free Delivery",
            aboutItems: [
                "Inspired by Generations of Home Cooking: Crafted from our family’s time-tested recipe, bringing the warmth and authenticity of traditional Indian kitchens to your meals.",
                "One Masala, Multiple Dishes: Perfect all-purpose blend for sabzi, curry, paneer, chicken, egg, and everyday recipes.",
                "Rich Aroma & Balanced Flavor: Expertly blended spices deliver a soulful fragrance, vibrant color, and perfectly balanced taste in every bite.",
                "Premium Quality Whole Spices: Made from carefully selected, high-quality spices to ensure purity, freshness, and consistency.",
                "No Artificial Colors or Preservatives: Free from added colors and harmful preservatives – just pure, authentic spice goodness.",
                "Elevates Everyday Cooking: Transforms simple ingredients into flavorful, restaurant-style dishes at home."
            ],
            specifications: [
                { label: "Brand Name", value: "Kalsa Foods" },
                { label: "Item Form", value: "Powder" },
                { label: "Diet Type", value: "Vegetarian" },
                { label: "Specialty", value: "Natural" },
                { label: "Container Type", value: "Standup pouch" },
                { label: "Country of Origin", value: "India" }
            ],
            additionalInfo: [
                { label: "Importer Contact Information", value: "Kalsa Foods" },
                { label: "Item Type Name", value: "Kalsa Foods Spice Mix Masala (मसाला मिश्रण), 100 gm" },
                { label: "Manufacturer", value: "Kalsa Foods" },
                { label: "Manufacturer Contact Information", value: "Kalsa Foods" },
                { label: "Packer Contact Information", value: "Kalsa Foods" }
            ]
        },
        hi: {
            breadcrumb: "कालसा फूड्स > मसाले",
            name: "कालसा फूड्स 100% प्राकृतिक स्पाइस मिक्स मसाला पाउडर 100 ग्राम",
            fullName: "स्पाइस मिक्स मसाला | सर्व-उद्देशीय भारतीय मसाला मिश्रण | सब्जी, पनीर और करी के लिए | भरपूर सुगंध और असली स्वाद | कोई अतिरिक्त रंग नहीं | 100ग्राम",
            tagline: "घर के बने खाने के असली स्वाद का अनुभव करें",
            aboutTitle: "इस आइटम के बारे में",
            vegText: "शाकाहारी",
            qtyLabel: "मात्रा:",
            addBtn: `कार्ट में ${quantity} जोड़ें`,
            buyNowBtn: "अभी खरीदें",
            infoTitle: "उत्पाद की जानकारी",
            specTitle: "विशेष विवरण",
            additionalTitle: "अतिरिक्त जानकारी",
            offerTitle: "🚀 लॉन्च ऑफर",
            offerText: "3 या अधिक पैक खरीदें और मुफ्त डिलीवरी पाएं (1-2 पैक पर ₹60 चार्ज)",
            moqNotice: "विशेष ऑफर: 3+ पैक पर मुफ्त डिलीवरी",
            aboutItems: [
                "पीढ़ियों की घर की कुकिंग से प्रेरित: हमारे परिवार के समय की कसौटी पर खरी उतरी रेसिपी से तैयार, जो आपके भोजन में पारंपरिक भारतीय रसोई की गर्माहट और प्रामाणिकता लाती है।",
                "एक मसाला, कई व्यंजन: सब्जी, करी, पनीर, चिकन, अंडे और रोजमर्रा की रेसिपी के लिए एकदम सही सर्व-उद्देशीय मिश्रण।",
                "भरपूर सुगंध और संतुलित स्वाद: कुशलता से मिश्रित मसाले हर निवाले में एक रूहानी खुशबू, जीवंत रंग और पूरी तरह से संतुलित स्वाद देते हैं।",
                "प्रीमियम गुणवत्ता वाले खड़े मसाले: शुद्धता, ताजगी और निरंतरता सुनिश्चित करने के लिए सावधानीपूर्वक चुने गए, उच्च गुणवत्ता वाले मसालों से बने।",
                "कोई कृत्रिम रंग या संरक्षक नहीं: अतिरिक्त रंगों और हानिकारक संरक्षकों से मुक्त - बस शुद्ध, असली मसालों की अच्छाई।",
                "रोजमर्रा की कुकिंग को बेहतर बनाता है: घर पर ही साधारण सामग्री को स्वादिष्ट, रेस्टोरेंट जैसे व्यंजनों में बदल देता है।"
            ],
            specifications: [
                { label: "ब्रांड का नाम", value: "कालसा फूड्स" },
                { label: "आइटम फॉर्म", value: "पाउडर" },
                { label: "आहार प्रकार", value: "शाकाहारी" },
                { label: "विशेषता", value: "प्राकृतिक" },
                { label: "कंटेनर प्रकार", value: "स्टैंडअप पाउच" },
                { label: "उत्पत्ति का देश", value: "भारत" }
            ],
            additionalInfo: [
                { label: "आयातक संपर्क जानकारी", value: "कालसा फूड्स" },
                { label: "आइटम प्रकार का नाम", value: "कालसा फूड्स स्पाइस मिक्स मसाला, 100 ग्राम" },
                { label: "निर्माता", value: "कालसा फूड्स" },
                { label: "निर्माता संपर्क जानकारी", value: "कालसा फूड्स" },
                { label: "पैकर संपर्क जानकारी", value: "कालसा फूड्स" }
            ]
        }
    };

    const t = content[lang];

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        // Calculate position relative to the element
        const xPos = e.clientX - left;
        const yPos = e.clientY - top;

        // Calculate percentage for background-position
        const xPerc = (xPos / width) * 100;
        const yPerc = (yPos / height) * 100;

        // Constrain x and y between 0 and 100
        const boundedX = Math.max(0, Math.min(100, xPerc));
        const boundedY = Math.max(0, Math.min(100, yPerc));

        setZoomPos({ x: boundedX, y: boundedY });
    };

    if (!mounted || productImages.length === 0 || !activeImage) return null;

    return (
        <section id="our-product" className={styles.showcaseSection}>
            <div className="container">
                <div className={styles.card}>
                    <div className={styles.grid}>
                        {/* Gallery Section */}
                        <div className={styles.gallery}>
                            <div className={styles.thumbnails}>
                                {productImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.thumb} ${activeImage === img ? styles.activeThumb : ''}`}
                                        onMouseEnter={() => setActiveImage(img)}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} width={60} height={60} unoptimized />
                                    </div>
                                ))}
                            </div>

                            <div
                                className={styles.mainImageWrapper}
                                ref={containerRef}
                                onMouseEnter={() => setIsZooming(true)}
                                onMouseLeave={() => setIsZooming(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <Image
                                    src={activeImage}
                                    alt={t.name}
                                    fill
                                    className={styles.mainImage}
                                    priority
                                    unoptimized
                                />
                                {isZooming && (
                                    <>
                                        <div
                                            className={styles.zoomLens}
                                            style={{
                                                left: `${zoomPos.x}%`,
                                                top: `${zoomPos.y}%`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        />
                                        <div
                                            className={styles.zoomWindow}
                                            style={{
                                                backgroundImage: `url("${activeImage}")`,
                                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                backgroundSize: '250%' // Zoom factor
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className={styles.details}>
                            <div className={styles.breadcrumb}>{t.breadcrumb}</div>
                            <h1 className={styles.title}>{t.fullName}</h1>
                            <div className={styles.brandLink}>Visit the Kalsa Foods Store</div>

                            <div className={styles.divider}></div>

                            <div className={styles.priceArea}>
                                <div className={styles.discountBadge}>-40%</div>
                                <div className={styles.priceColumn}>
                                    <span className={styles.priceSymbol}>₹</span>
                                    <span className={styles.priceMain}>107</span>
                                </div>
                            </div>
                            <div className={styles.mrp}>M.R.P.: <span className={styles.strike}>₹179.00</span></div>
                            <p className={styles.inclusiveText}>Inclusive of all taxes</p>

                            <div className={styles.offerCard}>
                                <div className={styles.offerTitle}>
                                    <span>{t.offerTitle}</span>
                                </div>
                                <div className={styles.offerText}>
                                    {t.offerText}
                                </div>
                                <div className={styles.moqNotice}>
                                    {t.moqNotice}
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.vegBadge}>
                                <span className={styles.vegIcon}></span>
                                This is a <span className={styles.vegText}>{t.vegText}</span> product.
                            </div>

                            <div className={styles.qtySection}>
                                <label htmlFor="quantity">{t.qtyLabel}</label>
                                <div className={styles.qtySelector}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className={styles.qtyBtn}
                                        disabled={quantity <= 1}
                                    >-</button>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className={styles.qtyInput}
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className={styles.qtyBtn}
                                    >+</button>
                                </div>
                            </div>

                            <div className={styles.ctaWrapper}>
                                <button
                                    className={styles.buyBtn}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    {t.addBtn}
                                </button>
                                <div className={styles.secondaryBtns}>
                                    <button
                                        className={styles.buyNowBtn}
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        {t.buyNowBtn}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.aboutSection}>
                                <h2>{t.aboutTitle}</h2>
                                <ul className={styles.aboutList}>
                                    {t.aboutItems.map((item: string, idx: number) => {
                                        const parts = item.split(':');
                                        if (parts.length > 1) {
                                            return (
                                                <li key={idx}>
                                                    <span className={styles.bold}>{parts[0]}:</span> {parts.slice(1).join(':')}
                                                </li>
                                            );
                                        }
                                        return <li key={idx}>{item}</li>;
                                    })}
                                </ul>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.technicalSection}>
                                <h2>{t.infoTitle}</h2>
                                <div className={styles.techGrid}>
                                    <div className={styles.techColumn}>
                                        <h3>{t.specTitle}</h3>
                                        {t.specifications.map((spec: any, idx: number) => (
                                            <div key={idx} className={styles.techRow}>
                                                <span className={styles.label}>{spec.label}</span>
                                                <span className={styles.value}>{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.techColumn}>
                                        <h3>{t.additionalTitle}</h3>
                                        {t.additionalInfo.map((info: any, idx: number) => (
                                            <div key={idx} className={styles.techRow}>
                                                <span className={styles.label}>{info.label}</span>
                                                <span className={styles.value}>{info.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={t.fullName}
                quantity={quantity}
                price={107}
            />
        </section>
    );
};

export default ProductShowcase;
