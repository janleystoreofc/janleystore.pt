import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, Upload, MessageCircle } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({ isOpen, onClose }) => {
  const [ideaType, setIdeaType] = useState('letreiro');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('Pequeno (até 15cm)');
  const [colorPreference, setColorPreference] = useState('Branco Pérola / Rosa Pastel');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 4000);
  };

  const getWhatsAppLink = () => {
    const text = `Olá Janley Store! Gostaria de pedir um orçamento para impressão 3D personalizada:
- Tipo: ${ideaType}
- Dimensões: ${dimensions}
- Cores: ${colorPreference}
- Descrição da Ideia: ${description || 'Em anexo/conversa'}
- Nome: ${clientName || 'Cliente'}`;
    return `https://wa.me/351935742686?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                    Pedir Personalização 3D
                  </h3>
                  <p className="text-xs text-[#735953]">
                    Transformamos a tua ideia num objeto real na Janley Store em Guimarães.
                  </p>
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#33221e] mb-2">
                  Tipo de Peça
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'letreiro', label: 'Letreiro / Nome' },
                    { id: 'chaveiro', label: 'Chaveiros / Brindes' },
                    { id: 'decoracao', label: 'Decoração / Vaso' },
                    { id: 'tecnica', label: 'Suporte / Peça' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setIdeaType(t.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                        ideaType === t.id
                          ? 'border-[#f43f7a] bg-[#fef5f7] text-[#f43f7a] shadow-xs'
                          : 'border-[#fae2dc] bg-[#faf7f5] text-[#5e433d] hover:border-[#f43f7a]/40'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#33221e] mb-1">
                  Descreve a tua ideia ou necessidade *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Gostaria de um letreiro com o nome 'Beatriz' em rosa pastel com suporte de mesa, ou um suporte específico para comando..."
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl p-3 text-sm outline-hidden"
                />
              </div>

              {/* Dimensions & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Dimensão Estimada
                  </label>
                  <select
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3 py-2 text-sm outline-hidden"
                  >
                    <option>Pequeno (até 10 cm)</option>
                    <option>Médio (10 a 20 cm)</option>
                    <option>Grande (20 a 30 cm)</option>
                    <option>Sob consulta técnica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Preferência de Cor
                  </label>
                  <input
                    type="text"
                    value={colorPreference}
                    onChange={(e) => setColorPreference(e.target.value)}
                    placeholder="Ex: Dourado, Rosa, Preto Mate..."
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3 py-2 text-sm outline-hidden"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    O teu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="O teu nome"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3 py-2 text-sm outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Telemóvel (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+351 9xx xxx xxx"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl px-3 py-2 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Pedido Imediato via WhatsApp</span>
                </a>

                <button
                  type="submit"
                  className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submeter Pedido no Website</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                Pedido Enviado com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-[#735953] max-w-sm mx-auto">
                Recebemos o teu pedido de personalização! Entraremos em contacto contigo dentro de 24h com a maquete 3D e o orçamento exato.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
