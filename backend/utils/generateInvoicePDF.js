import PDFDocument from 'pdfkit';

// Invoice object leke PDF stream banata hai — controller me res ke sath pipe karenge
export const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(20).text('MediCore Hospital', { align: 'left' });
  doc.fontSize(10).fillColor('#555').text('123 Health Street, Multan, Pakistan');
  doc.moveDown(2);

  doc.fontSize(16).fillColor('#000').text(`Invoice: ${invoice.invoiceNumber}`);
  doc.fontSize(10).fillColor('#555').text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.text(`Patient: ${invoice.patient?.name || 'N/A'} (${invoice.patient?.patientId || ''})`);
  doc.moveDown();

  // Table header
  doc.fontSize(11).fillColor('#000');
  const tableTop = doc.y;
  doc.text('Description', 50, tableTop);
  doc.text('Qty', 300, tableTop);
  doc.text('Unit Price', 360, tableTop);
  doc.text('Amount', 460, tableTop);
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let y = tableTop + 25;
  invoice.items.forEach((item) => {
    doc.fontSize(10).text(item.description, 50, y);
    doc.text(String(item.quantity), 300, y);
    doc.text(item.unitPrice.toFixed(2), 360, y);
    doc.text((item.quantity * item.unitPrice).toFixed(2), 460, y);
    y += 20;
  });

  doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke();
  y += 15;

  doc.fontSize(10);
  doc.text(`Subtotal: ${invoice.subtotal.toFixed(2)}`, 400, y);
  y += 15;
  doc.text(`Tax (${invoice.taxPercent}%): ${invoice.taxAmount.toFixed(2)}`, 400, y);
  y += 15;
  doc.text(`Discount (${invoice.discountPercent}%): -${invoice.discountAmount.toFixed(2)}`, 400, y);
  y += 15;
  doc.fontSize(12).text(`Total: ${invoice.totalAmount.toFixed(2)}`, 400, y);
  y += 20;
  doc.fontSize(10).text(`Payment Status: ${invoice.paymentStatus.toUpperCase()}`, 400, y);

  doc.end();
};