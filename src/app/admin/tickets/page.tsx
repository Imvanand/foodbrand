"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShoppingCart, Users, Package, Mail, Loader2, Search, ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import Link from 'next/link';

export default function AdminTickets() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchTickets = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin/login');
            return;
        }

        if (session.user.email !== 'imvanand1@gmail.com') {
            alert("Access Denied: You are not authorized to view the admin panel.");
            router.push('/');
            return;
        }

        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tickets:', error);
        } else {
            setTickets(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('support_tickets')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } else {
            alert("Error updating status: " + error.message);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle size={16} color="green" />;
            case 'closed': return <XCircle size={16} color="gray" />;
            case 'in-progress': return <Clock size={16} color="orange" />;
            default: return <Clock size={16} color="red" />;
        }
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#224b33" />
            <p>Loading Tickets...</p>
        </div>
    );

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <img src="/logo/logo.png" alt="Kalsa Admin" className={styles.adminLogo} />
                    <span>Control Panel</span>
                </div>
                <nav className={styles.sideNav}>
                    <Link href="/admin/orders" className={styles.navItem}>
                        <ShoppingCart size={20} /> Orders
                    </Link>
                    <Link href="/admin/customers" className={styles.navItem}>
                        <Users size={20} /> Customers
                    </Link>
                    <Link href="/admin/products" className={styles.navItem}>
                        <Package size={20} /> Inventory (Catalog)
                    </Link>
                    <Link href="/admin/tickets" className={`${styles.navItem} ${styles.active}`}>
                        <Mail size={20} /> Support Tickets
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topHeader}>
                    <h1>Support Tickets</h1>
                    <div className={styles.userProfile}>
                        <span>Admin Account</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Tickets</div>
                        <div className={styles.statValue}>{tickets.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Open</div>
                        <div className={styles.statValue}>{tickets.filter(t => t.status === 'open').length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Resolved</div>
                        <div className={styles.statValue}>{tickets.filter(t => t.status === 'resolved').length}</div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.tableActions}>
                        <div className={styles.searchBar}>
                            <Search size={18} color="#777" />
                            <input type="text" placeholder="Filter tickets..." />
                        </div>
                    </div>

                    <table className={styles.adminTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{fontWeight: 600}}>{ticket.name}</div>
                                        <div style={{fontSize: '0.8rem', color: '#666'}}>{ticket.email}</div>
                                        <div style={{fontSize: '0.8rem', color: '#666'}}>{ticket.phone}</div>
                                    </td>
                                    <td><strong>{ticket.subject}</strong></td>
                                    <td><div style={{maxWidth: '300px', fontSize: '0.9rem'}}>{ticket.message}</div></td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'capitalize'}}>
                                            {getStatusIcon(ticket.status)}
                                            {ticket.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', gap: '5px'}}>
                                            {ticket.status !== 'resolved' && (
                                                <button onClick={() => updateStatus(ticket.id, 'resolved')} className={styles.viewBtn} style={{background: '#224b33', color: 'white'}}>Resolve</button>
                                            )}
                                            {ticket.status === 'open' && (
                                                <button onClick={() => updateStatus(ticket.id, 'in-progress')} className={styles.viewBtn}>In Progress</button>
                                            )}
                                            <button onClick={() => updateStatus(ticket.id, 'closed')} className={styles.viewBtn} style={{background: '#f8f8f8', color: '#333'}}>Close</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tickets.length === 0 && (
                        <div style={{padding: '50px', textAlign: 'center', color: '#777'}}>No support tickets found.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
