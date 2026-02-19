'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './BulkOrder.module.css';

const BulkOrder = () => {
    return (
        <section id="bulk-order" className={styles.bulkSection}>
            <div className="container">
                <motion.div
                    className={styles.bulkCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.content}>
                        <motion.div
                            className={styles.badge}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            Wholesale & Business
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            Planning a Bulk Order?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            Whether it's for a restaurant, retail shop, or a special event,
                            we offer specialized pricing and priority logistics for large quantity orders.
                            Get in touch with our team directly for a custom quote.
                        </motion.p>
                        <motion.div
                            className={styles.ctaGroup}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <a href="tel:+918709438350" className={styles.callBtn}>
                                <Phone size={20} />
                                <span>Call Directly: +91 87094 38350</span>
                            </a>
                            <Link href="/contact" className={styles.inquiryBtn}>
                                <span>Online Inquiry</span>
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>
                    <div className={styles.imageWrapper}>
                        <div className={styles.iconContainer}>
                            <Package size={120} strokeWidth={1} className={styles.packageIcon} />
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>100%</span>
                                <span className={styles.statLabel}>Organic Certified</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statValue}>Pan-India</span>
                                <span className={styles.statLabel}>Delivery</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BulkOrder;
