import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-text-primary/10 bg-bg-base">
      <div className="mx-auto max-w-5xl px-8 py-12 flex flex-col items-center gap-6">
        <Link href="/" className="font-[--font-space-grotesk] text-lg font-bold text-text-primary">
          ChordLens
        </Link>

        <p className="font-noto text-sm text-text-primary/40 tracking-wide">© 2026 ChordLens</p>
      </div>
    </footer>
  );
}
