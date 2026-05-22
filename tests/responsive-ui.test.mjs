import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("home page uses responsive containment for mobile-first sections", () => {
  const home = read("src/views/home/ui/HomePage.tsx");

  assert.match(home, /overflow-x-clip/);
  assert.match(home, /px-4/);
  assert.match(home, /sm:px-6/);
  assert.match(home, /lg:px-8/);
  assert.match(home, /text-4xl/);
});

test("result page preserves section order and contains wide children", () => {
  const result = read("src/views/result/ui/ResultPage.tsx");
  const order = [
    result.indexOf("<VideoCard"),
    result.indexOf("<LyricsChordPlayer"),
    result.indexOf("<ChordGrid"),
    result.indexOf("<ShareButton"),
  ];

  assert.ok(order.every((index) => index >= 0), "expected all result sections to be present");
  assert.deepEqual(
    [...order].sort((a, b) => a - b),
    order,
    "result section order must remain VideoCard, LyricsChordPlayer, ChordGrid, ShareButton",
  );
  assert.match(result, /min-w-0/);
  assert.match(result, /overflow-x-clip/);
});

test("lyrics chord player stacks controls on mobile with internal timeline scrolling", () => {
  const player = read("src/entities/chord/ui/LyricsChordPlayer.tsx");

  assert.match(player, /flex-col lg:flex-row/);
  assert.match(player, /h-\[180px\]/);
  assert.match(player, /min-w-0/);
  assert.match(player, /shrink-0/);
  assert.match(player, /overflow-hidden/);
  assert.match(player, /lg:flex-1/);
  assert.match(player, /h-full overflow-x-auto/);
  assert.match(player, /h-11 w-11/);
});

test("chord grid and result lists use responsive/internal overflow strategies", () => {
  const chordGrid = read("src/entities/chord/ui/ChordGrid.tsx");
  const resultList = read("src/features/list-results/ui/ResultList.tsx");
  const popularList = read("src/features/list-results/ui/PopularList.tsx");

  assert.match(chordGrid, /overflow-x-auto/);
  assert.match(chordGrid, /min-w-max/);
  assert.match(resultList, /grid-cols-1/);
  assert.match(resultList, /sm:grid-cols-2/);
  assert.match(resultList, /lg:grid-cols-3/);
  assert.match(popularList, /auto-cols-\[11rem\]/);
});

test("scope guard: responsive pass does not add SEO or backend API expansion", () => {
  const touchedUi = [
    "src/views/home/ui/HomePage.tsx",
    "src/views/result/ui/ResultPage.tsx",
    "src/entities/chord/ui/LyricsChordPlayer.tsx",
    "src/entities/chord/ui/ChordGrid.tsx",
    "src/entities/video/ui/VideoCard.tsx",
    "src/features/extract-chord/ui/UrlInputForm.tsx",
    "src/features/list-results/ui/ResultList.tsx",
    "src/entities/result/ui/ResultListItemCard.tsx",
    "src/features/list-results/ui/PopularList.tsx",
    "src/features/list-results/ui/PopularAlbumCard.tsx",
  ]
    .map(read)
    .join("\n");

  assert.doesNotMatch(touchedUi, /structuredData|jsonLd|canonical|sitemap|robots/i);
  assert.doesNotMatch(touchedUi, /NextResponse|export async function (GET|POST|PUT|DELETE)/);
});
