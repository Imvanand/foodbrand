'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './our-story.module.css';

const revealVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function OurStory() {
    return (
        <main className={styles.main}>
            <Navbar />

            {/* Hero Section */}
            <section className={styles.hero}>
                <Image
                    src="/hero-bg.png"
                    alt="Our Story"
                    fill
                    priority
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <motion.span
                        initial="hidden"
                        animate="visible"
                        variants={revealVariant}
                        className={styles.heroBadge}
                    >
                        Established 2026
                    </motion.span>
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={revealVariant}
                        className={styles.title}
                    >
                        From an Idea in Our Home to a Brand We Believe In
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={revealVariant}
                        className={styles.heroSubtitle}
                    >
                        Discover the heart and soul behind Kalsa Foods — a journey of purity, honesty, and family.
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.section}>
                <div className={styles.container}>

                    {/* The Beginning */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🌿</div>
                            <h2 className={styles.blockTitle}>The Beginning</h2>
                        </div>
                        <p className={styles.paragraph}>
                            Every brand starts with a product. Ours started with a problem.
                        </p>
                        <p className={styles.paragraph}>
                            We were searching for something simple — a product that was pure, honest, and made with care. But every time we looked around, we found the same thing: Overpriced products, unnecessary chemicals, and zero emotional connection.
                        </p>
                        <div className={styles.quote}>
                            “Why can’t we create something better ourselves?”
                        </div>
                    </motion.div>

                    {/* The Idea */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>💡</div>
                            <h2 className={styles.blockTitle}>The Idea</h2>
                        </div>
                        <p className={styles.paragraph}>
                            It didn’t begin in a big office. It began in our home.
                        </p>
                        <p className={styles.paragraph}>
                            Between daily work, kitchen experiments, and late-night discussions, we started researching — ingredients, sourcing, packaging, branding, everything.
                        </p>
                        <p className={styles.paragraph}>
                            We didn’t want to just launch a product. We wanted to build something we could proudly use ourselves and recommend to our family. That thought changed everything.
                        </p>
                    </motion.div>

                    {/* The Journey */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🛠️</div>
                            <h2 className={styles.blockTitle}>The Journey</h2>
                        </div>
                        <p className={styles.paragraph}>
                            There were challenges that tested our resolve:
                        </p>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>Finding the right raw materials</li>
                            <li className={styles.listItem}>Testing samples again and again</li>
                            <li className={styles.listItem}>Designing packaging that reflects our values</li>
                            <li className={styles.listItem}>Understanding compliance and manufacturing</li>
                            <li className={styles.listItem}>Learning branding and website development from scratch</li>
                        </ul>
                        <p className={`${styles.paragraph} ${styles.topMargin}`}>
                            Many times we felt stuck. But every setback made us more clear and more determined. We weren’t just building a product. We were building our dream.
                        </p>
                    </motion.div>

                    {/* The Launch */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🚀</div>
                            <h2 className={styles.blockTitle}>The Launch</h2>
                        </div>
                        <p className={styles.paragraph}>
                            The day we held our final product in our hands, it felt unreal. Months of effort, countless discussions, and multiple redesigns finally came together.
                        </p>
                        <p className={styles.paragraph}>
                            Launching wasn’t just about selling. It was about sharing our belief with the world.
                        </p>
                    </motion.div>

                    {/* Values */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>❤️</div>
                            <h2 className={styles.blockTitle}>What We Stand For</h2>
                        </div>
                        <div className={styles.valuesGrid}>
                            <motion.div variants={revealVariant} className={styles.valueCard}>
                                <h4>Quality Over Shortcuts</h4>
                                <p>We never compromise on purity for the sake of speed or cost. Every grain and spice is tested for excellence.</p>
                            </motion.div>
                            <motion.div variants={revealVariant} className={styles.valueCard}>
                                <h4>Transparency</h4>
                                <p>No marketing gimmicks. We believe in being honest about our sourcing and processes.</p>
                            </motion.div>
                            <motion.div variants={revealVariant} className={styles.valueCard}>
                                <h4>Trust Over Profit</h4>
                                <p>Building a lasting relationship with our customers is more important than quick financial gains.</p>
                            </motion.div>
                            <motion.div variants={revealVariant} className={styles.valueCard}>
                                <h4>Continuous Improvement</h4>
                                <p>We are constantly learning and refining our products to ensure you get nothing but the best.</p>
                            </motion.div>
                        </div>
                        <p className={`${styles.paragraph} ${styles.topMargin}`} style={{ marginTop: '40px' }}>
                            We believe a brand should feel personal. When you use our product, you are not just buying something — you are becoming part of our journey.
                        </p>
                    </motion.div>

                </div>
            </section>

            {/* Closing Section */}
            <section className={styles.closing}>
                <div className={styles.container}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={revealVariant}
                    >
                        <h2>This Is Just the Beginning</h2>
                        <p>
                            We started small, but our vision is big. To stay honest, stay grounded, and build this brand together with you.
                        </p>
                        <Link href="/#our-product" className={styles.cta}>
                            Explore Our Products
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
