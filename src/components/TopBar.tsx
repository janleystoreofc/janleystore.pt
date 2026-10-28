import React from 'react';
import { Truck, Phone, Mail, Instagram } from 'lucide-react';

interface TopBarProps {
  onOpenContact?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenContact }) => {
  return (
    <div className="bg-[#fdedea] text-[#6b3f37] text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#fbdad2]/50 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Free delivery notice */}
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <Truck className="w-4 h-4 text-[#f43f7a]" />
          <span>Entregamos em todo Portugal</span>
        </div>

        {/* Right: Direct contacts & Socials */}
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
          <a
            href="tel:+351935742686"
            className="flex items-center gap-1.5 hover:text-[#f43f7a] transition-colors"
            title="Ligar para a Janley Store"
          >
            <Phone className="w-3.5 h-3.5 text-[#f43f7a]" />
            <span className="font-medium">+351 935 742 686</span>
          </a>

          <a
            href="mailto:janleystorebr@gmail.com"
            className="hidden md:flex items-center gap-1.5 hover:text-[#f43f7a] transition-colors"
            title="Enviar e-mail para Janley Store"
          >
            <Mail className="w-3.5 h-3.5 text-[#f43f7a]" />
            <span>janleystorebr@gmail.com</span>
          </a>

          <div className="flex items-center gap-2.5 pl-2 border-l border-[#ecd0c9]">
            <a
              href="https://www.instagram.com/janleystore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Janley Store"
              className="text-[#6b3f37] hover:text-[#f43f7a] transition-transform hover:scale-110"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            {/* Custom TikTok icon */}
            <a
              href="https://www.tiktok.com/@janleystore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok da Janley Store"
              className="text-[#6b3f37] hover:text-[#f43f7a] transition-transform hover:scale-110"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.046.87.135V9.4a6.35 6.35 0 0 0-.87-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.79 5.38 6.27 6.27 0 0 0 2.89-5.32V8.41a8.27 8.27 0 0 0 4.67 1.43v-3.15z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
