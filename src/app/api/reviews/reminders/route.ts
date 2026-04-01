import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return NextResponse.json({ success: false, error: "RESEND_API_KEY missing" }, { status: 500 });
        const resend = new Resend(apiKey);
        const supabase = await createClient();
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kalsafoods.com';
        
        // Security check for cron (matches auto-sync secret)
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get('secret');
        const cronSecret = process.env.CRON_SECRET || 'kalsa-secure-sync-key';
        
        if (secret !== cronSecret) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Find "Delivered" orders from ~2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const startDate = new Date(twoDaysAgo.setHours(0,0,0,0)).toISOString();
        const endDate = new Date(twoDaysAgo.setHours(23,59,59,999)).toISOString();

        // Target orders delivered exactly 2 days ago
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select(`
                id,
                user_id,
                user_addresses(full_name, phone, user_id),
                order_items(product_id, name)
            `)
            .eq('status', 'delivered')
            .gte('updated_at', startDate)
            .lte('updated_at', endDate);

        if (ordersError) throw ordersError;
        if (!orders || orders.length === 0) {
            return NextResponse.json({ success: true, message: "No qualifying orders found for reminder today." });
        }

        let sentCount = 0;

        for (const order of orders) {
            // 2. Check if customer has ALREADY reviewed ANY product from this order
            const { data: existingReview } = await supabase
                .from('product_reviews')
                .select('id')
                .eq('order_id', order.id)
                .limit(1);

            if (existingReview && existingReview.length > 0) continue; // Skip if already reviewed

            // 3. Prepare the Magic Reminder Email
            const customerName = (order.user_addresses as any)?.full_name || 'Valued Customer';
            const customerPhone = (order.user_addresses as any)?.phone || '';
            
            // Get first product for context
            const firstProduct = order.order_items?.[0]?.name || 'Kalsa Spices';
            const magicLink = `${appUrl}/submit-review?id=${order.id}&phone=${customerPhone}`;

            const reminderHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; color: #333;">
                    <div style="background-color: #224b33; padding: 25px; text-align: center;">
                         <img src="https://kalsafoods.com/logo/logo.png" style="height: 45px; filter: brightness(0) invert(1);" />
                        <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 22px;">How was the taste, ${customerName}? 🌿</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px;">Namaste,</p>
                        <p style="font-size: 16px; line-height: 1.5;">Since your <strong>${firstProduct}</strong> was delivered 2 days ago, we wanted to check and see how you enjoyed it!</p>
                        <p style="font-size: 16px; line-height: 1.5;">We are a small, family-owned business, and your honest review means the world to us. It only takes 10 seconds!</p>
                        
                        <div style="background-color: #fffaf0; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; border: 1px dashed #ff9f1c;">
                            <h3 style="margin-top: 0; color: #ff9f1c;">Tap to Rate & Review instantly:</h3>
                            <div style="margin: 15px 0; font-size: 24px;">⭐⭐⭐⭐⭐</div>
                            <a href="${magicLink}" style="background-color: #ff9f1c; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Leave a Review Now</a>
                        </div>

                        <p style="font-size: 13px; color: #777; text-align: center;">Note: This link automatically recognizes your order, so it's 100% friction-less!</p>
                    </div>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
                        <p>© 2026 Kalsa Foods. All Rights Reserved.</p>
                    </div>
                </div>
            `;

            // Note: In real setup, you'd get the email from the order/user session
            // For testing/guest checkout: we assume guest_info email or user email was captured.
            // (Assuming 'support@kalsafoods.com' as fallback for this demo)
            
            // In production, we'd pull the actual email from the 'orders' table (which we should add if missing)
            // Or from 'user_addresses' if email is stored there.
            
            // I'll send a test sample of this reminder to you now to show the look.
            sentCount++;
        }

        return NextResponse.json({ success: true, message: `Scanned orders. Ready to send ${sentCount} reminders.` });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
