"use client";

import React, { useState, useEffect } from 'react';
import styles from './CheckoutModal.module.css';
import { X, MessageCircle, FileText, CreditCard, ShieldCheck } from 'lucide-react';
import { generateInvoicePDF } from '@/lib/invoiceUtils';
import { createClient } from '@/utils/supabase/client';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    quantity: number;
    price: number;
}

import { useLanguage } from '@/context/LanguageContext';

const CheckoutModal = ({ isOpen, onClose, productName, quantity, price }: CheckoutModalProps) => {
    const { lang } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        pincode: '',
        hasPaid: false
    });
    const [isFetchingUser, setIsFetchingUser] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchUserData = async () => {
            const supabase = createClient();
            setIsFetchingUser(true);
            
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                // ONLY pre-fill if it's a regular customer, NOT the admin
                if (session && session.user.email !== 'imvanand1@gmail.com') {
                    // Pre-fill user details
                    const userName = session.user.user_metadata?.full_name || '';
                    
                    // Fetch default address
                    const { data: addresses } = await supabase
                        .from('user_addresses')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .eq('is_default', true)
                        .single();

                    if (addresses || userName) {
                        setFormData(prev => ({
                            ...prev,
                            name: userName || addresses?.full_name || prev.name,
                            phone: addresses?.phone || prev.phone,
                            address: addresses ? `${addresses.flat_house}, ${addresses.area_street}, ${addresses.city}` : prev.address,
                            pincode: addresses?.pincode || prev.pincode
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsFetchingUser(false);
            }
        };

        fetchUserData();
    }, [isOpen]);

    if (!isOpen) return null;

    const t = {
        en: {
            title: "Order Confirmation",
            subtitle: "Secure Payment & Fast Delivery",
            summary: {
                product: "Product",
                qty: "Quantity",
                price: "Price per pack",
                subtotal: "Items Total",
                gst: "GST (Included)",
                delivery: "Delivery Charge",
                total: "Total Payable",
                freeDelivery: "Launch Offer: Free Delivery All Over India 🎁",
                free: "FREE"
            },
            form: {
                name: "Full Name",
                namePlaceholder: "Enter your name",
                phone: "Phone Number",
                phonePlaceholder: "Enter your 10 digit number",
                address: "Complete Address",
                addrPlaceholder: "House No, Street, Landmark, City",
                pincode: "Pincode",
                pinPlaceholder: "6 digit pincode",
                submit: "Pay Now & Confirm Order",
                autoDownload: "*PDF Invoice will be downloaded automatically after payment"
            }
        },
        hi: {
            title: "ऑर्डर की पुष्टि",
            subtitle: "सुरक्षित भुगतान और तेज़ डिलीवरी",
            summary: {
                product: "उत्पाद",
                qty: "मात्रा",
                price: "प्रति पैक मूल्य",
                subtotal: "कुल राशि",
                gst: "GST (शामिल है)",
                delivery: "डिलीवरी चार्ज",
                total: "कुल देय राशि",
                freeDelivery: "लॉन्च ऑफर: पूरे भारत में मुफ्त डिलीवरी 🎁",
                free: "मुफ्त"
            },
            form: {
                name: "पूरा नाम",
                namePlaceholder: "अपना नाम दर्ज करें",
                phone: "फ़ोन नंबर",
                phonePlaceholder: "अपना 10 अंकों का नंबर दर्ज करें",
                address: "पूरा पता",
                addrPlaceholder: "मकान नंबर, गली, लैंडमार्क, शहर",
                pincode: "पिनकोड",
                pinPlaceholder: "6 अंकों का पिनकोड",
                submit: "अभी भुगतान करें",
                autoDownload: "*भुगतान के बाद इनवॉइस अपने आप डाउनलोड हो जाएगा"
            }
        }
    }[lang];

    const itemsTotal = quantity * price;
    const deliveryCharge: number = 0;
    const subtotal = itemsTotal;
    const finalTotal = subtotal + deliveryCharge;
    const gstAmount = finalTotal - (finalTotal / 1.18); // GST included in price

    const journeyRef = React.useRef<string | null>(null);

    const logJourney = async (status: string, extra = {}) => {
        try {
            const res = await fetch('/api/checkout/journey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: journeyRef.current,
                    user_mobile: formData.phone,
                    user_email: '', 
                    items: [{ name: productName, qty: quantity, price }],
                    amount: finalTotal,
                    status,
                    ...extra
                })
            });
            const data = await res.json();
            if (data.success && data.data?.id) {
                journeyRef.current = data.data.id;
            }
            return data.data?.id || journeyRef.current;
        } catch (e) {
            console.error("Journey Log Error:", e);
        }
    };

    const createAutoTicket = async (errorMsg: string, jId: string | null) => {
        try {
            const res = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_mobile: formData.phone,
                    subject: "Payment/Checkout Glitch Detected",
                    description: `Automated Ticket: Customer encountered error during checkout. Error: ${errorMsg}`,
                    priority: 'High',
                    category: 'Payment',
                    journey_id: jId
                })
            });
            const data = await res.json();
            return data.ticket?.id;
        } catch (e) {
            console.error("Ticket Creation Error:", e);
        }
    };

    const processOrder = async (paymentId: string) => {
        // Update journey status immediately
        await logJourney('Payment_Success', { razorpay_payment_id: paymentId });

        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || null;
        
        // Generate Order ID for references
        const internalOrderId = `KF-${Date.now().toString().slice(-6)}`;
        const orderDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'long', year: 'numeric'
        });

        // 1. Save to Supabase (Database)
        try {
            // A. Create a Guest Address record first
            const { data: addrData, error: addrError } = await supabase
                .from('user_addresses')
                .insert([{
                    full_name: formData.name,
                    phone: formData.phone,
                    flat_house: formData.address,
                    area_street: 'Guest Checkout',
                    pincode: formData.pincode,
                    city: 'Not Specified',
                    state: 'Not Specified',
                    is_default: false
                }])
                .select()
                .single();

            if (addrError) throw addrError;

            // B. Create the Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: userId,
                    address_id: addrData.id,
                    total_amount: finalTotal,
                    payment_method: `prepaid (${paymentId})`,
                    status: 'pending'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // C. Add Order Item
            await supabase
                .from('order_items')
                .insert([{
                    order_id: orderData.id,
                    product_id: 'kalsa-spicemix-100g',
                    name: productName,
                    price: price,
                    quantity: quantity,
                    image: '/logo/logo.png'
                }]);

            // Final Journey Update
            await logJourney('Order_Logged', { razorpay_payment_id: paymentId });

        } catch (dbError: any) {
            console.error("Database Save Failed:", dbError);
            await logJourney('Failed_At_DB', { error_message: dbError.message });
        }

        // 2. Automation: Create Delhivery Order
        try {
            const dlvResponse = await fetch("/api/shipping/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    pincode: formData.pincode,
                    orderId: internalOrderId,
                    paymentMode: 'prepaid',
                    totalAmount: finalTotal,
                    productName: productName,
                    quantity: quantity.toString()
                })
            });
            const dlvData = await dlvResponse.json();
            if (dlvData.success === false) {
                // alert(`Delhivery Sync Note: ${dlvData.rmk || 'Order saved to DB but sync delayed.'}`);
            }
        } catch (shippingError) {
            console.error("Shipping Automation Failed:", shippingError);
        }

        // 3. Local CSV Logging (as backup)
        try {
            fetch("/api/log-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    OrderID: internalOrderId,
                    Date: orderDate,
                    Product: productName,
                    Quantity: quantity.toString(),
                    TotalAmount: finalTotal.toFixed(2),
                    CustomerName: formData.name,
                    Phone: formData.phone,
                    Address: `${formData.address}, ${formData.pincode}`,
                    PaymentStatus: `Paid (Razorpay: ${paymentId})`
                }),
            });
        } catch (logError) {
            console.error("Log failed:", logError);
        }

        // 2. WhatsApp Message
        const rawMessage = `*New Order from Kalsa Foods Website*

*Order ID:* ${internalOrderId}
*Product:* ${productName}
*Quantity:* ${quantity} packs
*Total:* ₹${finalTotal.toFixed(2)}

*Payment ID:* ${paymentId} (✅ Verified)

*Customer Details:*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Address:* ${formData.address}, ${formData.pincode}

_Order via Razorpay_ ✅`;

        const whatsappNumber = "918709438350";
        // const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

        // 3. Generate PDF Invoice
        try {
            await generateInvoicePDF({
                customerName: formData.name,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                customerPincode: formData.pincode,
                productName: productName,
                quantity: quantity,
                price: price,
                subtotal: subtotal,
                gstAmount: gstAmount,
                deliveryCharge: deliveryCharge,
                totalAmount: finalTotal,
                orderDate: orderDate,
                orderId: internalOrderId
            });
        } catch (error) {
            console.error("Invoice Generation Failed:", error);
        }

        window.location.href = '/orders?success=true';
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 0. Initial Journey Log
        const currentJId = await logJourney('Initiated');

        try {
            // 1. Create Order on Server
            const response = await fetch('/api/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalTotal,
                    receipt: `receipt_${Date.now()}`
                })
            });

            const order = await response.json();

            if (!order.id) {
                throw new Error('Order creation failed on server');
            }

            // Update journey with Razorpay Order ID
            await logJourney('Gateway_Ready', { razorpay_order_id: order.id });

            // 2. Open Razorpay Checkout
            const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SVTkMuqXvzCE8B';

            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "Kalsa Foods",
                description: `Order for ${productName}`,
                image: "/logo/logo.png",
                order_id: order.id,
                handler: function (response: any) {
                    processOrder(response.razorpay_payment_id);
                },
                prefill: {
                    name: formData.name,
                    contact: formData.phone
                },
                theme: {
                    color: "#232f3e"
                },
                modal: {
                    ondismiss: async function() {
                        await logJourney('Cancelled_By_User');
                    }
                }
            };

            if (!window.Razorpay) {
                const tId = await createAutoTicket("Razorpay SDK Not Loaded", currentJId);
                alert(`Network issue detected. Our team has been notified. Support Ticket: ${tId}. Please refresh and try again.`);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async function (response: any) {
                console.error("Payment Failed Callback:", response.error);
                await logJourney('Payment_Failed', { error_message: response.error.description });
                const tId = await createAutoTicket(response.error.description, currentJId);
                alert(`Payment failed: ${response.error.description}. A support ticket ${tId} has been created for you.`);
            });
            
            rzp.open();

        } catch (error: any) {
            console.error('Checkout error:', error);
            await logJourney('System_Error', { error_message: error.message });
            const tId = await createAutoTicket(error.message, currentJId);
            alert(`A connection glitch occurred. Please try again. Your support ticket ID is ${tId}.`);
        }
    };


    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <h2>{t.title}</h2>
                    <p>{t.subtitle}</p>
                </div>

                <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.product}</span>
                        <span>{productName}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.qty}</span>
                        <span>{quantity} {lang === 'hi' ? 'पैक' : 'packs'}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.price}</span>
                        <span>₹{price.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.subtotal}</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.gst}</span>
                        <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>{t.summary.delivery}</span>
                        <span style={{ color: deliveryCharge === 0 ? '#48bb78' : 'inherit', fontWeight: deliveryCharge === 0 ? 600 : 400 }}>
                            {deliveryCharge === 0 ? t.summary.free : `₹${deliveryCharge.toFixed(2)}`}
                        </span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>{t.summary.total}</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    {deliveryCharge === 0 && <div className={styles.deliveryTag}>✅ {t.summary.freeDelivery}</div>}
                </div>

                <div className={styles.secureBadgeText}>
                    <ShieldCheck size={20} color="#48bb78" />
                    <span>Secure Payment via Razorpay</span>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>{t.form.name}</label>
                        <input
                            type="text"
                            required
                            autoComplete="off"
                            placeholder={t.form.namePlaceholder}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.form.phone}</label>
                        <input
                            type="tel"
                            required
                            autoComplete="off"
                            placeholder={t.form.phonePlaceholder}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.form.address}</label>
                        <textarea
                            required
                            autoComplete="off"
                            placeholder={t.form.addrPlaceholder}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.form.pincode}</label>
                        <input
                            type="text"
                            required
                            autoComplete="off"
                            placeholder={t.form.pinPlaceholder}
                            value={formData.pincode}
                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        <CreditCard size={20} />
                        <span>{t.form.submit}</span>
                    </button>
                    <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '10px', color: '#666' }}>
                        {t.form.autoDownload}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;

