"use client";

import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductShowcase.module.css';
import { getProductImages } from '@/lib/actions';
import CheckoutModal from '../CheckoutModal/CheckoutModal';
import { useRouter } from 'next/navigation';
import { Share2, Heart } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';

import { useLanguage } from '@/context/LanguageContext';
import PincodeCheck from '../PincodeCheck/PincodeCheck';

const ProductShowcase = () => {
    const { lang } = useLanguage();
    const [productImages, setProductImages] = useState<string[]>([]);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [localQuantity, setLocalQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [productData, setProductData] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

    // Check if this product is already in cart
    const cartItem = cart.find(item => item.product_id === 'kalsa-spicemix-100g');
    const quantity = cartItem ? cartItem.quantity : 0;

    const [user, setUser] = useState<any>(null);

    // Get session
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        getSession();
    }, []);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            const images = await getProductImages();
            if (images.length > 0) {
                setProductImages(images);
                setActiveImage(images[0]);
            }

            try {
                const { data: pData, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', 'kalsa-spicemix-100g')
                    .single();
                
                if (pData) {
                    setProductData(pData);
                    if (pData.main_image || (pData.images && pData.images.length > 0)) {
                        setProductImages(prev => {
                            let newImages = [...prev];
                            
                            // Add additional images first
                            if (pData.images && Array.isArray(pData.images)) {
                                pData.images.forEach((img: string) => {
                                    if (img && !newImages.includes(img)) {
                                        newImages.push(img);
                                    }
                                });
                            }
                            
                            // Ensure main_image is at the very beginning
                            if (pData.main_image) {
                                newImages = newImages.filter(img => img !== pData.main_image);
                                newImages.unshift(pData.main_image);
                            }
                            
                            return newImages;
                        });
                        
                        setActiveImage(pData.main_image || (pData.images && pData.images[0]) || null);

                    }
                }
            } catch (err) {
                console.error("Failed to fetch product data", err);
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data } = await supabase
                    .from('user_wishlist')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .eq('product_id', 'kalsa-spicemix-100g')
                    .single();
                if (data) setIsInWishlist(true);
            }
        };
        fetchData();
    }, [supabase]);

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
            offerText: "Launch Offer: Free Delivery All Over India",
            moqNotice: "Launch Offer: Free Delivery All Over India",
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
            offerText: "लॉन्च ऑफर: पूरे भारत में मुफ्त डिलीवरी",
            moqNotice: "लॉन्च ऑफर: पूरे भारत में मुफ्त डिलीवरी",
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

    const t = productData ? {
        breadcrumb: productData[`breadcrumb_${lang}`],
        name: productData[`name_${lang}`],
        fullName: productData[`full_name_${lang}`],
        tagline: productData[`tagline_${lang}`],
        aboutTitle: lang === 'hi' ? "इस आइटम के बारे में" : "About this item",
        vegText: lang === 'hi' ? "शाकाहारी" : "Vegetarian",
        qtyLabel: lang === 'hi' ? "मात्रा:" : "Quantity:",
        addBtn: lang === 'hi' ? `कार्ट में ${quantity} जोड़ें` : `Add ${quantity} to Cart`,
        buyNowBtn: lang === 'hi' ? "अभी खरीदें" : "Buy Now",
        infoTitle: lang === 'hi' ? "उत्पाद की जानकारी" : "Product information",
        specTitle: lang === 'hi' ? "विशेष विवरण" : "Specifications",
        additionalTitle: lang === 'hi' ? "अतिरिक्त जानकारी" : "Additional Information",
        offerTitle: productData[`offer_title_${lang}`],
        offerText: productData[`offer_text_${lang}`],
        moqNotice: productData[`moq_notice_${lang}`],
        aboutItems: productData[`about_items_${lang}`],
        specifications: productData[`specifications_${lang}`],
        additionalInfo: productData[`additional_info_${lang}`],
        price: productData.price,
        mrp: productData.mrp,
        discountPercentage: productData.discount_percentage,
        pricePerUnit: productData[`unit_price_text_${lang}`]
    } : { ...content[lang as keyof typeof content], price: 139, mrp: 179, discountPercentage: 22, pricePerUnit: "(₹139 /100 g)" };

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

    const handleShare = async () => {
        try {
            let filesArray: File[] = [];
            if (activeImage) {
                try {
                    const response = await fetch(activeImage);
                    const blob = await response.blob();
                    const file = new File([blob], "product.png", { type: blob.type || 'image/png' });
                    filesArray = [file];
                } catch (e) {
                    console.log("Error fetching image for share", e);
                }
            }
            const shareData: ShareData = {
                title: t.fullName,
                text: `${t.fullName}\n${t.tagline}`,
                url: window.location.href,
            };
            if (filesArray.length > 0 && navigator.canShare && navigator.canShare({ files: filesArray })) {
                shareData.files = filesArray;
            }
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${t.fullName}\n${window.location.href}`);
                alert("Product link copied to clipboard!");
            }
        } catch (err) {
            console.log('Error sharing', err);
        }
    };

    const handleToggleWishlist = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Please login to add items to your wishlist");
            router.push('/login');
            return;
        }

        try {
            if (isInWishlist) {
                const { error } = await supabase
                    .from('user_wishlist')
                    .delete()
                    .eq('user_id', session.user.id)
                    .eq('product_id', 'kalsa-spicemix-100g');
                
                if (error) throw error;
                setIsInWishlist(false);
            } else {
                const { error } = await supabase
                    .from('user_wishlist')
                    .insert([{
                        user_id: session.user.id,
                        product_id: 'kalsa-spicemix-100g',
                        product_name: t.name,
                        product_image: activeImage
                    }]);
                
                if (error) throw error;
                setIsInWishlist(true);
            }
        } catch (err: any) {
            console.error("Wishlist error:", err);
            alert("Could not update wishlist. Did you run the SQL code in Supabase editor? Error: " + err.message);
        }
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
                            <div className={styles.titleWrapper}>
                                <h1 className={styles.title}>{t.fullName}</h1>
                                <div className={styles.actionBtns}>
                                {user && (
                                    <button 
                                        onClick={handleToggleWishlist} 
                                        className={`${styles.wishlistBtn} ${isInWishlist ? styles.inWishlist : ''}`}
                                        aria-label="Add to Wishlist"
                                    >
                                        <Heart size={24} fill={isInWishlist ? "#ff4757" : "none"} color={isInWishlist ? "#ff4757" : "#555"} />
                                    </button>
                                )}
                                    <button onClick={handleShare} className={styles.shareBtn} aria-label="Share">
                                        <Share2 size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.divider}></div>

                            <div className={styles.priceArea}>
                                <div className={styles.discountBadge}>-{t.discountPercentage}%</div>
                                <div className={styles.priceColumn}>
                                    <span className={styles.priceSymbol}>₹</span>
                                    <span className={styles.priceMain}>{t.price}</span>
                                    <span className={styles.pricePerUnit}>{t.pricePerUnit}</span>
                                </div>
                            </div>
                            <div className={styles.mrp}>M.R.P.: <span className={styles.strike}>₹{t.mrp}.00</span></div>
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

                            <PincodeCheck />

                            <div className={styles.divider}></div>

                            <div className={styles.vegBadge}>
                                <span className={styles.vegIcon}></span>
                                This is a <span className={styles.vegText}>{t.vegText}</span> product.
                            </div>


            <div className={styles.ctaWrapper}>
                                {quantity === 0 ? (
                                    <button
                                        className={styles.buyBtn}
                                        onClick={() => addToCart({
                                            product_id: 'kalsa-spicemix-100g',
                                            name: t.name,
                                            price: t.price || 139,
                                            quantity: 1,
                                            image: activeImage
                                        })}
                                    >
                                        {t.addBtn.replace(quantity.toString(), '1')}
                                    </button>
                                ) : (
                                    <div className={styles.cartQtySelector}>
                                        <button
                                            onClick={() => {
                                                if (quantity === 1) {
                                                    removeFromCart(cartItem!.id);
                                                } else {
                                                    updateQuantity(cartItem!.id, quantity - 1);
                                                }
                                            }}
                                            className={styles.qtyBtn}
                                        >-</button>
                                        <span className={styles.qtyDisplay}>{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(cartItem!.id, quantity + 1)}
                                            className={styles.qtyBtn}
                                        >+</button>
                                    </div>
                                )}
                                
                                <div className={styles.secondaryBtns}>
                                    <button
                                        className={styles.buyNowBtn}
                                        onClick={async () => {
                                            if (quantity === 0) {
                                                await addToCart({
                                                    product_id: 'kalsa-spicemix-100g',
                                                    name: t.name,
                                                    price: t.price || 139,
                                                    quantity: 1,
                                                    image: activeImage
                                                });
                                            }
                                            router.push('/checkout');
                                        }}
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

        </section>
    );
};

export default ProductShowcase;
