import { FC } from 'react';

interface StructuredDataProps {
  data: object;
}

export const StructuredData: FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
};

// Schema generators for different page types
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Humsafar Forever Love",
  "url": "https://humsafarforeverlove.com",
  "logo": "https://humsafarforeverlove.com/humsafar-logo.png",
  "description": "Pakistan's most trusted matrimonial platform connecting hearts across the globe. Find your perfect life partner with verified profiles and personalized matchmaking services.",
  "foundingDate": "2020",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PK"
  },
  "sameAs": [
    "https://www.facebook.com/humsafarforeverlove",
    "https://www.instagram.com/humsafarforeverlove"
  ],
  "serviceType": "Matrimonial Service",
  "areaServed": {
    "@type": "Country",
    "name": "Pakistan"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Humsafar Forever Love",
  "url": "https://humsafarforeverlove.com",
  "description": "Premium Pakistani matrimonial service connecting hearts worldwide",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://humsafarforeverlove.com/profiles?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generatePersonSchema = (profile: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": `${profile.first_name} ${profile.last_name}`.trim(),
  "gender": profile.gender,
  "birthDate": profile.date_of_birth,
  "nationality": profile.nationality,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": profile.city,
    "addressRegion": profile.state,
    "addressCountry": profile.country
  },
  "jobTitle": profile.profession,
  "alumniOf": profile.education,
  "height": profile.height,
  "knowsLanguage": profile.mother_tongue,
  "religion": profile.religion,
  "maritalStatus": profile.marital_status
});

export const generateServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Pakistani Matrimonial Service",
  "description": "Premium matchmaking service for Pakistani singles worldwide",
  "provider": {
    "@type": "Organization",
    "name": "Humsafar Forever Love",
    "url": "https://humsafarforeverlove.com"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Pakistan"
  },
  "serviceType": "Matrimonial Service",
  "category": "Marriage Bureau",
  "offers": {
    "@type": "Offer",
    "description": "Find your perfect life partner with verified profiles",
    "availability": "https://schema.org/InStock"
  }
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Organization",
    "name": article.author || "Humsafar Forever Love"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Humsafar Forever Love",
    "logo": {
      "@type": "ImageObject",
      "url": "https://humsafarforeverlove.com/humsafar-logo.png"
    }
  },
  "image": article.image || "https://humsafarforeverlove.com/humsafar-logo.png",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://humsafarforeverlove.com"
  }
});

export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://humsafarforeverlove.com",
  "name": "Humsafar Forever Love",
  "description": "Premium Pakistani matrimonial service",
  "url": "https://humsafarforeverlove.com",
  "telephone": "+92-XXX-XXXXXXX",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "PK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "30.3753",
    "longitude": "69.3451"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "priceRange": "$$",
  "servesCuisine": "Matrimonial Services",
  "serviceArea": {
    "@type": "Country",
    "name": "Pakistan"
  }
});