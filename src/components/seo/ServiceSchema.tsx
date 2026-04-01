import React from 'react';

interface ServiceSchemaProps {
  name: string;
  description: string;
  price: number;
  url: string;
  features: string[];
}

const ServiceSchema = ({ name, description, price, url, features }: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Software Subscription",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "GuambraWeb",
      "url": "https://guambraweb.com"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "url": url,
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Desarrollo y Mantenimiento",
      "itemListElement": features.map((feature, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ServiceSchema;
