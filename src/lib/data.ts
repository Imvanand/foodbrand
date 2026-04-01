import { createClient } from '@/utils/supabase/server';
import { getProductImages, getSliderImages } from './actions';

export async function getHomePageData() {
    const supabase = await createClient();

    // Fetch Monthly Sales (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [sliderImages, productImages, productRes, reviewsRes, salesRes] = await Promise.all([
        getSliderImages(),
        getProductImages(),
        supabase.from('products').select('*').eq('id', 'kalsa-spicemix-100g').single(),
        supabase.from('product_reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false }),
        // Fetch order IDs from the last 30 days
        supabase.from('orders')
            .select('id')
            .gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    // Fetch review stats
    const reviews = reviewsRes.data || [];
    let avg = 0;
    let counts = [0, 0, 0, 0, 0];
    if (reviews.length > 0) {
        avg = reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / reviews.length;
        reviews.forEach((r: any) => {
            if (r.rating >= 1 && r.rating <= 5) counts[5 - r.rating]++;
        });
    }
    const breakdown = counts.map(c => reviews.length > 0 ? Math.round((c / reviews.length) * 100) : 0);
    
    // Now get the sum of quantity for the specific product from these orders
    let monthlySales = 0;
    if (salesRes.data && salesRes.data.length > 0) {
        const orderIds = salesRes.data.map(o => o.id);
        const { data: itemSales } = await supabase
            .from('order_items')
            .select('quantity')
            .eq('product_id', 'kalsa-spicemix-100g')
            .in('order_id', orderIds);
            
        monthlySales = itemSales?.reduce((acc: any, curr: any) => acc + (curr.quantity || 1), 0) || 0;
    }

    return {
        sliderImages,
        productImages,
        productData: productRes.data,
        reviews,
        reviewStats: {
            average: avg,
            count: reviews.length,
            breakdown,
            monthlySales
        }
    };
}
