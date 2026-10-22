'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import lokeshSunrise from '@/assets/images/lokesh-mountain-sunrise.png';
import { 
  Cloud, 
  Dumbbell, 
  Code2, 
  Camera, 
  ChefHat, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

// ==================== ANIMATION HELPERS ====================

function Reveal({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ==================== MAIN ABOUT SECTION ====================

export function AboutSection() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="about-sections bg-[#faf8f5]">
      
      {/* ==================== INTRO - BOLD STATEMENT ==================== */}
      <section className="min-h-[80vh] flex items-center relative overflow-hidden">
        {/* Subtle background lines (decorative) */}
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute h-px bg-[#1a1a2e] w-full"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>
        
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-32">
          <Reveal>
            <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-8">
              About Me
            </p>
          </Reveal>
          
          <h2 className="mb-12">
            <Reveal delay={0.1}>
              <span 
                className="block text-5xl md:text-7xl lg:text-[5.5rem] font-black text-[#1a1a2e] leading-[1.05]"
                style={{ fontFamily: "'Mosk', sans-serif" }}
              >
                I&apos;m Lokesh.
              </span>
            </Reveal>
            <Reveal delay={0.2}>
              <span 
                className="block text-5xl md:text-7xl lg:text-[5.5rem] font-black text-[#1a1a2e]/20 leading-[1.05]"
                style={{ fontFamily: "'Mosk', sans-serif" }}
              >
                18 years old.
              </span>
            </Reveal>
            <Reveal delay={0.3}>
              <span 
                className="block text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05]"
                style={{ fontFamily: "'Mosk', sans-serif" }}
              >
                <span className="text-[#d4af37]">Curious</span>
                <span className="text-[#1a1a2e]"> about everything.</span>
              </span>
            </Reveal>
          </h2>

          <Reveal delay={0.4}>
            <p className="text-xl md:text-2xl text-[#555] max-w-2xl leading-relaxed">
              A Software Developer, Web Developer and Freelancer from Chennai, running on
              curiosity, creativity and clean code.
            </p>
          </Reveal>

          {/* Role pills */}
          <Reveal delay={0.5}>
            <div className="flex flex-wrap gap-4 mt-12">
              {[
                { label: 'Developer', icon: Code2 },
                { label: 'Designer', icon: Camera },
                { label: 'Freelancer', icon: Zap },
                { label: 'Creator', icon: Sparkles },
              ].map(({ label, icon: Icon }) => (
                <span 
                  key={label}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1a1a2e] text-[#1a1a2e] font-medium hover:bg-[#1a1a2e] hover:text-white transition-colors duration-300"
                >
                  <Icon size={18} />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== MEET ME - PROFILE IMAGE ==================== */}
      <section className="py-24 md:py-32 bg-[#faf8f5] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image Side */}
            <Reveal className="relative">
              {/* Sunrise portrait with centered name */}
              <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#d4af37] shadow-2xl">
                <Image
                  src={lokeshSunrise}
                  alt="Lokesh"
                  sizes="(max-width: 768px) 80vw, 420px"
                  quality={90}
                  className="h-auto w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              </div>
            </Reveal>

            {/* Text Side */}
            <div className="md:pl-8">
              <Reveal>
                <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-4">
                  Nice to meet you
                </p>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a2e] mb-8 leading-tight"
                  style={{ fontFamily: "'Mosk', sans-serif" }}
                >
                  Meet Me
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-lg md:text-xl text-[#555] leading-relaxed mb-6">
                  That&apos;s me — probably thinking about my next website, a new app idea,
                  or how to make a UI cleaner and faster.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <p className="text-lg md:text-xl text-[#555] leading-relaxed mb-8">
                  A developer from Chennai who codes, designs, and freelances. I understand client
                  ideas and turn them into practical digital solutions — from first concept to
                  final delivery.
                </p>
              </Reveal>
              
              <Reveal delay={0.4}>
                <div className="flex items-center gap-4">
                  <span 
                    className="text-2xl md:text-3xl font-bold text-[#1a1a2e]"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    Welcome to my world ✨
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT I DO - MINIMAL GRID ==================== */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-4">
              What I Do
            </p>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a2e] mb-20"
              style={{ fontFamily: "'Mosk', sans-serif" }}
            >
              The things I obsess over.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
            {[
              { 
                icon: Code2, 
                title: 'Web Development',
                desc: 'HTML, CSS, JavaScript, responsive websites. Building modern, fast, client-ready sites from idea to deployment.'
              },
              { 
                icon: Dumbbell, 
                title: 'Application Development',
                desc: 'Python, Java (learning), basic application development. Practical apps that solve real business problems.'
              },
              { 
                icon: Cloud, 
                title: 'UI/UX Design',
                desc: 'Figma, UI design, responsive layouts, Photoshop and photo editing. Clean interfaces users actually enjoy.'
              },
              { 
                icon: Camera, 
                title: 'Tools & Workflow',
                desc: 'Git, GitHub, VS Code, Postman, AI-assisted tools. Independent end-to-end delivery with clear communication.'
              },
              { 
                icon: ChefHat, 
                title: 'Accounting & Finance',
                desc: 'Tally, Zoho Books, basic accounting knowledge. Understanding business processes, finance and real client needs.'
              },
              { 
                icon: Sparkles, 
                title: 'Always Learning',
                desc: 'C, Node.js, REST APIs, MySQL, Supabase. Continuously improving, exploring new tech and building practical projects.'
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 0.1}>
                <div className="group">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 flex items-center justify-center border-2 border-[#1a1a2e] group-hover:bg-[#d4af37] group-hover:border-[#d4af37] transition-colors duration-300">
                      <Icon size={24} className="text-[#1a1a2e] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{title}</h3>
                      <p className="text-[#666] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MY STORY - TIMELINE ==================== */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-4">
              The Origin Story
            </p>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a2e] mb-20"
              style={{ fontFamily: "'Mosk', sans-serif" }}
            >
              How it all started.
            </h2>
          </Reveal>

          <div className="space-y-16">
            {[
              { 
                phase: '01',
                title: 'The Start',
                text: 'Started with Computer Science in Higher Secondary at St. Joseph Higher Secondary School, Kovalam (2023-2025). Learned how the web works and broke things to understand them.'
              },
              { 
                phase: '02',
                title: 'Freelance Developer',
                text: 'Since 2023, developing websites and applications based on client and business requirements. Learned to plan, build interfaces, test features and implement revisions.'
              },
              { 
                phase: '03',
                title: 'Building Real Things',
                text: 'Projects like Kadal Thunai modular e-commerce platform, reusable portfolio system, and B2B Trading Platform. Real clients, real feedback, real delivery from idea to completion.'
              },
              { 
                phase: '04',
                title: 'Design + Business',
                text: 'Added UI/UX with Figma, Photoshop and photo editing. Added Tally and Zoho Books for accounting and finance understanding — tech plus business processes.'
              },
              { 
                phase: '05',
                title: 'Now',
                text: 'B.Com at Hindustan Institute of Technology and Science (HITS), Chennai, continuing through online study. Still freelancing, still learning C, Python, JavaScript, AI tools — and building.'
              },
            ].map(({ phase, title, text }, index) => (
              <Reveal key={phase} delay={index * 0.1}>
                <div className="flex gap-8 md:gap-12">
                  <div className="flex-shrink-0">
                    <span className="text-6xl md:text-7xl font-black text-[#1a1a2e]/10">{phase}</span>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-2xl font-bold text-[#1a1a2e] mb-3">{title}</h3>
                    <p className="text-lg text-[#555] leading-relaxed">{text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BEYOND CODE ==================== */}
      <section className="py-32 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-4">
              My Current Life
            </p>
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a2e] mb-12"
              style={{ fontFamily: "'Mosk', sans-serif" }}
            >
              Beyond Code
            </h2>
          </Reveal>

          <div className="space-y-6 text-lg md:text-xl text-[#555] leading-relaxed">
            <Reveal delay={0.1}>
              <p>
                I&apos;m M. Lokesh, a software developer with a strong interest in technology, coding, web development, application development, AI, and UI/UX design.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p>
                I have experience working as a freelancer, developing websites and applications based on client and business requirements. I understand client ideas, turn them into practical digital solutions, communicate throughout the development process, implement feedback, and independently take projects from initial concept to completion.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p>
                I have worked with technologies such as C, Python, JavaScript, Git/GitHub, web technologies, and AI tools, along with skills in UI/UX design, web design, Photoshop, and photo editing. I also have knowledge of Tally and Zoho Books, giving me an additional understanding of accounting, finance, and business processes.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                Education: Hindustan Institute of Technology and Science (HITS), Chennai — B.Com 2025-Present, and St. Joseph Higher Secondary School, Kovalam — Computer Science 2023-2025. Based in Chennai, Tamil Nadu, India.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p>
                I&apos;m continuously learning, improving my technical skills, exploring new technologies, and building practical projects that combine technology, creativity, and real-world problem solving.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
}

// ==================== PREMIUM FOOTER ====================
export function CasualFooter() {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleProClick = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/pro');
    }, 1500);
  };

  return (
    <>
      {/* Full-screen loading overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-[#0f0f1a] flex flex-col items-center justify-center"
            role="status"
            aria-label="Switching to Pro Mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-16 h-16 mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d4af37]" />
            </motion.div>
            
            <motion.p
              className="text-xl text-white font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Switching to Pro Mode
            </motion.p>
            
            <motion.p
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Loading...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-[#0f0f1a] text-white">
        {/* CTA Section */}
        <div className="py-24 px-6 md:px-12 border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#d4af37] font-medium uppercase tracking-[0.3em] text-sm mb-6">
                There&apos;s more
              </p>
              <h3 
                className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6"
                style={{ fontFamily: "'Mosk', sans-serif" }}
              >
                See the professional side.
              </h3>
              <p className="text-lg text-gray-400 mb-10 max-w-xl">
                Projects, skills, and the things I&apos;ve actually built. 
                The organized chaos.
              </p>
              
              <motion.button
                onClick={handleProClick}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-[#1a1a2e] font-bold text-lg hover:bg-white transition-colors duration-300"
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
              >
                View Pro Side
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="py-8 px-6 md:px-12">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Lokesh
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a 
                href="mailto:mr.lokesh7@gmail.com" 
                className="hover:text-[#d4af37] transition-colors"
              >
                Email
              </a>
              <a 
                href="https://github.com/lokesh12dev"
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#d4af37] transition-colors"
              >
                GitHub
              </a>
              <a 
                href="tel:+917603883879"
                className="hover:text-[#d4af37] transition-colors"
              >
                Phone
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
