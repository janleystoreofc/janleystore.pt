import React, { useState } from 'react';
import {
  X,
  Heart,
  User,
  ShoppingBag,
  Package,
  Mail,
  Lock,
  LogOut,
  Sparkles,
  ArrowRight,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Star,
  Camera
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import {
  supabase,
  isSupabaseConfigured,
  recordCustomerLeadEvent,
  submitProductReview,
  compressReviewPhoto,
} from '../lib/supabase';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onViewProductDetail: (product: Product) => void;
  onOpenOrderTracking: () => void;
  defaultTab?: 'favoritos' | 'conta' | 'encomendas';
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  products,
  onViewProductDetail,
  onOpenOrderTracking,
  defaultTab = 'favoritos',
}) => {
  const { favorites, toggleFavorite, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'favoritos' | 'conta' | 'avaliar' | 'encomendas'>(defaultTab);

  // Post-purchase review form state
  const [reviewProductId, setReviewProductId] = useState(() => products[0]?.id || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewOrderNum, setReviewOrderNum] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Auth state for customer
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clientName, setClientName] = useState(() => {
    return localStorage.getItem('janley_client_name') || '';
  });
  const [loggedInEmail, setLoggedInEmail] = useState(() => {
    return localStorage.getItem('janley_client_email') || '';
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let resolvedEmail = email.trim();
      let resolvedName = clientName.trim();

      if (isSupabaseConfigured) {
        if (isLoginMode) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: resolvedEmail,
            password,
          });
          if (error) throw error;
          resolvedEmail = data.user?.email || resolvedEmail;
          resolvedName = resolvedName || (data.user?.user_metadata?.name as string) || '';
          setLoggedInEmail(resolvedEmail);
          localStorage.setItem('janley_client_email', resolvedEmail);
          if (resolvedName) {
            setClientName(resolvedName);
            localStorage.setItem('janley_client_name', resolvedName);
          }
        } else {
          const { data, error } = await supabase.auth.signUp({
            email: resolvedEmail,
            password,
            options: {
              data: { name: resolvedName },
            },
          });
          if (error) throw error;
          resolvedEmail = data.user?.email || resolvedEmail;
          setLoggedInEmail(resolvedEmail);
          localStorage.setItem('janley_client_email', resolvedEmail);
          if (resolvedName) {
            localStorage.setItem('janley_client_name', resolvedName);
          }
        }
      } else {
        // Local client login
        setLoggedInEmail(resolvedEmail);
        localStorage.setItem('janley_client_email', resolvedEmail);
        if (resolvedName) {
          localStorage.setItem('janley_client_name', resolvedName);
        }
      }

      await recordCustomerLeadEvent({
        email: resolvedEmail,
        name: resolvedName,
        source: isLoginMode ? 'login' : 'signup',
      });
      window.dispatchEvent(new CustomEvent('janley:customer-auth'));

      setMessage({
        type: 'success',
        text: isLoginMode
          ? 'Sessão iniciada com sucesso!'
          : isSupabaseConfigured
            ? 'Conta criada! Enviámos um e-mail de boas-vindas/confirmação para a tua caixa de entrada.'
            : 'Conta criada com sucesso!',
      });
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao processar login.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setLoggedInEmail('');
    localStorage.removeItem('janley_client_email');
    window.dispatchEvent(new CustomEvent('janley:customer-auth'));
    setMessage({ type: 'success', text: 'Sessão terminada.' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200 space-y-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#d97706] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fdedea] text-[#d97706] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-title text-2xl font-bold text-[#33221e]">
                {loggedInEmail ? `Olá, ${clientName || loggedInEmail.split('@')[0]}!` : 'Área do Cliente'}
              </h2>
              <p className="text-xs text-[#735953]">
                Gere os teus favoritos, encomendas e dados na Janley Store
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#fae2dc] pb-2">
            <button
              onClick={() => setActiveTab('favoritos')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'favoritos'
                  ? 'bg-[#d97706] text-white shadow-2xs'
                  : 'bg-[#faf4f2] text-[#6d4f48] hover:bg-[#fdedea]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${activeTab === 'favoritos' ? 'fill-white' : 'fill-none'}`} />
              <span>Meus Favoritos ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('conta')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'conta'
                  ? 'bg-[#d97706] text-white shadow-2xs'
                  : 'bg-[#faf4f2] text-[#6d4f48] hover:bg-[#fdedea]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{loggedInEmail ? 'Perfil / Conta' : 'Iniciar Sessão'}</span>
            </button>

            <button
              onClick={() => setActiveTab('avaliar')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'avaliar'
                  ? 'bg-[#d97706] text-white shadow-2xs'
                  : 'bg-[#faf4f2] text-[#6d4f48] hover:bg-[#fdedea]'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Avaliar Compra</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenOrderTracking();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-[#faf4f2] text-[#6d4f48] hover:bg-[#fdedea] hover:text-[#d97706]"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Rastrear Encomenda</span>
            </button>
          </div>

          {/* Toast Message */}
          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* TAB 1: FAVORITOS */}
          {activeTab === 'favoritos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#735953]">
                <span>Peças 3D que guardaste para mais tarde:</span>
                <span className="font-semibold text-[#d97706]">{favoriteProducts.length} guardadas</span>
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#faf5f3] rounded-2xl border border-dashed border-[#fae2dc]">
                  <div className="w-12 h-12 rounded-full bg-[#fdedea] text-[#d97706] flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h3 className="font-bold text-[#33221e] text-sm">
                    Ainda não guardaste peças nos teus favoritos
                  </h3>
                  <p className="text-xs text-[#735953] max-w-xs mx-auto">
                    Clica no coração de qualquer produto para adicioná-lo aos teus favoritos.
                  </p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 bg-[#d97706] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:bg-[#e11d48] transition-colors cursor-pointer"
                  >
                    <span>Explorar Produtos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scroll">
                  {favoriteProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 bg-[#faf6f4] rounded-2xl border border-[#fae4e1] flex items-center gap-3 group hover:border-[#d97706]/40 transition-all"
                    >
                      <div
                        onClick={() => {
                          onClose();
                          onViewProductDetail(prod);
                        }}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#fae4e1] flex-shrink-0 cursor-pointer"
                      >
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          onClick={() => {
                            onClose();
                            onViewProductDetail(prod);
                          }}
                          className="font-bold text-xs text-[#33221e] hover:text-[#d97706] transition-colors truncate cursor-pointer"
                        >
                          {prod.name}
                        </h4>
                        <div className="text-[11px] text-[#735953] truncate">{prod.category}</div>
                        <div className="text-xs font-bold text-[#33221e] mt-1">
                          {prod.price > 0
                            ? `€ ${prod.price.toFixed(2).replace('.', ',')}${prod.price < 5 ? ' · Packs desde 3 un' : ''}`
                            : 'Sob consulta'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => {
                            if (prod.price >= 5) {
                              addToCart(prod, prod.colors[0], 1);
                            } else {
                              onClose();
                              onViewProductDetail(prod);
                            }
                          }}
                          className="p-2 bg-[#d97706] hover:bg-[#e11d48] text-white rounded-lg shadow-2xs transition-all cursor-pointer"
                          title={
                            prod.price >= 5
                              ? 'Adicionar ao Carrinho'
                              : prod.price > 0
                                ? 'Escolher Pack'
                                : 'Consultar Preço'
                          }
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(prod.id)}
                          className="p-2 bg-white hover:bg-red-50 text-red-500 rounded-lg border border-[#fae4e1] transition-all cursor-pointer"
                          title="Remover dos Favoritos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTA / LOGIN */}
          {activeTab === 'conta' && (
            <div>
              {loggedInEmail ? (
                <div className="space-y-4 p-5 bg-[#faf5f3] rounded-2xl border border-[#fae4e1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#735953]">Sessão iniciada como:</div>
                      <div className="font-bold text-base text-[#33221e]">{loggedInEmail}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-3.5 py-1.5 bg-white border border-[#fae2dc] hover:bg-red-50 hover:text-red-600 text-xs font-bold text-[#4a342f] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão</span>
                    </button>
                  </div>

                  <div className="text-xs text-[#735953] pt-2 border-t border-[#fae2dc] leading-relaxed">
                    Os teus favoritos e preferências de filamento são guardados automaticamente no teu perfil para as próximas compras na <strong>Janley Store</strong>.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#33221e]">
                      {isLoginMode ? 'Entrar com Email e Palavra-passe' : 'Criar Nova Conta de Cliente'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLoginMode(!isLoginMode)}
                      className="text-xs font-bold text-[#d97706] hover:underline cursor-pointer"
                    >
                      {isLoginMode ? 'Não tens conta? Criar conta' : 'Já tens conta? Entrar'}
                    </button>
                  </div>

                  {!isLoginMode && (
                    <div>
                      <label className="block text-xs font-bold text-[#33221e] mb-1">O teu Nome</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Ana Sofia"
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="o-teu-email@gmail.com"
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Palavra-passe</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d97706] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isLoginMode ? 'Entrar no Perfil' : 'Criar Conta de Cliente'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: AVALIAÇÃO PÓS-COMPRA (MINIMALISTA) */}
          {activeTab === 'avaliar' && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const targetProduct =
                  products.find((p) => p.id === reviewProductId) || products[0];
                if (!targetProduct || !reviewComment.trim()) return;
                setReviewSubmitting(true);
                setMessage(null);
                try {
                  await submitProductReview({
                    product_id: targetProduct.id,
                    product_name: targetProduct.name,
                    author_name:
                      clientName.trim() ||
                      (loggedInEmail ? loggedInEmail.split('@')[0] : 'Cliente Verificado'),
                    order_number: reviewOrderNum.trim(),
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                    photo_url: reviewPhoto,
                  });
                  setReviewComment('');
                  setReviewOrderNum('');
                  setReviewPhoto('');
                  setReviewRating(5);
                  setMessage({
                    type: 'success',
                    text: 'Avaliação pós-compra publicada com sucesso! Obrigado pela tua foto e feedback.',
                  });
                } catch (err: any) {
                  setMessage({
                    type: 'error',
                    text: err?.message || 'Erro ao enviar avaliação.',
                  });
                } finally {
                  setReviewSubmitting(false);
                }
              }}
              className="space-y-4 p-4 sm:p-5 bg-[#faf7f5] rounded-2xl border border-[#fae2dc]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#33221e]">
                    Avaliação Pós-Compra
                  </h3>
                  <p className="text-[11px] text-[#735953]">
                    Já recebeste a tua encomenda? Envia uma foto real, estrelas e comentário.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                      aria-label={`${star} estrelas`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-[#f59e0b] text-[#f59e0b]'
                            : 'text-[#d8c2bd]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#33221e] mb-1">
                    Produto Recebido
                  </label>
                  <select
                    value={reviewProductId || products[0]?.id || ''}
                    onChange={(e) => setReviewProductId(e.target.value)}
                    className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs outline-hidden text-[#33221e]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#33221e] mb-1">
                    N.º Encomenda (Opcional)
                  </label>
                  <input
                    type="text"
                    value={reviewOrderNum}
                    onChange={(e) => setReviewOrderNum(e.target.value)}
                    placeholder="Ex: JNLY-123456"
                    className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#33221e] mb-1">
                  O teu Comentário *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Conta-nos o que achaste do acabamento, cor e entrega..."
                  className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl p-3 text-xs outline-hidden resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#d8c2bd] hover:border-[#d97706] text-xs font-semibold text-[#5c3a1e] cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-[#d97706]" />
                    <span>{reviewPhoto ? 'Trocar foto real' : 'Enviar foto do produto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const compressed = await compressReviewPhoto(file);
                          setReviewPhoto(compressed);
                        } catch {
                          // ignore invalid image
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {reviewPhoto && (
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#fed7aa]">
                      <img src={reviewPhoto} alt="Produto recebido" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewPhoto('')}
                        className="absolute inset-0 bg-black/45 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-[#33221e] hover:bg-[#d97706] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {reviewSubmitting ? 'A publicar...' : 'Enviar Avaliação'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
