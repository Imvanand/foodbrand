"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShoppingCart, Users, Package, Mail, Loader2, Search, ExternalLink, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function AdminTickets() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchTickets = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
            return;
        }

        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setTickets(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', id);
        if (!error) setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Tickets...</p>
        </div>
    );

    return (
        <AdminLayout title="Support Tickets">
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Tickets</div>
                    <div className={styles.statValue}>{tickets.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Open</div>
                    <div className={styles.statValue} style={{color: '#e53e3e'}}>{tickets.filter(t => t.status === 'open').length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Resolved</div>
                    <div className={styles.statValue} style={{color: '#48bb78'}}>{tickets.filter(t => t.status === 'resolved').length}</div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableActions} style={{flexWrap: 'wrap', gap: '10px'}}>
                    <div className={styles.searchBar} style={{width: '100%', maxWidth: '400px'}}>
                        <Search size={18} color="#777" />
                        <input type="text" placeholder="Filter tickets..." />
                    </div>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <strong style={{color: '#1c2b41'}}>{ticket.name}</strong>
                                            <span>{ticket.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{fontWeight: 600}}>{ticket.subject}</div>
                                        <div style={{fontSize: '0.8rem', color: '#666', maxWidth: '250px'}}>{ticket.message}</div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[ticket.status] || ''}`} style={{textTransform: 'capitalize'}}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', gap: '5px'}}>
                                            {ticket.status !== 'resolved' && (
                                                <button onClick={() => updateStatus(ticket.id, 'resolved')} className={styles.viewDetailsBtn} style={{background: '#224b33', color: 'white'}}>Resolve</button>
                                            )}
                                            <button onClick={() => updateStatus(ticket.id, 'closed')} className={styles.viewDetailsBtn}>Close</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {tickets.length === 0 && (
                    <div style={{padding: '50px', textAlign: 'center', color: '#777'}}>No support tickets found.</div>
                )}
            </div>
        </AdminLayout>
    );
}
