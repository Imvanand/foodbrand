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
        let supabaseOrder = null;
        const supabase = await createClient();

        if (inputOrderId && inputOrderId.startsWith('KF-')) {
            const hexPart = inputOrderId.replace('KF-', '').toLowerCase();
            const { data: ordersData } = await supabase.from('orders').select('*');
            supabaseOrder = ordersData?.find(o => o.id.replace(/-/g, '').startsWith(hexPart.replace(/-/g, '')));
        } else if (phone) {
            // Find address with this phone
            const { data: addresses } = await supabase.from('user_addresses').select('id').eq('phone', phone);
            if (addresses && addresses.length > 0) {
                const addressIds = addresses.map(a => a.id);
                // Get most recent order for these addresses
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .in('address_id', addressIds)
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (orders && orders.length > 0) supabaseOrder = orders[0];
            }
        }

        if (supabaseOrder && supabaseOrder.waybill) {
            finalWaybill = supabaseOrder.waybill;
        }

        // 2. Fetch from Delhivery
        let delhiveryData = { ShipmentData: [] };
        if (finalWaybill || inputOrderId) {
            let url = `https://track.delhivery.com/api/v1/packages/json/`;
            if (finalWaybill) {
                url += `?waybill=${finalWaybill}`;
            } else {
                url += `?ref_ids=${inputOrderId}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            delhiveryData = await response.json();
        }

        // 3. Merge Results: If Delhivery has no data but Supabase has the order
        if ((!delhiveryData.ShipmentData || delhiveryData.ShipmentData.length === 0) && supabaseOrder) {
            // Mock a ShipmentData response based on Supabase record
             return NextResponse.json({
                success: true,
                isSupabaseOnly: true,
                ShipmentData: [{
                    Shipment: {
                        Waybill: "NOT_SYNCED_YET",
                        ReferenceNo: inputOrderId,
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
