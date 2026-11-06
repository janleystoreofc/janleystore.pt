import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CustomizationBannerProps {
  onOpenCustomModal: () => void;
}

export const CustomizationBanner: React.FC<CustomizationBannerProps> = ({ onOpenCustomModal }) => {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a160b] via-[#3a1f10] to-[#201007] border border-[#d97706]/35 shadow-[0_16px_50px_rgba(42,22,11,0.25)]">
        {/* Warm golden backlight radiance */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d97706]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#f59e0b]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 p-8 sm:p-10 lg:p-14 z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4d2914] border border-[#d97706]/40 text-[#fcd34d] text-xs font-bold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Personalização 3D Sob Medida</span>
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {t('custom_banner_line1')}
              <span className="block font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f59e0b] mt-1.5">
                {t('custom_banner_line2')}
              </span>
            </h2>

            <p className="text-[#edd5c6] text-sm sm:text-base leading-relaxed max-w-lg">
              {t('custom_banner_desc')}
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenCustomModal}
                className="bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-xl shadow-[0_4px_20px_rgba(217,119,6,0.4)] hover:shadow-[0_6px_25px_rgba(217,119,6,0.6)] transition-all duration-200 cursor-pointer flex items-center gap-2 group active:scale-98"
              >
                <span>{t('custom_banner_btn')}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right composition image */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center p-4 sm:p-6 lg:p-8">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl bg-[#2a160b]/40">
              <img
                src="/images/banner_products.png"
                alt="Peças personalizadas em impressão 3D - Letreiro Sofia, Vaso e Bandeja"
                className="w-full h-auto max-h-[340px] object-cover rounded-2xl transition-transform duration-500 hover:scale-102"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
