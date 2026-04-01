"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Search, Star, Loader2, CheckCircle, Upload, ShoppingBag, X } from 'lucide-react';
import styles from './submit-review.module.css';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


function ReviewFormContent() {
    // 1. Initial Verification State
    const [isVerified, setIsVerified] = useState(false);
    // ... existing states ...
    const [isVerifying, setIsVerifying] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [orderData, setOrderData] = useState<any>(null);

    // 2. Review Form State (for multiple products)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        content: '',
        images: [] as string[]
    });

    const searchParams = useSearchParams();

    // 3. Auto-load from Magic Link
    useEffect(() => {
        const urlOrderId = searchParams.get('id');
        const urlPhone = searchParams.get('phone');
        
        if (urlOrderId || urlPhone) {
            if (urlOrderId) setOrderId(urlOrderId);
            if (urlPhone) setPhone(urlPhone);
            
            // Auto-trigger verification if enough data exists
            if (urlOrderId && urlPhone) {
                const autoVerify = async (oid: string, ph: string) => {
                    setIsVerifying(true);
                    setVerificationError('');
                    try {
                        const res = await fetch('/api/reviews/verify-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderId: oid, phone: ph })
                        });
                        const data = await res.json();
                        if (data.success) {
                            setOrderData(data);
                            setIsVerified(true);
                        }
                    } catch (err) {
                        console.error("Auto-verify failed", err);
                    } finally {
                        setIsVerifying(false);
                    }
                };
                autoVerify(urlOrderId, urlPhone);
            }
        }
    }, [searchParams]);

    const handleVerify = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsVerifying(true);
        setVerificationError('');
        
        try {
            const res = await fetch('/api/reviews/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, phone })
            });
            const data = await res.json();
            
            if (data.success) {
                setOrderData(data);
                setIsVerified(true);
            } else {
                setVerificationError(data.error);
            }
        } catch (err) {
            setVerificationError('Problem connecting to server. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        fileArray.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReviewForm(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setReviewForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: selectedProduct.product_id,
                    order_id: orderData.orderId,
                    rating: reviewForm.rating,
                    title: reviewForm.title,
                    content: reviewForm.content,
                    customer_name: orderData.customerName,
                    verified_purchase: true,
                    images: reviewForm.images
                })
            });
            
            const result = await res.json();
            if (result.success) {
                setIsSuccess(true);
            } else {
                alert("Error: " + result.error);
            }
        } catch (err) {
            alert("Could not submit review. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [hover, setHover] = useState(0);

    const getStarLabel = (rating: number) => {
        switch(rating) {
            case 5: return 'It\'s Amazing! 🌟';
            case 4: return 'Really Good! ✨';
            case 3: return 'Just Okay 😐';
            case 2: return 'Not Great 😕';
            case 1: return 'Very Poor 👎';
            default: return 'Tap to Rate';
        }
    };

    if (isSuccess) return (
// ... existing code ...
        <div className={styles.successContainer}>
            <div className={styles.card}>
                <CheckCircle size={64} color="#224b33" />
                <h1>Review submitted successfully!</h1>
                <p>Thank you for sharing your experience. Your feedback helps thousands of customers choose the best spices for their kitchen.</p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button className={styles.btnSecondary} onClick={() => {
                        setIsSuccess(false);
                        setSelectedProduct(null);
                        setReviewForm({ rating: 5, title: '', content: '', images: [] });
                    }}>Review another product from this order</button>
                    <Link href="/" className={styles.btnPrimaryLink}>Return Home</Link>
                </div>
            </div>
        </div>
    );

    if (!isVerified) return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyCard}>
                <div className={styles.header}>
                    <img src="/logo/logo.png" alt="Kalsa Foods" className={styles.logo} />
                    <h1>Write a Product Review</h1>
                    <p>Share your authentic experience with Kalsa Spices.</p>
                </div>
                
                <form onSubmit={handleVerify} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Order ID (e.g., KF-A1B2C3D4)</label>
                        <div className={styles.inputWrapper}>
                            <ShoppingBag className={styles.icon} size={20} />
                            <input 
                                type="text" 
                                placeholder="Enter Order ID" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>

                    <div className={styles.orDivider}><span>OR</span></div>

                    <div className={styles.formGroup}>
                        <label>Registered Mobile Number</label>
                        <div className={styles.inputWrapper}>
                            <Search className={styles.icon} size={20} />
                            <input 
                                type="tel" 
                                placeholder="Enter 10-digit mobile number" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                        </div>
                    </div>

                    {verificationError && <p className={styles.errorMsg}>{verificationError}</p>}

                    <button 
                        type="submit" 
                        disabled={isVerifying || (!orderId && !phone)} 
                        className={styles.verifyBtn}
                    >
                        {isVerifying ? <Loader2 className="animate-spin" /> : 'Continue to Review'}
                    </button>
                </form>
                
                <p className={styles.footerNote}>
                    Only customers with <strong>Delivered</strong> orders can write a "Verified Purchase" review.
                </p>
            </div>
        </div>
    );

    if (isVerified && !selectedProduct) return (
        <div className={styles.productSelectContainer}>
            <div className={styles.card}>
                <h1>Which product do you want to review?</h1>
                <p>Order: {orderId} | {orderData.customerName}</p>
                
                <div className={styles.productList}>
                    {orderData?.products?.map((p: any) => (
                        <div key={p.id} className={styles.productItem} onClick={() => setSelectedProduct(p)}>
                            <img src={p.image || '/logo/logo.png'} alt={p.name} />
                            <div className={styles.productInfo}>
                                <h3>{p.name}</h3>
                                <p>Tap to write a review</p>
                            </div>
                            <button className={styles.selectBtn}>Review Product</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.reviewFormContainer}>
            <div className={styles.formCard}>
                <button className={styles.backBtn} onClick={() => setSelectedProduct(null)}>← Back to Products</button>
                
                <div className={styles.productHeader}>
                    <img src={selectedProduct.image || '/logo/logo.png'} alt={selectedProduct.name} />
                    <div>
                        <h1>Reviewing {selectedProduct.name}</h1>
                        <p>Verified Purchase</p>
                    </div>
                </div>

                <form onSubmit={submitReview}>
                    <div className={styles.starSection}>
                        <label>Overall Rating</label>
                        <div className={styles.starRating}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                    key={s} 
                                    size={42} 
                                    className={`${styles.star} ${(hover || reviewForm.rating) >= s ? styles.filled : ''}`}
                                    onMouseEnter={() => setHover(s)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                                />
                            ))}
                        </div>
                        <div className={styles.ratingText}>
                            {getStarLabel(hover || reviewForm.rating)}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Add a Headline</label>
                        <input 
                            type="text" 
                            placeholder="What's most important to know?"
                            value={reviewForm.title}
                            onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Write your review</label>
                        <textarea 
                            rows={6}
                            placeholder="Tell us about the flavor, aroma, and your overall experience..."
                            value={reviewForm.content}
                            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className={styles.uploadSection}>
                        <label>Add Photos (Optional)</label>
                        
                        {reviewForm.images.length > 0 && (
                            <div className={styles.previewGrid}>
                                {reviewForm.images.map((img, i) => (
                                    <div key={i} className={styles.previewItem}>
                                        <img src={img} alt="review-preview" />
                                        <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                            <Upload size={30} />
                            <p>Tap to upload your food or product photos</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                multiple 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <span className={styles.uploadInfo}>Note: Pictures speak louder than words!</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className={styles.submitBtn}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function SubmitReviewPage() {
    return (
        <Suspense fallback={
            <div className={styles.verifyContainer}>
                <div className={styles.verifyCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#224b33" />
                </div>
            </div>
        }>
            <ReviewFormContent />
        </Suspense>
    );
}
