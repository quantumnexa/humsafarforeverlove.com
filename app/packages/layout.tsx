import { Metadata } from 'next';
import { StructuredData, generateBreadcrumbSchema, generateServiceSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Membership Packages - Affordable Pakistani Matrimonial Plans | Humsafar Forever Love',
  description: 'Choose from our affordable matrimonial packages. Basic, Premium, and VIP plans with lifetime access, verified profiles, and personalized matchmaking services.',
  keywords: 'matrimonial packages, Pakistani marriage plans, matrimonial pricing, marriage bureau packages, affordable matrimonial service',
  openGraph: {
    title: 'Membership Packages - Affordable Pakistani Matrimonial Plans',
    description: 'Choose from our affordable matrimonial packages with lifetime access and verified profiles.',
    type: 'website',
    images: [{
      url: '/humsafar-logo.png',
      width: 1200,
      height: 630,
      alt: 'Humsafar Forever Love membership packages'
    }]
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/packages'
  }
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'Packages', url: 'https://humsafarforeverlove.com/packages' }
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Pakistani Matrimonial Service Packages",
    "description": "Affordable matrimonial packages for Pakistani singles with lifetime access and verified profiles",
    "provider": {
      "@type": "Organization",
      "name": "Humsafar Forever Love",
      "url": "https://humsafarforeverlove.com"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Package",
        "description": "20 profile views with lifetime access",
        "price": "5000",
        "priceCurrency": "PKR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "Premium Package",
        "description": "35 profile views with lifetime access and priority support",
        "price": "8000",
        "priceCurrency": "PKR",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "name": "VIP Package",
        "description": "55 profile views with lifetime access and premium features",
        "price": "13000",
        "priceCurrency": "PKR",
        "availability": "https://schema.org/InStock"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Pakistan"
    }
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={serviceSchema} />
      {children}
    </>
  );
}