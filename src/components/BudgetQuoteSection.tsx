import React, { useState } from 'react';
import {
  Upload,
  MessageCircle,
  Sparkles,
  Check,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Send,
  Building2,
  Tag,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES, JANLEY_COLORS } from '../data/products';

interface BudgetQuoteSectionProps {
  onBackToShop?: () => void;
}

export const BudgetQuoteSection: React.FC<BudgetQuoteSectionProps> = ({ onBackToShop }) => {
  // Form state
  const [selectedCategory, setSelectedCategory] = useState('Personalizados');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(JANLEY_COLORS[0]); // Dourado default
  const [dimensions, setDimensions] = useState('Médio (10 a 20 cm)');
  const [material, setMaterial] = useState('PLA Ecológico Premium');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Suggested sample images that users can click if they don't have a photo on hand
  const sampleInspirations = [
    { name: 'Letreiro 3D', img: '/images/cat_personalizados.png', cat: 'Personalizados' },
    { name: 'Vaso Espiral', img: '/images/vaso_dourado_amarelo.png', cat: 'Decoração' },
    { name: 'Peça Bicolor', img: '/images/vaso_pink_gradiente_preto.png', cat: 'Decoração' },
    { name: 'Suporte Gaming', img: '/images/cat_gaming.png', cat: 'Gaming' },
    { name: 'Troféu Futebol', img: '/images/cat_futebol.jpg', cat: 'Futebol' },
    { name: 'Brinde Empresa', img: '/images/cat_empresas.jpg', cat: 'Empresas' },
  ];

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

  // Quantity presets with discount badges
  const quantityPresets = [
    { qty: 1, label: '1 un', discount: 'Preço base' },
    { qty: 5, label: '5 un', discount: '-5% desc.' },
    { qty: 25, label: '25 un', discount: '-12% desc.' },
    { qty: 50, label: '50 un', discount: '-18% desc.' },
    { qty: 100, label: '100+ un', discount: '-25% corporativo' },
  ];

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const photoNotice = uploadedFileName
      ? `(Imagem carregada no site: ${uploadedFileName} - a enviar em anexo)`
      : '(Sem imagem prévia / ideia descrita)';

    const text = `🌸 *PEDIDO DE ORÇAMENTO 3D - JANLEY STORE* 🌸

• *Nome:* ${clientName || 'Cliente'}
• *Telemóvel:* ${clientPhone || 'A conversar no WhatsApp'}
• *Categoria:* ${selectedCategory}
• *Quantidade Pretendida:* ${quantity} unidade(s)
• *Cor / Filamento:* ${selectedColor.name}
• *Dimensões:* ${dimensions}
• *Material:* ${material}
• *Imagem de Exemplo:* ${photoNotice}
• *Detalhes / Ideia:* ${description || 'Orçamento padrão'}

_Enviado através da Aba de Orçamento do website Janley Store_`;

    const url = `https://wa.me/351935742686?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentSuccess(true);
  };

  return (
    <section id="orcamento-section" className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      {/* Header section with aesthetic atelier style */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f43f7a] uppercase tracking-widest bg-[#fdedea] px-3.5 py-1 rounded-full border border-[#fcdcd4]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier de Fabrico Aditivo 3D</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#33221e] tracking-tight">
          Pedir Orçamento Personalizado
        </h1>
        <div className="w-14 h-0.5 bg-[#f43f7a] mx-auto rounded-full mt-2" />
        <p className="text-sm sm:text-base text-[#6d4f48] pt-2 leading-relaxed">
          Transforma qualquer ideia, foto de inspiração ou ficheiro 3D em realidade.
          Preenche os detalhes e recebe uma proposta rápida e sem compromisso via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 Columns */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#fae2dc] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
          <form onSubmit={handleSendWhatsApp} className="space-y-6">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-2">
                1. Escolhe a Categoria da Peça
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-2xl bg-[#faf6f4] border border-[#fae4e1] custom-scroll">
                {CATEGORIES.map((cat) => {
                  const isSel = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSel
                          ? 'bg-[#f43f7a] text-white shadow-xs'
                          : 'bg-white text-[#4a342f] border border-[#ebd8d3] hover:border-[#f43f7a]'
                      }`}
                    >
                      <img src={cat.image} alt={cat.name} className="w-4 h-4 rounded-full object-cover" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Image Upload / Example Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider">
                  2. Imagem de Exemplo / Ficheiro
                </label>
                <span className="text-[11px] text-[#8c6760]">Opcional</span>
              </div>

              {/* Upload Box */}
              <div className="relative border-2 border-dashed border-[#e6d0ca] hover:border-[#f43f7a] rounded-2xl p-4 sm:p-5 text-center bg-[#fdfaf8] transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {uploadedImage ? (
                  <div className="flex items-center gap-4 text-left">
                    <img
                      src={uploadedImage}
                      alt="Exemplo carregado"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#fae2dc] shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#15803d] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Imagem Carregada!
                      </span>
                      <p className="text-xs text-[#4a342f] font-medium truncate mt-0.5">
                        {uploadedFileName || 'foto_exemplo.png'}
                      </p>
                      <span className="text-[11px] text-[#8c6760] block mt-0.5">
                        Clica para substituir por outra foto
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                        setUploadedFileName(null);
                      }}
                      className="p-1.5 rounded-full hover:bg-[#fdedea] text-[#8c6760] hover:text-[#f43f7a] cursor-pointer z-20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-11 h-11 rounded-2xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#33221e]">
                        Arrasta ou clica para carregar uma foto / desenho da tua ideia
                      </p>
                      <p className="text-[11px] text-[#8c6760] mt-0.5">
                        Formatos aceites: JPG, PNG, WEBP ou ficheiros STL/OBJ
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick inspiration chips */}
              <div className="pt-2">
                <span className="text-[11px] text-[#8c6760] block mb-1.5">
                  Ou escolhe uma inspiração do nosso atelier:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleInspirations.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setUploadedImage(item.img);
                        setUploadedFileName(item.name);
                        setSelectedCategory(item.cat);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs bg-[#faf4f2] hover:bg-[#fdedea] text-[#4a342f] hover:text-[#f43f7a] px-2.5 py-1 rounded-lg border border-[#ebd8d3] transition-colors cursor-pointer"
                    >
                      <img src={item.img} alt={item.name} className="w-4 h-4 rounded-md object-cover" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Quantity with interactive increments & volume discounts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider">
                  3. Quantidade Pretendida
                </label>
                <span className="text-xs text-[#f43f7a] font-bold">
                  {quantity >= 100
                    ? '25% Desconto para Grandes Lotes'
                    : quantity >= 50
                    ? '18% Desconto de Volume'
                    : quantity >= 25
                    ? '12% Desconto de Lote'
                    : quantity >= 5
                    ? '5% Desconto'
                    : 'Peça Sob Medida'}
                </span>
              </div>

              {/* Quantity Preset Buttons */}
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {quantityPresets.map((preset) => (
                  <button
                    key={preset.qty}
                    type="button"
                    onClick={() => setQuantity(preset.qty)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                      quantity === preset.qty
                        ? 'bg-[#f43f7a] text-white border-[#f43f7a] shadow-xs'
                        : 'bg-[#faf4f2] border-[#fae2dc] hover:border-[#f43f7a] text-[#33221e]'
                    }`}
                  >
                    <div className="font-bold text-xs">{preset.label}</div>
                    <div className="text-[9.5px] opacity-80 leading-tight truncate">{preset.discount}</div>
                  </button>
                ))}
              </div>

              {/* Stepper Input */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#d8c2bd] rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-base hover:bg-[#fdedea] text-[#33221e] cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={5000}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center font-bold text-sm text-[#33221e] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-base hover:bg-[#fdedea] text-[#33221e] cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#735953]">
                  unidade(s) para fabrico em Guimarães
                </span>
              </div>
            </div>

            {/* 4. Color & Material Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-1.5">
                  4. Cor do Filamento: <span className="text-[#f43f7a]">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-[#faf6f4] border border-[#fae4e1] max-h-24 overflow-y-auto custom-scroll">
                  {JANLEY_COLORS.map((col) => {
                    const isSel = selectedColor.name === col.name;
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        title={col.name}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative flex items-center justify-center ${
                          isSel
                            ? 'ring-2 ring-[#f43f7a] ring-offset-1 scale-110 border-white shadow-xs z-10'
                            : 'border-black/15 hover:scale-108'
                        }`}
                        style={{ background: col.gradient || col.hex }}
                      >
                        {isSel && (
                          <Check className={`w-3 h-3 ${col.hex === '#ffffff' || col.isMarble ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-1.5">
                  5. Dimensão Estimada
                </label>
                <select
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#33221e] outline-hidden cursor-pointer"
                >
                  <option>Pequeno (até 10 cm)</option>
                  <option>Médio (10 a 20 cm)</option>
                  <option>Grande (20 a 30 cm)</option>
                  <option>Extra Grande (+30 cm)</option>
                  <option>Tamanho Personalizado (especificar nas notas)</option>
                </select>
              </div>
            </div>

            {/* 5. Description / Details */}
            <div>
              <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-1.5">
                6. Descreve a tua ideia (Nomes, frases, logótipos ou detalhes especiais)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Quero um suporte de secretária com o logótipo da minha empresa gravado na frente em dourado..."
                className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl p-3 text-sm text-[#33221e] outline-hidden placeholder:text-[#9e807a]"
              />
            </div>

            {/* 6. Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-1">
                  O teu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome e apelido"
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33221e] uppercase tracking-wider mb-1">
                  Telemóvel / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+351 9xx xxx xxx"
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Orçamento para o WhatsApp (+351 935 742 686)</span>
              </button>
              <p className="text-[11px] text-center text-[#8c6760] mt-2">
                Resposta garantida pela equipa da Janley Store em menos de 24 horas úteis.
              </p>
            </div>
          </form>
        </div>

        {/* Right Preview Card "Live Aesthetic Summary": 5 Columns */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-gradient-to-br from-[#fff7f5] via-[#fdf5f3] to-[#faeee9] rounded-3xl p-6 sm:p-7 border border-[#fae2dc] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#fae2dc]">
              <div>
                <span className="text-[11px] font-bold text-[#f43f7a] uppercase tracking-wider">
                  Resumo do Pedido
                </span>
                <h3 className="font-serif-title text-xl font-bold text-[#33221e]">
                  Orçamento Janley 3D
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#f43f7a]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Preview Image Box */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#fae2dc] shadow-inner flex items-center justify-center">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Pré-visualização do orçamento"
                  className="w-full h-full object-cover animate-fadeIn"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <p className="text-xs text-[#735953] font-medium">
                    A imagem da tua ideia aparecerá aqui
                  </p>
                </div>
              )}

              {/* Color swatch floating tag */}
              <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-[#fae2dc] flex items-center gap-1.5 text-xs font-semibold text-[#33221e]">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15"
                  style={{ background: selectedColor.gradient || selectedColor.hex }}
                />
                <span>{selectedColor.name}</span>
              </div>
            </div>

            {/* Specs Summary List */}
            <div className="space-y-2.5 text-xs text-[#4a342f] bg-white/80 p-4 rounded-2xl border border-[#fae4e1]">
              <div className="flex justify-between items-center py-1 border-b border-[#fae4e1]/60">
                <span className="text-[#8c6760]">Categoria:</span>
                <strong className="text-[#33221e]">{selectedCategory}</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#fae4e1]/60">
                <span className="text-[#8c6760]">Quantidade:</span>
                <strong className="text-[#f43f7a] text-sm font-bold">{quantity} unidade(s)</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#fae4e1]/60">
                <span className="text-[#8c6760]">Dimensões:</span>
                <span className="font-semibold text-[#33221e]">{dimensions}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#8c6760]">Fabrico:</span>
                <span className="font-semibold text-[#15803d] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Guimarães, Portugal
                </span>
              </div>
            </div>

            {/* Atelier Perks */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#735953]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f43f7a]" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f43f7a]" />
                <span>Descontos de lote</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f43f7a]" />
                <span>Ficheiros STL/CAD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#f43f7a]" />
                <span>Envios para todo o país</span>
              </div>
            </div>

            {sentSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200 animate-fadeIn">
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
