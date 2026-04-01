"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import html2canvas from 'html2canvas';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

function convertNumberToWords(amount: number) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    let numStr = Math.floor(amount).toString();
    if (numStr.length > 9) return 'Number too large';
    let n = ('000000000' + numStr).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'only' : 'only';
    
    if (str.length > 0) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str.replace(/ {2,}/g, ' ').trim() || 'Zero only';
}

export default function InvoicePage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const downloadJPG = async () => {
        if (!invoiceRef.current || !order) return;
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `Invoice-${order.id.slice(0, 8)}.jpg`;
            link.click();
        } catch (err) {
            console.error("Failed to generate JPG", err);
            alert("Failed to download JPG.");
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    user_addresses (*),
                    order_items (*)
                `)
                .eq('id', orderId)
                .single();
            
            if (!error && data) {
                setOrder(data);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderId, supabase]);

    useEffect(() => {
        if (order && !loading) {
            const timer = setTimeout(() => {
                downloadJPG();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [order, loading]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Loader2 className="animate-spin" size={48} color="#224b33" />
            <p style={{ marginLeft: '10px' }}>Loading Invoice...</p>
        </div>
    );

    if (!order) return <div style={{ padding: '40px', textAlign: 'center' }}>Invoice not found</div>;

    const address = order.user_addresses;

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button 
                onClick={downloadJPG}
                style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#e47911', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Download JPG Again
            </button>
            <div ref={invoiceRef} style={{ width: '850px', backgroundColor: '#fff', padding: '40px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', color: '#000', fontSize: '13px', lineHeight: '1.4' }}>
                {/* Header section identical to the image */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <img src="/logo/logo.png" alt="KALSA FOODS" style={{ height: '45px', marginBottom: '10px' }} />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Tax Invoice/Bill of Supply/Cash Memo</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>(Triplicate for Supplier)</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ width: '48%' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Sold By :</p>
                    <p style={{ margin: 0 }}>KALSA FOODS</p>
                    <p style={{ margin: 0 }}>*</p>
                    <p style={{ margin: 0 }}>H.N-50,Manyata Ambhrinyi layout, K S Halli Road,</p>
                    <p style={{ margin: 0 }}>Seegehalli, K R Puram, Near Hanuman Mandir,</p>
                    <p style={{ margin: 0 }}>3rd cross 2nd Left</p>
                    <p style={{ margin: 0 }}>BENGALURU, KARNATAKA, 560049</p>
                    <p style={{ margin: 0 }}>IN</p>
                    <br />
                    <p style={{ margin: 0 }}><strong>PAN No:</strong> KOEPK2332M</p>
                    <p style={{ margin: 0 }}><strong>GST Registration No:</strong> 29KOEPK2332M1ZI</p>
                    <br />
                    <p style={{ margin: 0 }}><strong>FSSAI License No.</strong></p>
                    <p style={{ margin: 0 }}>21225187003863</p>
                    <br />
                    <p style={{ margin: 0 }}><strong>Order Number:</strong> {order.id}</p>
                    <p style={{ margin: 0 }}><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                </div>

                <div style={{ width: '48%', textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Billing Address :</p>
                    <p style={{ margin: 0 }}>{address?.full_name}</p>
                    <p style={{ margin: 0 }}>{address?.address_line1}</p>
                    <p style={{ margin: 0 }}>{address?.city}, {address?.state}, {address?.pincode}</p>
                    <p style={{ margin: 0 }}>IN</p>
                    {/* Simplified State mapping from IN standard */}
                    <p style={{ margin: 0 }}><strong>State/UT Code:</strong> {address?.state?.toLowerCase().includes('karnataka') ? '29' : 'Other'}</p>
                    
                    <br />
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Shipping Address :</p>
                    <p style={{ margin: 0 }}>{address?.full_name}</p>
                    <p style={{ margin: 0 }}>{address?.address_line1}</p>
                    <p style={{ margin: 0 }}>{address?.city}, {address?.state}, {address?.pincode}</p>
                    <p style={{ margin: 0 }}>IN</p>
                    <p style={{ margin: 0 }}><strong>State/UT Code:</strong> {address?.state?.toLowerCase().includes('karnataka') ? '29' : 'Other'}</p>
                    
                    <p style={{ margin: 0 }}><strong>Place of supply:</strong> {address?.state?.toUpperCase() || 'KARNATAKA'}</p>
                    <p style={{ margin: 0 }}><strong>Place of delivery:</strong> {address?.state?.toUpperCase() || 'KARNATAKA'}</p>
                    
                    <p style={{ margin: 0 }}><strong>Invoice Number:</strong> IN-{order.id.slice(0, 8).toUpperCase()}</p>
                    <p style={{ margin: 0 }}><strong>Invoice Details :</strong> KA-860412373-2526</p>
                    <p style={{ margin: 0 }}><strong>Invoice Date :</strong> {new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</p>
                </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '0', fontSize: '12px' }}>
                <thead style={{ backgroundColor: '#ccc', WebkitPrintColorAdjust: 'exact', colorAdjust: 'exact' }}>
                    <tr style={{ borderBottom: '1px solid #000' }}>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', width: '3%' }}>Sl.<br/>No</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>Description</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Unit<br/>Price</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Qty</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Net<br/>Amount</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Tax<br/>Rate</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Tax<br/>Type</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Tax<br/>Amount</th>
                        <th style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>Total<br/>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {order.order_items?.map((item: any, idx: number) => {
                        const isKarnataka = address?.state?.toLowerCase().includes('karnataka');
                        // Calculate tax based on formula: netAmount + tax = totalAmount (139 inclusive). Assuming 18% total tax.
                        const totalItemAmt = item.price * item.quantity;
                        const netAmount = totalItemAmt / 1.18;
                        const totalTax = totalItemAmt - netAmount;

                        const cgst = totalTax / 2;
                        const sgst = totalTax / 2;
                        const igst = totalTax;

                        return (
                            <React.Fragment key={idx}>
                                {isKarnataka ? (
                                    <>
                                        <tr>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'center', verticalAlign: 'top' }} rowSpan={2}>{idx + 1}</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', verticalAlign: 'top' }} rowSpan={2}>
                                                {item.product_name || 'Kalsa Foods Spice Mix Masala, Authentic Indian Spice Blend, Kitchen King Masala for Sabzi Paneer and Curry, No Added Colors, 100g'}<br/>
                                                HSN:09109100
                                            </td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'right', verticalAlign: 'top' }} rowSpan={2}>₹{netAmount.toFixed(2)}</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'center', verticalAlign: 'top' }} rowSpan={2}>{item.quantity}</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'right', verticalAlign: 'top' }} rowSpan={2}>₹{netAmount.toFixed(2)}</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'center' }}>9%</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'center' }}>CGST</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'right' }}>₹{cgst.toFixed(2)}</td>
                                            <td style={{ border: '1px solid #000', borderBottom: 'none', padding: '4px', textAlign: 'right', verticalAlign: 'top' }} rowSpan={2}>₹{totalItemAmt.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ border: '1px solid #000', borderTop: 'none', padding: '4px', textAlign: 'center' }}>9%</td>
                                            <td style={{ border: '1px solid #000', borderTop: 'none', padding: '4px', textAlign: 'center' }}>SGST</td>
                                            <td style={{ border: '1px solid #000', borderTop: 'none', padding: '4px', textAlign: 'right' }}>₹{sgst.toFixed(2)}</td>
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{idx + 1}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', verticalAlign: 'top' }}>
                                            {item.product_name || 'Kalsa Foods Spice Mix Masala, Authentic Indian Spice Blend, Kitchen King Masala for Sabzi Paneer and Curry, No Added Colors, 100g'}<br/>
                                            HSN:09109100
                                        </td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>₹{netAmount.toFixed(2)}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.quantity}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>₹{netAmount.toFixed(2)}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>18%</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>IGST</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>₹{igst.toFixed(2)}</td>
                                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right', verticalAlign: 'top' }}>₹{totalItemAmt.toFixed(2)}</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Total Row */}
                    <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold' }}>
                        <td colSpan={7} style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }}>TOTAL:</td>
                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>
                            ₹{(order.total_amount - (order.total_amount / 1.18)).toFixed(2)}
                        </td>
                        <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>₹{order.total_amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Amount in Words */}
            <div style={{ border: '1px solid #000', borderTop: 'none', padding: '4px 8px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Amount in Words:</p>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{convertNumberToWords(order.total_amount)}</p>
            </div>

            {/* Signature Area */}
            <div style={{ border: '1px solid #000', borderTop: 'none', padding: '8px', minHeight: '80px', position: 'relative' }}>
                <p style={{ margin: 0, fontWeight: 'bold', textAlign: 'right' }}>For KALSA FOODS:</p>
                <p style={{ margin: 0, fontWeight: 'bold', textAlign: 'right', position: 'absolute', bottom: '8px', right: '8px' }}>Authorized Signatory</p>
            </div>

            <p style={{ margin: '5px 0 15px', fontSize: '12px' }}>Whether tax is payable under reverse charge - No</p>

            {/* Payment Transaction Details Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '11px', textAlign: 'center' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4px' }}><strong>Payment Transaction ID:</strong> {order.payment_id || 'N/A'}</td>
                        <td style={{ border: '1px solid #000', padding: '4px' }}><strong>Date & Time:</strong> {new Date(order.created_at).toLocaleString('en-GB')}</td>
                        <td style={{ border: '1px solid #000', padding: '4px' }}><strong>Invoice Value:</strong> {order.total_amount.toFixed(2)}</td>
                        <td style={{ border: '1px solid #000', padding: '4px' }}><strong>Mode of Payment:</strong> {order.payment_method?.toUpperCase()}</td>
                    </tr>
                </tbody>
            </table>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    @page { margin: 0.5in; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
}
