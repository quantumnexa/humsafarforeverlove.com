import { Metadata } from 'next';
import { StructuredData, generateServiceSchema, generateBreadcrumbSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Browse Pakistani Profiles - Find Your Perfect Match | Humsafar Forever Love',
  description: 'Browse thousands of verified Pakistani profiles. Find your ideal life partner from our extensive database of Pakistani brides and grooms worldwide.',
  keywords: 'Pakistani profiles, Pakistani brides, Pakistani grooms, matrimonial profiles, Muslim matrimony, Pakistani singles, marriage profiles',
  openGraph: {
    title: 'Browse Pakistani Profiles - Find Your Perfect Match',
    description: 'Browse thousands of verified Pakistani profiles. Find your ideal life partner from our extensive database.',
    type: 'website',
    images: [{
      url: '/humsafar-logo.png',
      width: 1200,
      height: 630,
      alt: 'Browse Pakistani matrimonial profiles'
    }]
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/profiles'
  }
};

export default function ProfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'Profiles', url: 'https://humsafarforeverlove.com/profiles' }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={generateServiceSchema()} />
      {children}
    </>
  );
}