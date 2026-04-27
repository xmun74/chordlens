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
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-4"></div>
      </nav>
    </header>
  );
}
