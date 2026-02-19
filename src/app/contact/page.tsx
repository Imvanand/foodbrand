'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import BulkOrder from '@/components/BulkOrder/BulkOrder';
import { Mail, Phone, MapPin, Instagram, Youtube, Send } from 'lucide-react';
import styles from './contact.module.css';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submission started");
        setStatus('submitting');

        try {
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI89o5GH6eBedLdzZmCCQTnOH0MH_t1JDB16dQf5ouoaB4mi__j4bscQl4_cSe8nZQ/exec";

            // Using URLSearchParams forces application/x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append("Name", formData.name);
            params.append("Email", formData.email);
            params.append("Phone", formData.phone);
            params.append("Message", formData.message);
            // Include Date in case script needs it, though original script generates it
            params.append("Date", new Date().toLocaleString());

            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
                mode: "no-cors",
            });

            console.log('Fetch request sent (no-cors mode) using URLSearchParams');
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            alert("Message sent successfully!");

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            alert("Error submitting form. Check console for details.");
        }
    };

    return (
        <main className={styles.contactPage}>
            <Navbar />

            <div className={`container ${styles.main}`}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>
                        Have questions about our products or want to discuss a bulk order?
                        We'd love to hear from you. Reach out to us anytime.
                    </p>
                </header>

                <div className={styles.grid}>
                    {/* Contact Information */}
                    <section className={styles.infoSection}>
                        <h2 className={styles.infoTitle}>Contact Information</h2>

                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <MapPin size={22} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h4>Visit Us</h4>
                                    <p>K R Puram, Bangalore</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <Mail size={22} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h4>Email Us</h4>
                                    <p>support@kalsafoods.com</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconWrapper}>
                                    <Phone size={22} />
                                </div>
                                <div className={styles.infoContent}>
                                    <h4>Call Us</h4>
                                    <p>+91 87094 38350</p>
                                    <p>Mon-Sat, 9am - 6pm</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.socials}>
                            <h4>Follow Us</h4>
                            <div className={styles.socialIcons}>
                                <a href="https://www.instagram.com/kalsafoods" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href="https://www.youtube.com/@Vivekandpreeti" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                                    <Youtube size={20} />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Contact Form */}
                    <section className={styles.formSection}>
                        <h2 className={styles.formTitle}>Send a Message</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>Your Name</label>
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

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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

                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label htmlFor="message" className={styles.label}>Your Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className={`${styles.input} ${styles.textarea}`}
                                        placeholder="How can we help you?"
                                        rows={5}
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'submitting' || status === 'success'}
                            >
                                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : (
                                    <>
                                        Send Message <Send size={18} />
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>
                                    Thank you! We received your message and will get back to you soon.
                                </p>
                            )}
                        </form>
                    </section>
                </div>
            </div>

            <BulkOrder />
            <Footer />
        </main>
    );
}
