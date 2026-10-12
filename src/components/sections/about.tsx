import Image from 'next/image';
import lokeshImage from '@/assets/images/lokesh.jpg';
import { StarsBackground } from '@/components/stars-background';
import { TypingHeading } from '@/components/typing-heading';
import { Caption, Paragraph } from '@/components/ui/typography';
import { AboutSkills } from '@/components/about-skills';

const headings = [
  'Problem Solvers',
  'Web Developers',
  'App Developers',
  'UI/UX Designers',
  'Free Thinkers',
  'Freelancers',
  'Creative Minds',
  'Passionists',
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 w-full bg-neutrals-900 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:mx-auto after:h-full after:w-full after:max-w-7xl after:bg-[radial-gradient(40%_36%_at_50%_0%,rgba(105,25,255,0.04)_0%,rgba(105,25,255,0)_100%,rgba(105,25,255,0)_100%),radial-gradient(32%_20%_at_50%_32%,rgba(105,25,255,0.08)_0%,rgba(105,25,255,0)_100%)]"
    >
      <StarsBackground />
      <div className="flex w-full items-center max-lg:flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,min(11/12*100%/2,48rem))_minmax(0,min(11/12*100%/2,48rem))_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,min(80%/2,48rem))_minmax(0,min(80%/2,48rem))_minmax(0,1fr)]">
        <div className="relative flex flex-col items-center justify-center overflow-hidden px-5 py-14 sm:py-16 lg:col-start-1 lg:col-end-3 lg:min-h-[80svh]">
          {/* Ambient glows */}
          <div className="absolute h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />
          <div className="absolute h-40 w-40 translate-x-24 translate-y-24 rounded-full bg-[#e1a653]/15 blur-[80px]" />

          {/* Circular portrait with effects */}
          <div className="group relative h-60 w-60 shrink-0 sm:h-80 sm:w-80 lg:h-[380px] lg:w-[380px]">
            {/* Slim rotating conic ring */}
            <div className="absolute -inset-2 animate-[spin_18s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#6919FF_0%,transparent_28%,rgba(225,166,83,0.9)_50%,transparent_72%,#6919FF_100%)] opacity-90" />
            {/* Crisp inner edge */}
            <div className="pointer-events-none absolute -inset-2 rounded-full ring-1 ring-white/25" />
            {/* Photo */}
            <div className="absolute inset-0 overflow-hidden rounded-full bg-neutrals-800 shadow-[0_0_70px_-12px_rgba(105,25,255,0.6)]">
              <Image
                src={lokeshImage}
                alt="M. Lokesh, Software Developer"
                fill
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 380px"
                quality={90}
                className="object-cover object-[center_12%] grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </div>
            {/* Sparkle accents */}
            <span className="absolute -top-1 left-10 h-2.5 w-2.5 animate-pulse rounded-full bg-[#e1a653] shadow-[0_0_12px_2px_rgba(225,166,83,0.8)]" />
            <span className="absolute right-3 top-1/3 h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_12px_2px_rgba(105,25,255,0.8)]" />
            <span className="absolute bottom-8 left-1 h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />

            {/* Floating chips — desktop only */}
            <div className="absolute -right-6 top-8 hidden rounded-2xl border border-white/15 bg-neutrals-900/80 px-3 py-2 shadow-xl backdrop-blur-md sm:block lg:-right-10">
              <p className="text-neutrals-50 text-xs font-bold leading-tight">Software Developer</p>
              <p className="text-neutrals-300 text-[11px] leading-tight">Web · Apps · UI/UX</p>
            </div>
            <div className="absolute -left-6 bottom-8 hidden items-center gap-2 rounded-2xl border border-white/15 bg-neutrals-900/80 px-3 py-2 shadow-xl backdrop-blur-md sm:flex lg:-left-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <div>
                <p className="text-neutrals-50 text-xs font-bold leading-tight">M. Lokesh</p>
                <p className="text-neutrals-300 text-[11px] leading-tight">Chennai · Open to work</p>
              </div>
            </div>
          </div>

          {/* Chips below portrait — mobile only */}
          <div className="mt-7 flex w-full max-w-xs flex-col items-stretch gap-2.5 sm:hidden">
            <div className="rounded-2xl border border-white/15 bg-neutrals-900/80 px-4 py-2.5 text-center shadow-xl backdrop-blur-md">
              <p className="text-neutrals-50 text-sm font-bold leading-tight">Software Developer</p>
              <p className="text-neutrals-300 text-xs leading-tight">Web · Apps · UI/UX</p>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-neutrals-900/80 px-4 py-2.5 shadow-xl backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-neutrals-50 text-sm font-bold leading-tight">M. Lokesh <span className="text-neutrals-300 font-normal">· Chennai · Open to work</span></p>
            </div>
          </div>
        </div>

        <div className="w-full py-10 lg:py-28 max-lg:mx-auto max-lg:w-11/12 max-lg:max-w-7xl lg:ps-10 xl:ps-20">
          <Caption id="about-heading">About</Caption>
          <TypingHeading headings={headings} />
          <Paragraph className="text-2xl sm:text-3xl md:text-3xl leading-relaxed">
            I&apos;m Lokesh, a software developer with a strong interest in technology, coding, web
            development, application development, AI, and UI/UX design. I work as a freelancer,
            turning client ideas into practical websites and apps — from concept to completion.
            Let&apos;s build something amazing together!
          </Paragraph>
        </div>
      </div>

      {/* Clean Line Divider - 2px thick */}
      <div className="w-full flex justify-center py-8 lg:pt-0 lg:pb-8">
        <div className="w-[120%] max-w-none h-0.5 bg-gradient-to-r from-transparent via-neutrals-700 to-transparent"></div>
      </div>

      {/* Terminal Of Truth Section Header */}
      <div className="mt-8 mb-12 flex flex-col items-center text-center px-4 md:px-8">
        <p className="border-primary/30 bg-primary/10 text-primary after:animate-shiny-badge-slide after:bg-primary/10 relative mb-4 inline-block overflow-hidden rounded-full border-[0.5px] px-5 py-2 font-medium text-pretty uppercase backdrop-blur-sm text-shadow-lg after:absolute after:inset-0 text-lg md:text-xl">
          More About Me
        </p>
        <h2 className="text-neutrals-50 mb-6 text-3xl/tight font-bold text-balance sm:text-4xl/tight md:text-5xl/tight tracking-tight">
          Terminal Of Truth
        </h2>
        <p className="text-neutrals-300 max-w-prose text-base/relaxed sm:text-lg/relaxed md:text-xl/relaxed">
          Get to know me, it&apos;s wild, funny, and a little crazy. Dive deep and you&apos;ll find
          the code that really makes me, me and what I do and what I love to do.
        </p>
      </div>

      {/* Skills and Terminal Section */}
      <AboutSkills />
    </section>
  );
}
