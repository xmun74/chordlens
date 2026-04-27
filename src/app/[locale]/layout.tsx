import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { Providers } from "../providers";

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

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children }: Props) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Header />
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
