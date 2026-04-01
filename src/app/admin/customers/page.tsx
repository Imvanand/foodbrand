"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, ExternalLink, Loader2, MapPin, Mail, Users, UserCheck, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchAllCustomers = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
            return;
        }

        // Fetch user addresses representing extra customer info
        const { data: addrData, error: addrError } = await supabase
            .from('user_addresses')
            .select('*')
            .order('created_at', { ascending: false });

        if (addrError) {
            console.error('Error fetching customers:', addrError);
            setLoading(false);
            return;
        }

        // De-duplicate by phone number to create a unique customer list
        const uniqueCustomers: any[] = [];
        const seenPhones = new Set();

        if (addrData) {
            addrData.forEach((addr: any) => {
                if (!seenPhones.has(addr.phone)) {
                    seenPhones.add(addr.phone);
                    uniqueCustomers.push(addr);
                }
            });
        }
        
        setCustomers(uniqueCustomers);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllCustomers();
    }, [supabase]);

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Customers...</p>
        </div>
    );

    return (
        <AdminLayout title="Customer Directory">
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Unique Customers</div>
                    <div className={styles.statValue}>{customers.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Verified Accounts</div>
                    <div className={styles.statValue}>{customers.filter(c => c.user_id).length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Retention Strategy</div>
                    <div className={styles.statValue} style={{color: '#3182ce'}}>8.4%</div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableActions} style={{flexWrap: 'wrap', gap: '10px'}}>
                    <div className={styles.searchBar} style={{width: '100%', maxWidth: '400px'}}>
                        <Search size={18} color="#777" />
                        <input type="text" placeholder="Search by name or phone..." />
                    </div>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Contact Details</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((cust, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            <div style={{width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600}}>
                                                {cust.full_name?.charAt(0) || 'G'}
                                            </div>
                                            <strong style={{color: '#1c2b41'}}>{cust.full_name || 'Guest'}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{fontSize: '0.85rem', fontWeight: 500}}>{cust.phone}</div>
                                        <div style={{fontSize: '0.75rem', color: '#64748b'}}>{cust.email || 'No email provided'}</div>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem'}}>
                                            <MapPin size={12} color="#94a3b8" />
                                            <span>{cust.city}, {cust.state}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{fontSize: '0.75rem', fontWeight: 600, color: cust.user_id ? '#2b6cb0' : '#4a5568'}}>
                                            {cust.user_id ? 'Verified User' : 'One-time Guest'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#48bb78'}}></div>
                                            <span style={{fontSize: '0.8rem', fontWeight: 500}}>Active</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button className={styles.viewDetailsBtn} onClick={() => alert(`Full Address:\n${cust.flat_house}, ${cust.area_street}\n${cust.city}, ${cust.state} - ${cust.pincode}`)}>
                                            <ExternalLink size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {customers.length === 0 && (
                    <div style={{padding: '50px', textAlign: 'center', color: '#64748b'}}>No customers found in directory.</div>
                )}
            </div>
        </AdminLayout>
    );
}
