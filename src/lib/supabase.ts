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
    dimensions TEXT DEFAULT '',
    material TEXT DEFAULT 'PLA Ecológico de Alta Precisão',
    rating NUMERIC(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
    dimensions: p.dimensions,
    material: p.material,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    created_at: new Date().toISOString(),
  }));
}

// Convert DB product to UI Product
export function mapDbProductToProduct(item: DbProduct): Product {
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

  const rawReviews = Number(item.reviews_count || 0);
  const idSeed = (item.id || item.name || 'janley').split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 31, 0);
  const deterministicReviews = 5 + (Math.abs(idSeed) % 28);

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    categoryId: item.category_id || 'outros',
    price: Number(item.price),
    rating: Number(item.rating || 5.0),
    reviewsCount: rawReviews > 0 ? rawReviews : deterministicReviews,
    image: images[0],
    colors: allProductColors,
    description: item.description || '',
    dimensions: item.dimensions || 'Sob medida',
    material: item.material || 'PLA Ecológico de Alta Precisão',
    isFeatured: Boolean(item.is_featured),
    isBestseller: Boolean(item.is_bestseller),
  };
}

// Public catalog: fetch only non-hidden products
export async function getPublicProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return FALLBACK_PRODUCTS;
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
      return FALLBACK_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    return (data as DbProduct[]).map(mapDbProductToProduct);
  } catch (err: any) {
    if (!isTableMissingError(err)) {
      console.warn('Error fetching public products from Supabase:', err?.message);
    }
    return FALLBACK_PRODUCTS;
  }
}

// Admin panel: fetch all products (including hidden), safely catching PGRST205
export async function getAllAdminProducts(): Promise<{
  products: DbProduct[];
  isTableCreated: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      products: getFallbackDbProducts(),
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
          products: getFallbackDbProducts(),
          isTableCreated: false,
        };
      }
      return {
        products: getFallbackDbProducts(),
        isTableCreated: false,
        error: error.message,
      };
    }

    return {
      products: (data || []) as DbProduct[],
      isTableCreated: true,
    };
  } catch (err: any) {
    if (isTableMissingError(err)) {
      return {
        products: getFallbackDbProducts(),
        isTableCreated: false,
      };
    }
    return {
      products: getFallbackDbProducts(),
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

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
      }
      throw error;
    }
    return data as DbProduct;
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

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (isTableMissingError(error)) {
        throw new Error("A tabela 'products' ainda não foi criada no Supabase. Executa o script SQL no SQL Editor do Supabase.");
      }
      throw error;
    }
    return data as DbProduct;
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
