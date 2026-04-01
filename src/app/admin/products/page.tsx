"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Plus, Edit2, Package, Tag, IndianRupee, Layers, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../orders/admin.module.css';
import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function AdminInventory() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const fetchAllProducts = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== 'imvanand1@gmail.com') {
            router.push('/admin/login');
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllProducts();
    }, [supabase]);

    const handleEditClick = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct({
            id: `kf-new-${Date.now()}`,
            name_en: '', name_hi: '', price: 0, mrp: 0, discount_percentage: 0,
            unit_price_text_en: '', full_name_en: '', full_name_hi: '',
            tagline_en: '', tagline_hi: '', main_image: '', images: []
        });
        setIsModalOpen(true);
    };

    const handleSaveProduct = async () => {
        try {
            const { error } = await supabase.from('products').upsert({
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                mrp: parseFloat(editingProduct.mrp),
                discount_percentage: parseInt(editingProduct.discount_percentage)
            }, { onConflict: 'id' });

            if (!error) {
                setIsModalOpen(false);
                fetchAllProducts();
            } else {
                alert("Error: " + error.message);
            }
        } catch (err: any) {
            alert("Error saving: " + err.message);
        }
    };

    if (loading) return (
        <div style={{ padding: '100px', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="#1c2b41" />
            <p>Loading Inventory...</p>
        </div>
    );

    return (
        <AdminLayout title="Inventory (Catalog)">
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Products</div>
                    <div className={styles.statValue}>{products.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Active Listings</div>
                    <div className={styles.statValue}>{products.length}</div>
                </div>
                <div className={styles.statCard}>
                    <button className={styles.primaryBtn} style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}} onClick={handleAddNew}>
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableActions} style={{flexWrap: 'wrap', gap: '10px'}}>
                    <div className={styles.searchBar} style={{width: '100%', maxWidth: '400px'}}>
                        <Search size={18} color="#777" />
                        <input type="text" placeholder="Search products..." />
                    </div>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price / MRP</th>
                                <th>Status</th>
                                <th>Listing SKU</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                            <img src={product.main_image || '/logo/logo.png'} style={{width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee'}} />
                                            <div className={styles.customerInfo}>
                                                <strong style={{color: '#1c2b41'}}>{product.name_en}</strong>
                                                <span style={{fontSize: '0.75rem'}}>{product.unit_price_text_en}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <strong style={{color: '#224b33'}}>₹{product.price}</strong>
                                            <span style={{textDecoration: 'line-through', fontSize: '0.75rem', color: '#999'}}>₹{product.mrp}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.statusBadge} style={{background: '#f0fff4', color: '#2f855a'}}>Active</span>
                                    </td>
                                    <td>
                                        <code style={{background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem'}}>{product.id}</code>
                                    </td>
                                    <td>
                                        <div className={styles.actionGroup}>
                                            <button className={styles.viewDetailsBtn} onClick={() => handleEditClick(product)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className={styles.viewDetailsBtn} onClick={() => window.open(`/product/${product.id}`, '_blank')}>
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal Re-implementing with Mobile Friendly form */}
            {isModalOpen && editingProduct && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
                        <div className={styles.modalHeader}>
                            <h2>{editingProduct.id.includes('new') ? 'New Product' : 'Edit Product'}</h2>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>SKU (Product ID)</label>
                                    <input value={editingProduct.id} onChange={(e) => setEditingProduct({...editingProduct, id: e.target.value})} disabled={!editingProduct.id.includes('new')} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Short Name (En)</label>
                                    <input value={editingProduct.name_en} onChange={(e) => setEditingProduct({...editingProduct, name_en: e.target.value})} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Full Product Title</label>
                                <textarea rows={3} value={editingProduct.full_name_en} onChange={(e) => setEditingProduct({...editingProduct, full_name_en: e.target.value})} />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Selling Price (₹)</label>
                                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>MRP (₹)</label>
                                    <input type="number" value={editingProduct.mrp} onChange={(e) => setEditingProduct({...editingProduct, mrp: e.target.value})} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Main Image URL</label>
                                <input value={editingProduct.main_image} onChange={(e) => setEditingProduct({...editingProduct, main_image: e.target.value})} />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={handleSaveProduct}>Save Product</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
