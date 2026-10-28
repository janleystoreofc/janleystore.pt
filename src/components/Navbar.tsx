import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../data/products';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  onOpenCustomModal: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectCategory,
  onOpenSearch,
  onOpenCustomModal,
  onOpenAbout,
  onOpenContact,
}) => {
  const { totalItemsCount, setIsCartOpen, favorites } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [personalizadosDropdownOpen, setPersonalizadosDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f3e5e1]/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-22">
          {/* Left: Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left group focus:outline-hidden"
              aria-label="Janley Store - Página Inicial"
            >
              <img
                src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
                alt="JANLEY STORE - Impressão 3D"
                className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-[15px] font-medium text-[#4a342f]">
            <button
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'inicio'
                  ? 'text-[#f43f7a] font-semibold'
                  : 'hover:text-[#f43f7a]'
              }`}
            >
              Início
            </button>

            <button
              onClick={() => {
                setActiveTab('loja');
                const el = document.getElementById('produtos-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`transition-colors cursor-pointer ${
                activeTab === 'loja'
                  ? 'text-[#f43f7a] font-semibold'
                  : 'hover:text-[#f43f7a]'
              }`}
            >
              Loja
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
                className="flex items-center gap-1 hover:text-[#f43f7a] transition-colors cursor-pointer py-2"
              >
                <span>Categorias</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#f43f7a]' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-[#fae5e2] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#8c6760] tracking-wider uppercase border-b border-[#fae5e2]">
                    Categorias 3D
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#4a342f] hover:bg-[#fef2f4] hover:text-[#f43f7a] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover border border-[#fae5e2]" />
                      <span>{cat.name}</span>
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
                className="flex items-center gap-1 hover:text-[#f43f7a] transition-colors cursor-pointer py-2"
              >
                <span>Personalizados</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${personalizadosDropdownOpen ? 'rotate-180 text-[#f43f7a]' : ''}`} />
              </button>

              {personalizadosDropdownOpen && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-[#fae5e2] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      onOpenCustomModal();
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#4a342f] hover:bg-[#fef2f4] hover:text-[#f43f7a] block transition-colors cursor-pointer"
                  >
                    <div className="font-medium">Criar Peça Sob Medida</div>
                    <div className="text-xs text-stone-500">Orçamento personalizado</div>
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory('personalizados');
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#4a342f] hover:bg-[#fef2f4] hover:text-[#f43f7a] block transition-colors cursor-pointer"
                  >
                    <div className="font-medium">Letreiros & Nomes</div>
                    <div className="text-xs text-stone-500">Decoração exclusiva</div>
                  </button>
                  <button
                    onClick={() => {
                      onSelectCategory('chaveiros');
                      setPersonalizadosDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#4a342f] hover:bg-[#fef2f4] hover:text-[#f43f7a] block transition-colors cursor-pointer"
                  >
                    <div className="font-medium">Chaveiros & Lembranças</div>
                    <div className="text-xs text-stone-500">Para eventos e marcas</div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAbout}
              className="hover:text-[#f43f7a] transition-colors cursor-pointer"
            >
              Sobre nós
            </button>

            <button
              onClick={onOpenContact}
              className="hover:text-[#f43f7a] transition-colors cursor-pointer"
            >
              Contacto
            </button>
          </nav>

          {/* Right: Actions (Search, User, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#4a342f] hover:text-[#f43f7a] hover:bg-[#fdf2f4] rounded-full transition-colors cursor-pointer"
              aria-label="Pesquisar produtos"
              title="Pesquisar catálogo"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* User Account / Profile */}
            <button
              onClick={onOpenContact}
              className="p-2 text-[#4a342f] hover:text-[#f43f7a] hover:bg-[#fdf2f4] rounded-full transition-colors cursor-pointer"
              aria-label="Área de Cliente"
              title="Área de Cliente / Contacto"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#4a342f] hover:text-[#f43f7a] hover:bg-[#fdf2f4] rounded-full transition-colors cursor-pointer group"
              aria-label={`Carrinho de compras com ${totalItemsCount} artigos`}
              title="Ver Carrinho"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8] group-hover:scale-105 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#f43f7a] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white">
                {totalItemsCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#4a342f] hover:text-[#f43f7a] rounded-lg transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#fae5e2] px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => {
              setActiveTab('inicio');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#f43f7a]"
          >
            Início
          </button>
          <button
            onClick={() => {
              setActiveTab('loja');
              setMobileMenuOpen(false);
              const el = document.getElementById('produtos-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a342f] hover:text-[#f43f7a]"
          >
            Loja
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('categorias-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a342f] hover:text-[#f43f7a]"
          >
            Categorias
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCustomModal();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a342f] hover:text-[#f43f7a]"
          >
            Personalizados
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a342f] hover:text-[#f43f7a]"
          >
            Sobre nós
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenContact();
            }}
            className="block w-full text-left py-2 font-medium text-base text-[#4a342f] hover:text-[#f43f7a]"
          >
            Contacto
          </button>
        </div>
      )}
    </header>
  );
};
