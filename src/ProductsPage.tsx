import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from './context/LanguageContext';

interface Product {
  id: number;
  created_at: string;
  product_name: string;
  product_code: string;
  unit: string;
  quantity: number;
  total_value: number;
  purchase_date: string;
  name: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  count: number;
  hasMore: boolean;
}

interface ProductsPageProps {
  onBack: () => void;
}

export function ProductsPage({ onBack }: ProductsPageProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 25,
    count: 0,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const PAGE_SIZE = 25;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          mode: 'offset',
          page: currentPage.toString(),
          pageSize: PAGE_SIZE.toString(),
        });

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-receipts?${params}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }

        setProducts(data.data || []);
        setMeta(data.meta || {
          page: currentPage,
          pageSize: PAGE_SIZE,
          count: 0,
          hasMore: false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const totalPages = Math.ceil(meta.count / meta.pageSize) || 1;
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (meta.hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-warm-cream p-4 py-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-soft-olive hover:text-deep-olive font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('navigation.back')}
        </button>

        <div className="bg-soft-beige rounded-2xl shadow-lg overflow-hidden border border-warm-gray">
          <div className="p-6 border-b border-warm-gray bg-light-sand">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-dark-brown">{t('products.title')}</h1>
                <p className="text-muted-taupe mt-2">
                  {t('products.totalProducts')} <span className="font-semibold text-dark-brown">{meta.count}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-taupe">
                  {t('products.page')} <span className="font-semibold text-dark-brown">{meta.page}</span> {t('products.of')} <span className="font-semibold text-dark-brown">{totalPages}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-soft-olive animate-spin" />
                <span className="ml-3 text-muted-taupe font-semibold">{t('products.loading')}</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-tomato-red bg-opacity-10 border border-tomato-red rounded-lg text-tomato-red">
                {error}
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-taupe text-lg">{t('products.noProducts')}</p>
              </div>
            )}

            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-warm-gray bg-light-sand">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-brown">{t('products.productName')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-brown">{t('products.productCode')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-brown">{t('products.store')}</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-dark-brown">{t('products.quantity')}</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-dark-brown">{t('products.unit')}</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-dark-brown">{t('products.totalValue')}</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark-brown">{t('products.purchaseDate')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          className={`border-b border-warm-gray transition-colors ${
                            index % 2 === 0 ? 'bg-soft-beige' : 'bg-light-sand'
                          } hover:bg-warm-gray hover:bg-opacity-30`}
                        >
                          <td className="px-6 py-4 text-sm text-dark-brown font-medium">{product.product_name}</td>
                          <td className="px-6 py-4 text-sm text-muted-taupe font-mono">{product.product_code}</td>
                          <td className="px-6 py-4 text-sm text-muted-taupe">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-center text-dark-brown font-medium">{product.quantity}</td>
                          <td className="px-6 py-4 text-sm text-center text-muted-taupe">{product.unit}</td>
                          <td className="px-6 py-4 text-sm text-right text-dark-brown font-semibold">
                            R$ {product.total_value.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-taupe">
                            {new Date(product.purchase_date).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-warm-gray pt-6">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-light-sand text-dark-brown font-semibold rounded-lg hover:bg-warm-gray border border-warm-gray disabled:bg-warm-gray disabled:text-muted-taupe disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    {t('products.previous')}
                  </button>

                  <span className="text-sm text-muted-taupe">
                    {t('products.showing')} {products.length} {t('products.of')} {meta.count} {t('products.products')}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!meta.hasMore || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-soft-olive text-white font-semibold rounded-lg hover:bg-deep-olive disabled:bg-warm-gray disabled:text-muted-taupe disabled:cursor-not-allowed transition-colors"
                  >
                    {t('products.next')}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
