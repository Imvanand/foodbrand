"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './RecipesSection.module.css';

import { recipes } from '@/data/recipes';

const displayRecipes = recipes.slice(0, 3);

import { useLanguage } from '@/context/LanguageContext';

const RecipesSection = () => {
    const { lang } = useLanguage();

    const t = {
        en: {
            badge: "FROM OUR KITCHEN",
            title: "Kalsa Organic Recipes",
            desc: "Discover healthy and delicious ways to use our organic products.",
            readBtn: "Read Recipe",
            viewAll: "View All Recipes",
            fullRecipe: "Full Recipe →"
        },
        hi: {
            badge: "हमारी रसोई से",
            title: "कालसा ऑर्गेनिक रेसिपी",
            desc: "हमारे ऑर्गेनिक उत्पादों का उपयोग करने के स्वस्थ और स्वादिष्ट तरीके खोजें।",
            readBtn: "रेसिपी पढ़ें",
            viewAll: "सभी रेसिपी देखें",
            fullRecipe: "पूरी रेसिपी →"
        }
    }[lang];

    return (
        <section className={styles.recipesSection}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.badge}>{t.badge}</span>
                    <h2>{t.title}</h2>
                    <p>{t.desc}</p>
                </div>

                <div className={styles.grid}>
                    {displayRecipes.map((recipe) => (
                        <Link href={`/recipes/${recipe.slug}`} key={recipe.id} className={styles.recipeCard}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={recipe.image}
                                    alt={recipe.title}
                                    fill
                                    className={styles.recipeImage}
                                />
                                <div className={styles.overlay}>
                                    <span>{t.readBtn}</span>
                                </div>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.meta}>
                                    <span className={styles.author}>{recipe.author}</span>
                                    <span className={styles.separator}>•</span>
                                    <span className={styles.date}>{recipe.date}</span>
                                </div>
                                <h3 className={styles.title}>
                                    {lang === 'hi' && recipe.titleHi ? recipe.titleHi : recipe.title}
                                </h3>
                                <p className={styles.snippet}>
                                    {lang === 'hi' && recipe.summaryHi ? recipe.summaryHi : recipe.summary}
                                </p>
                                <span className={styles.readMore}>{t.fullRecipe}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href="/recipes" className="btn btn-secondary">
                        {t.viewAll}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecipesSection;
