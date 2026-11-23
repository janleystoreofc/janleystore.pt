import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Sparkles, Box, Camera, CheckCircle2 } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useCart } from '../context/CartContext';
import {
  getProductImageForColor,
  UNDER_5_PACK_QUANTITIES,
  isUnder5PackProduct,
  isKeychainProduct,
  isValidPackQuantity,
  calculateProductPricing,
} from '../data/products';
import {
  DbProductReview,
  getProductReviews,
  submitProductReview,
  compressReviewPhoto,
} from '../lib/supabase';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();

  const isUnder5Pack = Boolean(product && isUnder5PackProduct(product));
  const isKeychain = Boolean(product && !isUnder5Pack && isKeychainProduct(product));

  const getInitialQty = (prod: Product | null) => {
    if (!prod) return 1;
    if (isUnder5PackProduct(prod)) return 3;
    if (isKeychainProduct(prod)) return 5;
    return 1;
  };

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Dourado', hex: '#d9a766' }
  );
  const [quantity, setQuantity] = useState(() => getInitialQty(product));
  const [customQtyInput, setCustomQtyInput] = useState('');
  const [customText, setCustomText] = useState('');
  const [activeTab, setActiveTab] = useState<'detalhes' | 'avaliacoes'>('detalhes');

  // Post-purchase review state
  const [reviews, setReviews] = useState<DbProductReview[]>([]);
  const [reviewAuthor, setReviewAuthor] = useState(() => localStorage.getItem('janley_client_name') || '');
  const [reviewOrder, setReviewOrder] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [zoomedReviewPhoto, setZoomedReviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setQuantity(getInitialQty(product));
      setCustomQtyInput('');
      setCustomText('');
      setActiveTab('detalhes');
      setReviewSubmitted(false);
      setZoomedReviewPhoto(null);
      getProductReviews(product.id).then((res) => setReviews(res.reviews));
    }
  }, [product]);

  if (!product) return null;

  const totalDisplayedReviews = product.reviewsCount + reviews.length;
  const favorited = isFavorite(product.id);
  const isQuoteOnly = product.price <= 0;
  const pricing = calculateProductPricing(product, quantity);
  const totalPrice = pricing.lineTotal;

  const parsedCustomQty = customQtyInput.trim() === '' ? null : Number(customQtyInput.trim());
  const isCustomQtyInvalid =
    isUnder5Pack &&
    parsedCustomQty !== null &&
    (!Number.isInteger(parsedCustomQty) || parsedCustomQty <= 50);

  const canAddUnder5 =
    !isUnder5Pack || (!isCustomQtyInvalid && isValidPackQuantity(product, quantity));

  const allowCustomName = Boolean(product.allowCustomName);

  const whatsappQuoteMessage = encodeURIComponent(
    `Olá Janley Store! Gostaria de consultar o preço e disponibilidade do seguinte artigo:\n` +
      `• Produto: ${product.name}\n` +
      `• Categoria: ${product.category}\n` +
      `• Cor escolhida: ${selectedColor.name}\n` +
      `• Quantidade: ${quantity} un` +
      (allowCustomName && customText.trim()
        ? `\n• Nome / Personalização: ${customText.trim()}`
        : '')
  );
  const whatsappQuoteUrl = `https://wa.me/351935742686?text=${whatsappQuoteMessage}`;

  const handleAddToCart = () => {
    addToCart(
      product,
      selectedColor,
      quantity,
      allowCustomName && customText.trim() ? customText.trim() : undefined
    );
    onClose();
  };

  const handleReviewPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressReviewPhoto(file);
      setReviewPhoto(compressed);
    } catch {
      // ignore invalid image
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const saved = await submitProductReview({
        product_id: product.id,
        product_name: product.name,
        author_name: reviewAuthor.trim() || 'Cliente Verificado',
        order_number: reviewOrder.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        photo_url: reviewPhoto,
      });
      setReviews((prev) => [saved, ...prev]);
      setReviewComment('');
      setReviewOrder('');
      setReviewPhoto('');
      setReviewRating(5);
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 5000);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#fed7aa] my-8 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#78350f] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image */}
            <div className="md:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-[#fffdfa] border border-[#fed7aa]">
              <img
                src={product ? getProductImageForColor(product, selectedColor) : '/images/prod_suporte_telemovel.png'}
                alt={`${product?.name || ''} em ${selectedColor.name}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Special Tag for Gradient / Marble / Yellow Gold */}
              {(selectedColor.isGradient || selectedColor.isMarble) && (
                <span className="absolute bottom-3 left-3 bg-[#2b180d]/85 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {selectedColor.name}
                </span>
              )}

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorited
                      ? 'fill-[#d97706] text-[#d97706]'
                      : 'text-[#d97706] stroke-[2]'
                  }`}
                />
              </button>
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="md:col-span-6 space-y-4">
              {/* Minimalist Tab Switch: Detalhes vs Avaliação Pós-Compra */}
              <div className="inline-flex items-center p-1 rounded-xl bg-[#faf5f2] border border-[#fae2dc] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('detalhes')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'detalhes'
                      ? 'bg-white text-[#3d2314] shadow-2xs'
                      : 'text-[#78350f] hover:text-[#3d2314]'
                  }`}
                >
                  Detalhes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('avaliacoes')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'avaliacoes'
                      ? 'bg-white text-[#3d2314] shadow-2xs'
                      : 'text-[#78350f] hover:text-[#3d2314]'
                  }`}
                >
                  <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                  <span>Pós-Compra ({totalDisplayedReviews})</span>
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider bg-[#fef3c7] px-2.5 py-1 rounded-full border border-[#fde68a]">
                  {product.category}
                </span>

                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3d2314] mt-2">
                  {product.name}
                </h3>

                {/* Rating & Reviews */}
                <button
                  type="button"
                  onClick={() => setActiveTab('avaliacoes')}
                  className="flex items-center gap-2 mt-1.5 cursor-pointer group"
                >
                  <div className="flex items-center text-[#f59e0b]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          totalDisplayedReviews > 0
                            ? 'fill-[#f59e0b] text-[#f59e0b]'
                            : 'text-[#d8c2bd]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#78350f] font-semibold group-hover:text-[#d97706] transition-colors">
                    {totalDisplayedReviews > 0
                      ? `${product.rating} (${totalDisplayedReviews} ${totalDisplayedReviews === 1 ? 'avaliação' : 'avaliações'})`
                      : '0 avaliações · Avaliar compra'}
                  </span>
                </button>

                {activeTab === 'detalhes' && (
                  <>
                {/* Price or Quote Only */}
                <div className="text-2xl font-bold text-[#3d2314] mt-3 space-y-1">
                  {isQuoteOnly ? (
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-xl sm:text-2xl text-[#b45309]">Sob Consulta</span>
                      <span className="text-xs text-[#78350f] font-medium">
                        (Valor orçamentado consoante cor, quantidade e medidas)
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span>€ {totalPrice.toFixed(2).replace('.', ',')}</span>
                        {pricing.lineSavings > 0 && (
                          <span className="text-sm font-medium text-[#9c7b6d] line-through">
                            € {(product.price * quantity).toFixed(2).replace('.', ',')}
                          </span>
                        )}
                        {quantity > 1 && (
                          <span className="text-xs text-[#78350f] font-medium">
                            ({quantity} un • € {pricing.unitFinalPrice.toFixed(2).replace('.', ',')}/un)
                          </span>
                        )}
                      </div>
                      {pricing.lineSavings > 0 && (
                        <div className="text-xs font-bold text-[#008f51]">
                          Desconto automático ({pricing.discountLabel}): poupas € {pricing.lineSavings.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                    </>
                  )}
                </div>
                  </>
                )}
              </div>

              {activeTab === 'avaliacoes' ? (
                <div className="space-y-4 pt-1">
                  {/* Minimalist Post-Purchase Submission Form */}
                  <form
                    onSubmit={handleSubmitReview}
                    className="p-4 rounded-2xl bg-[#faf7f5] border border-[#fae2dc] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3d2314]">
                        Recebeste a peça? Deixa a tua avaliação
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                            aria-label={`${star} estrelas`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= reviewRating
                                  ? 'fill-[#f59e0b] text-[#f59e0b]'
                                  : 'text-[#d8c2bd]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="O teu nome"
                        className="w-full bg-white border border-[#e5d2cd] focus:border-[#d97706] rounded-xl px-3 py-1.5 text-xs outline-hidden"
                      />
                      <input
                        type="text"
                        value={reviewOrder}
                        onChange={(e) => setReviewOrder(e.target.value)}
                        placeholder="N.º Encomenda (opcional)"
                        className="w-full bg-white border border-[#e5d2cd] focus:border-[#d97706] rounded-xl px-3 py-1.5 text-xs outline-hidden"
                      />
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Como chegou a peça? Partilha a tua experiência..."
                      className="w-full bg-white border border-[#e5d2cd] focus:border-[#d97706] rounded-xl p-2.5 text-xs outline-hidden resize-none"
                    />

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e5d2cd] hover:border-[#d97706] text-[11px] font-semibold text-[#5c3a1e] cursor-pointer transition-colors">
                          <Camera className="w-3.5 h-3.5 text-[#d97706]" />
                          <span>{reviewPhoto ? 'Trocar foto' : 'Foto real'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleReviewPhotoChange}
                            className="hidden"
                          />
                        </label>
                        {reviewPhoto && (
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#fed7aa]">
                            <img src={reviewPhoto} alt="Pré-visualização" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setReviewPhoto('')}
                              className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-[#3d2314] hover:bg-[#d97706] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {submittingReview ? 'A enviar...' : 'Publicar'}
                      </button>
                    </div>

                    {reviewSubmitted && (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Obrigado! A tua avaliação pós-compra foi publicada.</span>
                      </div>
                    )}
                  </form>

                  {/* Minimalist Real Photo Reviews List */}
                  {reviews.length > 0 && (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scroll">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3 rounded-2xl bg-white border border-[#f2e2dd] flex items-start gap-3"
                        >
                          {rev.photo_url && (
                            <button
                              type="button"
                              onClick={() => setZoomedReviewPhoto(rev.photo_url || null)}
                              className="w-14 h-14 rounded-xl overflow-hidden border border-[#fae2dc] shrink-0 cursor-zoom-in"
                            >
                              <img
                                src={rev.photo_url}
                                alt={`Foto real por ${rev.author_name}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          )}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-[#3d2314] truncate">
                                {rev.author_name}
                              </span>
                              <div className="flex items-center text-[#f59e0b] shrink-0">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < rev.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#e5d2cd]'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-[#5c3a1e] leading-relaxed break-words">
                              {rev.comment}
                            </p>
                            <div className="text-[10px] text-[#8c6760]">
                              {rev.order_number ? `Compra #${rev.order_number} • ` : ''}
                              {new Date(rev.created_at).toLocaleDateString('pt-PT')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>

              {product.description && (
                <div className="text-sm text-[#5c3a1e] leading-relaxed whitespace-pre-wrap break-words">
                  {product.description}
                </div>
              )}

              {/* Color Selection */}
              <div className="pt-2 border-t border-[#fed7aa]/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#3d2314]">
                    Cor do Filamento: <span className="font-bold text-[#d97706]">{selectedColor.name}</span>
                  </label>
                  <span className="text-[11px] text-[#78350f] font-medium">
                    {product.colors.length} cores
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 max-h-24 overflow-y-auto p-1.5 bg-[#fef8ed] rounded-xl border border-[#fed7aa] custom-scroll">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center relative flex-shrink-0 ${
                          isSelected
                            ? 'ring-2 ring-[#d97706] ring-offset-2 scale-110 border-white shadow-xs z-10'
                            : 'border-black/15 hover:scale-108 hover:border-[#d97706]/60'
                        }`}
                        style={{ background: color.gradient || color.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === '#fdf9f4' || color.hex === '#ffffff' || color.isMarble ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Personalization Tab — Shown ONLY when admin marks the product as customizable */}
              {allowCustomName && (
                <div className="p-3.5 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] space-y-1.5">
                  <label className="block text-xs font-bold text-[#3d2314]">
                    Personalizar com Nome / Iniciais (Opcional):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Escreve o nome ou iniciais (Ex: Sofia, Lucas, M&J)"
                    maxLength={80}
                    className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden"
                  />
                  <p className="text-[11px] text-[#78350f]">
                    Este produto permite gravar ou modelar o nome em 3D.
                  </p>
                </div>
              )}

              {/* Quantity Selection: Under €5 Packs (3..50 or >50), Keychains >=€5, or Standard */}
              <div className="pt-2 border-t border-[#fed7aa]/60">
                {isUnder5Pack ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-[#3d2314]">
                        Escolhe um Pack (mínimo 3 un):
                      </span>
                      {pricing.discountLabel && (
                        <span className="text-xs font-bold text-[#008f51]">
                          Desconto aplicado: {pricing.discountLabel}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {UNDER_5_PACK_QUANTITIES.map((num) => {
                        const isQSelected = customQtyInput.trim() === '' && quantity === num;
                        const packPricing = calculateProductPricing(product, num);
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              setCustomQtyInput('');
                              setQuantity(num);
                            }}
                            className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                              isQSelected
                                ? 'bg-[#d97706] text-white shadow-xs font-extrabold'
                                : 'bg-[#fef8ed] text-[#4a2e18] hover:bg-[#fde68a]/50 border border-[#fed7aa]'
                            }`}
                          >
                            <div>{num} un</div>
                            {packPricing.discountLabel && (
                              <div
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  isQSelected ? 'text-white/95' : 'text-[#008f51]'
                                }`}
                              >
                                {packPricing.discountLabel}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom quantity above 50 */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[#5c3a1e]">
                        Precisas de mais? Digita a quantidade acima de 50 unidades:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={51}
                          step={1}
                          value={customQtyInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomQtyInput(val);
                            const n = Number(val);
                            if (val.trim() !== '' && Number.isInteger(n) && n > 50) {
                              setQuantity(n);
                            } else if (val.trim() === '') {
                              if (!UNDER_5_PACK_QUANTITIES.includes(quantity as any)) {
                                setQuantity(50);
                              }
                            }
                          }}
                          placeholder="Ex: 60, 75, 100, 150..."
                          className={`flex-1 bg-[#faf7f5] border rounded-xl px-3 py-2 text-xs font-semibold outline-hidden ${
                            isCustomQtyInvalid
                              ? 'border-red-400 focus:border-red-500 text-red-700'
                              : 'border-[#d8c2bd] focus:border-[#d97706] text-[#3d2314]'
                          }`}
                        />
                        {customQtyInput.trim() !== '' && !isCustomQtyInvalid && (
                          <span className="text-[11px] font-bold text-[#008f51] whitespace-nowrap">
                            {pricing.discountLabel}
                          </span>
                        )}
                      </div>
                      {isCustomQtyInvalid && (
                        <p className="text-[11px] text-red-600 font-medium">
                          Para quantidades até 50 unidades, escolhe um dos packs acima. Aqui digita um número acima de 50 (ex: 55, 80, 100).
                        </p>
                      )}
                    </div>
                  </div>
                ) : isKeychain ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3d2314]">Quantidade de Chaveiros:</span>
                      {!isQuoteOnly && (
                        <span className="text-xs font-bold text-[#008f51]">
                          {quantity >= 100 ? '-25% Desc. Especial' : quantity >= 50 ? '-20% Desc.' : quantity >= 30 ? '-15% Desc.' : quantity >= 10 ? '-10% Desc.' : '-5% Pack'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[5, 10, 30, 50, 100].map((num) => {
                        const isQSelected = quantity === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setQuantity(num)}
                            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                              isQSelected
                                ? 'bg-[#d97706] text-white shadow-xs font-extrabold'
                                : 'bg-[#fef8ed] text-[#4a2e18] hover:bg-[#fde68a]/50 border border-[#fed7aa]'
                            }`}
                          >
                            <div>{num} un</div>
                            <div className="text-[9px] font-normal opacity-85">
                              {num === 5 ? 'Lembrança' : num === 10 ? 'Família' : num === 30 ? 'Festa' : num === 50 ? 'Evento' : 'Empresas'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-[#3d2314]">Quantidade:</label>
                    <div className="flex items-center border border-[#fed7aa] rounded-xl overflow-hidden bg-[#fef8ed]">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-9 h-10 flex items-center justify-center text-[#4a2e18] hover:bg-[#fde68a]/60 transition-colors cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-[#3d2314]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-9 h-10 flex items-center justify-center text-[#4a2e18] hover:bg-[#fde68a]/60 transition-colors cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                {isQuoteOnly ? (
                  <a
                    href={whatsappQuoteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                    </svg>
                    <span>Consultar Preço por WhatsApp</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled={!canAddUnder5}
                    onClick={handleAddToCart}
                    className="w-full bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                    <span>Adicionar ao Carrinho • € {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </button>
                )}
              </div>

              {/* Specs bullet points */}
              <div className="pt-3 border-t border-[#fed7aa]/60 text-xs text-[#78350f] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Dimensões: <strong>{product.dimensions || 'Sob medida'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Material: <strong>{product.material || 'PLA Ecológico de Alta Precisão'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Fabricado artesanalmente em <strong>Guimarães, Braga - Portugal 🇵🇹</strong></span>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Lightbox for Customer Real Photo */}
      {zoomedReviewPhoto && (
        <div
          onClick={() => setZoomedReviewPhoto(null)}
          className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={zoomedReviewPhoto}
            alt="Foto real enviada pelo cliente"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
