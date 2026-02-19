"use client";

import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductSection.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    weight: string;
    rating: number;
    isNew?: boolean;
}

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

const ProductSection = ({ title, subtitle, products }: ProductSectionProps) => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className="section-title">
                    <h2>{title}</h2>
                    {subtitle && <p>{subtitle}</p>}
                </div>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                <div className={styles.viewAll}>
                    <a href="/collections/all" className="btn btn-secondary">View All Products</a>
                </div>
            </div>
        </section>
    );
};

export default ProductSection;
