"use server";

import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRecoveryEmail(email: string, items: any[], amount: number, mobile: string) {
    if (!process.env.RESEND_API_KEY) return { success: false, error: "Resend API key not configured" };

    try {
        const { data, error } = await resend.emails.send({
            from: 'Kalsa Recovery <alerts@resend.dev>',
            to: ['impreetianand28@gmail.com'], // Always send to admin during trial mode
            subject: `🚀 RECOVERY ACTION: ${mobile || email} - Items Waiting!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2c3e50; line-height: 1.6; border: 1px solid #e0e0e0; border-radius: 16px; overflow: hidden;">
                    <div style="background-color: #224b33; padding: 25px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">Recovery Hub Action</h1>
                        <p style="margin-top: 5px; opacity: 0.9;">Customer abandoned checkout - Action Required</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="background: #f8fbf9; border-radius: 12px; padding: 20px; border-left: 5px solid #224b33; margin-bottom: 25px;">
                            <h3 style="margin-top: 0; color: #224b33;">Customer Details</h3>
                            <p style="margin: 8px 0;"><strong>Mobile:</strong> <a href="tel:${mobile}" style="color: #224b33; text-decoration: none;">${mobile}</a></p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                            <div style="margin-top: 15px;">
                                <a href="https://wa.me/${mobile}" style="background-color: #25D366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">Message on WhatsApp</a>
                            </div>
                        </div>

                        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Cart Summary (₹${amount})</h3>
                        <div style="margin: 15px 0;">
                            ${items?.map(item => `
                                <div style="padding: 8px 0; border-bottom: 1px dashed #eee;">
                                    <strong>${item.qty}x</strong> ${item.name}
                                </div>
                            `).join('') || 'No items listed'}
                        </div>

                        <div style="margin-top: 30px; padding: 15px; background: #fff5f5; border-radius: 8px; color: #c53030; font-size: 13px;">
                            <strong>Note:</strong> Since your email is in trial mode, this alert was sent to you (the admin) for review. You can manually follow up with the customer using the contact details above.
                        </div>

                        <div style="margin-top: 40px; text-align: center;">
                            <a href="https://kalsafoods.com/admin/recovery" style="color: #224b33; font-weight: bold; text-decoration: none; border-bottom: 2px solid #224b33;">Go to Recovery Dashboard</a>
                        </div>
                    </div>
                </div>
            `,
        });

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getProductImages() {
    const imagesDirectory = path.join(process.cwd(), 'public/Product_images');

    try {
        if (!fs.existsSync(imagesDirectory)) {
            console.warn("Directory not found:", imagesDirectory);
            return [];
        }

        const fileNames = fs.readdirSync(imagesDirectory);

        // Filter for image files and exclude hidden files like .DS_Store
        const imageFiles = fileNames.filter(fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg')
                && !fileName.startsWith('.');
        }).sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true });
        });



        // Map to public URLs with cache busting
        return imageFiles.map(fileName => {
            const filePath = path.join(imagesDirectory, fileName);
            const stats = fs.statSync(filePath);
            return `/Product_images/${fileName}?v=${stats.mtimeMs}`;
        });
    } catch (error) {
        console.error("Error reading product images directory:", error);
        return [];
    }
}

export async function getSliderImages() {
    const imagesDirectory = path.join(process.cwd(), 'public/Slider');

    try {
        if (!fs.existsSync(imagesDirectory)) {
            return [];
        }

        const fileNames = fs.readdirSync(imagesDirectory);

        const imageFiles = fileNames.filter(fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg')
                && !fileName.startsWith('.');
        });

        return imageFiles.map(fileName => {
            const filePath = path.join(imagesDirectory, fileName);
            const stats = fs.statSync(filePath);
            return `/Slider/${fileName}?v=${stats.mtimeMs}`;
        });
    } catch (error) {
        console.error("Error reading slider images directory:", error);
        return [];
    }
}
