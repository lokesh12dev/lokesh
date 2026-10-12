'use client';

import { useLockBody } from '@/hooks/use-lock-body';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Generate random IP - moved outside component to avoid re-computation
const generateRandomIP = () => 
  `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

interface BootloaderProps {
  onBootComplete: () => void;
}

const BootloaderSequence: React.FC<BootloaderProps> = ({ onBootComplete }) => {
  const [displayLines, setDisplayLines] = useState<string[]>(['']);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [cleared, setCleared] = useState(false);

  // Generate random IP only once using lazy state initialization
  const [randomIP] = useState(generateRandomIP);

  // Fallback timeout to ensure bootloader always completes
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      onBootComplete();
    }, 15000); // 15 seconds fallback

    return () => clearTimeout(fallbackTimeout);
  }, [onBootComplete]);

  const bootSequence = useMemo(() => [
    `ssh ssh@${randomIP} -u lokesh`,
    'Password: ********',
    '',
    'Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-78-generic x86_64)',
    '',
    ' * Documentation:  https://help.ubuntu.com',
    ' * Management:     https://landscape.canonical.com',
    ' * Support:        https://ubuntu.com/advantage',
    '',
    'System information as of Mon Apr 28 17:50:05 UTC 2025',
    '',
    'System load:  0.03    Processes: 111    Memory usage: 24%',
    '',
    'lokesh@ubuntu:~$ whoami',
    'lokesh',
    'lokesh@ubuntu:~$ pwd',
    '/home/lokesh',
    'lokesh@ubuntu:~$ ls -la',
    'total 64',
    'drwxr-xr-x 8 lokesh lokesh 4096 Apr 28 17:48 .',
    'drwxr-xr-x 3 root  root  4096 Apr 28 17:45 ..',
    '-rwx------ 1 lokesh lokesh 2048 Apr 28 17:47 .stealth_init',
    '-rw-r--r-- 1 lokesh lokesh  256 Apr 28 17:48 .portfolio_config',
    'drwxr-xr-x 2 lokesh lokesh 4096 Apr 28 17:48 creative_arsenal',
    'lokesh@ubuntu:~$ cat .portfolio_config',
    '[LOKESH_STUDIO_CONFIG]',
    'MODE=CREATIVE_GENIUS',
    'INNOVATION_LEVEL=MAXIMUM',
    'DESIGN_PROTOCOLS=ACTIVATED',
    'lokesh@ubuntu:~$ bash ./.stealth_init',
    '[+] Initializing LOKESH modules...',
    '[+] Scanning creative frequencies...',
    '[+] Preparing to unpack portfolio matrix...',
    '[+] Unpacking visual assets... [████████████████████] 100%',
    '[+] Decrypting design blueprints...',
    '[+] Loading innovation algorithms...',
    '[+] Setting up creative environment...',
    '[+] Bypassing creative blocks... SUCCESS',
    '[+] Injecting inspiration protocols...',
    '[+] Synchronizing artistic vision...',
    '[+] Calibrating aesthetic sensors...',
    '[+] Activating design time machine...',
    '[+] Portfolio neural network: ONLINE',
    '[+] Creative arsenal: LOADED',
    '[+] Design logs synchronized...',
    '[+] LOKESH initialization: COMPLETE',
    '[!] WARNING: Extreme creativity levels detected!',
    '[!] Prepare for visual overload...',
    'lokesh@ubuntu:~$ echo "Welcome to the future of design"',
    'Welcome to the future of design',
    'lokesh@ubuntu:~$'
  ], [randomIP]);

  useEffect(() => {
    if (currentLineIndex < bootSequence.length) {
      const currentLine = bootSequence[currentLineIndex] || '';

      if (currentLineIndex <= 1) {
        // First two lines: character by character
        if (currentCharIndex < currentLine.length) {
          const timeout = setTimeout(() => {
            setDisplayLines(prev => {
              const updatedLines = [...prev];
              const lastIndex = updatedLines.length - 1;
              if (lastIndex >= 0 && currentLine && currentCharIndex < currentLine.length) {
                const char = currentLine[currentCharIndex];
                if (char && updatedLines[lastIndex] !== undefined) {
                  updatedLines[lastIndex] += char;
                }
              }
              return updatedLines;
            });
            setCurrentCharIndex(prev => prev + 1);
          }, 50); // Slow typing
          return () => clearTimeout(timeout);
        } else {
          // Line complete, move to next line
          const timeout = setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
            setDisplayLines(prev => [...prev, '']);
          }, 200); // Brief pause before next line
          return () => clearTimeout(timeout);
        }
      } else {
        // Other lines: full line at once (including empty lines)
        let lineDelay = 20; // Fast default timing
        
        // Add dramatic pauses for certain lines
        if (currentLine && (
            currentLine.includes('[+] Unpacking visual assets') || 
            currentLine.includes('[!] WARNING') || 
            currentLine.includes('[+] Portfolio neural network') ||
            currentLine.includes('[+] LOKESH initialization'))) {
          lineDelay = 150; // Dramatic effect
        } else if (currentLine && (currentLine.includes('███') || currentLine.includes('SUCCESS'))) {
          lineDelay = 80; // Medium speed
        }
        
        const timeout = setTimeout(() => {
          const nextLine = bootSequence[currentLineIndex] || ''; // Handle empty lines
          setDisplayLines(prev => [...prev.slice(0, -1), nextLine]);
          setCurrentLineIndex(prev => prev + 1);
          setDisplayLines(prev => [...prev, '']);
        }, lineDelay);
        return () => clearTimeout(timeout);
      }
    } else {
      // Boot sequence complete - properly handle completion
      const completeSequence = () => {
        setCleared(true);
        
        setTimeout(() => {
          setShowAccessGranted(true);
          
          setTimeout(() => {
            onBootComplete();
          }, 1000);
        }, 500);
      };
      
      const timeout = setTimeout(completeSequence, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex, bootSequence, onBootComplete]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal boot sequence. Press Escape to skip."
      className="fixed inset-0 bg-black text-green-400 font-mono text-lg md:text-xl p-6 overflow-hidden select-none flex flex-col items-start justify-start z-[9999]"
    >
      <button
        type="button"
        onClick={onBootComplete}
        className="absolute top-4 right-4 z-10 rounded-md border border-green-400/40 px-4 py-2 min-h-11 text-sm text-green-400 hover:bg-green-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 transition-colors"
      >
        Skip intro (Esc)
      </button>
      {!cleared ? (
        <div className="whitespace-pre-wrap leading-tight w-full" aria-hidden="true">
          {displayLines.map((line, idx) => (
            <div
              key={idx}
              className="overflow-hidden whitespace-nowrap"
            >
              {line}
            </div>
          ))}
          <div className="terminal-cursor animate-pulse mt-1">_</div>
        </div>
      ) : (
        showAccessGranted && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col md:flex-row md:space-x-4 text-green-400 text-3xl md:text-6xl font-bold tracking-wider items-center justify-center text-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 md:mb-0"
              >
                ACCESS GRANTED.
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                WELCOME TO LOKESH
              </motion.div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// Helper function to check initial bootloader state from localStorage
const getInitialBootloaderState = (): { shouldShow: boolean; showPrompt: boolean } => {
  if (typeof window === 'undefined') {
    return { shouldShow: false, showPrompt: false };
  }
  
  const hasVisited = localStorage.getItem('lokesh-studio-visited');
  const lastVisit = localStorage.getItem('lokesh-studio-last-visit');
  const refreshCount = parseInt(localStorage.getItem('lokesh-studio-refresh-count') || '0');
  const lastRefreshTime = parseInt(localStorage.getItem('lokesh-studio-last-refresh') || '0');
  const now = Date.now();
  
  const currentUrl = window.location.href;
  const lastUrl = localStorage.getItem('lokesh-studio-last-url');
  
  // Update localStorage for tracking
  if (lastUrl && lastUrl !== currentUrl) {
    localStorage.setItem('lokesh-studio-refresh-count', '0');
  } else {
    if (now - lastRefreshTime > 30000) {
      localStorage.setItem('lokesh-studio-refresh-count', '1');
    } else {
      localStorage.setItem('lokesh-studio-refresh-count', (refreshCount + 1).toString());
    }
  }
  localStorage.setItem('lokesh-studio-last-url', currentUrl);
  localStorage.setItem('lokesh-studio-last-refresh', now.toString());
  
  const currentRefreshCount = parseInt(localStorage.getItem('lokesh-studio-refresh-count') || '1');
  
  // Show bootloader if: never visited OR last visit was more than 1 hour ago
  if (!hasVisited || (lastVisit && now - parseInt(lastVisit) > 60 * 60 * 1000)) {
    return { shouldShow: true, showPrompt: false };
  }
  
  // Show prompt if user refreshed 2+ times within 30 seconds
  if (currentRefreshCount >= 2 && hasVisited && lastUrl === currentUrl) {
    localStorage.setItem('lokesh-studio-refresh-count', '0');
    return { shouldShow: false, showPrompt: true };
  }
  
  return { shouldShow: false, showPrompt: false };
};

function Bootloader() {
  // Render nothing until mounted so SSR HTML matches the first client render.
  // Visibility is decided client-side in an effect (localStorage is client-only).
  const [isMounted, setIsMounted] = useState(false);
  const [shouldShowBootloader, setShouldShowBootloader] = useState(false);
  const [isBootloaderActive, setIsBootloaderActive] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  useLockBody(isBootloaderActive);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount sync from client-only storage
    setIsMounted(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const state = getInitialBootloaderState();
    setShouldShowBootloader(state.shouldShow);
    setIsBootloaderActive(state.shouldShow);
    setShowPrompt(state.showPrompt);
  }, []);

  const handleBootComplete = useCallback(() => {
    // Mark as visited and set timestamp
    localStorage.setItem('lokesh-studio-visited', 'true');
    localStorage.setItem('lokesh-studio-last-visit', Date.now().toString());
    
    // Immediately hide bootloader
    setIsBootloaderActive(false);
    setShouldShowBootloader(false);
  }, []);

  // Emergency escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isBootloaderActive) {
        handleBootComplete();
      }
    };

    if (isBootloaderActive) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
    return; // Return void for consistency
  }, [isBootloaderActive, handleBootComplete]);

  const handlePromptYes = () => {
    setShowPrompt(false);
    setShouldShowBootloader(true);
    setIsBootloaderActive(true);
  };

  const handlePromptNo = () => {
    setShowPrompt(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {/* Bootloader */}
      {shouldShowBootloader && isBootloaderActive && (
        <motion.div
          key="bootloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 0.95 
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="fixed inset-0 z-[9999]"
        >
          <BootloaderSequence onBootComplete={handleBootComplete} />
        </motion.div>
      )}
      
      {/* Refresh Prompt */}
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bootloader-prompt-title"
          aria-describedby="bootloader-prompt-description"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-neutrals-800 border border-neutrals-600 rounded-lg p-6 max-w-md mx-4 text-center"
          >
            <div className="mb-4">
              <h3 id="bootloader-prompt-title" className="text-xl font-bold text-neutrals-50 mb-2">
                Terminal Access
              </h3>
              <p id="bootloader-prompt-description" className="text-neutrals-300 text-sm">
                I noticed you refreshed a few times. Want to see the bootloader sequence again?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handlePromptYes}
                className="px-4 py-2 min-h-11 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Yes, show me!
              </button>
              <button
                onClick={handlePromptNo}
                className="px-4 py-2 min-h-11 bg-neutrals-700 hover:bg-neutrals-600 text-neutrals-200 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Bootloader };
