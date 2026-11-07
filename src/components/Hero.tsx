import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenCustomModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts }) => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5f2] via-[#f8eee7] to-[#f3e7e0] py-8 sm:py-12 md:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            <div className="space-y-1">
              <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-[#2b170c] leading-[1.15]">
                {t('hero_slide1_title_line1')} <br />
                {t('hero_slide1_title_line2')} <br />
                <span className="text-[#d97706] font-serif-title">
                  {t('hero_slide1_title_line3')} <br />
                  {t('hero_slide1_title_line4')}
                </span> <br />
                <span className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-[#2b170c] font-medium block pt-1">
                  {t('hero_slide1_title_line5')}
                </span>
              </h1>
            </div>


            {/* Single Main CTA Button */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98"
              >
                <span>{t('hero_btn_explore')}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Product Composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px]">
              <div className="relative rounded-2xl overflow-hidden shadow-xs transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src="/images/hero_products_clean.png"
                  alt="Peças em impressão 3D da Janley Store - Suporte de telemóvel, vasos e organizadores"
                  className="w-full h-auto object-cover rounded-2xl drop-shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
