import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './RecipePage.module.css';

import { recipes } from '@/data/recipes';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const recipe = recipes.find(r => r.slug === slug);

    if (!recipe) return { title: 'Recipe Not Found' };

    return {
        title: `${recipe.title} Recipe`,
        description: recipe.summary,
        alternates: {
            canonical: `/recipes/${slug}`,
        },
        openGraph: {
            title: recipe.title,
            description: recipe.summary,
            images: [{ url: recipe.image }],
        }
    };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const recipe = recipes.find(r => r.slug === slug);

    if (!recipe) {
        return (
            <main>
                <Navbar />
                <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                    <h1>Recipe Not Found</h1>
                    <Link href="/" className="btn btn-primary">Back to Home</Link>
                </div>
                <Footer />
            </main>
        );
    }

    const recipeJsonLd = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": recipe.title,
        "image": recipe.image,
        "description": recipe.summary,
        "recipeIngredient": recipe.ingredients,
        "recipeInstructions": recipe.steps.map(step => ({
            "@type": "HowToStep",
            "text": step
        })),
        "author": {
            "@type": "Person",
            "name": recipe.author
        },
        "datePublished": recipe.date,
        "prepTime": `PT${recipe.prepTime.replace(' mins', 'M')}`,
        "cookTime": `PT${recipe.cookTime.replace(' mins', 'M')}`,
        "recipeYield": recipe.servings
    };

    return (
        <main className={styles.main}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
            />
            <Navbar />

            <div className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <Image src={recipe.image} alt={recipe.title} fill className={styles.heroImage} />
                <div className={`${styles.heroContent} container`}>
                    <Link href="/" className={styles.backLink}>← Back to Home</Link>
                    <span className={styles.badge}>{recipe.author} • {recipe.date}</span>
                    <h1>{recipe.title}</h1>
                    <div className={styles.recipeMeta}>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Prep</span>
                            <span className={styles.value}>{recipe.prepTime}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Cook</span>
                            <span className={styles.value}>{recipe.cookTime}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Yields</span>
                            <span className={styles.value}>{recipe.servings}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.label}>Difficulty</span>
                            <span className={styles.value}>{recipe.difficulty}</span>
                        </div>
                    </div>
                </div>
            </div>

            <section className={styles.contentSection}>
                <div className="container">
                    <div className={styles.contentGrid}>
                        <div className={styles.mainContent}>
                            <div className={styles.description}>
                                <h2>The Story</h2>
                                <p>{recipe.description}</p>
                            </div>

                            <div className={styles.instructions}>
                                <h2>How to Prepare</h2>
                                <div className={styles.stepList}>
                                    {recipe.steps.map((step: string, idx: number) => (
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
                                <h3>Ingredients</h3>
                                <ul className={styles.ingredientList}>
                                    {recipe.ingredients.map((ingredient: string, idx: number) => (
                                        <li key={idx}>
                                            <span className={styles.bullet}>🌱</span>
                                            {ingredient}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.promoCard}>
                                <h4>Shop Organic Ingredients</h4>
                                <p>Get the same pure quality used in this recipe.</p>
                                <button className="btn btn-primary">Shop Now</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
