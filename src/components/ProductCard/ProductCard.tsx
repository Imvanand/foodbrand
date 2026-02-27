"use client";

import React from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductProps {
    id: number;
    name: string;
    price: number;
    image: string;
    weight: string;
    rating: number;
    isNew?: boolean;
}

const ProductCard = ({ name, price, image, weight, rating, isNew }: ProductProps) => {
    return (
        <div className={styles.card}>
            {isNew && <span className={styles.badge}>NEW</span>}
            <div className={styles.imageWrapper}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className={styles.image}
                />
                <button className={styles.quickAdd}>
                    <ShoppingCart size={18} /> Add to Cart
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            fill={i < rating ? "var(--accent)" : "transparent"}
                            stroke={i < rating ? "var(--accent)" : "#ccc"}
                        />
                    ))}
                    <span className={styles.ratingValue}>({rating})</span>
                </div>
                <h3 className={styles.name}>{name}</h3>
                <span className={styles.weight}>{weight}</span>
                <div className={styles.priceRow}>
                    <span className={styles.price}>₹{price}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
