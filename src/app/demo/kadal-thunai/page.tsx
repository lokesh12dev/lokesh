import { KadalStoreDemo } from '@/components/demo/kadal-store';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kadal Thunai — Live Demo | LOKESH',
  description:
    'Try the live Kadal Thunai demo: premium seafood e-commerce with Tamil/English support, weight-based pricing, cart, checkout and order tracking. Concept demo by M. Lokesh.',
  alternates: {
    canonical: 'https://lokesh.studio/demo/kadal-thunai',
  },
  openGraph: {
    title: 'Kadal Thunai — Live Demo | LOKESH',
    description:
      'Interactive seafood e-commerce demo: shop, cart, checkout and tracking. Concept demo by M. Lokesh.',
    url: 'https://lokesh.studio/demo/kadal-thunai',
    siteName: 'LOKESH',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function KadalThunaiDemoPage() {
  return (
    <main id="main">
      <KadalStoreDemo />
    </main>
  );
}
