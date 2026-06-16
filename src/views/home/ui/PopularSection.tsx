import { getTranslations } from "next-intl/server";
import { PopularResults } from "@/features/list-results";

export async function PopularSection(): Promise<React.JSX.Element> {
  const t = await getTranslations();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
        {t("인기")}
      </p>
      <PopularResults />
    </section>
  );
}
