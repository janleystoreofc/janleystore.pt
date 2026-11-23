/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { StoreSettingsProvider, useStoreSettings } from './context/StoreSettingsContext';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureBar } from './components/FeatureBar';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { CustomizationBanner } from './components/CustomizationBanner';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { SearchModal } from './components/SearchModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { BudgetQuoteSection } from './components/BudgetQuoteSection';
import { AdminPanel } from './components/AdminPanel';
import { PRODUCTS } from './data/products';
import { getPublicProducts } from './lib/supabase';
import { Product } from './types';
import { CheckCircle2, Sparkles, ShieldAlert, Gift, X } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Admin routing state (/admin)
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname === '/admin' || window.location.search.includes('admin');
  });

  // Listen to popstate for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname === '/admin' || window.location.search.includes('admin'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { refreshStoreSettings } = useStoreSettings();

  // Fetch public products from Supabase (or fallback cleanly if table not created yet)
  useEffect(() => {
    getPublicProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
    refreshStoreSettings();
  }, [isAdminRoute, refreshStoreSettings]);

  // Modals state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('JNL-2026-8491');
  const [customerProfileOpen, setCustomerProfileOpen] = useState(false);
  const [customerProfileTab, setCustomerProfileTab] = useState<'favoritos' | 'conta' | 'encomendas'>('favoritos');

  const { notification, clearNotification } = useCart();
  const { t } = useLanguage();

  // Storefront image privacy protection (blocks download, drag, context menu & blurs on capture attempts)
  const [privacyShieldActive, setPrivacyShieldActive] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState<string | null>(null);

  // Automatic on-site invitation notification for logged-in / registered visitors
  const [customerInviteBanner, setCustomerInviteBanner] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (isAdminRoute) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleInviteBanner = () => {
      if (timer) clearTimeout(timer);

      const clientEmail = localStorage.getItem('janley_client_email') || '';
      const clientName = localStorage.getItem('janley_client_name') || '';
      const hasConverted = localStorage.getItem('janley_customer_converted') === 'true';
      const dismissed = sessionStorage.getItem('janley_invite_dismissed') === '1';

      if (!clientEmail || hasConverted || dismissed) {
        setCustomerInviteBanner(null);
        return;
      }

      timer = setTimeout(() => {
        setCustomerInviteBanner({ email: clientEmail, name: clientName });
      }, 12000);
    };

    scheduleInviteBanner();
    window.addEventListener('janley:customer-auth', scheduleInviteBanner);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('janley:customer-auth', scheduleInviteBanner);
    };
  }, [isAdminRoute]);

  const dismissInviteBanner = () => {
    sessionStorage.setItem('janley_invite_dismissed', '1');
    setCustomerInviteBanner(null);
  };

  useEffect(() => {
    if (isAdminRoute) return;

    let shieldTimer: ReturnType<typeof setTimeout> | null = null;
    let noticeTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerPrivacyShield = (blurScreen: boolean) => {
      if (blurScreen) {
        setPrivacyShieldActive(true);
        if (shieldTimer) clearTimeout(shieldTimer);
        shieldTimer = setTimeout(() => setPrivacyShieldActive(false), 3000);
      }
      setPrivacyNotice(
        'Imagens privadas da Janley Store — download, clonagem ou captura de ecrã não são permitidos.'
      );
      if (noticeTimer) clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => setPrivacyNotice(null), 4000);
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.closest('img'))) {
        e.preventDefault();
        triggerPrivacyShield(false);
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      const keyLower = (e.key || '').toLowerCase();
      const isPrintScreen = e.key === 'PrintScreen';
      const isSaveOrPrint =
        (e.ctrlKey || e.metaKey) && (keyLower === 's' || keyLower === 'p' || keyLower === 'u');
      const isCaptureShortcut =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (keyLower === 's' || keyLower === '3' || keyLower === '4' || keyLower === '5');

      if (isPrintScreen || isCaptureShortcut || (!isTyping && isSaveOrPrint)) {
        e.preventDefault();
        triggerPrivacyShield(true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(() => {});
          }
        } catch {
          // Ignore clipboard permission errors
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        triggerPrivacyShield(true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('').catch(() => {});
          }
        } catch {
          // Ignore clipboard permission errors
        }
      }
    };

    const handleBeforePrint = () => {
      triggerPrivacyShield(true);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('beforeprint', handleBeforePrint);

    return () => {
      if (shieldTimer) clearTimeout(shieldTimer);
      if (noticeTimer) clearTimeout(noticeTimer);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, [isAdminRoute]);

  // Scroll smoothly to products section
  const handleExploreProducts = () => {
    setActiveTab('loja');
    const el = document.getElementById('produtos-section') || document.getElementById('produtos-destaque');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a category is clicked
  const handleSelectCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      handleExploreProducts();
    }
  };

  // Navigate to Admin
  const handleOpenAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return from Admin to Store
  const handleBackToShop = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin panel mode
  if (isAdminRoute) {
    return <AdminPanel onBackToShop={handleBackToShop} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-white text-[#3d2314] antialiased selection:bg-[#f59e0b]/25 selection:text-[#78350f] storefront-protected ${
        privacyShieldActive ? 'privacy-shield-active' : ''
      }`}
    >
      {/* 1. Top Announcement Bar */}
      <TopBar
        onOpenContact={() => setContactModalOpen(true)}
        onOpenOrderTracking={() => setOrderTrackingOpen(true)}
      />

      {/* 2. Main Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCustomModal={() => setCustomModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenOrderTracking={() => setOrderTrackingOpen(true)}
        onOpenCustomerProfile={() => {
          setCustomerProfileTab('favoritos');
          setCustomerProfileOpen(true);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onExploreProducts={handleExploreProducts}
          onOpenCustomModal={() => setCustomModalOpen(true)}
        />

        {/* 4. Value Proposition Bar (4 Feature Cards) */}
        <FeatureBar />

        {/* 5. Comprar por Categoria (12 Circular Categories) */}
        <CategoriesSection
          selectedCategoryId={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 6. Produtos em Destaque (Grid 3 por linha) */}
        <FeaturedProducts
          products={products}
          selectedCategoryId={selectedCategory}
          onClearFilter={() => setSelectedCategory(null)}
          onViewProductDetail={(product: Product) => setSelectedProduct(product)}
        />

        {/* 7. Aba de Orçamento Direto 3D via WhatsApp com Amostra e Quantidade */}
        <BudgetQuoteSection onBackToShop={handleExploreProducts} />
      </main>

      {/* 9. Footer with Refer-a-friend WhatsApp button and MB WAY notice */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenCustomModal={() => setCustomModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenHelpModal={(topic) => {
          if (topic === 'Acompanhamento de Encomenda') {
            setOrderTrackingOpen(true);
          } else {
            setAboutModalOpen(true);
          }
        }}
        onOpenOrderTracking={() => setOrderTrackingOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setCheckoutModalOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOpenOrderTracking={(orderNum) => {
          setTrackingOrderNumber(orderNum);
          setOrderTrackingOpen(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Custom Order Request Modal */}
      <CustomOrderModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
      />

      {/* Customer Profile & Favorites Modal */}
      <CustomerProfileModal
        isOpen={customerProfileOpen}
        onClose={() => setCustomerProfileOpen(false)}
        products={products}
        onViewProductDetail={(product: Product) => setSelectedProduct(product)}
        onOpenOrderTracking={() => setOrderTrackingOpen(true)}
        defaultTab={customerProfileTab}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(product: Product) => setSelectedProduct(product)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        onOpenCustomModal={() => {
          setAboutModalOpen(false);
          setCustomModalOpen(true);
        }}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* 3D Print Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={orderTrackingOpen}
        onClose={() => setOrderTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div
          onClick={clearNotification}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#3d2314] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce cursor-pointer border border-[#f59e0b]/40"
        >
          <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Privacy & Anti-Cloning Protection Alert */}
      {privacyNotice && (
        <div
          onClick={() => setPrivacyNotice(null)}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] bg-[#2b170c] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#d97706] max-w-md w-[92%] cursor-pointer"
        >
          <ShieldAlert className="w-5 h-5 text-[#f59e0b] shrink-0" />
          <span>{privacyNotice}</span>
        </div>
      )}

      {/* Automatic On-Site Re-Engagement Notification for Logged-In Visitors */}
      {customerInviteBanner && (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 max-w-xs w-[calc(100%-5.5rem)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#fbd9ce] p-4 animate-in slide-in-from-bottom-4 duration-300">
          <button
            type="button"
            onClick={dismissInviteBanner}
            aria-label="Fechar convite"
            className="absolute top-2.5 right-2.5 p-1 text-[#8c6760] hover:text-[#d97706] hover:bg-[#fef4f0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-5">
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#3d2314]">
                Olá {customerInviteBanner.name || customerInviteBanner.email.split('@')[0]}! Oferta especial 3D
              </div>
              <p className="text-[11px] text-[#5c3a1e] leading-relaxed">
                Obrigado pelo teu registo na <strong>Janley Store</strong>! Usa o cupão{' '}
                <strong className="text-[#d97706] bg-[#fef8ed] px-1.5 py-0.5 rounded border border-[#fed7aa]">
                  JANLEY10
                </strong>{' '}
                para <strong>10% de desconto</strong> na tua peça personalizada.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    dismissInviteBanner();
                    handleExploreProducts();
                  }}
                  className="bg-[#d97706] hover:bg-[#b45309] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Ver Novidades 3D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissInviteBanner();
                    setCustomModalOpen(true);
                  }}
                  className="bg-[#faf4f2] hover:bg-[#fdedea] text-[#3d2314] border border-[#fae2dc] text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Pedir Personalizado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sunflower Floating Action Button with Glow & Spin Effects */}
      <button
        type="button"
        onClick={() => setCustomModalOpen(true)}
        aria-label={t('floating_custom_title')}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 group flex items-center justify-center cursor-pointer focus:outline-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        {/* Floating Tooltip Label (Appears smoothly on hover) */}
        <div className="hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#2b170c]/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-[#e3d0c4]/25 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b] animate-spin" />
          <span>{t('floating_custom_title')}</span>
        </div>

        {/* Sunflower with organic warm glow and gentle hover spin */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
          {/* Warm Golden Glow Aura */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#d97706] to-[#f59e0b] blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

          {/* Golden Rotating Radial Aura Ring */}
          <div className="absolute -inset-1 rounded-full border border-dashed border-[#d97706]/40 animate-[spin_16s_linear_infinite] group-hover:border-[#d97706] transition-colors" />

          {/* Sunflower Image */}
          <img
            src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_791f71cf.png"
            alt="Janley Store - Girassol 3D"
            className="relative w-full h-full object-contain filter drop-shadow-[0_6px_16px_rgba(43,23,12,0.4)] transition-transform duration-700 ease-out group-hover:rotate-45 group-hover:scale-110 active:scale-95 select-none pointer-events-none"
          />

          {/* Tiny Golden Sparkle Notification Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#d97706] border-2 border-white shadow-xs" />
          </span>
        </div>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </StoreSettingsProvider>
    </LanguageProvider>
  );
}
