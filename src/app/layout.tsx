import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChordLens — Learn guitar chords from any YouTube video",
  description:
    "Unlock the secrets of your favorite tracks. Paste a YouTube link to get high-fidelity chord analysis in seconds.",
  openGraph: {
    title: "ChordLens",
    description: "Learn guitar chords from any YouTube video.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      style={{ colorScheme: "dark" }}
      className={[
        inter.variable,
        spaceGrotesk.variable,
        spaceMono.variable,
        notoSansKR.variable,
      ].join(" ")}
    >
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        <Providers>
          <Header />
          <div className="flex flex-col min-h-[calc(100vh-64px)]">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
