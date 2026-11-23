import { createClient } from '@supabase/supabase-js';
import { Category, Product, ProductColor } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS, JANLEY_COLORS, VASO_COLORS } from '../data/products';

// Accept both VITE_SUPABASE_PUBLISHABLE_KEY (Vercel standard) and VITE_SUPABASE_ANON_KEY
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const supabaseKey = typeof rawKey === 'string' ? rawKey.trim() : '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('teu-projeto') &&
  !supabaseUrl.includes('placeholder-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');

export interface DbProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  category_id: string;
  images: string[];
  image: string;
  colors?: ProductColor[];
  is_featured: boolean;
  is_bestseller: boolean;
  is_hidden: boolean;
  is_customizable?: boolean;
  dimensions?: string;
  material?: string;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
}

// Full SQL setup script for Supabase
export const SUPABASE_SCHEMA_SQL = `-- ============================================================
-- JANLEY STORE - SUPABASE SCHEMA SQL
-- Executa este script no SQL Editor do teu projeto Supabase Free
-- ============================================================

-- 1. Criar a tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL,
    category_id TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    image TEXT DEFAULT '',
    colors JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    is_customizable BOOLEAN DEFAULT false,
    dimensions TEXT DEFAULT '',
    material TEXT DEFAULT 'PLA Ecológico de Alta Precisão',
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT false;

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Política: Leitura pública para produtos não ocultos
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT
    USING (is_hidden = false);

-- 4. Política: Utilizadores autenticados (Admin) têm controlo total
DROP POLICY IF EXISTS "Admins have full access" ON public.products;
CREATE POLICY "Admins have full access" ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Criar bucket de armazenamento público para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Política de Storage: Leitura pública de imagens
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');

-- 7. Política de Storage: Admins autenticados podem enviar e gerir imagens
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'product-images')
    WITH CHECK (bucket_id = 'product-images');

-- 8. Tabela opcional de configurações da loja (ex: ativar/desativar envios CTT)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    ctt_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings" ON public.store_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 9. Tabela de sugestões livres de clientes para novos produtos na loja
CREATE TABLE IF NOT EXISTS public.product_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT DEFAULT '',
    client_contact TEXT DEFAULT '',
    suggestion TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit product suggestions" ON public.product_suggestions;
CREATE POLICY "Anyone can submit product suggestions" ON public.product_suggestions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage product suggestions" ON public.product_suggestions;
CREATE POLICY "Admins can manage product suggestions" ON public.product_suggestions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 10. Tabela opcional de categorias personalizadas criadas pelo admin
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT DEFAULT '/images/cat_outros.jpg',
    description TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view custom categories" ON public.categories;
CREATE POLICY "Public can view custom categories" ON public.categories
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can manage custom categories" ON public.categories;
CREATE POLICY "Admins can manage custom categories" ON public.categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 11. Tabela de histórico de logins, cadastros e subscritores para convites por email
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT DEFAULT '',
    source TEXT DEFAULT 'login',
    login_count INT DEFAULT 1,
    follow_up_status TEXT DEFAULT 'pendente',
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_contacted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can register lead or login" ON public.customer_leads;
CREATE POLICY "Anyone can register lead or login" ON public.customer_leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update lead login timestamp" ON public.customer_leads;
CREATE POLICY "Anyone can update lead login timestamp" ON public.customer_leads
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage customer leads" ON public.customer_leads;
CREATE POLICY "Admins can manage customer leads" ON public.customer_leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 12. Tabela de avaliações pós-compra com foto real, estrelas e comentário
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL,
    product_name TEXT DEFAULT '',
    author_name TEXT NOT NULL,
    order_number TEXT DEFAULT '',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    photo_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view product reviews" ON public.product_reviews;
CREATE POLICY "Public can view product reviews" ON public.product_reviews
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can submit product review" ON public.product_reviews;
CREATE POLICY "Anyone can submit product review" ON public.product_reviews
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage product reviews" ON public.product_reviews
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 13. Tabela de acompanhamento de encomendas por modalidade (CTT / Uber Flash / Recolha)
CREATE TABLE IF NOT EXISTS public.store_orders (
    order_number TEXT PRIMARY KEY,
    delivery_method TEXT NOT NULL DEFAULT 'ctt',
    client_name TEXT NOT NULL DEFAULT '',
    destination TEXT DEFAULT '',
    product_name TEXT NOT NULL DEFAULT '',
    product_image TEXT DEFAULT '',
    color_name TEXT DEFAULT '',
    color_hex TEXT DEFAULT '#d97706',
    stage TEXT NOT NULL DEFAULT 'Queued',
    tracking_code TEXT DEFAULT '',
    uber_fee TEXT DEFAULT '',
    uber_ok BOOLEAN DEFAULT false,
    uber_dispatched BOOLEAN DEFAULT false,
    uber_note TEXT DEFAULT '',
    pickup_address TEXT DEFAULT '',
    pickup_note TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view tracked orders" ON public.store_orders;
CREATE POLICY "Public can view tracked orders" ON public.store_orders
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can create order at checkout" ON public.store_orders;
CREATE POLICY "Anyone can create order at checkout" ON public.store_orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage store orders" ON public.store_orders;
CREATE POLICY "Admins can manage store orders" ON public.store_orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
`;

// Helper to identify PostgREST PGRST205 or missing table errors
export function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const code = error.code || '';
  const message = typeof error.message === 'string' ? error.message : '';
  const details = typeof error.details === 'string' ? error.details : '';

  return (
    code === 'PGRST205' ||
    message.includes('public.products') ||
    message.includes('schema cache') ||
    message.includes('relation "public.products" does not exist') ||
    details.includes('public.products')
  );
}

// Convert fallback products to DbProduct shape
export function getFallbackDbProducts(): DbProduct[] {
  return FALLBACK_PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    category: p.category,
    category_id: p.categoryId,
    images: [p.image],
    image: p.image,
    colors: p.colors,
    is_featured: Boolean(p.isFeatured),
    is_bestseller: Boolean(p.isBestseller),
    is_hidden: false,
    is_customizable: Boolean(p.allowCustomName),
    dimensions: p.dimensions,
    material: p.material,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    created_at: new Date().toISOString(),
  }));
}

const CUSTOMIZABLE_STORAGE_PATH = 'config/customizable-products.json';
const CUSTOMIZABLE_LOCAL_CACHE_KEY = 'janley_customizable_products';

function readCachedCustomizableMap(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CUSTOMIZABLE_LOCAL_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCachedCustomizableMap(map: Record<string, boolean>): void {
  try {
    localStorage.setItem(CUSTOMIZABLE_LOCAL_CACHE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota errors
  }
}

async function getCustomizableProductsMap(): Promise<Record<string, boolean>> {
  const cached = readCachedCustomizableMap();
  if (!isSupabaseConfigured) return cached;

  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(CUSTOMIZABLE_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const json = await response.json();
        if (json && typeof json === 'object') {
          writeCachedCustomizableMap(json);
          return json as Record<string, boolean>;
        }
      }
    }
  } catch {
    // Fallback to local cache
  }

  return cached;
}

export async function saveProductCustomizableFlag(
  productId: string,
  enabled: boolean
): Promise<boolean> {
  const currentMap = await getCustomizableProductsMap();
  const nextMap = { ...currentMap, [productId]: Boolean(enabled) };
  writeCachedCustomizableMap(nextMap);

  if (isSupabaseConfigured) {
    // 1. Save to config JSON in storage (always works without extra SQL migration)
    try {
      const blob = new Blob([JSON.stringify(nextMap)], { type: 'application/json' });
      await supabase.storage
        .from('product-images')
        .upload(CUSTOMIZABLE_STORAGE_PATH, blob, {
          cacheControl: '0',
          upsert: true,
          contentType: 'application/json',
        });
    } catch {
      // keep local cache
    }

    // 2. Also update column directly if schema already has is_customizable
    try {
      await supabase
        .from('products')
        .update({ is_customizable: Boolean(enabled) })
        .eq('id', productId);
    } catch {
      // safe no-op if column hasn't been added yet
    }
  }

  return Boolean(enabled);
}

// Convert DB product to UI Product
export function mapDbProductToProduct(
  item: DbProduct,
  customizableMap?: Record<string, boolean>
): Product {
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : item.image ? [item.image] : ['/images/prod_suporte_telemovel.png'];

  const isVase = (item.id || '').toLowerCase().includes('vaso') || (item.name || '').toLowerCase().includes('vaso');

  // Sanitize colors: ensure foreign vase images don't leak to non-vase products
  const rawColors = Array.isArray(item.colors) && item.colors.length > 0
    ? item.colors
    : (isVase ? VASO_COLORS : JANLEY_COLORS);

  const cleanColors = rawColors.map((color) => {
    if (!color.sampleImage) return color;
    const sample = color.sampleImage.toLowerCase();
    const isVaseSample = sample.includes('vaso_') || sample.includes('prod_vaso');
    if (isVaseSample && !isVase) {
      const { sampleImage, ...sanitized } = color;
      return sanitized;
    }
    return color;
  });

  // Ensure all store colors are present: if any color is missing, append it
  const basePalette = isVase ? VASO_COLORS : JANLEY_COLORS;
  const existingNames = new Set(cleanColors.map((c) => c.name.trim().toLowerCase()));
  const missingColors = basePalette.filter((c) => !existingNames.has(c.name.trim().toLowerCase()));
  const allProductColors = [...cleanColors, ...missingColors];

  const rawReviews = Math.max(0, Number(item.reviews_count ?? 0));

  const allowCustomName =
    customizableMap && typeof customizableMap[item.id] === 'boolean'
      ? customizableMap[item.id]
      : Boolean(item.is_customizable);

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    categoryId: item.category_id || 'outros',
    price: Number(item.price),
    rating: Number(item.rating || 5.0),
    reviewsCount: rawReviews,
    image: images[0],
    colors: allProductColors,
    description: item.description || '',
    dimensions: item.dimensions || 'Sob medida',
    material: item.material || 'PLA Ecológico de Alta Precisão',
    isFeatured: Boolean(item.is_featured),
    isBestseller: Boolean(item.is_bestseller),
    allowCustomName,
  };
}

// Public catalog: fetch only non-hidden products
export async function getPublicProducts(): Promise<Product[]> {
  const customMap = await getCustomizableProductsMap();
  const applyFallbackMap = () =>
    FALLBACK_PRODUCTS.map((p) => ({
      ...p,
      allowCustomName:
        typeof customMap[p.id] === 'boolean' ? customMap[p.id] : Boolean(p.allowCustomName),
    }));

  if (!isSupabaseConfigured) {
    return applyFallbackMap();
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      if (!isTableMissingError(error)) {
        console.warn('Supabase fetch error, using default catalog:', error.message);
      }
      return applyFallbackMap();
    }

    if (!data || data.length === 0) {
      return applyFallbackMap();
    }

    return (data as DbProduct[]).map((item) => mapDbProductToProduct(item, customMap));
  } catch (err: any) {
    if (!isTableMissingError(err)) {
      console.warn('Error fetching public products from Supabase:', err?.message);
    }
    return applyFallbackMap();
  }
}

// Admin panel: fetch all products (including hidden), safely catching PGRST205
export async function getAllAdminProducts(): Promise<{
  products: DbProduct[];
  isTableCreated: boolean;
  error?: string;
}> {
  const customMap = await getCustomizableProductsMap();
  const withCustomFlag = (items: DbProduct[]) =>
    items.map((item) => ({
      ...item,
      is_customizable:
        typeof customMap[item.id] === 'boolean'
          ? customMap[item.id]
          : Boolean(item.is_customizable),
    }));

  if (!isSupabaseConfigured) {
    return {
      products: withCustomFlag(getFallbackDbProducts()),
      isTableCreated: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (isTableMissingError(error)) {
        return {
          products: withCustomFlag(getFallbackDbProducts()),
          isTableCreated: false,
        };
      }
      return {
        products: withCustomFlag(getFallbackDbProducts()),
        isTableCreated: false,
        error: error.message,
      };
    }

    return {
      products: withCustomFlag((data || []) as DbProduct[]),
      isTableCreated: true,
    };
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return {
        products: withCustomFlag(getFallbackDbProducts()),
        isTableCreated: false,
      };
    }
    return {
      products: withCustomFlag(getFallbackDbProducts()),
      isTableCreated: false,
      error: err?.message || 'Erro ao carregar produtos do Supabase',
    };
  }
}

// Admin: Insert new product
export async function createProduct(product: Omit<DbProduct, 'id' | 'created_at'>): Promise<DbProduct> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado. Insere as credenciais no ficheiro .env');
  }

  const { is_customizable, ...dbPayload } = product;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
      }
      throw error;
    }

    const saved = data as DbProduct;
    await saveProductCustomizableFlag(saved.id, Boolean(is_customizable));
    return { ...saved, is_customizable: Boolean(is_customizable) };
  } catch (err: any) {
    if (isTableMissingError(err)) {
      throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
    }
    throw err;
  }
}

// Admin: Update product
export async function updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { is_customizable, ...dbUpdates } = updates;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...dbUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
      }
      throw error;
    }

    const saved = data as DbProduct;
    if (typeof is_customizable === 'boolean') {
      await saveProductCustomizableFlag(saved.id, is_customizable);
    }
    return {
      ...saved,
      is_customizable:
        typeof is_customizable === 'boolean' ? is_customizable : Boolean(saved.is_customizable),
    };
  } catch (err: any) {
    if (isTableMissingError(err)) {
      throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
    }
    throw err;
  }
}

// Admin: Delete product
export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
      }
      throw error;
    }
  } catch (err: any) {
    if (isTableMissingError(err)) {
      throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
    }
    throw err;
  }
}

// Admin: Toggle visibility
export async function toggleProductVisibility(id: string, currentHiddenStatus: boolean): Promise<boolean> {
  const newStatus = !currentHiddenStatus;
  await updateProduct(id, { is_hidden: newStatus });
  return newStatus;
}

// Admin: Toggle whether a product allows name customization
export async function toggleProductCustomizable(id: string, currentStatus: boolean): Promise<boolean> {
  const newStatus = !currentStatus;
  return await saveProductCustomizableFlag(id, newStatus);
}

// Admin: Upload image to Supabase Storage
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase Storage não está configurado.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
      throw new Error("O bucket 'product-images' ainda não foi criado no Supabase. Executa o script SQL no SQL Editor.");
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

const CTT_STORAGE_PATH = 'config/delivery-settings.json';
const CTT_LOCAL_CACHE_KEY = 'janley_ctt_enabled';

function readCachedCttSetting(): boolean {
  try {
    const val = localStorage.getItem(CTT_LOCAL_CACHE_KEY);
    if (val === 'false') return false;
    if (val === 'true') return true;
  } catch {
    // ignore storage access issues
  }
  return true;
}

function writeCachedCttSetting(enabled: boolean): void {
  try {
    localStorage.setItem(CTT_LOCAL_CACHE_KEY, String(enabled));
  } catch {
    // ignore storage access issues
  }
}

// Fetch whether CTT shipping is currently enabled by the store admin
export async function getCttEnabled(): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return readCachedCttSetting();
  }

  try {
    // 1. Try reading from dedicated store_settings table if present
    const { data, error } = await supabase
      .from('store_settings')
      .select('ctt_enabled')
      .eq('id', 'default')
      .maybeSingle();

    if (!error && data && typeof data.ctt_enabled === 'boolean') {
      writeCachedCttSetting(data.ctt_enabled);
      return data.ctt_enabled;
    }
  } catch {
    // Fallback to storage config below
  }

  // 2. Zero-SQL fallback: read config JSON from public product-images bucket
  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(CTT_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const json = await response.json();
        if (typeof json?.cttEnabled === 'boolean') {
          writeCachedCttSetting(json.cttEnabled);
          return json.cttEnabled;
        }
      }
    }
  } catch {
    // Default to true if config does not exist yet
  }

  return readCachedCttSetting();
}

// Admin: Toggle CTT shipping availability and persist in Supabase
export async function updateCttEnabled(enabled: boolean): Promise<boolean> {
  if (!isSupabaseConfigured) {
    writeCachedCttSetting(enabled);
    return enabled;
  }

  // 1. Try saving in store_settings table first
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert(
        {
          id: 'default',
          ctt_enabled: enabled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (!error) {
      writeCachedCttSetting(enabled);
      return enabled;
    }
  } catch {
    // Fallback to storage bucket below if store_settings table doesn't exist yet
  }

  // 2. Fallback: persist JSON configuration in already-existing product-images bucket
  const payloadBlob = new Blob(
    [JSON.stringify({ cttEnabled: enabled, updatedAt: new Date().toISOString() })],
    { type: 'application/json' }
  );

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(CTT_STORAGE_PATH, payloadBlob, {
      cacheControl: '0',
      upsert: true,
      contentType: 'application/json',
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Erro ao guardar preferência de envio CTT no Supabase.');
  }

  writeCachedCttSetting(enabled);
  return enabled;
}

export interface DbCustomerSuggestion {
  id: string;
  client_name: string;
  client_contact: string;
  suggestion: string;
  created_at: string;
}

export async function submitCustomerSuggestion(payload: {
  client_name?: string;
  client_contact?: string;
  suggestion: string;
}): Promise<{ savedToDb: boolean }> {
  const cleanPayload = {
    client_name: (payload.client_name || '').trim(),
    client_contact: (payload.client_contact || '').trim(),
    suggestion: payload.suggestion.trim(),
  };

  if (!isSupabaseConfigured) {
    return { savedToDb: false };
  }

  try {
    const { error } = await supabase
      .from('product_suggestions')
      .insert([cleanPayload]);

    if (error) {
      return { savedToDb: false };
    }
    return { savedToDb: true };
  } catch {
    return { savedToDb: false };
  }
}

export async function getCustomerSuggestions(): Promise<{
  suggestions: DbCustomerSuggestion[];
  isTableCreated: boolean;
}> {
  if (!isSupabaseConfigured) {
    return { suggestions: [], isTableCreated: false };
  }

  try {
    const { data, error } = await supabase
      .from('product_suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const msg = typeof error.message === 'string' ? error.message : '';
      const isMissing = error.code === 'PGRST205' || msg.includes('product_suggestions') || msg.includes('schema cache');
      return { suggestions: [], isTableCreated: !isMissing };
    }

    return {
      suggestions: (data || []) as DbCustomerSuggestion[],
      isTableCreated: true,
    };
  } catch {
    return { suggestions: [], isTableCreated: false };
  }
}

export async function deleteCustomerSuggestion(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('product_suggestions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

const CATEGORIES_STORAGE_PATH = 'config/custom-categories.json';
const CATEGORIES_LOCAL_CACHE_KEY = 'janley_custom_categories';

function readCachedCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_LOCAL_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedCustomCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_LOCAL_CACHE_KEY, JSON.stringify(categories));
  } catch {
    // ignore storage access issues
  }
}

export function slugifyCategoryId(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;
}

export async function getCustomCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return readCachedCustomCategories();
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, description')
      .order('created_at', { ascending: true });

    if (!error && Array.isArray(data)) {
      const mapped: Category[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        image: row.image || '/images/cat_outros.jpg',
        description: row.description || '',
      }));
      writeCachedCustomCategories(mapped);
      return mapped;
    }
  } catch {
    // Fallback to storage bucket JSON below
  }

  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(CATEGORIES_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed)) {
          writeCachedCustomCategories(parsed);
          return parsed;
        }
      }
    }
  } catch {
    // Fallback to cached categories
  }

  return readCachedCustomCategories();
}

export async function saveCustomCategories(categories: Category[]): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    writeCachedCustomCategories(categories);
    return categories;
  }

  // Always try storage JSON persistence first or in parallel so it works zero-SQL immediately
  let savedViaTable = false;
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('categories')
      .select('id');

    if (!fetchError) {
      const nextIds = new Set(categories.map((c) => c.id));
      const toDelete = (existing || [])
        .map((row: any) => row.id)
        .filter((id: string) => !nextIds.has(id));

      if (toDelete.length > 0) {
        await supabase.from('categories').delete().in('id', toDelete);
      }

      if (categories.length > 0) {
        const { error: upsertError } = await supabase.from('categories').upsert(
          categories.map((c) => ({
            id: c.id,
            name: c.name,
            image: c.image || '/images/cat_outros.jpg',
            description: c.description || '',
          })),
          { onConflict: 'id' }
        );
        if (!upsertError) {
          savedViaTable = true;
        }
      } else {
        savedViaTable = true;
      }
    }
  } catch {
    // Fallback to storage bucket
  }

  if (!savedViaTable) {
    const blob = new Blob([JSON.stringify(categories)], { type: 'application/json' });
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(CATEGORIES_STORAGE_PATH, blob, {
        cacheControl: '0',
        upsert: true,
        contentType: 'application/json',
      });

    if (uploadError) {
      throw new Error(uploadError.message || 'Erro ao guardar categorias no Supabase.');
    }
  }

  writeCachedCustomCategories(categories);
  return categories;
}

export interface DbCustomerLead {
  id: string;
  email: string;
  name: string;
  source: 'signup' | 'login' | 'newsletter' | 'checkout' | string;
  login_count: number;
  follow_up_status: 'pendente' | 'enviado' | 'interessado';
  last_seen_at: string;
  last_contacted_at?: string | null;
  created_at: string;
}

const LEADS_STORAGE_PATH = 'config/customer-leads.json';
const LEADS_LOCAL_CACHE_KEY = 'janley_customer_leads';

function readCachedLeads(): DbCustomerLead[] {
  try {
    const raw = localStorage.getItem(LEADS_LOCAL_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedLeads(leads: DbCustomerLead[]): void {
  try {
    localStorage.setItem(LEADS_LOCAL_CACHE_KEY, JSON.stringify(leads));
  } catch {
    // Ignore storage errors
  }
}

async function saveLeadsToStorageBucket(leads: DbCustomerLead[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const blob = new Blob([JSON.stringify(leads)], { type: 'application/json' });
    const { error } = await supabase.storage
      .from('product-images')
      .upload(LEADS_STORAGE_PATH, blob, {
        cacheControl: '0',
        upsert: true,
        contentType: 'application/json',
      });
    return !error;
  } catch {
    return false;
  }
}

async function readLeadsFromStorageBucket(): Promise<DbCustomerLead[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(LEADS_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {
    // Ignore missing file
  }
  return [];
}

export async function recordCustomerLeadEvent(input: {
  email: string;
  name?: string;
  source: 'signup' | 'login' | 'newsletter' | 'checkout';
}): Promise<void> {
  const cleanEmail = input.email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) return;

  const cleanName = (input.name || '').trim();
  const now = new Date().toISOString();

  // Always update local cache optimistically
  const cached = readCachedLeads();
  const existingIdx = cached.findIndex((l) => l.email.toLowerCase() === cleanEmail);
  let nextLeads: DbCustomerLead[];
  if (existingIdx > -1) {
    const existing = cached[existingIdx];
    const updated: DbCustomerLead = {
      ...existing,
      name: cleanName || existing.name,
      source: existing.source === 'signup' ? 'signup' : input.source,
      login_count: (existing.login_count || 1) + 1,
      last_seen_at: now,
    };
    nextLeads = [updated, ...cached.filter((_, idx) => idx !== existingIdx)];
  } else {
    const created: DbCustomerLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email: cleanEmail,
      name: cleanName,
      source: input.source,
      login_count: 1,
      follow_up_status: 'pendente',
      last_seen_at: now,
      last_contacted_at: null,
      created_at: now,
    };
    nextLeads = [created, ...cached];
  }
  writeCachedLeads(nextLeads);

  if (!isSupabaseConfigured) return;

  // 1. Try dedicated customer_leads table
  try {
    const { data: existingRow, error: selectError } = await supabase
      .from('customer_leads')
      .select('id, name, source, login_count')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!selectError) {
      if (existingRow) {
        await supabase
          .from('customer_leads')
          .update({
            name: cleanName || existingRow.name || '',
            source: existingRow.source === 'signup' ? 'signup' : input.source,
            login_count: (Number(existingRow.login_count) || 1) + 1,
            last_seen_at: now,
          })
          .eq('id', existingRow.id);
        return;
      } else {
        const { error: insertError } = await supabase.from('customer_leads').insert([
          {
            email: cleanEmail,
            name: cleanName,
            source: input.source,
            login_count: 1,
            follow_up_status: 'pendente',
            last_seen_at: now,
          },
        ]);
        if (!insertError) return;
      }
    }
  } catch {
    // Fallback to storage bucket if table not created yet
  }

  // 2. Zero-SQL fallback (works when user session is authenticated)
  try {
    const remote = await readLeadsFromStorageBucket();
    const remoteIdx = remote.findIndex((l) => l.email.toLowerCase() === cleanEmail);
    let mergedRemote: DbCustomerLead[];
    if (remoteIdx > -1) {
      const ex = remote[remoteIdx];
      mergedRemote = [
        {
          ...ex,
          name: cleanName || ex.name,
          source: ex.source === 'signup' ? 'signup' : input.source,
          login_count: (ex.login_count || 1) + 1,
          last_seen_at: now,
        },
        ...remote.filter((_, idx) => idx !== remoteIdx),
      ];
    } else {
      mergedRemote = [nextLeads[0], ...remote];
    }
    await saveLeadsToStorageBucket(mergedRemote);
  } catch {
    // Keep local cache silently
  }
}

export async function getCustomerLeads(): Promise<{
  leads: DbCustomerLead[];
  isTableCreated: boolean;
}> {
  const localLeads = readCachedLeads();
  if (!isSupabaseConfigured) {
    return { leads: localLeads, isTableCreated: false };
  }

  try {
    const { data, error } = await supabase
      .from('customer_leads')
      .select('*')
      .order('last_seen_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const dbLeads = data as DbCustomerLead[];
      writeCachedLeads(dbLeads);
      return { leads: dbLeads, isTableCreated: true };
    }

    const msg = typeof error?.message === 'string' ? error.message : '';
    const isMissing = error?.code === 'PGRST205' || msg.includes('customer_leads') || msg.includes('schema cache');

    const storageLeads = await readLeadsFromStorageBucket();
    const mergedMap = new Map<string, DbCustomerLead>();
    for (const item of [...storageLeads, ...localLeads]) {
      const key = item.email.toLowerCase();
      if (!mergedMap.has(key)) mergedMap.set(key, item);
    }
    const combined = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
    );
    return { leads: combined, isTableCreated: !isMissing };
  } catch {
    return { leads: localLeads, isTableCreated: false };
  }
}

export async function updateCustomerLeadStatus(
  id: string,
  status: 'pendente' | 'enviado' | 'interessado',
  markContacted = false
): Promise<void> {
  const now = new Date().toISOString();
  const cached = readCachedLeads();
  const nextCached = cached.map((item) =>
    item.id === id
      ? {
          ...item,
          follow_up_status: status,
          last_contacted_at: markContacted ? now : item.last_contacted_at,
        }
      : item
  );
  writeCachedLeads(nextCached);

  if (!isSupabaseConfigured) return;

  try {
    const updatePayload: Record<string, any> = { follow_up_status: status };
    if (markContacted) updatePayload.last_contacted_at = now;

    const { error } = await supabase
      .from('customer_leads')
      .update(updatePayload)
      .eq('id', id);

    if (!error) return;
  } catch {
    // fallback to storage bucket
  }

  const remote = await readLeadsFromStorageBucket();
  if (remote.length > 0) {
    const nextRemote = remote.map((item) =>
      item.id === id
        ? {
            ...item,
            follow_up_status: status,
            last_contacted_at: markContacted ? now : item.last_contacted_at,
          }
        : item
    );
    await saveLeadsToStorageBucket(nextRemote);
  }
}

export async function deleteCustomerLead(id: string): Promise<void> {
  const cached = readCachedLeads().filter((item) => item.id !== id);
  writeCachedLeads(cached);

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase.from('customer_leads').delete().eq('id', id);
    if (!error) return;
  } catch {
    // fallback to storage bucket
  }

  const remote = await readLeadsFromStorageBucket();
  if (remote.length > 0) {
    await saveLeadsToStorageBucket(remote.filter((item) => item.id !== id));
  }
}

export interface DbProductReview {
  id: string;
  product_id: string;
  product_name: string;
  author_name: string;
  order_number?: string;
  rating: number;
  comment: string;
  photo_url?: string;
  created_at: string;
}

const REVIEWS_LOCAL_CACHE_KEY = 'janley_product_reviews';

function readCachedReviews(): DbProductReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_LOCAL_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedReviews(reviews: DbProductReview[]): void {
  try {
    localStorage.setItem(REVIEWS_LOCAL_CACHE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore storage quota errors
  }
}

export async function compressReviewPhoto(file: File, maxSize = 720, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler a fotografia.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function getProductReviews(productId?: string): Promise<{
  reviews: DbProductReview[];
  isTableCreated: boolean;
}> {
  const local = readCachedReviews();
  const filterByProduct = (items: DbProductReview[]) =>
    productId ? items.filter((r) => r.product_id === productId) : items;

  if (!isSupabaseConfigured) {
    return { reviews: filterByProduct(local), isTableCreated: false };
  }

  try {
    let query = supabase
      .from('product_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      const dbList = data as DbProductReview[];
      if (!productId) {
        writeCachedReviews(dbList);
      }
      return { reviews: dbList, isTableCreated: true };
    }

    const msg = typeof error?.message === 'string' ? error.message : '';
    const isMissing = error?.code === 'PGRST205' || msg.includes('product_reviews') || msg.includes('schema cache');
    return { reviews: filterByProduct(local), isTableCreated: !isMissing };
  } catch {
    return { reviews: filterByProduct(local), isTableCreated: false };
  }
}

export async function submitProductReview(input: {
  product_id: string;
  product_name: string;
  author_name: string;
  order_number?: string;
  rating: number;
  comment: string;
  photo_url?: string;
}): Promise<DbProductReview> {
  const cleanReview: DbProductReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    product_id: input.product_id,
    product_name: input.product_name.trim(),
    author_name: input.author_name.trim() || 'Cliente Verificado',
    order_number: (input.order_number || '').trim(),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    comment: input.comment.trim(),
    photo_url: input.photo_url || '',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert([
          {
            product_id: cleanReview.product_id,
            product_name: cleanReview.product_name,
            author_name: cleanReview.author_name,
            order_number: cleanReview.order_number,
            rating: cleanReview.rating,
            comment: cleanReview.comment,
            photo_url: cleanReview.photo_url,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const saved = data as DbProductReview;
        const current = readCachedReviews().filter((r) => r.id !== saved.id);
        writeCachedReviews([saved, ...current]);
        return saved;
      }
    } catch {
      // fallback to local cache below
    }
  }

  const current = readCachedReviews();
  writeCachedReviews([cleanReview, ...current]);
  return cleanReview;
}

export async function deleteProductReview(id: string): Promise<void> {
  const nextLocal = readCachedReviews().filter((r) => r.id !== id);
  writeCachedReviews(nextLocal);

  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('product_reviews').delete().eq('id', id);
  } catch {
    // ignore if table not created
  }
}

export type DeliveryMethodType = 'ctt' | 'uber' | 'recolha';

export type OrderStage =
  | 'Queued'
  | 'Printing'
  | 'Post-processing'
  | 'Packaging'
  | 'Shipped'
  | 'ReadyPickup';

export interface DbTrackedOrder {
  order_number: string;
  delivery_method: DeliveryMethodType;
  client_name: string;
  destination: string;
  product_name: string;
  product_image?: string;
  color_name?: string;
  color_hex?: string;
  stage: OrderStage;
  tracking_code?: string;
  uber_fee?: string;
  uber_ok?: boolean;
  uber_dispatched?: boolean;
  uber_note?: string;
  pickup_address?: string;
  pickup_note?: string;
  updated_at: string;
  created_at: string;
}

export interface PickupSettings {
  address: string;
  note: string;
}

const PICKUP_STORAGE_PATH = 'config/pickup-settings.json';
const PICKUP_LOCAL_CACHE_KEY = 'janley_pickup_settings';
const ORDERS_STORAGE_PATH = 'config/tracked-orders.json';
const ORDERS_LOCAL_CACHE_KEY = 'janley_tracked_orders';

const DEFAULT_PICKUP_SETTINGS: PickupSettings = {
  address: '',
  note: 'Horário flexível mediante confirmação prévia no WhatsApp.',
};

function readCachedPickupSettings(): PickupSettings {
  try {
    const raw = localStorage.getItem(PICKUP_LOCAL_CACHE_KEY);
    if (!raw) return DEFAULT_PICKUP_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      address: typeof parsed?.address === 'string' ? parsed.address : '',
      note: typeof parsed?.note === 'string' ? parsed.note : DEFAULT_PICKUP_SETTINGS.note,
    };
  } catch {
    return DEFAULT_PICKUP_SETTINGS;
  }
}

export async function getStorePickupSettings(): Promise<PickupSettings> {
  const local = readCachedPickupSettings();
  if (!isSupabaseConfigured) return local;

  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(PICKUP_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const json = await response.json();
        const resolved: PickupSettings = {
          address: typeof json?.address === 'string' ? json.address : '',
          note: typeof json?.note === 'string' ? json.note : DEFAULT_PICKUP_SETTINGS.note,
        };
        localStorage.setItem(PICKUP_LOCAL_CACHE_KEY, JSON.stringify(resolved));
        return resolved;
      }
    }
  } catch {
    // fallback to local
  }
  return local;
}

export async function saveStorePickupSettings(settings: PickupSettings): Promise<PickupSettings> {
  const clean: PickupSettings = {
    address: settings.address.trim(),
    note: settings.note.trim(),
  };
  try {
    localStorage.setItem(PICKUP_LOCAL_CACHE_KEY, JSON.stringify(clean));
  } catch {
    // ignore storage quota errors
  }

  if (isSupabaseConfigured) {
    try {
      const blob = new Blob([JSON.stringify(clean)], { type: 'application/json' });
      await supabase.storage
        .from('product-images')
        .upload(PICKUP_STORAGE_PATH, blob, {
          cacheControl: '0',
          upsert: true,
          contentType: 'application/json',
        });
    } catch {
      // keep local cache
    }
  }

  return clean;
}

function readCachedOrders(): DbTrackedOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_LOCAL_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCachedOrders(orders: DbTrackedOrder[]): void {
  try {
    localStorage.setItem(ORDERS_LOCAL_CACHE_KEY, JSON.stringify(orders));
  } catch {
    // ignore quota errors
  }
}

async function readOrdersFromStorageBucket(): Promise<DbTrackedOrder[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(ORDERS_STORAGE_PATH);

    if (urlData?.publicUrl) {
      const response = await fetch(`${urlData.publicUrl}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {
    // ignore missing file
  }
  return [];
}

async function saveOrdersToStorageBucket(orders: DbTrackedOrder[]): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const blob = new Blob([JSON.stringify(orders)], { type: 'application/json' });
    const { error } = await supabase.storage
      .from('product-images')
      .upload(ORDERS_STORAGE_PATH, blob, {
        cacheControl: '0',
        upsert: true,
        contentType: 'application/json',
      });
    return !error;
  } catch {
    return false;
  }
}

export async function getTrackedOrders(): Promise<{
  orders: DbTrackedOrder[];
  isTableCreated: boolean;
}> {
  const local = readCachedOrders();
  if (!isSupabaseConfigured) {
    return { orders: local, isTableCreated: false };
  }

  try {
    const { data, error } = await supabase
      .from('store_orders')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const list = data as DbTrackedOrder[];
      writeCachedOrders(list);
      return { orders: list, isTableCreated: true };
    }

    const msg = typeof error?.message === 'string' ? error.message : '';
    const isMissing = error?.code === 'PGRST205' || msg.includes('store_orders') || msg.includes('schema cache');

    const remote = await readOrdersFromStorageBucket();
    const map = new Map<string, DbTrackedOrder>();
    for (const item of [...remote, ...local]) {
      const key = item.order_number.toUpperCase();
      if (!map.has(key)) map.set(key, item);
    }
    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    return { orders: merged, isTableCreated: !isMissing };
  } catch {
    return { orders: local, isTableCreated: false };
  }
}

export async function upsertTrackedOrder(
  order: Omit<DbTrackedOrder, 'updated_at' | 'created_at'> & {
    created_at?: string;
  }
): Promise<DbTrackedOrder> {
  const now = new Date().toISOString();
  const normalized: DbTrackedOrder = {
    ...order,
    order_number: order.order_number.trim().toUpperCase(),
    updated_at: now,
    created_at: order.created_at || now,
  };

  const cached = readCachedOrders();
  const nextCached = [
    normalized,
    ...cached.filter((o) => o.order_number.toUpperCase() !== normalized.order_number),
  ];
  writeCachedOrders(nextCached);

  if (isSupabaseConfigured) {
    let savedInTable = false;
    try {
      const { error } = await supabase.from('store_orders').upsert(normalized, {
        onConflict: 'order_number',
      });
      if (!error) savedInTable = true;
    } catch {
      // fallback to storage bucket below
    }

    if (!savedInTable) {
      const remote = await readOrdersFromStorageBucket();
      const nextRemote = [
        normalized,
        ...remote.filter((o) => o.order_number.toUpperCase() !== normalized.order_number),
      ];
      await saveOrdersToStorageBucket(nextRemote);
    }
  }

  return normalized;
}

export async function deleteTrackedOrder(orderNumber: string): Promise<void> {
  const cleanCode = orderNumber.trim().toUpperCase();
  const nextCached = readCachedOrders().filter(
    (o) => o.order_number.toUpperCase() !== cleanCode
  );
  writeCachedOrders(nextCached);

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase
      .from('store_orders')
      .delete()
      .eq('order_number', cleanCode);
    if (!error) return;
  } catch {
    // fallback to storage bucket
  }

  const remote = await readOrdersFromStorageBucket();
  if (remote.length > 0) {
    await saveOrdersToStorageBucket(
      remote.filter((o) => o.order_number.toUpperCase() !== cleanCode)
    );
  }
}
