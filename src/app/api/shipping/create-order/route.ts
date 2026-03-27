import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const token = process.env.DELHIVERY_API_TOKEN;
        const body = await req.json();

        const payload = {
            pickup_location: {
                name: "Kalsa Foods"
            },
            shipments: [{
                name: body.customerName,
                add: body.address,
                pin: body.pincode,
                phone: body.phone,
                order: body.orderId,
                payment_mode: body.paymentMode === 'prepaid' ? 'Pre-paid' : 'COD',
                cod_amount: body.paymentMode === 'cod' ? body.totalAmount : 0,
                total_amount: body.totalAmount,
                quantity: body.quantity || "1",
                hsn_code: "0910",
                products_desc: body.productName,
                client: "5a50bb-PREETIKUMARI-do"
            }]
        };

        const params = new URLSearchParams();
        params.append('format', 'json');
        params.append('data', JSON.stringify(payload));

        const response = await fetch(`https://track.delhivery.com/api/cmu/create.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();
        const waybill = data?.packages?.[0]?.waybill;
        const status = data?.packages?.[0]?.status;
        console.log(`[Delhivery] Status: ${status} | Waybill: ${waybill || 'N/A'} | Success: ${data.success}`);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("[Delhivery] API Route Error:", error.message);
        return NextResponse.json({ success: false, rmk: error.message }, { status: 500 });
    }
}
