import React, { useState } from 'react';
import {
  X,
  Search,
  Clock,
  Printer,
  Sparkles,
  Truck,
  CheckCircle2,
  Box,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export type OrderStage = 'Queued' | 'Printing' | 'Post-processing' | 'Shipped';

export interface OrderTrackingInfo {
  orderNumber: string;
  clientName: string;
  destination: string;
  orderDate: string;
  estimatedDelivery: string;
  productName: string;
  productImage: string;
  colorName: string;
  colorHex: string;
  currentStage: OrderStage;
  stageProgressPercent: number;
  printDetails?: {
    currentLayer?: number;
    totalLayers?: number;
    nozzleTemp?: string;
    bedTemp?: string;
    printerModel?: string;
    elapsedTime?: string;
    remainingTime?: string;
  };
  trackingCode?: string;
  carrier?: string;
}

const MOCK_ORDERS: Record<string, OrderTrackingInfo> = {
  'JNL-2026-8491': {
    orderNumber: 'JNL-2026-8491',
    clientName: 'Mariana Silva',
    destination: 'Guimarães, Portugal',
    orderDate: 'Ontem às 16:30',
    estimatedDelivery: 'Amanhã até às 18:00',
    productName: 'Vaso Decorativo Espiral',
    productImage: '/images/vaso_dourado_amarelo.png',
    colorName: 'Dourado',
    colorHex: '#f5b82a',
    currentStage: 'Printing',
    stageProgressPercent: 68,
    printDetails: {
      currentLayer: 354,
      totalLayers: 520,
      nozzleTemp: '215°C',
      bedTemp: '60°C',
      printerModel: 'Janley Bambu Lab X1-Carbon #03',
      elapsedTime: '2h 45m',
      remainingTime: '1h 15m',
    },
    carrier: 'CTT Expresso Portugal',
  },
  'JNL-2026-3104': {
    orderNumber: 'JNL-2026-3104',
    clientName: 'Pedro Santos',
    destination: 'Braga, Portugal',
    orderDate: 'Hoje às 09:15',
    estimatedDelivery: 'Quinta-feira',
    productName: 'Suporte de Telemóvel Canelado',
    productImage: '/images/prod_suporte_telemovel.png',
    colorName: 'Rosa Gradiente Preto',
    colorHex: '#e11d68',
    currentStage: 'Post-processing',
    stageProgressPercent: 85,
    printDetails: {
      printerModel: 'Janley Studio #01',
      remainingTime: 'Concluído em cura e polimento manual',
    },
    carrier: 'CTT Expresso Portugal',
  },
  'JNL-2026-5520': {
    orderNumber: 'JNL-2026-5520',
    clientName: 'Sofia Oliveira',
    destination: 'Lisboa, Portugal',
    orderDate: '2 dias atrás',
    estimatedDelivery: 'Hoje até às 19:00',
    productName: 'Letreiro com Nome "Sofia" & Coração',
    productImage: '/images/cat_personalizados.png',
    colorName: 'Roxo Gradiente Preto',
    colorHex: '#8b1da8',
    currentStage: 'Shipped',
    stageProgressPercent: 100,
    trackingCode: 'PT9482019482',
    carrier: 'CTT Expresso (Entrega Rápida 24h)',
  },
  'JNL-2026-1089': {
    orderNumber: 'JNL-2026-1089',
    clientName: 'André Costa',
    destination: 'Porto, Portugal',
    orderDate: 'Hoje às 14:10',
    estimatedDelivery: 'Sexta-feira',
    productName: 'Organizador de Mesa Canelado',
    productImage: '/images/prod_organizador_mesa.png',
    colorName: 'Mármore (com pontilhados)',
    colorHex: '#e8e7e3',
    currentStage: 'Queued',
    stageProgressPercent: 25,
    printDetails: {
      printerModel: 'Fila de fatiamento G-code (Bambu Studio)',
      remainingTime: 'Início estimado em 40 minutos',
    },
    carrier: 'DPD Portugal',
  },
};

const STAGES: {
  id: OrderStage;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'Queued',
    label: 'Na Fila',
    description: 'Ficheiro 3D fatiado e preparado para a impressora',
    icon: Clock,
  },
  {
    id: 'Printing',
    label: 'A Imprimir 3D',
    description: 'Fabrico aditivo camada a camada com filamento premium',
    icon: Printer,
  },
  {
    id: 'Post-processing',
    label: 'Pós-Processamento',
    description: 'Remoção de suportes, inspeção de qualidade e polimento',
    icon: Sparkles,
  },
  {
    id: 'Shipped',
    label: 'Enviado',
    description: 'Expedido via CTT Expresso com código de rastreio',
    icon: Truck,
  },
];

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'JNL-2026-8491');
  const [currentOrder, setCurrentOrder] = useState<OrderTrackingInfo | null>(
    MOCK_ORDERS[initialOrderNumber] || MOCK_ORDERS['JNL-2026-8491']
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = searchInput.trim().toUpperCase();
    if (!cleanId) return;

    if (MOCK_ORDERS[cleanId]) {
      setCurrentOrder(MOCK_ORDERS[cleanId]);
      setErrorMessage(null);
    } else {
      // Create a dynamic simulated order for any custom number entered by user
      const customOrder: OrderTrackingInfo = {
        orderNumber: cleanId,
        clientName: 'Cliente Janley Store',
        destination: 'Portugal',
        orderDate: 'Hoje',
        estimatedDelivery: 'Em 2 a 3 dias úteis',
        productName: 'Peça Impressa em 3D Janley',
        productImage: '/images/vaso_dourado_amarelo.png',
        colorName: 'Dourado',
        colorHex: '#f5b82a',
        currentStage: 'Printing',
        stageProgressPercent: 50,
        printDetails: {
          currentLayer: 260,
          totalLayers: 520,
          nozzleTemp: '215°C',
          bedTemp: '60°C',
          printerModel: 'Janley 3D Precision Core #02',
          elapsedTime: '1h 30m',
          remainingTime: '1h 45m',
        },
        carrier: 'CTT Expresso Portugal',
      };
      setCurrentOrder(customOrder);
      setErrorMessage(null);
    }
  };

  const getStageIndex = (stage: OrderStage): number => {
    switch (stage) {
      case 'Queued':
        return 0;
      case 'Printing':
        return 1;
      case 'Post-processing':
        return 2;
      case 'Shipped':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.currentStage) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200 space-y-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#f43f7a] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fdedea] text-[#f43f7a] text-xs font-bold tracking-wide mb-2">
              <Printer className="w-3.5 h-3.5" />
              <span>Janley 3D Print Tracker</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e]">
              Acompanhar Encomenda 3D
            </h3>
            <p className="text-xs sm:text-sm text-[#735953] mt-1">
              Introduz o número da tua encomenda para consultar em tempo real a fila, impressão e envio a partir do nosso atelier em Guimarães.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ex: JNL-2026-8491"
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#f43f7a] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold tracking-wide text-[#33221e] outline-hidden uppercase placeholder:normal-case placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                className="bg-[#f43f7a] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Rastrear</span>
              </button>
            </div>

            {/* Quick Demo Order Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#735953]">
              <span className="font-medium">Exemplos para testar:</span>
              {Object.keys(MOCK_ORDERS).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSearchInput(code);
                    setCurrentOrder(MOCK_ORDERS[code]);
                  }}
                  className={`px-2 py-0.5 rounded-md border text-[11px] font-mono cursor-pointer transition-colors ${
                    currentOrder?.orderNumber === code
                      ? 'bg-[#f43f7a] text-white border-[#f43f7a]'
                      : 'bg-[#faf4f2] text-[#4a342f] border-[#fae2dc] hover:border-[#f43f7a]'
                  }`}
                >
                  {code} ({MOCK_ORDERS[code].currentStage})
                </button>
              ))}
            </div>
          </form>

          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Order Content */}
          {currentOrder && (
            <div className="space-y-6 pt-2 border-t border-[#fae2dc] text-left">
              {/* Order Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fdf8f6] p-4 rounded-2xl border border-[#fae4e1]">
                <div>
                  <span className="text-[11px] font-bold text-[#8c6760] uppercase tracking-wider block">
                    Encomenda #{currentOrder.orderNumber}
                  </span>
                  <h4 className="text-base font-bold text-[#33221e]">
                    {currentOrder.clientName}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#735953]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#f43f7a]" />
                    <span>{currentOrder.orderDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#f43f7a]" />
                    <span>{currentOrder.destination}</span>
                  </div>
                </div>
              </div>

              {/* 4 STAGES VISUAL PROGRESS BAR */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#33221e]">
                  <span>Progresso da Produção 3D</span>
                  <span className="text-[#f43f7a]">
                    Etapa {currentStageIndex + 1} de {STAGES.length} ({currentOrder.stageProgressPercent}%)
                  </span>
                </div>

                {/* Stepper with connecting line */}
                <div className="relative">
                  {/* Connecting background bar */}
                  <div className="absolute top-5 left-6 right-6 h-1 bg-[#fae2dc] -translate-y-1/2 z-0" />
                  
                  {/* Active highlighted progress bar */}
                  <div
                    className="absolute top-5 left-6 h-1 bg-gradient-to-r from-[#f43f7a] to-[#ff7597] -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (STAGES.length - 1)) * 88}%`,
                    }}
                  />

                  {/* Steps Icons */}
                  <div className="relative z-10 grid grid-cols-4 gap-2">
                    {STAGES.map((stage, idx) => {
                      const Icon = stage.icon;
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div
                          key={stage.id}
                          className="flex flex-col items-center text-center group"
                        >
                          {/* Circle Icon */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#15803d] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-[#f43f7a] text-white ring-4 ring-[#fdedea] shadow-md scale-110 animate-pulse'
                                : 'bg-white text-[#9c7871] border-2 border-[#ebdcd6]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>

                          {/* Stage Label */}
                          <span
                            className={`mt-2.5 text-xs font-bold leading-tight ${
                              isCurrent
                                ? 'text-[#f43f7a]'
                                : isCompleted
                                ? 'text-[#15803d]'
                                : 'text-[#8c6760]'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="text-[10px] text-[#9c7871] leading-tight hidden sm:block mt-0.5 max-w-[110px]">
                            {stage.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real-time Technical 3D Printing telemetry */}
              {currentOrder.currentStage === 'Printing' && currentOrder.printDetails && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#fff7f5] to-[#fdedea] border border-[#fcdcd4] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#b4234b]">
                      <span className="w-2 h-2 rounded-full bg-[#f43f7a] animate-ping" />
                      <span>Impressora Ativa em Tempo Real</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8c4b57]">
                      {currentOrder.printDetails.printerModel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="flex items-center gap-1 text-[10px] text-[#8c6760] font-semibold">
                        <Layers className="w-3 h-3 text-[#f43f7a]" />
                        <span>Camadas</span>
                      </div>
                      <div className="font-bold text-sm text-[#33221e] mt-0.5">
                        {currentOrder.printDetails.currentLayer} / {currentOrder.printDetails.totalLayers}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="flex items-center gap-1 text-[10px] text-[#8c6760] font-semibold">
                        <Thermometer className="w-3 h-3 text-[#f43f7a]" />
                        <span>Nozzle / Cama</span>
                      </div>
                      <div className="font-bold text-sm text-[#33221e] mt-0.5">
                        {currentOrder.printDetails.nozzleTemp} | {currentOrder.printDetails.bedTemp}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="flex items-center gap-1 text-[10px] text-[#8c6760] font-semibold">
                        <Clock className="w-3 h-3 text-[#f43f7a]" />
                        <span>Tempo Decorrido</span>
                      </div>
                      <div className="font-bold text-sm text-[#33221e] mt-0.5">
                        {currentOrder.printDetails.elapsedTime}
                      </div>
                    </div>

                    <div className="bg-white/90 p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="flex items-center gap-1 text-[10px] text-[#8c6760] font-semibold">
                        <Clock className="w-3 h-3 text-[#15803d]" />
                        <span>Restante</span>
                      </div>
                      <div className="font-bold text-sm text-[#15803d] mt-0.5">
                        {currentOrder.printDetails.remainingTime}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipped stage info */}
              {currentOrder.currentStage === 'Shipped' && currentOrder.trackingCode && (
                <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#166534] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#15803d]" />
                      <span>Objeto em trânsito com os {currentOrder.carrier}</span>
                    </div>
                    <div className="text-[#365314]">
                      Código de Rastreio Nacional: <strong className="font-mono">{currentOrder.trackingCode}</strong>
                    </div>
                  </div>
                  <a
                    href={`https://www.ctt.pt/fechodigital/pesquisa?query=${currentOrder.trackingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap"
                  >
                    Ver nos CTT
                  </a>
                </div>
              )}

              {/* Item Card Details */}
              <div className="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#fae2dc]">
                <img
                  src={currentOrder.productImage}
                  alt={currentOrder.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-[#faf4f2] border border-[#fae2dc]"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm text-[#33221e] truncate">
                    {currentOrder.productName}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: currentOrder.colorHex }}
                    />
                    <span className="text-xs text-[#735953] font-medium truncate">
                      Filamento: <strong>{currentOrder.colorName}</strong>
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8c6760] mt-0.5">
                    Previsão de Entrega: <strong className="text-[#33221e]">{currentOrder.estimatedDelivery}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Support action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#735953]">
                <span>Dúvidas com esta encomenda em Guimarães?</span>
                <a
                  href={`https://wa.me/351935742686?text=Ol%C3%A1%20Janley%20Store%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20encomenda%20${currentOrder.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] font-bold hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar com o Atelier no WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
