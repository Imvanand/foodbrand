import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_mobile, user_email, subject, description, priority, category, journey_id, customer_name } = body;
        const supabase = await createClient();

        // Generate Ticket ID like T-123456
        const ticketId = `T-${Math.floor(100000 + Math.random() * 900000)}`;

        const { data, error } = await supabase
            .from('support_tickets')
            .insert({
                id: ticketId,
                user_mobile: user_mobile || 'Anon',
                user_email: user_email || '',
                customer_name: customer_name || 'Guest Customer',
                subject: subject || 'Checkout Issue',
                description: description || 'No details provided',
                priority: priority || 'Medium',
                category: category || 'Payment',
                journey_id,
                status: 'Open'
            })
            .select();
        
        if (error) throw error;

        // --- TRIGGER EMAIL ALERT TO ADMIN ---
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            try {
                const resend = new Resend(apiKey);
                const adminEmail = 'impreetianand28@gmail.com';
                
                const recoveryUrl = `https://kalsafoods.com/admin/recovery`;
                const whatsappUrl = `https://wa.me/91${user_mobile}?text=Hi%20there!%20I'm%20from%20Kalsa%20Foods.%20I%20noticed%20you%20had%20an%20issue%20with%20your%20checkout.%20Can%20I%20help%20you%20complete%20your%20order?`;

                const alertHTML = `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #2c3e50;">
                        <div style="background: linear-gradient(135deg, #d63031 0%, #ff4757 100%); padding: 35px 20px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">⚠️ Checkout Failure Alert</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 14px;">A customer just failed to complete their purchase!</p>
                        </div>
                        
                        <div style="padding: 30px;">
                            <div style="background-color: #fffaf0; border-radius: 10px; padding: 20px; border-left: 5px solid #ffa502; margin-bottom: 25px;">
                                <h3 style="margin-top: 0; color: #e67e22; font-size: 16px;">Recovery Details:</h3>
                                <p style="margin: 8px 0;"><strong>Customer:</strong> ${customer_name || 'Guest'}</p>
                                <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${user_mobile}" style="color: #2c3e50; text-decoration: none;">${user_mobile}</a></p>
                                <p style="margin: 8px 0;"><strong>Issue:</strong> <span style="color: #d63031;">${description}</span></p>
                                <p style="margin: 8px 0;"><strong>Ticket ID:</strong> ${ticketId}</p>
                            </div>

                            <div style="text-align: center; margin-top: 30px; display: flex; flex-direction: column; gap: 12px;">
                                <a href="${whatsappUrl}" style="background-color: #25D366; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; display: block; text-align: center;">
                                    💬 Contact Customer on WhatsApp
                                </a>
                                <a href="${recoveryUrl}" style="background-color: #224b33; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: block; text-align: center; margin-top: 10px;">
                                    🖥️ Open Recovery Hub Dashboard
                                </a>
                            </div>
                        </div>
                        
                        <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #95a5a6;">
                            <p>This is an automated system alert from Kalsa Foods.</p>
                        </div>
                    </div>
                `;

                await resend.emails.send({
                    from: 'Kalsa Recovery Alert <alerts@resend.dev>',
                    to: [adminEmail],
                    subject: `🚑 URGENT: Checkout Failure - ${user_mobile}`,
                    html: alertHTML,
                });
            } catch (emailErr) {
                console.error("Failed to send admin ticket alert:", emailErr);
            }
        }

        return NextResponse.json({ success: true, ticket: data[0] });
    } catch (error: any) {
        console.error("Ticket Creation Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const ticketId = searchParams.get('id');
    const supabase = await createClient();

    if (!phone && !ticketId) {
        return NextResponse.json({ success: false, error: 'Phone or Ticket ID required' }, { status: 400 });
    }

    try {
        let query = supabase.from('support_tickets').select('*');
        if (ticketId) query = query.eq('id', ticketId);
        else if (phone) query = query.eq('user_mobile', phone);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        return NextResponse.json({ success: true, tickets: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
