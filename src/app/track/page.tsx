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

    const [fullData, setFullData] = useState<any>(null);

    const handleTrack = async (e?: React.FormEvent, forceId?: string) => {
        if (e) e.preventDefault();
        const idToTrack = forceId || searchQuery.trim();
        if (!idToTrack) return;

        setLoading(true);
        setError('');
        // Don't clear trackingData if we are switching between same phone's orders
        if (!forceId) {
            setTrackingData(null);
            setFullData(null);
        }

        try {
            // Smart detection
            let param = '';
            if (idToTrack.startsWith('KF-')) {
                param = `id=${idToTrack}`;
            } else if (/^\d{10}$/.test(idToTrack)) {
                param = `phone=${idToTrack}`;
            } else {
                param = `waybill=${idToTrack}`;
            }

            const res = await fetch(`/api/shipping/track-order?${param}`);
            const data = await res.json();

            if (data?.ShipmentData?.[0]?.Shipment) {
                setTrackingData(data.ShipmentData[0].Shipment);
                setFullData(data);
            } else {
                setError("No shipment found. Please double-check your Order ID (KF-XXXXX) or Registered Mobile Number.");
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
                    <p>Enter your Order ID (KF-XXXXX) or Registered Mobile Number to see live updates.</p>
                    <form className={styles.searchBox} onSubmit={handleTrack}>
                        <Search size={22} color="#777" />
                        <input 
                            type="text" 
                            placeholder="Order ID / Mobile Number" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Track Order"}
                        </button>
                    </form>
                </div>

                {error && <div className={styles.errorBox}>{error}</div>}

                {/* Multiple Orders Scenarios */}
                {fullData?.allOrders && fullData.allOrders.length > 1 && (
                    <div className={styles.orderSelector}>
                        <p className={styles.selectorHint}>We found {fullData.allOrders.length} orders for this number. Select one to track:</p>
                        <div className={styles.selectorGrid}>
                            {fullData.allOrders.map((ord: any) => (
                                <button 
                                    key={ord.id} 
                                    className={`${styles.selectorBtn} ${fullData.orderId === ord.id ? styles.selected : ''}`}
                                    onClick={() => handleTrack(undefined, ord.id)}
                                >
                                    <span className={styles.ordId}>{ord.id}</span>
                                    <span className={styles.ordDate}>{new Date(ord.date).toLocaleDateString()}</span>
                                    <span className={`${styles.statusBadge} ${ord.status.toLowerCase()}`}>{ord.status}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {trackingData && (
                    <div className={styles.trackingResult}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <span className={styles.label}>ORDER ID:</span>
                                    <span className={styles.value}>{fullData?.orderId || trackingData.ReferenceNo}</span>
                                </div>
                                <div>
                                    <span className={styles.label}>SHIPPING STATUS:</span>
                                    <span className={`${styles.statusPill} ${styles[trackingData.Status?.Status?.toLowerCase().replace(/\s/g, '_')]}`}>
                                        {trackingData.Status?.Status || "Order Placed"}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items Section */}
                            {fullData?.orderItems && fullData.orderItems.length > 0 && (
                                <div className={styles.orderItemsSec}>
                                    <h4 className={styles.secTitle}>Items in this order:</h4>
                                    <div className={styles.itemsList}>
                                        {fullData.orderItems.map((item: any, idx: number) => (
                                            <div key={idx} className={styles.itemRow}>
                                                {item.image && <img src={item.image} alt={item.name} className={styles.itemImg} />}
                                                <div className={styles.itemInfo}>
                                                    <p className={styles.itemName}>{item.name}</p>
                                                    <p className={styles.itemQty}>Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                <div className={styles.detailItem}>
                                    <span className={styles.label}>Waybill Number</span>
                                    <span className={styles.value}>{trackingData.Waybill !== "NOT_SYNCED_YET" ? trackingData.Waybill : "Being Assigned"}</span>
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
