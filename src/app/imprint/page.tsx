import ImprintSection from '@/components/sections/imprint';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imprint - LOKESH',
};

export default function ImprintPage() {
  return (
    <main id="main">
      <ImprintSection />
    </main>
  );
}
