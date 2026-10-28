import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onOpenCustomModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onOpenCustomModal }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      titleLine1: 'Ideias que',
      titleLine2: 'ganham forma.',
      subtitle:
        'Produtos únicos, personalizados e feitos com tecnologia de impressão 3D. Descobre peças criativas para o teu dia a dia.',
      image: '/images/hero_products_clean.png',
      alt: 'Peças em impressão 3D da Janley Store - Suporte de telemóvel, vasos e organizadores',
    },
    {
      titleLine1: 'Design & arte',
      titleLine2: 'para o teu espaço.',
      subtitle:
        'Decoração moderna fabricada camada a camada em Guimarães com filamentos sustentáveis de alta precisão.',
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fcedeb] via-[#fcf2ee] to-[#faf5f2] py-8 sm:py-12 md:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 z-10 space-y-6 text-center lg:text-left">
            <div className="space-y-1">
              <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[#33221e] leading-[1.1]">
                {current.titleLine1} <br />
                <span className="text-[#f43f7a] font-serif-title">{current.titleLine2}</span>
              </h1>
            </div>

            <p className="text-[#5f4640] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              {current.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreProducts}
                className="bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
              >
                <span>VER PRODUTOS</span>
              </button>

              <button
                onClick={onOpenCustomModal}
                className="bg-white hover:bg-[#fff7f8] text-[#33221e] border border-[#d9c5c1] font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-lg shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#f43f7a]" />
                <span>CRIAR PERSONALIZADO</span>
              </button>
            </div>

            {/* Carousel navigation dots */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-6">
              {[0, 1, 2, 3].map((dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveSlide(dotIdx % slides.length)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    (dotIdx % slides.length) === activeSlide
                      ? 'w-7 bg-[#f43f7a]'
                      : 'w-2.5 bg-[#dfcec9] hover:bg-[#c9b3ad]'
                  }`}
                  aria-label={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Hero Product Composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] group">
              <div className="relative rounded-2xl overflow-hidden shadow-sm transition-transform duration-500 hover:scale-[1.01]">
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
