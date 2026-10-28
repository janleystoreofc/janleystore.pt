import React from 'react';
import { CATEGORIES } from '../data/products';

interface CategoriesSectionProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <section id="categorias-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title with pink underline */}
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="font-serif-title text-2xl sm:text-3xl md:text-4xl font-bold text-[#33221e] tracking-tight">
          Comprar por Categoria
        </h2>
        {/* Hot pink bar under "Categoria" */}
        <div className="w-12 h-0.5 bg-[#f43f7a] mx-auto mt-2.5 rounded-full" />
      </div>

      {/* 7 Circular Categories Grid / Carousel */}
      <div className="flex items-start justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center flex-shrink-0 w-24 sm:w-28 md:w-32 text-center cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-hidden"
            >
              {/* Circular Image Container */}
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-[#f43f7a] ring-offset-2 scale-105 shadow-md'
                    : 'ring-1 ring-[#fae4e1] group-hover:ring-2 group-hover:ring-[#f43f7a] shadow-xs group-hover:shadow-md'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-108"
                />
              </div>

              {/* Category Name Label */}
              <span
                className={`mt-3 text-xs sm:text-sm font-semibold tracking-tight transition-colors line-clamp-2 ${
                  isSelected ? 'text-[#f43f7a]' : 'text-[#33221e] group-hover:text-[#f43f7a]'
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
