/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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
import { CheckCircle2, Sparkles } from 'lucide-react';

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

  // Fetch public products from Supabase (or fallback cleanly if table not created yet)
  useEffect(() => {
    getPublicProducts()
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, [isAdminRoute]);

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
    <div className="min-h-screen flex flex-col bg-white text-[#3d2314] antialiased selection:bg-[#f59e0b]/25 selection:text-[#78350f]">
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LanguageProvider>
  );
}
