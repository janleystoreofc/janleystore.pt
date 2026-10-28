/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
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
import { PRODUCTS } from './data/products';
import { Product } from './types';
import { CheckCircle2, MessageCircle } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const { notification, clearNotification } = useCart();

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

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33221e] antialiased selection:bg-[#f43f7a]/15 selection:text-[#f43f7a]">
      {/* 1. Top Announcement Bar */}
      <TopBar onOpenContact={() => setContactModalOpen(true)} />

      {/* 2. Main Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenCustomModal={() => setCustomModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onExploreProducts={handleExploreProducts}
          onOpenCustomModal={() => setCustomModalOpen(true)}
        />

        {/* 4. Value Proposition Bar (4 Feature Cards) */}
        <FeatureBar />

        {/* 5. Comprar por Categoria (7 Circular Categories) */}
        <CategoriesSection
          selectedCategoryId={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 6. Produtos em Destaque (4 Columns Layout) */}
        <FeaturedProducts
          products={PRODUCTS}
          selectedCategoryId={selectedCategory}
          onClearFilter={() => setSelectedCategory(null)}
          onViewProductDetail={(product: Product) => setSelectedProduct(product)}
        />

        {/* 7. Customization Banner */}
        <CustomizationBanner
          onOpenCustomModal={() => setCustomModalOpen(true)}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenCustomModal={() => setCustomModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenHelpModal={() => setAboutModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={() => setCheckoutModalOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
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

      {/* Global Toast Notification */}
      {notification && (
        <div
          onClick={clearNotification}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#33221e] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-[#f43f7a]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Action WhatsApp Button for Quick Direct Support */}
      <a
        href="https://wa.me/351935742686?text=Ol%C3%A1%20Janley%20Store!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20as%20pe%C3%A7as%203D."
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp com Janley Store"
        className="fixed bottom-6 right-6 z-30 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.34 7.35 9.04 7.42 8.78 7.7C8.53 7.98 7.82 8.64 7.82 10C7.82 11.36 8.81 12.67 8.95 12.86C9.09 13.05 10.89 15.82 13.63 17C14.28 17.29 14.79 17.46 15.19 17.58C15.84 17.79 16.44 17.76 16.91 17.69C17.43 17.61 18.52 17.03 18.75 16.39C18.98 15.74 18.98 15.19 18.91 15.07C18.84 14.96 18.66 14.89 18.39 14.75C18.11 14.61 16.79 13.96 16.54 13.87C16.3 13.78 16.12 13.73 15.94 14C15.76 14.28 15.24 14.89 15.08 15.07C14.93 15.26 14.77 15.28 14.5 15.14C14.22 15 13.33 14.71 12.28 13.77C11.46 13.04 10.91 12.14 10.75 11.86C10.59 11.59 10.73 11.44 10.87 11.3C11 11.17 11.16 10.96 11.3 10.8C11.44 10.63 11.49 10.52 11.58 10.33C11.67 10.15 11.63 9.98 11.56 9.85C11.49 9.71 10.94 8.35 10.71 7.8C10.49 7.27 10.26 7.34 10.09 7.34C9.93 7.34 9.74 7.35 9.53 7.35Z" />
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
