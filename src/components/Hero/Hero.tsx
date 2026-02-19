"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                <Image
                    src="/hero-bg.png"
                    alt="Organic Farm Fresh Products"
                    fill
                    priority
                    className={styles.bgImage}
                />
                <div className={styles.overlay}></div>
            </div>

            <div className={`${styles.content} container`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={styles.textWrapper}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className={styles.subtitle}
                    >
                        100% CERTIFIED ORGANIC
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Purity In Every <br /> <span>Bite, Naturally.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        Bringing you the finest selection of farm-fresh organic pulses,
                        spices, and grains. Sustainably grown, ethically sourced.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className={styles.cta}
                    >
                        <a href="/collections/all" className="btn btn-primary">Shop Now</a>
                        <a href="/our-story" className="btn btn-secondary">Our Story</a>
                    </motion.div>
                </motion.div>
            </div>

            <div className={styles.scrollDown}>
                <div className={styles.mouse}></div>
            </div>
        </section>
    );
};

export default Hero;
