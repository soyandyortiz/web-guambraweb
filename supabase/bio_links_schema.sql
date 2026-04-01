-- ============================================================
-- BIO LINKS — Script SQL para ejecutar en Supabase Dashboard
-- SQL Editor → New query → Pegar y ejecutar
-- ============================================================

-- 1. Tabla de perfil (fila única)
CREATE TABLE IF NOT EXISTS bio_profile (
  id integer PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'GuambraWeb',
  tagline text DEFAULT 'Agencia de Desarrollo Web & Sistemas en Ecuador',
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar fila inicial
INSERT INTO bio_profile (id, name, tagline)
VALUES (1, 'GuambraWeb', 'Agencia de Desarrollo Web & Sistemas en Ecuador')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de links
CREATE TABLE IF NOT EXISTS bio_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  icon_name text DEFAULT 'Globe',
  bg_color text DEFAULT '#4361ee',
  text_color text DEFAULT '#ffffff',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Tabla de portafolio bio
CREATE TABLE IF NOT EXISTS bio_portfolio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  url text,
  image_url text,
  project_type text DEFAULT 'Web',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE bio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_portfolio ENABLE ROW LEVEL SECURITY;

-- bio_profile: cualquiera puede leer, solo autenticados pueden modificar
CREATE POLICY "Public read bio_profile"
  ON bio_profile FOR SELECT TO anon USING (true);
CREATE POLICY "Auth all bio_profile"
  ON bio_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- bio_links: anon solo ve activos, autenticados ven todo
CREATE POLICY "Public read active bio_links"
  ON bio_links FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Auth all bio_links"
  ON bio_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- bio_portfolio: anon solo ve activos, autenticados ven todo
CREATE POLICY "Public read active bio_portfolio"
  ON bio_portfolio FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Auth all bio_portfolio"
  ON bio_portfolio FOR ALL TO authenticated USING (true) WITH CHECK (true);
