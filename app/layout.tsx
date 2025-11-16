import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import MetaPixelRouteTracker from '../components/MetaPixel'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { StructuredData, generateOrganizationSchema, generateWebsiteSchema } from '../components/seo/structured-data'
import './globals.css'
import { Poppins } from 'next/font/google'
const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-poppins', display: 'swap' })

export const metadata: Metadata = {
  title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
  description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform connecting hearts across the globe. Join thousands of success stories.',
  keywords: 'Pakistani matrimonial, marriage bureau, rishta, shaadi, Pakistani brides, Pakistani grooms, Muslim matrimony, online marriage, life partner',
  authors: [{ name: 'Humsafar Forever Love' }],
  creator: 'Humsafar Forever Love',
  publisher: 'Humsafar Forever Love',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://humsafarforeverlove.com',
    siteName: 'Humsafar Forever Love',
    title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
    description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform connecting hearts across the globe.',
    images: [
      {
        url: '/humsafar-logo.png',
        width: 1200,
        height: 630,
        alt: 'Humsafar Forever Love - Pakistani Matrimonial Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@HumsafarLove',
    creator: '@HumsafarLove',
    title: 'Humsafar Forever Love - Premium Pakistani Matrimonial Service',
    description: 'Find your perfect life partner with Humsafar Forever Love. Pakistan\'s most trusted matrimonial platform.',
    images: ['/humsafar-logo.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'fb:app_id': 'your-facebook-app-id',
    'og:locale:alternate': 'ur_PK',
    'article:author': 'Humsafar Forever Love',
    'og:site_name': 'Humsafar Forever Love',
  },
  alternates: {
    canonical: 'https://humsafarforeverlove.com',
  },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={`${GeistSans.variable} ${GeistMono.variable} ${poppins.variable}`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateWebsiteSchema()} />

      </head>
      <body suppressHydrationWarning={true}>
        <a href="#main" className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 bg-black text-white px-3 py-2 rounded" aria-label="Skip to main content">Skip to content</a>
        <main id="main" role="main">
          {children}
        </main>

        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1166619311511829');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1166619311511829&ev=PageView&noscript=1" />
        </noscript>
        <Suspense fallback={null}>
          <MetaPixelRouteTracker />
        </Suspense>
      </body>
    </html>
  )
}
