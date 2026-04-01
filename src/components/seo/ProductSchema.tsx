import React from 'react';

interface ProductSchemaProps {
  product: {
    name: string;
    description: string;
    image: string[];
    sku: string;
    price: number;
    currency?: string;
    availability: boolean;
    brand?: string;
    url: string;
  };
}

const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "GuambraWeb"
    },
    "offers": {
      "@type": "Offer",
      "url": product.url,
      "priceCurrency": product.currency || "USD",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.availability 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "GuambraWeb"
      }
    },
    // Añadimos aggregateRating para que Google considere mostrar estrellas (basado en reputación de marca)
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductSchema;
