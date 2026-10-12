import FunZoneSection from '@/components/sections/fun-zone';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fun Zone - LOKESH',
};

export default function FunPage() {
  return (
    <main id="main" className="bg-neutrals-900">
      <FunZoneSection />
    </main>
  );
}
