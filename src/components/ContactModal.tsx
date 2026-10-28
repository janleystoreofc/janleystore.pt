import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Send, MessageCircle, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!enviado ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e]">
                  Fala Connosco
                </h3>
                <p className="text-xs text-[#735953] mt-1">
                  Tens alguma dúvida ou projeto de impressão 3D? Estamos sempre disponíveis.
                </p>
              </div>

              {/* Direct Contacts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:+351935742686"
                  className="p-3 rounded-2xl bg-[#fdf5f4] border border-[#fae2dc] flex items-center gap-3 hover:border-[#f43f7a] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#735953]">Telemóvel</div>
                    <div className="text-xs font-bold text-[#33221e]">+351 935 742 686</div>
                  </div>
                </a>

                <a
                  href="mailto:janleystorebr@gmail.com"
                  className="p-3 rounded-2xl bg-[#fdf5f4] border border-[#fae2dc] flex items-center gap-3 hover:border-[#f43f7a] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#735953]">Email</div>
                    <div className="text-xs font-bold text-[#33221e] truncate">janleystorebr@gmail.com</div>
                  </div>
                </a>

                <div className="p-3 rounded-2xl bg-[#fdf5f4] border border-[#fae2dc] flex items-center gap-3 sm:col-span-2">
                  <div className="w-9 h-9 rounded-xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#735953]">Localização</div>
                    <div className="text-xs font-bold text-[#33221e]">Guimarães, Portugal</div>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href="https://wa.me/351935742686?text=Ol%C3%A1%20Janley%20Store%2C%20gostaria%20de%20esclarecer%20uma%20d%C3%BAvida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar Agora no WhatsApp</span>
                </a>
              </div>

              {/* Message form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#fae2dc]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Nome</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="O teu nome"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] rounded-xl px-3 py-2 text-sm outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="o-teu-email@gmail.com"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] rounded-xl px-3 py-2 text-sm outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">Mensagem</label>
                  <textarea
                    rows={3}
                    required
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Escreve aqui a tua mensagem..."
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] rounded-xl p-3 text-sm outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title text-2xl font-bold text-[#33221e]">
                Mensagem Recebida!
              </h3>
              <p className="text-xs sm:text-sm text-[#735953] max-w-sm mx-auto">
                Responderemos o mais breve possível para o teu e-mail ou WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
