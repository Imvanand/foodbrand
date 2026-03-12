import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const orderData = await req.json();

        // Define directory and file path
        const publicDir = path.join(process.cwd(), 'public');
        const filePath = path.join(publicDir, 'monthly_sales_record.csv');

        // Create headers if file doesn't exist
        const headers = "Date,Order ID,Product,Quantity,Total Amount (₹),Customer Name,Phone,Address,Payment Status\n";

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, headers, 'utf8');
        }

        // Clean address to avoid CSV issues (replace commas with spaces)
        const cleanAddress = (orderData.Address || "").replace(/,/g, " ");

        // Format the row
        const row = `${orderData.Date},${orderData.OrderID},${orderData.Product},${orderData.Quantity},${orderData.TotalAmount},${orderData.CustomerName},${orderData.Phone},"${cleanAddress}",${orderData.PaymentStatus}\n`;

        // Append to file
        fs.appendFileSync(filePath, row, 'utf8');

        return NextResponse.json({ success: true, message: "Order logged locally" });
    } catch (error: any) {
        console.error('Local File Logging Error:', error);
        // We still return 200 to not block the user's order flow if file writing fails on serverless
        return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }
}
