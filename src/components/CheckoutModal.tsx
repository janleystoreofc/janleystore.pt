import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ArrowLeft, ArrowRight, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderTracking?: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOpenOrderTracking }) => {
  const { items, subtotal, shipping, discount, total, couponCode, clearCart } = useCart();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  const [deliveryMethod, setDeliveryMethod] = useState<'ctt' | 'uber' | 'recolha'>('ctt');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    morada: '',
    codigoPostal: '',
    cidade: '',
    nif: '',
    notas: '',
  });

  const [mbwayPhone, setMbwayPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryMethod !== 'recolha') {
      if (!formData.nome || !formData.telefone || !formData.morada || !formData.codigoPostal || !formData.cidade) {
        alert('Por favor preenche os campos obrigatórios de envio.');
        return;
      }
    } else {
      if (!formData.nome || !formData.telefone) {
        alert('Por favor preenche o teu Nome e Telemóvel para a recolha.');
        return;
      }
    }
    setStep('payment');
  };

  const handleFinalizeOrder = () => {
    const randomOrder = 'JNLY-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
    setStep('confirmation');
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Header */}
          {step !== 'confirmation' && (
            <div className="mb-6">
              <div className="flex items-center justify-between max-w-xs mx-auto mb-3">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 'details' ? 'text-[#f43f7a]' : 'text-emerald-600'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step === 'details' ? 'bg-[#f43f7a]' : 'bg-emerald-600'}`}>
                    1
                  </span>
                  <span>Envio</span>
                </div>
                <div className="h-0.5 flex-1 bg-[#f5d9d4] mx-3" />
                <div className={`flex items-center gap-1.5 text-xs font-bold ${step === 'payment' ? 'text-[#f43f7a]' : 'text-[#8c6760]'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step === 'payment' ? 'bg-[#f43f7a]' : 'bg-[#d8c2bd]'}`}>
                    2
                  </span>
                  <span>Pagamento</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Shipping Details */}
          {step === 'details' && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                  Opções de Entrega & Envio
                </h3>
                <p className="text-xs text-[#735953] mt-1">
                  Atelier sediado em <strong>Guimarães, Braga - Portugal</strong> 🇵🇹 com envio para Portugal inteiro.
                </p>
              </div>

              {/* Delivery method selection */}
              <div>
                <label className="block text-xs font-bold text-[#33221e] mb-2">
                  Seleciona como desejas receber:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('ctt')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      deliveryMethod === 'ctt'
                        ? 'border-[#f43f7a] bg-[#fef5f7] ring-1.5 ring-[#f43f7a]'
                        : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#33221e]">
                      <Truck className="w-3.5 h-3.5 text-[#f43f7a]" />
                      <span>CTT Expresso</span>
                    </div>
                    <p className="text-[10px] text-[#735953] mt-0.5">
                      Todo Portugal Continental & Ilhas
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('uber')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      deliveryMethod === 'uber'
                        ? 'border-[#f43f7a] bg-[#fef5f7] ring-1.5 ring-[#f43f7a]'
                        : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#33221e]">
                      <span className="w-3.5 h-3.5 rounded bg-black text-white text-[9px] font-black flex items-center justify-center">U</span>
                      <span>Uber Flash</span>
                    </div>
                    <p className="text-[10px] text-[#735953] mt-0.5">
                      Entrega rápida Guimarães e arredores
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('recolha')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      deliveryMethod === 'recolha'
                        ? 'border-[#f43f7a] bg-[#fef5f7] ring-1.5 ring-[#f43f7a]'
                        : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#33221e]">
                      <Building2 className="w-3.5 h-3.5 text-[#f43f7a]" />
                      <span>Recolha no Atelier</span>
                    </div>
                    <p className="text-[10px] text-[#735953] mt-0.5">
                      Guimarães, Braga (Grátis)
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Ana Silva"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Telemóvel (Portugal) *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="+351 912 345 678"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    E-mail para Confirmação *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@gmail.com"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>

                {deliveryMethod !== 'recolha' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#33221e] mb-1">
                        Morada Completa *
                      </label>
                      <input
                        type="text"
                        name="morada"
                        required
                        value={formData.morada}
                        onChange={handleChange}
                        placeholder="Rua, Número, Andar / Apartamento"
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#33221e] mb-1">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        name="codigoPostal"
                        required
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        placeholder="4800-000"
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#33221e] mb-1">
                        Localidade / Cidade *
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        required
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Guimarães, Porto, Lisboa, Faro..."
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Order total preview pill */}
              <div className="p-3.5 rounded-xl bg-[#fef5f4] border border-[#fae2dc] flex items-center justify-between text-xs text-[#5e433d]">
                <span>Total ({items.length} artigos) • {deliveryMethod === 'recolha' ? 'Recolha em Guimarães' : deliveryMethod === 'uber' ? 'Uber Flash' : 'CTT Expresso'}</span>
                <span className="text-base font-bold text-[#f43f7a]">
                  € {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Pagamento MB WAY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Selection (MB WAY Exclusive) */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#008f51] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
                  <span>Pagamento 100% por MB WAY</span>
                </div>
                <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                  Pagamento por MB WAY
                </h3>
                <p className="text-xs text-[#735953] mt-1">
                  Aceitamos exclusivamente <strong>MB WAY</strong> para garantir máxima rapidez e segurança.
                </p>
              </div>

              {/* MB WAY Card */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#f43f7a] bg-[#fef7f8] space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm shadow-xs">
                      <span className="text-white text-xs mr-0.5">MB</span>
                      <span className="text-[#008f51] text-xs">WAY</span>
                    </div>
                    <div>
                      <div className="font-bold text-base text-[#33221e]">MB WAY Janley Store</div>
                      <div className="text-xs text-[#008f51] font-semibold">Conta Oficial Verificada</div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#f43f7a] bg-white px-2.5 py-1 rounded-full border border-[#fcd7df]">
                    Exclusivo
                  </span>
                </div>

                <div className="pt-2 border-t border-[#f8d8de] text-xs text-[#664b45] space-y-1.5">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#fae2dc]">
                    <span className="text-[#735953]">Número MB WAY da Loja:</span>
                    <strong className="text-sm font-bold text-[#33221e]">+351 935 742 686</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-[#fae2dc]">
                    <span className="text-[#735953]">Titular da Conta:</span>
                    <strong className="text-xs font-bold text-[#33221e]">Janley Store (Guimarães, Portugal)</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1.5">
                    O teu número de telemóvel associado ao MB WAY:
                  </label>
                  <input
                    type="tel"
                    placeholder="+351 912 345 678"
                    defaultValue={formData.telefone}
                    onChange={(e) => setMbwayPhone(e.target.value)}
                    className="w-full bg-white border border-[#d8c2bd] focus:border-[#f43f7a] rounded-xl px-3.5 py-2.5 text-sm outline-hidden font-medium"
                  />
                  <p className="text-[11px] text-[#735953] mt-1.5 leading-relaxed">
                    Ao clicares em confirmar, a tua encomenda é registada no sistema. Podes efetuar o envio de <strong>€ {total.toFixed(2).replace('.', ',')}</strong> na app MB WAY para o nosso contacto.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-xl border border-[#d8c2bd] text-xs font-bold text-[#4a342f] hover:bg-[#faf7f5] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeOrder}
                  className="flex-1 bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar Encomenda • € {total.toFixed(2).replace('.', ',')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-serif-title text-3xl font-bold text-[#33221e]">
                  Encomenda Confirmada!
                </h3>
                <p className="text-xs sm:text-sm text-[#735953] mt-1 max-w-md mx-auto">
                  Muito obrigado pela tua preferência! A equipa da Janley Store em Guimarães já começou a preparar a tua peça em impressão 3D.
                </p>
              </div>

              {/* Order Box */}
              <div className="bg-[#fdedea] border border-[#fbdad2] rounded-2xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#735953]">Número da Encomenda:</span>
                  <strong className="text-[#33221e] font-mono text-sm">{orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#735953]">Cliente:</span>
                  <strong className="text-[#33221e]">{formData.nome || 'Cliente Janley Store'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#735953]">Entrega:</span>
                  <span className="text-[#33221e] font-semibold">
                    {deliveryMethod === 'recolha' ? 'Recolha no Atelier (Guimarães)' : deliveryMethod === 'uber' ? 'Uber Flash (Local)' : 'CTT Expresso (Portugal)'}
                  </span>
                </div>
                {deliveryMethod !== 'recolha' && formData.morada && (
                  <div className="flex justify-between">
                    <span className="text-[#735953]">Morada de Envio:</span>
                    <span className="text-[#33221e] text-right font-medium">{formData.morada}, {formData.cidade}</span>
                  </div>
                )}
                <div className="border-t border-[#fae2dc] pt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[#735953]">Pagamento:</span>
                    <span className="font-bold text-[#008f51] flex items-center gap-1">
                      <span className="bg-black text-white px-1 py-0.5 rounded text-[8px] font-black">MB</span> WAY
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#f8d8de] text-[11px] text-[#6d4f48]">
                    Transfere <strong>€ {total.toFixed(2).replace('.', ',')}</strong> via MB WAY para: <br />
                    <strong className="text-[#f43f7a] text-xs">+351 935 742 686</strong> (com referência: <strong>{orderNumber}</strong>)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                {onOpenOrderTracking && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenOrderTracking(orderNumber);
                    }}
                    className="bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Acompanhar Produção 3D</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/351935742686?text=${encodeURIComponent(
                    `Olá Janley Store! Acabei de fazer a encomenda ${orderNumber} no vosso website. Poderiam confirmar a receção?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="bg-[#faf4f2] hover:bg-[#f3ded8] text-[#33221e] border border-[#fae2dc] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  Voltar à Loja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
