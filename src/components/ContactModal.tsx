import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const content = {
    pt: {
      title: 'Fala Connosco',
      sub: 'Tens alguma dúvida ou projeto de impressão 3D? Estamos sempre disponíveis.',
      phoneLabel: 'Telemóvel',
      emailLabel: 'Email',
      locationLabel: 'Localização',
      locationVal: 'Guimarães, Braga - Portugal 🇵🇹',
      socialLabel: 'Redes Sociais',
      nameLabel: 'Nome',
      namePlaceholder: 'O teu nome',
      emailPlaceholder: 'o-teu-email@gmail.com',
      messageLabel: 'Mensagem',
      messagePlaceholder: 'Escreve aqui a tua mensagem...',
      btnSend: 'Enviar Mensagem',
      successTitle: 'Mensagem Recebida!',
      successSub: 'Responderemos com brevidade para o teu e-mail ou contacto.',
    },
    en: {
      title: 'Get In Touch',
      sub: 'Have a question or custom 3D project in mind? We are always here to help.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      locationLabel: 'Location',
      locationVal: 'Guimarães, Braga - Portugal 🇵🇹',
      socialLabel: 'Social Media',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      emailPlaceholder: 'your-email@example.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Write your message here...',
      btnSend: 'Send Message',
      successTitle: 'Message Received!',
      successSub: 'We will respond promptly to your email or direct contact.',
    },
    es: {
      title: 'Contáctanos',
      sub: '¿Tienes alguna consulta o proyecto de impresión 3D? Estamos a tu disposición.',
      phoneLabel: 'Teléfono',
      emailLabel: 'Email',
      locationLabel: 'Ubicación',
      locationVal: 'Guimarães, Braga - Portugal 🇵🇹',
      socialLabel: 'Redes Sociales',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre completo',
      emailPlaceholder: 'tu-email@ejemplo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder: 'Escribe aquí tu consulta...',
      btnSend: 'Enviar Mensaje',
      successTitle: '¡Mensaje Recibido!',
      successSub: 'Te responderemos a la mayor brevedad a tu email o teléfono.',
    },
    fr: {
      title: 'Contactez-Nous',
      sub: 'Une question ou un projet d\'impression 3D sur-mesure ? Nous sommes à votre écoute.',
      phoneLabel: 'Téléphone',
      emailLabel: 'Email',
      locationLabel: 'Localisation',
      locationVal: 'Guimarães, Braga - Portugal 🇵🇹',
      socialLabel: 'Réseaux Sociaux',
      nameLabel: 'Nom',
      namePlaceholder: 'Votre nom',
      emailPlaceholder: 'votre-email@exemple.com',
      messageLabel: 'Message',
      messagePlaceholder: 'Écrivez votre message ici...',
      btnSend: 'Envoyer le Message',
      successTitle: 'Message Reçu !',
      successSub: 'Nous vous répondrons dans les plus brefs délais.',
    },
  }[language] || {
    title: 'Fala Connosco',
    sub: 'Tens alguma dúvida ou projeto de impressão 3D? Estamos sempre disponíveis.',
    phoneLabel: 'Telemóvel',
    emailLabel: 'Email',
    locationLabel: 'Localização',
    locationVal: 'Guimarães, Braga - Portugal 🇵🇹',
    socialLabel: 'Redes Sociais',
    nameLabel: 'Nome',
    namePlaceholder: 'O teu nome',
    emailPlaceholder: 'o-teu-email@gmail.com',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Escreve aqui a tua mensagem...',
    btnSend: 'Enviar Mensagem',
    successTitle: 'Mensagem Recebida!',
    successSub: 'Responderemos com brevidade para o teu e-mail.',
  };

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#fed7aa] my-8 animate-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#78350f] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {!enviado ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#4a2e18]">
                  {content.title}
                </h3>
                <p className="text-xs text-[#78350f] mt-1">
                  {content.sub}
                </p>
              </div>

              {/* Direct Contacts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:+351935742686"
                  className="p-3 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] flex items-center gap-3 hover:border-[#d97706] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white text-[#d97706] shadow-2xs flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#78350f]">{content.phoneLabel}</div>
                    <div className="text-xs font-bold text-[#4a2e18]">+351 935 742 686</div>
                  </div>
                </a>

                <a
                  href="mailto:janleystorebr@gmail.com"
                  className="p-3 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] flex items-center gap-3 hover:border-[#d97706] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white text-[#d97706] shadow-2xs flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#78350f]">{content.emailLabel}</div>
                    <div className="text-xs font-bold text-[#4a2e18] truncate">janleystorebr@gmail.com</div>
                  </div>
                </a>

                <div className="p-3 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#d97706] shadow-2xs flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#78350f]">{content.locationLabel}</div>
                    <div className="text-xs font-bold text-[#4a2e18]">{content.locationVal}</div>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/janleystoreofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] flex items-center gap-3 hover:border-[#d97706] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white text-[#d97706] shadow-2xs flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-xs">@</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#78350f]">{content.socialLabel}</div>
                    <div className="text-xs font-bold text-[#d97706]">@janleystoreofc</div>
                  </div>
                </a>
              </div>

              {/* Message form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#fed7aa]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4a2e18] mb-1">{content.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder={content.namePlaceholder}
                      className="w-full bg-[#fef8ed]/60 border border-[#fed7aa] focus:border-[#d97706] rounded-xl px-3 py-2 text-sm text-[#4a2e18] outline-hidden focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4a2e18] mb-1">{content.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={content.emailPlaceholder}
                      className="w-full bg-[#fef8ed]/60 border border-[#fed7aa] focus:border-[#d97706] rounded-xl px-3 py-2 text-sm text-[#4a2e18] outline-hidden focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4a2e18] mb-1">{content.messageLabel}</label>
                  <textarea
                    rows={3}
                    required
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder={content.messagePlaceholder}
                    className="w-full bg-[#fef8ed]/60 border border-[#fed7aa] focus:border-[#d97706] rounded-xl p-3 text-sm text-[#4a2e18] outline-hidden focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{content.btnSend}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-[#d97706] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-title text-2xl font-bold text-[#4a2e18]">
                {content.successTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#78350f] max-w-sm mx-auto">
                {content.successSub}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
