import React from 'react';
import { Truck, Award, Box, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeatureBar: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Truck,
      title: t('feature_delivery_title'),
      subtitle: t('feature_delivery_sub'),
    },
    {
      icon: Award,
      title: t('feature_local_title'),
      subtitle: t('feature_local_sub'),
    },
    {
      icon: Box,
      title: t('feature_custom_title'),
      subtitle: t('feature_custom_sub'),
    },
    {
      icon: ShieldCheck,
      title: t('feature_payment_title'),
      subtitle: t('feature_payment_sub'),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 ${
                  idx !== 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center flex-shrink-0 text-amber-600 shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {feature.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
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
