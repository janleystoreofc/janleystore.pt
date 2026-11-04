import { createClient } from '@supabase/supabase-js';
import { Product, ProductColor } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS, JANLEY_COLORS } from '../data/products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
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

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase fetch error, using initial catalog:', error.message);
      return FALLBACK_PRODUCTS;
    }

    return (data as DbProduct[]).map(mapDbProductToProduct);
  } catch (err) {
    console.error('Error fetching public products from Supabase:', err);
    return FALLBACK_PRODUCTS;
  }
}

// Admin panel: fetch all products (including hidden)
export async function getAllAdminProducts(): Promise<DbProduct[]> {
  if (!isSupabaseConfigured) {
    // Return fallback converted to DbProduct representation
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

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as DbProduct[];
}

// Admin: Insert new product
export async function createProduct(product: Omit<DbProduct, 'id' | 'created_at'>): Promise<DbProduct> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado. Insere as credenciais VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env');
  }

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

// Admin: Update product
export async function updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbProduct;
}

// Admin: Delete product
export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
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

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
