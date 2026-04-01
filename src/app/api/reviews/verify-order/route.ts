import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function POST(req: Request) {
    try {
        const { orderId, phone } = await req.json();
        const supabase = await createClient();

        if (!orderId && !phone) {
            return NextResponse.json({ success: false, error: 'Order ID or Mobile Number is required' }, { status: 400 });
        }

        // Fetch all delivered orders with customer info
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, user_addresses(*)')
            .eq('status', 'delivered');

        let matches: any[] = [];

        if (orderId) {
            const hexPart = orderId.replace('KF-', '').toLowerCase();
            matches = orders?.filter(o => o.id.replace(/-/g, '').startsWith(hexPart.replace(/-/g, ''))) || [];
        } else if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            matches = orders?.filter(o => o.user_addresses?.phone.includes(cleanPhone)) || [];
        }

        if (!matches || matches.length === 0) {
            return NextResponse.json({ 
                success: false, 
                error: 'No delivered orders found for this ' + (orderId ? 'Order ID' : 'Mobile Number') 
            }, { status: 404 });
        }

        // Get items for all matched orders
        const orderIds = matches.map(m => m.id);
        const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);
        
        if (!items || items.length === 0) {
            return NextResponse.json({ 
                success: true, 
                orderId: matches[0].id, 
                customerName: matches[0].user_addresses?.full_name,
                products: [] 
            });
        }

        // Fetch product details for these items
        const productIds = items.map(item => item.product_id);
        const { data: products } = await supabase
            .from('products')
            .select('id, main_image, full_name_en')
            .in('id', productIds);

        // Map images and full names back to items
        const productsWithImages = items.map(item => {
            const product = products?.find(p => p.id === item.product_id);
            let img = product?.main_image || '/logo/logo.png';
            let name = product?.full_name_en || item.name;
            
            // Hardcoded preference for Spice Mix
            if (item.product_id === 'kalsa-spicemix-100g') {
                img = '/Product-Spice_MIX_Masala/3.png';
            }
            
            return {
                ...item,
                name: name,
                image: img
            };
        });
        
        return NextResponse.json({ 
            success: true, 
            orderId: matches[0].id, // For tracking
            customerName: matches[0].user_addresses?.full_name,
            products: productsWithImages 
        });

    } catch (error: any) {
        console.error("Review verification error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
