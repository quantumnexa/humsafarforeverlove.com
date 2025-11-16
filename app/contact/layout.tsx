import { Metadata } from 'next';
import { StructuredData, generateBreadcrumbSchema, generateLocalBusinessSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Contact Us - Pakistani Matrimonial Service | Humsafar Forever Love',
  description: 'Get in touch with Humsafar Forever Love matrimonial service. Contact our support team for assistance with your Pakistani marriage search and matchmaking needs.',
  keywords: 'contact matrimonial service, Pakistani marriage bureau contact, Humsafar contact, matrimonial support, marriage consultation',
  openGraph: {
    title: 'Contact Us - Pakistani Matrimonial Service',
    description: 'Get in touch with Humsafar Forever Love matrimonial service for assistance with your marriage search.',
    type: 'website',
    images: [{
      url: '/humsafar-logo.png',
      width: 1200,
      height: 630,
      alt: 'Contact Humsafar Forever Love'
    }]
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/contact'
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'Contact', url: 'https://humsafarforeverlove.com/contact' }
  ];

  const localBusinessData = {
    name: 'Humsafar Forever Love',
    description: 'Pakistani matrimonial and matchmaking service',
    address: {
      streetAddress: 'Main Office',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      addressCountry: 'Pakistan'
    },
    telephone: '+92-XXX-XXXXXXX',
    email: 'info@humsafarforeverlove.com',
    url: 'https://humsafarforeverlove.com',
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '$$'
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={generateLocalBusinessSchema()} />
      {children}
    </>
  );
}