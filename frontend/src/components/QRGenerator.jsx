import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaDownload, FaCopy, FaShareAlt, FaPrint, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const QRGenerator = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  const qrValue = `${window.location.origin}/public-complaint`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&color=2D3748&bgcolor=FFFFFF&margin=10&data=${encodeURIComponent(qrValue)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(qrValue)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'nagarsaathi-complaint-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NagarSaathi Complaint Form',
          text: 'Scan this QR code to file a community complaint',
          url: qrValue,
        });
      } catch (error) {
        console.log('Sharing cancelled or failed:', error);
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 py-8 px-6 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <FaQrcode className="text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Generate QR Code</h1>
          <p className="text-emerald-100">Create QR for public complaint form</p>
        </div>

        <div className="p-8">
          {/* QR Code Display */}
          <div className="mb-8">
            <div className="border-8 border-emerald-100 rounded-2xl p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg">
              <div className="relative">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-full aspect-square rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-dashed border-emerald-200 rounded-lg pointer-events-none"></div>
              </div>
              
              {/* QR Code Label */}
              <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  <FaQrcode className="text-sm" />
                  <span className="text-sm font-medium">NagarSaathi Complaint QR</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Info */}
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4 font-medium">
              This QR code links to the public complaint form (no login required)
            </p>
            
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-blue-500">
                  🔗
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Complaint Form URL:</p>
                  <p className="text-xs text-gray-600 break-all bg-white p-2 rounded border">
                    {qrValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Messages */}
          {copied && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <FaCheckCircle className="text-green-500" />
              <span className="text-green-700 text-sm">Link copied to clipboard!</span>
            </div>
          )}

          {downloaded && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <FaCheckCircle className="text-blue-500" />
              <span className="text-blue-700 text-sm">QR code downloaded successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.02]"
            >
              <FaDownload className="group-hover:scale-110 transition-transform" />
              Download QR Code
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyLink}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-gray-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaCopy /> Copy Link
              </button>
              
              <button
                onClick={shareQRCode}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaShareAlt /> Share
              </button>
            </div>

            <button
              onClick={() => navigate('/public-complaint')}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaArrowLeft /> Go to Complaint Form
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
            >
              ← Back to Previous
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">💡 Usage Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Print and display in public areas</li>
              <li>• Share with community groups</li>
              <li>• Use for ward meetings and events</li>
              <li>• Ideal for public notice boards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;