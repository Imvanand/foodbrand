import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_id, order_id, rating, title, content, customer_name, verified_purchase, images } = body;
        
        const supabase = await createClient();

        if (!product_id || !order_id || !rating || !title || !content || !customer_name) {
            return NextResponse.json({ success: false, error: 'Missing required review fields' }, { status: 400 });
        }

        // Save to Database
        const { data, error } = await supabase
            .from('product_reviews')
            .insert([{
                product_id,
                order_id,
                rating,
                title,
                content,
                customer_name,
                verified_purchase: verified_purchase || false,
                is_approved: true, // Auto-approve for now, can be changed to false if manual moderation is needed
                images: images || []
            }])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error("Review submission error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
