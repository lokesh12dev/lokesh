import { CustomCursor } from '@/components/custom-cursor';
import { GlobalStarsBackground } from '@/components/global-stars';
import { Bootloader } from '@/components/layout/bootloader';
import Footer from '@/components/layout/footer';
import { ProHeader } from '@/components/pro/pro-header';
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LOKESH - Developer Portfolio',
  description: 'Software Developer, Web Developer & Freelancer - Professional Portfolio',
  alternates: {
    canonical: 'https://lokesh.studio/pro',
  },
  openGraph: {
    title: 'LOKESH - Developer Portfolio',
    description: 'Software Developer, Web Developer & Freelancer - Professional Portfolio',
    url: 'https://lokesh.studio/pro',
    siteName: 'LOKESH',
    type: 'website',
    images: [
      {
        url: '/images/lokesh-profile-v2.jpg',
        width: 1200,
        height: 630,
        alt: 'M. Lokesh - Software Developer',
      },
    ],
  },
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutrals-900 text-neutrals-50">
      <SmoothScrollProvider>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-neutrals-50 focus:px-4 focus:py-2 focus:text-neutrals-900">
          Skip to main content
        </a>
        <Bootloader />
        <CustomCursor />
        <GlobalStarsBackground />
        <ProHeader />
        {children}
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
