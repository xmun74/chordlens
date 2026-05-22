# Test Spec: Mobile Responsive UI First Pass

## Scope

Verify the first-pass responsive UI changes for existing home and result pages.

## Static Checks

- `pnpm lint`
- `pnpm build`

If either cannot run because dependencies or environment are unavailable, record the exact blocker.

## Viewports

Check all scoped pages at:

- 375px phone
- 430px large phone
- 768px tablet
- desktop width, at least 1280px

## Home Page Checks

- Page has no horizontal viewport overflow.
- Hero heading and supporting text wrap cleanly.
- URL input, clear button, drag/drop area, and submit button fit within viewport.
- Popular list remains usable on touch/mobile.
- Recent results render as 1 column on phone, with appropriate expansion on wider screens.
- Desktop layout remains materially consistent with the existing design.

## Result Page Checks

- Page has no horizontal viewport overflow.
- Section order remains `VideoCard`, `LyricsChordPlayer`, `ChordGrid`, `ShareButton`.
- `VideoCard` title/channel/stats wrap without clipping.
- `LyricsChordPlayer` stacks on mobile and keeps the timeline scroll internal.
- Playback button is usable on mobile and remains keyboard/focus accessible.
- Timeline playhead alignment and scroll/seek behavior are not intentionally changed.
- `ChordGrid` is usable on mobile through internal horizontal scroll.
- Current chord remains visually emphasized.
- Desktop result flow remains materially consistent with the original.

## DOM Overflow Check

For each verified route and viewport:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth;
```

This should be `true`.

## Scope Guard

Confirm the PR does not include:

- SEO/AEO expansion.
- New pages.
- New UI library.
- Backend/API changes.
- Playback/timing/data-fetching refactors.
- Brand/design-system overhaul.

## Result Route Fallback Rule

Because the result page is the priority surface, route-level verification should use a real result page when possible.

If a real result route is unavailable:

1. Try an uncommitted temporary verification path or local data setup.
2. If still blocked, document the exact blocker.
3. Perform component-level layout verification as far as possible.
4. Record clearly whether final verification was route-level or component-level.
