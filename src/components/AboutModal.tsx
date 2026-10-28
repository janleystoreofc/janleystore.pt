import React from 'react';
import { X, MapPin, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomModal: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenCustomModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200 space-y-5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
              alt="Janley Store"
              className="h-14 w-auto object-contain"
            />
          </div>

          <div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e]">
              Sobre a Janley Store
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#f43f7a] font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Estúdio & Atelier em Guimarães, Portugal</span>
            </div>
          </div>

          <p className="text-sm text-[#5f4640] leading-relaxed">
            A <strong>JANLEY STORE</strong> nasceu da paixão por dar vida e forma a ideias inovadoras através da tecnologia de <strong>impressão 3D</strong>. Cada peça é cuidadosamente desenhada, testada e fabricada camada a camada na histórica cidade berço de Guimarães.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#fdf6f4] border border-[#fae2dc] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#33221e]">
                <Sparkles className="w-4 h-4 text-[#f43f7a]" />
                <span>Design Exclusivo</span>
              </div>
              <p className="text-xs text-[#735953]">
                Linhas orgânicas, padrões canelados e acabamentos modernos que valorizam qualquer ambiente.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fdf6f4] border border-[#fae2dc] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#33221e]">
                <Heart className="w-4 h-4 text-[#f43f7a]" />
                <span>Filamentos Ecológicos</span>
              </div>
              <p className="text-xs text-[#735953]">
                Produzido com PLA biodegradável derivado de recursos naturais renováveis como o amido de milho.
              </p>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenCustomModal();
              }}
              className="flex-1 bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Pedir Peça Personalizada
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#d8c2bd] text-xs font-bold text-[#33221e] hover:bg-[#faf7f5] transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
