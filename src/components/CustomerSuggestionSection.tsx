import React, { useState } from 'react';
import { Lightbulb, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitCustomerSuggestion } from '../lib/supabase';

export const CustomerSuggestionSection: React.FC = () => {
  const { t } = useLanguage();
  const [suggestion, setSuggestion] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [lastSubmittedText, setLastSubmittedText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setSubmitting(true);
    try {
      const result = await submitCustomerSuggestion({
        client_name: clientName,
        client_contact: clientContact,
        suggestion: suggestion.trim(),
      });
      setSavedToDb(result.savedToDb);
      setLastSubmittedText(suggestion.trim());
      setSubmitted(true);
      setSuggestion('');
      setClientName('');
      setClientContact('');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText = `🌻 *SUGESTÃO DE PRODUTO PARA A LOJA - JANLEY STORE* 🌻\n\n• *Nome:* ${clientName || 'Cliente'}\n• *Contacto:* ${clientContact || 'WhatsApp'}\n• *Sugestão:* ${lastSubmittedText || suggestion || 'Tenho uma ideia de produto para adicionar à loja!'}`;

  return (
    <section
      id="sugestoes-section"
      className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#ebdcd3]/60"
    >
      <div className="bg-gradient-to-br from-[#fbf5f2] via-white to-[#fef8ed] rounded-3xl border border-[#ebdcd3] shadow-[0_4px_24px_rgba(43,23,12,0.04)] p-6 sm:p-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left intro */}
          <div className="lg:col-span-5 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b45309] bg-[#fef3c7] px-3 py-1 rounded-full">
              <Lightbulb className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{t('suggestion_badge')}</span>
            </div>

            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#2b170c] tracking-tight">
              {t('suggestion_title')}
            </h2>

            <p className="text-xs sm:text-sm text-[#5c3a1e] leading-relaxed">
              {t('suggestion_subtitle')}
            </p>
          </div>

          {/* Right free suggestion form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#2b170c]">
                    {t('suggestion_success_title')}
                  </h3>
                  <p className="text-xs text-[#5c3a1e] max-w-md mx-auto">
                    {savedToDb
                      ? t('suggestion_success_desc')
                      : t('suggestion_success_whatsapp_hint')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href={`https://wa.me/351935742686?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('suggestion_btn_whatsapp')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#d97706] hover:underline px-3 py-2 cursor-pointer"
                  >
                    {t('suggestion_btn_another')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#ebdcd3] p-5 sm:p-6 shadow-2xs space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2b170c] uppercase tracking-wider mb-1.5">
                    {t('suggestion_label')}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder={t('suggestion_placeholder')}
                    className="w-full bg-[#fffdfa] border border-[#ebdcd3] focus:border-[#d97706] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-[#2b170c] outline-hidden transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c3a1e] mb-1">
                      {t('suggestion_name_label')}
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Maria"
                      className="w-full bg-[#fffdfa] border border-[#ebdcd3] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs text-[#2b170c] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c3a1e] mb-1">
                      {t('suggestion_contact_label')}
                    </label>
                    <input
                      type="text"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      placeholder="Ex: +351 91... ou email"
                      className="w-full bg-[#fffdfa] border border-[#ebdcd3] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs text-[#2b170c] outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !suggestion.trim()}
                    className="flex-1 bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'A enviar...' : t('suggestion_btn_send')}</span>
                  </button>

                  <a
                    href={`https://wa.me/351935742686?text=${encodeURIComponent(whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
