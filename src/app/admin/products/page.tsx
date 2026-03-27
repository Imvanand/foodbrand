"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, ChevronDown, Bell, HelpCircle, Settings, Mail, Plus, Edit2, Download, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './amazon.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsAmazonStyle() {
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
            // Mock data for display while redirected or just show anyway
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
            tagline_en: '', tagline_hi: '', offer_title_en: '', offer_text_en: '',
            moq_notice_en: '', offer_title_hi: '', offer_text_hi: '', moq_notice_hi: '',
            main_image: '', images: []
        });
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${editingProduct.id}/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Upload Error:', uploadError);
                    alert(`Error uploading ${file.name}: ${uploadError.message}. Make sure you ran the SQL script to create the bucket!`);
                    continue;
                }

                const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
                if (data?.publicUrl) {
                    uploadedUrls.push(data.publicUrl);
                }
            }

            if (uploadedUrls.length > 0) {
                if (isMain) {
                    setEditingProduct((prev: any) => ({ ...prev, main_image: uploadedUrls[0] }));
                } else {
                    setEditingProduct((prev: any) => ({ 
                        ...prev, 
                        images: [...(prev.images || []), ...uploadedUrls].slice(0, 9) 
                    }));
                }
            }
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProduct = async () => {
        try {
            const payload = {
                ...editingProduct,
                price: parseFloat(editingProduct.price),
                mrp: parseFloat(editingProduct.mrp),
                discount_percentage: parseInt(editingProduct.discount_percentage)
            };

            const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });

            if (error) {
                alert("Failed to save product.");
            } else {
                alert("Product saved successfully!");
                setIsModalOpen(false);
                fetchAllProducts();
            }
        } catch (err: any) {
            alert("Error saving: " + err.message);
        }
    };

    return (
        <div className={styles.container}>
            {/* Top Navigation */}
            <header className={styles.topBar}>
                <div className={styles.topLeft}>
                    <div className={styles.logo}>kalsa foods central</div>
                    <div>India <ChevronDown size={14} style={{display:'inline'}}/></div>
                    <div style={{width:'1px', height:'20px', background:'#555', margin:'0 10px'}}/>
                    <div className={styles.accountHealth}>
                        Account Health <span className={styles.healthBadge}>Healthy</span>
                    </div>
                </div>

                <div className={styles.topSearch}>
                    <Search size={16} color="#0f1111" style={{margin:'8px'}} />
                    <input type="text" placeholder="Search for anything" />
                </div>

                <div className={styles.topRight}>
                    <div className={styles.topRightItem}><Settings size={16}/> Manage <ChevronDown size={14}/></div>
                    <div className={styles.topRightItem}><Plus size={16}/> Create <ChevronDown size={14}/></div>
                    <Link href="/admin/tickets" className={styles.topRightItem}><Mail size={16}/> Tickets</Link>
                    <div className={styles.topRightItem}><HelpCircle size={16}/> Help</div>
                    <Settings size={18} />
                </div>
            </header>

            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleRow}>
                    <h1>Manage products ({products.length})</h1>
                    <div className={styles.headerActions}>
                        <a href="#" className={styles.linkBtn}>Manage compliance</a>
                        <a href="#" className={styles.linkBtn}>View selling applications</a>
                        <button className={styles.secondaryBtn} onClick={handleAddNew}>Add product <ChevronDown size={12} style={{display:'inline', marginLeft:'4px'}}/></button>
                        <button className={styles.secondaryBtn}>All products <ChevronDown size={12} style={{display:'inline', marginLeft:'4px'}}/></button>
                        <button className={styles.secondaryBtn} style={{color:'#888c8c'}}>Bulk actions <ChevronDown size={12} style={{display:'inline', marginLeft:'4px'}}/></button>
                        <button className={styles.secondaryBtn}>Save <ChevronDown size={12} style={{display:'inline', marginLeft:'4px'}}/></button>
                    </div>
                </div>
                
                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${styles.active}`}>All ({products.length})</div>
                    <div className={styles.tab}>Fix (0)</div>
                    <div className={styles.tab}>Optimise (0)</div>
                </div>
            </div>

            {/* Content Area */}
            <div className={styles.tabContent}>
                <div className={styles.filterRow}>
                    <div className={styles.filterLeft}>
                        <button className={styles.secondaryBtn}>Status <ChevronDown size={12} style={{display:'inline'}}/></button>
                        <button className={styles.secondaryBtn}>Fulfilment <ChevronDown size={12} style={{display:'inline'}}/></button>
                        <button className={styles.secondaryBtn} style={{padding:'4px 8px'}}><Plus size={16}/></button>
                        <div className={styles.searchBox}>
                            <Search size={16} color="#565959"/>
                            <input type="text" placeholder="Search" />
                        </div>
                    </div>
                    
                    <div className={styles.headerActions}>
                        <div style={{color:'#565959', fontSize:'13px', display:'flex', alignItems:'center', gap:'8px'}}>
                            <ChevronLeft size={16}/> 1 <ChevronRight size={16}/>
                        </div>
                        <Download size={18} color="#565959"/>
                        <Settings size={18} color="#565959"/>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th style={{width:'30px'}}><input type="checkbox"/></th>
                                <th>Product <span>ASIN | SKU</span></th>
                                <th>Listing status <span>Next steps</span></th>
                                <th>Sales <span>Last 30 days</span></th>
                                <th>Inventory <span>Available units</span></th>
                                <th>Price + shipping <Edit2 size={12}/> <ChevronDown size={12}/> <span>Featured offer</span></th>
                                <th>Estimated fees <span>Per unit</span></th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td><input type="checkbox"/></td>
                                    <td>
                                        <div className={styles.productCell}>
                                            <Star size={16} color="#565959" style={{marginTop:'4px'}}/>
                                            <img src={product.main_image || '/Product_images/Front.png'} className={styles.productImg} alt="product" />
                                            <div className={styles.productDetails}>
                                                <a href="#" className={styles.productTitle} onClick={(e)=>{e.preventDefault(); handleEditClick(product);}}>{product.full_name_en || product.name_en}</a>
                                                <div className={styles.skuInfo}>B0GS27VHFP | {product.id.slice(0, 10).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.statusPill}>Active</div>
                                    </td>
                                    <td>-</td>
                                    <td>
                                        <div className={styles.editableValue}>
                                            86 (FBM) <Edit2 size={14} className={styles.editIcon}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.productDetails}>
                                            <div className={styles.editableValue}>
                                                ₹{product.price}.00 <Edit2 size={14} className={styles.editIcon}/>
                                            </div>
                                            <span style={{color:'#565959'}}>-</span>
                                            <a href="#" className={styles.linkBtn}>Edit prices</a>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.productDetails}>
                                            <div>₹1.18</div>
                                            <a href="#" className={styles.linkBtn}>Calculate revenue</a>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actionsCell}>
                                            <button className={styles.actionBtn} onClick={() => handleEditClick(product)}>Edit</button>
                                            <button className={styles.dropdownBtn}><ChevronDown size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && !loading && (
                    <div style={{textAlign:'center', padding:'40px', color:'#565959'}}>
                        No products found. Add a product to get started.
                    </div>
                )}
                {loading && (
                    <div style={{textAlign:'center', padding:'40px', color:'#565959'}}>
                        Loading products...
                    </div>
                )}
            </div>

            {/* Modal for Edit/Add (Kept Simple for Utility) */}
            {isModalOpen && editingProduct && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingProduct.id.startsWith('kf-new') ? 'Add New Product' : `Edit Product: ${editingProduct.id}`}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', cursor:'pointer'}}>✖</button>
                        </div>
                        <div className={styles.modalBody}>
                            {/* Reusing simple layout for form */}
                            <div style={{display:'flex', gap:'10px', flexDirection:'column'}}>
                                <label style={{fontSize:'12px', fontWeight:'bold'}}>Product ID (SKU)</label>
                                <input style={{padding:'8px', border:'1px solid #d5d9d9', borderRadius:'4px'}} value={editingProduct.id} onChange={(e) => setEditingProduct({...editingProduct, id:e.target.value})} disabled={!editingProduct.id.startsWith('kf-new')}/>
                                
                                <label style={{fontSize:'12px', fontWeight:'bold'}}>Full Title</label>
                                <textarea style={{padding:'8px', border:'1px solid #d5d9d9', borderRadius:'4px'}} rows={2} value={editingProduct.full_name_en} onChange={(e) => setEditingProduct({...editingProduct, full_name_en:e.target.value})} />
                                
                                <div style={{display:'flex', gap:'20px'}}>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold'}}>Price (₹)</label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price:e.target.value})} />
                                    </div>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold'}}>MRP (₹)</label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} type="number" value={editingProduct.mrp} onChange={(e) => setEditingProduct({...editingProduct, mrp:e.target.value})} />
                                    </div>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold'}}>Discount %</label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} type="number" value={editingProduct.discount_percentage} onChange={(e) => setEditingProduct({...editingProduct, discount_percentage:e.target.value})} />
                                    </div>
                                </div>
                                <div style={{display:'flex', gap:'20px'}}>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold'}}>Offer Text (EN)</label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} value={editingProduct.offer_text_en || ''} onChange={(e) => setEditingProduct({...editingProduct, offer_text_en:e.target.value})} placeholder="e.g. Free Delivery All Over India"/>
                                    </div>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold'}}>MoQ Notice (EN)</label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} value={editingProduct.moq_notice_en || ''} onChange={(e) => setEditingProduct({...editingProduct, moq_notice_en:e.target.value})} placeholder="e.g. Launch Offer: Free Delivery"/>
                                    </div>
                                </div>
                                <div style={{display:'flex', gap:'20px'}}>
                                    <div style={{flex:1}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>
                                            Main Image URL
                                            <label style={{color:'#007185', cursor:'pointer'}}>
                                                {isUploading ? 'Uploading...' : '+ Upload'}
                                                <input type="file" style={{display:'none'}} accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={isUploading} />
                                            </label>
                                        </label>
                                        <input style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} value={editingProduct.main_image || ''} onChange={(e) => setEditingProduct({...editingProduct, main_image:e.target.value})} placeholder="https://..." />
                                        {editingProduct.main_image && (
                                            <img src={editingProduct.main_image} alt="preview" style={{width:'50px', height:'50px', objectFit:'contain', marginTop:'8px', border:'1px solid #d5d9d9', borderRadius:'4px'}} />
                                        )}
                                    </div>

                                    <div style={{flex:2}}>
                                        <label style={{fontSize:'12px', fontWeight:'bold', display:'flex', justifyContent:'space-between'}}>
                                            Additional Gallery Images (1 URL per line, max 9)
                                            <label style={{color:'#007185', cursor:'pointer'}}>
                                                {isUploading ? 'Uploading...' : '+ Upload Images'}
                                                <input type="file" multiple style={{display:'none'}} accept="image/*" onChange={(e) => handleImageUpload(e, false)} disabled={isUploading} />
                                            </label>
                                        </label>
                                        <textarea style={{padding:'8px', width:'100%', border:'1px solid #d5d9d9', borderRadius:'4px'}} rows={3} value={(editingProduct.images || []).join('\n')} 
                                            onChange={(e) => setEditingProduct({...editingProduct, images: e.target.value.split('\n')})}
                                            onBlur={(e) => setEditingProduct({...editingProduct, images: e.target.value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,9)})}
                                            placeholder="Upload multiple images or paste URLs"
                                        />
                                        <div style={{display:'flex', gap:'8px', marginTop:'8px', flexWrap:'wrap'}}>
                                            {(editingProduct.images || []).map((imgUrl: string, i: number) => {
                                                if(!imgUrl.trim()) return null;
                                                return <img key={i} src={imgUrl} alt="preview" style={{width:'50px', height:'50px', objectFit:'contain', border:'1px solid #d5d9d9', borderRadius:'4px'}} />;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className={styles.primaryBtn} onClick={handleSaveProduct}>Save & Finish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
