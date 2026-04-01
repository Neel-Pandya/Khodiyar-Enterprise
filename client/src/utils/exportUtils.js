import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Extract base64 image from SVG if it contains an embedded image
 * @param {string} svgSrc - SVG source string or imported SVG
 * @returns {string|null} - Base64 image data or null
 */
const extractImageFromSVG = (svgSrc) => {
    if (typeof svgSrc !== 'string') return null;
    
    // Check if it's already a base64 image
    if (svgSrc.startsWith('data:image')) {
        return svgSrc;
    }
    
    // Try to extract embedded image from SVG pattern/image element
    const xlinkMatch = svgSrc.match(/xlink:href="(data:image\/[^;]+;base64,[^"]+)"/);
    if (xlinkMatch) {
        return xlinkMatch[1];
    }
    
    // Try href attribute (newer SVG standard)
    const hrefMatch = svgSrc.match(/href="(data:image\/[^;]+;base64,[^"]+)"/);
    if (hrefMatch) {
        return hrefMatch[1];
    }
    
    return null;
};

/**
 * Export data to a professionally formatted PDF document
 * @param {Object} options - Export options
 * @param {string} options.filename - The filename for the downloaded PDF
 * @param {string} options.title - The report title (e.g., "Customers Report")
 * @param {string} options.subtitle - Optional subtitle
 * @param {Array} options.headers - Array of column headers [['Col1', 'Col2', ...]]
 * @param {Array} options.data - 2D array of data rows
 * @param {string} [options.logoSrc] - SVG or image source for logo
 * @param {string} [options.footerText] - Custom footer text (default: company name)
 * @param {Object} [options.columnStyles] - Custom column styles for autoTable
 * @param {Function} [options.cellCallback] - Optional callback for cell styling (data) => void
 */
export const exportToPDF = async ({
    filename,
    title,
    subtitle,
    headers,
    data,
    logoSrc,
    footerText = 'Khodiyar Enterprise',
    columnStyles = {},
    cellCallback = null
}) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    
    // Logo dimensions and positioning
    const logoWidth = 50;
    const logoHeight = 26;
    const logoX = pageWidth - margin - logoWidth;
    const logoY = 10;
    
    // Try to add logo
    if (logoSrc) {
        try {
            // Extract embedded image from SVG if needed
            const imageData = extractImageFromSVG(logoSrc);
            
            if (imageData) {
                // Determine image format from data URI
                const formatMatch = imageData.match(/data:image\/(jpeg|png|jpg);base64,/i);
                const format = formatMatch ? formatMatch[1].toUpperCase() : 'PNG';
                
                doc.addImage(imageData, format, logoX, logoY, logoWidth, logoHeight);
            } else {
                // Fallback to text logo
                throw new Error('No embedded image found in SVG');
            }
        } catch {
            // If logo fails to load, add company name as text
            doc.setFontSize(14);
            doc.setTextColor(30, 58, 95);
            doc.setFont(undefined, 'bold');
            doc.text('KHODIYAR ENTERPRISE', pageWidth - margin, 20, { align: 'right' });
        }
    }
    
    // Title - positioned below the logo area
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 95);
    doc.setFont(undefined, 'bold');
    doc.text(title.toUpperCase(), margin, 30);
    
    // Subtitle/Report info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })}`, margin, 38);
    
    if (subtitle) {
        doc.text(subtitle, margin, 44);
    } else {
        doc.text(`Total Records: ${data.length}`, margin, 44);
    }
    
    // Add horizontal line separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);
    
    // Generate professional table using autoTable
    autoTable(doc, {
        head: headers,
        body: data,
        startY: 56,
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: [30, 58, 95],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left',
            cellPadding: { top: 8, bottom: 8, left: 6, right: 6 }
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
            valign: 'middle'
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            ...columnStyles
        },
        styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.5
        },
        didParseCell: cellCallback || undefined
    });
    
    // Footer with company info
    const finalY = doc.lastAutoTable?.finalY || 70;
    const footerY = Math.min(finalY + 15, doc.internal.pageSize.getHeight() - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont(undefined, 'normal');
    doc.text(`${footerText} - ${new Date().getFullYear()}`, margin, footerY);
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY, { align: 'right' });
    
    doc.save(`${filename}.pdf`);
};

/**
 * Export data to Excel format
 * @param {Object} options - Export options
 * @param {string} options.filename - The filename for the downloaded Excel file
 * @param {string} options.sheetName - Name of the worksheet
 * @param {Array<Object>} options.data - Array of objects to export
 * @param {Array<string>} [options.headers] - Optional array of column headers (keys from data objects)
 */
export const exportToExcel = ({
    filename,
    sheetName = 'Data',
    data,
    headers = null
}) => {
    const exportData = headers 
        ? data.map(row => {
            const obj = {};
            headers.forEach(h => {
                obj[h] = row[h.toLowerCase()] || row[h] || '';
            });
            return obj;
        })
        : data;
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Export data to CSV format
 * @param {Object} options - Export options
 * @param {string} options.filename - The filename for the downloaded CSV file
 * @param {Array<Object>} options.data - Array of objects to export
 */
export const exportToCSV = ({
    filename,
    data
}) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
};
