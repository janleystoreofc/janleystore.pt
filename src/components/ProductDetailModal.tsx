import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Sparkles, Box, Info } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Padrão', hex: '#d9a766' }
  );
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');

  if (!product) return null;

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity, customText.trim() ? customText.trim() : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image */}
            <div className="md:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-[#faf4f2] border border-[#fae4e1]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorited
                      ? 'fill-[#f43f7a] text-[#f43f7a]'
                      : 'text-[#f43f7a] stroke-[2]'
                  }`}
                />
              </button>
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#f43f7a] uppercase tracking-wider bg-[#fdedea] px-2.5 py-1 rounded-full">
                  {product.category}
                </span>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e] mt-2">
                  {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-[#f59e0b]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#735953] font-semibold">
                    {product.rating} ({product.reviewsCount} avaliações)
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-[#33221e] mt-3">
                  € {product.price.toFixed(2).replace('.', ',')}
                </div>
              </div>

              <p className="text-sm text-[#664b45] leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="pt-2 border-t border-[#fae2dc]">
                <label className="block text-xs font-bold text-[#33221e] mb-2">
                  Cor do Filamento: <span className="font-normal text-[#f43f7a]">{selectedColor.name}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-[#f43f7a] ring-offset-2 scale-110 border-transparent shadow-xs'
                            : 'border-black/15 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === '#fdf9f4' || color.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Custom Text for Personalized Items */}
              {product.categoryId === 'personalizados' && (
                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Nome ou Iniciais para Gravação 3D (Opcional):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ex: Sofia, Lucas, M&J"
                    maxLength={20}
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2 text-sm outline-hidden"
                  />
                </div>
              )}

              {/* Quantity & CTA */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#d8c2bd] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] transition-colors cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#33221e]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-10 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] transition-colors cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>Adicionar € {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
                </button>
              </div>

              {/* Specs bullet points */}
              <div className="pt-3 border-t border-[#fae2dc] text-xs text-[#735953] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-[#f43f7a]" />
                  <span>Dimensões: <strong>{product.dimensions || 'Sob medida'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#f43f7a]" />
                  <span>Material: <strong>{product.material || 'PLA Ecológico de Alta Precisão'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f43f7a]" />
                  <span>Fabricado artesanalmente em <strong>Guimarães, Portugal</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
