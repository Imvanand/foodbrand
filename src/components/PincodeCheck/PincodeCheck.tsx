'use client';

import React, { useState } from 'react';
import { MapPin, Truck, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PincodeCheck.module.css';
import { useLanguage } from '@/context/LanguageContext';

const PincodeCheck = () => {
    const { lang } = useLanguage();
    const [pincode, setPincode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const checkPincode = async () => {
        if (pincode.length !== 6) return;
        
        setIsLoading(true);
        setResult(null);
        
        try {
            const response = await fetch(`/api/shipping/check-pincode?pincode=${pincode}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ status: 'error', message: 'Something went wrong' });
        } finally {
            setIsLoading(false);
        }
    };

    const t = {
        en: {
            title: "Check Delivery",
            placeholder: "Enter Pincode",
            button: "Check",
            available: "Delivery Available",
            notAvailable: "Not Available",
            est: "Estimated delivery in",
            days: "days"
        },
        hi: {
            title: "डिलीवरी चेक करें",
            placeholder: "पिनकोड दर्ज करें",
            button: "चेक करें",
            available: "डिलीवरी उपलब्ध है",
            notAvailable: "उपलब्ध नहीं है",
            est: "अनुमानित डिलीवरी",
            days: "दिनों में"
        }
    }[lang];

    return (
        <div className={styles.pincodeWrapper}>
            <div className={styles.title}>
                <MapPin size={18} color="#e47911" />
                <span>{t.title}</span>
            </div>
            
            <div className={styles.inputArea}>
                <input
                    type="text"
                    maxLength={6}
                    placeholder={t.placeholder}
                    className={styles.input}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    onKeyPress={(e) => e.key === 'Enter' && checkPincode()}
                />
                <button 
                    className={styles.checkBtn} 
                    onClick={checkPincode}
                    disabled={isLoading || pincode.length !== 6}
                >
                    {isLoading ? <Loader2 size={16} className={styles.spinner} /> : t.button}
                </button>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.result} ${result.isServiceable ? styles.serviceable : styles.notServiceable}`}
                    >
                        {result.isServiceable ? (
                            <>
                                <CheckCircle2 size={16} />
                                <div>
                                    <span style={{ display: 'block' }}>{result.message || t.available}</span>
                                    {result.estimatedDeliveryDays && (
                                        <small className={styles.deliveryInfo}>
                                            {t.est} {result.estimatedDeliveryDays} {t.days}
                                        </small>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle size={16} />
                                <span>{result.message || t.notAvailable}</span>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PincodeCheck;
