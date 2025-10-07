import { useState } from 'react';
import QRCode from 'qrcode';
import { FaQrcode, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

const QRCodeGenerator: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get the frontend URL from environment or use current origin
  const menuUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#673E20', // Brown color matching your theme
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // High error correction
      });
      
      setQrCodeUrl(qrDataUrl);
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) {
      toast.error('Please generate QR code first');
      return;
    }

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'menu-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded successfully!');
  };

  return (
    <div className="bg-[#CEC1A8] p-6 rounded-lg shadow-lg mb-6 border-2 border-[#552A0A]">
      <h3 className="text-3xl font-bold mb-4 font-heading text-center">
        Menu QR Code Generator
      </h3>
      
      <div className="mb-4 text-center">
        <p className="text-gray-700 font-body mb-2">
          Generate a QR code for customers to scan and access your menu
        </p>
        <p className="text-sm text-gray-600 font-body bg-white/50 p-2 rounded">
          Menu URL: <span className="font-semibold">{menuUrl}</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="bg-white p-4 rounded-lg shadow-md border-2 border-[#673E20]">
            <img 
              src={qrCodeUrl} 
              alt="Menu QR Code" 
              className="w-64 h-64 object-contain"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={generateQRCode}
            disabled={isGenerating}
            className="flex items-center bg-blue-500 border-2 border-blue-900 text-white py-2 px-6 rounded-lg font-heading hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaQrcode className="mr-2" />
            {isGenerating ? 'Generating...' : qrCodeUrl ? 'Regenerate QR Code' : 'Generate QR Code'}
          </button>

          {qrCodeUrl && (
            <button
              onClick={downloadQRCode}
              className="flex items-center bg-green-500 border-2 border-green-900 text-white py-2 px-6 rounded-lg font-heading hover:bg-green-600 transition-all"
            >
              <FaDownload className="mr-2" />
              Download QR Code
            </button>
          )}
        </div>

        {/* Instructions */}
        {qrCodeUrl && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
            <h4 className="font-bold text-blue-900 mb-2 font-heading">How to Use:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 font-body space-y-1">
              <li>Download the QR code image</li>
              <li>Print it or display it at your restaurant</li>
              <li>Customers scan it to view your menu</li>
              <li>Menu updates automatically when you make changes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;