'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './our-story.module.css';
import { useLanguage } from '@/context/LanguageContext';

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
    const { lang } = useLanguage();

    const content = {
        hi: {
            heroBadge: "Established 2026",
            heroTitle: "Kalsa - Do Maa ka pyar, Har kitchen ke liye",
            heroSubtitle: "From a humble home kitchen to a brand dedicated to bringing the authentic taste of home to every household.",
            journey: {
                title: "The Journey",
                p1: "Har bade sapne ki shuruaat ek chhote se idea se hoti hai. Humari journey bhi kuch aisi hi hai.",
                p2: "Shaadi ke baad se hi hum dono ka ek dream tha — life me kuch apna create karna. Isi dream ko follow karte hue 2024 me humne apna cloud kitchen start kiya aur apne food ko Zomato aur Swiggy par list kiya.",
                p3: "Hume customers se bahut hi amazing response mila. Logon ko humara khana itna pasand aaya ki aaj humari 4.8+ rating hai aur bahut saare beautiful reviews bhi mile.",
                quote: "“Taste bilkul ghar jaisa hai.”",
                p4: "Aur wahi se ek naya thought shuru hua — kyun na is ghar ke taste ko aur zyada logon tak pahunchaya jaye?"
            },
            secret: {
                title: "The Secret Behind the Taste",
                p1: "Log aksar puchte the ki humare khane me ghar jaisa taste kaise aata hai.",
                p2: "Sach ye hai ki uske peeche ek secret hai — meri mummy ke haath ka bana hua special spice mix.",
                p3: "Mere liye ye sirf ek masala nahi hai, ye ek emotion hai. Jab meri nayi-nayi shaadi hui thi, tab mujhe cooking bilkul nahi aati thi. Mujhe bahut dar lagta tha ki kaise khana banaungi, kaun sa masala kitna daalna hai, aur agar khana accha nahi bana to kya hoga.",
                p4: "Tab meri mummy ne mujhe ek simple sa solution diya — ghar ka bana hua spice mix.",
                quote: "“Onion, ginger-garlic paste, ye masala, thodi haldi aur namak… aur bas. Koi bhi dish ho, veg ho ya non-veg — khana tasty ban jayega.”",
                p5: "Aur sach me us din se cooking mere liye difficult nahi, easy aur enjoyable ho gayi."
            },
            fromKitchen: {
                title: "From Home Kitchen to KALSA",
                p1: "Aaj meri shaadi ko 4 saal ho chuke hain, aur aaj bhi meri mummy mere liye ye spice mix banakar bhejti hain. Shayad isi wajah se mere haath ke khane ke sab deewane ho gaye — chahe wo ghar par ho ya hamare cloud kitchen ke customers.",
                p2: "Tab hume laga — kyun na isi masale ke through ghar ka taste har ghar tak pahunchaya jaye.",
                p3: "Aur yahin se KALSA ka idea janma."
            },
            nameOrigin: {
                title: "Why the Name KALSA",
                p1: "Hamare brand ka naam KALSA hamare liye bahut special hai.",
                p2: "Ye naam bana hai humari dono maaon ke initials se — meri mummy aur meri mother-in-law.",
                p3: "Isliye KALSA sirf ek brand nahi hai, ye do maaon ke pyaar, experience aur ghar ke asli taste ka symbol hai."
            },
            mission: {
                title: "Our Mission",
                p1: "Humara mission simple hai:",
                items: [
                    "✨ Cooking ko easy aur stress-free banana",
                    "✨ Har ghar tak authentic homemade taste pahunchana",
                    "✨ Aur logon ko ghar jaisa khana banana aur khilana aur bhi simple banana"
                ]
            },
            whyChoose: {
                title: "Why Choose KALSA",
                items: [
                    { title: "1. Authentic Homemade Taste", desc: "KALSA spice mix ghar ke traditional recipe se bana hai, jo khane ko bilkul homemade taste deta hai." },
                    { title: "2. Cooking Made Easy", desc: "Ab alag-alag masalon ka confusion nahi. Bas onion, ginger-garlic paste, KALSA spice mix, haldi aur namak — aur tasty khana ready." },
                    { title: "3. Perfect for Veg & Non-Veg", desc: "Daily sabzi ho ya special dish, veg ho ya non-veg, KALSA har recipe me perfectly work karta hai." },
                    { title: "4. Made with Love & Experience", desc: "Ye spice mix do maaon ke experience aur pyaar se inspired hai, isliye iska taste aur quality special hai." },
                    { title: "5. Consistent Taste Every Time", desc: "Har baar khana same delicious taste ke saath banega — bina kisi guesswork ke." }
                ]
            },
            closing: {
                h2: "KALSA – Do maaon ka pyaar, har recipe me.",
                p: "Experience the authentic taste of home with every meal you cook."
            }
        },
        en: {
            heroBadge: "Established 2026",
            heroTitle: "KALSA – The Love of Two Mothers, in Every Kitchen",
            heroSubtitle: "From a humble home kitchen to a brand dedicated to bringing the authentic taste of home to every household.",
            journey: {
                title: "The Journey",
                p1: "Every great dream begins with a small idea. Our journey is no different.",
                p2: "Ever since we got married, we both had a dream — to create something of our own. Following this dream, we started our cloud kitchen in 2024 and listed our food on Zomato and Swiggy.",
                p3: "We received an amazing response from our customers. People loved our food so much that today we have a 4.8+ rating and many beautiful reviews.",
                quote: "“The taste is exactly like home.”",
                p4: "And that's where a new thought began — why not bring this taste of home to even more people?"
            },
            secret: {
                title: "The Secret Behind the Taste",
                p1: "People often asked how our food gets that homemade taste.",
                p2: "The truth is, there’s a secret behind it — my mother’s specially handcrafted spice mix.",
                p3: "For me, this isn’t just a spice mix; it’s an emotion. When I was a newlywed, I didn't know how to cook at all. I was scared of how I would manage, which spice to use, and what if the food didn't turn out well.",
                p4: "That’s when my mother gave me a simple solution — her homemade spice mix.",
                quote: "“Onion, ginger-garlic paste, this spice mix, a little turmeric and salt… and that’s it. Any dish, veg or non-veg — it will be delicious.”",
                p5: "And truly, from that day on, cooking became easy and enjoyable rather than a struggle."
            },
            fromKitchen: {
                title: "From Home Kitchen to KALSA",
                p1: "It has been 4 years since my marriage, and even today, my mother sends this spice mix for me. Perhaps that's why everyone became a fan of my cooking — whether at home or our cloud kitchen customers.",
                p2: "That's when we thought — why not bring the taste of home to every household through this spice mix?",
                p3: "And thus, the idea of KALSA was born."
            },
            nameOrigin: {
                title: "Why the Name KALSA",
                p1: "The name of our brand, KALSA, is very special to us.",
                p2: "This name is formed from the initials of both our mothers — my mother and my mother-in-law.",
                p3: "Therefore, KALSA is not just a brand; it is a symbol of the love, experience, and authentic taste of home from two mothers."
            },
            mission: {
                title: "Our Mission",
                p1: "Our mission is simple:",
                items: [
                    "✨ Making cooking easy and stress-free",
                    "✨ Bringing authentic homemade taste to every home",
                    "✨ Making it simple for people to cook and eat like home"
                ]
            },
            whyChoose: {
                title: "Why Choose KALSA",
                items: [
                    { title: "1. Authentic Homemade Taste", desc: "KALSA spice mix is made from traditional home recipes, giving your food that perfect homemade taste." },
                    { title: "2. Cooking Made Easy", desc: "No more confusion over multiple spices. Just onion, ginger-garlic paste, KALSA spice mix, turmeric, and salt — and tasty food is ready." },
                    { title: "3. Perfect for Veg & Non-Veg", desc: "Whether it's a daily vegetable dish or a special non-veg preparation, KALSA works perfectly in every recipe." },
                    { title: "4. Made with Love & Experience", desc: "This spice mix is inspired by the experience and love of two mothers, which is why its taste and quality are special." },
                    { title: "5. Consistent Taste Every Time", desc: "Every time you cook, your food will have the same delicious taste — without any guesswork." }
                ]
            },
            closing: {
                h2: "KALSA – The love of two mothers, in every recipe.",
                p: "Experience the authentic taste of home with every meal you cook."
            }
        }
    };

    const t = content[lang as keyof typeof content] || content.hi;

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
                        {t.heroBadge}
                    </motion.span>
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={revealVariant}
                        className={styles.title}
                    >
                        {t.heroTitle}
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={revealVariant}
                        className={styles.heroSubtitle}
                    >
                        {t.heroSubtitle}
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className={styles.section}>
                <div className={styles.container}>

                    {/* The Beginning */}
                    <motion.div
                        key={`journey-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>✨</div>
                            <h2 className={styles.blockTitle}>{t.journey.title}</h2>
                        </div>
                        <p className={styles.paragraph}>{t.journey.p1}</p>
                        <p className={styles.paragraph}>{t.journey.p2}</p>
                        <p className={styles.paragraph}>{t.journey.p3}</p>
                        <div className={styles.quote}>{t.journey.quote}</div>
                        <p className={styles.paragraph}>{t.journey.p4}</p>
                    </motion.div>

                    {/* YouTube Video Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.videoContainer}
                    >
                        <div className={styles.videoWrapper}>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/3_bI07wA9Hw?si=ka23KL0_zFw61dzS"
                                title="KALSA Story"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* The Secret Behind the Taste */}
                    <motion.div
                        key={`secret-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🤫</div>
                            <h2 className={styles.blockTitle}>{t.secret.title}</h2>
                        </div>
                        <p className={styles.paragraph}>{t.secret.p1}</p>
                        <p className={styles.paragraph}>{t.secret.p2}</p>
                        <p className={styles.paragraph}>{t.secret.p3}</p>
                        <p className={styles.paragraph}>{t.secret.p4}</p>
                        <div className={styles.quote}>{t.secret.quote}</div>
                        <p className={styles.paragraph}>{t.secret.p5}</p>
                    </motion.div>

                    {/* From Home Kitchen to KALSA */}
                    <motion.div
                        key={`kitchen-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🍳</div>
                            <h2 className={styles.blockTitle}>{t.fromKitchen.title}</h2>
                        </div>
                        <p className={styles.paragraph}>{t.fromKitchen.p1}</p>
                        <p className={styles.paragraph}>{t.fromKitchen.p2}</p>
                        <p className={styles.paragraph}>{t.fromKitchen.p3}</p>
                    </motion.div>

                    {/* Why the Name KALSA */}
                    <motion.div
                        key={`name-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>❤️</div>
                            <h2 className={styles.blockTitle}>{t.nameOrigin.title}</h2>
                        </div>
                        <p className={styles.paragraph}>{t.nameOrigin.p1}</p>
                        <p className={styles.paragraph}>{t.nameOrigin.p2}</p>
                        <p className={styles.paragraph}>{t.nameOrigin.p3}</p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        key={`mission-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={revealVariant}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🎯</div>
                            <h2 className={styles.blockTitle}>{t.mission.title}</h2>
                        </div>
                        <p className={styles.paragraph}>{t.mission.p1}</p>
                        <ul className={styles.list}>
                            {t.mission.items.map((item: string, index: number) => (
                                <li key={index} className={styles.listItem}>{item}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Why Choose KALSA */}
                    <motion.div
                        key={`choose-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className={styles.storyBlock}
                    >
                        <div className={styles.blockHeader}>
                            <div className={styles.iconWrapper}>🏆</div>
                            <h2 className={styles.blockTitle}>{t.whyChoose.title}</h2>
                        </div>
                        <div className={styles.valuesGrid}>
                            {t.whyChoose.items.map((item: any, index: number) => (
                                <motion.div key={index} variants={revealVariant} className={styles.valueCard}>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Closing Section */}
            <section className={styles.closing}>
                <div className={styles.container}>
                    <motion.div
                        key={`closing-${lang}`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={revealVariant}
                    >
                        <h2>{t.closing.h2}</h2>
                        <p>{t.closing.p}</p>
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
