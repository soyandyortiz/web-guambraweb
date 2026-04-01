import React from 'react';

interface SchemaMarkupProps {
  baseUrl: string;
}

const SchemaMarkup = ({ baseUrl }: SchemaMarkupProps) => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "GuambraWeb",
    "alternateName": "Guambra Web",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "inLanguage": "es-EC",
      "@id": `${baseUrl}/#logo`,
      "url": `${baseUrl}/icono.png`,
      "contentUrl": `${baseUrl}/icono.png`,
      "width": 512,
      "height": 512,
      "caption": "GuambraWeb"
    },
    "image": {
      "@id": `${baseUrl}/#logo`
    },
    "sameAs": [
      "https://facebook.com/guambraweb",
      "https://tiktok.com/@guambraweb",
      "https://youtube.com/guambraweb"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Riobamba",
      "addressRegion": "Chimborazo",
      "addressCountry": "EC"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+593982650929",
      "contactType": "customer service",
      "areaServed": "EC",
      "availableLanguage": "Spanish"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "GuambraWeb",
    "description": "Expertos en Desarrollo de Software y Páginas Web en Ecuador",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "inLanguage": "es-EC",
    "potentialAction": [{
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/tienda?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tienda",
        "item": `${baseUrl}/tienda`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Servicios",
        "item": `${baseUrl}/servicios`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Planes",
        "item": `${baseUrl}/planes`
      }
    ]
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Navegación Principal",
    "description": "Secciones clave de GuambraWeb",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Tienda Online",
        "url": `${baseUrl}/tienda`,
        "description": "Compra soluciones de software y licencias"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Planes de Suscripción",
        "url": `${baseUrl}/planes`,
        "description": "Mantenimiento y desarrollo continuo"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Portafolio de Proyectos",
        "url": `${baseUrl}/portafolio`,
        "description": "Nuestros casos de éxito"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Servicios Profesionales",
        "url": `${baseUrl}/servicios`,
        "description": "Consultoría y desarrollo a medida"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
      />
    </>
  );
};

export default SchemaMarkup;
