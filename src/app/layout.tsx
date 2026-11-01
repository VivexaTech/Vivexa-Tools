import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Vivexa Tools',
    default: 'Vivexa Tools - All Your Everyday Online Tools. One Simple Place.'
  },
  description:
    'Free online tools to convert, compress, edit, and organize files. PDF tools, image editor, passport photo maker, video trimmer, audio converter, and color picker. 100% private in-browser processing.',
  keywords: [
    'online tools',
    'merge pdf',
    'compress image',
    'passport photo maker',
    'split pdf',
    'pdf to jpg',
    'image resizer',
    'video trimmer',
    'audio converter',
    'color picker',
    'vivexa tools'
  ],
  authors: [{ name: 'Vivexa Tech', url: 'https://www.vivexatech.in/' }],
  creator: 'Vivexa Tech',
  publisher: 'Vivexa Tech',
  metadataBase: new URL('https://tools.vivexa.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Vivexa Tools - All Your Everyday Tools in One Place',
    description: 'Convert, compress, edit, and organize files with 100% browser privacy. Developed by Vivexa Tech.',
    siteName: 'Vivexa Tools',
    type: 'website',
    images: [{ url: '/favicon-512x512.png', width: 512, height: 512, alt: 'Vivexa Tools Logo' }]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vivexa Tech',
    url: 'https://www.vivexatech.in/',
    logo: 'https://tools.vivexa.com/favicon-512x512.png',
    sameAs: ['https://www.vivexatech.in/']
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vivexa Tools',
    url: 'https://tools.vivexa.com',
    description: 'Free online tools to convert, compress, edit, and organize files with 100% in-browser privacy.',
    author: {
      '@type': 'Organization',
      name: 'Vivexa Tech',
      url: 'https://www.vivexatech.in/'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://tools.vivexa.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
