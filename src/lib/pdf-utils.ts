"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Utility to export a DOM element as a high-quality PDF.
 * Uses html2canvas to capture the visual state and jsPDF to generate the file.
 */
export async function exportToPDF(elementId: string, filename: string = "documento.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // Capture the element with high scale for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Retain sharpness
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF in A4 format
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const imgProps = pdf.getImageProperties(imgData);
    // Center on page if taller than wide
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    
    // Use a more robust approach: save as blob and create a link
    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
