import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { getInvoicePDFBuffer } from '@/lib/invoiceUtils';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return NextResponse.json({ success: false, error: "RESEND_API_KEY missing" }, { status: 500 });
        const resend = new Resend(apiKey);

        const body = await req.json();
        const { orderId, customerName, customerEmail, totalAmount, orderDate, products, shippingAddress, phone, pincode } = body;

        // 1. Generate the PDF Buffer on Server
        const pdfBuffer = await getInvoicePDFBuffer({
            customerName,
            customerPhone: phone || '',
            customerAddress: shippingAddress || '',
            customerPincode: pincode || '',
            productName: products?.[0]?.name || 'Kalsa Foods Spices',
            quantity: products?.[0]?.quantity || 1,
            price: products?.[0]?.price || totalAmount,
            subtotal: totalAmount / 1.18, // Estimated base total
            gstAmount: totalAmount - (totalAmount / 1.18),
            deliveryCharge: 0,
            totalAmount,
            orderDate: orderDate || new Date().toLocaleDateString(),
            orderId
        });

        // 2. Convert to Base64 for Resend (Using standard Node.js Buffer)
        const pdfBase64 = Buffer.from(pdfBuffer as any).toString('base64');

        // 3. Email Template
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #ff9f1c; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎁 Delivered! Enjoy your Kalsa Spices!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>${customerName}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Our tracking shows your Kalsa Spices have been successfully delivered. We hope they bring the authentic flavor of home to your kitchen!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 25px 0; border: 1px solid #ddd;">
                        <p style="margin: 0; font-weight: bold;">Tax Invoice Attached</p>
                        <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">We've attached your official tax invoice (PDF) to this email for your records.</p>
                    </div>

                    <div style="background-color: #fffaf0; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                        <h3 style="margin-top: 0; color: #ff9f1c;">Would you mind helping us?</h3>
                        <p style="font-size: 14px;">If you love the taste, please take 10 seconds to share your experience.</p>
                        <a href="https://kalsafoods.com/submit-review?id=${orderId}&phone=${phone}" style="background-color: #ff9f1c; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; margin-top: 10px;">Write a Review & Earn Goodness</a>
                    </div>
                </div>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>Questions? Contact us at support@kalsafoods.com</p>
                    <p>© 2026 Kalsa Foods. All Rights Reserved.</p>
                </div>
            </div>
        `;

        // 4. Send Email with Attachment
        const { data, error } = await resend.emails.send({
            from: 'Kalsa Foods <shipping@resend.dev>',
            to: [customerEmail],
            subject: `Delivered! Invoice Attached for Order ${orderId}`,
            html: emailHTML,
            attachments: [
                {
                    content: pdfBase64,
                    filename: `Invoice_${orderId}.pdf`,
                    type: 'application/pdf',
                },
            ],
        });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("Delivered Email Error:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
