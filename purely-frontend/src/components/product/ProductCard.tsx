import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Stok Habis
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {product.category && (
          <p className="text-xs text-gray-500">{product.category.name}</p>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-gray-500">per {product.unit}</p>
          </div>

          {product.in_stock && onAddToCart && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              + Keranjang
            </Button>
          )}
        </div>

        {product.seller && (
          <p className="text-xs text-gray-500">
            Dijual oleh {product.seller.name}
          </p>
        )}
      </div>
    </div>
  );
};