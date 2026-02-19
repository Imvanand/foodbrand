'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Send, Star } from 'lucide-react';
import styles from './feedback.module.css';

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'Feedback', // Feedback or Complaint
        orderId: '',
        message: '',
        rating: '5'
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Updated Google Script for Feedback
            // Note: You can reuse the same script but you might want to add columns for Type, OrderId, Rating
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI89o5GH6eBedLdzZmCCQTnOH0MH_t1JDB16dQf5ouoaB4mi__j4bscQl4_cSe8nZQ/exec";

            const params = new URLSearchParams();
            params.append("Name", formData.name);
            params.append("Email", formData.email);
            params.append("Phone", formData.phone);
            params.append("Message", formData.message); // This maps to "Message" column

            // Append extra fields to the message or separate columns if you update the sheet
            // For now, let's append them to the message content to ensure they are captured in existing columns
            // Or we assume you add new columns: Type, OrderId, Rating
            params.append("Type", formData.type);
            params.append("OrderId", formData.orderId);
            params.append("Rating", formData.rating);

            params.append("Date", new Date().toLocaleString());

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
                mode: "no-cors",
            });

            console.log('Feedback submitted');
            setStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                type: 'Feedback',
                orderId: '',
                message: '',
                rating: '5'
            });
            alert("Feedback submitted successfully. Thank you!");

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('error');
            alert("Error submitting feedback. Please try again.");
        }
    };

    return (
        <main className={styles.feedbackPage}>
            <Navbar />

            <div className={`container ${styles.main}`}>
                <header className={styles.header}>
                    <h1 className={styles.title}>We Value Your Feedback</h1>
                    <p className={styles.subtitle}>
                        Your experience matters to us. Whether it's a suggestion, a compliment, or a concern,
                        please let us know so we can serve you better.
                    </p>
                </header>

                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Type of Submission</label>
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Feedback"
                                            checked={formData.type === 'Feedback'}
                                            onChange={handleChange}
                                        />
                                        General Feedback
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Complaint"
                                            checked={formData.type === 'Complaint'}
                                            onChange={handleChange}
                                        />
                                        Complaint / Issue
                                    </label>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Product Request"
                                            checked={formData.type === 'Product Request'}
                                            onChange={handleChange}
                                        />
                                        Product Request
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="+91 87094 38350"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="orderId" className={styles.label}>Order ID (Optional)</label>
                                <input
                                    type="text"
                                    id="orderId"
                                    name="orderId"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="e.g. #KLS-1234"
                                />
                            </div>

                            {formData.type === 'Feedback' && (
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label htmlFor="rating" className={styles.label}>Rate your experience</label>
                                    <select
                                        name="rating"
                                        id="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        className={styles.select}
                                    >
                                        <option value="5">★★★★★ - Excellent</option>
                                        <option value="4">★★★★☆ - Good</option>
                                        <option value="3">★★★☆☆ - Average</option>
                                        <option value="2">★★☆☆☆ - Poor</option>
                                        <option value="1">★☆☆☆☆ - Very Poor</option>
                                    </select>
                                </div>
                            )}

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label htmlFor="message" className={styles.label}>
                                    {formData.type === 'Complaint' ? 'Describe the issue' : 'Your Comments'}
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className={`${styles.input} ${styles.textarea}`}
                                    placeholder={formData.type === 'Complaint' ? "Please provide details about the issue..." : "Share your thoughts with us..."}
                                    rows={6}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={status === 'submitting' || status === 'success'}
                        >
                            {status === 'submitting' ? 'Submitting...' : status === 'success' ? 'Submitted!' : (
                                <>
                                    Submit Feedback <Send size={18} />
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
