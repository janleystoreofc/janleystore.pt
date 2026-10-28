import React, { useState } from 'react';
import { Instagram, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenCustomModal: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenHelpModal: (topic: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCustomModal,
  onOpenAbout,
  onOpenContact,
  onOpenHelpModal,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-[#f5e3df] pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#fae7e4]">
          {/* Col 1: Brand Info & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <img
                src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
                alt="JANLEY STORE - Impressão 3D"
                className="h-16 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-[#664b45] leading-relaxed max-w-sm">
              Criatividade, funcionalidade e design em cada detalhe. Produtos únicos feitos com impressão 3D em Portugal.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/janleystore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#fdeef0] hover:bg-[#fcd7df] text-[#f43f7a] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@janleystore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#fdeef0] hover:bg-[#fcd7df] text-[#f43f7a] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.046.87.135V9.4a6.35 6.35 0 0 0-.87-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.79 5.38 6.27 6.27 0 0 0 2.89-5.32V8.41a8.27 8.27 0 0 0 4.67 1.43v-3.15z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/351935742686?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20pe%C3%A7as%203D%20da%20Janley%20Store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#fdeef0] hover:bg-[#fcd7df] text-[#25D366] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Links Rápidos */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-[#33221e] tracking-tight">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm text-[#664b45]">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('produtos-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Loja
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('categorias-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Categorias
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomModal}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Personalizados
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Sobre nós
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ajuda ao Cliente */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-[#33221e] tracking-tight">
              Ajuda ao Cliente
            </h3>
            <ul className="space-y-2 text-sm text-[#664b45]">
              <li>
                <button
                  onClick={() => onOpenHelpModal('Minha Conta')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Minha Conta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Acompanhamento de Encomenda')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Acompanhamento de Encomenda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Envios e Entregas')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Envios e Entregas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Trocas e Devoluções')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Trocas e Devoluções
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Termos e Condições')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Termos e Condições
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Política de Privacidade')}
                  className="hover:text-[#f43f7a] transition-colors cursor-pointer"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <a
                  href="https://www.livroreclamacoes.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f43f7a] transition-colors inline-block"
                >
                  Livro de Reclamações
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-[#33221e] tracking-tight">
              Newsletter
            </h3>
            <p className="text-sm text-[#664b45] leading-relaxed">
              Subscreve para receber novidades e ofertas exclusivas.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O teu email"
                  required
                  className="w-full bg-white border border-[#d8c2bd] focus:border-[#f43f7a] focus:ring-1 focus:ring-[#f43f7a] rounded-lg px-3.5 py-2.5 text-sm text-[#33221e] placeholder:text-[#9c7d76] outline-hidden shadow-2xs transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs tracking-wider uppercase py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
              >
                SUBSCREVER
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Obrigado! Ficarás a par de todas as novidades Janley Store.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d605a]">
          <div>
            © {new Date().getFullYear()} Janley Store. Todos os direitos reservados. Guimarães, Portugal.
          </div>

          {/* Payment Badges (VISA, Mastercard, MB WAY, PayPal) */}
          <div className="flex items-center gap-3">
            {/* Visa */}
            <div className="h-6 px-2 bg-white border border-stone-200 rounded flex items-center justify-center font-bold text-[11px] tracking-wider text-[#1a1f71] shadow-2xs">
              VISA
            </div>

            {/* Mastercard */}
            <div className="h-6 px-2 bg-white border border-stone-200 rounded flex items-center gap-1 shadow-2xs">
              <div className="w-3 h-3 rounded-full bg-[#eb001b]" />
              <div className="w-3 h-3 rounded-full bg-[#f79e1b] -ml-2 opacity-90" />
              <span className="text-[10px] font-bold text-stone-700 ml-0.5 hidden xs:inline">mastercard</span>
            </div>

            {/* MB WAY */}
            <div className="h-6 px-2 bg-white border border-stone-200 rounded flex items-center gap-1 font-bold text-[10px] text-stone-900 shadow-2xs">
              <span className="bg-black text-white px-1 py-0.5 rounded text-[8px] font-extrabold">MB</span>
              <span className="text-[#008f51] font-black">WAY</span>
            </div>

            {/* PayPal */}
            <div className="h-6 px-2 bg-white border border-stone-200 rounded flex items-center justify-center font-bold italic text-[11px] text-[#003087] shadow-2xs">
              PayPal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
