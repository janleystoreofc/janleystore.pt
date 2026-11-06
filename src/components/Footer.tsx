import React, { useState } from 'react';
import { Instagram, Send, CheckCircle2, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenCustomModal: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenHelpModal: (topic: string) => void;
  onOpenOrderTracking?: () => void;
  onOpenCustomerProfile?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenCustomModal,
  onOpenAbout,
  onOpenContact,
  onOpenHelpModal,
  onOpenOrderTracking,
  onOpenCustomerProfile,
  onOpenAdmin,
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const handleShareWithFriend = async () => {
    const shareData = {
      title: 'Janley Store - Impressão 3D',
      text: '🌻 Olá! Dá uma vista de olhos na Janley Store — peças incríveis e personalizadas feitas em impressão 3D em Guimarães, Portugal:',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback(true);
        setTimeout(() => setShareFeedback(false), 3000);
        return;
      } catch (err) {
        // User cancelled or fallback
      }
    }

    const text = `${shareData.text} ${shareData.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 3000);
  };

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
    <footer className="bg-white border-t border-[#ebdcd3] pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: Brand Info & Socials */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center">
              <img
                src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
                alt="JANLEY STORE - Impressão 3D"
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/janleystoreofc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#fef8ed] hover:bg-[#fde68a]/60 text-[#b45309] border border-[#fed7aa] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                title="Instagram @janleystoreofc"
                aria-label="Instagram @janleystoreofc"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://www.tiktok.com/@janleystoreofc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#fef8ed] hover:bg-[#fde68a]/60 text-[#b45309] border border-[#fed7aa] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                title="TikTok @janleystoreofc"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.046.87.135V9.4a6.35 6.35 0 0 0-.87-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.79 5.38 6.27 6.27 0 0 0 2.89-5.32V8.41a8.27 8.27 0 0 0 4.67 1.43v-3.15z" />
                </svg>
              </a>

              <a
                href="https://wa.me/351935742686?text=Ol%C3%A1%20Janley%20Store!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20pe%C3%A7as%203D."
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#fef8ed] hover:bg-emerald-50 text-[#008f51] border border-[#fed7aa] flex items-center justify-center transition-transform hover:scale-110 shadow-2xs"
                title="WhatsApp Janley Store"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                </svg>
              </a>
            </div>

            {/* Botão Indicar a um Amigo */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleShareWithFriend}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white text-xs font-bold transition-all duration-200 hover:scale-102 active:scale-98 shadow-2xs hover:shadow-sm cursor-pointer group"
                title="Indicar a Janley Store a um amigo"
              >
                <Share2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>Indicar a um Amigo</span>
              </button>
              {shareFeedback && (
                <span className="block text-[11px] text-[#008f51] font-semibold mt-1 animate-fadeIn">
                  ✓ Link pronto para partilhar!
                </span>
              )}
            </div>
          </div>

          {/* Col 2: Links Rápidos */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-[#3d2314] tracking-tight uppercase">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-1.5 text-xs text-[#5c3a1e]">
              <li>
                <button
                  onClick={handleShareWithFriend}
                  className="hover:text-[#d97706] transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-[#d97706]"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Indicar a um Amigo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('inicio')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('produtos-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('loja')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('categorias-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('categorias')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCustomModal}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('personalizados')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('sobre')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Apoio ao Cliente */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold text-[#3d2314] tracking-tight uppercase">
              {t('footer_support_title')}
            </h3>
            <ul className="space-y-1.5 text-xs text-[#5c3a1e]">
              {onOpenOrderTracking && (
                <li>
                  <button
                    onClick={onOpenOrderTracking}
                    className="font-bold text-[#d97706] hover:underline cursor-pointer"
                  >
                    {t('rastrear')}
                  </button>
                </li>
              )}
              {onOpenCustomerProfile && (
                <li>
                  <button
                    onClick={onOpenCustomerProfile}
                    className="hover:text-[#d97706] transition-colors cursor-pointer"
                  >
                    {t('favoritos')}
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  {t('contacto')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Envios e Prazos')}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  Envios CTT & Uber Flash
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelpModal('Pagamento MB WAY')}
                  className="hover:text-[#d97706] transition-colors cursor-pointer"
                >
                  Pagamento por MB WAY
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-bold text-[#3d2314] tracking-tight uppercase">
              {t('footer_newsletter_title')}
            </h3>
            <p className="text-xs text-[#5c3a1e] leading-relaxed">
              {t('footer_newsletter_desc')}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer_newsletter_placeholder')}
                required
                className="w-full bg-[#fef8ed] border border-[#fed7aa] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs text-[#3d2314] placeholder:text-[#9c7d76] outline-hidden shadow-2xs"
              />
              <button
                type="submit"
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {t('footer_newsletter_btn')}
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-xs text-[#008f51] bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Obrigado! Ficarás a par de todas as novidades Janley Store.</span>
              </div>
            )}
          </div>
        </div>

        {/* Compact Footer Bottom Bar */}
        <div className="pt-6 flex items-center justify-center sm:justify-start text-xs text-[#78350f]">
          {/* Compact location and delivery one-liner */}
          <div className="text-center sm:text-left font-medium flex items-center gap-2">
            <span>{t('footer_delivery_bottom')}</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-block text-[11px] text-[#b45309] hover:underline cursor-pointer opacity-70 hover:opacity-100"
                title="Área de Administração"
              >
                {t('footer_admin_link')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
