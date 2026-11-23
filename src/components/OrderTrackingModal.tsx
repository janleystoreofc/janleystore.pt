import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Clock,
  Printer,
  Sparkles,
  Truck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  AlertCircle,
  PackageCheck,
  Car,
  Store
} from 'lucide-react';
import {
  DbTrackedOrder,
  DeliveryMethodType,
  OrderStage,
  PickupSettings,
  getTrackedOrders,
  getStorePickupSettings,
} from '../lib/supabase';

const DEMO_ORDERS: Record<string, DbTrackedOrder> = {
  'JNL-CTT-8491': {
    order_number: 'JNL-CTT-8491',
    delivery_method: 'ctt',
    client_name: 'Mariana Silva',
    destination: 'Lisboa, Portugal',
    product_name: 'Vaso Decorativo Espiral',
    product_image: '/images/vaso_dourado_amarelo.png',
    color_name: 'Dourado',
    color_hex: '#f5b82a',
    stage: 'Shipped',
    tracking_code: 'PT9482019482',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  'JNL-UBR-3104': {
    order_number: 'JNL-UBR-3104',
    delivery_method: 'uber',
    client_name: 'Pedro Santos',
    destination: 'Braga, Portugal',
    product_name: 'Suporte de Telemóvel Canelado',
    product_image: '/images/prod_suporte_telemovel.png',
    color_name: 'Rosa Gradiente Preto',
    color_hex: '#e11d68',
    stage: 'Shipped',
    uber_fee: '€ 4,50',
    uber_ok: true,
    uber_dispatched: true,
    uber_note: 'Estafeta Uber Flash a caminho — entrega prevista em 20 minutos.',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  'JNL-REC-5520': {
    order_number: 'JNL-REC-5520',
    delivery_method: 'recolha',
    client_name: 'Sofia Oliveira',
    destination: 'Guimarães (Recolha na Loja)',
    product_name: 'Letreiro com Nome & Coração',
    product_image: '/images/cat_personalizados.png',
    color_name: 'Roxo Gradiente Preto',
    color_hex: '#8b1da8',
    stage: 'ReadyPickup',
    pickup_address: '',
    pickup_note: 'Impressão e embalagem concluídas! Podes vir buscar hoje até às 19h.',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
};

function getStagesForMethod(method: DeliveryMethodType): {
  id: OrderStage;
  label: string;
  description: string;
  icon: React.ElementType;
}[] {
  if (method === 'recolha') {
    return [
      {
        id: 'Printing',
        label: 'A Imprimir 3D',
        description: 'Peça em produção na impressora',
        icon: Printer,
      },
      {
        id: 'Post-processing',
        label: 'Acabamento',
        description: 'Impressão terminada — em acabamento',
        icon: Sparkles,
      },
      {
        id: 'Packaging',
        label: 'Embalagem',
        description: 'A embalar com proteção',
        icon: PackageCheck,
      },
      {
        id: 'ReadyPickup',
        label: 'Já Pode Buscar!',
        description: 'Pronta para recolha na loja',
        icon: Store,
      },
    ];
  }

  if (method === 'uber') {
    return [
      {
        id: 'Queued',
        label: 'Na Fila',
        description: 'Encomenda confirmada',
        icon: Clock,
      },
      {
        id: 'Printing',
        label: 'A Imprimir 3D',
        description: 'Fabrico em andamento',
        icon: Printer,
      },
      {
        id: 'Post-processing',
        label: 'Pronto / Aguardar Uber',
        description: 'A confirmar valor & OK no site',
        icon: Sparkles,
      },
      {
        id: 'Shipped',
        label: 'Saiu por Uber Flash',
        description: 'Estafeta a caminho',
        icon: Car,
      },
    ];
  }

  // CTT default
  return [
    {
      id: 'Queued',
      label: 'Na Fila',
      description: 'Preparação do ficheiro 3D',
      icon: Clock,
    },
    {
      id: 'Printing',
      label: 'A Imprimir 3D',
      description: 'Fabrico em andamento',
      icon: Printer,
    },
    {
      id: 'Packaging',
      label: 'Acabamento & Embalagem',
      description: 'Inspeção e preparação CTT',
      icon: PackageCheck,
    },
    {
      id: 'Shipped',
      label: 'Enviado CTT',
      description: 'Código de rastreio disponível',
      icon: Truck,
    },
  ];
}

function resolveStageIndex(method: DeliveryMethodType, stage: OrderStage): number {
  const stages = getStagesForMethod(method);
  const exact = stages.findIndex((s) => s.id === stage);
  if (exact !== -1) return exact;

  if (method === 'recolha') {
    if (stage === 'Queued' || stage === 'Printing') return 0;
    if (stage === 'Post-processing') return 1;
    if (stage === 'Packaging') return 2;
    return 3; // Shipped or ReadyPickup
  }

  if (method === 'uber') {
    if (stage === 'Queued') return 0;
    if (stage === 'Printing') return 1;
    if (stage === 'Post-processing' || stage === 'Packaging') return 2;
    return 3;
  }

  // CTT
  if (stage === 'Queued') return 0;
  if (stage === 'Printing') return 1;
  if (stage === 'Post-processing' || stage === 'Packaging') return 2;
  return 3;
}

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
  const [ordersMap, setOrdersMap] = useState<Record<string, DbTrackedOrder>>(DEMO_ORDERS);
  const [pickupSettings, setPickupSettings] = useState<PickupSettings>({
    address: '',
    note: '',
  });
  const [searchInput, setSearchInput] = useState(initialOrderNumber || 'JNL-CTT-8491');
  const [currentOrder, setCurrentOrder] = useState<DbTrackedOrder | null>(
    DEMO_ORDERS['JNL-CTT-8491']
  );
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    Promise.all([getTrackedOrders(), getStorePickupSettings()]).then(
      ([ordersRes, pickupRes]) => {
        if (!active) return;
        const merged: Record<string, DbTrackedOrder> = { ...DEMO_ORDERS };
        for (const o of ordersRes.orders) {
          merged[o.order_number.toUpperCase()] = o;
        }
        setOrdersMap(merged);
        setPickupSettings(pickupRes);

        const targetCode = (initialOrderNumber || '').trim().toUpperCase();
        if (targetCode && merged[targetCode]) {
          setSearchInput(targetCode);
          setCurrentOrder(merged[targetCode]);
          setNotFoundCode(null);
        } else if (targetCode && !targetCode.startsWith('JNL-2026')) {
          setSearchInput(targetCode);
          setCurrentOrder(null);
          setNotFoundCode(targetCode);
        } else {
          setSearchInput('JNL-CTT-8491');
          setCurrentOrder(merged['JNL-CTT-8491']);
          setNotFoundCode(null);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = searchInput.trim().toUpperCase();
    if (!cleanId) return;

    if (ordersMap[cleanId]) {
      setCurrentOrder(ordersMap[cleanId]);
      setNotFoundCode(null);
    } else {
      setCurrentOrder(null);
      setNotFoundCode(cleanId);
    }
  };

  const method = currentOrder?.delivery_method || 'ctt';
  const stages = getStagesForMethod(method);
  const currentStageIndex = currentOrder ? resolveStageIndex(method, currentOrder.stage) : 0;

  const resolvedPickupAddress =
    (currentOrder?.pickup_address || '').trim() ||
    (pickupSettings.address || '').trim() ||
    'Guimarães, Braga — Morada exata enviada por confirmação após conclusão';

  const resolvedPickupNote =
    (currentOrder?.pickup_note || '').trim() || (pickupSettings.note || '').trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#d97706] hover:bg-[#fef8ed] rounded-full transition-colors cursor-pointer z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-bold tracking-wide mb-2">
              <Printer className="w-3.5 h-3.5" />
              <span>Acompanhamento de Encomenda</span>
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#33221e]">
              Rastrear Encomenda
            </h3>
            <p className="text-xs sm:text-sm text-[#735953] mt-1">
              Consulta o estado específico conforme a tua modalidade: <strong>CTT Expresso</strong>, <strong>Uber Flash</strong> ou <strong>Recolha na Loja</strong>.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2.5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Insere o n.º da encomenda (ex: JNLY-123456)"
                  className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold tracking-wide text-[#33221e] outline-hidden uppercase placeholder:normal-case placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Consultar
              </button>
            </div>

            {/* 3 Clear Mode Example Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#735953]">
              <span className="font-medium">Ver exemplo por modalidade:</span>
              {[
                { code: 'JNL-CTT-8491', label: 'CTT Expresso' },
                { code: 'JNL-UBR-3104', label: 'Uber Flash' },
                { code: 'JNL-REC-5520', label: 'Recolha na Loja' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setSearchInput(item.code);
                    setCurrentOrder(ordersMap[item.code] || DEMO_ORDERS[item.code]);
                    setNotFoundCode(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                    currentOrder?.order_number === item.code
                      ? 'bg-[#33221e] text-white border-[#33221e]'
                      : 'bg-[#faf4f2] text-[#4a342f] border-[#fae2dc] hover:border-[#d97706]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </form>

          {notFoundCode && (
            <div className="p-4 bg-[#faf7f5] text-[#5c3a1e] rounded-2xl text-xs flex items-start gap-2.5 border border-[#fae2dc]">
              <AlertCircle className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>
                  Ainda não encontrámos atualizações registadas para a encomenda{' '}
                  <strong className="font-mono">{notFoundCode}</strong>.
                </p>
                <p className="text-[11px] text-[#735953]">
                  Confirma o código recebido no final da compra ou fala connosco diretamente no WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* Active Order Tracking Display */}
          {currentOrder && (
            <div className="space-y-5 pt-3 border-t border-[#fae2dc] text-left">
              {/* Order Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fdf8f6] p-4 rounded-2xl border border-[#fae4e1]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#8c6760] uppercase tracking-wider">
                      Encomenda #{currentOrder.order_number}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        method === 'ctt'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : method === 'uber'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {method === 'ctt'
                        ? 'CTT Expresso'
                        : method === 'uber'
                          ? 'Uber Flash'
                          : 'Recolha na Loja'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#33221e] mt-0.5">
                    {currentOrder.client_name || 'Cliente Janley Store'}
                  </h4>
                </div>
                {method !== 'recolha' && currentOrder.destination && (
                  <div className="flex items-center gap-1.5 text-xs text-[#735953]">
                    <MapPin className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>{currentOrder.destination}</span>
                  </div>
                )}
              </div>

              {/* Dedicated 4-Stage Visual Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#33221e]">
                  <span>
                    {method === 'recolha'
                      ? 'Estado da Preparação para Recolha'
                      : method === 'uber'
                        ? 'Estado para Entrega Uber Flash'
                        : 'Estado de Produção & Envio CTT'}
                  </span>
                  <span className="text-[#d97706]">
                    Etapa {currentStageIndex + 1} de {stages.length}
                  </span>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-4 gap-2">
                    {stages.map((stage, idx) => {
                      const Icon = stage.icon;
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div key={stage.id} className="flex flex-col items-center text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-[#15803d] text-white shadow-xs'
                                : isCurrent
                                  ? 'bg-[#d97706] text-white ring-4 ring-[#fef3c7] shadow-md scale-105'
                                  : 'bg-white text-[#9c7871] border-2 border-[#ebdcd6]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span
                            className={`mt-2 text-[11px] font-bold leading-tight ${
                              isCurrent
                                ? 'text-[#b45309]'
                                : isCompleted
                                  ? 'text-[#15803d]'
                                  : 'text-[#8c6760]'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="text-[10px] text-[#9c7871] leading-tight hidden sm:block mt-0.5">
                            {stage.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ============================================================
                  MODE 1: CTT EXPRESSO (Strict CTT Code & Tracking Link)
                  ============================================================ */}
              {method === 'ctt' && (
                <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-[#166534] flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#15803d]" />
                      <span>Envio Nacional CTT Expresso</span>
                    </div>
                    {currentOrder.tracking_code ? (
                      <div className="text-[#365314]">
                        Código de Rastreio CTT:{' '}
                        <strong className="font-mono text-sm text-[#14532d]">
                          {currentOrder.tracking_code}
                        </strong>
                      </div>
                    ) : (
                      <div className="text-[#365314]">
                        O código de rastreio CTT será colocado aqui assim que a encomenda for expedida.
                      </div>
                    )}
                  </div>
                  {currentOrder.tracking_code && (
                    <a
                      href={`https://www.ctt.pt/fechodigital/pesquisa?query=${encodeURIComponent(
                        currentOrder.tracking_code
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#15803d] hover:bg-[#166534] text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl transition-colors whitespace-nowrap text-center"
                    >
                      Seguir nos CTT
                    </a>
                  )}
                </div>
              )}

              {/* ============================================================
                  MODE 2: UBER FLASH (Fee, Store OK confirmation & Dispatched)
                  ============================================================ */}
              {method === 'uber' && (
                <div className="p-4 rounded-2xl bg-[#faf7f5] border border-[#e7d6d1] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#33221e] flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-black text-white text-[10px] font-black flex items-center justify-center">
                        U
                      </span>
                      <span>Entrega Rápida Uber Flash</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        currentOrder.uber_dispatched
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentOrder.uber_ok
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {currentOrder.uber_dispatched
                        ? 'Já saiu para entrega'
                        : currentOrder.uber_ok
                          ? 'OK confirmado — a pedir estafeta'
                          : 'A aguardar confirmação da loja'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="text-[10px] text-[#735953]">Confirmação no Site</div>
                      <div className="font-bold text-[#33221e] mt-0.5">
                        {currentOrder.uber_ok ? '✓ OK dado pela loja' : 'Pendente de OK'}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="text-[10px] text-[#735953]">Quanto custará (Uber)</div>
                      <div className="font-bold text-[#d97706] mt-0.5">
                        {currentOrder.uber_fee ? currentOrder.uber_fee : 'A calcular antes do envio'}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-[#fae2dc]">
                      <div className="text-[10px] text-[#735953]">Estado de Saída</div>
                      <div className="font-bold text-[#33221e] mt-0.5">
                        {currentOrder.uber_dispatched ? 'Estafeta a caminho!' : 'Ainda na loja'}
                      </div>
                    </div>
                  </div>

                  {currentOrder.uber_note && (
                    <div className="text-[11px] text-[#5c3a1e] bg-white px-3 py-2 rounded-xl border border-[#fae2dc]">
                      {currentOrder.uber_note}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================
                  MODE 3: RECOLHA NA LOJA (Zero tracking codes, clear status + address)
                  ============================================================ */}
              {method === 'recolha' && (
                <div className="space-y-3 text-xs">
                  <div
                    className={`p-4 rounded-2xl border ${
                      currentStageIndex >= 3
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-[#fef8ed] border-[#fed7aa] text-[#5c3a1e]'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2 mb-1">
                      <Store className="w-4 h-4 shrink-0" />
                      <span>
                        {currentStageIndex === 0
                          ? 'A imprimir em 3D — avisaremos assim que terminar!'
                          : currentStageIndex === 1
                            ? 'Impressão terminada! A peça está em acabamento.'
                            : currentStageIndex === 2
                              ? 'Acabamento concluído! A peça está na embalagem.'
                              : 'Encomenda pronta e embalada — já podes vir buscar!'}
                      </span>
                    </div>
                    {resolvedPickupNote && (
                      <p className="text-[11px] opacity-90">{resolvedPickupNote}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#fae2dc] space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c6760] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d97706]" />
                      <span>Morada para Recolha</span>
                    </div>
                    <p className="text-sm font-bold text-[#33221e] whitespace-pre-wrap">
                      {resolvedPickupAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Item Card */}
              <div className="flex items-center gap-3.5 p-3 bg-white rounded-2xl border border-[#fae2dc]">
                {currentOrder.product_image && (
                  <img
                    src={currentOrder.product_image}
                    alt={currentOrder.product_name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#faf4f2] border border-[#fae2dc]"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm text-[#33221e] truncate">
                    {currentOrder.product_name}
                  </h5>
                  {currentOrder.color_name && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/15"
                        style={{ backgroundColor: currentOrder.color_hex || '#d97706' }}
                      />
                      <span className="text-xs text-[#735953]">
                        Cor: <strong>{currentOrder.color_name}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-[#735953]">
                <span>Precisas de combinar ou tirar uma dúvida?</span>
                <a
                  href={`https://wa.me/351935742686?text=${encodeURIComponent(
                    `Olá Janley Store! Gostaria de falar sobre a encomenda ${currentOrder.order_number}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#25D366] font-bold hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Falar no WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
