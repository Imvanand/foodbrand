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

const CategoryBar = () => {
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
