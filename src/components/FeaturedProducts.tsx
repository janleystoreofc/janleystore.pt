import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

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
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  // Maintain selected color state per product
  const [selectedColors, setSelectedColors] = useState<Record<string, ProductColor>>({});
  // Maintain selected quantity state per product
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const isKeychain = (product: Product) =>
    product.categoryId === 'chaveiros' ||
    product.id.toLowerCase().includes('chaveiro') ||
    product.name.toLowerCase().includes('chaveiro');

  const getProductQuantity = (product: Product) => {
    if (selectedQuantities[product.id] !== undefined) {
      return selectedQuantities[product.id];
    }
    return isKeychain(product) ? 5 : 1;
  };

  const getProductPrice = (product: Product, qty: number) => {
    if (isKeychain(product)) {
      let discount = 1.0;
      if (qty >= 100) discount = 0.75;
      else if (qty >= 50) discount = 0.80;
      else if (qty >= 30) discount = 0.85;
      else if (qty >= 10) discount = 0.90;
      else if (qty >= 5) discount = 0.95;
      return product.price * qty * discount;
    }
    return product.price * qty;
  };

  const handleSelectColor = (productId: string, color: ProductColor, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const color = selectedColors[product.id] || product.colors[0];
    const qty = getProductQuantity(product);
    addToCart(product, color, qty);
  };

  return (
    <section id="produtos-section" className="py-10 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Title with pink underline */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#33221e] tracking-tight">
          Produtos em Destaque
        </h2>
        <div className="w-12 h-0.5 bg-[#f43f7a] mt-2.5 rounded-full mx-auto" />

        {selectedCategoryId && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm text-[#735953]">
              A filtrar por categoria
            </span>
            <button
              onClick={onClearFilter}
              className="text-[11px] sm:text-xs bg-[#fdedea] text-[#f43f7a] hover:bg-[#fbdad2] font-semibold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {/* Grid strictly 3 products per row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
        {products.map((product) => {
          const activeColor = selectedColors[product.id] || product.colors[0];
          const favorited = isFavorite(product.id);
          const currentQty = getProductQuantity(product);
          const currentPrice = getProductPrice(product, currentQty);
          const isChaveiro = isKeychain(product);

          return (
            <div
              key={product.id}
              onClick={() => onViewProductDetail(product)}
              className="group bg-white rounded-xl sm:rounded-2xl border border-[#fae4e1] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-[#fcd7df] transition-all duration-300 flex flex-col justify-between p-2 sm:p-3.5 md:p-4 cursor-pointer"
            >
              {/* Product Top: Clean Image (without legend badge) & Favorite button */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden bg-[#faf4f2] mb-2 sm:mb-3">
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
                        ? 'fill-[#f43f7a] text-[#f43f7a]'
                        : 'text-[#f43f7a] stroke-[2]'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-base font-bold text-[#33221e] group-hover:text-[#f43f7a] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Rating Stars + Count */}
                  <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                    <div className="flex items-center text-[#f59e0b]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-[#735953] font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1">
                    <span className="text-xs sm:text-base md:text-lg font-bold text-[#33221e]">
                      € {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                    {currentQty > 1 && (
                      <span className="text-[10px] sm:text-xs text-[#735953] font-medium">
                        ({currentQty} un)
                      </span>
                    )}
                  </div>
                </div>

                {/* Color Swatches - Made smaller and aesthetic */}
                <div className="pt-1 sm:pt-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#6d4f48] truncate max-w-[85px] sm:max-w-none">
                      Cor: <span className="text-[#f43f7a] font-bold">{activeColor.name}</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#9c7871] font-medium hidden sm:inline">
                      {product.colors.length} cores
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
                          title={`Cor: ${color.name}`}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer flex items-center justify-center relative flex-shrink-0 ${
                            isSelected
                              ? 'ring-1.5 ring-[#f43f7a] ring-offset-1 scale-110 border-white shadow-2xs z-10'
                              : 'border-black/15 hover:scale-110 hover:border-[#f43f7a]/50'
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

                {/* Quantity Selector: 5 / 10 / 30 / 50 / 100 for keychains, stepper for others */}
                <div className="pt-1.5 sm:pt-2 border-t border-[#fcedea]">
                  {isChaveiro ? (
                    <div>
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                        <span className="font-semibold text-[#6d4f48]">
                          Qtd chaveiros: <span className="text-[#f43f7a] font-bold">{currentQty} un</span>
                        </span>
                        <span className="text-[9px] text-[#008f51] font-bold">
                          {currentQty >= 100 ? '-25%' : currentQty >= 50 ? '-20%' : currentQty >= 30 ? '-15%' : currentQty >= 10 ? '-10%' : '-5%'}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {[5, 10, 30, 50, 100].map((num) => {
                          const isQSelected = currentQty === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuantities((prev) => ({ ...prev, [product.id]: num }));
                              }}
                              className={`py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold rounded transition-all cursor-pointer text-center ${
                                isQSelected
                                  ? 'bg-[#f43f7a] text-white shadow-2xs scale-102'
                                  : 'bg-[#faf4f2] text-[#6d4f48] hover:bg-[#fdedea] border border-[#f5ded9]'
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#6d4f48]">
                        Quantidade:
                      </span>
                      <div className="flex items-center border border-[#e5d5d1] rounded-lg bg-[#faf7f5] overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [product.id]: Math.max(1, currentQty - 1),
                            }));
                          }}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 sm:w-6 text-center text-[10px] sm:text-xs font-bold text-[#33221e]">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [product.id]: currentQty + 1,
                            }));
                          }}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="pt-2 sm:pt-2.5">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg shadow-2xs sm:shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
                    <span className="hidden sm:inline">ADICIONAR ({currentQty})</span>
                    <span className="sm:hidden">ADICIONAR ({currentQty})</span>
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
