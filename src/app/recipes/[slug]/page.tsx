"use client";

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './RecipePage.module.css';
import { useLanguage } from '@/context/LanguageContext';

import { recipes } from '@/data/recipes';

export default function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { lang } = useLanguage();

    const recipe = recipes.find(r => r.slug === slug);

    const ui = {
        en: {
            back: "← Back to Home",
            prep: "Prep",
            cook: "Cook",
            yields: "Yields",
            difficulty: "Difficulty",
            story: "The Story",
            howTo: "How to Prepare",
            ingredients: "Ingredients",
            shopTitle: "Shop Organic Ingredients",
            shopDesc: "Get the same pure quality used in this recipe.",
            shopBtn: "Shop Now",
            notFound: "Recipe Not Found",
            backBtn: "Back to Home"
        },
        hi: {
            back: "← होम पर वापस जाएं",
            prep: "तैयारी",
            cook: "पकने का समय",
            yields: "कितने लोगों के लिए",
            difficulty: "कठिनाई",
            story: "कहानी",
            howTo: "बनाने की विधि",
            ingredients: "सामग्री",
            shopTitle: "ऑर्गेनिक सामग्री खरीदें",
            shopDesc: "वही शुद्ध क्वालिटी पाएं जो इस रेसिपी में इस्तेमाल की गई है।",
            shopBtn: "अभी खरीदें",
            notFound: "रेसिपी नहीं मिली",
            backBtn: "होम पर वापस"
        }
    }[lang];

    if (!recipe) {
        return (
            <main>
                <Navbar />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h1>{ui.notFound}</h1>
                    <Link href="/" className="btn btn-primary">{ui.backBtn}</Link>
                </div>
                <Footer />
            </main>
        );
    }

    const displayTitle = lang === 'hi' && recipe.titleHi ? recipe.titleHi : recipe.title;
    const displayDesc = lang === 'hi' && recipe.descriptionHi ? recipe.descriptionHi : recipe.description;
    const displayIngredients = lang === 'hi' && recipe.ingredientsHi ? recipe.ingredientsHi : recipe.ingredients;
    const displaySteps = lang === 'hi' && recipe.stepsHi ? recipe.stepsHi : recipe.steps;
    const displayDifficulty = lang === 'hi' && recipe.difficultyHi ? recipe.difficultyHi : recipe.difficulty;

    return (
        <main className={styles.main}>
            <Navbar />

            <div className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <Image src={recipe.image} alt={recipe.title} fill className={styles.heroImage} />
                <div className={`${styles.heroContent} container`}>
                    <Link href="/recipes" className={styles.backLink}>{ui.back}</Link>
                    <span className={styles.badge}>{recipe.author} • {recipe.date}</span>
                    <h1>{displayTitle}</h1>
                    <div className={styles.recipeMeta}>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>{ui.prep}</span>
                            <span className={styles.value}>{recipe.prepTime}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>{ui.cook}</span>
                            <span className={styles.value}>{recipe.cookTime}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>{ui.yields}</span>
                            <span className={styles.value}>{recipe.servings}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>{ui.difficulty}</span>
                            <span className={styles.value}>{displayDifficulty}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.contentGrid}>
                        <div className={styles.mainContent}>
                            <div className={styles.description}>
                                <h2>{ui.story}</h2>
                                <p>{displayDesc}</p>
                            </div>

                            <div className={styles.instructions}>
                                <h2>{ui.howTo}</h2>
                                <div className={styles.stepList}>
                                    {displaySteps.map((step: string, idx: number) => (
                                        <div key={idx} className={styles.stepItem}>
                                            <span className={styles.stepNumber}>{idx + 1}</span>
                                            <p>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className={styles.sidebar}>
                            <div className={styles.ingredientsBox}>
                                <h3>{ui.ingredients}</h3>
                                <ul className={styles.ingredientList}>
                                    {displayIngredients.map((ingredient: string, idx: number) => (
                                        <li key={idx}>
                                            <span className={styles.bullet}>🌱</span>
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.promoCard}>
                                <h4>{ui.shopTitle}</h4>
                                <p>{ui.shopDesc}</p>
                                <button className="btn btn-primary">{ui.shopBtn}</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
