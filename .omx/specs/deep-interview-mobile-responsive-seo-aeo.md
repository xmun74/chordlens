# Deep Interview Spec: Mobile Responsive UI First Pass

## Metadata

- Slug: mobile-responsive-seo-aeo
- Profile: standard
- Context type: brownfield
- Final ambiguity: 18%
- Threshold: 20%
- Context snapshot: `.omx/context/mobile-responsive-seo-aeo-20260519T050442Z.md`
- Transcript: `.omx/interviews/mobile-responsive-seo-aeo-20260519T051413Z.md`

## Intent

Implement a first-pass mobile responsive UI for existing ChordLens screens. The priority is mobile usability and layout correctness. SEO/AEO matters as a broader product concern, but should be separated into a later PR.

## Desired Outcome

The existing home and result pages should work cleanly across mobile, tablet, and desktop widths. The result page is the most important surface because it contains the complex learning flow: video metadata/player context, lyrics/chords, chord grid, and sharing.

Mobile result layout should use the current desktop result page as the reference flow. Do not invent a new mobile information architecture unless required to prevent overflow or unusable interaction.

## In Scope

- Existing home page responsive improvements.
- Existing result page responsive improvements.
- Responsive fixes for components used by those pages when needed, especially:
  - `VideoCard`
  - `LyricsChordPlayer`
  - `ChordGrid`
  - related chord/lyrics/result list UI that appears on the scoped pages
- Spacing, layout, wrapping, overflow, touch target, and viewport adaptation fixes.
- Preserve existing SEO metadata behavior without expanding SEO/AEO implementation.
- Verify at representative viewport widths: 375px, 430px, 768px, and desktop.

## Out of Scope / Non-goals

- Full brand or design-system redesign.
- New UI library or broad dependency changes.
- Backend/API changes.
- Blog, landing page, or new content surfaces.
- SEO/AEO implementation as a separate feature, including structured data, sitemap/robots work, canonical/alternate expansion, or broad metadata strategy.
- Unrequested refactors outside the responsive UI surface.

## Decision Boundaries

OMX may decide:

- Exact responsive breakpoints and Tailwind class adjustments, following existing project conventions.
- Component-level layout changes necessary to remove overflow and improve mobile usability.
- Minor spacing and typography adjustments needed for mobile readability.
- Whether a scoped child component must be adjusted because it causes home/result page overflow.

OMX should not decide without further confirmation:

- Major visual rebranding or wholesale redesign.
- New libraries or architecture changes.
- API/data contract changes.
- New SEO/AEO feature implementation.
- New pages or content strategy changes.

## Constraints

- Preserve the current tech stack: Next.js, React, Tailwind CSS v4, next-intl.
- Keep changes tightly scoped to existing screens.
- Result page should remain aligned with the current desktop flow.
- Do not degrade existing metadata behavior.

## Acceptance Criteria

- Home page has no horizontal overflow at 375px, 430px, 768px, and desktop widths.
- Result page has no horizontal overflow at 375px, 430px, 768px, and desktop widths.
- On mobile, result page content is readable and usable without awkward clipping or layout overlap.
- On mobile, video/result summary, lyrics/chords, chord grid, and share action follow the current desktop flow in an adapted responsive layout.
- Touch targets for primary interactions are usable on mobile.
- Existing desktop layout remains visually coherent after responsive changes.
- Existing SEO metadata routes still build and behave as before; no SEO/AEO expansion is included in this first PR.
- Project quality checks pass or any failures are documented with cause.

## Assumptions Exposed + Resolutions

- Assumption: SEO/AEO should be included in the same PR because the initial request mentioned it.
  - Resolution: False for this first pass. SEO/AEO should be a later PR; responsive UI is the current PR.
- Assumption: Mobile result layout may need a new priority order.
  - Resolution: Use the current desktop result page as the reference flow.
- Assumption: The result page is the key surface.
  - Resolution: Confirmed; it is more complex and more important than home.

## Pressure-Pass Findings

The pressure pass revisited the result page flow. The user clarified that the mobile result page should reference the current desktop result page rather than prioritizing a new mobile-only order such as moving the chord grid above the lyrics/player flow.

## Brownfield Evidence vs Inference

Evidence:

- `src/views/home/ui/HomePage.tsx` renders the home page and currently uses broad desktop-oriented spacing such as `px-8`, large hero text, and list sections.
- `src/views/result/ui/ResultPage.tsx` composes `VideoCard`, `LyricsChordPlayer`, `ChordGrid`, and `ShareButton`.
- `src/app/[locale]/layout.tsx` already defines static metadata.
- `src/app/[locale]/result/[id]/page.tsx` already defines result-specific metadata.

Inference:

- Responsive issues are likely in page spacing, component overflow, chord/lyrics display, and grid behavior. Implementation should inspect each component before editing.

## Recommended Handoff

Recommended next step: `$ralplan --consensus --direct .omx/specs/deep-interview-mobile-responsive-seo-aeo.md`

Reason: Requirements are now clear enough, but a short implementation plan should inspect actual component structure before editing. Direct execution is also possible if the user wants to skip the planning gate.
