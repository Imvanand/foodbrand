import { NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/shipping';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const pincode = searchParams.get('pincode');

        if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Please enter a valid 6-digit pincode' 
            }, { status: 400 });
        }

        const result = await checkPincodeServiceability(pincode);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ 
            status: 'error', 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}
