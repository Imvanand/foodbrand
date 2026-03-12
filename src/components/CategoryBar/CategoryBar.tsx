"use client";

import React from 'react';
import styles from './CategoryBar.module.css';
import { Leaf, Wheat, Coffee, Droplets, Nut, Sparkles, Heart } from 'lucide-react';

const categories = [
    { name: 'Inspired by Generations', Icon: Sparkles },
    { name: 'Premium Whole Spices', Icon: Leaf },
    { name: 'No Artificial Colors', Icon: Droplets },
    { name: 'Authentic Taste', Icon: Wheat },
    { name: 'Maa ka legacy', Icon: Heart },
];

import { useLanguage } from '@/context/LanguageContext';

const CategoryBar = () => {
    const { lang } = useLanguage();

    const categories = [
        {
            name: lang === 'hi' ? 'पीढ़ियों से प्रेरित' : 'Inspired by Generations',
            Icon: Sparkles
        },
        {
            name: lang === 'hi' ? 'प्रीमियम खड़े मसाले' : 'Premium Whole Spices',
            Icon: Leaf
        },
        {
            name: lang === 'hi' ? 'कोई मिलावटी रंग नहीं' : 'No Artificial Colors',
            Icon: Droplets
        },
        {
            name: lang === 'hi' ? 'असली स्वाद' : 'Authentic Taste',
            Icon: Wheat
        },
        {
            name: lang === 'hi' ? 'माँ की विरासत' : 'Maa ka legacy',
            Icon: Heart
        },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.container} container`}>
                {categories.map((cat, index) => (
                    <div key={index} className={styles.categoryItem}>
                        <div className={styles.iconCircle}>
                            <cat.Icon size={24} strokeWidth={1.5} />
                        </div>
                        <span>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;
