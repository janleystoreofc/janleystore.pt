import React, { useState } from 'react';
import { X, Search, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const filtered = PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-start justify-center p-4 pt-16 sm:pt-24">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#fae2dc] animate-in zoom-in-95 duration-200">
          {/* Header Input */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-[#f43f7a] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por suporte, vaso, chaveiro, natal..."
              className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-2xl pl-11 pr-10 py-3 text-sm text-[#33221e] outline-hidden shadow-2xs"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7d605a] hover:text-[#f43f7a] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results list */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#7d605a]">
                Nenhum produto encontrado para "{query}".
              </div>
            ) : (
              filtered.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#fff7f8] border border-transparent hover:border-[#fae2dc] transition-all cursor-pointer group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-14 h-14 rounded-lg object-cover bg-[#faf4f2] border border-[#fae4e1]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#33221e] group-hover:text-[#f43f7a] truncate">
                      {prod.name}
                    </h4>
                    <span className="text-xs text-[#8c6760]">{prod.category}</span>
                    <div className="text-xs font-bold text-[#f43f7a] mt-0.5">
                      € {prod.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, prod.colors[0], 1);
                    }}
                    className="p-2 rounded-lg bg-[#fdedea] text-[#f43f7a] hover:bg-[#f43f7a] hover:text-white transition-colors cursor-pointer"
                    title="Adicionar ao carrinho"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
