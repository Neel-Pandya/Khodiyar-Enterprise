import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Fetch image and convert to base64
 * @param {string} url - Image URL
 * @returns {Promise<string|null>} - Base64 image data or null
 */
const getImageBase64 = async (url) => {
  try {
    // Handle placeholder or invalid URLs
    if (!url || url.includes('placeholder')) return null;
    
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Failed to load image:', url, error);
    return null;
  }
};

/**
 * Export order invoice to PDF with product images
 * @param {Object} options - Export options
 * @param {Object} options.order - Order object with details
 * @param {Array} options.orderItems - Array of order items
 * @param {string} options.logoSrc - Company logo (base64 or URL)
 */
export const exportOrderInvoice = async ({ order, orderItems, logoSrc }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const primaryColor = [30, 58, 95]; // #1E3A5F
  
  // Header Section
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('KHODIYAR ENTERPRISE', margin, 18);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Solar Power Solutions', margin, 26);
  doc.text('order@khodiyarenterprise.com | +91 98765 43210', margin, 32);
  
  // Invoice Title
  doc.setTextColor(...primaryColor);
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', pageWidth - margin, 18, { align: 'right' });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`#${order.id.slice(0, 8).toUpperCase()}`, pageWidth - margin, 26, { align: 'right' });
  
  // Order Info Box
  const orderDate = order.created_at 
    ? new Date(order.created_at).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : '';
  
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, 52, 80, 35, 'F');
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('Order Date:', margin + 4, 60);
  doc.text('Status:', margin + 4, 68);
  doc.text('Payment:', margin + 4, 76);
  
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, 'bold');
  doc.text(orderDate, margin + 30, 60);
  doc.text(order.status.toUpperCase(), margin + 30, 68);
  doc.text(order.payment_type === 'cod' ? 'Cash on Delivery' : 'Online Payment', margin + 30, 76);
  
  // Bill To Section
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('BILL TO:', pageWidth - margin - 60, 60);
  
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(order.full_name, pageWidth - margin - 60, 66);
  doc.text(order.address, pageWidth - margin - 60, 72);
  doc.text(`${order.city}, ${order.state} - ${order.pincode}`, pageWidth - margin - 60, 78);
  doc.text(`Phone: ${order.phone}`, pageWidth - margin - 60, 84);
  
  // Horizontal line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 95, pageWidth - margin, 95);
  
  // Items Header
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('ORDER ITEMS', margin, 105);
  
  // Load product images
  const images = await Promise.all(
    orderItems.map(item => getImageBase64(item.image))
  );
  
  // Prepare table data with images - use smaller image size to fit cell
  const tableData = orderItems.map((item, index) => {
    const total = item.price * item.quantity;
    const hasImage = images[index];
    return [
      hasImage ? { content: '', image: images[index], width: 18, height: 18 } : '',
      item.name,
      `Rs. ${item.price.toLocaleString('en-IN')}`,
      item.quantity.toString(),
      `Rs. ${total.toLocaleString('en-IN')}`
    ];
  });
  
  // Table with images
  autoTable(doc, {
    startY: 110,
    head: [['Product Image', 'Item Description', 'Unit Price', 'Qty', 'Total']],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
      cellPadding: { top: 8, bottom: 8 }
    },
    columnStyles: {
      0: { cellWidth: 28, minCellHeight: 22, halign: 'center', valign: 'middle' },
      1: { cellWidth: 'auto', halign: 'left', valign: 'middle' },
      2: { cellWidth: 32, halign: 'right', valign: 'middle' },
      3: { cellWidth: 18, halign: 'center', valign: 'middle' },
      4: { cellWidth: 32, halign: 'right', valign: 'middle', fontStyle: 'bold' }
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: { top: 6, bottom: 6, left: 4, right: 4 },
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.5
    },
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw && data.cell.raw.image) {
        const { image, width, height } = data.cell.raw;
        if (image) {
          doc.addImage(
            image,
            'JPEG',
            data.cell.x + (data.cell.width - width) / 2,
            data.cell.y + (data.cell.height - height) / 2,
            width,
            height
          );
        }
      }
    }
  });
  
  // Summary Section
  const finalY = doc.lastAutoTable?.finalY || 180;
  const summaryX = pageWidth - margin - 70;
  
  // Summary box background
  doc.setFillColor(248, 250, 252);
  doc.rect(summaryX - 5, finalY + 10, 75, 45, 'F');
  
  const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Subtotal:', summaryX, finalY + 22);
  doc.text('Shipping:', summaryX, finalY + 30);
  
  doc.setTextColor(30, 41, 59);
  doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, pageWidth - margin, finalY + 22, { align: 'right' });
  doc.text('FREE', pageWidth - margin, finalY + 30, { align: 'right' });
  
  // Total line
  doc.setDrawColor(226, 232, 240);
  doc.line(summaryX, finalY + 42, pageWidth - margin, finalY + 42);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL:', summaryX, finalY + 52);
  doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, pageWidth - margin, finalY + 52, { align: 'right' });
  
  // Footer
  const footerY = Math.min(finalY + 65, doc.internal.pageSize.getHeight() - 25);
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for choosing Khodiyar Enterprise for your solar power needs!', margin, footerY + 8);
  doc.text(`© ${new Date().getFullYear()} Khodiyar Enterprise. All rights reserved.`, margin, footerY + 14);
  doc.text('Page 1 of 1', pageWidth - margin, footerY + 14, { align: 'right' });
  
  // Save
  doc.save(`Invoice-${order.id.slice(0, 8).toUpperCase()}.pdf`);
};
