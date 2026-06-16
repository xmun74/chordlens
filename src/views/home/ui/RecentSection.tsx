import { getTranslations } from "next-intl/server";
import { ResultList } from "@/features/list-results";

export async function RecentSection(): Promise<React.JSX.Element> {
  const t = await getTranslations();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
      <p className="font-mono text-xs tracking-widest text-text-secondary uppercase mb-4">
        {t("최근")}
      </p>
      <ResultList />
    </section>
  );
}
