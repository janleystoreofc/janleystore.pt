import { createClient } from '@supabase/supabase-js';
import { Product, ProductColor } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS, JANLEY_COLORS } from '../data/products';

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

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    categoryId: item.category_id || 'outros',
    price: Number(item.price),
    rating: Number(item.rating || 5.0),
    reviewsCount: Number(item.reviews_count || 12),
    image: images[0],
    colors: item.colors && item.colors.length > 0 ? item.colors : JANLEY_COLORS,
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
