-- Agregar columna image_url a la tabla categories
-- para el carrusel de categorías en la tienda
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN categories.image_url IS 'URL de imagen representativa de la categoría (carrusel de tienda)';
