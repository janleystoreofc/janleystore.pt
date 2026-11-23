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
  Check,
  Truck,
  Lightbulb,
  Send,
  Download,
  UserCheck,
  Type,
  Star
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  getAllAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  toggleProductCustomizable,
  uploadProductImage,
  getCustomerSuggestions,
  deleteCustomerSuggestion,
  getCustomerLeads,
  updateCustomerLeadStatus,
  deleteCustomerLead,
  getProductReviews,
  deleteProductReview,
  getTrackedOrders,
  upsertTrackedOrder,
  deleteTrackedOrder,
  getStorePickupSettings,
  saveStorePickupSettings,
  SUPABASE_SCHEMA_SQL,
  DbProduct,
  DbCustomerSuggestion,
  DbCustomerLead,
  DbProductReview,
  DbTrackedOrder,
  DeliveryMethodType,
  OrderStage
} from '../lib/supabase';
import { JANLEY_COLORS, VASO_COLORS } from '../data/products';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface AdminPanelProps {
  onBackToShop: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToShop }) => {
  const {
    cttEnabled,
    savingCttSetting,
    toggleCttEnabled,
    customCategories,
    allCategories,
    savingCategory,
    addCategory,
    removeCategory,
  } = useStoreSettings();
  // Auth state
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Products and table status state
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [suggestions, setSuggestions] = useState<DbCustomerSuggestion[]>([]);
  const [suggestionsTableCreated, setSuggestionsTableCreated] = useState<boolean>(true);
  const [customerLeads, setCustomerLeads] = useState<DbCustomerLead[]>([]);
  const [leadsTableCreated, setLeadsTableCreated] = useState<boolean>(true);
  const [productReviews, setProductReviews] = useState<DbProductReview[]>([]);
  const [reviewsTableCreated, setReviewsTableCreated] = useState<boolean>(true);
  const [trackedOrders, setTrackedOrders] = useState<DbTrackedOrder[]>([]);
  const [ordersTableCreated, setOrdersTableCreated] = useState<boolean>(true);
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupNote, setPickupNote] = useState('');
  const [savingPickup, setSavingPickup] = useState(false);

  // Admin Order Editor Form
  const [orderForm, setOrderForm] = useState<{
    order_number: string;
    delivery_method: DeliveryMethodType;
    client_name: string;
    destination: string;
    product_name: string;
    stage: OrderStage;
    tracking_code: string;
    uber_fee: string;
    uber_ok: boolean;
    uber_dispatched: boolean;
    uber_note: string;
    pickup_address: string;
    pickup_note: string;
  }>({
    order_number: '',
    delivery_method: 'ctt',
    client_name: '',
    destination: '',
    product_name: '',
    stage: 'Queued',
    tracking_code: '',
    uber_fee: '',
    uber_ok: false,
    uber_dispatched: false,
    uber_note: '',
    pickup_address: '',
    pickup_note: '',
  });
  const [savingOrder, setSavingOrder] = useState(false);

  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<
    'welcome10' | 'novidades' | 'guimaraes15' | 'personalizado'
  >('welcome10');
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

  // Modal create custom category state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);

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
    is_customizable: false,
    rating: '5.0',
    reviews_count: '0',
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

  // Fetch products & suggestions safely without unhandled PGRST205
  const loadProducts = async () => {
    setLoading(true);
    try {
      const [result, sugResult, leadsResult, reviewsResult, ordersResult, pickupRes] = await Promise.all([
        getAllAdminProducts(),
        getCustomerSuggestions(),
        getCustomerLeads(),
        getProductReviews(),
        getTrackedOrders(),
        getStorePickupSettings(),
      ]);
      setProducts(result.products);
      setIsTableCreated(result.isTableCreated);
      setSuggestions(sugResult.suggestions);
      setSuggestionsTableCreated(sugResult.isTableCreated);
      setCustomerLeads(leadsResult.leads);
      setLeadsTableCreated(leadsResult.isTableCreated);
      setProductReviews(reviewsResult.reviews);
      setReviewsTableCreated(reviewsResult.isTableCreated);
      setTrackedOrders(ordersResult.orders);
      setOrdersTableCreated(ordersResult.isTableCreated);
      setPickupAddress(pickupRes.address);
      setPickupNote(pickupRes.note);
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

  const buildMailtoHref = (
    lead: DbCustomerLead,
    template: 'welcome10' | 'novidades' | 'guimaraes15' | 'personalizado'
  ) => {
    const firstName = lead.name ? lead.name.split(' ')[0] : 'Cliente';
    const storeUrl = typeof window !== 'undefined' ? window.location.origin : 'https://janleystore.pt';

    let subject = 'Convite especial da Janley Store 3D';
    let body = '';

    if (template === 'welcome10') {
      subject = `Olá ${firstName}! 10% de desconto na tua 1.ª peça 3D — Janley Store`;
      body = `Olá ${firstName},\n\nObrigado por visitares e registares-te na Janley Store (Impressão 3D em Guimarães)!\n\nPara te ajudar a escolher a tua primeira peça, oferecemos o cupão JANLEY10 com 10% de desconto em toda a loja.\n\nExplora o catálogo aqui: ${storeUrl}\n\nQualquer dúvida ou ideia personalizada, responde a este e-mail ou fala connosco no WhatsApp (+351 935 742 686).\n\nCom os melhores cumprimentos,\nJanley Store`;
    } else if (template === 'novidades') {
      subject = `Novas peças em Impressão 3D na Janley Store, ${firstName}!`;
      body = `Olá ${firstName},\n\nTemos novas criações em impressão 3D ecológica (chaveiros, organização, decoração e lembranças para eventos) disponíveis no nosso catálogo!\n\nVê todas as novidades aqui: ${storeUrl}\n\nLembra-te que podes encomendar em packs promocionais ou pedir peças 100% personalizadas com o teu nome ou logótipo.\n\nAté já,\nJanley Store — Guimarães`;
    } else if (template === 'guimaraes15') {
      subject = `Oferta Especial 15% OFF (Cupão GUIMARAES) — Janley Store`;
      body = `Olá ${firstName},\n\nPreparamos um mimo especial para ti: usa o cupão GUIMARAES e recebe 15% de desconto na tua próxima encomenda na Janley Store!\n\nAcede à loja: ${storeUrl}\n\nSe preferires recolha em Guimarães ou entrega rápida por Uber Flash, seleciona essa opção no checkout.\n\nCom os melhores cumprimentos,\nJanley Store`;
    } else {
      subject = `Cria a tua peça 3D personalizada — Janley Store`;
      body = `Olá ${firstName},\n\nTens alguma ideia em mente para um presente, evento ou peça útil em casa? Na Janley Store fazemos impressão 3D por medida e sob consulta!\n\nEnvia-nos a tua ideia aqui: ${storeUrl}\nOu responde diretamente a este e-mail para prepararmos um orçamento sem compromisso.\n\nCom os melhores cumprimentos,\nJanley Store`;
    }

    return `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleMarkInvited = async (lead: DbCustomerLead) => {
    const now = new Date().toISOString();
    setCustomerLeads((prev) =>
      prev.map((item) =>
        item.id === lead.id
          ? { ...item, follow_up_status: 'enviado', last_contacted_at: now }
          : item
      )
    );
    await updateCustomerLeadStatus(lead.id, 'enviado', true);
    showToast('success', `Rascunho de convite aberto para ${lead.email}. Estado marcado como "Convidado".`);
  };

  const handleChangeLeadStatus = async (
    leadId: string,
    status: 'pendente' | 'enviado' | 'interessado'
  ) => {
    setCustomerLeads((prev) =>
      prev.map((item) => (item.id === leadId ? { ...item, follow_up_status: status } : item))
    );
    await updateCustomerLeadStatus(leadId, status, status === 'enviado');
    showToast('success', 'Estado do cliente atualizado.');
  };

  const handleCopyAllLeadEmails = () => {
    if (customerLeads.length === 0) return;
    const list = customerLeads.map((l) => l.email).join(', ');
    navigator.clipboard.writeText(list);
    showToast('success', `${customerLeads.length} e-mails copiados para a área de transferência!`);
  };

  const handleExportLeadsCsv = () => {
    if (customerLeads.length === 0) return;
    const header = 'Nome,Email,Origem,Acessos,Estado,Ultimo Acesso,Ultimo Convite\n';
    const rows = customerLeads
      .map((l) => {
        const safe = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
        return [
          safe(l.name || 'Cliente'),
          safe(l.email),
          safe(l.source),
          l.login_count || 1,
          safe(l.follow_up_status),
          safe(l.last_seen_at),
          safe(l.last_contacted_at || ''),
        ].join(',');
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `janley-clientes-logins-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Lista de contactos exportada em CSV!');
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
      is_customizable: false,
      rating: '5.0',
      reviews_count: '0',
      images: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (prod: DbProduct) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: Number(prod.price) > 0 ? String(prod.price) : '',
      category: prod.category,
      categoryId: prod.category_id || 'outros',
      description: prod.description || '',
      dimensions: prod.dimensions || '',
      material: prod.material || 'PLA Ecológico de Alta Precisão',
      is_featured: prod.is_featured,
      is_bestseller: prod.is_bestseller,
      is_hidden: prod.is_hidden,
      is_customizable: Boolean(prod.is_customizable),
      rating: prod.rating !== undefined && prod.rating !== null ? String(prod.rating) : '5.0',
      reviews_count:
        prod.reviews_count !== undefined && prod.reviews_count !== null
          ? String(prod.reviews_count)
          : '0',
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

  // Toggle name customization field availability
  const handleToggleCustomizable = async (prod: DbProduct) => {
    try {
      const newStatus = await toggleProductCustomizable(prod.id, Boolean(prod.is_customizable));
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, is_customizable: newStatus } : p))
      );
      showToast(
        'success',
        newStatus
          ? `"${prod.name}" marcado como Personalizado (campo de nome ativo na loja).`
          : `"${prod.name}" alterado para Padrão (campo de nome oculto).`
      );
    } catch (err: any) {
      showToast('error', err?.message || 'Erro ao alterar personalização.');
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

  // Upload category image handler
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCatImage(true);
    try {
      if (isSupabaseConfigured) {
        const publicUrl = await uploadProductImage(file);
        setCatImage(publicUrl);
      } else {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) resolve(event.target.result as string);
            else reject(new Error('Falha ao ler imagem'));
          };
          reader.onerror = () => reject(new Error('Falha ao ler imagem'));
          reader.readAsDataURL(file);
        });
        setCatImage(dataUrl);
      }
    } catch (err: any) {
      showToast('error', `Falha ao carregar imagem da categoria: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setUploadingCatImage(false);
    }
  };

  // Create custom category handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('error', 'Insere o nome da nova categoria.');
      return;
    }

    try {
      const created = await addCategory({
        name: catName,
        description: catDescription,
        image: catImage || undefined,
      });
      if (isModalOpen) {
        setFormData((prev) => ({
          ...prev,
          categoryId: created.id,
          category: created.name,
        }));
      }
      setCatName('');
      setCatDescription('');
      setCatImage('');
      setIsCategoryModalOpen(false);
      showToast('success', `Categoria "${created.name}" criada! Já está visível na loja e pronta para novos produtos.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Erro ao criar categoria.');
    }
  };

  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('error', 'O nome do produto é obrigatório.');
      return;
    }
    const trimmedPrice = formData.price.trim();
    let numPrice = 0;
    if (trimmedPrice !== '') {
      numPrice = parseFloat(trimmedPrice.replace(',', '.'));
      if (isNaN(numPrice) || numPrice < 0) {
        showToast('error', 'Insere um preço em euros válido ou deixa vazio para "Sob Consulta".');
        return;
      }
    }

    setSubmitting(true);
    try {
      const primaryImage = formData.images[0] || '/images/prod_suporte_telemovel.png';

      const isVase =
        Boolean(
          (editingProduct && (editingProduct.id.toLowerCase().includes('vaso') || editingProduct.name.toLowerCase().includes('vaso'))) ||
          (!editingProduct && formData.name.toLowerCase().includes('vaso'))
        );

      const productColors = isVase
        ? (editingProduct?.colors && editingProduct.colors.some(c => c.sampleImage) ? editingProduct.colors : VASO_COLORS)
        : (editingProduct?.colors
            ? editingProduct.colors.map(c => {
                if (c.sampleImage && (c.sampleImage.toLowerCase().includes('vaso') || (editingProduct && !c.sampleImage.includes(editingProduct.id)))) {
                  const { sampleImage, ...cleanColor } = c;
                  return cleanColor;
                }
                return c;
              })
            : JANLEY_COLORS);

      const rawReviewsInput = Number(formData.reviews_count);
      const exactReviewsCount =
        !isNaN(rawReviewsInput) && rawReviewsInput >= 0 ? Math.floor(rawReviewsInput) : 0;

      const rawRatingInput = parseFloat(String(formData.rating || '5.0').replace(',', '.'));
      const exactRating =
        !isNaN(rawRatingInput) && rawRatingInput >= 1 && rawRatingInput <= 5
          ? Number(rawRatingInput.toFixed(1))
          : 5.0;

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
        is_customizable: formData.is_customizable,
        images: formData.images,
        image: primaryImage,
        colors: productColors,
        rating: exactRating,
        reviews_count: exactReviewsCount,
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
                <li>No teu projeto, vai a <strong>Project Settings &gt; API</strong> e copia a <strong>URL</strong> e a <strong>anon public / publishable key</strong>.</li>
                <li>Adiciona as variáveis no teu ambiente (Vercel ou .env):
                  <code className="block bg-[#faf4f2] text-[#d97706] p-2 rounded-lg mt-1 font-mono text-[11px]">
                    VITE_SUPABASE_URL=https://teu-projeto.supabase.co<br />
                    VITE_SUPABASE_PUBLISHABLE_KEY=tua-chave-aqui (ou VITE_SUPABASE_ANON_KEY)
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
                <div className="text-2xl font-bold text-[#d97706] mt-1">{allCategories.length}</div>
              </div>
            </div>

            {/* Delivery Mode Control: CTT Toggle */}
            <div
              className={`rounded-2xl p-4 sm:p-5 border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                cttEnabled
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-amber-50/80 border-amber-200'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                    cttEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-[#33221e]">
                      Estado das Entregas por CTT
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        cttEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {cttEnabled ? 'CTT Ativo' : 'Só Uber & Recolha'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5e433d] mt-1">
                    {cttEnabled
                      ? 'A loja está a aceitar envios nacionais por CTT Expresso, além de Uber Flash e Recolha em Guimarães.'
                      : 'Os envios por CTT estão pausados. Os clientes veem apenas Uber Flash e Recolha na Loja.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={savingCttSetting}
                onClick={async () => {
                  try {
                    const next = await toggleCttEnabled();
                    showToast(
                      'success',
                      next
                        ? 'Envios por CTT ATIVADOS na loja!'
                        : 'Envios por CTT DESATIVADOS — loja agora apenas com Uber Flash e Recolha.'
                    );
                  } catch (err: any) {
                    showToast('error', err?.message || 'Erro ao atualizar modo de entrega.');
                  }
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 flex-shrink-0 ${
                  cttEnabled
                    ? 'bg-white border border-amber-300 text-amber-800 hover:bg-amber-50'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {savingCttSetting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
                <span>
                  {cttEnabled ? 'Desativar CTT (Só Uber / Recolha)' : 'Ativar Entregas por CTT'}
                </span>
              </button>
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
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={loadProducts}
                  className="p-2.5 rounded-xl border border-[#fae4e1] text-[#735953] hover:text-[#d97706] hover:bg-[#fdedea] transition-colors cursor-pointer"
                  title="Atualizar lista"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#d97706]' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="bg-[#fff7ed] hover:bg-[#ffedd5] border border-[#fed7aa] text-[#b45309] font-bold text-xs uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Nova Categoria</span>
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

            {/* Custom Categories Strip (when admin created categories exist) */}
            {customCategories.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-[#fae4e1] shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d97706]" />
                    <h3 className="text-xs font-bold text-[#33221e] uppercase tracking-wider">
                      Categorias Criadas por Ti ({customCategories.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-[#d97706] hover:underline cursor-pointer"
                  >
                    + Criar outra
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {customCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2.5 bg-[#faf7f5] border border-[#fae4e1] rounded-xl pl-2 pr-2.5 py-1.5"
                    >
                      <img
                        src={cat.image || '/images/cat_outros.jpg'}
                        alt={cat.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#e7cfc9]"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#33221e] leading-tight">{cat.name}</div>
                        {cat.description && (
                          <div className="text-[10px] text-[#735953] truncate max-w-[160px]">{cat.description}</div>
                        )}
                      </div>
                      {confirmDeleteCatId === cat.id ? (
                        <div className="flex items-center gap-1 ml-1">
                          <button
                            type="button"
                            disabled={savingCategory}
                            onClick={async () => {
                              try {
                                await removeCategory(cat.id);
                                setConfirmDeleteCatId(null);
                                showToast('success', `Categoria "${cat.name}" removida.`);
                              } catch (err: any) {
                                showToast('error', err?.message || 'Erro ao remover categoria.');
                              }
                            }}
                            className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg cursor-pointer"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCatId(null)}
                            className="text-[10px] font-bold text-[#735953] hover:text-[#33221e] px-1.5 py-1 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteCatId(cat.id)}
                          className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer ml-1"
                          title={`Remover categoria "${cat.name}"`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

                            {/* Price in Euros or Sob Consulta */}
                            <td className="py-3 px-4 font-bold text-sm text-[#33221e]">
                              {Number(prod.price) > 0 ? (
                                `€ ${Number(prod.price).toFixed(2).replace('.', ',')}`
                              ) : (
                                <span className="text-xs font-semibold text-[#b45309]">
                                  Sob Consulta
                                </span>
                              )}
                            </td>

                            {/* Visibility & Name Customization Badges */}
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
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

                                <button
                                  type="button"
                                  onClick={() => handleToggleCustomizable(prod)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                    prod.is_customizable
                                      ? 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a] hover:bg-[#fde68a]/60'
                                      : 'bg-[#faf4f2] text-[#8c6760] border border-[#f5ded9] hover:bg-[#f3e6e2]'
                                  }`}
                                  title={
                                    prod.is_customizable
                                      ? 'Campo de nome ativo — clica para desativar'
                                      : 'Sem campo de nome — clica para permitir personalizar com nome'
                                  }
                                >
                                  <Type className="w-3 h-3" />
                                  <span>{prod.is_customizable ? 'Com Nome' : 'Sem Nome'}</span>
                                </button>
                              </div>
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

            {/* Customer Login History & Email Invitation Panel */}
            <div className="bg-white rounded-3xl border border-[#fae4e1] shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#33221e]">
                      Histórico de Logins, Cadastros &amp; Convites por E-mail ({customerLeads.length})
                    </h3>
                    <p className="text-[11px] text-[#735953]">
                      Regista automaticamente quem cria conta, inicia sessão, subscreve a newsletter ou inicia o checkout para enviares convites personalizados.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedEmailTemplate}
                    onChange={(e) =>
                      setSelectedEmailTemplate(
                        e.target.value as 'welcome10' | 'novidades' | 'guimaraes15' | 'personalizado'
                      )
                    }
                    className="bg-[#faf7f5] border border-[#d8c2bd] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#33221e] outline-hidden"
                    title="Modelo de e-mail para o botão Convidar"
                  >
                    <option value="welcome10">Modelo: Boas-vindas + JANLEY10 (-10%)</option>
                    <option value="novidades">Modelo: Novidades em Impressão 3D</option>
                    <option value="guimaraes15">Modelo: Cupão GUIMARAES (-15%)</option>
                    <option value="personalizado">Modelo: Convite Peça Personalizada</option>
                  </select>

                  {customerLeads.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleCopyAllLeadEmails}
                        className="inline-flex items-center gap-1.5 bg-[#faf4f2] hover:bg-[#fdedea] border border-[#fae2dc] text-[#33221e] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>Copiar E-mails</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportLeadsCsv}
                        className="inline-flex items-center gap-1.5 bg-[#faf4f2] hover:bg-[#fdedea] border border-[#fae2dc] text-[#33221e] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>Exportar CSV</span>
                      </button>
                    </>
                  )}

                  {!leadsTableCreated && isSupabaseConfigured && (
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL (Ativar tabela de logins)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Info about Automation */}
              <div className="rounded-2xl bg-[#faf7f5] border border-[#fae4e1] px-4 py-3 text-[11px] text-[#5e433d] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <strong>Notificação automática no site:</strong> Clientes com sessão iniciada recebem automaticamente uma notificação com o cupão <strong>JANLEY10</strong> na loja enquanto não finalizam encomenda. Novos registos recebem também o e-mail oficial do Supabase Auth.
                </span>
                <div className="flex items-center gap-2 shrink-0 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Pendentes: {customerLeads.filter((l) => l.follow_up_status === 'pendente').length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Convidados: {customerLeads.filter((l) => l.follow_up_status === 'enviado').length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Interessados: {customerLeads.filter((l) => l.follow_up_status === 'interessado').length}
                  </span>
                </div>
              </div>

              {customerLeads.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#735953] bg-[#faf7f5] rounded-2xl border border-[#fae4e1]">
                  {leadsTableCreated
                    ? 'Ainda não há registos de login, cadastro ou newsletter. Assim que um visitante entrar ou deixar o e-mail, aparecerá aqui.'
                    : 'Para sincronizar o histórico de logins entre dispositivos na base de dados, executa o bloco SQL nº 11 (customer_leads) no Supabase.'}
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#fae4e1] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#faf5f3] border-b border-[#fae4e1] text-[#6d4f48] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-3 px-4">Cliente / E-mail</th>
                        <th className="py-3 px-4">Origem</th>
                        <th className="py-3 px-4">Acessos</th>
                        <th className="py-3 px-4">Última Atividade</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Convidar / Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#fbedea]">
                      {customerLeads.map((lead) => {
                        const sourceLabel =
                          lead.source === 'signup'
                            ? 'Cadastro'
                            : lead.source === 'login'
                              ? 'Login'
                              : lead.source === 'newsletter'
                                ? 'Newsletter'
                                : lead.source === 'checkout'
                                  ? 'Checkout'
                                  : lead.source;

                        return (
                          <tr key={lead.id} className="hover:bg-[#fef9f8] transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-[#33221e]">
                                {lead.name || lead.email.split('@')[0]}
                              </div>
                              <div className="text-[11px] text-[#735953]">{lead.email}</div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#faf4f2] text-[#6d4f48] border border-[#f5ded9]">
                                {sourceLabel}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-bold text-[#33221e]">
                              {lead.login_count || 1}x
                            </td>

                            <td className="py-3 px-4 text-[11px] text-[#735953]">
                              <div>{new Date(lead.last_seen_at).toLocaleString('pt-PT')}</div>
                              {lead.last_contacted_at && (
                                <div className="text-[10px] text-emerald-700 font-semibold">
                                  Convidado em {new Date(lead.last_contacted_at).toLocaleDateString('pt-PT')}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={lead.follow_up_status || 'pendente'}
                                onChange={(e) =>
                                  handleChangeLeadStatus(
                                    lead.id,
                                    e.target.value as 'pendente' | 'enviado' | 'interessado'
                                  )
                                }
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-hidden cursor-pointer ${
                                  lead.follow_up_status === 'interessado'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : lead.follow_up_status === 'enviado'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                <option value="pendente">Pendente</option>
                                <option value="enviado">Convidado</option>
                                <option value="interessado">Interessado</option>
                              </select>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <a
                                  href={buildMailtoHref(lead, selectedEmailTemplate)}
                                  onClick={() => {
                                    void handleMarkInvited(lead);
                                  }}
                                  className="inline-flex items-center gap-1 bg-[#d97706] hover:bg-[#b45309] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                                  title="Abrir rascunho de e-mail personalizado para este cliente"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Enviar E-mail</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await deleteCustomerLead(lead.id);
                                      setCustomerLeads((prev) => prev.filter((item) => item.id !== lead.id));
                                      showToast('success', 'Registo de cliente removido.');
                                    } catch (err: any) {
                                      showToast('error', err?.message || 'Erro ao remover registo.');
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remover registo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Customer Suggestions Section in Admin */}
            <div className="bg-white rounded-3xl border border-[#fae4e1] shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#33221e]">
                      Sugestões Livres de Clientes ({suggestions.length})
                    </h3>
                    <p className="text-[11px] text-[#735953]">
                      Ideias de novos produtos sugeridas pelos visitantes no final da loja.
                    </p>
                  </div>
                </div>

                {!suggestionsTableCreated && isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL (Ativar tabela de sugestões)</span>
                  </button>
                )}
              </div>

              {suggestions.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#735953] bg-[#faf7f5] rounded-2xl border border-[#fae4e1]">
                  {suggestionsTableCreated
                    ? 'Ainda não foram registadas sugestões na base de dados.'
                    : 'As sugestões enviadas via WhatsApp chegam diretamente ao teu telemóvel. Para também as guardar aqui, executa o bloco SQL nº 9 (product_suggestions) no Supabase.'}
                </div>
              ) : (
                <div className="divide-y divide-[#fbedea] border border-[#fae4e1] rounded-2xl overflow-hidden">
                  {suggestions.map((sug) => (
                    <div key={sug.id} className="p-4 flex items-start justify-between gap-3 hover:bg-[#fef9f8] transition-colors">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs sm:text-sm text-[#33221e] font-medium leading-relaxed">
                          "{sug.suggestion}"
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#735953]">
                          <span className="font-semibold text-[#5e433d]">
                            {sug.client_name || 'Cliente Anónimo'}
                          </span>
                          {sug.client_contact && (
                            <span>• {sug.client_contact}</span>
                          )}
                          <span>• {new Date(sug.created_at).toLocaleDateString('pt-PT')}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await deleteCustomerSuggestion(sug.id);
                            setSuggestions((prev) => prev.filter((item) => item.id !== sug.id));
                            showToast('success', 'Sugestão removida.');
                          } catch (err: any) {
                            showToast('error', err?.message || 'Erro ao remover sugestão.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                        title="Remover sugestão"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post-Purchase Customer Photo Reviews Section */}
            <div className="bg-white rounded-3xl border border-[#fae4e1] shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#33221e]">
                      Avaliações Pós-Compra de Clientes ({productReviews.length})
                    </h3>
                    <p className="text-[11px] text-[#735953]">
                      Fotos reais, estrelas e comentários enviados após receberem a encomenda.
                    </p>
                  </div>
                </div>

                {!reviewsTableCreated && isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL (Ativar tabela de avaliações)</span>
                  </button>
                )}
              </div>

              {productReviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#735953] bg-[#faf7f5] rounded-2xl border border-[#fae4e1]">
                  Ainda não existem avaliações pós-compra registadas. Assim que um cliente avaliar na loja com foto e estrelas, aparecerá aqui.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl border border-[#fae4e1] bg-[#faf7f5]/60 flex items-start gap-3 justify-between"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {rev.photo_url && (
                          <img
                            src={rev.photo_url}
                            alt={rev.product_name}
                            className="w-14 h-14 rounded-xl object-cover border border-[#fae4e1] shrink-0"
                          />
                        )}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1 text-[#f59e0b]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#d8c2bd]'
                                }`}
                              />
                            ))}
                            <span className="text-[11px] font-bold text-[#33221e] ml-1 truncate">
                              {rev.product_name}
                            </span>
                          </div>
                          <p className="text-xs text-[#33221e] leading-snug break-words">
                            "{rev.comment}"
                          </p>
                          <div className="text-[10px] text-[#735953]">
                            <strong>{rev.author_name}</strong>
                            {rev.order_number ? ` • #${rev.order_number}` : ''} •{' '}
                            {new Date(rev.created_at).toLocaleDateString('pt-PT')}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          await deleteProductReview(rev.id);
                          setProductReviews((prev) => prev.filter((item) => item.id !== rev.id));
                          showToast('success', 'Avaliação removida.');
                        }}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title="Remover avaliação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Order Tracking & Pickup Address Management (CTT / Uber Flash / Recolha) */}
            <div className="bg-white rounded-3xl border border-[#fae4e1] shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#33221e]">
                      Encomendas &amp; Rastreio (CTT / Uber Flash / Recolha) ({trackedOrders.length})
                    </h3>
                    <p className="text-[11px] text-[#735953]">
                      Define o código CTT, dá o OK + valor do Uber Flash ou avisa quando terminar impressão/acabamento/embalagem para recolha.
                    </p>
                  </div>
                </div>

                {!ordersTableCreated && isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL (Ativar tabela de encomendas)</span>
                  </button>
                )}
              </div>

              {/* Global Pickup Address Config */}
              <div className="p-4 rounded-2xl bg-[#fef8ed] border border-[#fed7aa] space-y-3">
                <div className="text-xs font-bold text-[#3d2314]">
                  Morada Padrão para Recolha na Loja (aparece quando o cliente escolhe Recolha)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5c3a1e] mb-1">
                      Morada Completa da Loja
                    </label>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Ex: Rua ..., N.º ..., Guimarães, Braga"
                      className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5c3a1e] mb-1">
                      Nota / Horário de Recolha
                    </label>
                    <input
                      type="text"
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      placeholder="Ex: Seg a Sáb das 10h às 19h (combinar antes)"
                      className="w-full bg-white border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3 py-2 text-xs outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={savingPickup}
                    onClick={async () => {
                      setSavingPickup(true);
                      try {
                        await saveStorePickupSettings({ address: pickupAddress, note: pickupNote });
                        showToast('success', 'Morada de recolha guardada com sucesso!');
                      } finally {
                        setSavingPickup(false);
                      }
                    }}
                    className="bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {savingPickup ? 'A guardar...' : 'Guardar Morada de Recolha'}
                  </button>
                </div>
              </div>

              {/* Create / Update Order Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!orderForm.order_number.trim()) {
                    showToast('error', 'Insere o número da encomenda (ex: JNLY-123456).');
                    return;
                  }
                  setSavingOrder(true);
                  try {
                    const saved = await upsertTrackedOrder({
                      ...orderForm,
                      pickup_address:
                        orderForm.delivery_method === 'recolha'
                          ? orderForm.pickup_address.trim() || pickupAddress
                          : '',
                    });
                    setTrackedOrders((prev) => [
                      saved,
                      ...prev.filter(
                        (o) => o.order_number.toUpperCase() !== saved.order_number.toUpperCase()
                      ),
                    ]);
                    showToast('success', `Estado da encomenda #${saved.order_number} atualizado!`);
                  } finally {
                    setSavingOrder(false);
                  }
                }}
                className="p-4 rounded-2xl bg-[#faf7f5] border border-[#fae4e1] space-y-3"
              >
                <div className="text-xs font-bold text-[#33221e]">
                  Atualizar ou Registar Encomenda no Rastreador
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                      N.º Encomenda *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.order_number}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, order_number: e.target.value.toUpperCase() })
                      }
                      placeholder="Ex: JNLY-849100"
                      className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs font-mono uppercase outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                      Cliente
                    </label>
                    <input
                      type="text"
                      value={orderForm.client_name}
                      onChange={(e) => setOrderForm({ ...orderForm, client_name: e.target.value })}
                      placeholder="Ex: Ana Silva"
                      className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                      Peça / Produto
                    </label>
                    <input
                      type="text"
                      value={orderForm.product_name}
                      onChange={(e) => setOrderForm({ ...orderForm, product_name: e.target.value })}
                      placeholder="Ex: Chaveiro Personalizado"
                      className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                      Modalidade *
                    </label>
                    <select
                      value={orderForm.delivery_method}
                      onChange={(e) => {
                        const nextMethod = e.target.value as DeliveryMethodType;
                        setOrderForm({
                          ...orderForm,
                          delivery_method: nextMethod,
                          stage: nextMethod === 'recolha' ? 'Printing' : 'Queued',
                        });
                      }}
                      className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs font-bold outline-hidden"
                    >
                      <option value="ctt">CTT Expresso</option>
                      <option value="uber">Uber Flash</option>
                      <option value="recolha">Recolha na Loja</option>
                    </select>
                  </div>
                </div>

                {/* Mode-specific controls */}
                {orderForm.delivery_method === 'ctt' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                        Etapa CTT
                      </label>
                      <select
                        value={orderForm.stage}
                        onChange={(e) =>
                          setOrderForm({ ...orderForm, stage: e.target.value as OrderStage })
                        }
                        className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                      >
                        <option value="Queued">1. Na Fila</option>
                        <option value="Printing">2. A Imprimir 3D</option>
                        <option value="Packaging">3. Acabamento &amp; Embalagem</option>
                        <option value="Shipped">4. Enviado CTT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                        Código de Rastreio CTT
                      </label>
                      <input
                        type="text"
                        value={orderForm.tracking_code}
                        onChange={(e) =>
                          setOrderForm({ ...orderForm, tracking_code: e.target.value.toUpperCase() })
                        }
                        placeholder="Ex: PT9482019482"
                        className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs font-mono outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                        Localidade / Destino
                      </label>
                      <input
                        type="text"
                        value={orderForm.destination}
                        onChange={(e) =>
                          setOrderForm({ ...orderForm, destination: e.target.value })
                        }
                        placeholder="Ex: Porto, Portugal"
                        className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {orderForm.delivery_method === 'uber' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                          Etapa Uber Flash
                        </label>
                        <select
                          value={orderForm.stage}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, stage: e.target.value as OrderStage })
                          }
                          className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                        >
                          <option value="Queued">1. Na Fila</option>
                          <option value="Printing">2. A Imprimir 3D</option>
                          <option value="Post-processing">3. Pronto / Aguardar Uber</option>
                          <option value="Shipped">4. Saiu por Uber Flash</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                          Quanto custará (Valor Uber)
                        </label>
                        <input
                          type="text"
                          value={orderForm.uber_fee}
                          onChange={(e) => setOrderForm({ ...orderForm, uber_fee: e.target.value })}
                          placeholder="Ex: € 4,50"
                          className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                          Nota para o Cliente
                        </label>
                        <input
                          type="text"
                          value={orderForm.uber_note}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, uber_note: e.target.value })
                          }
                          placeholder="Ex: Estafeta a caminho, chega em 15min"
                          className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 text-xs">
                      <label className="flex items-center gap-2 font-semibold text-[#33221e] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orderForm.uber_ok}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, uber_ok: e.target.checked })
                          }
                          className="w-4 h-4 accent-[#d97706]"
                        />
                        <span>Dar OK no site (envio aprovado &amp; valor confirmado)</span>
                      </label>

                      <label className="flex items-center gap-2 font-semibold text-[#33221e] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orderForm.uber_dispatched}
                          onChange={(e) =>
                            setOrderForm({
                              ...orderForm,
                              uber_dispatched: e.target.checked,
                              stage: e.target.checked ? 'Shipped' : orderForm.stage,
                            })
                          }
                          className="w-4 h-4 accent-[#d97706]"
                        />
                        <span>Já saiu para entrega (Uber a caminho)</span>
                      </label>
                    </div>
                  </div>
                )}

                {orderForm.delivery_method === 'recolha' && (
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                        Avisar Estado da Recolha
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'Printing' as OrderStage, label: 'A Imprimir 3D' },
                          { id: 'Post-processing' as OrderStage, label: 'Terminou → Acabamento' },
                          { id: 'Packaging' as OrderStage, label: 'Embalagem' },
                          { id: 'ReadyPickup' as OrderStage, label: 'Já Pode Buscar!' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setOrderForm({ ...orderForm, stage: st.id })}
                            className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                              orderForm.stage === st.id
                                ? 'bg-[#d97706] text-white border-[#d97706]'
                                : 'bg-white text-[#4a342f] border-[#d8c2bd] hover:border-[#d97706]'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                          Morada de Recolha (se vazia usa a morada padrão acima)
                        </label>
                        <input
                          type="text"
                          value={orderForm.pickup_address}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, pickup_address: e.target.value })
                          }
                          placeholder={pickupAddress || 'Morada para o cliente vir buscar'}
                          className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#5e433d] mb-1">
                          Aviso Extra ao Cliente (Opcional)
                        </label>
                        <input
                          type="text"
                          value={orderForm.pickup_note}
                          onChange={(e) =>
                            setOrderForm({ ...orderForm, pickup_note: e.target.value })
                          }
                          placeholder="Ex: Podes passar hoje a partir das 16h"
                          className="w-full bg-white border border-[#d8c2bd] rounded-xl px-3 py-2 text-xs outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={savingOrder}
                    className="bg-[#33221e] hover:bg-[#d97706] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {savingOrder ? 'A guardar...' : 'Guardar / Atualizar Encomenda'}
                  </button>
                </div>
              </form>

              {/* Saved Tracked Orders List */}
              {trackedOrders.length > 0 && (
                <div className="divide-y divide-[#fbedea] border border-[#fae4e1] rounded-2xl overflow-hidden">
                  {trackedOrders.map((ord) => (
                    <div
                      key={ord.order_number}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-[#fef9f8]"
                    >
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="font-mono text-[#33221e]">{ord.order_number}</strong>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf4f2] border border-[#f5ded9] uppercase">
                            {ord.delivery_method === 'ctt'
                              ? 'CTT'
                              : ord.delivery_method === 'uber'
                                ? 'Uber Flash'
                                : 'Recolha'}
                          </span>
                          <span className="text-[#735953]">• {ord.client_name || 'Cliente'}</span>
                        </div>
                        <div className="text-[11px] text-[#5c3a1e]">
                          Etapa: <strong>{ord.stage}</strong>
                          {ord.delivery_method === 'ctt' && ord.tracking_code
                            ? ` • Rastreio: ${ord.tracking_code}`
                            : ''}
                          {ord.delivery_method === 'uber'
                            ? ` • Valor: ${ord.uber_fee || 'Pendente'} • ${
                                ord.uber_dispatched
                                  ? 'Saiu p/ entrega'
                                  : ord.uber_ok
                                    ? 'OK dado'
                                    : 'Aguardar OK'
                              }`
                            : ''}
                          {ord.delivery_method === 'recolha' && (ord.pickup_address || pickupAddress)
                            ? ` • Morada: ${ord.pickup_address || pickupAddress}`
                            : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setOrderForm({
                              order_number: ord.order_number,
                              delivery_method: ord.delivery_method,
                              client_name: ord.client_name || '',
                              destination: ord.destination || '',
                              product_name: ord.product_name || '',
                              stage: ord.stage,
                              tracking_code: ord.tracking_code || '',
                              uber_fee: ord.uber_fee || '',
                              uber_ok: Boolean(ord.uber_ok),
                              uber_dispatched: Boolean(ord.uber_dispatched),
                              uber_note: ord.uber_note || '',
                              pickup_address: ord.pickup_address || '',
                              pickup_note: ord.pickup_note || '',
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#faf4f2] hover:bg-[#fef3c7] text-[#33221e] text-[11px] font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteTrackedOrder(ord.order_number);
                            setTrackedOrders((prev) =>
                              prev.filter((item) => item.order_number !== ord.order_number)
                            );
                            showToast('success', `Encomenda #${ord.order_number} removida.`);
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Remover encomenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

                  {/* Price (Optional — leave blank for 'Sob Consulta') */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#33221e]">
                        Preço em Euros (€) <span className="font-normal text-[#735953]">(Opcional)</span>
                      </label>
                      {formData.price.trim() !== '' && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, price: '' })}
                          className="text-[11px] font-semibold text-[#b45309] hover:underline cursor-pointer"
                        >
                          Limpar (Sob Consulta)
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex: 14.90 (ou vazio = Sob Consulta)"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden font-bold placeholder:font-normal"
                    />
                    <p className="text-[10px] text-[#735953] mt-1">
                      Deixa vazio para artigos vendidos apenas por orçamento / consulta.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#33221e]">Categoria *</label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[11px] font-bold text-[#d97706] hover:underline cursor-pointer"
                      >
                        + Nova Categoria
                      </button>
                    </div>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const selected = allCategories.find((c) => c.id === e.target.value);
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                          category: selected ? selected.name : 'Personalizados',
                        });
                      }}
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden text-[#33221e]"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#33221e] mb-1">Descrição do Produto</label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreve o design, acabamento e utilidade da peça...&#10;&#10;Podes dar Enter para separar parágrafos."
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl p-3 text-sm outline-hidden whitespace-pre-wrap"
                    />
                    <p className="text-[10px] text-[#735953] mt-1">
                      Os espaços e parágrafos (Enter) serão respeitados exatamente como escreveres na loja pública.
                    </p>
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

                  {/* Exact Reviews Count */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">
                      Quantidade de Avaliações
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={formData.reviews_count}
                      onChange={(e) => setFormData({ ...formData, reviews_count: e.target.value })}
                      placeholder="0"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden font-semibold"
                    />
                    <p className="text-[10px] text-[#735953] mt-1">
                      Define o número exato de avaliações exibido (deixa 0 se ainda não tiver).
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-bold text-[#33221e] mb-1">
                      Nota Média (1 a 5 estrelas)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.1}
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="5.0"
                      className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2 text-sm outline-hidden font-semibold"
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

                {/* Visibility, Featured & Name Personalization checkboxes */}
                <div className="space-y-3 pt-2 border-t border-[#fae2dc] text-xs">
                  <div className="p-3 rounded-xl bg-[#fef8ed] border border-[#fed7aa]">
                    <label className="flex items-start gap-2.5 font-bold text-[#3d2314] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_customizable}
                        onChange={(e) => setFormData({ ...formData, is_customizable: e.target.checked })}
                        className="w-4 h-4 accent-[#d97706] mt-0.5 shrink-0"
                      />
                      <div>
                        <span>Personalizável com Nome / Texto (aba para o cliente escrever o nome)</span>
                        <p className="text-[11px] font-normal text-[#78350f] mt-0.5">
                          Ativa apenas nos produtos em que realmente é possível acrescentar nome ou iniciais.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
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

      {/* Modal: Create New Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#fae2dc] my-8 animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-[#7d605a] hover:text-[#d97706] hover:bg-[#fdeef0] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h2 className="font-serif-title text-xl font-bold text-[#33221e]">
                  Nova Categoria
                </h2>
              </div>
              <p className="text-xs text-[#735953] mb-5">
                Cria uma nova categoria para organizar os teus produtos na loja pública e no painel administrativo.
              </p>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Ex: Casamentos, Animais, Escritório..."
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1">
                    Descrição (Opcional)
                  </label>
                  <input
                    type="text"
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Ex: Lembranças e topos de bolo personalizados"
                    className="w-full bg-[#faf7f5] border border-[#d8c2bd] focus:border-[#d97706] rounded-xl px-3.5 py-2.5 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#33221e] mb-1.5">
                    Imagem de Capa (Opcional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#fae4e1] bg-[#faf7f5] flex-shrink-0 flex items-center justify-center">
                      {catImage ? (
                        <>
                          <img src={catImage} alt="Pré-visualização" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCatImage('')}
                            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 text-white flex items-center justify-center transition-opacity cursor-pointer"
                            title="Remover imagem"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#b69b95]" />
                      )}
                    </div>

                    <label className="flex-1 border-2 border-dashed border-[#e5c5be] hover:border-[#d97706] rounded-xl px-3.5 py-3 flex items-center justify-center gap-2 text-xs font-bold text-[#735953] hover:text-[#d97706] transition-colors cursor-pointer bg-[#faf7f5]">
                      {uploadingCatImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#d97706]" />
                          <span>A carregar...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>{catImage ? 'Trocar imagem' : 'Carregar fotografia'}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                        className="hidden"
                        disabled={uploadingCatImage}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-[#735953] mt-1.5">
                    Se não carregares imagem, será usada uma imagem padrão da loja.
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#d8c2bd] text-xs font-bold text-[#4a342f] hover:bg-[#faf7f5] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingCategory || uploadingCatImage}
                    className="flex-1 bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savingCategory ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Criar Categoria</span>
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
