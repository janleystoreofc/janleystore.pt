import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenCustomModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenCustomModal }) => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      titleLine1: t('hero_slide1_title1'),
      titleLine2: t('hero_slide1_title2'),
      subtitle: t('hero_slide1_subtitle'),
      image: '/images/hero_products_clean.png',
      alt: 'Peças em impressão 3D da Janley Store - Suporte de telemóvel, vasos e organizadores',
    },
    {
      titleLine1: t('hero_slide2_title1'),
      titleLine2: t('hero_slide2_title2'),
      subtitle: t('hero_slide2_subtitle'),
      image: '/images/test_banner.png',
      alt: 'Decoração e peças personalizadas Janley Store',
    },
  ];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const current = slides[activeSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f1f5f9]/40 py-8 sm:py-12 md:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            <div className="space-y-1">
              <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                {current.titleLine1} <br />
                <span className="text-amber-500 font-serif-title">{current.titleLine2}</span>
              </h1>
            </div>

            <p className="text-slate-600 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {current.subtitle}
            </p>

            {/* CTAs with micro-effects */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98"
              >
                <span>{t('hero_btn_explore')}</span>
              </button>

              <button
                onClick={onOpenCustomModal}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-xs hover:shadow-md hover:border-amber-400 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 group"
              >
                <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                <span>{t('hero_btn_custom')}</span>
              </button>
            </div>

            {/* Carousel navigation dots */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-6">
              {[0, 1].map((dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveSlide(dotIdx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === activeSlide
                      ? 'w-7 bg-amber-500'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Hero Product Composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] group">
              <div className="relative rounded-2xl overflow-hidden shadow-xs transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={current.image}
                  alt={current.alt}
                  className="w-full h-auto object-cover rounded-2xl drop-shadow-xs"
                />
              </div>

              {/* Slider Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-all shadow-md cursor-pointer"
                aria-label="Slide seguinte"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
