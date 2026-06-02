import { useCallback, useRef, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useLanguage } from './context/LanguageContext';
import './QRScanner.css';

interface QRScannerProps {
  onScan: (url: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { t } = useLanguage();
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
      setError(t('qr.cameraAccessFailed'));
    } else if (
      errorMessage.includes('NotFoundError') ||
      errorMessage.includes('No camera')
    ) {
      setError(t('qr.cameraAccessFailed'));
    } else if (
      errorMessage.includes('NotReadableError') ||
      errorMessage.includes('NotReadable')
    ) {
      setError(t('qr.cameraAccessFailed'));
    } else {
      setError(t('qr.cameraAccessFailed'));
    }
  }, [t]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-soft-beige rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-warm-gray">
        <div className="flex items-center justify-between p-4 border-b border-warm-gray bg-light-sand">
          <h2 className="text-lg font-semibold text-dark-brown">{t('qr.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-warm-gray rounded-lg transition-colors text-muted-taupe font-bold text-xl"
            aria-label="Close scanner"
          >
            ✕
          </button>
        </div>

        <div className="qr-reader">
          {error ? (
            <div className="qr-frame bg-red-500 bg-opacity-75">
              <div className="text-white text-center p-4">
                <p className="mb-2 font-semibold">{t('qr.cameraAccessFailed')}</p>
                <p className="text-sm mb-4">{error}</p>
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
            <div className="absolute bottom-4 left-4 right-4 bg-soft-olive text-white p-3 rounded-lg text-sm font-semibold z-20">
              {t('qr.scanned')} {scannedResult}
            </div>
          )}
        </div>

        <div className="p-4 text-center text-sm text-muted-taupe bg-light-sand">
          {error ? t('qr.cameraAccessFailed') : t('qr.pointCamera')}
        </div>
      </div>
    </div>
  );
}
