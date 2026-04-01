import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, user_mobile, user_email, items, amount, status, razorpay_order_id, razorpay_payment_id, error_message } = body;
        
        console.log("Journey Payload Received:", { id, status, user_mobile });
        
        const supabase = await createClient();

        // If 'id' is a string "null" or actually null, treat it as undefined
        const effectiveId = (id && id !== "null") ? id : undefined;

        if (effectiveId) {
            console.log("Attempting UPDATE for Journey ID:", effectiveId);
            const { data, error } = await supabase
                .from('checkout_journeys')
                .update({ 
                    status: status || 'Initiated', 
                    razorpay_order_id, 
                    razorpay_payment_id, 
                    error_message, 
                    updated_at: new Date().toISOString() 
                })
                .eq('id', effectiveId)
                .select();
            
            if (error) {
                console.error("Supabase Update Error:", error);
                return NextResponse.json({ success: false, error: error.message, details: error }, { status: 400 });
            }
            return NextResponse.json({ success: true, data: data ? data[0] : null });
        } else {
            console.log("Attempting INSERT for New Journey");
            const { data, error } = await supabase
                .from('checkout_journeys')
                .insert({
                    user_mobile: user_mobile || 'Anon',
                    user_email: user_email || '',
                    items: items || [],
                    amount: amount || 0,
                    status: status || 'Initiated'
                })
                .select();
            
            if (error) {
                console.error("Supabase Insert Error:", error);
                return NextResponse.json({ success: false, error: error.message, details: error }, { status: 400 });
            }
            return NextResponse.json({ success: true, data: data ? data[0] : null });
        }
    } catch (error: any) {
        console.error("Journey API Crash:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
