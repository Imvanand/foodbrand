import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
        }
        
        const resend = new Resend(apiKey);
        const { orderId, customerName, customerEmail, waybill, status, expectedDelivery } = await req.json();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kalsafoods.com';

        let subject = '';
        let headerTitle = '';
        let messageText = '';

        if (status === 'transit') {
            subject = `Your Kalsa Foods Order ${orderId} is In Transit!`;
            headerTitle = `🚚 Order In Transit`;
            messageText = `Great news! Your package has been picked up and is currently in transit to your delivery address.`;
        } else if (status === 'delivered') {
            subject = `Your Kalsa Foods Order ${orderId} has been Delivered!`;
            headerTitle = `✅ Order Delivered`;
            messageText = `We are delighted to inform you that your Kalsa Foods order has been successfully delivered. We hope you enjoy the authentic taste!`;
        } else {
            return NextResponse.json({ success: false, error: "Invalid status type" }, { status: 400 });
        }

        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #224b33; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${headerTitle}</h1>
                </div>
                
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>${customerName}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">${messageText}</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #e47911;">
                        <div style="margin-bottom: 10px;">
                            <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Order ID:</span>
                            <div style="font-size: 16px; font-weight: bold; color: #224b33;">${orderId}</div>
                        </div>
                        ${waybill ? `
                        <div style="margin-bottom: ${expectedDelivery ? '10px' : '0'};">
                            <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Tracking Waybill:</span>
                            <div style="font-size: 16px; font-weight: bold; color: #333;">${waybill} (Delhivery)</div>
                        </div>
                        ` : ''}
                        ${expectedDelivery && status === 'transit' ? `
                        <div>
                            <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Expected Delivery:</span>
                            <div style="font-size: 16px; font-weight: bold; color: #e47911;">${expectedDelivery}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div style="margin-top: 35px; text-align: center;">
                        <a href="${appUrl}/track?q=${orderId}" style="background-color: #FFD814; color: #000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block; border: 1px solid #F0C14B;">
                            Track Your Order
                        </a>
                        ${status === 'delivered' ? `
                            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="font-size: 15px; color: #666; margin-bottom: 20px;">We'd love to hear your feedback! Share your cooking photos and review our spices.</p>
                                <a href="${appUrl}/submit-review" style="background-color: #224b33; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                                    Write a Product Review
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                    <p>Questions? Feel free to contact us at support@kalsafoods.com</p>
                    <p>© 2026 Kalsa Foods. All Rights Reserved.</p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Kalsa Foods Shipping <orders@resend.dev>', // change this to @kalsafoods.com if verified
            to: [customerEmail],
            subject: subject,
            html: emailHTML,
        });

        if (error) {
            console.error("Resend API Error (Shipping Update):", error);
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (err: any) {
        console.error("Email Route Error:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
