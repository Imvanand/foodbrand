import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types for the product and customer details
interface InvoiceData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerPincode: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
    gstAmount: number;
    deliveryCharge: number;
    totalAmount: number;
    orderDate: string;
    orderId: string;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = url;
    });
};

export const generateInvoicePDF = async (data: InvoiceData) => {
    const doc = new jsPDF();

    // attempt to load logo and maintain aspect ratio
    let logoHeight = 25; // Default fallback height
    try {
        const logo = await loadImage('/logo/logo.png');
        const targetWidth = 35; // Standard width
        const aspectRatio = logo.width / logo.height;
        logoHeight = targetWidth / aspectRatio;

        // Limit max height to keep it professional
        if (logoHeight > 35) {
            const scale = 35 / logoHeight;
            logoHeight = 35;
            doc.addImage(logo, 'PNG', 20, 10, 35 * scale, logoHeight);
        } else {
            doc.addImage(logo, 'PNG', 20, 10, targetWidth, logoHeight);
        }
    } catch (e) {
        console.warn("Logo failed to load for invoice:", e);
        logoHeight = 0;
    }

    // Seller Info (Calculated Y position based on Logo)
    const infoY = Math.max(logoHeight + 15, 45);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text('Bangalore, India 560049', 20, infoY);
    doc.text('Phone: 6206357414', 20, infoY + 5);
    doc.text('Email: support@kalsafoods.com', 20, infoY + 10);
    doc.text('Website: www.kalsafoods.com', 20, infoY + 15);
    doc.setFont("helvetica", "bold");
    doc.text('GSTIN: 29KOEPK2332M1ZI', 20, infoY + 20);

    // Dynamic line position
    const lineY = infoY + 25;

    // Invoice Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text('TAX INVOICE', 140, 25);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${data.orderId}`, 140, 35);
    doc.text(`Date: ${data.orderDate}`, 140, 42);

    // Separator Line
    doc.setDrawColor(228, 121, 17);
    doc.setLineWidth(0.5);
    doc.line(20, lineY, 190, lineY);

    // Bill To Section
    const billToY = lineY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('BILLED TO:', 20, billToY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(data.customerName.toUpperCase(), 20, billToY + 7);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Phone: ${data.customerPhone}`, 20, billToY + 13);

    const address = `${data.customerAddress}, Pincode: ${data.customerPincode}`;
    const splitAddress = doc.splitTextToSize(address, 80);
    doc.text(splitAddress, 20, billToY + 19);

    // Delivery Status
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 120, 40);
    doc.text(`Delivery: ${data.deliveryCharge === 0 ? 'Standard (Free)' : 'Standard'}`, 140, billToY);

    // Items Table
    autoTable(doc, {
        startY: billToY + 35,
        head: [['#', 'PRODUCT DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
        body: [
            [
                '1',
                data.productName,
                `${data.quantity} packs`,
                `Rs. ${data.price.toFixed(2)}`,
                `Rs. ${(data.quantity * data.price).toFixed(2)}`
            ]
        ],
        theme: 'grid',
        headStyles: {
            fillColor: [228, 121, 17],
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { cellWidth: 90 },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' }
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            lineColor: [220, 220, 220]
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Totals Section
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    doc.text('Subtotal (Excl. GST):', 130, finalY);
    doc.text(`Rs. ${data.subtotal.toFixed(2)}`, 185, finalY, { align: 'right' });

    doc.text('GST (5%):', 130, finalY + 7);
    doc.text(`Rs. ${data.gstAmount.toFixed(2)}`, 185, finalY + 7, { align: 'right' });

    doc.text('Delivery Charges:', 130, finalY + 14);
    doc.text(`Rs. ${data.deliveryCharge.toFixed(2)}`, 185, finalY + 14, { align: 'right' });

    doc.setDrawColor(200, 200, 200);
    doc.line(130, finalY + 18, 190, finalY + 18);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text('GRAND TOTAL:', 130, finalY + 25);
    doc.text(`Rs. ${data.totalAmount.toFixed(2)}`, 185, finalY + 25, { align: 'right' });

    // Notes
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text('Payment Information:', 20, finalY + 40);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text('Please share the screenshot of your payment on WhatsApp.', 20, finalY + 47);
    doc.text('A copy of this invoice has been generated for your records.', 20, finalY + 52);

    // Authenticity Stamp Placeholder
    doc.setDrawColor(228, 121, 17);
    doc.rect(140, finalY + 40, 45, 20);
    doc.setFontSize(8);
    doc.text('Authorised Signatory', 145, finalY + 45);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('KALSA FOODS', 145, finalY + 55);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer generated invoice and does not require a physical signature.', 105, 275, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your order!', 105, 285, { align: 'center' });

    // Download the PDF
    doc.save(`Invoice_${data.orderId}.pdf`);
};
