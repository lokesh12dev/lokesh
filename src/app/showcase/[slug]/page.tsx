import { ProjectShowcasePage } from '@/components/project-showcase-page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const validSlugs = ['kadal-thunai', 'busbuddy', 'saira-tickets'];

const projectTitles: Record<string, string> = {
  'kadal-thunai': 'Kadal Thunai - Premium Seafood E-Commerce',
  busbuddy: 'BusBuddy - Smart Transport Tracker',
  'saira-tickets': 'Saira Tickets - Bus Booking Platform',
};

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = projectTitles[slug] ?? 'Project Showcase';

  return {
    title: `${title} | LOKESH`,
    description: `${title} - a featured project by Lokesh at LOKESH.`,
    alternates: {
      canonical: `https://lokesh.studio/showcase/${slug}`,
    },
    openGraph: {
      title: `${title} | LOKESH`,
      description: `${title} - a featured project by Lokesh at LOKESH.`,
      url: `https://lokesh.studio/showcase/${slug}`,
      siteName: 'LOKESH',
      type: 'website',
    },
  };
}

export default async function ShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return <ProjectShowcasePage slug={slug} />;
}
