import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesSectionProps {
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <section id="categorias-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title with aesthetic refined style */}
      <div className="text-center mb-6 sm:mb-8 space-y-1">
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2b170c] tracking-tight">
          {t('categories_title')}
        </h2>
        <div className="w-10 h-0.5 bg-[#d97706] mx-auto mt-2 rounded-full" />
      </div>

      {/* 12 Categories Grid - Ultra-compact, Aesthetic & all visible at once without horizontal drag */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3 max-w-6xl mx-auto">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const raw = t(`cat_${cat.id}`);
          const translatedName = (!raw || raw.startsWith('cat_')) ? cat.name : raw;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus:outline-hidden p-1.5 rounded-2xl hover:bg-[#fcf5f1]"
              title={cat.description}
            >
              {/* Micro Circular Image Container */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[#d97706] ring-offset-2 scale-105 shadow-sm'
                    : 'ring-1 ring-[#e3d0c4] group-hover:ring-2 group-hover:ring-[#d97706]/70 shadow-2xs group-hover:shadow-xs'
                }`}
              >
                <img
                  src={cat.image}
                  alt={translatedName}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Delicate Category Name Label */}
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase transition-colors truncate w-full text-center leading-tight ${
                  isSelected ? 'text-[#d97706] font-bold' : 'text-[#2b170c] group-hover:text-[#d97706]'
                }`}
              >
                {translatedName}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
