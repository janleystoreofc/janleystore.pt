import React from 'react';
import { X, MapPin, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomModal: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenCustomModal }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const content = {
    pt: {
      title: 'Sobre a Janley Store',
      location: 'Atelier em Guimarães, Braga - Portugal 🇵🇹 • Entregas CTT, Uber ou Recolha',
      desc1: 'A',
      desc2: 'nasceu da paixão por dar vida e forma a ideias inovadoras através da tecnologia de impressão 3D. Cada peça é cuidadosamente desenhada, testada e fabricada camada a camada em Guimarães, com entregas rápidas para todo o território português via CTT Expresso, Uber Flash ou recolha direta no atelier. Pagamento exclusivo e seguro por MB WAY.',
      feature1Title: 'Design Exclusivo',
      feature1Desc: 'Linhas orgânicas, padrões canelados e acabamentos modernos que valorizam qualquer ambiente.',
      feature2Title: 'Filamentos Ecológicos',
      feature2Desc: 'Produzido com PLA biodegradável derivado de recursos naturais renováveis como o amido de milho.',
      paletteTitle: 'Paleta Completa de Cores Janley Store',
      paletteSub: 'Mais cor para as suas ideias',
      btnCustom: 'Pedir Peça Personalizada',
      btnClose: 'Fechar',
    },
    en: {
      title: 'About Janley Store',
      location: 'Workshop in Guimarães, Braga - Portugal 🇵🇹 • CTT, Uber or Local Pickup',
      desc1: '',
      desc2: 'was born from the passion to bring innovative ideas to life through 3D printing technology. Every piece is carefully crafted, tested, and 3D printed layer by layer in Guimarães, with prompt delivery throughout Portugal via CTT Expresso, Uber Flash, or direct workshop pickup. Exclusive and secure payment via MB WAY.',
      feature1Title: 'Exclusive Design',
      feature1Desc: 'Organic curves, textured patterns, and contemporary finishes that elevate any living space.',
      feature2Title: 'Eco-Friendly Filaments',
      feature2Desc: 'Manufactured using premium biodegradable PLA derived from renewable resources such as corn starch.',
      paletteTitle: 'Official Janley Store Color Palette',
      paletteSub: 'More vibrant colors for your ideas',
      btnCustom: 'Request Custom 3D Piece',
      btnClose: 'Close',
    },
    es: {
      title: 'Sobre Janley Store',
      location: 'Taller en Guimarães, Braga - Portugal 🇵🇹 • Envíos CTT, Uber o Recogida',
      desc1: '',
      desc2: 'nació de la pasión por dar forma a ideas innovadoras a través de la impresión 3D. Cada pieza se diseña, prueba y fabrica capa por capa en Guimarães, con entregas en todo Portugal mediante CTT Expresso, Uber Flash o recogida en taller. Pago exclusivo y seguro con MB WAY.',
      feature1Title: 'Diseño Exclusivo',
      feature1Desc: 'Líneas elegantes, patrones acanalados y acabados modernos que embellecen cualquier espacio.',
      feature2Title: 'Filamentos Ecológicos',
      feature2Desc: 'Fabricado con PLA biodegradable obtenido de recursos naturales renovables como el maíz.',
      paletteTitle: 'Paleta Oficial de Colores Janley Store',
      paletteSub: 'Más vida y color para tus ideas',
      btnCustom: 'Solicitar Pieza a Medida',
      btnClose: 'Cerrar',
    },
    fr: {
      title: 'À Propos de Janley Store',
      location: 'Atelier à Guimarães, Braga - Portugal 🇵🇹 • Livraisons CTT, Uber ou Retrait',
      desc1: '',
      desc2: 'est née de la passion de donner vie aux idées grâce à la technologie d\'impression 3D. Chaque pièce est conçue, testée et imprimée 3D couche par couche à Guimarães, avec expédition rapide dans tout le Portugal via CTT Expresso, Uber Flash ou retrait direct à l\'atelier. Paiement sécurisé via MB WAY.',
      feature1Title: 'Design Exclusif',
      feature1Desc: 'Lignes épurées, textures élégantes et finitions modernes pour sublimer vos intérieurs.',
      feature2Title: 'Filaments Écologiques',
      feature2Desc: 'Fabriqué en PLA biodégradable issu de ressources végétales renouvelables comme l\'amidon de maïs.',
      paletteTitle: 'Palette Officielle de Couleurs Janley Store',
      paletteSub: 'Plus de couleurs pour vos créations',
      btnCustom: 'Commander une Pièce Sur-Mesure',
      btnClose: 'Fermer',
    },
  }[language] || {
    title: 'Sobre a Janley Store',
    location: 'Atelier em Guimarães, Braga - Portugal 🇵🇹 • Entregas CTT, Uber ou Recolha',
    desc1: 'A',
    desc2: 'nasceu da paixão por dar vida e forma a ideias inovadoras através da tecnologia de impressão 3D.',
    feature1Title: 'Design Exclusivo',
    feature1Desc: 'Linhas orgânicas, padrões canelados e acabamentos modernos.',
    feature2Title: 'Filamentos Ecológicos',
    feature2Desc: 'Produzido com PLA biodegradável.',
    paletteTitle: 'Paleta Completa de Cores Janley Store',
    paletteSub: 'Mais cor para as suas ideias',
    btnCustom: 'Pedir Peça Personalizada',
    btnClose: 'Fechar',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#fed7aa] my-8 animate-in zoom-in-95 duration-200 space-y-5">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#78350f] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
              alt="Janley Store"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#4a2e18]">
              {content.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#d97706] font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{content.location}</span>
            </div>
          </div>

          <p className="text-sm text-[#5c3a1e] leading-relaxed">
            {content.desc1} <strong>JANLEY STORE</strong> (<span className="text-[#d97706] font-semibold">@janleystoreofc</span>) {content.desc2}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fef3c7] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4a2e18]">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>{content.feature1Title}</span>
              </div>
              <p className="text-xs text-[#78350f]">
                {content.feature1Desc}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fef3c7] space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#4a2e18]">
                <Heart className="w-4 h-4 text-[#d97706]" />
                <span>{content.feature2Title}</span>
              </div>
              <p className="text-xs text-[#78350f]">
                {content.feature2Desc}
              </p>
            </div>
          </div>

          {/* Color Catalog Flyer Banner */}
          <div className="rounded-2xl border border-[#fed7aa] overflow-hidden bg-[#fffdf9] p-3 text-left shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#4a2e18]">
                {content.paletteTitle}
              </span>
              <span className="text-[11px] font-semibold text-[#d97706]">
                {content.paletteSub}
              </span>
            </div>
            <img
              src="/images/catalogo_nossas_cores.png"
              alt="Catálogo Nossas Cores Janley Store - 3D Printing Filaments"
              className="w-full h-auto rounded-xl object-contain border border-[#fed7aa]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenCustomModal();
              }}
              className="flex-1 bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
            >
              {content.btnCustom}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#fed7aa] text-xs font-bold text-[#4a2e18] hover:bg-[#fef8ed] transition-colors cursor-pointer"
            >
              {content.btnClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
