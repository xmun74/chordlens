import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-bg-nav border-b border-border/30">
      <nav className="flex h-16 items-center px-8">
        {/* Logo + Nav links */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-[-0.05em] text-text-primary"
          >
            CodeLens
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="relative font-[family-name:var(--font-space-grotesk)] text-sm text-accent-dark pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-accent-dark after:rounded-full"
            >
              Practice
            </Link>
            <Link
              href="/library"
              className="font-[family-name:var(--font-space-grotesk)] text-sm text-text-primary/60 hover:text-text-primary transition-colors"
            >
              Library
            </Link>
            <Link
              href="/theory"
              className="font-[family-name:var(--font-space-grotesk)] text-sm text-text-primary/60 hover:text-text-primary transition-colors"
            >
              Theory
            </Link>
          </div>
        </div>

        {/* Right: theme + avatar */}
        <div className="ml-auto flex items-center gap-4">
          {/* Bell icon */}
          <button
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="알림"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 16.5a2 2 0 0 0 4 0" strokeLinecap="round" />
            </svg>
          </button>

          {/* User avatar */}
          <div className="h-8 w-8 rounded-full border border-border bg-bg-input overflow-hidden flex items-center justify-center text-xs text-text-secondary">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <circle cx="9" cy="6" r="3.5" />
              <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" />
            </svg>
          </div>
        </div>
      </nav>
    </header>
  );
}
