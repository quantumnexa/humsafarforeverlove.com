import { Metadata } from 'next';
import { StructuredData, generateBreadcrumbSchema, generateFAQSchema } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Pakistani Matrimonial | Humsafar Forever Love',
  description: 'Find answers to common questions about Humsafar Forever Love matrimonial service. Learn about registration, membership plans, privacy, and matchmaking process.',
  keywords: 'matrimonial FAQ, Pakistani marriage questions, Humsafar FAQ, matrimonial help, marriage bureau questions',
  openGraph: {
    title: 'Frequently Asked Questions - Pakistani Matrimonial',
    description: 'Find answers to common questions about Humsafar Forever Love matrimonial service.',
    type: 'website',
    images: [{
      url: '/humsafar-logo.png',
      width: 1200,
      height: 630,
      alt: 'Humsafar Forever Love FAQ'
    }]
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com/faqs'
  }
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://humsafarforeverlove.com' },
    { name: 'FAQs', url: 'https://humsafarforeverlove.com/faqs' }
  ];

  const faqData = [
    {
      question: "How do I sign up for Humsafar Forever Love?",
      answer: "Sign up → verify → create profile. Visit our registration page, fill in your basic details, verify your email and phone number, then complete your profile with photos and preferences."
    },
    {
      question: "What information do I need to provide during registration?",
      answer: "You need to add photos, personal details like age, education, profession, family background, and your match preferences including age range, location, and other criteria."
    },
    {
      question: "How long does the verification process take?",
      answer: "Profile verification typically takes 24-48 hours. We verify your identity documents and photos to ensure authenticity and safety for all members."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we maintain strict confidentiality and use advanced security measures to protect your personal information. Your privacy is our top priority."
    },
    {
      question: "What are the different membership plans available?",
      answer: "We offer Basic (free), Premium, and VIP membership plans with varying features like unlimited messaging, advanced search filters, and priority support."
    },
    {
      question: "How does the matchmaking process work?",
      answer: "Our algorithm matches profiles based on your preferences, location, education, profession, and compatibility factors. You can also search and filter profiles manually."
    }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <StructuredData data={generateFAQSchema(faqData)} />
      {children}
    </>
  );
}