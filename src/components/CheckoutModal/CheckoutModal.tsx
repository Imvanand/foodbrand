"use client";

import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';
import { X, MessageCircle } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    quantity: number;
    price: number;
}

const CheckoutModal = ({ isOpen, onClose, productName, quantity, price }: CheckoutModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        pincode: ''
    });

    if (!isOpen) return null;

    const totalPrice = quantity * price;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const rawMessage = `*New Order from Kalsa Foods Website*

*Product:* ${productName}
*Quantity:* ${quantity} packs
*Total Price:* ₹${totalPrice}

*Customer Details:*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Address:* ${formData.address}
*Pincode:* ${formData.pincode}

_Free Delivery Applied_ ✅`;

        const whatsappNumber = "918709438350";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <h2>Order Confirmation</h2>
                    <p>Order direct on WhatsApp for Fast Delivery</p>
                </div>

                <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                        <span>Product</span>
                        <span>{productName}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Quantity</span>
                        <span>{quantity} packs</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Price per pack</span>
                        <span>₹{price}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Total Payable</span>
                        <span>₹{totalPrice}</span>
                    </div>
                    <div className={styles.deliveryTag}>✅ Free Delivery Eligible</div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            required
                            placeholder="Enter your 10 digit number"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Complete Address</label>
                        <textarea
                            required
                            placeholder="House No, Street, Landmark, City"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Pincode</label>
                        <input
                            type="text"
                            required
                            placeholder="6 digit pincode"
                            value={formData.pincode}
                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        <MessageCircle size={20} />
                        Place Order on WhatsApp
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
