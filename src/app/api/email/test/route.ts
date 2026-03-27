import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Kalsa Foods <onboarding@resend.dev>',
            to: ['impreetianand28@gmail.com'], 
            subject: 'Test Order Confirmation',
            html: '<p>Congrats! Your Kalsa Foods email system is working correctly. This is a test email.</p>',
        });

        if (error) return NextResponse.json({ success: false, error }, { status: 500 });
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
