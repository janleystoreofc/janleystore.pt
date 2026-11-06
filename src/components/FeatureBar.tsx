import React from 'react';
import { Award, Box, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeatureBar: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Award,
      title: t('feature_local_title'),
    },
    {
      icon: Box,
      title: t('feature_custom_title'),
    },
    {
      icon: ShieldCheck,
      title: t('feature_payment_title'),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 relative z-20">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#ebdcd3] shadow-[0_4px_20px_rgba(43,23,12,0.04)] p-2.5 sm:p-5">
        <div className="grid grid-cols-3 divide-x divide-[#ebdcd3]">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-3.5 px-1 sm:px-4 text-center sm:text-left min-w-0"
              >
                <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#fcf5f1] border border-[#e3d0c4] flex items-center justify-center flex-shrink-0 text-[#d97706] shadow-2xs">
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <div className="min-w-0 w-full sm:w-auto">
                  <h2 className="text-[10px] sm:text-base font-bold text-[#2b170c] truncate leading-tight">
                    {feature.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
