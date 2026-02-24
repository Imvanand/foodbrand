"use client";

import React, { useState, useEffect } from 'react';
import styles from './AnnouncementBar.module.css';
import { ChevronLeft, ChevronRight, Instagram, Youtube } from 'lucide-react';

const announcements = [
    "🚀 Launch Offer: Flat 50% OFF | Limited Time Only",
    "Inspired by Home-Cooked Traditions",
    "One Masala. Multiple Dishes. Endless Flavor.",
    "No Added Colors | Pure & Authentic Taste"
];

const AnnouncementBar = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.bar}>
            <div className={`${styles.container} container`}>
                <div className={styles.controls}>
                    <button onClick={() => setIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}>
                        <ChevronLeft size={14} />
                    </button>
                    <div className={styles.content}>
                        <p>{announcements[index]}</p>
                    </div>
                    <button onClick={() => setIndex((prev) => (prev + 1) % announcements.length)}>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className={styles.socials}>
                <a href="https://www.instagram.com/kalsafoods" target="_blank" rel="noopener noreferrer"><Instagram size={14} /></a>
                <a href="https://www.youtube.com/@Vivekandpreeti" target="_blank" rel="noopener noreferrer"><Youtube size={14} /></a>
            </div>
        </div>
    );
};

export default AnnouncementBar;
