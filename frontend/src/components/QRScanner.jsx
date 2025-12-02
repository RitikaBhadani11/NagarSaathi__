import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaCamera, FaDownload, FaCopy, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const QRScanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = () => {
    // Simulate scanning for demonstration
    setIsScanning(true);
    setError('');
    
    setTimeout(() => {
      const simulatedResult = {
        text: `${window.location.origin}/public-complaint`,
        format: 'QR_CODE'
      };
      
      if (simulatedResult.text.includes('/public-complaint') || simulatedResult.text.includes('/complaint')) {
        setScanResult(simulatedResult);
        setIsScanning(false);
        
        // Auto-navigate after 2 seconds
        setTimeout(() => {
          navigate('/public-complaint');
        }, 2000);
      } else {
        setError('Invalid QR code. Please scan a valid NagarSaathi complaint QR code.');
        setIsScanning(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-8 px-6 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <FaQrcode className="text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Scan Complaint QR</h1>
          <p className="text-indigo-100">Scan to quickly file community issues</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <div className="text-red-500">⚠</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {scanResult ? (
            <div className="text-center mb-6">
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Scanned Successfully!</h3>
                <p className="text-gray-600">Redirecting to complaint form...</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-700 break-all text-center">
                  {scanResult.text}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Scanner Preview */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-4 border-dashed border-gray-300">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-700 font-medium">Scanning QR Code...</p>
                        <p className="text-sm text-gray-500 mt-1">Hold steady</p>
                      </div>
                    ) : (
                      <div className="text-center p-8">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                          <FaCamera className="text-4xl text-blue-500" />
                        </div>
                        <p className="text-gray-700 font-medium">Camera Ready</p>
                        <p className="text-sm text-gray-500 mt-1">Point camera at QR code</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Scanner Frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 border-2 border-blue-500 rounded-xl">
                      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">How to scan:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure good lighting</li>
                  <li>• Hold device steady</li>
                  <li>• Position QR code within frame</li>
                  <li>• Keep distance of 15-30 cm</li>
                </ul>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!scanResult && !isScanning && (
              <button
                onClick={handleScan}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-[1.02]"
              >
                <FaCamera /> Simulate QR Scan
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/generate-qr')}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaQrcode /> Generate QR
              </button>
              
              <button
                onClick={() => navigate('/public-complaint')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Go Directly
              </button>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
            >
              ← Back to Previous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;