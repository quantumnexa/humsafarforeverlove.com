import { Metadata } from 'next';
import { StructuredData, generateBreadcrumbSchema, generateOrganizationSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'About Us - Pakistan\'s Premier Matrimonial Service | Humsafar Forever Love',
  description: 'Learn about Humsafar Forever Love, Pakistan\'s most trusted matrimonial platform. Discover our mission to connect Pakistani hearts worldwide with verified profiles and personalized matchmaking.',
  keywords: 'about Humsafar Forever Love, Pakistani matrimonial service, marriage bureau Pakistan, trusted matchmaking, Pakistani couples',
  openGraph: {
    title: 'About Us - Pakistan\'s Premier Matrimonial Service',
    description: 'Learn about Humsafar Forever Love, Pakistan\'s most trusted matrimonial platform connecting hearts worldwide.',
    type: 'website',
    images: [{
      url: '/humsafar-logo.png',
      width: 1200,
      height: 630,
      alt: 'About Humsafar Forever Love matrimonial service'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Pakistan\'s Premier Matrimonial Service',
    description: 'Learn about Humsafar Forever Love, Pakistan\'s most trusted matrimonial platform.',
    images: ['/humsafar-logo.png']
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/about'
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'About Us', url: 'https://humsafarforeverlove.com/about' }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={generateOrganizationSchema()} />
      {children}
    </>
  );
}