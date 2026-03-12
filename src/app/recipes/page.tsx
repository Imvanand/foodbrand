'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Clock, ChefHat, Users, ArrowRight } from 'lucide-react';
import styles from './recipes.module.css';

import { recipes } from '@/data/recipes';

// Sample Recipe Data
const initialRecipes = recipes;

const categories = ['All', 'Mix Veg', 'Aloo Dum', 'Egg Curry', 'Matar Paneer', 'Chicken Curry'];

import { useLanguage } from '@/context/LanguageContext';

export default function Recipes() {
    const { lang } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('All');

    const ui = {
        en: {
            title: "Our Recipe Collection",
            subtitle: "Discover delicious, healthy, and easy-to-make recipes using our premium organic ingredients.",
            all: "All",
            noFound: "No recipes found in this category yet.",
            checkBack: "Check back soon for new additions!",
            viewRecipe: "View Recipe",
            servings: "Servings",
            mins: "mins"
        },
        hi: {
            title: "हमारी रेसिपी कलेक्शन",
            subtitle: "हमारे प्रीमियम ऑर्गेनिक सामग्री का उपयोग करके स्वादिष्ट, स्वस्थ और बनाने में आसान रेसिपी खोजें।",
            all: "सब",
            noFound: "अभी इस श्रेणी में कोई रेसिपी नहीं मिली।",
            checkBack: "नए अपडेट के लिए बने रहें!",
            viewRecipe: "रेसिपी देखें",
            servings: "लोगों के लिए",
            mins: "मिनट"
        }
    }[lang];

    const filteredRecipes = activeCategory === 'All'
        ? initialRecipes
        : initialRecipes.filter(recipe =>
            recipe.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
        );

    return (
        <main className={styles.pageWrapper}>
            <Navbar />

            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{ui.title}</h1>
                    <p className={styles.subtitle}>
                        {ui.subtitle}
                    </p>
                </div>
            </section>

            <div className={`container ${styles.container}`}>
                {/* Filters */}
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterBtn} ${activeCategory === 'All' ? styles.active : ''}`}
                        onClick={() => setActiveCategory('All')}
                    >
                        {ui.all}
                    </button>
                    {categories.slice(1).map(category => (
                        <button
                            key={category}
                            className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredRecipes.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredRecipes.map((recipe) => (
                            <Link href={`/recipes/${recipe.slug}`} key={recipe.id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <span className={styles.categoryBadge}>
                                        {lang === 'hi' && recipe.categoryHi ? recipe.categoryHi : recipe.category}
                                    </span>
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className={styles.image}
                                    />
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.meta}>
                                        <span className={styles.difficulty}>
                                            <ChefHat size={14} style={{ marginRight: 4 }} />
                                            {lang === 'hi' && recipe.difficultyHi ? recipe.difficultyHi : recipe.difficulty}
                                        </span>
                                        <span className={styles.servings}>
                                            <Users size={14} style={{ marginRight: 4 }} />
                                            {recipe.servings} {ui.servings}
                                        </span>
                                    </div>

                                    <h3 className={styles.cardTitle}>
                                        {lang === 'hi' && recipe.titleHi ? recipe.titleHi : recipe.title}
                                    </h3>
                                    <p className={styles.snippet}>
                                        {lang === 'hi' && recipe.summaryHi ? recipe.summaryHi : recipe.summary}
                                    </p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.prepTime}>
                                            <Clock size={16} />
                                            <span>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} {ui.mins}</span>
                                        </div>
                                        <span className={styles.viewLink}>
                                            {ui.viewRecipe} <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <h3>{ui.noFound}</h3>
                        <p>{ui.checkBack}</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
