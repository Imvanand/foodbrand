"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShoppingCart, Users, Package, Mail, Loader2, Search, ExternalLink, CheckCircle, Clock, AlertTriangle, Phone, Hash, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout/AdminLayout';
import { sendRecoveryEmail } from '@/lib/actions';

export default function RecoveryDashboard() {
    const [journeys, setJourneys] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);
    const [filter, setFilter] = useState('all'); // all, incomplete, payment_success
    const router = useRouter();
    const supabase = createClient();

    const fetchData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
            return;
        }

        // Fetch Journeys
        const { data: journeyData } = await supabase
            .from('checkout_journeys')
            .select('*')
            .order('created_at', { ascending: false });

        // Fetch Tickets
        const { data: ticketData } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        setJourneys(journeyData || []);
        setTickets(ticketData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Order_Logged': return '#48bb78';
            case 'Payment_Success': return '#ecc94b';
            case 'Initiated': return '#a0aec0';
            case 'Failed': return '#f56565';
            case 'System_Error': return '#e53e3e';
            default: return '#718096';
        }
    };

    const filteredJourneys = journeys.filter(j => {
        if (filter === 'incomplete') return j.status !== 'Order_Logged';
        if (filter === 'payment_success') return j.status === 'Payment_Success';
        return true;
    });

    const handleEmailRecovery = async (journey: any) => {
        setSendingEmail(journey.id);
        const result = await sendRecoveryEmail(journey.user_email, journey.items, journey.amount, journey.user_mobile);
        
        if (result.success) {
            alert("Recovery email sent successfully!");
        } else {
            alert("Error sending email: " + result.error);
        }
        setSendingEmail(null);
    };

    const sortedJourneys = [...filteredJourneys].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Recovery Dashboard...</p>
        </div>
    );

    return (
        <AdminLayout title="Recovery Hub">
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Journeys</div>
                    <div className={styles.statValue}>{journeys.length}</div>
                </div>
                <div className={styles.statCard} style={{borderLeft: '4px solid #ecc94b'}}>
                    <div className={styles.statLabel}>Paid but Stuck</div>
                    <div className={styles.statValue} style={{color: '#d69e2e'}}>{journeys.filter(j => j.status === 'Payment_Success').length}</div>
                </div>
                <div className={styles.statCard} style={{borderLeft: '4px solid #f56565'}}>
                    <div className={styles.statLabel}>Failures</div>
                    <div className={styles.statValue} style={{color: '#e53e3e'}}>{journeys.filter(j => j.status.includes('Error') || j.status === 'Failed').length}</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={() => setFilter('all')} style={{ padding: '8px 15px', borderRadius: '6px', border: filter === 'all' ? 'none' : '1px solid #ddd', background: filter === 'all' ? '#1c2b41' : 'white', color: filter === 'all' ? 'white' : 'black', cursor: 'pointer', fontSize: '14px' }}>All Journeys</button>
                <button onClick={() => setFilter('incomplete')} style={{ padding: '8px 15px', borderRadius: '6px', border: filter === 'incomplete' ? 'none' : '1px solid #ddd', background: filter === 'incomplete' ? '#1c2b41' : 'white', color: filter === 'incomplete' ? 'white' : 'black', cursor: 'pointer', fontSize: '14px' }}>Incomplete</button>
                <button onClick={() => setFilter('payment_success')} style={{ padding: '8px 15px', borderRadius: '6px', border: filter === 'payment_success' ? 'none' : '1px solid #ddd', background: filter === 'payment_success' ? '#1c2b41' : 'white', color: filter === 'payment_success' ? 'white' : 'black', cursor: 'pointer', fontSize: '14px' }}>Paid but Stuck</button>
            </div>

            <div className={styles.tableContainer}>
                <div style={{overflowX: 'auto'}}>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Customer</th>
                                <th>Items / Amount</th>
                                <th>Last Known Status</th>
                                <th>Recovery</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedJourneys.map((j) => (
                                <tr key={j.id}>
                                    <td>
                                        <div style={{fontSize: '0.85rem'}}>{new Date(j.created_at).toLocaleDateString()}</div>
                                        <div style={{fontSize: '0.75rem', color: '#888'}}>{new Date(j.created_at).toLocaleTimeString()}</div>
                                    </td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <strong style={{color: '#1c2b41'}}>{j.user_mobile}</strong>
                                            <span>{j.user_email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{fontSize: '0.9rem'}}>
                                            {j.items?.map((item: any, idx: number) => (
                                                <div key={idx}>{item.qty}x {item.name}</div>
                                            ))}
                                        </div>
                                        <div style={{fontWeight: 700, color: '#224b33'}}>₹{j.amount}</div>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                            <div style={{width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(j.status)}}></div>
                                            <span style={{fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize'}}>{j.status.replace(/_/g, ' ')}</span>
                                        </div>
                                        {j.error_message && <div style={{fontSize: '0.7rem', color: '#e53e3e', maxWidth: '150px'}}>{j.error_message}</div>}
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            {j.user_mobile && (
                                                <a href={`https://wa.me/${j.user_mobile}`} target="_blank" className={styles.viewDetailsBtn} style={{background: '#25D366', color: 'white', border: 'none'}}>
                                                    <Phone size={14} style={{marginRight: '5px'}}/> WhatsApp
                                                </a>
                                            )}
                                            {j.user_email && (
                                                <button 
                                                    disabled={sendingEmail === j.id}
                                                    onClick={() => handleEmailRecovery(j)} 
                                                    className={styles.viewDetailsBtn} 
                                                    style={{background: '#3182ce', color: 'white', border: 'none', opacity: sendingEmail === j.id ? 0.7 : 1}}
                                                >
                                                    {sendingEmail === j.id ? (
                                                        <Loader2 size={14} className="animate-spin" style={{marginRight: '5px'}}/>
                                                    ) : (
                                                        <Mail size={14} style={{marginRight: '5px'}}/>
                                                    )}
                                                    {sendingEmail === j.id ? "Sending..." : "Email Recovery"}
                                                </button>
                                            )}
                                            {j.status === 'Payment_Success' && (
                                                <button className={styles.viewDetailsBtn} style={{background: '#1c2b41', color: 'white', border: 'none'}}>Force</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedJourneys.length === 0 && (
                    <div style={{padding: '50px', textAlign: 'center', color: '#777'}}>No checkout journeys found.</div>
                )}
            </div>
        </AdminLayout>
    );
}

const MessageCircle = ({ size, color }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
);
