"use client";

import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Loader2, Package, Search, ExternalLink, ShoppingCart, CheckCircle, Phone } from 'lucide-react';
import { generateInvoicePDF } from '@/lib/invoiceUtils';
import styles from './orders.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'buy-again'>('orders');
  const [feedbackModal, setFeedbackModal] = useState<{isOpen: boolean, type: string, orderId?: string, productId?: string}>({ isOpen: false, type: '' });
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isSuccessRedirect = window.location.search.includes('success=true');
      setUser(session?.user || null);

      if (session) {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_items (*)`)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error && data) setOrders(data);
      } else if (!isSuccessRedirect) {
        // Redirect non-logged-in users away from the orders page if not a checkout success
        window.location.href = '/';
        return;
      }
      setLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  const getStatusLabel = (order: any) => {
    if (order.status === 'delivered') return { text: 'Delivered', color: '#007600' };
    if (order.status === 'shipped') return { text: 'Shipped', color: '#0066c0' };
    return { text: 'Order Placed', color: '#c45500' };
  };

  const handleDownloadInvoice = async (e: React.MouseEvent, order: any) => {
    e.preventDefault();
    try {
      // Fetch corresponding address
      const { data: address } = await supabase.from('user_addresses').select('*').eq('id', order.address_id).single();
      
      const item = order.order_items?.[0] || {};
      const totalAmount = order.total_amount;
      const subtotal = totalAmount / 1.18;
      const gstAmount = totalAmount - subtotal;
      const quantity = item.quantity || 1;
      const price = totalAmount / quantity; 

      await generateInvoicePDF({
        customerName: address?.full_name || 'Valued Customer',
        customerPhone: address?.phone || 'N/A',
        customerAddress: address ? `${address.flat_house}, ${address.area_street}, ${address.city}` : 'N/A',
        customerPincode: address?.pincode || 'N/A',
        productName: item.name || 'Spice Mix Masala 100g',
        quantity: quantity,
        price: price,
        subtotal: subtotal,
        gstAmount: gstAmount,
        deliveryCharge: 0,
        totalAmount: totalAmount,
        orderDate: new Date(order.created_at).toLocaleDateString(),
        orderId: `KF-${order.id.slice(0, 8).toUpperCase()}`
      });
    } catch (err) {
      alert("Failed to download invoice. Please try again.");
    }
  };

  const alertComingSoon = () => {
    alert("Feedback & Support portals are currently under development and will be available soon!");
  };

  const openFeedback = (type: string, orderId?: string, productId?: string) => {
    setFeedbackModal({ isOpen: true, type, orderId, productId });
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const submitFeedback = async () => {
    if (feedbackRating === 0) {
      alert("Please select a rating.");
      return;
    }
    setIsSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase.from('feedbacks').insert([{
        user_id: session.user.id,
        order_id: feedbackModal.orderId || null,
        product_id: feedbackModal.productId || null,
        feedback_type: feedbackModal.type,
        rating: feedbackRating,
        comment: feedbackComment
      }]);
      if (!error) {
        alert("Thank you for your feedback! It has been successfully submitted.");
        setFeedbackModal({ isOpen: false, type: '' });
      } else {
        alert("Failed to submit feedback: " + error.message);
      }
    }
    setIsSubmitting(false);
  };

  const handleBuyAgain = (item: any) => {
    addToCart({
      product_id: item.product_id || 'kalsa-spicemix-100g',
      name: item.name || 'Kalsa All-Purpose Spice Mix',
      price: item.price || 139,
      quantity: 1, // Defaulting to 1 to let them increase
      image: item.image || '/Product_images/Front.png'
    });
    setIsCartOpen(true);
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ padding: '80px', textAlign: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="#224b33" />
        <p style={{ marginTop: '10px' }}>Fetching your orders...</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Success Alert if just ordered */}
        {window.location.search.includes('success=true') && (
          <>
            <div className={styles.successAlert}>
              <div className={styles.successIcon}><CheckCircle size={48} color="#224b33" /></div>
              <div className={styles.successText}>
                <h2 className={styles.successTitle}>Order placed successfully!</h2>
                <p className={styles.successSub}>Thank you for shopping with Kalsa Foods.</p>
                
                <div className={styles.orderIdDisplay}>
                  <span>Order ID:</span>
                  <strong>KF-{window.location.search.split('id=')[1]?.slice(0, 8).toUpperCase() || 'N/A'}</strong>
                </div>

                <div className={styles.nextSteps}>
                  <p>✅ Check your email for order details and invoice.</p>
                  <p>💡 Tip: You can track this order anytime from our website using your Mobile Number or Order ID.</p>
                </div>

                <div className={styles.successActions}>
                  <Link href="/" className={styles.continueBtn}>Continue Shopping</Link>
                </div>
              </div>
            </div>

            {/* Standalone Track Order Card */}
            <div className={styles.trackCardStandalone}>
              <div className={styles.trackCardIcon}><Package size={32} color="#224b33" /></div>
              <div className={styles.trackCardContent}>
                <h3>Need to track your package?</h3>
                <p>Enter your Order ID or registered Mobile Number below to get live delivery updates.</p>
                <form 
                  className={styles.successTrackForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = (e.target as any).tracker.value;
                    if (q) window.location.href = `/track?q=${q.toUpperCase()}`;
                  }}
                >
                  <input name="tracker" type="text" placeholder="e.g. KF-FEA0BE25 or 9876543210" />
                  <button type="submit">Track Order Now</button>
                </form>
              </div>
            </div>
          </>
        )}
        {/* Breadcrumb - Only for logged in users */}
        {user && (
          <div className={styles.breadcrumb}>
            <Link href="/profile">Your Account</Link> ›{' '}
            <span className={styles.current}>Your Orders</span>
          </div>
        )}

        {/* Header */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{user ? "Your Orders" : "Order Status"}</h1>
          {user && (
            <div className={styles.searchBox}>
              <Search size={18} color="#777" />
              <input type="text" placeholder="Search all orders" />
              <button>Search Orders</button>
            </div>
          )}
        </div>

        <div className={styles.tabs} style={{ borderBottom: '2px solid #ddd', marginBottom: '1rem', marginTop: '1.5rem' }}>
          <div className={`${styles.tab} ${styles.tabActive}`} style={{ display: 'inline-block', padding: '10px 0', borderBottom: '2px solid #c45500', fontWeight: 'bold', color: '#c45500', marginBottom: '-2px' }}>
            Orders
          </div>
        </div>

        {/* Orders count */}
        {orders.length > 0 && (
          <p className={styles.orderCount}>
            <strong>{orders.length} order{orders.length > 1 ? 's' : ''}</strong> placed in{' '}
            <span className={styles.filterPill}>past 3 months ▾</span>
          </p>
        )}

        {user && (
          <>
            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <ShoppingBag size={80} color="#e5e5e5" strokeWidth={1} fill="#f9f9f9" />
                <h2>You haven't placed any orders yet</h2>
                <p>Ready to try Kalsa Masala? Start your healthy cooking journey today!</p>
                <Link href="/" className={styles.shopBtn}>Explore Products</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => {
                  const statusInfo = getStatusLabel(order);
                  const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  });
                  const datePlus5 = new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000);
                  const datePlus7 = new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000);
                  const expectedTimeRange = `${datePlus5.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${datePlus7.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

                  return (
                    <div key={order.id} className={styles.orderCard}>
                      {/* Card Header */}
                      <div className={styles.cardHeader}>
                        <div className={styles.headerInfo}>
                          <div className={styles.infoCol}>
                            <span className={styles.infoLabel}>ORDER PLACED</span>
                            <span className={styles.infoValue}>{orderDate}</span>
                          </div>
                          <div className={styles.infoCol}>
                            <span className={styles.infoLabel}>TOTAL</span>
                            <span className={styles.infoValue}>₹{order.total_amount}</span>
                          </div>
                          <div className={styles.infoCol}>
                            <span className={styles.infoLabel}>SHIP TO</span>
                            <span className={styles.blueLink}>
                              {order.order_items?.[0]?.name?.split(' ')[0] || 'Customer'} <span style={{fontSize:'8px', display:'inline-block', transform:'translateY(-2px)'}}>▼</span>
                            </span>
                          </div>
                        </div>
                        <div className={styles.headerRight}>
                          <div className={styles.orderIdText}>ORDER # KF-{order.id.slice(0, 8).toUpperCase()}</div>
                          <div className={styles.orderLinks}>
                            <Link href="#" className={styles.blueLink} onClick={alertComingSoon}>View order details</Link>
                            <span className={styles.divider}>|</span>
                            <a href="#" className={styles.blueLink} onClick={(e) => handleDownloadInvoice(e, order)}>Invoice <span style={{fontSize:'8px', display:'inline-block', transform:'translateY(-2px)'}}>▼</span></a>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className={styles.cardBody}>
                        <div className={styles.itemsColumn}>
                          {/* Delivery Status - at the top */}
                          <div className={styles.deliveryStatus}>
                            <span style={{ color: '#0f1111', fontWeight: 700, fontSize: '1.15rem' }}>
                              {order.status === 'delivered'
                                ? `Delivered ${new Date(order.updated_at || order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`
                                : order.status === 'shipped'
                                ? 'Shipped - In Transit'
                                : `Preparing for Dispatch`}
                            </span>
                            <p className={styles.deliveryNote}>
                              {order.status === 'delivered'
                                ? 'Package was successfully delivered.'
                                : order.waybill
                                ? 'Please click "Track package" for live courier updates and delivery dates.'
                                : `Expected approx. delivery: ${expectedTimeRange}`}
                            </p>
                          </div>

                          {/* Each item: image → name + button */}
                          {(order.order_items || []).map((item: any) => (
                            <div key={item.id} className={styles.orderItem}>
                              {/* Product Image */}
                              <img
                                src={item.image || '/Product_images/Front.png'}
                                alt={item.name || 'Product'}
                                className={styles.itemImage}
                                onError={(e) => { (e.target as HTMLImageElement).src = '/Product_images/Front.png'; }}
                              />
                              {/* Product Info - right of image */}
                              <div className={styles.itemDetails}>
                                <Link href="/" className={styles.itemName}>{item.name}</Link>
                                <p className={styles.returnNote}>
                                  Return window closed on{' '}
                                  {new Date(new Date(order.created_at).getTime() + 10 * 24 * 60 * 60 * 1000)
                                    .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                                {/* Buy it again + View your item - directly below product name */}
                                <div className={styles.itemActions}>
                                  <button className={styles.buyAgainBtn} onClick={() => handleBuyAgain(item)}>
                                    <ShoppingCart size={15} color="#0f1111" />
                                    <span style={{color: '#0f1111'}}>Buy it again</span>
                                  </button>
                                  <Link href="/" className={styles.viewItemBtn}>View your item</Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right Actions Column */}
                        <div className={styles.actionsColumn}>
                          {order.waybill ? (
                            <a
                              href={`https://www.delhivery.com/track/package/${order.waybill}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.actionBtn}
                            >
                              Track package
                            </a>
                          ) : (
                            <button className={styles.actionBtn} onClick={() => alert('Tracking will be available once the item is shipped by Delhivery.')}>
                              Track package
                            </button>
                          )}
                          <button className={styles.actionBtn} onClick={() => alert('Help center coming soon')}>Ask Product Question</button>
                          <button className={styles.actionBtn} onClick={() => openFeedback('seller', order.id)}>Leave seller feedback</button>
                          <button className={styles.actionBtn} onClick={() => openFeedback('delivery', order.id)}>Leave delivery feedback</button>
                          <button className={styles.actionBtn} onClick={() => openFeedback('product', order.id, order.order_items?.[0]?.product_id || 'kalsa')}>Write a product review</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        
        {/* Feedback Modal */}
        {feedbackModal.isOpen && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{background: 'white', padding: '24px', borderRadius: '8px', maxWidth: '400px', width: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
              <h2 style={{fontSize: '1.2rem', marginBottom: '16px', fontWeight: 600}}>
                {feedbackModal.type === 'seller' && "Leave Seller Feedback"}
                {feedbackModal.type === 'delivery' && "Leave Delivery Feedback"}
                {feedbackModal.type === 'product' && "Write a Product Review"}
              </h2>
              
              <div style={{display:'flex', gap:'8px', marginBottom: '16px'}}>
                {[1,2,3,4,5].map(star => (
                   <span 
                     key={star} 
                     onClick={() => setFeedbackRating(star)} 
                     style={{fontSize: '32px', cursor: 'pointer', color: star <= feedbackRating ? '#FFA41C' : '#d5d9d9', transition: 'color 0.2s'}}
                   >
                     ★
                   </span>
                ))}
              </div>
              
              <textarea 
                placeholder="What did you like or dislike? How can we improve?"
                style={{width: '100%', height: '100px', padding: '12px', border: '1px solid #d5d9d9', borderRadius: '4px', resize: 'none', marginBottom: '16px', fontSize: '0.9rem'}}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />

              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                <button 
                  onClick={() => setFeedbackModal({ isOpen: false, type: '' })}
                  style={{padding: '8px 16px', background: 'white', border: '1px solid #d5d9d9', borderRadius: '100px', cursor: 'pointer', fontSize: '0.85rem'}}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                  style={{padding: '8px 16px', background: '#FFD814', border: '1px solid #FCD200', borderRadius: '100px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'}}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
