"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroSlider.module.css';
import { getSliderImages } from '@/lib/actions';

const HeroSlider = () => {
    const [images, setImages] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchImages = async () => {
            const fetchedImages = await getSliderImages();
            if (fetchedImages.length > 0) {
                setImages(fetchedImages);
            }
        };
        fetchImages();
    }, []);

    const slideNext = useCallback(() => {
        if (images.length === 0) return;
        setDirection(1);
        setCurrent((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const slidePrev = useCallback(() => {
        if (images.length === 0) return;
        setDirection(-1);
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (images.length > 1) {
            const timer = setInterval(slideNext, 6000);
            return () => clearInterval(timer);
        }
    }, [slideNext, images.length]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    if (!mounted || images.length === 0) return null;

    return (
        <section className={styles.sliderContainer}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className={styles.slide}
                >
                    <Image
                        src={images[current]}
                        alt={`Slide ${current + 1}`}
                        fill
                        priority
                        className={styles.image}
                        style={{ objectFit: 'cover' }}
                    />
                </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
                <>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={slidePrev}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={slideNext}>
                        <ChevronRight size={24} />
                    </button>

                    <div className={styles.dots}>
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`${styles.dot} ${idx === current ? styles.active : ''}`}
                                onClick={() => {
                                    setDirection(idx > current ? 1 : -1);
                                    setCurrent(idx);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default HeroSlider;
