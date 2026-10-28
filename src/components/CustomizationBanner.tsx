import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CustomizationBannerProps {
  onOpenCustomModal: () => void;
}

export const CustomizationBanner: React.FC<CustomizationBannerProps> = ({ onOpenCustomModal }) => {
  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fdedea] via-[#fce5e0] to-[#fadfd8] border border-[#fae2dc] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 z-10 space-y-4">
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#33221e] tracking-tight leading-tight">
              Personaliza a tua ideia.
              <span className="block font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f43f7a] mt-1">
                Criamos peças únicas para ti.
              </span>
            </h2>

            <p className="text-[#5f4640] text-sm sm:text-base leading-relaxed max-w-lg">
              Diz-nos o que tens em mente e nós transformamos em realidade com impressão 3D.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenCustomModal}
                className="bg-white hover:bg-[#fff9fa] text-[#33221e] border border-[#d8c2bd] font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 group active:scale-98"
              >
                <span>PEDIR PERSONALIZAÇÃO</span>
                <ArrowRight className="w-4 h-4 text-[#f43f7a] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right composition image */}
          <div className="lg:col-span-6 relative flex justify-end items-center h-full min-h-[220px] sm:min-h-[280px]">
            <img
              src="/images/banner_products.png"
              alt="Peças personalizadas em impressão 3D - Letreiro Sofia, Vaso e Bandeja"
              className="w-full h-full object-cover object-left-bottom lg:object-contain rounded-r-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
