import { useCallback, useRef, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import './QRScanner.css';

interface QRScannerProps {
  onScan: (url: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scannedResult, setScannedResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const lastScannedUrl = useRef<string | null>(null);

  const handleScan = useCallback(
    (detectedCodes: IDetectedBarcode[]) => {
      if (detectedCodes.length === 0) {
        return;
      }

      const firstCode = detectedCodes[0];
      const scannedUrl = firstCode.rawValue;

      if (!scannedUrl) {
        return;
      }

      // Prevent duplicate scans
      if (scannedUrl === lastScannedUrl.current) {
        return;
      }

      console.log('QR Code scanned:', scannedUrl);
      setScannedResult(scannedUrl);
      lastScannedUrl.current = scannedUrl;
      onScan(scannedUrl);
    },
    [onScan]
  );

  const handleError = useCallback((err: unknown) => {
    console.error('QR Scanner error:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to access camera';
    setError(errorMessage);

    // Provide helpful error messages
    if (
      errorMessage.includes('Permission denied') ||
      errorMessage.includes('NotAllowedError')
    ) {
      setError(
        'Camera permission denied. Please allow camera access in your browser settings.'
      );
    } else if (
      errorMessage.includes('NotFoundError') ||
      errorMessage.includes('No camera')
    ) {
      setError('No camera found. Please ensure your device has a camera.');
    } else if (
      errorMessage.includes('NotReadableError') ||
      errorMessage.includes('NotReadable')
    ) {
      setError('Camera is already in use by another application.');
    } else {
      setError(`Camera error: ${errorMessage}`);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 font-bold text-xl"
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>

        <div className="qr-reader">
          {error ? (
            <div className="qr-frame bg-red-500 bg-opacity-75">
              <div className="text-white text-center p-4">
                <p className="mb-2 font-semibold">Camera Error</p>
                <p className="text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }}
              formats={['qr_code']}
              scanDelay={2000}
              components={{
                finder: true,
                torch: true,
                zoom: true,
              }}
              styles={{
                container: {
                  width: '100%',
                  height: '100%',
                },
                video: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' as const,
                },
              }}
            />
          )}

          {scannedResult && (
            <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg text-sm font-semibold z-20">
              Scanned: {scannedResult}
            </div>
          )}
        </div>

        <div className="p-4 text-center text-sm text-slate-600">
          {error ? 'Camera access failed' : 'Point your camera at a QR code'}
        </div>
      </div>
    </div>
  );
}
