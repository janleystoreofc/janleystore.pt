import React, { useState } from 'react';
import {
  Upload,
  MessageCircle,
  Check,
  CheckCircle2,
  X,
  ImageIcon
} from 'lucide-react';
import { CATEGORIES, JANLEY_COLORS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

interface BudgetQuoteSectionProps {
  onBackToShop?: () => void;
}

export const BudgetQuoteSection: React.FC<BudgetQuoteSectionProps> = ({ onBackToShop }) => {
  const { t } = useLanguage();
  // Form state
  const [selectedCategory, setSelectedCategory] = useState('Personalizados');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(JANLEY_COLORS[0]); // Dourado
  const [dimensions, setDimensions] = useState('Médio (10 a 20 cm)');
  const [material, setMaterial] = useState('PLA Ecológico Premium');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Handle image upload from file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const photoNotice = uploadedFileName
      ? `(Imagem: ${uploadedFileName} - a enviar em anexo)`
      : '(Sem imagem prévia / ideia descrita)';

    const text = `🌻 *PEDIDO DE ORÇAMENTO 3D - JANLEY STORE* 🌻

• *Nome:* ${clientName || 'Cliente'}
• *Telemóvel:* ${clientPhone || 'A conversar no WhatsApp'}
• *Categoria:* ${selectedCategory}
• *Quantidade:* ${quantity} unidade(s)
• *Cor / Filamento:* ${selectedColor.name}
• *Dimensões:* ${dimensions}
• *Material:* ${material}
• *Imagem:* ${photoNotice}
• *Detalhes:* ${description || 'Orçamento padrão'}

_Enviado através do site oficial Janley Store (Guimarães, Portugal)_`;

    const url = `https://wa.me/351935742686?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentSuccess(true);
  };

  return (
    <section id="orcamento-section" className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Header section with compact sunflower aesthetic */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-2">
        <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2b170c] tracking-tight">
          {t('quote_title')}
        </h2>
        <div className="w-14 h-1 bg-[#d97706] mx-auto rounded-full mt-1.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Compact Form: 7 Columns */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-[#ebdcd3] shadow-[0_4px_24px_rgba(43,23,12,0.04)] space-y-4">
          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-[#2b170c] uppercase tracking-wider mb-1.5">
                {t('quote_step1')}
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-2xl bg-[#fbf5f2] border border-[#ebdcd3] custom-scroll">
                {CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat.name;
                  const raw = t(`cat_${cat.id}`);
                  const catName = (!raw || raw.startsWith('cat_')) ? cat.name : raw;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-[#d97706] text-white shadow-xs font-bold'
                          : 'bg-white text-[#2b170c] border border-[#ebdcd3] hover:border-[#d97706]'
                      }`}
                    >
                      <img src={cat.image} alt={catName} className="w-3.5 h-3.5 rounded-full object-cover" />
                      <span>{catName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Image Upload */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider">
                  {t('quote_step2')}
                </label>
              </div>

              <div className="relative border-2 border-dashed border-[#fed7aa] hover:border-[#d97706] rounded-2xl p-3 sm:p-4 text-center bg-[#fffdfa] transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {uploadedImage ? (
                  <div className="flex items-center gap-3 text-left">
                    <img
                      src={uploadedImage}
                      alt="Exemplo carregado"
                      className="w-14 h-14 object-cover rounded-xl border border-[#fed7aa] shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#008f51] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Foto Carregada!
                      </span>
                      <p className="text-xs text-[#3d2314] font-medium truncate">
                        {uploadedFileName || 'foto_exemplo.png'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        setUploadedFileName(null);
                      }}
                      className="p-1 rounded-full hover:bg-[#fef8ed] text-[#78350f] hover:text-[#d97706] cursor-pointer z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-1 text-xs text-[#5c3a1e]">
                    <Upload className="w-4 h-4 text-[#d97706]" />
                    <span className="font-semibold">{t('quote_upload_hint')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Quantity & Color in one compact row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                  {t('quote_step3')} <span className="text-[#d97706]">{quantity} un</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 5, 25, 50, 100].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantity(q)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        quantity === q
                          ? 'bg-[#d97706] text-white shadow-2xs'
                          : 'bg-[#fef8ed] text-[#4a2e18] hover:bg-[#fde68a]/50 border border-[#fed7aa]'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                  {t('quote_step4')} <span className="text-[#d97706]">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#fef8ed] rounded-xl border border-[#fed7aa] max-h-20 overflow-y-auto custom-scroll">
                  {JANLEY_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor.name === c.name
                          ? 'ring-1.5 ring-[#d97706] ring-offset-1 scale-110 border-white'
                          : 'border-black/15 hover:scale-105'
                      }`}
                      style={{ background: c.gradient || c.hex }}
                    >
                      {selectedColor.name === c.name && (
                        <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Client Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3d2314] mb-0.5">{t('quote_client_name')}</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Ana Silva"
                  className="w-full bg-[#fef8ed]/60 border border-[#fed7aa] focus:border-[#d97706] focus:bg-white rounded-xl px-3 py-1.5 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#3d2314] mb-0.5">{t('quote_client_phone')}</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+351 912 345 678"
                  className="w-full bg-[#fef8ed]/60 border border-[#fed7aa] focus:border-[#d97706] focus:bg-white rounded-xl px-3 py-1.5 text-xs outline-hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer active:scale-98"
              >
                <span>{t('enviar_orcamento')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Card: 5 Columns */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-[0_4px_20px_rgba(43,23,12,0.04)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd3]">
              <span className="font-bold text-xs text-[#2b170c] uppercase tracking-wider">
                Resumo do Pedido 3D
              </span>
              <span className="text-[10px] font-bold text-[#2b170c] bg-[#fcf5f1] px-2.5 py-0.5 rounded-full border border-[#ebdcd3]">
                Guimarães, PT 🇵🇹
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-[#5c3a1e]">
              <div className="flex justify-between">
                <span>Categoria:</span>
                <strong className="text-[#3d2314]">{selectedCategory}</strong>
              </div>
              <div className="flex justify-between">
                <span>Quantidade:</span>
                <strong className="text-[#d97706]">{quantity} unidade(s)</strong>
              </div>
              <div className="flex justify-between">
                <span>Cor Filamento:</span>
                <strong className="text-[#3d2314]">{selectedColor.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Entrega:</span>
                <span className="font-semibold text-[#008f51]">CTT, Uber ou Recolha</span>
              </div>
            </div>

            {sentSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>WhatsApp aberto com sucesso! Envia a mensagem com os detalhes.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
