"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, ShoppingCart, Users, Package, Search, ExternalLink, Loader2, Mail, Trash2, Download, RefreshCw, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [trackingData, setTrackingData] = useState<any>(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const router = useRouter();
    const supabase = createClient();

    const fetchAllOrders = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
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
        if (!confirm("Delete this order?")) return;
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (!error) setOrders(orders.filter(o => o.id !== orderId));
    };

    const handleSyncDelivery = async () => {
        setSyncing(true);
        try {
            // Using the default secret as fallback, this matches the API's fallback
            const res = await fetch('/api/shipping/auto-sync?secret=kalsa-secure-sync-key');
            const data = await res.json();
            
            if (data.success) {
                alert(`Sync Complete! Updated ${data.updatedCount} orders.`);
                fetchAllOrders(); // Refresh the list to show new statuses
            } else {
                alert(`Sync Failed: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Sync Error:", err);
            alert("Error connecting to sync service.");
        } finally {
            setSyncing(false);
        }
    };

    const fetchTrackingInfo = async (order: any) => {
        setTrackingLoading(true);
        setTrackingData(null);
        try {
            const waybill = order.waybill;
            const orderId = `KF-${order.id.slice(0, 8).toUpperCase()}`;
            const res = await fetch(`/api/shipping/track-order?waybill=${waybill}&id=${orderId}`);
            const data = await res.json();
            setTrackingData(data);
        } catch (err) {
            alert("Error fetching live tracking. Try again later.");
        } finally {
            setTrackingLoading(false);
        }
    };

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    const downloadOrdersCSV = () => {
        if (!orders.length) return alert("No orders to download!");

        // Prepare Header
        const headers = ["Order ID", "Date", "Customer Name", "Phone", "Amount", "Status", "Method", "Waybill", "Address", "City", "State", "Pincode"].join(",");
        
        // Prepare Rows
        const rows = orders.map(o => {
            const addr = o.user_addresses || {};
            const fullAddress = `"${addr.flat_house || ''}, ${addr.area_street || ''}"`.replace(/,/g, ' '); // Clean for CSV
            
            return [
                `#KF-${o.id.slice(0, 8).toUpperCase()}`,
                new Date(o.created_at).toLocaleDateString(),
                `"${addr.full_name || 'Guest'}"`,
                `"${addr.phone || 'N/A'}"`,
                o.total_amount,
                o.status,
                `"${o.payment_method || 'Paid'}"`,
                `"${o.waybill || 'No Waybill'}"`,
                fullAddress,
                `"${addr.city || ''}"`,
                `"${addr.state || ''}"`,
                `"${addr.pincode || ''}"`
            ].join(",");
        });

        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Kalsa_Orders_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    };

    const downloadGSTReport = () => {
        if (!orders.length) return alert("No orders yet!");

        // Prepare Header for CA
        const headers = ["Invoice Date", "Invoice No", "Customer State", "Transaction Type", "Taxable Value", "GST (18%)", "Total Amount"].join(",");
        
        // Prepare Rows
        const rows = orders.map(o => {
            const addr = o.user_addresses || {};
            const state = addr.state || 'Unknown';
            const total = Number(o.total_amount);
            const taxableValue = total / 1.18; // 18% GST reverse calculation
            const gstAmount = total - taxableValue;
            
            // Determine if Interstate or Intrastate (assuming business is in Karnataka)
            const type = state.toLowerCase().includes('karnataka') ? 'Intrastate (CGST/SGST)' : 'Interstate (IGST)';

            return [
                new Date(o.created_at).toLocaleDateString(),
                `#KF-${o.id.slice(0, 8).toUpperCase()}`,
                `"${state}"`,
                `"${type}"`,
                taxableValue.toFixed(2),
                gstAmount.toFixed(2),
                total.toFixed(2)
            ].join(",");
        });

        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Kalsa_GST_Report_${new Date().toLocaleString('default', { month: 'long' })}_${new Date().getFullYear()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Orders...</p>
        </div>
    );

    return (
        <AdminLayout title="Order Management">
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
                    <div className={styles.statLabel}>Verified Revenue</div>
                    <div className={styles.statValue}>₹{orders.reduce((acc, o) => acc + Number(o.total_amount), 0).toFixed(0)}</div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableActions} style={{flexWrap: 'wrap', gap: '10px'}}>
                    <div className={styles.searchBar} style={{width: '100%', maxWidth: '400px'}}>
                        <Search size={18} />
                        <input type="text" placeholder="Search orders..." />
                    </div>
                    <select className={styles.filterSelect} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>

                    <button 
                        className={styles.navItem} 
                        style={{background: '#224b33', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}
                        onClick={downloadOrdersCSV}
                    >
                        <Download size={18} /> Download All Excel
                    </button>

                    <button 
                        className={styles.navItem} 
                        style={{background: '#3182ce', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: syncing ? 0.7 : 1}}
                        onClick={handleSyncDelivery}
                        disabled={syncing}
                    >
                        <RefreshCw size={18} className={syncing ? styles.animateSpin : ''} /> 
                        {syncing ? 'Syncing...' : 'Sync Delivery Status'}
                    </button>

                    <button 
                        className={styles.navItem} 
                        style={{background: '#f6ad55', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}
                        onClick={downloadGSTReport}
                    >
                        <TrendingUp size={18} /> Download GST Report (CA Feed)
                    </button>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className={styles.orderIdCell}>#KF-{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <strong style={{color: '#1c2b41'}}>{order.user_addresses?.full_name || 'Guest'}</strong>
                                            <span>{order.user_addresses?.phone}</span>
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
                                    <td>
                                        <div className={styles.actionGroup}>
                                            {order.waybill && (
                                                <button 
                                                    className={styles.viewDetailsBtn} 
                                                    onClick={() => fetchTrackingInfo(order)}
                                                    title="Track Shipment Live"
                                                    style={{background: '#ebf8ff', borderColor: '#bee3f8', color: '#2b6cb0'}}
                                                >
                                                    <ExternalLink size={16} /> Track
                                                </button>
                                            )}
                                            <button className={styles.viewDetailsBtn} onClick={() => deleteOrder(order.id)} title="Delete Order">
                                                <Trash2 size={16} color="#e53e3e" />
                                            </button>
                                            <button className={styles.viewDetailsBtn} onClick={() => window.open(`/admin/invoice/${order.id}`, '_blank')} title="Download Invoice">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div style={{padding: '40px', textAlign: 'center', color: '#718096'}}>No orders found.</div>
                )}
            </div>

            {/* Live Tracking Modal */}
            {(trackingLoading || trackingData) && (
                <div className={styles.modalOverlay} onClick={() => { setTrackingData(null); setTrackingLoading(false); }}>
                    <div className={styles.modalContent} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Live Shipment Status</h2>
                            <button className={styles.closeBtn} onClick={() => { setTrackingData(null); setTrackingLoading(false); }}>
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {trackingLoading ? (
                                <div style={{ padding: '40px', textAlign: 'center' }}>
                                    <Loader2 className={styles.animateSpin} size={40} />
                                    <p style={{ marginTop: '10px' }}>Fetching live data from Delhivery...</p>
                                </div>
                            ) : trackingData && trackingData.ShipmentData && trackingData.ShipmentData[0] ? (
                                <>
                                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase' }}>Waybill</p>
                                            <strong style={{ fontSize: '18px' }}>{trackingData.ShipmentData[0].Shipment.Waybill}</strong>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', textAlign: 'right' }}>Expected Delivery</p>
                                            <strong style={{ fontSize: '18px', color: '#224b33' }}>
                                                {trackingData.ShipmentData[0].Shipment.ExpectedDeliveryDate 
                                                    ? new Date(trackingData.ShipmentData[0].Shipment.ExpectedDeliveryDate).toLocaleDateString()
                                                    : 'Not updated'}
                                            </strong>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <h4 style={{ marginBottom: '15px' }}>Current Status</h4>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                                            <div style={{ background: '#e6fffa', color: '#2c7a7b', padding: '10px', borderRadius: '50%' }}>
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{trackingData.ShipmentData[0].Shipment.Status.Status}</strong>
                                                <p style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>{trackingData.ShipmentData[0].Shipment.Status.Instructions}</p>
                                                <span style={{ fontSize: '12px', color: '#a0aec0' }}>Last Update: {new Date(trackingData.ShipmentData[0].Shipment.Status.StatusDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {trackingData.ShipmentData[0].Shipment.Scans && trackingData.ShipmentData[0].Shipment.Scans.length > 0 && (
                                        <div style={{ marginTop: '25px' }}>
                                            <h4 style={{ marginBottom: '15px' }}>Tracking History</h4>
                                            <div className={styles.scanHistory} style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {trackingData.ShipmentData[0].Shipment.Scans.map((scan: any, i: number) => (
                                                    <div key={i} style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '20px', paddingBottom: '15px', position: 'relative' }}>
                                                        <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', background: i === 0 ? '#3182ce' : '#cbd5e0', borderRadius: '50%' }}></div>
                                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{scan.ScanDetail.Scan}</div>
                                                        <div style={{ fontSize: '12px', color: '#718096' }}>{scan.ScanDetail.ScannedLocation} | {new Date(scan.ScanDetail.StatusDateTime).toLocaleString()}</div>
                                                    </div>
                                                )).reverse()}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <p>No tracking details found for this order.</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.secondaryBtn} onClick={() => { setTrackingData(null); setTrackingLoading(false); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

