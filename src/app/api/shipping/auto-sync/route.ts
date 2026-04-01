import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get('secret');
        
        // Security check for your Cron Service (matches any secret you choose)
        const cronSecret = process.env.CRON_SECRET || 'kalsa-secure-sync-key';
        
        if (secret !== cronSecret) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = await createClient();
        
        // 1. Fetch all orders that might have tracking updates
        const { data: orders, error: fetchErr } = await supabase
            .from('orders')
            .select('*, user_addresses(*)')
            .in('status', ['shipped', 'processing']);

        if (fetchErr) throw fetchErr;

        let totalUpdated = 0;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kalsafoods.com';

        for (const order of (orders || [])) {
            if (!order.waybill) continue;

            try {
                // 2. Check live status with Delhivery
                const res = await fetch(`https://track.delhivery.com/api/v1/packages/json/?waybill=${order.waybill}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${process.env.DELHIVERY_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await res.json();
                if (!data || !data.ShipmentData || data.ShipmentData.length === 0) continue;

                const dlStatus = data.ShipmentData[0].Shipment.Status?.Status;
                if (!dlStatus) continue;

                let newStatus = '';
                if (dlStatus.toLowerCase().includes('delivered')) {
                    newStatus = 'delivered';
                } else if (dlStatus.toLowerCase().includes('cancelled') || dlStatus.toLowerCase().includes('rto')) {
                    newStatus = 'cancelled';
                } else if (dlStatus.toLowerCase().includes('in transit') && order.status !== 'shipped') {
                    newStatus = 'shipped';
                }

                // 3. Update if changed
                if (newStatus && newStatus !== order.status) {
                    await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);

                    // 4. Trigger the Customer Email via our internal API
                    if (newStatus === 'delivered') {
                        // Fetch order items for the Invoice
                        const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
                        
                        // Send the full Delivered + Invoice PDF email
                        await fetch(`${appUrl}/api/email/delivered`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: `KF-${order.id.slice(0, 8).toUpperCase()}`,
                                customerName: order.user_addresses?.full_name || 'Customer',
                                customerEmail: order.user_addresses?.email || order.user_email,
                                totalAmount: order.total_amount,
                                orderDate: new Date(order.created_at).toLocaleDateString(),
                                products: items || [],
                                shippingAddress: `${order.user_addresses?.flat_house}, ${order.user_addresses?.area_street}, ${order.user_addresses?.city}, ${order.user_addresses?.state}`,
                                phone: order.user_addresses?.phone || order.user_email,
                                pincode: order.user_addresses?.pincode || ''
                            })
                        });
                    } else {
                        // Standard Shipping Update (In Transit)
                        await fetch(`${appUrl}/api/email/shipping-update`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: `KF-${order.id.slice(0, 8).toUpperCase()}`,
                                customerName: order.user_addresses?.full_name || 'Customer',
                                customerEmail: order.user_addresses?.email || order.user_email,
                                waybill: order.waybill,
                                status: newStatus === 'shipped' ? 'transit' : newStatus,
                                expectedDelivery: newStatus === 'shipped' ? 'Within 3-5 days' : null
                            })
                        });
                    }

                    totalUpdated++;
                }
            } catch (orderUpdateErr) {
                console.error(`Status sync failed for order ${order.id}:`, orderUpdateErr);
            }
        }

        return NextResponse.json({ success: true, updatedCount: totalUpdated });

    } catch (error: any) {
        console.error("Auto-Sync Cron Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
