# Sipher Web Design Reference

Use this document as the shared visual reference when updating pages across the
site. The homepage is the source of truth for the brand's typography, colors,
headings, hover treatments, and motion. Reuse the existing global styles and
tokens rather than creating a different design language for each page.

## Brand foundation

- **Primary colors:** deep navy `#100563` and vivid yellow `#FFE401`.
- **Supporting colors:** white, near-white lavender surfaces, and muted gray
  text. Use these to keep layouts readable; navy and yellow remain the
  recognizable brand pair.
- **Display font:** DM Serif Display Italic for selected emphasis words in
  headings.
- **Interface and body font:** Manrope for paragraphs, labels, controls, and
  the non-emphasized part of headings.
- Keep yellow as an accent on light backgrounds rather than using it for long
  body copy.

The fonts are loaded in `src/index.css`; color and layout tokens are defined
near the top of `src/styles/globals.css`.

## Typography and headings

- Default body copy uses Manrope at `16px` with a `1.65` line height.
- Section eyebrow labels are uppercase, bold, approximately `11px`, and widely
  tracked (`0.15em`). Pair them with a short yellow line.
- Section headings use a responsive `clamp(36px, 5.6vw, 64px)` scale, tight
  negative tracking, and approximately `1.02` line height.
- In a heading, use Manrope in navy for the main phrase and DM Serif Display
  Italic in yellow for a short, meaningful phrase. Keep this contrast
  intentional; do not italicize every heading word.
- Keep supporting section copy centered where the homepage centers its
  heading, limit it to a comfortable reading width, and use muted gray.
- The hero is the exception to section-heading sizing: its large display title
  scales from `64px` to `132px` and is white over a dark photographic surface.

Use the existing `SectionHeading` component and its `.section-heading__title`,
`.eyebrow`, and `.section-heading__copy` styles for standard page sections.
Its title supports the two-font treatment with `<span>` and `<em>`:

```tsx
<SectionHeading
  eyebrow="Section label"
  title={
    <>
      <span>Clear main phrase</span>
      <em>expressive accent.</em>
    </>
  }
  copy="A concise explanation that supports the heading."
/>
```

## Layout, spacing, and surfaces

- Use the shared `.container` for aligned page content. Its maximum width is
  `1280px`; horizontal gutters reduce on small screens.
- Use generous vertical space between sections. The shared `.section` uses
  responsive padding, starting at `86px` on mobile and scaling up on larger
  screens.
- Prefer simple grids with clear hierarchy, balanced columns, and enough
  whitespace. Stack columns on narrow screens; prevent sideways scrolling.
- Use the shared radius tokens: `12px` small, `20px` medium, `32px` large, and
  `999px` for pill controls.
- Cards should have a restrained border and surface. Shadows are subtle and
  purposeful, not a permanent heavy decoration.
- Keep descriptive text readable and controls comfortably sized. The shared
  primary button is at least `52px` high, with bold `13px` text.

## Hover and interaction language

### Circle cursor

On devices with a fine pointer, the site uses a circular cursor follower. It is
a `12px` navy dot by default and expands to a centered `68px` yellow circle
when hovering an interactive element. The expanded circle can show a short,
uppercase action label, such as `OPEN`, `START PROJECT`, or a card title.

- Set labels with `data-cursor="SHORT LABEL"` on the relevant link or button.
- Keep labels brief so they fit inside the circle; the label styling is `9px`,
  bold, centered, and tracked.
- Use the existing `CursorFollower` and `.cursor` styles rather than adding a
  separate cursor effect for each page.
- The custom cursor is disabled for touch/coarse pointers and when reduced
  motion is requested. Native hover, focus, and click states must still make
  controls clear and usable.

### Left-to-right color reveal

Primary buttons use a pseudo-element that scales horizontally from the left
edge to fill the control. The existing transition is `0.55s` with the shared
`--ease` curve. For a navy button, the fill changes to yellow and the text
changes to navy; for a yellow button, the fill changes to navy and the text
changes to yellow.

- Reuse `.button`, `.hero__cta`, and their existing hover/focus styles.
- Make the fill apply to both `:hover` and `:focus-visible`.
- Keep icons and labels above the animated fill layer.
- Do not add competing hover effects that cause jitter or fight the
  left-to-right reveal.

### Cards and links

- Keep card motion small and smooth: a slight lift or horizontal nudge, subtle
  border/background change, and restrained image zoom where appropriate.
- The homepage commitment cards remove their shadow on hover; preserve this
  behavior when adapting that card pattern.
- Links and icon buttons should have visible hover and keyboard-focus states.
  Animate icons a few pixels rather than shifting the entire layout.
- Avoid relying on color alone to communicate an active state.

## Motion and accessibility

- Use the shared easing curve `cubic-bezier(0.16, 1, 0.3, 1)` for polished
  entrances and transitions.
- Keep hover transitions short and purposeful; avoid continuous motion unless
  it is part of a specific homepage feature.
- Respect `prefers-reduced-motion`; reuse the existing reduced-motion
  patterns and do not make animation necessary to understand content.
- Maintain semantic headings, keyboard-operable controls, visible
  `:focus-visible` indicators, and adequate text contrast.

## Responsive behavior

- Let heading sizes and section spacing scale fluidly with `clamp()`.
- At mobile widths, wrap or stack heading phrases instead of forcing them onto
  one line; the section accent phrase may break onto its own line.
- Stack multi-column content, reduce decorative movement, and keep action
  controls easy to tap.
- Do not show the custom cursor on touch devices.
- Verify the page at desktop and mobile widths, including keyboard focus and
  reduced-motion behavior.

## Source of truth in the codebase

- Homepage content and component patterns: [`src/pages/Home.tsx`](./src/pages/Home.tsx)
- Homepage-specific visuals and card interactions: [`src/styles/home.css`](./src/styles/home.css)
- Shared colors, typography, headings, buttons, cursor, and responsive rules:
  [`src/styles/globals.css`](./src/styles/globals.css)
- Shared heading, reveal, and image animation components:
  [`src/components/animations/Primitives.tsx`](./src/components/animations/Primitives.tsx)
- Cursor-following behavior: [`src/components/CursorFollower.tsx`](./src/components/CursorFollower.tsx)
- Global stylesheet imports and font loading: [`src/index.css`](./src/index.css)
