import { SairaBookingDemo } from '@/components/demo/saira-booking';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saira Tickets — Live Demo | LOKESH',
  description:
    'Try the live Saira Tickets demo: search buses, pick seats on an interactive map, add passengers and get a ticket. Concept demo by M. Lokesh.',
  alternates: {
    canonical: 'https://lokesh.studio/demo/saira-tickets',
  },
  openGraph: {
    title: 'Saira Tickets — Live Demo | LOKESH',
    description: 'Interactive bus-booking demo: search, seat map, checkout and e-ticket. Concept demo by M. Lokesh.',
    url: 'https://lokesh.studio/demo/saira-tickets',
    siteName: 'LOKESH',
    type: 'website',
  },
};

export default function SairaTicketsDemoPage() {
  return (
    <main id="main">
      <SairaBookingDemo />
    </main>
  );
}
