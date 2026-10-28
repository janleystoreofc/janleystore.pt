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
    addToCart(product, color, 1);
  };

  return (
    <section id="produtos-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title with pink underline */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#33221e] tracking-tight">
          Produtos em Destaque
        </h2>
        {/* Hot pink underline bar */}
        <div className="w-12 h-0.5 bg-[#f43f7a] mx-auto mt-2.5 rounded-full" />

        {selectedCategoryId && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-[#735953]">
              A filtrar por categoria
            </span>
            <button
              onClick={onClearFilter}
              className="text-xs bg-[#fdedea] text-[#f43f7a] hover:bg-[#fbdad2] font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Limpar filtro (Ver todos)
            </button>
          </div>
        )}
      </div>

      {/* 4 Columns Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
        {products.map((product) => {
          const activeColor = selectedColors[product.id] || product.colors[0];
          const favorited = isFavorite(product.id);

          return (
            <div
              key={product.id}
              onClick={() => onViewProductDetail(product)}
              className="group bg-white rounded-2xl border border-[#fae4e1] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-[#fcd7df] transition-all duration-300 flex flex-col justify-between p-4 cursor-pointer"
            >
              {/* Product Top: Image & Favorite button */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#faf4f2] mb-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                />

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorited
                        ? 'fill-[#f43f7a] text-[#f43f7a]'
                        : 'text-[#f43f7a] stroke-[2]'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#33221e] group-hover:text-[#f43f7a] transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Rating Stars + Count */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center text-[#f59e0b]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#735953] font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-bold text-[#33221e] mt-1">
                    € {product.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => {
                      const isSelected = activeColor.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={(e) => handleSelectColor(product.id, color, e)}
                          title={`Cor: ${color.name}`}
                          className={`w-5 h-5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-[#f43f7a] ring-offset-1 scale-110 border-transparent'
                              : 'border-black/10 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-3 h-3 ${color.hex === '#fdf9f4' || color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-[#8c6760] mt-1 truncate">
                    Cor: <span className="font-medium text-[#4a342f]">{activeColor.name}</span>
                  </div>
                </div>

                {/* Full Width Pink CTA Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs tracking-wider uppercase py-2.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>ADICIONAR AO CARRINHO</span>
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
