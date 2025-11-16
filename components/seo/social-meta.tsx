import { Metadata } from 'next';

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  twitterHandle?: string;
}

export function generateSocialMeta({
  title,
  description,
  image = '/humsafar-logo.png',
  url,
  type = 'website',
  siteName = 'Humsafar Forever Love',
  locale = 'en_US',
  twitterHandle = '@HumsafarLove'
}: SocialMetaProps): Partial<Metadata> {
  return {
    openGraph: {
      type,
      locale,
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: [image],
    },
  };
}

// Enhanced social sharing meta tags for different content types
export const socialMetaTemplates = {
  profile: (name: string, age: number, profession: string) => ({
    title: `${name}, ${age} - ${profession} | Pakistani Matrimonial Profile`,
    description: `View ${name}'s matrimonial profile on Humsafar Forever Love. Connect with verified Pakistani singles for marriage.`,
    type: 'profile' as const
  }),
  
  successStory: (couple: string) => ({
    title: `Success Story: ${couple} | Humsafar Forever Love`,
    description: `Read how ${couple} found their perfect match through Humsafar Forever Love matrimonial service.`,
    type: 'article' as const
  }),
  
  packages: () => ({
    title: 'Affordable Matrimonial Packages | Humsafar Forever Love',
    description: 'Choose from our lifetime matrimonial packages. Basic, Premium, and VIP plans with verified profiles and personalized matchmaking.',
    type: 'website' as const
  }),
  
  about: () => ({
    title: 'About Us - Pakistani Matrimonial Service | Humsafar Forever Love',
    description: 'Learn about Pakistan\'s most trusted matrimonial platform. Connecting hearts worldwide with verified profiles and personalized matchmaking.',
    type: 'website' as const
  })
};

// Facebook App ID and additional social platform meta tags
export const additionalSocialMeta = {
  facebook: {
    appId: 'your-facebook-app-id', // Replace with actual Facebook App ID
  },
  
  // Additional meta tags for better social sharing
  other: {
    'fb:app_id': 'your-facebook-app-id',
    'twitter:site': '@HumsafarLove',
    'twitter:creator': '@HumsafarLove',
    'og:site_name': 'Humsafar Forever Love',
    'og:locale': 'en_US',
    'og:locale:alternate': ['ur_PK', 'en_PK'],
  }
};