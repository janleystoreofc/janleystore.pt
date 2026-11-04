-- ============================================================
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
