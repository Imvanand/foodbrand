"use client";

import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity } = useCart();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const freeDeliveryThreshold = 3; 
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const deliveryCharge = 0;
    const finalTotal = subtotal + deliveryCharge;
    const gstAmount = finalTotal - (finalTotal / 1.18); // GST included in price

    if (!isCartOpen) return null;

    return (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <ShoppingBag size={24} color="#224b33" />
                        <h2>Your Cart ({totalItems})</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <ShoppingBag size={60} color="#eee" />
                            <p>Your cart is empty</p>
                            <button onClick={() => setIsCartOpen(false)} className={styles.continueBtn}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className={styles.itemList}>
                            {cart.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.itemImage}>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemInfo}>
                                            <h3>{item.name}</h3>
                                            <p className={styles.price}>₹{item.price}</p>
                                        </div>
                                        <div className={styles.itemActions}>
                                            <div className={styles.quantity}>
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.freeDeliveryBanner}>
                            <p>🎉 Launch Offer: <strong>FREE Delivery</strong> All Over India!</p>
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Items Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>GST (Included)</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Delivery</span>
                                <span className={styles.free}>
                                    FREE
                                </span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Total Payable</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsCartOpen(false)}>
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
