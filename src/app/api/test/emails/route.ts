import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return NextResponse.json({ success: false, error: "RESEND_API_KEY missing" }, { status: 500 });
        const resend = new Resend(apiKey);
        const testEmail = 'impreetianand28@gmail.com';
        
        // --- 1. ORDER CONFIRMED (Refined Brand Template) ---
        const orderHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #224b33; padding: 25px; text-align: center;">
                    <img src="https://kalsafoods.com/logo/logo.png" style="height: 50px; filter: brightness(0) invert(1);" />
                    <h1 style="color: #ffffff; margin: 5px 0; font-size: 24px;">Order Confirmed!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>Preeti</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Thank you for choosing <strong>Kalsa Foods</strong>! We are currently preparing your 100% natural spices for shipment.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 11px; color: #777; font-weight: bold; text-transform: uppercase;">Order ID:</span>
                        <div style="font-size: 18px; font-weight: bold; color: #224b33;">KF-TEST-SAMPLE</div>
                    </div>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://kalsafoods.com/orders" style="background-color: #FFD814; color: #000; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: 700; border: 1px solid #F0C14B;">View Order Status</a>
                    </div>
                </div>
            </div>
        `;

        // --- 2. IN TRANSIT (Shipped Alert) ---
        const shippedHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #224b33; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🚀 Your Spices are Shipped!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>Preeti</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Wait is over! Your Kalsa Spices have been handed over to our courier partner <strong>Delhivery</strong> and are now in transit.</p>
                    <div style="background-color: #f0f7f3; border: 1px solid #224b33; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <span style="font-size: 12px; color: #224b33; font-weight: bold;">TRACKING NUMBER (WAYBILL):</span>
                        <div style="font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #224b33; margin-top: 5px;">123456789098</div>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://kalsafoods.com/track?q=123456789098" style="background-color: #224b33; color: #fff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Track Your Package</a>
                    </div>
                </div>
            </div>
        `;

        // --- 3. DELIVERED (Thank You & Review) ---
        const deliveredHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                <div style="background-color: #ff9f1c; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎁 Delivered with Love!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Namaste <strong>Preeti</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.5;">Great news! Our tracking shows your package was delivered today. We hope you love the aroma and flavor of our natural spice mix.</p>
                    <div style="background-color: #fffaf0; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                        <h3 style="margin-top: 0; color: #ff9f1c;">How was the taste?</h3>
                        <p style="font-size: 14px;">Your review helps our small family-owned business grow.</p>
                        <a href="https://kalsafoods.com/submit-review?id=KF-TEST-SAMPLE&phone=8709438350" style="background-color: #ff9f1c; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 700; display: inline-block;">Write a Quick Review</a>
                    </div>
                </div>
            </div>
        `;

        // Send all 3 emails
        await resend.emails.send({ from: 'Kalsa Foods <orders@resend.dev>', to: [testEmail], subject: 'Sample 1: Order Confirmed (Kalsa Foods)', html: orderHtml });
        await resend.emails.send({ from: 'Kalsa Foods <shipping@resend.dev>', to: [testEmail], subject: 'Sample 2: Spices in Transit (Kalsa Foods)', html: shippedHtml });
        await resend.emails.send({ from: 'Kalsa Foods <delivered@resend.dev>', to: [testEmail], subject: 'Sample 3: Delivered Successfully (Kalsa Foods)', html: deliveredHtml });

        return NextResponse.json({ success: true, message: "3 test emails sent to Preeti's email." });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
