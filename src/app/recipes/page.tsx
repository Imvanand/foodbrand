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

export default function Recipes() {
    const [activeCategory, setActiveCategory] = useState('All');

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
                    <h1 className={styles.title}>Our Recipe Collection</h1>
                    <p className={styles.subtitle}>
                        Discover delicious, healthy, and easy-to-make recipes using our premium organic ingredients.
                    </p>
                </div>
            </section>

            <div className={`container ${styles.container}`}>
                {/* Filters */}
                <div className={styles.filters}>
                    {categories.map(category => (
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
                                    <span className={styles.categoryBadge}>{recipe.category}</span>
                                    {/* Using next/image requires width/height or 'fill' */}
                                    {/* 'fill' needs parent to have position relative, which imageWrapper does */}
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
                                            {recipe.difficulty}
                                        </span>
                                        <span className={styles.servings}>
                                            <Users size={14} style={{ marginRight: 4 }} />
                                            {recipe.servings} Servings
                                        </span>
                                    </div>

                                    <h3 className={styles.cardTitle}>{recipe.title}</h3>
                                    <p className={styles.snippet}>{recipe.summary}</p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.prepTime}>
                                            <Clock size={16} />
                                            <span>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins</span>
                                        </div>
                                        <span className={styles.viewLink}>
                                            View Recipe <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <h3>No recipes found in this category yet.</h3>
                        <p>Check back soon for new additions!</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
