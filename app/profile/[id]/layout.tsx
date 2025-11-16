import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Profile ${id} - Pakistani Matrimonial | Humsafar Forever Love`,
    description: `View detailed profile of Pakistani single looking for marriage. Connect with verified profiles on Pakistan's trusted matrimonial platform.`,
    keywords: 'Pakistani profile, matrimonial profile, Pakistani single, marriage profile, verified profile',
    openGraph: {
      title: `Profile ${id} - Pakistani Matrimonial`,
      description: 'View detailed profile of Pakistani single looking for marriage.',
      type: 'profile',
      images: [{
        url: '/humsafar-logo.png',
        width: 1200,
        height: 630,
        alt: 'Pakistani matrimonial profile'
      }]
    },
    alternates: {
      canonical: `https://humsafarforeverlove.com/profile/${id}`
    },
    robots: {
      index: false, // Individual profiles should not be indexed for privacy
      follow: true
    }
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}