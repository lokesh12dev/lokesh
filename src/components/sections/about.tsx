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
        <div className="relative flex items-center justify-center overflow-hidden py-16 lg:col-start-1 lg:col-end-3 lg:min-h-[80svh]">
          {/* Ambient glows */}
          <div className="absolute h-72 w-72 rounded-full bg-primary/30 blur-[110px]" />
          <div className="absolute h-40 w-40 translate-x-24 translate-y-24 rounded-full bg-[#e1a653]/20 blur-[80px]" />

          {/* Circular portrait with effects */}
          <div className="group relative h-64 w-64 sm:h-80 sm:w-80 lg:h-[380px] lg:w-[380px]">
            {/* Rotating conic ring */}
            <div className="absolute -inset-3 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#6919FF,transparent_25%,#e1a653_50%,transparent_75%,#6919FF)]" />
            {/* Photo */}
            <div className="absolute inset-0 overflow-hidden rounded-full border-2 border-white/10 shadow-[0_0_80px_-10px_rgba(105,25,255,0.55)]">
              <Image
                src={lokeshImage}
                alt="M. Lokesh, Software Developer"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 380px"
                quality={90}
                className="object-cover object-[center_12%] grayscale transition-[filter] duration-500 group-hover:grayscale-0"
              />
            </div>
            {/* Sparkle accents */}
            <span className="absolute -top-1 left-8 h-2.5 w-2.5 animate-pulse rounded-full bg-[#e1a653] shadow-[0_0_12px_2px_rgba(225,166,83,0.8)]" />
            <span className="absolute right-2 top-1/3 h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_12px_2px_rgba(105,25,255,0.8)]" />
            <span className="absolute bottom-6 -left-2 h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />

            {/* Floating role chip */}
            <div className="absolute -right-4 top-8 rounded-2xl border border-white/15 bg-neutrals-900/80 px-3 py-2 shadow-xl backdrop-blur-md sm:-right-8">
              <p className="text-neutrals-50 text-xs font-bold leading-tight">Software Developer</p>
              <p className="text-neutrals-300 text-[11px] leading-tight">Web · Apps · UI/UX</p>
            </div>
            {/* Floating availability chip */}
            <div className="absolute -left-4 bottom-8 flex items-center gap-2 rounded-2xl border border-white/15 bg-neutrals-900/80 px-3 py-2 shadow-xl backdrop-blur-md sm:-left-8">
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
        </div>

        <div className="w-full py-28 max-lg:mx-auto max-lg:w-11/12 max-lg:max-w-7xl lg:ps-10 xl:ps-20">
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
