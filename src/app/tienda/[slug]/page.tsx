import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, CheckCircle2, Cpu, Layers, History, Shield } from "lucide-react";
import { AddToCartButton } from "@/components/tienda/AddToCartButton";
import { ProductGallery } from "@/components/tienda/ProductGallery";
import ProductSchema from "@/components/seo/ProductSchema";

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slugParam = resolvedParams.slug;
  const uuidMatch = slugParam.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  const slug = uuidMatch ? uuidMatch[0] : slugParam;
  
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url, price")
    .eq("id", slug)
    .single();

  if (!product) {
    return {
      title: "Producto no encontrado | GuambraWeb",
    };
  }

  const title = `${product.name} | GuambraWeb`;
  const description = product.description || `Adquiere ${product.name} en nuestra web. Soluciones al mejor precio.`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "es_EC",
      url: `https://guambraweb.com/tienda/${slugParam}`,
      siteName: "GuambraWeb",
      title,
      description,
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 600, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function DetalleProductoPage({ params }: Props) {
  const resolvedParams = await params;
  const slugParam = resolvedParams.slug;
  const uuidMatch = slugParam.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  const slug = uuidMatch ? uuidMatch[0] : slugParam;

  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const productAny = product as any;
  const allImages: string[] = (
    (productAny.images && productAny.images.length > 0)
      ? productAny.images
      : product.image_url
      ? [product.image_url]
      : []
  );

  const technologies = (productAny.technologies as string[]) || [];
  const features = (productAny.features as string[]) || [];
  const versions = (productAny.versions as { version: string, changes: string[] }[]) || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 lg:py-24 animate-slide-up">
      <ProductSchema 
        product={{
          name: product.name,
          description: product.description || `Adquiere ${product.name} en GuambraWeb.`,
          image: allImages,
          sku: product.id,
          price: product.price,
          availability: !!product.is_active,
          url: `https://guambraweb.com/tienda/${slugParam}`
        }}
      />
      
      <Link
        href="/tienda"
        className="inline-flex items-center gap-2 text-sm font-medium mb-10 hover:opacity-80 transition-opacity"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        <ArrowLeft size={16} />
        Volver a la tienda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* 1. GALERÍA DE IMÁGENES (Superior Izquierda en Desktop, Primero en Móvil) */}
        <div className="w-full">
          <ProductGallery images={allImages} productName={product.name} />
        </div>

        {/* 2. INFO DEL PRODUCTO (Columna Derecha en Desktop, Segundo en Móvil) */}
        {/* Usamos lg:row-span-2 para que ocupe toda la altura derecha en desktop mientras la izquierda tiene 2 bloques */}
        <div className="flex flex-col lg:row-span-2 lg:sticky lg:top-24">
          <div className="mb-4">
            {!product.is_active && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive mb-2 border border-destructive/20">
                No disponible temporalmente
              </span>
            )}
          </div>
          
          {/* 1. Nombre del producto */}
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
            {product.name}
          </h1>
          
          {/* 2. Precio */}
          <div className="text-4xl font-bold gradient-text mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          {/* 3. Descripción */}
          <div className="mb-2 text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {product.description || "Solución de software profesional adaptada a tus necesidades."}
          </div>


          {/* 4. Botón de agregar al carrito */}
          <div className="mt-2 space-y-6">
            {!product.is_active ? (
              <button disabled className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 text-lg transition-all opacity-50 cursor-not-allowed bg-muted text-muted-foreground">
                 Agotado
              </button>
            ) : (
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: allImages[0] || null,
                }} 
              />
            )}
            
            <p className="text-xs text-center font-medium text-muted-foreground">
               Transacción 100% segura y encriptada.
            </p>
          </div>
        </div>

        {/* 3. DETALLES TÉCNICOS (Debajo de galería en Desktop, Después de la Info en Móvil) */}
        <div className="w-full space-y-12">
          {/* Tecnologías */}
          {technologies.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl flex items-center gap-2">
                <Cpu size={18} className="text-primary" />
                Tecnologías
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider border">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Características */}
          {features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xl flex items-center gap-2">
                <Layers size={18} className="text-primary" />
                Características Principales
              </h3>
              <ul className="space-y-2">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Historial de Versiones */}
          {versions.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-display font-bold text-xl flex items-center gap-2">
                <History size={20} className="text-primary" />
                Historial de Versiones
              </h3>
              <div className="space-y-4">
                {versions.map((v, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border bg-card/50 backdrop-blur-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                        v{v.version}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {v.changes.map((change, cIdx) => (
                        <li key={cIdx} className="text-sm text-muted-foreground flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
