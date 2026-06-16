import { HomeHero } from "./HomeHero";
import { PopularSection } from "./PopularSection";
import { RecentSection } from "./RecentSection";

export function HomePage(): React.JSX.Element {
  return (
    <main className="min-h-screen overflow-x-clip">
      <HomeHero />
      <PopularSection />
      <RecentSection />
    </main>
  );
}
