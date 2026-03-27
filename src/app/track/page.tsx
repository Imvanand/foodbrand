"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Search, Loader2, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import styles from './track.module.css';

export default function TrackPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [trackingData, setTrackingData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);
        setError('');
        setTrackingData(null);

        try {
            // Smart detection
            let param = '';
            const query = searchQuery.trim();
            if (query.startsWith('KF-')) {
                param = `id=${query}`;
            } else if (/^\d{10}$/.test(query)) {
                param = `phone=${query}`;
            } else {
                param = `waybill=${query}`;
            }

            const res = await fetch(`/api/shipping/track-order?${param}`);
            const data = await res.json();

            if (data?.ShipmentData?.[0]?.Shipment) {
                setTrackingData(data.ShipmentData[0].Shipment);
            } else {
                setError("No shipment found. Please double-check your Order ID or Tracking Number.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-search if ID is in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            setSearchQuery(q);
            // Wait for searchQuery to be update then track
        }
    }, []);

    useEffect(() => {
        if (searchQuery && !loading && !trackingData && !error) {
            handleTrack();
        }
    }, [searchQuery]);

    return (
        <>
            <Navbar />
            <main className={styles.container}>
                <div className={styles.hero}>
                    <h1>Track Your Shipment</h1>
                    <p>Enter your Order ID (e.g. KF-XXXXX) or Delhivery Waybill number to see live updates.</p>
                    <form className={styles.searchBox} onSubmit={handleTrack}>
                        <Search size={22} color="#777" />
                        <input 
                            type="text" 
                            placeholder="Order ID / Tracking ID" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Track Order"}
                        </button>
                    </form>
                </div>

                {error && <div className={styles.errorBox}>{error}</div>}

                {trackingData && (
                    <div className={styles.trackingResult}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <span className={styles.label}>TRACKING ID:</span>
                                    <span className={styles.value}>{trackingData.Waybill}</span>
                                </div>
                                <div>
                                    <span className={styles.label}>STATUS:</span>
                                    <span className={`${styles.statusPill} ${styles[trackingData.Status?.Status?.toLowerCase()]}`}>
                                        {trackingData.Status?.Status || "Order Placed"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.timeline}>
                                <div className={styles.event}>
                                    <div className={styles.iconBox}><Clock size={20} /></div>
                                    <div className={styles.eventDesc}>
                                        <p className={styles.eventTitle}>Order Received</p>
                                        <p className={styles.eventDate}>{new Date(trackingData.Status?.StatusDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                {trackingData.Scans?.map((scan: any, idx: number) => (
                                    <div key={idx} className={styles.event}>
                                        <div className={styles.iconBox}>
                                            {scan.ScanDetail?.Scan?.toLowerCase().includes('delivered') ? <CheckCircle size={20} color="#224b33" /> : <Truck size={20} />}
                                        </div>
                                        <div className={styles.eventDesc}>
                                            <p className={styles.eventTitle}>{scan.ScanDetail?.Scan}</p>
                                            <p className={styles.eventLocation}>{scan.ScanDetail?.ScannedLocation}</p>
                                            <p className={styles.eventDate}>{new Date(scan.ScanDetail?.ScanDateTime).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>Destination</span>
                                    <span className={styles.value}>{trackingData.Destination}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>Expected Delivery</span>
                                    <span className={styles.value}>{trackingData.ExpectedDeliveryDate ? new Date(trackingData.ExpectedDeliveryDate).toLocaleDateString() : "Pending"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.tipBox}>
                    <Package size={30} color="#224b33" />
                    <div>
                        <h3>Need More Help?</h3>
                        <p>If you have any issues with your shipment, please contact us at <strong>support@kalsafoods.com</strong> or raise a support ticket from your profile.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
