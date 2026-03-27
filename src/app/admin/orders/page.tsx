"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, ShoppingCart, Users, Package, Search, ExternalLink, Loader2, Mail, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import Link from 'next/link';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const router = useRouter();
    const supabase = createClient();

    const fetchAllOrders = async () => {
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
            .from('orders')
            .select(`
                *,
                user_addresses (*),
                order_items (*)
            `)
            .order('created_at', { ascending: false });
        
        if (!error && data) setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllOrders();
    }, [supabase]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);
        
        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;

        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', orderId);
        
        if (!error) {
            setOrders(orders.filter(o => o.id !== orderId));
            alert("Order deleted successfully.");
        } else {
            alert("Error deleting order: " + error.message);
        }
    };

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <Loader2 className="animate-spin" size={48} color="#224b33" />
            <p>Loading Admin Dashboard...</p>
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
                    <Link href="/admin/orders" className={`${styles.navItem} ${styles.active}`}>
                        <ShoppingCart size={20} /> Orders
                    </Link>
                    <Link href="/admin/customers" className={styles.navItem}>
                        <Users size={20} /> Customers
                    </Link>
                    <Link href="/admin/products" className={styles.navItem}>
                        <Package size={20} /> Inventory (Catalog)
                    </Link>
                    <Link href="/admin/tickets" className={styles.navItem}>
                        <Mail size={20} /> Support Tickets
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topHeader}>
                    <h1>Order Management</h1>
                    <div className={styles.userProfile}>
                        <span>Admin Account</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Orders</div>
                        <div className={styles.statValue}>{orders.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Pending</div>
                        <div className={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Revenue</div>
                        <div className={styles.statValue}>₹{orders.reduce((acc, o) => acc + Number(o.total_amount), 0)}</div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.tableActions}>
                        <div className={styles.searchBar}>
                            <Search size={18} />
                            <input type="text" placeholder="Search by Order ID or Name..." />
                        </div>
                        <select className={styles.filterSelect} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>

                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className={styles.orderIdCell}>#{order.id.slice(0, 8)}</td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <strong>{order.user_addresses?.full_name || 'Guest'}</strong>
                                            <span>{order.user_addresses?.city}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className={styles.priceCell}>₹{order.total_amount}</td>
                                    <td>
                                        <select 
                                            className={`${styles.statusBadge} ${styles[order.status]}`}
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td><span className={styles.paymentMethod}>{order.payment_method.toUpperCase()}</span></td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.viewDetailsBtn} onClick={() => alert(JSON.stringify(order.order_items, null, 2))}>
                                                <ExternalLink size={16} /> Details
                                            </button>
                                            <button className={styles.deleteBtn} onClick={() => deleteOrder(order.id)}>
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
