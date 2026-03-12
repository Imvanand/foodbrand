"use client";

import React, { useState } from 'react';
import styles from './CheckoutModal.module.css';
import { X, MessageCircle, QrCode, FileText } from 'lucide-react';
import { generateInvoicePDF } from '@/lib/invoiceUtils';

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

    if (!isOpen) return null;

    const t = {
        en: {
            title: "Order Confirmation",
            subtitle: "Order direct on WhatsApp for Fast Delivery",
            summary: {
                product: "Product",
                qty: "Quantity",
                price: "Price per pack",
                subtotal: "Subtotal (Excl. GST)",
                gst: "GST (5%)",
                delivery: "Delivery Charge",
                total: "Total Payable",
                freeDelivery: "Free Delivery Applied",
                free: "FREE"
            },
            qr: {
                title: "Scan to Pay Instantly",
                meta: "After payment, please share the screenshot on WhatsApp.",
                payTo: "Pay to"
            },
            form: {
                hasPaid: "I have paid using the QR code above",
                name: "Full Name",
                namePlaceholder: "Enter your name",
                phone: "Phone Number",
                phonePlaceholder: "Enter your 10 digit number",
                address: "Complete Address",
                addrPlaceholder: "House No, Street, Landmark, City",
                pincode: "Pincode",
                pinPlaceholder: "6 digit pincode",
                submit: "Place Order & Download Invoice",
                autoDownload: "*PDF Invoice will be downloaded automatically"
            }
        },
        hi: {
            title: "ऑर्डर की पुष्टि",
            subtitle: "तेज़ डिलीवरी के लिए सीधे व्हाट्सएप पर ऑर्डर करें",
            summary: {
                product: "उत्पाद",
                qty: "मात्रा",
                price: "प्रति पैक मूल्य",
                subtotal: "उपयोग राशि (GST रहित)",
                gst: "GST (5%)",
                delivery: "डिलीवरी चार्ज",
                total: "कुल देय राशि",
                freeDelivery: "मुफ्त डिलीवरी लागू",
                free: "मुफ्त"
            },
            qr: {
                title: "तुरंत भुगतान करने के लिए स्कैन करें",
                meta: "भुगतान के बाद, कृपया स्क्रीनशॉट व्हाट्सएप पर साझा करें।",
                payTo: "भुगतान करें"
            },
            form: {
                hasPaid: "मैंने ऊपर दिए गए QR कोड का उपयोग करके भुगतान किया है",
                name: "पूरा नाम",
                namePlaceholder: "अपना नाम दर्ज करें",
                phone: "फ़ोन नंबर",
                phonePlaceholder: "अपना 10 अंकों का नंबर दर्ज करें",
                address: "पूरा पता",
                addrPlaceholder: "मकान नंबर, गली, लैंडमार्क, शहर",
                pincode: "पिनकोड",
                pinPlaceholder: "6 अंकों का पिनकोड",
                submit: "ऑर्डर दें और इनवॉइस डाउनलोड करें",
                autoDownload: "*इनवॉइस अपने आप डाउनलोड हो जाएगा"
            }
        }
    }[lang];

    const itemsTotal = quantity * price;
    const deliveryCharge = quantity < 3 ? 60 : 0;
    const finalTotal = itemsTotal + deliveryCharge;
    const gstAmount = (itemsTotal * 0.05); // Assuming 5% GST for Spices
    const subtotal = itemsTotal - gstAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Generate Order ID
        const orderId = `KF-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
        const orderDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // 1. Save to Google Sheet (Primary - for CA)
        try {
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUvlvVivceSSGRGPxskPznizBAuyNnxfKCg4gqeovnsDp85fWEHvsSPG-Ff6-YSu3z/exec";

            const params = new URLSearchParams();
            params.append("OrderID", orderId);
            params.append("Date", orderDate);
            params.append("Product", productName);
            params.append("Quantity", quantity.toString());
            params.append("TotalAmount", finalTotal.toFixed(2));
            params.append("CustomerName", formData.name);
            params.append("Phone", formData.phone);
            params.append("Address", `${formData.address}, ${formData.pincode}`);
            params.append("PaymentStatus", formData.hasPaid ? "Paid (UPI)" : "Pending/COD");

            // 1. Save to Google Sheet (Primary - for CA)
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString(),
                mode: "no-cors",
            });

            // 2. Save to Local public/monthly_sales_record.csv (Backup/Direct access)
            fetch("/api/log-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    OrderID: orderId,
                    Date: orderDate,
                    Product: productName,
                    Quantity: quantity.toString(),
                    TotalAmount: finalTotal.toFixed(2),
                    CustomerName: formData.name,
                    Phone: formData.phone,
                    Address: `${formData.address}, ${formData.pincode}`,
                    PaymentStatus: formData.hasPaid ? "Paid (UPI)" : "Pending/COD"
                }),
            });

            console.log("Order logged to both Sheet and local CSV");
        } catch (sheetError) {
            console.error("Failed to log order:", sheetError);
        }

        const rawMessage = `*New Order from Kalsa Foods Website*

*Order ID:* ${orderId}
*Product:* ${productName}
*Quantity:* ${quantity} packs

*Order Breakdown:*
- Subtotal: ₹${subtotal.toFixed(2)}
- GST (5%): ₹${gstAmount.toFixed(2)}
- Delivery: ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
*Total Payable: ₹${finalTotal.toFixed(2)}*

*Customer Details:*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Address:* ${formData.address}
*Pincode:* ${formData.pincode}

*Payment Status:* ${formData.hasPaid ? '✅ Paid via UPI (Screenshot attached)' : '📝 Will pay on delivery / after confirmation'}

_Order via WhatsApp Confirmation_ ✅
_Invoice generated & saved locally_ 📄`;

        const whatsappNumber = "918709438350";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(rawMessage)}`;

        // Generate and Download PDF Invoice
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
                orderId: orderId
            });
        } catch (error) {
            console.error("Invoice Generation Failed:", error);
        }

        window.open(whatsappUrl, '_blank');
        onClose();
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

                <div className={styles.qrSection}>
                    <div className={styles.qrTitle}>
                        <QrCode size={20} color="#e47911" />
                        {t.qr.title}
                    </div>
                    <div className={styles.qrContainer}>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=6206357414-2@ybl&pn=Kalsa Foods&am=${finalTotal.toFixed(2)}&cu=INR`)}`}
                            alt="Payment QR Code"
                            className={styles.qrImage}
                        />
                    </div>
                    <div className={styles.qrMeta}>
                        {t.qr.payTo} <strong>₹{finalTotal.toFixed(2)}</strong> to
                        <span className={styles.upiId}>6206357414-2@ybl</span>
                        <p style={{ marginTop: '8px' }}>{t.qr.meta}</p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <input
                            type="checkbox"
                            id="hasPaid"
                            checked={formData.hasPaid}
                            onChange={e => setFormData({ ...formData, hasPaid: e.target.checked })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="hasPaid" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                            {t.form.hasPaid}
                        </label>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.form.name}</label>
                        <input
                            type="text"
                            required
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
                            placeholder={t.form.phonePlaceholder}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>{t.form.address}</label>
                        <textarea
                            required
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
                            placeholder={t.form.pinPlaceholder}
                            value={formData.pincode}
                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        <MessageCircle size={20} />
                        <span>{t.form.submit}</span>
                        <FileText size={18} style={{ marginLeft: 'auto' }} />
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

