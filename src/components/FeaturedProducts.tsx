import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { Star, Heart, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface FeaturedProductsProps {
  products: Product[];
  selectedCategoryId: string | null;
  onClearFilter: () => void;
  onViewProductDetail: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  selectedCategoryId,
  onClearFilter,
  onViewProductDetail,
}) => {
  const { toggleFavorite, isFavorite } = useCart();
  const { t } = useLanguage();
  const [selectedColors, setSelectedColors] = useState<Record<string, ProductColor>>({});

  const handleSelectColor = (productId: string, color: ProductColor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  return (
    <section id="produtos-section" className="py-10 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Title with sunflower warm golden underline */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          {t('featured_title')}
        </h2>
        <div className="w-14 h-1 bg-amber-500 mt-2.5 rounded-full mx-auto" />

        {selectedCategoryId && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-slate-600">
              {t('filter_by')}
            </span>
            <button
              onClick={onClearFilter}
              className="text-[11px] sm:text-xs bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border border-amber-200"
            >
              {t('clear_filter')}
            </button>
          </div>
        )}
      </div>

      {/* Grid strictly 3 products per row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
        {products.map((product) => {
          const activeColor = selectedColors[product.id] || product.colors[0];
          const favorited = isFavorite(product.id);

          return (
            <div
              key={product.id}
              onClick={() => onViewProductDetail(product)}
              className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)] hover:border-amber-400 transition-all duration-300 flex flex-col justify-between p-2 sm:p-3.5 md:p-4 cursor-pointer"
            >
              {/* Product Top: Clean Image & Favorite button */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 mb-2 sm:mb-3">
                <img
                  src={
                    (product.id === 'vaso-decorativo' && activeColor.sampleImage)
                      ? activeColor.sampleImage
                      : product.image
                  }
                  alt={`${product.name} em ${activeColor.name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                />

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white shadow-xs flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                      favorited
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-slate-400 hover:text-amber-500 stroke-[2]'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Rating Stars + Count */}
                  <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-xs sm:text-base md:text-lg font-bold text-slate-900 mt-0.5 sm:mt-1">
                    € {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Smaller, Aesthetic Color Swatches */}
                <div className="pt-1 sm:pt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 truncate max-w-[85px] sm:max-w-none">
                      {t('color_label')} <span className="text-amber-600 font-bold">{activeColor.name}</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:inline">
                      {product.colors.length} {t('colors_count')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 max-h-11 sm:max-h-14 overflow-y-auto pr-0.5 custom-scroll">
                    {product.colors.map((color) => {
                      const isSelected = activeColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={(e) => handleSelectColor(product.id, color, e)}
                          title={`${t('color_label')} ${color.name}`}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer flex items-center justify-center relative flex-shrink-0 ${
                            isSelected
                              ? 'ring-1.5 ring-amber-500 ring-offset-1 scale-110 border-white shadow-2xs z-10'
                              : 'border-black/15 hover:scale-110 hover:border-amber-400'
                          }`}
                          style={{
                            background: color.gradient || color.hex,
                          }}
                        >
                          {isSelected && (
                            <Check className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${color.hex === '#ffffff' || color.hex === '#fdf9f4' || color.isMarble ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clean CTA Button - Opens product options */}
                <div className="pt-2 sm:pt-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProductDetail(product);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
                    <span className="hidden sm:inline">{t('btn_customize')}</span>
                    <span className="sm:hidden">{t('btn_view_options')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
