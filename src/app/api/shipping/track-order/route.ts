import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get('waybill');
    const inputOrderId = searchParams.get('id');
    const phone = searchParams.get('phone');
    const token = process.env.DELHIVERY_API_TOKEN;

    if (!waybill && !inputOrderId && !phone) {
        return NextResponse.json({ success: false, error: 'Waybill, Order ID or Phone required' }, { status: 400 });
    }

    try {
        let finalWaybill = waybill;
        let supabaseOrder: any = null;
        let supabaseOrders: any[] = [];
        const supabase = await createClient();

        if (inputOrderId && inputOrderId.startsWith('KF-')) {
            const hexPart = inputOrderId.replace('KF-', '').toLowerCase();
            const { data: ordersData } = await supabase.from('orders').select('*');
            const found = ordersData?.find(o => o.id.replace(/-/g, '').startsWith(hexPart.replace(/-/g, '')));
            if (found) supabaseOrders = [found];
        } else if (phone) {
            // Find address with this phone
            const { data: addresses } = await supabase.from('user_addresses').select('id').eq('phone', phone);
            if (addresses && addresses.length > 0) {
                const addressIds = addresses.map(a => a.id);
                // Get last 3 orders for these addresses
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .in('address_id', addressIds)
                    .order('created_at', { ascending: false })
                    .limit(5);
                supabaseOrders = orders || [];
            }
        }

        if (supabaseOrders.length === 0 && !waybill && !inputOrderId) {
             return NextResponse.json({ success: false, error: 'No matching order found' }, { status: 404 });
        }

        // If we have multiple orders from a phone lookup, we might want to return them as a list
        // However, for the primary tracking, we'll auto-select the most recent one 
        // BUT we'll send the list back so the frontend can show a selector if needed.
        supabaseOrder = supabaseOrders[0];

        // Fetch Order Items if we have a supabaseOrder
        let orderItems: any[] = [];
        if (supabaseOrder) {
            const { data: items } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', supabaseOrder.id);
            orderItems = items || [];
        }

        if (supabaseOrder && supabaseOrder.waybill) {
            finalWaybill = supabaseOrder.waybill;
        }

        // 2. Fetch from Delhivery
        let delhiveryData: any = { ShipmentData: [] };
        if (finalWaybill || (supabaseOrder && supabaseOrder.id)) {
            const refId = (supabaseOrder ? `KF-${supabaseOrder.id.slice(0, 8).toUpperCase()}` : null);
            let url = `https://track.delhivery.com/api/v1/packages/json/`;
            if (finalWaybill) {
                url += `?waybill=${finalWaybill}`;
            } else if (refId) {
                url += `?ref_ids=${refId}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            delhiveryData = await response.json();
            // Add items and the full list of orders to delhiveryData for frontend
            delhiveryData.orderItems = orderItems;
            delhiveryData.orderId = supabaseOrder ? `KF-${supabaseOrder.id.slice(0, 8).toUpperCase()}` : (inputOrderId || "N/A");
            delhiveryData.allOrders = supabaseOrders.map(o => ({
                id: `KF-${o.id.slice(0, 8).toUpperCase()}`,
                fullId: o.id,
                date: o.created_at,
                status: o.status || 'Processing',
                waybill: o.waybill
            }));
        }

        // 3. Merge Results: If Delhivery has no data but Supabase has the order
        if ((!delhiveryData.ShipmentData || delhiveryData.ShipmentData.length === 0) && supabaseOrder) {
            // Mock a ShipmentData response based on Supabase record
             return NextResponse.json({
                success: true,
                isSupabaseOnly: true,
                orderItems,
                orderId: `KF-${supabaseOrder.id.slice(0, 8).toUpperCase()}`,
                ShipmentData: [{
                    Shipment: {
                        Waybill: "NOT_SYNCED_YET",
                        ReferenceNo: inputOrderId || `KF-${supabaseOrder.id.slice(0, 8).toUpperCase()}`,
                        Status: {
                            Status: "Processing (Order Received)",
                            StatusDateTime: supabaseOrder.created_at,
                            Instructions: "Your order is received and being prepared for shipment via Delhivery."
                        },
                        Scans: [],
                        Destination: "Processing",
                        ExpectedDeliveryDate: null
                    }
                }]
            });
        }

        return NextResponse.json(delhiveryData);
    } catch (error: any) {
        console.error("Tracking Integration Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
