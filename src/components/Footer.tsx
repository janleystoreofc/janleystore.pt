import React, { useState } from 'react';
import { Instagram, Send, CheckCircle2, Share2, Gift, Heart, Sparkles } from 'lucide-react';
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
  const [copiedShare, setCopiedShare] = useState(false);

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

  const handleShareWithFriend = () => {
    const shareText = `🌻 Olá! Dá uma vista de olhos na Janley Store — peças incríveis e personalizadas feitas em impressão 3D em Guimarães, Portugal: https://janleystore.pt`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 4000);
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Referral & Incentive Banner: "Indicar a um amigo" */}
        <div className="mb-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {t('footer_referral_badge')}
                </span>
                <span className="text-[10px] font-bold bg-slate-800 text-amber-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {t('footer_referral_sub')}
                </span>
              </div>
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-white mt-0.5">
                {t('footer_referral_title')}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {t('footer_referral_desc')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShareWithFriend}
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98 group"
          >
            <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>{t('footer_referral_btn')}</span>
          </button>
        </div>

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

            <p className="text-xs sm:text-sm text-[#5c3a1e] leading-relaxed max-w-sm">
              {t('footer_desc')}
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/janleystoreofc"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-full bg-[#fef8ed] hover:bg-[#fde68a]/60 text-[#b45309] border border-[#fed7aa] flex items-center gap-1.5 text-xs font-bold transition-transform hover:scale-105 shadow-2xs"
                title="@janleystoreofc"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@janleystoreofc</span>
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
          </div>

          {/* Col 2: Links Rápidos */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-[#3d2314] tracking-tight uppercase">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-1.5 text-xs text-[#5c3a1e]">
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
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#78350f]">
          {/* Compact location and delivery one-liner */}
          <div className="text-center md:text-left font-medium flex items-center gap-2">
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

          {/* Payment MB WAY badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#5c3a1e]">{t('footer_payment_exclusive')}</span>
            <div className="h-6 px-2.5 bg-white border border-[#fed7aa] rounded-lg flex items-center gap-1 shadow-2xs">
              <span className="bg-black text-white px-1 py-0.5 rounded text-[8px] font-black">MB</span>
              <span className="text-[#008f51] font-black text-xs">WAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
