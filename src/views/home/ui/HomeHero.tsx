import { getTranslations } from "next-intl/server";
import { BackgroundPaths } from "@/shared/ui/BackgroundPaths";
import { ExtractSection } from "./ExtractSection";

export async function HomeHero(): Promise<React.JSX.Element> {
  const t = await getTranslations();

  return (
    <ExtractSection
      background={<BackgroundPaths className="absolute inset-0 -z-10" />}
      heroCopy={
        <>
          <h1 className="mb-5 font-heading text-4xl leading-[1.15] font-bold tracking-[-0.025em] text-text-primary sm:text-5xl sm:leading-[1.2] lg:mb-6 lg:text-[60px]">
            {t("링크 하나로 시작하는")}
            <div className="bg-linear-to-r from-accent-light to-accent bg-clip-text text-transparent">
              {t("기타 코드 배우기")}
            </div>
          </h1>
          <p className="mb-6 max-w-xl font-sans text-base leading-relaxed text-text-secondary sm:mb-8 sm:text-lg">
            {t("좋아하는 곡의 유튜브 링크를 붙여보세요")}
          </p>
        </>
      }
    />
  );
}
