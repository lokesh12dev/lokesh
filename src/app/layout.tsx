import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Italianno } from "next/font/google";
import { ContentProtection } from "@/components/content-protection";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italianno",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#060918" },
  ],
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://lokesh.studio/#person',
      name: 'M. Lokesh',
      alternateName: ['Lokesh', 'LOKESH'],
      url: 'https://lokesh.studio/pro',
      jobTitle: 'Software Developer',
      description:
        'M. Lokesh is a Software Developer, Web Developer and Freelancer from Chennai, Tamil Nadu, India. Hindustan Institute of Technology and Science (HITS).',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Hindustan Institute of Technology and Science',
      },
      knowsAbout: [
        'Web Development',
        'Next.js',
        'React',
        'UI/UX Design',
        'Application Development',
        'Python',
        'JavaScript',
        'Artificial Intelligence',
        'Tally',
        'Zoho Books',
      ],
      sameAs: [
        'https://github.com/lokesh12dev',
        'https://www.instagram.com/_im_lokesh___/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://lokesh.studio/#website',
      url: 'https://lokesh.studio/',
      name: 'LOKESH',
      publisher: { '@id': 'https://lokesh.studio/#person' },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "M. Lokesh — Software Developer | LOKESH",
    template: "%s | LOKESH",
  },
  description: "M. Lokesh is a Software Developer, Web Developer and Freelancer from Chennai. Explore websites, applications, UI/UX projects, and practical client work.",
  keywords: ["M. Lokesh", "Lokesh", "LOKESH", "Software Developer Chennai", "Web Developer Tamil Nadu", "Freelancer", "Next.js developer", "React developer", "UI UX designer", "web development portfolio", "lokesh12dev"],
  authors: [{ name: "M. Lokesh", url: "https://github.com/lokesh12dev" }],
  creator: "M. Lokesh",
  publisher: "LOKESH",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lokesh.studio",
    siteName: "LOKESH",
    title: "M. Lokesh — Software Developer | LOKESH",
    description: "Software Developer, Web Developer and Freelancer in Chennai. Websites, apps, UI/UX and client projects.",
    images: [
      {
        url: "/images/lokesh-profile-v2.jpg",
        width: 1200,
        height: 630,
        alt: "M. Lokesh - Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Lokesh — Software Developer | LOKESH",
    description: "Software Developer, Web Developer and Freelancer in Chennai. Websites, apps, UI/UX and client projects.",
    images: ["/images/lokesh-profile-v2.jpg"],
  },
  alternates: {
    canonical: "https://lokesh.studio",
  },
  metadataBase: new URL("https://lokesh.studio"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for faster resolution */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${italianno.variable} antialiased font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ContentProtection>
          {children}
        </ContentProtection>
      </body>
    </html>
  );
}
