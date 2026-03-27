"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, ShoppingCart, Users, Package, Search, ExternalLink, Loader2, MapPin, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import Link from 'next/link';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchAllCustomers = async () => {
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

        // Fetch all registered users via secure RPC
        const { data: usersData, error: usersError } = await supabase.rpc('get_all_users');
        
        // Fetch user addresses representing extra customer info
        const { data: addrData } = await supabase
            .from('user_addresses')
            .select('*')
            .order('created_at', { ascending: false });

        const uniqueCustomersMap = new Map();

        // 1. Add all registered users first
        if (!usersError && usersData) {
            usersData.forEach((u: any) => {
                const phone = u.raw_user_meta_data?.phone || u.phone || 'N/A';
                const name = u.raw_user_meta_data?.full_name || u.email;
                uniqueCustomersMap.set(u.id, {
                    id: u.id,
                    user_id: u.id,
                    full_name: name,
                    phone: phone,
                    email: u.email,
                    city: 'Not provided',
                    pincode: 'Not provided',
                    flat_house: '',
                    area_street: '',
                    state: '',
                    created_at: u.created_at,
                    total_orders: 0
                });
            });
        }

        // 2. Enhance with address data or add guest checkouts
        if (addrData) {
            addrData.forEach((addr: any) => {
                if (addr.user_id && uniqueCustomersMap.has(addr.user_id)) {
                    // Update existing user with their real location
                    const existing = uniqueCustomersMap.get(addr.user_id);
                    if (existing.city === 'Not provided') {
                        existing.city = addr.city;
                        existing.pincode = addr.pincode;
                        existing.flat_house = addr.flat_house;
                        existing.area_street = addr.area_street;
                        existing.state = addr.state;
                        // Better phone if they added it in address instead of profile
                        if (existing.phone === 'N/A' && addr.phone) {
                            existing.phone = addr.phone;
                        }
                    }
                } else {
                    // It's a guest checkout or address without auth mapping
                    if (!uniqueCustomersMap.has(addr.phone)) {
                        uniqueCustomersMap.set(addr.phone, {
                            ...addr,
                            user_id: null,
                            total_orders: 0
                        });
                    }
                }
            });
        }
        
        setCustomers(Array.from(uniqueCustomersMap.values()));
        setLoading(false);
    };

    useEffect(() => {
        fetchAllCustomers();
    }, [supabase]);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <Loader2 className="animate-spin" size={48} color="#224b33" />
            <p>Loading Customers List...</p>
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
                    <Link href="/admin/customers" className={`${styles.navItem} ${styles.active}`}>
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
                    <h1>Customer Directory</h1>
                    <div className={styles.userProfile}>
                        <span>Admin Account</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Customers</div>
                        <div className={styles.statValue}>{customers.length}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Active Since</div>
                        <div className={styles.statValue}>2026</div>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <div className={styles.tableActions}>
                        <div className={styles.searchBar}>
                            <Search size={18} />
                            <input type="text" placeholder="Search by name or phone..." />
                        </div>
                    </div>

                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Location (City, PIN)</th>
                                <th>Customer Type</th>
                                <th>Registered Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((cust, idx) => (
                                <tr key={idx}>
                                    <td><strong>{cust.full_name}</strong></td>
                                    <td className={styles.orderIdCell}>{cust.phone}</td>
                                    <td>
                                        <div className={styles.customerInfo} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <MapPin size={14} color="#718096" />
                                            <span>{cust.city || 'N/A'}, {cust.pincode}</span>
                                        </div>
                                        {cust.email && <div style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>{cust.email}</div>}
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${cust.user_id ? styles.delivered : styles.processing}`}>
                                            {cust.user_id ? "Registered User" : "Guest Checkout"}
                                        </span>
                                    </td>
                                    <td>{new Date(cust.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className={styles.viewDetailsBtn} onClick={() => alert(cust.flat_house ? `Address: ${cust.flat_house}, ${cust.area_street}\nState: ${cust.state}` : 'No address provided yet')}>
                                            <ExternalLink size={16} /> View Address
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {customers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#718096' }}>
                            No customers found yet. Dummy data might have been cleared.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
