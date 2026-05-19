# PRD: Mobile Responsive UI First Pass

## Metadata

- Source spec: `.omx/specs/deep-interview-mobile-responsive-seo-aeo.md`
- Planning mode: ralplan consensus
- Architect verdict: ITERATE, addressed
- Critic verdict: APPROVE
- Scope: existing home and result screens only

## Decision

Implement a narrow first PR that makes the existing ChordLens home and result screens mobile responsive. Use containment and adaptive layout, not redesign. Preserve current desktop result-page flow and defer SEO/AEO implementation to a later PR.

## Principles

1. Containment over redesign: wide music UI should scroll inside its own component, not force viewport overflow.
2. Preserve desktop reference: desktop flow and geometry should not materially drift.
3. Keep logic stable: do not refactor playback timing, data fetching, APIs, metadata, or chord rendering internals for this PR.
4. Mobile usability first: no page-level horizontal scroll, no clipping/overlap, readable content, usable primary touch targets.
5. Verify the priority surface: result page mobile behavior must be checked with a real route or an explicit fallback.

## Decision Drivers

- Mobile viewport correctness across 375px, 430px, 768px, and desktop.
- Tight first-PR scope with low regression risk.
- Result-page usability without changing the product information architecture.

## Alternatives Considered

### A. Internal Containment Plan

Chosen. Make page shells responsive, stack only where fixed-width children break layout, and contain timeline/chord vocabulary overflow inside component scroll areas.

Pros:

- Fits the user's strict first-PR boundary.
- Avoids playback/data/SEO regressions.
- Preserves desktop result flow.

Cons:

- Some mobile areas remain horizontally scrollable by design.
- Requires careful overflow verification.

### B. Mobile-Specific Result Redesign

Rejected. Reordering or redesigning the result experience could improve mobile affordance, but the user explicitly asked to use the current desktop result screen as the reference and avoid redesign.

### C. Bundle SEO/AEO With Responsive PR

Rejected. The user explicitly split SEO/AEO into a later PR. This PR should preserve existing metadata behavior without expanding it.

## In Scope

- `src/views/home/ui/HomePage.tsx`
- `src/views/result/ui/ResultPage.tsx`
- `src/entities/chord/ui/LyricsChordPlayer.tsx`
- `src/entities/chord/ui/ChordGrid.tsx`
- `src/entities/chord/ui/ChordDiagram.tsx` only if needed for containment, not rendering logic refactor
- `src/entities/video/ui/VideoCard.tsx` if title/stat wrapping or width containment is needed
- `src/features/extract-chord/ui/UrlInputForm.tsx`
- `src/features/list-results/ui/ResultList.tsx`
- `src/features/list-results/ui/PopularList.tsx` and cards if mobile widths overflow
- Shared header/footer only if they create scoped page overflow

## Out Of Scope

- Brand or design-system redesign.
- New UI library or broad dependency changes.
- Backend/API changes.
- New pages, blog, landing page, or content strategy.
- SEO/AEO implementation, structured data, sitemap/robots, canonical/alternate expansion, or broad metadata work.
- Playback/timing/data-fetching refactors.

## Implementation Plan

1. Establish baseline and result-route verification path.
   - Confirm current home and result layouts at 375, 430, 768, and desktop.
   - Find a usable existing result id from local/API state if possible.
   - If no result route is available, use a temporary uncommitted verification path or document the exact blocker and perform component-level checks.

2. Make the result page shell responsive.
   - In `ResultPage`, apply responsive padding and gaps such as `px-4 sm:px-6 lg:px-8`, tighter mobile `py/gap`, and `w-full min-w-0` containment around child sections.
   - Preserve the current vertical order: `VideoCard`, `LyricsChordPlayer`, `ChordGrid`, `ShareButton`.

3. Contain `LyricsChordPlayer`.
   - Preserve desktop row layout at large breakpoint.
   - On mobile/tablet, stack the fixed player/control rail above the timeline inside the same card.
   - Keep `PX_PER_SEC`, `PLAYHEAD_LEFT`, `totalWidth`, scroll/seek/playback logic unchanged.
   - Ensure timeline overflow stays internal with `min-w-0`, `overflow-hidden`, and an internal `overflow-x-auto` scroll container.
   - Increase primary play control to at least 44px on mobile.
   - Verify playhead alignment and scroll seek after stacking.

4. Contain `ChordGrid`.
   - Use a single mobile strategy: prev/current/next remain in order inside an internal horizontal scroll strip.
   - Keep fixed `ChordDiagram` size props.
   - Remove or adapt fixed placeholder widths that force viewport overflow.
   - Preserve current chord emphasis and desktop centered three-up layout.

5. Make home responsive.
   - Reduce mobile padding and hero type scale with existing Tailwind utilities.
   - Keep desktop hero composition materially unchanged; collapse/neutralize the empty right column only where it affects mobile layout.
   - Ensure URL input, clear button, drag/drop area, and submit button fit mobile widths.
   - Make recent results responsive, for example `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
   - Keep popular list horizontally scrollable, reducing mobile auto column width if needed.

6. Apply scoped touch/readability hardening.
   - Add `min-w-0`, wrapping, line clamps, and responsive spacing where overflow is found.
   - Preserve focus states and accessibility labels.
   - Keep primary touch targets at practical mobile sizes, especially playback and form controls.

7. Verify and document.
   - Run lint/build when dependency state allows.
   - Inspect home and result route at target widths.
   - Check `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
   - Confirm desktop still matches the existing flow.
   - Confirm no SEO/AEO implementation was added.

## ADR

### Decision

Use responsive containment for existing home/result screens, with internal horizontal scroll for intrinsically wide music UI.

### Drivers

- Mobile usability is the first priority.
- Result page is the most complex and important surface.
- User requested no redesign and no SEO/AEO implementation in this first PR.

### Why Chosen

This approach fixes mobile breakage while minimizing product and technical regression risk. It respects the desktop result page as the source flow and avoids changing playback, chord rendering, data, or metadata behavior.

### Consequences

- Some components, especially timeline and chord vocabulary, may intentionally scroll horizontally inside their own bounds on mobile.
- Verification must check both page-level overflow and internal scroll usability.
- SEO/AEO work remains a separate later PR.

### Follow-Ups

- Later SEO/AEO PR: metadata, OpenGraph/Twitter, structured data, canonical/alternate, sitemap/robots, answer-focused copy structure.
- Optional later mobile UX enhancement: if user wants, revisit whether result page should get a mobile-specific information hierarchy after the containment pass.

## Available Agent Types

- `ralph`: best for sequential implementation with persistent verification.
- `team`: useful if splitting into independent lanes, such as result page, home page, and verification.
- `autopilot`: acceptable for a single-agent plan-plus-execute pass, but less explicit about lane ownership.

## Staffing Guidance

### Ralph

Recommended if prioritizing coherence and low regression risk.

Suggested reasoning: `high` for implementation because `LyricsChordPlayer` and `ChordGrid` have fixed layout/math interactions.

Launch hint:

```bash
$ralph .omx/plans/prd-mobile-responsive-ui-20260519T052151Z.md
```

### Team

Recommended only if the user wants parallel execution.

Suggested lanes:

- Result lane, high reasoning: `ResultPage`, `LyricsChordPlayer`, `ChordGrid`, `ChordDiagram`.
- Home lane, medium reasoning: `HomePage`, `UrlInputForm`, `ResultList`, `PopularList`.
- Verification lane, medium reasoning: dev server, viewport checks, overflow checks, build/lint.

Launch hint:

```bash
$team .omx/plans/prd-mobile-responsive-ui-20260519T052151Z.md
```

Team verification path:

- Verification lane must run after integration or against the integrated branch.
- Any route-level result fallback must be recorded in the final notes.
