import { Loader2, QrCode, Package, Clock, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { QRScanner } from './QRScanner';
import { ProductsPage } from './ProductsPage';
import { LanguageToggle } from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';

function App() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'products'>('home');
  const [lastUpload, setLastUpload] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastUploadTime');
    if (saved) {
      setLastUpload(saved);
    }
  }, []);

  const formatLastUpload = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
  };

  const handleExplore = async (url?: string) => {
    const urlToUse = url || searchQuery;

    if (!urlToUse.trim()) {
      setError(t('errors.default'));
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(
`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/receita-parser`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlToUse }),
        }
      );

      let data;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        setResult(JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          response: data
        }, null, 2));
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setResult(JSON.stringify({
        status: response.status,
        data: data
      }, null, 2));

      const timestamp = new Date().toISOString();
      setLastUpload(timestamp);
      localStorage.setItem('lastUploadTime', timestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (url: string) => {
    setSearchQuery(url);
    setShowQRScanner(false);
    handleExplore(url);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      setSearchQuery(manualInput);
      setShowManualInput(false);
      handleExplore(manualInput);
      setManualInput('');
    }
  };

  if (currentPage === 'products') {
    return <ProductsPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-warm-cream px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-dark-brown tracking-tight">
              {t('app.title')}
            </h1>
            <p className="text-muted-taupe text-lg mt-2">
              {t('app.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => setCurrentPage('products')}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-soft-olive text-white font-semibold rounded-lg hover:bg-deep-olive disabled:bg-warm-gray transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Package className="w-5 h-5" />
              <span>{t('navigation.checkProducts')}</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-soft-beige rounded-2xl shadow-lg p-8 space-y-8 border border-warm-gray">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-dark-brown mb-2">{t('home.addNewData')}</h2>
              <p className="text-muted-taupe">{t('home.chooseInputMethod')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowQRScanner(true)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-warm-gray rounded-xl hover:border-soft-olive hover:bg-light-sand disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <QrCode className="w-10 h-10 text-muted-taupe group-hover:text-soft-olive transition-colors" />
                <span className="font-semibold text-dark-brown group-hover:text-soft-olive transition-colors">{t('home.scanQRCode')}</span>
                <span className="text-xs text-muted-taupe text-center">{t('home.scanQRCodeDesc')}</span>
              </button>

              <button
                onClick={() => setShowManualInput(!showManualInput)}
                disabled={isLoading}
                className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-warm-gray rounded-xl hover:border-soft-olive hover:bg-light-sand disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
              >
                <div className="w-10 h-10 flex items-center justify-center text-muted-taupe group-hover:text-soft-olive transition-colors font-bold text-lg">≡</div>
                <span className="font-semibold text-dark-brown group-hover:text-soft-olive transition-colors">{t('home.enterManually')}</span>
                <span className="text-xs text-muted-taupe text-center">{t('home.enterManuallyDesc')}</span>
              </button>
            </div>

            {showManualInput && (
              <div className="space-y-3 p-4 bg-light-sand rounded-lg border border-warm-gray animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-dark-brown">{t('home.pasteData')}</label>
                  <button
                    onClick={() => {
                      setShowManualInput(false);
                      setManualInput('');
                    }}
                    className="text-muted-taupe hover:text-dark-brown"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleManualSubmit();
                    }
                  }}
                  placeholder={t('home.placeholder')}
                  className="w-full px-4 py-3 border-2 border-warm-gray rounded-lg bg-warm-cream text-dark-brown placeholder-muted-taupe focus:border-soft-olive focus:outline-none focus:ring-2 focus:ring-soft-olive focus:ring-opacity-30 resize-none"
                  rows={4}
                  disabled={isLoading}
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={isLoading || !manualInput.trim()}
                  className="w-full px-4 py-2 bg-soft-olive text-white font-semibold rounded-lg hover:bg-deep-olive disabled:bg-warm-gray disabled:text-muted-taupe disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      {t('home.processing')}
                    </>
                  ) : (
                    t('home.submit')
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="p-4 bg-tomato-red bg-opacity-10 border border-tomato-red rounded-lg text-tomato-red text-sm flex items-start gap-3">
                <div className="flex-1">{error}</div>
                <button onClick={() => setError('')} className="text-tomato-red hover:text-deep-olive">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                <div className="p-4 bg-light-sand border border-warm-gray rounded-lg">
                  <h3 className="text-xs font-semibold text-muted-taupe mb-3 uppercase tracking-wide">{t('home.response')}</h3>
                  <div className="bg-dark-brown text-warm-cream rounded p-3 text-left text-xs overflow-auto max-h-96 font-mono border border-dark-brown">
                    <pre>{result}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {lastUpload && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-taupe">
              <Clock className="w-4 h-4" />
              <span>{t('home.lastUpload')} <span className="font-semibold text-dark-brown">{formatLastUpload(lastUpload)}</span></span>
            </div>
          )}
        </div>
      </div>

      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

export default App;
