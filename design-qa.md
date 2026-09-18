# Design QA

- Source visual truth: `../REF/Снимок.PNG`, `../REF/Screenshot_1.png`, `../REF/Screenshot_2.png`, `../REF/Screenshot_3.png`, `../REF/Screenshot_4.png`
- Implementation: `http://127.0.0.1:4173/`, captured in the Codex in-app browser during this run
- Viewports: 1440 × 900, 390 × 844, 320 × 700 CSS pixels; device scale factor 1
- Source dimensions: 1919 × 929, 1880 × 834, 1880 × 768, 1564 × 653, 1737 × 410 pixels
- State: home/default, mobile navigation open, demo step “Статус”, contact validation error and success, concept detail/default

## Full-view comparison evidence

The reference set was inspected as a visual system rather than a layout to copy: near-black canvas, strict typography, quiet borders, editorial whitespace, a single dominant product surface, and diagrammatic depth. The rendered implementation preserves those principles while using an original warm-amber identity, an explanatory Telegram Mini App product scene, alternating dark/light sections, and a distinct multi-page content structure.

Initial desktop QA found that the hero heading pushed the primary CTA below the first viewport. The hero type scale was reduced and rebalanced so the 1440 × 900 view now shows positioning, CTA, supporting copy, product interface, and integration atmosphere together.

Initial mobile QA found that the product interface did not enter the first viewport on 320–390 px widths. The mobile heading scale, vertical rhythm, and smallest-breakpoint supporting copy were adjusted. At 390 × 844 and 320 × 700 the primary CTA and the beginning of the Mini App interface are now both visible without horizontal overflow.

## Focused region comparison evidence

- Typography: the implementation uses Segoe UI Variable with Cyrillic support, dense display spacing, calm labels, and no uppercase eyebrow treatment. The hierarchy and contrast match the reference discipline without copying its exact typeface.
- Spacing and layout: desktop uses a strict editorial split with asymmetric product overlap; mobile changes composition rather than merely stacking the desktop grid. Containers, section spacing, and cards remain aligned at all checked sizes.
- Colors and tokens: graphite, chalk white, muted gray, restrained amber, and a small status-lime signal are consistent across pages. Borders and depth remain local rather than becoming global glass effects.
- Image quality: the generated hero infrastructure asset is sharp at desktop size, contains no text/logos/watermarks, and is subordinate to the live DOM product UI.
- Product UI: catalog, order, status, and account states remain readable inside the phone frame. Tabs update the explanatory copy and screen together.
- Navigation and form: mobile menu opens, traps focus, closes with Escape, and exposes the same routes. The contact form shows field-level errors, loading, and success states.

## Findings

No actionable P0, P1, or P2 visual differences remain for the intended original direction.

## Comparison history

1. P2 — Desktop CTA below the fold at 1440 × 900. Fixed by reducing the hero display size and rechecking the full viewport.
2. P2 — Product scene absent from the first mobile viewport. Fixed with mobile-specific typography and vertical rhythm; rechecked at 390 × 844 and 320 × 700.
3. P2 — Potential minimum-width overflow. Verified `documentElement.scrollWidth === 320` at the 320 px viewport; no fix required after measurement.

## Follow-up polish

- P3 — Replace the generic studio descriptor, canonical domain, organization details, and Telegram destination when verified brand data is available.

## September 13 visual revision

Replaced the home hero with a full-width DOM workspace; removed raster imagery from the home page. Switched to locally hosted Inter Variable, cool graphite surfaces, white/gray headings, and blue highlights. Removed section eyebrows and decorative floating labels. Added three original SVG diagrams, a layered integration panel, and once-only 600ms opacity/16px entrance transitions with reduced-motion fallback.

Inspected the live Linear reference and confirmed its Inter Variable font and 510 heading weight. Checked the revised site at the default desktop viewport, 390 × 844, and 320 × 700. The narrowest viewport has no horizontal overflow. Verified workspace navigation, mobile menu/Escape, and demo status switching; browser error log is empty. Production build passed.

final result: passed
