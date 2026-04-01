import { createClient } from '@/utils/supabase/server';
import { getProductImages, getSliderImages } from './actions';

export async function getHomePageData() {
    const supabase = await createClient();

    const [sliderImages, productImages, productRes, reviewsRes] = await Promise.all([
        getSliderImages(),
        getProductImages(),
        supabase.from('products').select('*').eq('id', 'kalsa-spicemix-100g').single(),
        supabase.from('product_reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
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

    // Fetch Monthly Sales (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data: sales } = await supabase
        .from('order_items')
        .select('quantity')
        .eq('product_id', 'kalsa-spicemix-100g')
        .gte('created_at', thirtyDaysAgo.toISOString());
    const monthlySales = sales?.reduce((acc: any, curr: any) => acc + (curr.quantity || 1), 0) || 0;

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
