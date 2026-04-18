import PDFDocument from 'pdfkit';
import { toWords } from 'number-to-words';

export const generateQuotePDF = (leadName: string, leadEmail: string, quote: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // --- PREMIUM BRANDING HEADER ---
    doc.rect(0, 0, 600, 140).fill('#000000');
    
    // Abstract Logo Shape
    doc.moveTo(40, 40).lineTo(60, 40).lineTo(70, 70).lineTo(50, 70).fill('#FACC15');
    doc.moveTo(55, 30).lineTo(75, 30).lineTo(85, 60).lineTo(65, 60).fill('#FFFFFF');

    doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('FLEET', 100, 45, { continued: true });
    doc.fillColor('#FACC15').text('AD');
    
    doc.fillColor('#A1A1AA').fontSize(9).font('Helvetica').text('THE NEXT GEN VEHICLE ADVERTISING SYSTEM', 100, 72);

    // Header Right Info
    doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold').text('OFFICIAL MEDIA QUOTATION', 350, 45, { align: 'right', width: 200 });
    doc.fillColor('#FACC15').fontSize(11).text(`QNO: VAP-${Math.floor(1000 + Math.random() * 90000)}`, 350, 62, { align: 'right', width: 200 });
    doc.fillColor('#A1A1AA').fontSize(9).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 350, 78, { align: 'right', width: 200 });

    // --- ATTENTION BAR ---
    doc.rect(40, 120, 515, 40).fill('#1A1A1A');
    doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold').text('PREPARED FOR:', 60, 133);
    doc.fillColor('#FACC15').text(`${leadName.toUpperCase()} (${leadEmail})`, 160, 133);

    // --- CONTENT BODY ---
    let y = 180;

    // Table Header
    doc.rect(40, y, 515, 30).fill('#FACC15');
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('CAMPAIGN DESCRIPTION', 55, y + 10);
    doc.text('UNIT PRICE', 320, y + 10);
    doc.text('AMOUNT (INR)', 440, y + 10, { align: 'right', width: 100 });

    y += 40;

    // Table Rows Function
    const drawPremiumRow = (desc: string, unit: string, amount: number) => {
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(desc, 55, y);
      doc.fillColor('#52525B').fontSize(9).font('Helvetica').text(unit, 320, y);
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(amount.toLocaleString(), 440, y, { align: 'right', width: 100 });
      y += 18;
      doc.moveTo(40, y).lineTo(555, y).stroke('#F1F5F9');
      y += 15;
    };

    const oneTimeTotal = Number(quote.designCharges || 0) + Number(quote.printingCharges || 0) + Number(quote.serviceCharges || 0) + Number(quote.transportCharges || 0) + Number(quote.installationCharges || 0);
    const rentalPerKm = Number(quote.rentalPerKm || 0);
    const avgKm = Number(quote.expectedAvgKm || 0);
    const duration = Number(quote.durationMonths || 1);

    drawPremiumRow('Creative Design & Pre-Press Production', 'One-time Lumpsum', Number(quote.designCharges || 0));
    drawPremiumRow('Premium Vinyl Printing & Lamination', 'Per Total Fleet', Number(quote.printingCharges || 0));
    drawPremiumRow('Installation & Field Logistics', 'Manual Application', Number(quote.installationCharges || 0) + Number(quote.transportCharges || 0));
    drawPremiumRow('Campaign Compliance & Monitoring', 'Service Charge', Number(quote.serviceCharges || 0));
    
    const monthlyTotal = rentalPerKm * avgKm;
    drawPremiumRow(`Base Media Rental (${duration} Months)`, `INR ${rentalPerKm}/KM @ ${avgKm}KM/Mo`, monthlyTotal * duration);

    // --- TOTALS AREA ---
    y += 10;
    const subtotal = oneTimeTotal + (monthlyTotal * duration);
    const gstRate = Number(quote.gstPercentage || 18);
    const gst = (subtotal * gstRate) / 100;
    const grandTotal = Math.round(subtotal + gst);

    doc.rect(340, y, 215, 120).fill('#F8FAFC');
    
    let totalY = y + 15;
    doc.fillColor('#64748B').fontSize(9).font('Helvetica').text('CAMPAIGN SUBTOTAL:', 355, totalY);
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(`INR ${subtotal.toLocaleString()}`, 440, totalY, { align: 'right', width: 100 });
    
    totalY += 25;
    doc.fillColor('#64748B').fontSize(9).font('Helvetica').text(`GST APPLICABLE (${gstRate}%):`, 355, totalY);
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(`INR ${gst.toLocaleString()}`, 440, totalY, { align: 'right', width: 100 });

    totalY += 25;
    doc.rect(340, totalY - 5, 215, 35).fill('#000000');
    doc.fillColor('#FACC15').fontSize(11).font('Helvetica-Bold').text('ESTIMATED TOTAL:', 355, totalY + 8);
    doc.text(`INR ${grandTotal.toLocaleString()}`, 440, totalY + 8, { align: 'right', width: 100 });

    // Amount in words below Totals
    y += 135;
    const amountInWords = toWords(grandTotal).replace(/,/g, '').toUpperCase();
    doc.fillColor('#94A3B8').fontSize(8).font('Helvetica-Bold').text('ESTIMATED QUOTATION VALUE IN WORDS:', 40, y);
    doc.fillColor('#0F172A').fontSize(10).font('Helvetica-Bold').text(`** ${amountInWords} INDIAN RUPEES ONLY **`, 40, y + 14);

    // --- TERMS & FOOTER ---
    y += 60;
    doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('PROJECT TERMS & COMPLIANCE:', 40, y);
    doc.fillColor('#64748B').fontSize(8).font('Helvetica').text(quote.notes || '1. This estimation is based on provided data and actual KM tracking may vary.\n2. Campaign duration fixed as per the mentioned months.\n3. Quotation valid for 14 working days from generated date.\n4. GPS data for compliance reporting will be shared weekly.', 40, y + 18, { width: 300, lineGap: 3 });

    // Signature Placeholder
    doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold').text('Authorized Seal / Signature', 400, y + 60, { align: 'center', width: 150 });
    doc.moveTo(400, y + 55).lineTo(550, y + 55).stroke('#000');

    // Bottom Bar
    doc.rect(0, 810, 600, 32).fill('#FACC15');
    doc.fillColor('#000000').fontSize(8).font('Helvetica').text('FLEETAD MEDIA LTD | CORPORATE ADVERTISING | COMPUTER GENERATED DOCUMENT', 0, 822, { align: 'center', width: 600 });

    doc.end();
  });
};
