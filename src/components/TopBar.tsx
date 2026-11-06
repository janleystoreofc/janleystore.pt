import React from 'react';
import { Truck, Phone, Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

interface TopBarProps {
  onOpenContact?: () => void;
  onOpenOrderTracking?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-[#2b170c] text-[#f5ede6] text-[11px] py-1 px-3 sm:px-6 border-b border-[#3d2010] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 h-6">
        {/* Left: Compact delivery summary */}
        <div className="flex items-center gap-1.5 min-w-0 font-medium">
          <Truck className="w-3 h-3 text-[#f59e0b] flex-shrink-0" />
          <span className="truncate text-[#f5ede6]">
            {t('entrega_info')}
          </span>
        </div>

        {/* Right: Only essential Contact & Language Selector */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <a
            href="tel:+351935742686"
            className="hidden xs:flex items-center gap-1 text-[#f5ede6] hover:text-[#f59e0b] transition-colors"
            title="Ligar para a Janley Store"
          >
            <Phone className="w-3 h-3 text-[#f59e0b]" />
            <span className="font-semibold text-[10px] sm:text-[11px]">+351 935 742 686</span>
          </a>

          {/* Minimalist Language Switcher */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#f5ede6] pl-2 border-l border-[#422211]">
            <Globe className="w-3 h-3 text-[#f59e0b]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[10px] sm:text-[11px] font-semibold text-[#f5ede6] hover:text-[#f59e0b] focus:outline-hidden cursor-pointer"
              aria-label="Idioma / Language"
            >
              <option value="pt" className="bg-[#2b170c] text-[#f5ede6]">PT 🇵🇹</option>
              <option value="en" className="bg-[#2b170c] text-[#f5ede6]">EN 🇬🇧</option>
              <option value="es" className="bg-[#2b170c] text-[#f5ede6]">ES 🇪🇸</option>
              <option value="fr" className="bg-[#2b170c] text-[#f5ede6]">FR 🇫🇷</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
