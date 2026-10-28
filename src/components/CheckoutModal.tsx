import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, ArrowLeft, ArrowRight, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, shipping, discount, total, couponCode, clearCart } = useCart();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

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

  const [paymentMethod, setPaymentMethod] = useState<'mbway' | 'multibanco' | 'card' | 'paypal'>('mbway');
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
    if (!formData.nome || !formData.telefone || !formData.morada || !formData.codigoPostal || !formData.cidade) {
      alert('Por favor preenche os campos obrigatórios de envio.');
      return;
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
                  Dados de Envio & Entrega
                </h3>
                <p className="text-xs text-[#735953] mt-1">
                  Enviamos de forma rápida e segura para qualquer morada em Portugal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    placeholder="Guimarães, Porto, Lisboa..."
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>
              </div>

              {/* Order total preview pill */}
              <div className="p-3.5 rounded-xl bg-[#fef5f4] border border-[#fae2dc] flex items-center justify-between text-xs text-[#5e433d]">
                <span>Total a pagar ({items.length} artigos)</span>
                <span className="text-base font-bold text-[#f43f7a]">
                  € {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                  Método de Pagamento
                </h3>
                <p className="text-xs text-[#735953] mt-1">
                  Pagamento 100% seguro com tecnologia encriptada.
                </p>
              </div>

              {/* Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* MB WAY */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mbway')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'mbway'
                      ? 'border-[#f43f7a] bg-[#fef5f7] ring-2 ring-[#f43f7a]/30'
                      : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                    MB
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#33221e]">MB WAY</div>
                    <div className="text-[11px] text-[#735953]">Notificação no telemóvel</div>
                  </div>
                </button>

                {/* Multibanco */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('multibanco')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'multibanco'
                      ? 'border-[#f43f7a] bg-[#fef5f7] ring-2 ring-[#f43f7a]/30'
                      : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2e3192] text-white flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#33221e]">Multibanco</div>
                    <div className="text-[11px] text-[#735953]">Entidade e Referência</div>
                  </div>
                </button>

                {/* Cartão de Crédito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#f43f7a] bg-[#fef5f7] ring-2 ring-[#f43f7a]/30'
                      : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#33221e]">Cartão Visa/MC</div>
                    <div className="text-[11px] text-[#735953]">Débito ou Crédito</div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-[#f43f7a] bg-[#fef5f7] ring-2 ring-[#f43f7a]/30'
                      : 'border-[#fae2dc] bg-white hover:border-[#f43f7a]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#003087] text-white flex items-center justify-center font-bold italic text-sm">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#33221e]">PayPal</div>
                    <div className="text-[11px] text-[#735953]">Conta ou Cartão</div>
                  </div>
                </button>
              </div>

              {/* MB WAY phone input if selected */}
              {paymentMethod === 'mbway' && (
                <div className="p-4 bg-[#fef5f7] rounded-2xl border border-[#fae2dc] space-y-2">
                  <label className="block text-xs font-bold text-[#33221e]">
                    Número de Telemóvel para MB WAY
                  </label>
                  <input
                    type="tel"
                    placeholder="912 345 678"
                    defaultValue={formData.telefone}
                    onChange={(e) => setMbwayPhone(e.target.value)}
                    className="w-full bg-white border border-[#d8c2bd] focus:border-[#f43f7a] rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                  <p className="text-[11px] text-[#735953]">
                    Receberás um pedido de confirmação de <strong>€ {total.toFixed(2).replace('.', ',')}</strong> na tua app MB WAY.
                  </p>
                </div>
              )}

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
                  className="flex-1 bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar & Pagar € {total.toFixed(2).replace('.', ',')}</span>
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
                  <span className="text-[#735953]">Morada de Envio:</span>
                  <span className="text-[#33221e] text-right font-medium">{formData.morada}, {formData.cidade}</span>
                </div>
                <div className="flex justify-between border-t border-[#fae2dc] pt-2">
                  <span className="text-[#735953]">Método:</span>
                  <span className="uppercase font-bold text-[#f43f7a]">{paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/351935742686?text=${encodeURIComponent(
                    `Olá Janley Store! Acabei de fazer a encomenda ${orderNumber} no vosso website. Poderiam confirmar a receção?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Acompanhar via WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="bg-[#33221e] hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
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
