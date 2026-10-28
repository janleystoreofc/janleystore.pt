import React from 'react';
import { X, HelpCircle, Truck, RefreshCw, ShieldCheck, FileText, User } from 'lucide-react';

interface HelpTopicModalProps {
  topic: string | null;
  onClose: () => void;
}

export const HelpTopicModal: React.FC<HelpTopicModalProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  const getContent = () => {
    switch (topic) {
      case 'Envios e Entregas':
        return {
          icon: Truck,
          title: 'Envios e Entregas para Portugal',
          body: (
            <div className="space-y-3 text-sm text-[#5f4640] leading-relaxed">
              <p>
                Os envios da <strong>Janley Store</strong> são expedidos diretamente de Guimarães através de CTT Expresso ou transportadora registada.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Prazo de Produção 3D:</strong> 1 a 3 dias úteis para peças em stock ou até 5 dias para peças personalizadas.</li>
                <li><strong>Prazo de Envio:</strong> 24 a 48 horas para Portugal Continental; 3 a 5 dias para as Regiões Autónomas (Madeira e Açores).</li>
                <li><strong>Portes Grátis:</strong> Em todas as encomendas superiores a <strong>€ 30,00</strong>! Para valores inferiores, a taxa padrão é de apenas <strong>€ 3,50</strong>.</li>
              </ul>
            </div>
          ),
        };
      case 'Trocas e Devoluções':
        return {
          icon: RefreshCw,
          title: 'Trocas e Devoluções',
          body: (
            <div className="space-y-3 text-sm text-[#5f4640] leading-relaxed">
              <p>
                A satisfação com cada peça de impressão 3D é a nossa prioridade. Caso o teu artigo chegue danificado pelo transporte ou com defeito de fabrico, substituímos imediatamente sem custos adicionais.
              </p>
              <p className="text-xs sm:text-sm">
                Dispomos de um prazo legal de 14 dias para devolução de artigos standard. Peças com personalização de nomes próprios ou logótipos não admitem devolução por arrependimento, exceto por anomalia técnica.
              </p>
            </div>
          ),
        };
      case 'Acompanhamento de Encomenda':
        return {
          icon: HelpCircle,
          title: 'Acompanhar Encomenda',
          body: (
            <div className="space-y-3 text-sm text-[#5f4640] leading-relaxed">
              <p>
                Assim que a tua encomenda for embalada e despachada da nossa oficina em Guimarães, receberás um e-mail e SMS com o código de rastreio (tracking number) dos CTT.
              </p>
              <p className="text-xs sm:text-sm">
                Podes também enviar o teu número de encomenda diretamente para o nosso WhatsApp <strong>+351 935 742 686</strong> para obter suporte imediato em tempo real.
              </p>
            </div>
          ),
        };
      case 'Minha Conta':
        return {
          icon: User,
          title: 'A Tua Conta Janley Store',
          body: (
            <div className="space-y-3 text-sm text-[#5f4640] leading-relaxed">
              <p>
                Para simplificar a tua experiência, não precisas de registos complicados! As tuas encomendas ficam associadas ao teu e-mail e número de telemóvel, onde recebes todas as atualizações.
              </p>
            </div>
          ),
        };
      default:
        return {
          icon: FileText,
          title: topic,
          body: (
            <div className="space-y-3 text-sm text-[#5f4640] leading-relaxed">
              <p>
                A Janley Store opera em total conformidade com a legislação portuguesa e europeia de comércio eletrónico e RGPD.
              </p>
              <p className="text-xs sm:text-sm">
                Todos os dados recolhidos são estritamente utilizados para o processamento e entrega das tuas peças 3D encomendadas.
              </p>
            </div>
          ),
        };
    }
  };

  const current = getContent();
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200 space-y-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fdedea] text-[#f43f7a] flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#33221e]">
              {current.title}
            </h3>
          </div>

          <div className="pt-2">{current.body}</div>

          <div className="pt-3">
            <button
              onClick={onClose}
              className="w-full bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
            >
              Compreendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
