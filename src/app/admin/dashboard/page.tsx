"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, ShoppingCart, Users, Package, AlertTriangle, Mail, TrendingUp, DollarSign, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        orders: 0,
        revenue: 0,
        customers: 10,
        tickets: 0,
        pending: 0,
        recovery: 0,
        shares: 0
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchStats = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
            return;
        }

        const { data: orders } = await supabase.from('orders').select('*');
        const { data: tickets } = await supabase.from('support_tickets').select('*');
        const { data: recovery } = await supabase.from('checkout_journeys').select('*');
        const { data: shares } = await supabase.from('product_shares').select('*');

        const totalRevenue = orders?.reduce((acc: number, o: any) => acc + Number(o.total_amount), 0) || 0;
        const pendingOrders = orders?.filter((o: any) => o.status === 'pending').length || 0;

        setStats({
            orders: orders?.length || 0,
            revenue: totalRevenue,
            tickets: tickets?.length || 0,
            pending: pendingOrders,
            recovery: recovery?.filter((j: any) => j.status === 'Payment_Success').length || 0,
            shares: shares?.length || 0
        });
        setLoading(false);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Dashboard...</p>
        </div>
    );

    return (
        <AdminLayout title="Operational Dashboard">
            <div className={styles.statsGrid}>
                <div className={styles.statCard} style={{background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)', color: 'white'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div>
                           <div className={styles.statLabel} style={{color: '#aeb9e1'}}>Total Revenue</div>
                           <div className={styles.statValue} style={{fontSize: '32px'}}>₹{stats.revenue.toLocaleString()}</div>
                        </div>
                        <div style={{background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px'}}><DollarSign size={24} /></div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div>
                           <div className={styles.statLabel}>Total Orders</div>
                           <div className={styles.statValue}>{stats.orders}</div>
                           <div style={{fontSize: '12px', color: '#48bb78', marginTop: '8px', fontWeight: 600}}>
                              <ArrowUpRight size={14} style={{display: 'inline'}} /> 12.5% increase
                           </div>
                        </div>
                        <div style={{background: '#f0f4f9', padding: '10px', borderRadius: '12px', color: '#2b6cb0'}}><ShoppingCart size={24} /></div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div>
                           <div className={styles.statLabel}>Pending Shipments</div>
                           <div className={styles.statValue}>{stats.pending}</div>
                           <div style={{fontSize: '12px', color: '#e53e3e', marginTop: '8px', fontWeight: 600}}>
                              Action required
                           </div>
                        </div>
                        <div style={{background: '#fff5f5', padding: '10px', borderRadius: '12px', color: '#e53e3e'}}><Package size={24} /></div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div>
                           <div className={styles.statLabel}>Recovery Hub</div>
                           <div className={styles.statValue}>{stats.recovery}</div>
                           <div style={{fontSize: '12px', color: '#d69e2e', marginTop: '8px', fontWeight: 600}}>
                              Stuck payments
                           </div>
                        </div>
                        <div style={{background: '#fffff0', padding: '10px', borderRadius: '12px', color: '#d69e2e'}}><AlertTriangle size={24} /></div>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div>
                           <div className={styles.statLabel}>Viral Shares</div>
                           <div className={styles.statValue}>{stats.shares}</div>
                           <div style={{fontSize: '12px', color: '#3182ce', marginTop: '8px', fontWeight: 600}}>
                              Social Reach
                           </div>
                        </div>
                        <div style={{background: '#ebf8ff', padding: '10px', borderRadius: '12px', color: '#3182ce'}}><Share2 size={24} /></div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
               <div className={styles.tableContainer} style={{padding: '24px'}}>
                  <h3 style={{marginBottom: '20px', fontWeight: 800}}>Quick Actions</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                     <button onClick={() => router.push('/admin/orders')} className={styles.navItem} style={{background: '#f0f4f9', color: '#1c2b41', border: 'none', width: '100%', justifyContent: 'flex-start', padding: '16px'}}>
                        <ShoppingCart size={18} style={{marginRight: '12px'}} /> Process Pending Orders
                     </button>
                     <button onClick={() => router.push('/admin/recovery')} className={styles.navItem} style={{background: '#f0f4f9', color: '#1c2b41', border: 'none', width: '100%', justifyContent: 'flex-start', padding: '16px'}}>
                        <AlertTriangle size={18} style={{marginRight: '12px'}} /> Check Lost Checkouts
                     </button>
                     <button onClick={() => router.push('/admin/tickets')} className={styles.navItem} style={{background: '#f0f4f9', color: '#1c2b41', border: 'none', width: '100%', justifyContent: 'flex-start', padding: '16px'}}>
                        <Mail size={18} style={{marginRight: '12px'}} /> Respond to Tickets
                     </button>
                     <button 
                        onClick={async () => {
                            if(!confirm("Send review reminders to orders delivered 2 days ago?")) return;
                            try {
                                const res = await fetch('/api/reviews/reminders?secret=kalsa-secure-sync-key', { method: 'POST' });
                                const data = await res.json();
                                alert(data.message || "Reminders processed!");
                            } catch(e) { alert("Failed to send reminders"); }
                        }} 
                        className={styles.navItem} 
                        style={{background: '#fffaf0', color: '#c05621', border: '1px solid #feebc8', width: '100%', justifyContent: 'flex-start', padding: '16px', marginTop: '12px'}}
                     >
                        <AlertTriangle size={18} style={{marginRight: '12px', color: '#ff9f1c'}} /> Send Review Reminders (2-Day Follow-up)
                     </button>
                  </div>
               </div>

               <div className={styles.tableContainer} style={{padding: '24px'}}>
                   <h3 style={{marginBottom: '20px', fontWeight: 800}}>Business Health</h3>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                      <div>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                            <strong>Order Completion Rate</strong>
                            <span>84%</span>
                         </div>
                         <div style={{width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px'}}>
                            <div style={{width: '84%', height: '100%', background: '#48bb78', borderRadius: '4px'}}></div>
                         </div>
                      </div>
                      <div>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                            <strong>Support Response Time</strong>
                            <span>2.4h</span>
                         </div>
                         <div style={{width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px'}}>
                            <div style={{width: '92%', height: '100%', background: '#3182ce', borderRadius: '4px'}}></div>
                         </div>
                      </div>
                   </div>
               </div>
            </div>
        </AdminLayout>
    );
}

const Loader2 = ({ size, color }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2 animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);
