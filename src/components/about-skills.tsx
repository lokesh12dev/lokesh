'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

// Icon Imports
import { SiUbuntu } from "react-icons/si";
import { FaReact, FaCloud } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";

import { IconType } from "react-icons";

// Skill Type
type Skill = {
  name: string;
  Icon: IconType;
  color: string;
  textLines: string[];
};

// Skills Array
const skills: Skill[] = [
  {
    name: "Linux",
    Icon: SiUbuntu,
    color: "text-[#E95420]",
    textLines: ["Server Provisioning", "Shell Scripting & Automation", "Service Monitoring & Uptime"],
  },
  {
    name: "React.js",
    Icon: FaReact,
    color: "text-[#61DAFB]",
    textLines: ["Component Architecture", "State Management Patterns", "Performance Optimization"],
  },
  {
    name: "Cloud",
    Icon: FaCloud,
    color: "text-[#4285F4]",
    textLines: ["Scalable Cloud Solutions", "Infrastructure as Code (IaC)", "Serverless Computing"],
  },
  {
    name: "Networking",
    Icon: IoShareSocialOutline,
    color: "text-[#34A853]",
    textLines: ["Network Configuration", "Troubleshooting Protocols", "Security Best Practices"],
  },
];

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AboutSkills = () => {
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const terminalContent =
`lokesh@portfolio:~$ ./whoami --full

┌─ LOKESH.PORTFOLIO ───────────────────────────┐
│  status: open_to_work = true                 │
│  based: Chennai, IN                          │
└──────────────────────────────────────────────┘

> M. Lokesh — software developer & freelancer.
> I turn client ideas into real websites and apps,
> from first concept to final delivery.

lokesh@portfolio:~$ ls ./stack
  C · Python · JavaScript · HTML/CSS · Node.js
  REST APIs · MySQL · Supabase · Git & GitHub
  Figma · Photoshop · Postman · VS Code
  + Tally & Zoho Books — business fluency included

lokesh@portfolio:~$ ./mode
● ships_complete = true
● feedback_driven = true
● always_learning = true

lokesh@portfolio:~$ echo $INVITE
> Have an idea? Let's build it together.

lokesh@portfolio:~$
`;

  // Color each terminal line by its shape (prompt / quote / status / frame).
  const renderTerminalLine = (line: string, key: number) => {
    let cls = '';
    if (line.startsWith('lokesh@')) cls = 'text-cyan-300 font-bold';
    else if (line.startsWith('>')) cls = 'text-white';
    else if (line.startsWith('●')) cls = 'text-emerald-300';
    else if (line.startsWith('┌') || line.startsWith('└') || line.startsWith('│')) cls = 'text-white/50';
    else if (/^\s{2}\S/.test(line)) cls = 'text-amber-200';
    return (
      <div key={key} className={cls}>
        {line === '' ? ' ' : line}
      </div>
    );
  };

  const typingInterval = 14;
  const charsPerTick = 3;

  const skipTyping = () => setDisplayedText(terminalContent);

  useEffect(() => {
    const currentRef = terminalBodyRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !startTyping) {
          setStartTyping(true);
        }
      },
      { threshold: 0.3 }
    );
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [startTyping]);

  // Check if typing is complete
  const isTypingComplete = displayedText.length >= terminalContent.length;

  useEffect(() => {
    if (!startTyping || isTypingComplete) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDisplayedText((prev) => prev + terminalContent.slice(prev.length, prev.length + charsPerTick));
    }, typingInterval);

    return () => clearTimeout(timeoutId);
  }, [startTyping, displayedText, terminalContent, typingInterval, isTypingComplete]);

  // Update typingComplete when typing finishes
  useEffect(() => {
    if (isTypingComplete && !typingComplete) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Required to sync derived state for scroll behavior
      setTypingComplete(true);
    }
  }, [isTypingComplete, typingComplete]);

  // Only auto-scroll if user is not manually scrolling and typing is not complete
  useEffect(() => {
    if (terminalBodyRef.current && !isUserScrolling && !typingComplete) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [displayedText, isUserScrolling, typingComplete]);

  // Detect user scrolling
  const handleScroll = () => {
    if (terminalBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalBodyRef.current;
      // If user scrolls up (not at bottom), mark as user scrolling
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setIsUserScrolling(!isAtBottom);
    }
  };

  return (
    <div className="relative py-16 md:py-24 px-4 md:px-8">
      
      {/* Skills Icons */}
      <motion.div
        className="max-w-screen-lg mx-auto grid grid-cols-2 justify-items-center gap-x-8 gap-y-12 sm:gap-x-12 md:flex md:flex-wrap md:justify-center md:gap-x-20 md:gap-y-12 lg:gap-x-28 mb-16 sm:mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {skills.map((skill) => {
          return (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              className="flex flex-col items-center w-28 sm:w-32 md:w-36 text-center"
              title={skill.name}
              aria-label={`Skill: ${skill.name}`}
            >
              <skill.Icon size={35} className={`${skill.color}`} aria-label={skill.name} />
              <span className="mt-2 text-sm font-semibold text-center text-neutrals-300 font-sans">
                {skill.name}
              </span>
              <div className="skill-popup-text w-full h-[4.5em] text-center text-xs sm:text-sm font-jetbrains text-[#39FF14] flex items-center justify-center">
                <Typewriter
                  words={skill.textLines}
                  loop={0}
                  cursor
                  cursorStyle="_"
                  typeSpeed={40}
                  deleteSpeed={20}
                  delaySpeed={2500}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Terminal with GitHub-style glow */}
      <motion.div
        className="relative max-w-4xl w-full mx-auto mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Terminal glow effect - purple glow behind terminal */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/30 to-primary/20 rounded-3xl blur-2xl opacity-60" />
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-400/20 to-primary/30 rounded-2xl blur-xl opacity-40" />
        
        {/* Terminal container with rounded design */}
        <div className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-[#30363d] shadow-2xl">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
            <span className="h-3 w-3 bg-[#ff5f56] rounded-full"></span>
            <span className="h-3 w-3 bg-[#ffbd2e] rounded-full"></span>
            <span className="h-3 w-3 bg-[#27ca3f] rounded-full"></span>
            <span className="ml-4 text-xs text-neutrals-400 font-mono">lokesh@portfolio ~ terminal</span>
            {startTyping && !isTypingComplete && (
              <button
                onClick={skipTyping}
                className="ml-auto text-[11px] font-mono px-3 py-1.5 min-h-9 rounded-lg border border-[#30363d] text-neutrals-400 hover:text-white hover:border-neutrals-500 transition-colors"
              >
                skip ▸▸
              </button>
            )}
          </div>
          {/* Terminal body - with custom scrollbar */}
          <div
            ref={terminalBodyRef}
            onScroll={handleScroll}
            className="p-6 text-[#39FF14] font-jetbrains text-xs sm:text-sm md:text-base h-[300px] sm:h-[400px] md:h-[450px] overflow-y-auto whitespace-pre-wrap leading-relaxed terminal-scrollbar"
          >
            {displayedText.split('\n').map((line, i) => renderTerminalLine(line, i))}
            <span aria-hidden="true" className="inline-block w-2.5 h-[1.1em] align-middle bg-[#39FF14] animate-pulse" />
          </div>
          {typingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 border-t border-[#30363d] bg-[#161b22] px-6 py-4"
            >
              <a
                href="/pro#work"
                className="px-5 py-2.5 min-h-11 inline-flex items-center rounded-xl bg-[#39FF14]/15 border border-[#39FF14]/40 text-[#39FF14] text-sm font-mono font-bold hover:bg-[#39FF14]/25 transition-colors"
              >
                ./view-work →
              </a>
              <a
                href="/pro#contact"
                className="px-5 py-2.5 min-h-11 inline-flex items-center rounded-xl bg-white/5 border border-white/15 text-white text-sm font-mono hover:bg-white/10 transition-colors"
              >
                ./say-hello
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export { AboutSkills };
