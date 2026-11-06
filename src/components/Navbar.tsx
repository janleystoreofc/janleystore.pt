import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Heart, Sparkles, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES } from '../data/products';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  onOpenCustomModal: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenOrderTracking?: () => void;
  onOpenCustomerProfile?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectCategory,
  onOpenSearch,
  onOpenCustomModal,
  onOpenAbout,
  onOpenContact,
  onOpenOrderTracking,
  onOpenCustomerProfile,
  onOpenAdmin,
}) => {
  const { totalItemsCount, setIsCartOpen, favorites } = useCart();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [personalizadosDropdownOpen, setPersonalizadosDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ebdcd3] shadow-[0_2px_10px_rgba(43,23,12,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Left: Brand Logo (Sunflower) */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left group focus:outline-hidden py-1"
              aria-label="Janley Store - Página Inicial"
            >
              <img
                src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
                alt="JANLEY STORE - Impressão 3D"
                className="h-11 sm:h-13 md:h-15 w-auto max-h-[64px] object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[14px] lg:text-[15px] font-medium text-[#2b170c]">
            <button
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'inicio'
                  ? 'text-[#d97706] font-bold border-b-2 border-[#d97706] pb-1'
                  : 'hover:text-[#d97706]'
              }`}
            >
              {t('inicio')}
            </button>

            <button
              onClick={() => {
                setActiveTab('loja');
                const el = document.getElementById('produtos-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'loja'
                  ? 'text-[#d97706] font-bold border-b-2 border-[#d97706] pb-1'
                  : 'hover:text-[#d97706]'
              }`}
            >
              {t('loja')}
            </button>

            {/* Categorias Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  const el = document.getElementById('categorias-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1 hover:text-[#d97706] transition-colors cursor-pointer py-2"
              >
                <span>{t('categorias')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#d97706]' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-[#fed7aa] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-[#b45309] tracking-wider uppercase border-b border-[#fef3c7]">
                    Categorias 3D
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#4a2e18] hover:bg-[#fef8ed] hover:text-[#d97706] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover border border-[#fde68a]" />
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Personalizados Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPersonalizadosDropdownOpen(true)}
              onMouseLeave={() => setPersonalizadosDropdownOpen(false)}
            >
              <button
                onClick={onOpenCustomModal}
                className="flex items-center gap-1 hover:text-[#d97706] transition-colors cursor-pointer py-2"
              >
                <span>{t('personalizados')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${personalizadosDropdownOpen ? 'rotate-180 text-[#d97706]' : ''}`} />
              </button>

              {personalizadosDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-[#fed7aa] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      onOpenCustomModal();
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#4a2e18] hover:bg-[#fef8ed] hover:text-[#d97706] block transition-colors cursor-pointer"
                  >
                    <div className="font-bold">Criar Peça Sob Medida</div>
                    <div className="text-xs text-[#78350f]">Orçamento 3D exclusivo</div>
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory('personalizados');
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#4a2e18] hover:bg-[#fef8ed] hover:text-[#d97706] block transition-colors cursor-pointer"
                  >
                    <div className="font-bold">Letreiros & Nomes</div>
                    <div className="text-xs text-[#78350f]">Decoração exclusiva</div>
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory('chaveiros');
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#4a2e18] hover:bg-[#fef8ed] hover:text-[#d97706] block transition-colors cursor-pointer"
                  >
                    <div className="font-bold">Chaveiros & Lembranças</div>
                    <div className="text-xs text-[#78350f]">Packs de 5 a 100 unidades</div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setActiveTab('orcamento');
                const el = document.getElementById('orcamento-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orcamento'
                  ? 'text-[#d97706] font-bold border-b-2 border-[#d97706] pb-1'
                  : 'hover:text-[#d97706]'
              }`}
            >
              <span className="relative">
                {t('orcamento')}
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              </span>
            </button>

            <button
              onClick={onOpenAbout}
              className="hover:text-[#d97706] transition-colors cursor-pointer"
            >
              {t('sobre')}
            </button>

            <button
              onClick={onOpenContact}
              className="hover:text-[#d97706] transition-colors cursor-pointer"
            >
              {t('contacto')}
            </button>
          </nav>

          {/* Right: Actions (Search, Favorites, User Account, Cart) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#4a2e18] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer"
              aria-label="Pesquisar produtos"
              title="Pesquisar catálogo"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Favorites Button */}
            <button
              onClick={onOpenCustomerProfile || onOpenContact}
              className="relative p-2 text-[#4a2e18] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer"
              aria-label="Meus Favoritos"
              title="Ver Peças Favoritas"
            >
              <Heart className={`w-5 h-5 stroke-[1.8] ${favorites.length > 0 ? 'fill-[#f59e0b] text-[#f59e0b]' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#f59e0b] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <button
              onClick={onOpenCustomerProfile || onOpenContact}
              className="p-2 text-[#4a2e18] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer"
              aria-label="Área de Cliente"
              title="A Minha Conta & Perfil"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#4a2e18] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer group"
              aria-label={`Carrinho de compras com ${totalItemsCount} artigos`}
              title="Ver Carrinho"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#d97706] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                {totalItemsCount}
              </span>
            </button>

            {/* Admin Discreet Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden lg:flex items-center gap-1 text-[11px] font-bold text-[#78350f] hover:text-[#d97706] bg-[#fef8ed] hover:bg-[#fde68a]/50 px-2.5 py-1 rounded-lg border border-[#fde68a] transition-colors cursor-pointer"
                title="Acesso Administrativo /admin"
              >
                <Shield className="w-3 h-3 text-[#d97706]" />
                <span>Admin</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4a2e18] hover:text-[#d97706] rounded-lg transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu with Sunflower Warm Colors */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#fde68a] px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => {
              setActiveTab('inicio');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-bold text-base text-[#d97706]"
          >
            {t('inicio')}
          </button>
          <button
            onClick={() => {
              setActiveTab('loja');
              setMobileMenuOpen(false);
              const el = document.getElementById('produtos-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('loja')}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('categorias-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('categorias')}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCustomModal();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('personalizados')}
          </button>
          <button
            onClick={() => {
              setActiveTab('orcamento');
              setMobileMenuOpen(false);
              const el = document.getElementById('orcamento-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-bold text-base text-[#d97706] bg-[#fef8ed] px-3 rounded-xl"
          >
            ✨ {t('orcamento')}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenCustomerProfile) onOpenCustomerProfile();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('favoritos')} ({favorites.length})
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('sobre')}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a2e18] hover:text-[#d97706]"
          >
            {t('contacto')}
          </button>
          {onOpenAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="block w-full text-left py-2 font-bold text-sm text-[#78350f] hover:text-[#d97706] border-t border-[#fef3c7] pt-3"
            >
              Painel Administrativo (/admin)
            </button>
          )}
        </div>
      )}
    </header>
  );
};
