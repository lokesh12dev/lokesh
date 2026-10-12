import { BusTrackerDemo } from '@/components/demo/bus-tracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BusBuddy — Live Demo | LOKESH',
  description:
    'Try the live BusBuddy demo: real-time bus tracking simulation, IoT sensors, offline mode and multi-language voice commands. Concept demo by M. Lokesh.',
  alternates: {
    canonical: 'https://lokesh.studio/demo/busbuddy',
  },
  openGraph: {
    title: 'BusBuddy — Live Demo | LOKESH',
    description: 'Interactive bus-tracking demo: live map, ETAs, IoT panel and voice commands. Concept demo by M. Lokesh.',
    url: 'https://lokesh.studio/demo/busbuddy',
    siteName: 'LOKESH',
    type: 'website',
  },
};

export default function BusBuddyDemoPage() {
  return (
    <main id="main">
      <BusTrackerDemo />
    </main>
  );
}
