import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-bg-nav border-b border-border/30">
      <nav className="flex h-16 items-center px-8">
        {/* Logo + Nav links */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-2xl font-bold tracking-[-0.05em] text-text-primary"
          >
            <Image src="/icons/logo.svg" alt="ChordLens Logo Image" width={24} height={24} />
            ChordLens
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="relative font-heading text-sm text-accent-dark pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-accent-dark after:rounded-full"
            >
              Practice
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-4">
          {/* User avatar */}
          <div className="h-8 w-8 rounded-full border border-border bg-bg-input overflow-hidden flex items-center justify-center text-xs text-text-secondary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
              <circle cx="9" cy="6" r="3.5" />
              <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" />
            </svg>
          </div>
        </div>
      </nav>
    </header>
  );
}
