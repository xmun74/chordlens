import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-text-primary/10 bg-bg-base">
      <div className="mx-auto max-w-5xl px-8 py-12 flex flex-col items-center gap-6">
        <Link href="/" className="font-[--font-space-grotesk] text-lg font-bold text-text-primary">
          CodeLens
        </Link>

        <nav className="flex items-center gap-8">
          {["Privacy", "Terms", "Support", "API"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="font-[family-name:var(--font-noto-sans-kr)] text-sm text-text-primary/40 hover:text-text-primary/70 transition-colors tracking-wide"
            >
              {link}
            </Link>
          ))}
        </nav>

        <p className="font-[family-name:var(--font-noto-sans-kr)] text-sm text-text-primary/40 tracking-wide">
          © 2026 CodeLens Obsidian Studio. Precision in every fret.
        </p>
      </div>
    </footer>
  );
}
