"use client";

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductShowcase.module.css';
import { getProductImages } from '@/lib/actions';

const ProductShowcase = () => {
    const [productImages, setProductImages] = useState<string[]>([]);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

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

    const product = {
        name: "Kalsa foods 100% Natural Spice Mix Masala Powder 100gm",
        fullName: "Kalsa foods 100% Natural Spice Mix Masala Powder 100gm No Added Colours and Chemicals with Aromatic Blend of Whole Spices for Cooking",
        tagline: "Experience the true taste of homemade goodness",
        price: "₹299",
        originalPrice: "₹399",
        dietType: "Vegetarian",
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
            { label: "Item Type Name", value: "Kalsa Foods Spice Mix Masala (मसाला मिश्रण), 200 gm" },
            { label: "Manufacturer", value: "Kalsa Foods" },
            { label: "Manufacturer Contact Information", value: "Kalsa Foods" },
            { label: "Packer Contact Information", value: "Kalsa Foods" }
        ]
    };

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
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} width={60} height={60} />
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
                                    alt={product.name}
                                    fill
                                    className={styles.mainImage}
                                    priority
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
                            <div className={styles.breadcrumb}>Kalsa Foods &gt; Spices & Masalas</div>
                            <h1 className={styles.title}>{product.fullName}</h1>
                            <div className={styles.brandLink}>Visit the Kalsa Foods Store</div>

                            <div className={styles.divider}></div>

                            <div className={styles.priceArea}>
                                <div className={styles.discountBadge}>-25%</div>
                                <div className={styles.priceColumn}>
                                    <span className={styles.priceSymbol}>₹</span>
                                    <span className={styles.priceMain}>299</span>
                                </div>
                            </div>
                            <div className={styles.mrp}>M.R.P.: <span className={styles.strike}>₹399.00</span></div>
                            <p className={styles.inclusiveText}>Inclusive of all taxes</p>

                            <div className={styles.divider}></div>

                            <div className={styles.vegBadge}>
                                <span className={styles.vegIcon}></span>
                                This is a <span className={styles.vegText}>{product.dietType}</span> product.
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.aboutSection}>
                                <h2>About this item</h2>
                                <ul className={styles.aboutList}>
                                    {product.aboutItems.map((item, idx) => {
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
                                <h2>Product information</h2>
                                <div className={styles.techGrid}>
                                    <div className={styles.techColumn}>
                                        <h3>Specifications</h3>
                                        {product.specifications.map((spec, idx) => (
                                            <div key={idx} className={styles.techRow}>
                                                <span className={styles.label}>{spec.label}</span>
                                                <span className={styles.value}>{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.techColumn}>
                                        <h3>Additional Information</h3>
                                        {product.additionalInfo.map((info, idx) => (
                                            <div key={idx} className={styles.techRow}>
                                                <span className={styles.label}>{info.label}</span>
                                                <span className={styles.value}>{info.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.ctaWrapper}>
                                <a
                                    href="https://www.flipkart.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.buyBtn}
                                >
                                    Add to Cart
                                </a>
                                <div className={styles.secondaryBtns}>
                                    <button className={styles.buyNowBtn}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
