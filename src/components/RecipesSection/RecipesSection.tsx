import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './RecipesSection.module.css';

import { recipes } from '@/data/recipes';

const displayRecipes = recipes.slice(0, 3);

const RecipesSection = () => {
    return (
        <section className={styles.recipesSection}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.badge}>FROM OUR KITCHEN</span>
                    <h2>Kalsa Organic Recipes</h2>
                    <p>Discover healthy and delicious ways to use our organic products.</p>
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
                                    <span>Read Recipe</span>
                                </div>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.meta}>
                                    <span className={styles.author}>{recipe.author}</span>
                                    <span className={styles.separator}>•</span>
                                    <span className={styles.date}>{recipe.date}</span>
                                </div>
                                <h3 className={styles.title}>{recipe.title}</h3>
                                <p className={styles.snippet}>{recipe.summary}</p>
                                <span className={styles.readMore}>Full Recipe →</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link href="/recipes" className="btn btn-secondary">
                        View All Recipes
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecipesSection;
