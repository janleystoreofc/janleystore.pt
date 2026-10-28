import React from 'react';
import { Truck, Award, Box, ShieldCheck } from 'lucide-react';

export const FeatureBar: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Envios para Portugal',
      subtitle: 'De forma rápida e segura',
    },
    {
      icon: Award,
      title: 'Produtos de qualidade',
      subtitle: 'Com atenção aos detalhes',
    },
    {
      icon: Box,
      title: 'Design exclusivo',
      subtitle: 'Peças únicas e personalizadas',
    },
    {
      icon: ShieldCheck,
      title: 'Pagamentos seguros',
      subtitle: 'Checkout 100% protegido',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-2xl border border-[#fae2de] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-[#f6e0dc]">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 ${
                  idx !== 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#fdf2f4] border border-[#fcd7df] flex items-center justify-center flex-shrink-0 text-[#f43f7a] shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-[#33221e] truncate">
                    {feature.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#735953] truncate">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
