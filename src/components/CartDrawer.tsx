import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
    freeShippingThreshold,
    remainingForFreeShipping,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!inputCoupon.trim()) return;

    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess('Cupão aplicado com sucesso!');
      setInputCoupon('');
    } else {
      setCouponError('Cupão inválido. Experimenta "JANLEY10" ou "GUIMARAES".');
    }
  };

  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#f7e0dc] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#fae6e3] flex items-center justify-between bg-[#fffaf9]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fdeef0] text-[#f43f7a] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#33221e]">
                  O Teu Carrinho
                </h2>
                <p className="text-xs text-[#7d605a]">
                  {items.length === 0
                    ? '0 artigos'
                    : `${items.reduce((acc, i) => acc + i.quantity, 0)} ${
                        items.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'artigo' : 'artigos'
                      } adicionados`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {items.length > 0 && (
            <div className="px-5 py-3.5 bg-[#fef5f4] border-b border-[#fbdad4] text-xs">
              <div className="flex items-center justify-between mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-[#5e433d]">
                  <Truck className="w-4 h-4 text-[#f43f7a]" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Faltam <strong className="text-[#f43f7a]">€ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para envio grátis em Portugal!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Parabéns! Tens Envio Grátis para Portugal!
                    </span>
                  )}
                </span>
                <span className="text-[#8c6760] font-semibold">{shippingProgress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#fae1dc] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#f43f7a] h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#fdedea] flex items-center justify-center text-[#f43f7a]">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#33221e]">
                    O teu carrinho está vazio
                  </h3>
                  <p className="text-xs text-[#7d605a] max-w-xs">
                    Descobre os nossos suportes, vasos decorativos e peças personalizadas feitas em impressão 3D!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Explorar Loja
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-[#fae5e2] bg-[#fffdfd] hover:border-[#fcd7df] transition-colors shadow-2xs"
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#faf4f2] flex-shrink-0 border border-[#fae4e1]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#33221e] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9e807a] hover:text-red-500 transition-colors p-1"
                          title="Remover artigo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Color Tag */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#735953]">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="truncate">{item.selectedColor.name}</span>
                      </div>

                      {item.customText && (
                        <div className="text-[11px] text-[#f43f7a] font-medium mt-0.5 truncate">
                          Personalização: "{item.customText}"
                        </div>
                      )}
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#d8c2bd] rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#33221e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#4a342f] hover:bg-[#fdedea] transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#33221e]">
                          € {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-[#8c6760]">
                            € {item.product.price.toFixed(2).replace('.', ',')} cada
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculation & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#fae6e3] bg-[#fffaf9] space-y-3.5">
              {/* Coupon Code Input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cupão <strong>{couponCode}</strong> aplicado!</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-red-600 text-[11px] underline font-semibold ml-2"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tens um cupão? (Ex: JANLEY10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 bg-white border border-[#d8c2bd] focus:border-[#f43f7a] rounded-lg px-3 py-1.5 text-xs text-[#33221e] placeholder:text-[#9e807a] outline-hidden uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-[#33221e] hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6e514b] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#33221e]">
                    € {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto ({couponCode})</span>
                    <span>- € {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Envio para Portugal</span>
                  <span className="font-semibold text-[#33221e]">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100/70 px-1.5 py-0.5 rounded text-[11px]">
                        GRÁTIS
                      </span>
                    ) : (
                      `€ ${shipping.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>

                <div className="border-t border-[#fae2dc] pt-2 mt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#33221e]">Total da Encomenda</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-[#f43f7a]">
                      € {total.toFixed(2).replace('.', ',')}
                    </span>
                    <div className="text-[10px] text-[#8c6760]">IVA incluído</div>
                  </div>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>FINALIZAR ENCOMENDA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/351935742686?text=${encodeURIComponent(
                    `Olá Janley Store! Gostaria de encomendar os seguintes artigos:\n${items
                      .map(
                        (i) =>
                          `- ${i.quantity}x ${i.product.name} (Cor: ${i.selectedColor.name}) = €${(
                            i.product.price * i.quantity
                          ).toFixed(2)}`
                      )
                      .join('\n')}\n\nTotal estimado: €${total.toFixed(2)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs tracking-wider uppercase py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                  </svg>
                  <span>ENVIAR PEDIDO POR WHATSAPP</span>
                </a>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-[#9c7d76] hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Esvaziar carrinho
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-[11px] text-[#f43f7a] font-semibold hover:underline cursor-pointer"
                  >
                    Continuar a comprar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
