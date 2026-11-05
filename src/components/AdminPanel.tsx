import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Lock,
  Mail,
  LogOut,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Copy,
  Database,
  Code,
  Sparkles,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  getAllAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  uploadProductImage,
  SUPABASE_SCHEMA_SQL,
  DbProduct
} from '../lib/supabase';
import { CATEGORIES, JANLEY_COLORS } from '../data/products';

interface AdminPanelProps {
  onBackToShop: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToShop }) => {
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Products and table status state
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [isTableCreated, setIsTableCreated] = useState<boolean>(true);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlCode, setShowSqlCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal create/edit product state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Personalizados',
    categoryId: 'personalizados',
    description: '',
    dimensions: '',
    material: 'PLA Ecológico de Alta Precisão',
    is_featured: false,
    is_bestseller: false,
    is_hidden: false,
    images: [] as string[],
  });

  // Check Supabase session on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Fetch products safely without unhandled PGRST205
  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getAllAdminProducts();
      setProducts(result.products);
      setIsTableCreated(result.isTableCreated);
      if (result.error && result.isTableCreated) {
        showToast('error', result.error);
      }
    } catch (err: any) {
      console.warn('Info ao carregar produtos:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [session]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    showToast('success', 'Script SQL copiado com sucesso! Cola-o no SQL Editor do Supabase.');
    setTimeout(() => setCopiedSql(false), 4000);
  };

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (!isSupabaseConfigured) {
      setAuthError('Configuração pendente: Por favor adiciona as chaves do Supabase no ficheiro .env');
      setAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setSession(data.session);
        showToast('success', 'Sessão iniciada com sucesso!');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao iniciar sessão.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // Open modal for new product
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'Personalizados',
      categoryId: 'personalizados',
      description: '',
      dimensions: 'Sob medida',
      material: 'PLA Ecológico de Alta Precisão',
      is_featured: false,
      is_bestseller: false,
      is_hidden: false,
      images: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (prod: DbProduct) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: String(prod.price),
      category: prod.category,
      categoryId: prod.category_id || 'outros',
      description: prod.description || '',
      dimensions: prod.dimensions || '',
      material: prod.material || 'PLA Ecológico de Alta Precisão',
      is_featured: prod.is_featured,
      is_bestseller: prod.is_bestseller,
      is_hidden: prod.is_hidden,
      images: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : prod.image ? [prod.image] : [],
    });
    setIsModalOpen(true);
  };

  // Toggle visibility
  const handleToggleVisibility = async (prod: DbProduct) => {
    try {
      const newStatus = await toggleProductVisibility(prod.id, prod.is_hidden);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, is_hidden: newStatus } : p))
      );
      showToast('success', `Produto "${prod.name}" agora está ${newStatus ? 'Oculto' : 'Visível na Loja'}.`);
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao alterar visibilidade.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (prod: DbProduct) => {
    if (!window.confirm(`Tens a certeza que desejas eliminar o produto "${prod.name}" permanentemente?`)) {
      return;
    }

    try {
      await deleteProduct(prod.id);
      setProducts((prev) => prev.filter((p) => p.id !== prod.id));
      showToast('success', `Produto "${prod.name}" eliminado com sucesso.`);
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao eliminar produto.');
    }
  };

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        if (isSupabaseConfigured) {
          const publicUrl = await uploadProductImage(file);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, publicUrl],
          }));
        } else {
          // Local data URL preview if credentials not yet configured
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setFormData((prev) => ({
                ...prev,
                images: [...prev.images, event.target!.result as string],
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      } catch (err: any) {
        showToast('error', `Falha ao carregar imagem: ${err.message}`);
      }
    }
  };

  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'O nome do produto é obrigatório.');
      return;
    }
    const numPrice = parseFloat(formData.price.replace(',', '.'));
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast('error', 'Insere um preço em euros válido.');
      return;
    }

    setSubmitting(true);
    try {
      const primaryImage = formData.images[0] || '/images/prod_suporte_telemovel.png';

      const payload = {
        name: formData.name.trim(),
        price: numPrice,
        category: formData.category,
        category_id: formData.categoryId,
        description: formData.description.trim(),
        dimensions: formData.dimensions.trim(),
        material: formData.material.trim(),
        is_featured: formData.is_featured,
        is_bestseller: formData.is_bestseller,
        is_hidden: formData.is_hidden,
        images: formData.images,
        image: primaryImage,
        colors: JANLEY_COLORS,
        rating: editingProduct?.rating || 5.0,
        reviews_count: editingProduct?.reviews_count || 0,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast('success', `Produto "${formData.name}" atualizado com sucesso!`);
      } else {
        await createProduct(payload);
        showToast('success', `Novo produto "${formData.name}" adicionado com sucesso!`);
      }

      setIsModalOpen(false);
      await loadProducts();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao guardar produto.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'todas' || p.category_id === filterCategory || p.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#fcf8f7] text-[#33221e] antialiased">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
            feedbackMessage.type === 'success'
              ? 'bg-[#33221e] text-white border border-[#d97706]'
              : 'bg-red-600 text-white'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-white" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#fae4e1] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="p-2 rounded-xl text-[#664b45] hover:text-[#d97706] hover:bg-[#fdedea] transition-colors cursor-pointer"
              title="Voltar à Loja Pública"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <img
              src="/assets/aistudio/LOGO_JANLEY_ofc.pdf_52899af3.png"
              alt="Janley Store"
              className="h-12 w-auto object-contain hidden sm:block"
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-title text-lg sm:text-xl font-bold text-[#33221e]">
                  Painel de Administração
                </h1>
                <span className="text-[10px] font-bold bg-[#fdedea] text-[#d97706] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-[#735953] hidden sm:block">
                Gestão profissional do catálogo 3D e integração com Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="px-3.5 py-2 rounded-xl border border-[#fae4e1] text-xs font-bold text-[#4a342f] hover:bg-[#faf4f2] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d97706]" />
              <span className="hidden sm:inline">Ver Loja Pública</span>
            </button>

            {session && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-[#faf4f2] hover:bg-[#fdedea] text-[#d97706] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Terminar sessão"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Supabase Status Banner when NOT configured */}
        {!isSupabaseConfigured ? (
          <div className="bg-[#fff9f8] border-2 border-[#fbdad2] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fdedea] text-[#d97706] flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-[#33221e]">
                  Supabase Free: Aguardando Configuração de Credenciais
                </h2>
                <p className="text-xs sm:text-sm text-[#664b45] leading-relaxed">
                  Para guardar produtos, fotografias e utilizadores autorizados numa base de dados definitiva sem produtos fictícios, conecta o teu projeto Supabase gratuito.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#fae2dc] text-xs space-y-2">
              <div className="font-bold text-[#33221e]">Passos para ativação:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-[#735953]">
                <li>Cria uma conta ou projeto gratuito em <strong>supabase.com</strong>.</li>
                <li>No teu projeto, vai a <strong>Project Settings &gt; API</strong> e copia a <strong>URL</strong> e a <strong>anon public key</strong>.</li>
                <li>Adiciona as variáveis no teu ambiente:
                  <code className="block bg-[#faf4f2] text-[#d97706] p-2 rounded-lg mt-1 font-mono text-[11px]">
                    VITE_SUPABASE_URL=https://teu-projeto.supabase.co<br />
                    VITE_SUPABASE_ANON_KEY=tua-chave-anonima-aqui
                  </code>
                </li>
                <li>Vai ao <strong>SQL Editor</strong> do Supabase e executa o script SQL para criar a tabela de produtos e o bucket de fotografias.</li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copiado!' : 'Copiar Script SQL'}</span>
              </button>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#3ECF8E] hover:bg-[#34b27b] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <span>Abrir Supabase.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-[#735953]">
                O site continua 100% operacional no modo de preparação.
              </span>
            </div>
          </div>
        ) : !isTableCreated ? (
          /* Table 'products' missing setup banner */
          <div className="bg-[#fffbeb] border-2 border-[#fcd34d] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-[#d97706] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Supabase Conectado
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Passo Final: Criar Tabela 'products'
                    </span>
                  </div>
                  <h2 className="font-serif-title text-base sm:text-lg font-bold text-[#3d2314]">
                    Executa o Script SQL no Supabase para ativar o banco de dados
                  </h2>
                  <p className="text-xs text-[#78350f] mt-0.5 leading-relaxed max-w-2xl">
                    As tuas chaves do Supabase foram reconhecidas! Falta apenas criar a tabela <strong>products</strong> e o bucket <strong>product-images</strong> executando o script SQL no teu SQL Editor do Supabase:
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex-1 sm:flex-initial bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-white stroke-[2.5]" />
                      <span>Script Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Script SQL</span>
                    </>
                  )}
                </button>

                <a
                  href="https://supabase.com/dashboard/project/_/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-initial bg-[#3ECF8E] hover:bg-[#34b27b] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Abrir SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="bg-white hover:bg-[#fef8ed] border border-[#fed7aa] text-[#b45309] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Verificar se a tabela já foi criada no Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d97706]' : ''}`} />
                  <span>Verificar Tabela</span>
                </button>
              </div>
            </div>

            <div className="bg-white/80 rounded-2xl p-4 border border-[#fde68a] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3d2314]">Instruções rápidas (em 3 passos):</span>
                <button
                  type="button"
                  onClick={() => setShowSqlCode(!showSqlCode)}
                  className="text-[11px] font-bold text-[#d97706] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Code className="w-3 h-3" />
                  <span>{showSqlCode ? 'Ocultar código SQL' : 'Pré-visualizar código SQL'}</span>
                </button>
              </div>

              <ol className="list-decimal list-inside space-y-1 text-[#5c3a1e] text-[12px]">
                <li>Clica em <strong>"Copiar Script SQL"</strong> acima.</li>
                <li>Clica em <strong>"Abrir SQL Editor"</strong> e cola o código na janela do Supabase.</li>
                <li>Clica no botão verde <strong>"Run"</strong> no Supabase e volta aqui para clicar em <strong>"Verificar Tabela"</strong>.</li>
              </ol>

              {showSqlCode && (
                <div className="pt-2">
                  <pre className="p-3 bg-[#2d1b10] text-[#fde68a] rounded-xl text-[11px] overflow-x-auto font-mono max-h-52 custom-scroll">
                    {SUPABASE_SCHEMA_SQL}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Authentication Screen */}
        {isSupabaseConfigured && !session ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#fae4e1] shadow-xl space-y-6 my-10">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#fdedea] text-[#d97706] flex items-center justify-center mx-auto shadow-2xs">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="font-serif-title text-2xl font-bold text-[#33221e]">
                Acesso Administrativo
              </h2>
              <p className="text-xs text-[#735953]">
                Inicia sessão com a tua conta autorizada Supabase para gerir o catálogo da Janley Store.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#33221e] mb-1">
                  Email de Administrador
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@janleystore.com"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#33221e] mb-1">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8c6760] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Entrar no Painel</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setSession({ user: { email: 'admin@janleystore.pt' } })}
                  className="text-xs text-[#78350f] hover:text-[#d97706] font-semibold underline cursor-pointer"
                >
                  Explorar Painel em Modo Demonstração
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Admin Dashboard: Product Management */}
        {(session || !isSupabaseConfigured) && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs">
                <span className="text-[11px] font-bold text-[#735953] uppercase tracking-wider">Total Produtos</span>
                <div className="text-2xl font-bold text-[#33221e] mt-1">{products.length}</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Visíveis na Loja</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {products.filter((p) => !p.is_hidden).length}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Ocultos</span>
                <div className="text-2xl font-bold text-amber-700 mt-1">
                  {products.filter((p) => p.is_hidden).length}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs">
                <span className="text-[11px] font-bold text-[#d97706] uppercase tracking-wider">Categorias</span>
                <div className="text-2xl font-bold text-[#d97706] mt-1">{CATEGORIES.length}</div>
              </div>
            </div>

            {/* Actions Bar: Search, Category Filter, Add Button */}
            <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#8c6760] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar produtos..."
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl pl-9 pr-3 py-1.5 text-xs outline-hidden"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-48 bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3 py-1.5 text-xs outline-hidden text-[#33221e]"
                >
                  <option value="todas">Todas as Categorias</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadProducts}
                  className="p-2.5 rounded-xl border border-[#fae4e1] text-[#735953] hover:text-[#d97706] hover:bg-[#fdedea] transition-colors cursor-pointer"
                  title="Atualizar lista"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d97706]' : ''}`} />
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="bg-[#d97706] hover:bg-[#e11d48] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Adicionar Produto</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#fae4e1] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf5f3] border-b border-[#fae4e1] text-[#6d4f48] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Produto</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Preço (€)</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fbedea]">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#735953]">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#d97706] mb-2" />
                          <span>A carregar catálogo de produtos...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-[#735953]">
                          Nenhum produto encontrado. Clica em "Adicionar Produto" para começar.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const thumb = (prod.images && prod.images[0]) || prod.image || '/images/prod_suporte_telemovel.png';
                        return (
                          <tr key={prod.id} className="hover:bg-[#fef9f8] transition-colors">
                            {/* Product Info with Thumbnail */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#faf4f2] border border-[#fae4e1] overflow-hidden flex-shrink-0">
                                  <img src={thumb} alt={prod.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[#33221e] truncate max-w-xs">{prod.name}</div>
                                  <div className="text-[11px] text-[#735953] truncate max-w-xs">{prod.dimensions || 'Dimensões padrão'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4">
                              <span className="bg-[#faf4f2] text-[#6d4f48] font-semibold px-2.5 py-1 rounded-full border border-[#f5ded9]">
                                {prod.category}
                              </span>
                            </td>

                            {/* Price in Euros */}
                            <td className="py-3 px-4 font-bold text-sm text-[#33221e]">
                              € {Number(prod.price).toFixed(2).replace('.', ',')}
                            </td>

                            {/* Visibility Badge */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleVisibility(prod)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                  prod.is_hidden
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                }`}
                                title={prod.is_hidden ? 'Clica para tornar Visível na Loja' : 'Clica para Ocultar da Loja'}
                              >
                                {prod.is_hidden ? (
                                  <>
                                    <EyeOff className="w-3 h-3" />
                                    <span>Oculto</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3" />
                                    <span>Visível</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(prod)}
                                  className="p-1.5 rounded-lg text-[#6d4f48] hover:text-[#d97706] hover:bg-[#fdedea] transition-colors cursor-pointer"
                                  title="Editar Produto"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod)}
                                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Eliminar Produto"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Create or Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#d97706] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif-title text-2xl font-bold text-[#33221e] mb-1">
                {editingProduct ? 'Editar Produto' : 'Novo Produto 3D'}
              </h2>
              <p className="text-xs text-[#735953] mb-6">
                Preenche os dados para guardar no Supabase e publicar na loja pública.
              </p>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Letreiro 3D com Nome Personalizado"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Preço em Euros (€) *</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex: 14.90"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden font-bold"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Categoria *</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const selected = CATEGORIES.find((c) => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          category: selected ? selected.name : 'Personalizados',
                        });
                      }}
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden text-[#33221e]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Descrição do Produto</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreve o design, acabamento e utilidade da peça..."
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl p-3 text-sm outline-hidden"
                    />
                  </div>

                  {/* Dimensions */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Dimensões</label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="Ex: 15.0 x 10.0 x 8.0 cm"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden"
                    />
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="Ex: PLA Ecológico Biodegradável"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden"
                    />
                  </div>
                </div>

                {/* Multiple Photographs Upload */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Fotografias do Produto (Carregamento para Supabase Storage)
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#fae4e1] group">
                        <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== idx)
                          })}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#e5c5be] hover:border-[#d97706] flex flex-col items-center justify-center text-[#735953] hover:text-[#d97706] transition-colors cursor-pointer bg-[#faf7f5]">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold">+ Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Visibility and Featured checkboxes */}
                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#fae2dc] text-xs">
                  <label className="flex items-center gap-2 font-semibold text-[#33221e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_hidden}
                      onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                      className="w-4 h-4 accent-[#d97706]"
                    />
                    <span>Ocultar produto da loja pública</span>
                  </label>

                  <label className="flex items-center gap-2 font-semibold text-[#33221e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-[#d97706]"
                    />
                    <span>Destacar na Página Inicial</span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-[#d8c2bd] text-xs font-bold text-[#4a342f] hover:bg-[#faf7f5] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#d97706] hover:bg-[#e11d48] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{editingProduct ? 'Atualizar Produto' : 'Guardar no Supabase'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
