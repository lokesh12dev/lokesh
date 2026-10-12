'use client';

import Link from 'next/link';

export function CasualFooter() {
  return (
    <footer className="py-8 border-t border-white/10">
      <div className="casual-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Lokesh. Made with ☕ and code.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/lokesh12dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              github
            </Link>
            <Link 
              href="mailto:mr.lokesh7@gmail.com" 
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              email
            </Link>
            <Link 
              href="/pro" 
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              work
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
