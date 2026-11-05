import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Sparkles, Box, Info } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const isKeychain = Boolean(
    product && (
      product.categoryId === 'chaveiros' ||
      product.id.toLowerCase().includes('chaveiro') ||
      product.name.toLowerCase().includes('chaveiro')
    )
  );

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Dourado', hex: '#d9a766' }
  );
  const [quantity, setQuantity] = useState(isKeychain ? 5 : 1);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setQuantity(
        product.categoryId === 'chaveiros' || product.id.toLowerCase().includes('chaveiro') ? 5 : 1
      );
      setCustomText('');
    }
  }, [product]);

  if (!product) return null;

  const favorited = isFavorite(product.id);

  // Keychain batch discount calculation
  const calculateTotalPrice = () => {
    if (isKeychain) {
      let discount = 1.0;
      if (quantity >= 100) discount = 0.75;
      else if (quantity >= 50) discount = 0.80;
      else if (quantity >= 30) discount = 0.85;
      else if (quantity >= 10) discount = 0.90;
      else if (quantity >= 5) discount = 0.95;
      return product.price * quantity * discount;
    }
    return product.price * quantity;
  };

  const totalPrice = calculateTotalPrice();

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity, customText.trim() ? customText.trim() : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#fed7aa] my-8 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#78350f] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image */}
            <div className="md:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-[#fffdfa] border border-[#fed7aa]">
              <img
                src={
                  selectedColor.sampleImage && (product.id === 'vaso-decorativo' || selectedColor.sampleImage)
                    ? selectedColor.sampleImage
                    : product.image
                }
                alt={`${product.name} em ${selectedColor.name}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Special Tag for Gradient / Marble / Yellow Gold */}
              {(selectedColor.isGradient || selectedColor.isMarble) && (
                <span className="absolute bottom-3 left-3 bg-[#2b180d]/85 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {selectedColor.name}
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorited
                      ? 'fill-[#d97706] text-[#d97706]'
                      : 'text-[#d97706] stroke-[2]'
                  }`}
                />
              </button>
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider bg-[#fef3c7] px-2.5 py-1 rounded-full border border-[#fde68a]">
                  {product.category}
                </span>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3d2314] mt-2">
                  {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-[#f59e0b]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#78350f] font-semibold">
                    {product.rating} ({product.reviewsCount} avaliações)
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-[#3d2314] mt-3 flex items-baseline gap-2">
                  <span>€ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  {quantity > 1 && (
                    <span className="text-xs text-[#78350f] font-medium">
                      ({quantity} un • € {(totalPrice / quantity).toFixed(2).replace('.', ',')}/un)
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-[#5c3a1e] leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="pt-2 border-t border-[#fed7aa]/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#3d2314]">
                    Cor do Filamento: <span className="font-bold text-[#d97706]">{selectedColor.name}</span>
                  </label>
                  <span className="text-[11px] text-[#78350f] font-medium">
                    {product.colors.length} cores
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 max-h-24 overflow-y-auto p-1.5 bg-[#fef8ed] rounded-xl border border-[#fed7aa] custom-scroll">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center relative flex-shrink-0 ${
                          isSelected
                            ? 'ring-2 ring-[#d97706] ring-offset-2 scale-110 border-white shadow-xs z-10'
                            : 'border-black/15 hover:scale-108 hover:border-[#d97706]/60'
                        }`}
                        style={{ background: color.gradient || color.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === '#fdf9f4' || color.hex === '#ffffff' || color.isMarble ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Text for Personalized Items */}
              {product.categoryId === 'personalizados' && (
                <div>
                  <label className="block text-xs font-bold text-[#3d2314] mb-1">
                    Nome ou Iniciais para Gravação 3D (Opcional):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ex: Sofia, Lucas, M&J"
                    maxLength={20}
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] focus:bg-white rounded-xl px-3.5 py-2 text-sm outline-hidden"
                  />
                </div>
              )}

              {/* Quantity Selection: 5 / 10 / 30 / 50 / 100 for keychains */}
              <div className="pt-2 border-t border-[#fed7aa]/60">
                {isKeychain ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3d2314]">Quantidade de Chaveiros:</span>
                      <span className="text-xs font-bold text-[#008f51]">
                        {quantity >= 100 ? '-25% Desc. Especial' : quantity >= 50 ? '-20% Desc.' : quantity >= 30 ? '-15% Desc.' : quantity >= 10 ? '-10% Desc.' : '-5% Pack'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[5, 10, 30, 50, 100].map((num) => {
                        const isQSelected = quantity === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setQuantity(num)}
                            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                              isQSelected
                                ? 'bg-[#d97706] text-white shadow-xs font-extrabold'
                                : 'bg-[#fef8ed] text-[#4a2e18] hover:bg-[#fde68a]/50 border border-[#fed7aa]'
                            }`}
                          >
                            <div>{num} un</div>
                            <div className="text-[9px] font-normal opacity-85">
                              {num === 5 ? 'Lembrança' : num === 10 ? 'Família' : num === 30 ? 'Festa' : num === 50 ? 'Evento' : 'Empresas'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-[#3d2314]">Quantidade:</label>
                    <div className="flex items-center border border-[#fed7aa] rounded-xl overflow-hidden bg-[#fef8ed]">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-10 flex items-center justify-center text-[#4a2e18] hover:bg-[#fde68a]/60 transition-colors cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-[#3d2314]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-10 flex items-center justify-center text-[#4a2e18] hover:bg-[#fde68a]/60 transition-colors cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>Adicionar ao Carrinho • € {totalPrice.toFixed(2).replace('.', ',')}</span>
                </button>
              </div>

              {/* Specs bullet points */}
              <div className="pt-3 border-t border-[#fed7aa]/60 text-xs text-[#78350f] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Dimensões: <strong>{product.dimensions || 'Sob medida'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Material: <strong>{product.material || 'PLA Ecológico de Alta Precisão'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Fabricado artesanalmente em <strong>Guimarães, Braga - Portugal 🇵🇹</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
