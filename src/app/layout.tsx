import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Cinzel, Jost } from 'next/font/google';
import { SITE, CONTACT } from '@/lib/constants';
import { getSiteContent } from '@/lib/content';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FCFAF6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = content.seo.titulo || SITE.name;
  const description = content.seo.descricao || SITE.description;
  const ogImage = content.assets.logoUrl || '/logo.png';

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      template: '%s · Instituto Médico Brito',
    },
    description,
    keywords: [
      'medicina personalizada',
      'emagrecimento',
      'saúde metabólica',
      'reposição hormonal',
      'longevidade',
      'medicina integrativa',
      'Instituto Médico Brito',
    ],
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: SITE.url,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    category: 'health',
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  telephone: `+${CONTACT.whatsapp.number}`,
  medicalSpecialty: ['Endocrinology', 'PreventiveMedicine'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.address.street,
    addressLocality: CONTACT.address.district,
    addressCountry: 'BR',
  },
  sameAs: [CONTACT.instagram.url],
  employee: CONTACT.doctors.map((name) => ({ '@type': 'Physician', name })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${cinzel.variable} ${jost.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
