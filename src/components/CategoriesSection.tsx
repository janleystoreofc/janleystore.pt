import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles } from 'lucide-react';

interface CategoriesSectionProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section id="categorias-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title with aesthetic refined style */}
      <div className="text-center mb-6 sm:mb-8 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#f43f7a] uppercase tracking-widest bg-[#fdedea] px-3 py-0.5 rounded-full mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Atelier 3D Guimarães</span>
        </div>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e] tracking-tight">
          Comprar por Categoria
        </h2>
        <div className="w-10 h-0.5 bg-[#f43f7a] mx-auto mt-2 rounded-full" />
      </div>

      {/* 12 Categories Grid - Ultra-compact, Aesthetic & all visible at once without horizontal drag */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 max-w-6xl mx-auto">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus:outline-hidden p-1.5 rounded-2xl hover:bg-[#fff7f8]"
              title={cat.description}
            >
              {/* Micro Circular Image Container */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[#f43f7a] ring-offset-2 scale-105 shadow-sm'
                    : 'ring-1 ring-[#fae4e1] group-hover:ring-2 group-hover:ring-[#f43f7a]/60 shadow-2xs group-hover:shadow-xs'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Delicate Category Name Label */}
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase transition-colors truncate w-full text-center leading-tight ${
                  isSelected ? 'text-[#f43f7a] font-bold' : 'text-[#5a423d] group-hover:text-[#f43f7a]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
