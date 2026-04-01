import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Removed top-level instantiation to prevent build failure if API key is missing
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("RESEND_API_KEY is missing from environment.");
            return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
        }
        
        const resend = new Resend(apiKey);

        const body = await req.json();
        const { orderId, customerName, customerEmail, customerPhone, products, totalAmount, shippingAddress, waybill } = body;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kalsafoods.com';

        // Elegant Business Email Template
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #224b33; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed!</h1>
                </div>
                
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>${customerName}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for your order with <strong>Kalsa Foods</strong>! We are currently preparing your items for shipment.</p>
                    
                    <div style="display: flex; gap: 10px; margin: 25px 0;">
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; flex: 1;">
                            <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Order ID:</span>
                            <div style="font-size: 16px; font-weight: bold; color: #224b33;">${orderId}</div>
                        </div>
                        ${waybill ? `
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; flex: 1;">
                            <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Tracking No (Waybill):</span>
                            <div style="font-size: 16px; font-weight: bold; color: #224b33;">${waybill}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <h3 style="border-bottom: 2px solid #224b33; padding-bottom: 8px;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="text-align: left; font-size: 12px; color: #888;">
                                <th style="padding-bottom: 10px;">PRODUCT</th>
                                <th style="padding-bottom: 10px; text-align: right;">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map((item: any) => `
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #efefef;">
                                        <div style="font-weight: bold;">${item.name}</div>
                                        <div style="font-size: 12px; color: #666;">Qty: ${item.quantity}</div>
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #efefef; text-align: right; font-weight: bold;">
                                        ₹${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding-top: 20px; font-weight: bold; font-size: 16px;">GRAND TOTAL:</td>
                                <td style="padding-top: 20px; text-align: right; font-weight: bold; font-size: 20px; color: #224b33;">
                                    ₹${totalAmount.toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <div style="margin-top: 30px; font-size: 14px;">
                        <h4 style="margin-bottom: 5px;">Delivery Address:</h4>
                        <p style="color: #666; margin: 0;">${shippingAddress}</p>
                    </div>

                    <div style="margin-top: 35px; text-align: center;">
                        <a href="${appUrl}/track?q=${orderId}" style="background-color: #FFD814; color: #000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; border: 1px solid #F0C14B;">
                            Track Your Order on Website
                        </a>
                        <p style="margin-top: 15px; font-size: 13px; color: #555;">
                            Note: You can track this order anytime from our website using your <strong>Mobile Number</strong> or <strong>Order ID</strong>.
                        </p>
                    </div>
                </div>

                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>Questions? Feel free to contact us at support@kalsafoods.com</p>
                    <p>© 2026 Kalsa Foods. All Rights Reserved.</p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Kalsa Foods <orders@resend.dev>', // Use verified domain or default resend.dev for testing
            to: [customerEmail],
            subject: `Order Confirmed: ${orderId}`,
            html: emailHTML,
        });

        if (error) {
            console.error("Resend API Error (Customer Email):", error);
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        // --- Admin Notification Email ---
        const adminEmailHTML = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #2c3e50;">
                <div style="background: linear-gradient(135deg, #224b33 0%, #1a3a27 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
                    <img src="https://kalsafoods.com/logo/logo.png" alt="Kalsa Foods" style="height: 50px; margin-bottom: 15px; filter: brightness(100) invert(1);">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">New Order Received</h1>
                    <p style="margin-top: 10px; opacity: 0.9; font-size: 14px;">A new customer has placed an order successfully</p>
                </div>
                
                <div style="padding: 40px;">
                    <div style="background-color: #f8fbf9; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 5px solid #224b33;">
                        <h3 style="margin-top: 0; color: #224b33; font-size: 18px; margin-bottom: 20px;">Customer Information</h3>
                        <p style="margin: 8px 0; font-size: 15px;"><strong>Name:</strong> ${customerName}</p>
                        <p style="margin: 8px 0; font-size: 15px;"><strong>Mobile:</strong> <a href="tel:${customerPhone}" style="color: #224b33; text-decoration: none;">${customerPhone || 'Not Provided'}</a></p>
                        <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${customerEmail}</p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 17px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                        <p style="margin: 10px 0; font-size: 15px;"><strong>Order ID:</strong> <span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${orderId}</span></p>
                        <p style="margin: 10px 0; font-size: 15px;"><strong>Total Value:</strong> <span style="color: #224b33; font-weight: 700;">₹${totalAmount.toFixed(2)}</span></p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #2c3e50; font-size: 17px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Delivery Address</h3>
                        <p style="line-height: 1.6; font-size: 14px; color: #576574;">${shippingAddress}</p>
                    </div>
                    
                    <h3 style="color: #2c3e50; font-size: 17px; border-bottom: 2px solid #224b33; padding-bottom: 10px; margin-top: 30px;">Items List</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        ${products.map((item: any) => `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">
                                    <strong>${item.quantity}x</strong> ${item.name}
                                </td>
                            </tr>
                        `).join('')}
                    </table>
                    
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="https://kalsafoods.com/admin/orders" style="background-color: #224b33; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block;">
                            Go to Admin Dashboard
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #f4f6f8; padding: 25px; text-align: center; font-size: 12px; color: #95a5a6;">
                    <p style="margin: 0;">This is an automated notification from Kalsa Foods Backend.</p>
                    <p style="margin: 5px 0 0 0;">© 2026 Kalsa Foods. All Rights Reserved.</p>
                </div>
            </div>
        `;

        const adminEmailResponse = await resend.emails.send({
            from: 'Kalsa Admin Alerts <orders@resend.dev>', // Keep as resend.dev unless kalsafoods.com is verified
            to: ['impreetianand28@gmail.com'],
            subject: `🎉 NEW ORDER: ${orderId} - ₹${totalAmount}`,
            html: adminEmailHTML,
        });

        // --- Final Delivered Review Link logic (for future Use if you trigger it manually) ---
        // For real customers:
        // const reviewMagicLink = `${appUrl}/submit-review?id=${orderId}&phone=${customerPhone}`;

        if (adminEmailResponse.error) {
            console.error("Resend API Error (Admin Email):", adminEmailResponse.error);
        }

        return NextResponse.json({ success: true, data });

    } catch (err: any) {
        console.error("Email Route Error:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
