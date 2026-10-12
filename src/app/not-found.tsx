import NotFoundSection from '@/components/sections/not-found';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Return to LOKESH.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main id="main">
      <NotFoundSection />
    </main>
  );
}
