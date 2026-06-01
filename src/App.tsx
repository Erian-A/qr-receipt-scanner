// import { Search, Loader2, QrCode } from 'lucide-react';
import { useState } from 'react';
import { QRScanner } from './QRScanner';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleExplore = async (url?: string) => {
    const urlToUse = url || searchQuery;

    if (!urlToUse.trim()) {
      setError('Please enter a search query ->');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-slate-900 tracking-tight">
              Shop Smarter with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Data-Driven Insights ----AAABBB--
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the best products backed by real analytics and customer intelligence
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExplore()}
                placeholder="Search for products, trends, or insights..."
                className="w-full px-6 py-5 pl-14 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              />
              {/* <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" /> */}
            </div>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={() => handleExplore()}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                      {/* <Loader2 className="w-5 h-5 animate-spin" /> */}
                      Processing...
                  </>
                ) : (
                  'Start Exploring'
                )}
              </button>
              <button
                onClick={() => setShowQRScanner(true)}
                disabled={isLoading}
                className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 disabled:bg-slate-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {/* <QrCode className="w-5 h-5" /> */}
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-100 border border-slate-200 rounded-lg">
              <h3 className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Debug Response</h3>
              {!result && !error && (
                <div className="text-slate-500 text-sm">No response yet. Enter a URL and click the button.</div>
              )}
              {result && (
                <div className="bg-slate-900 text-slate-100 rounded p-3 text-left text-xs overflow-auto max-h-96 font-mono border border-slate-700">
                  <pre>{result}</pre>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-12 pt-8 text-sm text-slate-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">10M+</div>
              <div>Products Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">500K+</div>
              <div>Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">99%</div>
              <div>Satisfaction Rate</div>
            </div>
          </div>
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
