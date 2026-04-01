"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Plus, Loader2, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import styles from './checkout.module.css';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { cart, cartCount, loading: cartLoading } = useCart();
    const [user, setUser] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('prepaid');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const journeyRef = React.useRef<string | null>(null);
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const freeDeliveryThreshold = 3;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const deliveryCharge = 0;
    const total = subtotal + deliveryCharge;
    const gstAmount = total - (total / 1.18); // GST included in price

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            
            // Treat Admin as a Guest on the storefront
            if (!session || session.user.email === 'imvanand1@gmail.com') {
                setUser(null);
                setIsGuest(true);
                setLoading(false);
                return;
            }
            
            setUser(session.user);
            
            // Fetch addresses for regular users
            const { data: addrData } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false });
            
            if (addrData) {
                setAddresses(addrData);
                if (addrData.length > 0) setSelectedAddressId(addrData[0].id);
            }
            setLoading(false);
        };
        init();
    }, [router, supabase]);

    const getFormErrors = () => {
        const errors: Record<string, string> = {};
        
        if (!user) {
            if (!guestInfo.name.trim()) errors.name = "Full name is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email.trim())) errors.email = "Please enter a valid email address";
            if (!/^[6-9]\d{9}$/.test(guestInfo.phone.trim())) errors.phone = "Please enter a valid 10-digit mobile number";
            if (!guestInfo.address.trim()) errors.address = "Street address is required";
            if (!guestInfo.city.trim()) errors.city = "City is required";
            if (!guestInfo.state.trim()) errors.state = "State is required";
            if (!/^\d{6}$/.test(guestInfo.pincode.trim())) errors.pincode = "Please enter a valid 6-digit pincode";
        } else if (!selectedAddressId) {
            errors.address = "Please select a delivery address";
        }

        return errors;
    };

    const handleFetchLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await res.json();

                if (data && data.address) {
                    setGuestInfo(prev => ({
                        ...prev,
                        pincode: data.address.postcode || prev.pincode,
                        city: data.address.city || data.address.town || data.address.village || data.address.county || prev.city,
                        state: data.address.state || prev.state,
                        address: `${data.address.suburb || ''} ${data.address.neighbourhood || ''} ${data.address.road || ''}`.trim() || prev.address,
                    }));
                }
            } catch (err) {
                console.error('Location fetch error:', err);
            } finally {
                setIsLocating(false);
            }
        }, () => {
            alert('Please allow location access to use this feature.');
            setIsLocating(false);
        });
    };

    const validateField = (name: string, value: string) => {
        const newErrors = { ...formErrors };
        
        if (name === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                newErrors.email = "Please enter a valid email address";
            } else {
                newErrors.email = "";
            }
        }
        
        if (name === 'phone') {
            if (!/^[6-9]\d{9}$/.test(value.trim())) {
                newErrors.phone = "Please enter a valid 10-digit mobile number";
            } else {
                newErrors.phone = "";
            }
        }

        if (name === 'pincode') {
            if (!/^\d{6}$/.test(value.trim())) {
                newErrors.pincode = "Invalid pincode";
            } else {
                newErrors.pincode = "";
            }
        }
        
        setFormErrors(newErrors);
    };
    
    // --- Journey Logging Helpers ---
    const logJourney = async (status: string, extra: any = {}) => {
        try {
            const body = {
                id: journeyRef.current,
                user_mobile: guestInfo.phone || user?.phone || 'Anon',
                user_email: guestInfo.email || user?.email || '',
                items: cart.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
                amount: total,
                status,
                ...extra
            };

            const res = await fetch('/api/checkout/journey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success && data.data?.id) {
                journeyRef.current = data.data.id;
            }
            return data.data?.id || journeyRef.current;
        } catch (e) {
            console.error("Journey Log Failed:", e);
        }
    };

    const createAutoTicket = async (err: string, jId: string | null) => {
        try {
            const res = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: guestInfo.name || user?.user_metadata?.full_name || 'Guest',
                    customer_mobile: guestInfo.phone || user?.phone || 'Anon',
                    subject: 'Auto-Failed Checkout',
                    message: `System caught a failure. Error: ${err}. Journey ID: ${jId || 'Unknown'}`,
                    priority: 'high',
                    journey_id: jId
                })
            });
            const data = await res.json();
            return data.data?.ticket_id || 'TICKET-ERR';
        } catch (e) {
            return 'TICKET-ERR';
        }
    };
    // ------------------------------

    const handlePlaceOrder = async () => {
        const errors = getFormErrors();
        setFormErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            alert(firstError);
            return;
        }

        setIsPlacingOrder(true);
        const currentJId = await logJourney('Initiated');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUserId = session?.user?.id || null;

            if (paymentMethod === 'prepaid') {
                // Razorpay Payment
                const razorpayResponse = await fetch('/api/razorpay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: total,
                        receipt: `receipt_${Date.now()}`
                    })
                });

                const rzpOrder = await razorpayResponse.json();
                if (!rzpOrder.id) {
                    await logJourney('System_Error', { error_message: 'Razorpay order creation failed' });
                    throw new Error('Razorpay order creation failed');
                }

                await logJourney('Gateway_Ready', { razorpay_order_id: rzpOrder.id });

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: "Kalsa Foods",
                    description: "Order for Kalsa Spices",
                    image: "/logo/logo.png",
                    order_id: rzpOrder.id,
                    handler: async function (response: any) {
                        await logJourney('Payment_Success', { razorpay_payment_id: response.razorpay_payment_id });
                        await finalizeOrder(currentUserId, response.razorpay_payment_id);
                    },
                    modal: {
                        ondismiss: async function() {
                            await logJourney('Cancelled_By_User');
                        }
                    },
                    prefill: {
                        name: user ? (user.user_metadata?.full_name || user.email.split('@')[0]) : guestInfo.name,
                        email: user ? user.email : guestInfo.email,
                        contact: user ? '' : guestInfo.phone
                    },
                    theme: {
                        color: "#224b33"
                    }
                };

                const rzp = new window.Razorpay(options);
                
                rzp.on('payment.failed', async function (response: any) {
                    console.error("Payment Failed Callback:", response.error);
                    await logJourney('Payment_Failed', { error_message: response.error.description });
                    const tId = await createAutoTicket(response.error.description, journeyRef.current);
                    alert(`Payment failed: ${response.error.description}. A ticket ${tId} has been created.`);
                });

                rzp.open();
                setIsPlacingOrder(false);
            } else {
                // Cash on Delivery
                await logJourney('COD_Selected');
                await finalizeOrder(currentUserId, 'COD');
            }

        } catch (err: any) {
            console.error("Order error:", err);
            await logJourney('System_Error', { error_message: err.message });
            const tId = await createAutoTicket(err.message, journeyRef.current);
            alert(`Failed to place order: ${err.message}. Ticket ID: ${tId}`);
            setIsPlacingOrder(false);
        }
    };


    const finalizeOrder = async (currentUserId: string | null, paymentId: string) => {
        setIsPlacingOrder(true);
        try {
            let finalAddressId = selectedAddressId;
            let waybill: string | null = null;

            // If guest, create a temporary address record
            if (!user && !selectedAddressId) {
                const addressData: any = {
                    full_name: guestInfo.name,
                    phone: guestInfo.phone,
                    flat_house: guestInfo.address,
                    area_street: guestInfo.landmark || 'Guest Checkout',
                    city: guestInfo.city,
                    state: guestInfo.state,
                    pincode: guestInfo.pincode,
                    is_default: false
                };
                
                if (currentUserId) {
                    addressData.user_id = currentUserId;
                }

                const { data: addr, error: addrError } = await supabase
                    .from('user_addresses')
                    .insert([addressData])
                    .select()
                    .single();
                
                if (addrError) throw addrError;
                finalAddressId = addr.id;
            }

            // 1. Create order in Supabase
            const orderData: any = {
                address_id: finalAddressId,
                total_amount: total,
                payment_method: `${paymentMethod} (${paymentId})`,
                status: 'pending'
            };

            if (currentUserId) {
                orderData.user_id = currentUserId;
            }

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Add items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear cart
            if (currentUserId) {
                await supabase.from('user_cart').delete().eq('user_id', currentUserId);
            }
            
            // 4. Automation: Create Delhivery Order & Save Waybill
            const buyerName = user ? addresses.find(a => a.id === selectedAddressId)?.full_name : guestInfo.name;
            const buyerPhone = user ? addresses.find(a => a.id === selectedAddressId)?.phone : guestInfo.phone;
            const buyerEmail = user ? user.email : guestInfo.email;
            const buyerAddress = user 
                ? `${addresses.find(a => a.id === selectedAddressId)?.flat_house}, ${addresses.find(a => a.id === selectedAddressId)?.area_street}, ${addresses.find(a => a.id === selectedAddressId)?.city}`
                : `${guestInfo.address}, ${guestInfo.city}, ${guestInfo.state}`;
            const buyerPincode = user ? addresses.find(a => a.id === selectedAddressId)?.pincode : guestInfo.pincode;

            try {
                const delhiveryRes = await fetch("/api/shipping/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customerName: buyerName,
                        phone: buyerPhone,
                        address: buyerAddress,
                        pincode: buyerPincode,
                        orderId: `KF-${order.id.slice(0, 8).toUpperCase()}`,
                        paymentMode: paymentMethod,
                        totalAmount: total,
                        productName: cart.map(i => i.name).join(', '),
                        quantity: totalItems.toString()
                    })
                });
                const delhiveryData = await delhiveryRes.json();
                waybill = delhiveryData?.packages?.[0]?.waybill;
                if (waybill) {
                    await supabase.from('orders').update({ waybill }).eq('id', order.id);
                }
            } catch (delhiveryErr) {
                console.error("Delhivery skip:", delhiveryErr);
            }

            // 5. Local CSV Logging
            try {
                fetch("/api/log-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        OrderID: `KF-${order.id.slice(0, 8).toUpperCase()}`,
                        Date: new Date().toLocaleDateString('en-IN'),
                        Product: cart.map(i => `${i.name} (${i.quantity})`).join(', '),
                        Quantity: totalItems.toString(),
                        TotalAmount: total.toFixed(2),
                        CustomerName: buyerName,
                        Phone: buyerPhone,
                        Email: buyerEmail,
                        Address: buyerAddress,
                        PaymentStatus: `Paid via ${paymentMethod} (${paymentId})`
                    }),
                });
            } catch (logErr) {
                console.error("Local log skip:", logErr);
            }

            // 6. Automated Email Confirmation
            try {
                await fetch("/api/email/order-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: `KF-${order.id.slice(0, 8).toUpperCase()}`,
                        customerName: buyerName,
                        customerEmail: buyerEmail,
                        customerPhone: buyerPhone,
                        products: cart,
                        totalAmount: total,
                        shippingAddress: buyerAddress,
                        waybill: waybill // Pass the tracking number if we have it
                    }),
                });
            } catch (emailErr) {
                console.error("Email send skip:", emailErr);
            }

            // Success redirect - Use order ID for guest tracking if needed
            window.location.href = `/orders?success=true&id=${order.id}`;

        } catch (err: any) {
            console.error("Finalize error:", err);
            alert("Order processing failed: " + err.message);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading || cartLoading) return (
        <div className={styles.loaderContainer}>
            <Loader2 className="animate-spin" size={48} color="#224b33" />
            <p>Setting up your secure checkout...</p>
        </div>
    );

    if (cart.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <h1>Your Cart is Empty</h1>
                <p>Add some products to carry on with your purchase.</p>
                <Link href="/" className={styles.btnPrimary}>Shop Now</Link>
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);

    return (
        <div className={styles.container}>
            {/* Simple Checkout Header */}
            <header className={styles.checkoutHeader}>
                <Link href="/">
                    <img src="/logo/logo.png" alt="Kalsa Foods Logo" className={styles.logo} />
                </Link>
                <h1>Checkout ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
                <div className={styles.secureIcon}><ShieldCheck size={20} /> 100% Secure</div>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.leftColumn}>
                    {/* Section 1: Shipping Address */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionNumber}>1</span>
                            <h2>Select a delivery address</h2>
                        </div>
                        <div className={styles.sectionBody}>
                            {user ? (
                                <div className={styles.addressGrid}>
                                    {addresses.map((addr) => (
                                        <div 
                                            key={addr.id} 
                                            className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.active : ''}`}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                        >
                                            <div className={styles.addressName}>{addr.full_name}</div>
                                            <div className={styles.addressDetails}>
                                                {addr.flat_house}, {addr.area_street}<br />
                                                {addr.landmark && <>{addr.landmark}<br/></>}
                                                {addr.city}, {addr.state} {addr.pincode}<br />
                                                Phone: {addr.phone}
                                            </div>
                                            <button className={styles.selectBtn}>
                                                {selectedAddressId === addr.id ? '✓ Selected' : 'Deliver to this address'}
                                            </button>
                                        </div>
                                    ))}
                                    <Link href="/profile/addresses" className={styles.addAddressCard}>
                                        <Plus size={32} />
                                        <span>Add new address</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.guestContainer}>
                                    <div className={styles.guestFormGrid}>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <button 
                                                type="button" 
                                                onClick={handleFetchLocation} 
                                                disabled={isLocating}
                                                className={styles.locationBtn}
                                            >
                                                {isLocating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                                                {isLocating ? 'Locating...' : 'Use my current location'}
                                            </button>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Mobile Number</label>
                                            <input 
                                                type="tel" 
                                                placeholder="10-digit mobile number" 
                                                value={guestInfo.phone}
                                                className={formErrors.phone ? styles.inputError : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setGuestInfo({...guestInfo, phone: val});
                                                    if (formErrors.phone && val.length === 10) setFormErrors({...formErrors, phone: ''});
                                                }}
                                                onBlur={(e) => validateField('phone', e.target.value)}
                                            />
                                            {formErrors.phone && <span className={styles.errorText}>{formErrors.phone}</span>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Email Address</label>
                                            <input 
                                                type="email" 
                                                placeholder="example@gmail.com"
                                                value={guestInfo.email}
                                                className={formErrors.email ? styles.inputError : ''}
                                                onChange={(e) => {
                                                    setGuestInfo({...guestInfo, email: e.target.value});
                                                    if (formErrors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim())) {
                                                        setFormErrors({...formErrors, email: ''});
                                                    }
                                                }}
                                                onBlur={(e) => validateField('email', e.target.value)}
                                            />
                                            {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
                                        </div>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Full Name</label>
                                            <input 
                                                type="text" 
                                                placeholder="First and Last name"
                                                value={guestInfo.name}
                                                className={formErrors.name ? styles.inputError : ''}
                                                onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                                            />
                                            {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                                        </div>
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label>Delivery Address</label>
                                            <input 
                                                type="text" 
                                                placeholder="Flat, House no., Building, Street, Area"
                                                value={guestInfo.address}
                                                className={formErrors.address ? styles.inputError : ''}
                                                onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                                            />
                                            {formErrors.address && <span className={styles.errorText}>{formErrors.address}</span>}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Town/City</label>
                                            <input 
                                                type="text"
                                                value={guestInfo.city}
                                                className={formErrors.city ? styles.inputError : ''}
                                                onChange={(e) => setGuestInfo({...guestInfo, city: e.target.value})}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>State</label>
                                            <input 
                                                type="text"
                                                value={guestInfo.state}
                                                className={formErrors.state ? styles.inputError : ''}
                                                onChange={(e) => setGuestInfo({...guestInfo, state: e.target.value})}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Pincode</label>
                                            <input 
                                                type="text"
                                                placeholder="6-digit pincode"
                                                value={guestInfo.pincode}
                                                className={formErrors.pincode ? styles.inputError : ''}
                                                onChange={(e) => setGuestInfo({...guestInfo, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section 2: Payment Method */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionNumber}>2</span>
                            <h2>Select a payment method</h2>
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.paymentOptions}>
                                <div 
                                    className={`${styles.paymentCard} ${paymentMethod === 'prepaid' ? styles.active : ''}`}
                                    onClick={() => setPaymentMethod('prepaid')}
                                >
                                    <CreditCard size={24} />
                                    <div className={styles.paymentInfo}>
                                        <div className={styles.paymentTitle}>UPI / Credit Card / Debit Card</div>
                                        <div className={styles.paymentDesc}>Safe and secure online payments via Razorpay.</div>
                                    </div>
                                    <div className={styles.radio}></div>
                                </div>

                                {/* COD Disabled temporarily */}
                                {/* <div 
                                    className={`${styles.paymentCard} ${paymentMethod === 'cod' ? styles.active : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <Banknote size={24} />
                                    <div className={styles.paymentInfo}>
                                        <div className={styles.paymentTitle}>Cash on Delivery (COD)</div>
                                        <div className={styles.paymentDesc}>Pay when you receive your order in cash.</div>
                                    </div>
                                    <div className={styles.radio}></div>
                                </div> */}
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Review Items */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionNumber}>3</span>
                            <h2>Review items and delivery</h2>
                        </div>
                        <div className={styles.sectionBody}>
                             <div className={styles.reviewList}>
                                {cart.map(item => (
                                    <div key={item.id} className={styles.reviewItem}>
                                        <img src={item.image} alt={item.name} />
                                        <div className={styles.reviewInfo}>
                                            <div className={styles.reviewName}>{item.name}</div>
                                            <div className={styles.reviewPrice}>₹{item.price} x {item.quantity}</div>
                                            <div className={styles.reviewTotal}>₹{item.price * item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             <div className={styles.deliveryNotice}>
                                🚀 Delivery expected within 3-5 working days.
                             </div>
                        </div>
                    </section>

                    <div className={styles.bottomPlaceOrder}>
                        <button 
                            className={styles.placeOrderBtn}
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                        >
                            {isPlacingOrder ? (
                                <><Loader2 className="animate-spin" size={20} /> Processing...</>
                            ) : (
                                `Place your order - ₹${Math.round(total)}`
                            )}
                        </button>
                        <p className={styles.terms}>
                            By placing your order, you agree to Kalsa Foods's privacy notice and conditions of use.
                        </p>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.summaryCard}>
                        <button 
                            className={styles.placeOrderBtn}
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || (!selectedAddressId && (!isGuest || !guestInfo.address || !guestInfo.name || !guestInfo.phone))}
                        >
                            {isPlacingOrder ? 'Processing...' : 'Place Your Order'}
                        </button>
                        <p className={styles.terms}>By placing your order, you agree to Kalsa Foods' privacy notice and terms of use.</p>
                        
                        <div className={styles.summaryDivider}></div>
                        
                        <div className={styles.summaryTitle}>Order Summary</div>
                        <div className={styles.summaryRow}>
                            <span>Items:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>GST (Included):</span>
                            <span>₹{gstAmount.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Launch Offer Delivery:</span>
                            <span className={styles.free}>
                                FREE
                            </span>
                        </div>
                        
                        <div className={styles.summaryDivider}></div>
                        
                        <div className={styles.summaryRowTotal}>
                            <span>Order Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className={styles.addressPreview}>
                        <div className={styles.previewSection}>
                            <div className={styles.previewTitle}>Deliver to:</div>
                             {selectedAddress ? (
                                <div className={styles.previewText}>
                                    <strong>{selectedAddress.full_name}</strong><br />
                                    {selectedAddress.flat_house}, {selectedAddress.area_street}<br />
                                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}<br />
                                    Phone: {selectedAddress.phone}
                                </div>
                            ) : isGuest && guestInfo.address ? (
                                <div className={styles.previewText}>
                                    <strong>{guestInfo.name}</strong><br />
                                    {guestInfo.address}, {guestInfo.city}<br />
                                    {guestInfo.state} {guestInfo.pincode}<br />
                                    Phone: {guestInfo.phone}
                                </div>
                            ) : (
                                <div className={styles.previewError}>No address completed</div>
                            )}
                        </div>

                        <div className={styles.previewDivider}></div>

                        <div className={styles.previewSection}>
                            <div className={styles.previewTitle}>Payment Method:</div>
                            <div className={styles.previewText}>
                                {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Payment'}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
