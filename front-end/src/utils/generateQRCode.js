import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';

export const generateQRCode = async (ticketInfo) => {
  try {
    // Create QR code data string
    const qrData = JSON.stringify({
      userName: ticketInfo.userName,
      eventId: ticketInfo.eventId,
      email: ticketInfo.email,
      timestamp: new Date().toISOString()
    });

    // Create QR code canvas directly
    const qrCode = QRCodeCanvas({
      value: qrData,
      size: 256, // QR code size in pixels
      level: 'H', // Error correction level ('L', 'M', 'Q', 'H')
      includeMargin: true,
    });

    // Convert QR code to image
    const qrCanvas = qrCode.querySelector('canvas');
    if (!qrCanvas) {
      throw new Error('Failed to generate QR code canvas');
    }

    // Convert canvas to blob
    qrCanvas.toBlob((blob) => {
      if (blob) {
        // Save the file
        const fileName = `ticket-${ticketInfo.eventId}-${ticketInfo.userName}.png`;
        saveAs(blob, fileName);
      }
    }, 'image/png');

  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Helper function to validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
