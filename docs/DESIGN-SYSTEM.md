# OrbitOS Design System — Obsidian + Paper

**Version:** 1.0
**Status:** Build Specification
**Scope:** Every visual element in OrbitOS must conform to this document. No component may invent its own colors, spacing, radii, or shadows.

---

## 1. Design Philosophy

OrbitOS uses the **Obsidian + Paper** theme — a light-first, border-driven interface with warm neutrals, restrained accent color, and high information density.

### Principles

| #  | Principle              | What it means in practice                                                   |
|----|------------------------|-----------------------------------------------------------------------------|
| 1  | Trust                  | Financial data looks precise, not playful. No rounded-pill everything.      |
| 2  | Precision              | Pixel-aligned spacing. Consistent token usage. No arbitrary values.         |
| 3  | Seriousness            | Restrained color. Status colors used only for status. No decorative color.  |
| 4  | Modernity              | Clean type, subtle motion, responsive. Not skeuomorphic.                    |
| 5  | Information density    | Tables and lists show data efficiently. No oversized cards with giant icons. |

### What OrbitOS is NOT

- **Not an AI startup dark theme.** Financial data is harder to read on pure-black backgrounds.
- **Not a Bootstrap admin template.** No generic card grids, no gratuitous color.
- **Not a marketing site.** No hero sections, no oversized headings, no parallax.

The interface sits between those — a premium piece of business software.

---

## 2. Color Tokens

All colors are defined as CSS custom properties. **No component may use a raw hex value.** Every color reference must go through a token.

### Light Mode (default)

| Token              | Variable                    | Value     | Usage                                      |
|--------------------|-----------------------------|-----------|---------------------------------------------|
| Background         | `--color-bg`                | `#F7F8FA` | Application background                      |
| Surface            | `--color-surface`           | `#FFFFFF` | Cards, panels, dialogs                       |
| Surface Secondary  | `--color-surface-secondary` | `#F1F3F6` | Nested surfaces, table headers, sidebar bg   |
| Border             | `--color-border`            | `#E3E6EA` | All borders, dividers, table lines           |
| Primary Text       | `--color-text-primary`      | `#17191C` | Headings, body text, data values             |
| Secondary Text     | `--color-text-secondary`    | `#626871` | Supporting text, descriptions                |
| Muted Text         | `--color-text-muted`        | `#8A9098` | Placeholders, captions, timestamps           |
| Primary            | `--color-primary`           | `#3157D5` | Primary buttons, links, active states        |
| Primary Hover      | `--color-primary-hover`     | `#2748B8` | Primary button hover                         |
| Primary Soft       | `--color-primary-soft`      | `#EAF0FF` | Primary badges, selected row backgrounds     |
| Success            | `--color-success`           | `#18864B` | Success text, icons                          |
| Success Soft       | `--color-success-soft`      | `#E8F7EF` | Success badge backgrounds                    |
| Warning            | `--color-warning`           | `#A86600` | Warning text, icons                          |
| Warning Soft       | `--color-warning-soft`      | `#FFF3D9` | Warning badge backgrounds                    |
| Danger             | `--color-danger`            | `#D63B3B` | Error text, destructive buttons              |
| Danger Soft        | `--color-danger-soft`       | `#FDECEC` | Error badge backgrounds, error input borders |

### Dark Mode

| Token              | Variable (same names)       | Value     |
|--------------------|-----------------------------|-----------|
| Background         | `--color-bg`                | `#0D0F12` |
| Surface            | `--color-surface`           | `#15181D` |
| Surface Secondary  | `--color-surface-secondary` | `#1C2026` |
| Border             | `--color-border`            | `#292E36` |
| Primary Text       | `--color-text-primary`      | `#F4F6F8` |
| Secondary Text     | `--color-text-secondary`    | `#A9AFB8` |
| Muted Text         | `--color-text-muted`        | `#727984` |
| Primary            | `--color-primary`           | `#6E8CFF` |
| Primary Hover      | `--color-primary-hover`     | `#829BFF` |
| Primary Soft       | `--color-primary-soft`      | `#182449` |
| Success            | `--color-success`           | `#3ACB7A` |
| Success Soft       | `--color-success-soft`      | (derive)  |
| Warning            | `--color-warning`           | `#E9A63A` |
| Warning Soft       | `--color-warning-soft`      | (derive)  |
| Danger             | `--color-danger`            | `#FF6262` |
| Danger Soft        | `--color-danger-soft`       | (derive)  |

Dark-mode soft variants: use the corresponding accent at 12–15% opacity over `--color-surface`. Define these explicitly in CSS — do not compute at runtime.

```css
/* Dark mode soft color definitions */
[data-theme="dark"] {
  --color-success-soft: #112B1E;
  --color-warning-soft: #2B2010;
  --color-danger-soft: #2B1414;
}
```

### CSS Implementation

```css
:root {
  /* Light mode — default */
  --color-bg: #F7F8FA;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F1F3F6;
  --color-border: #E3E6EA;

  --color-text-primary: #17191C;
  --color-text-secondary: #626871;
  --color-text-muted: #8A9098;

  --color-primary: #3157D5;
  --color-primary-hover: #2748B8;
  --color-primary-soft: #EAF0FF;

  --color-success: #18864B;
  --color-success-soft: #E8F7EF;
  --color-warning: #A86600;
  --color-warning-soft: #FFF3D9;
  --color-danger: #D63B3B;
  --color-danger-soft: #FDECEC;
}

[data-theme="dark"] {
  --color-bg: #0D0F12;
  --color-surface: #15181D;
  --color-surface-secondary: #1C2026;
  --color-border: #292E36;

  --color-text-primary: #F4F6F8;
  --color-text-secondary: #A9AFB8;
  --color-text-muted: #727984;

  --color-primary: #6E8CFF;
  --color-primary-hover: #829BFF;
  --color-primary-soft: #182449;

  --color-success: #3ACB7A;
  --color-success-soft: #112B1E;
  --color-warning: #E9A63A;
  --color-warning-soft: #2B2010;
  --color-danger: #FF6262;
  --color-danger-soft: #2B1414;
}
```

### Tailwind CSS v4 Integration

Map tokens in `app/globals.css` using `@theme`:

```css
@theme {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-surface-secondary: var(--color-surface-secondary);
  --color-border: var(--color-border);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-muted: var(--color-text-muted);
  --color-primary: var(--color-primary);
  --color-primary-hover: var(--color-primary-hover);
  --color-primary-soft: var(--color-primary-soft);
  --color-success: var(--color-success);
  --color-success-soft: var(--color-success-soft);
  --color-warning: var(--color-warning);
  --color-warning-soft: var(--color-warning-soft);
  --color-danger: var(--color-danger);
  --color-danger-soft: var(--color-danger-soft);
}
```

Usage in components:

```html
<div class="bg-surface border border-border text-text-primary">
  <h2 class="text-text-primary">Title</h2>
  <p class="text-text-secondary">Description</p>
</div>
```

---

## 3. Typography

### Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Load Inter via `next/font/google` with variable font support for optimal weight control.

### Hierarchy

| Element        | CSS Class          | Size   | Weight | Line Height | Letter Spacing |
|----------------|--------------------|--------|--------|-------------|----------------|
| Page title     | `.text-page-title` | 28px   | 650    | 1.2         | -0.02em        |
| Section title  | `.text-section`    | 20px   | 600    | 1.3         | -0.01em        |
| Card title     | `.text-card-title` | 15px   | 600    | 1.4         | 0              |
| Body           | `.text-body`       | 14px   | 400    | 1.5         | 0              |
| Secondary      | `.text-secondary`  | 13px   | 400    | 1.5         | 0              |
| Caption        | `.text-caption`    | 12px   | 500    | 1.4         | 0.01em         |
| KPI number     | `.text-kpi`        | 28px   | 650    | 1.1         | -0.02em        |
| KPI large      | `.text-kpi-lg`     | 32px   | 650    | 1.1         | -0.02em        |

### Rules

- Body text defaults to 14px / 400 weight. This is a data-dense business application, not a blog.
- No text larger than 32px anywhere in the application.
- Do not use font-weight below 400 or above 700.
- Headings use negative letter-spacing for tightness. Body text uses 0.

### CSS Definition

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --text-page-title: 650 28px/1.2 var(--font-sans);
  --text-section: 600 20px/1.3 var(--font-sans);
  --text-card-title: 600 15px/1.4 var(--font-sans);
  --text-body: 400 14px/1.5 var(--font-sans);
  --text-secondary: 400 13px/1.5 var(--font-sans);
  --text-caption: 500 12px/1.4 var(--font-sans);
  --text-kpi: 650 28px/1.1 var(--font-sans);
}
```

---

## 4. Spacing System

Base unit: **4px**

| Token  | Value  | Usage examples                                              |
|--------|--------|-------------------------------------------------------------|
| `1`    | 4px    | Tight gaps (icon-to-text in a badge)                        |
| `2`    | 8px    | Inline spacing, compact element gaps                        |
| `3`    | 12px   | List item padding, small card internal spacing              |
| `4`    | 16px   | Standard padding, form field gaps                           |
| `5`    | 20px   | Section internal spacing                                    |
| `6`    | 24px   | Card padding, section gaps                                  |
| `8`    | 32px   | Between major sections on a page                            |
| `10`   | 40px   | Page top padding                                            |
| `12`   | 48px   | Large vertical gaps between page zones                      |
| `16`   | 64px   | Maximum spacing (sidebar section gaps, extremely rare)      |

### Rules

- Use only the values above. No `13px`, `17px`, `23px`, `27px`.
- In Tailwind: `p-2` = 8px, `gap-4` = 16px, etc. (Tailwind's default 4px scale aligns with ours.)
- When a design calls for a value not in this table, round to the nearest value that is.

---

## 5. Border Radius

| Token            | Variable             | Value   | Usage                                  |
|------------------|----------------------|---------|----------------------------------------|
| Small controls   | `--radius-sm`        | `6px`   | Badges, small buttons, toggles         |
| Inputs           | `--radius-input`     | `7px`   | All form inputs, selects, textareas    |
| Cards            | `--radius-card`      | `10px`  | Cards, panels, table containers        |
| Dialogs          | `--radius-dialog`    | `12px`  | Modal dialogs, drawers                 |
| Large surfaces   | `--radius-lg`        | `14px`  | Large panels (rare)                    |
| Pills            | `--radius-pill`      | `999px` | Status badges, tag pills               |

### Rules

- No `border-radius: 50%` on non-circular elements.
- No `border-radius: 20px+` on cards. This is a business application.
- Buttons use `--radius-input` (7px) by default.

```css
:root {
  --radius-sm: 6px;
  --radius-input: 7px;
  --radius-card: 10px;
  --radius-dialog: 12px;
  --radius-lg: 14px;
  --radius-pill: 999px;
}
```

---

## 6. Shadows

OrbitOS uses minimal elevation. Cards are defined by borders, not shadows.

| Level      | Variable            | Value                                                           | Usage                          |
|------------|---------------------|-----------------------------------------------------------------|--------------------------------|
| None       | `--shadow-none`     | `none`                                                          | Cards (use border instead)     |
| Subtle     | `--shadow-sm`       | `0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)` | Dropdowns, popovers            |
| Medium     | `--shadow-md`       | `0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)` | Dialogs, modal overlays        |
| Strong     | `--shadow-lg`       | `0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)` | Command palette, floating UI   |

### Dark Mode Shadows

In dark mode, increase opacity by ~50%:

```css
[data-theme="dark"] {
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.20), 0 1px 2px rgba(0, 0, 0, 0.14);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.28), 0 1px 3px rgba(0, 0, 0, 0.18);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.36), 0 2px 6px rgba(0, 0, 0, 0.18);
}
```

### Rules

- Default cards: `border: 1px solid var(--color-border)`. No shadow.
- Floating elements (dropdowns, popovers): `--shadow-sm`.
- Dialogs: `--shadow-md`.
- Command palette / global search: `--shadow-lg`.
- No element should look like it is floating 50px above the screen.

---

## 7. Buttons

### Variants

#### Primary Button

The main action on a page. Only one primary button per visible context.

```
┌─────────────────────┐
│   Create Invoice    │  ← solid primary bg, white text
└─────────────────────┘
```

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Background        | `var(--color-primary)`                    |
| Background hover  | `var(--color-primary-hover)`              |
| Text              | `#FFFFFF`                                 |
| Height            | 40px (compact: 36px)                      |
| Padding           | 0 20px                                    |
| Border radius     | `var(--radius-input)` (7px)               |
| Font              | 14px / 500                                |
| Transition        | `background 150ms ease-out`               |

#### Secondary Button

Supporting actions: Export, Filter, etc.

```
┌─────────────────────┐
│      Export          │  ← surface bg, border, dark text
└─────────────────────┘
```

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Background        | `var(--color-surface)`                    |
| Background hover  | `var(--color-surface-secondary)`          |
| Border            | `1px solid var(--color-border)`           |
| Text              | `var(--color-text-primary)`               |
| Height            | 40px (compact: 36px)                      |
| Padding           | 0 16px                                    |

#### Ghost Button

Low-priority actions: Cancel, Close, etc.

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Background        | `transparent`                             |
| Background hover  | `var(--color-surface-secondary)`          |
| Border            | `none` (border on hover: optional)        |
| Text              | `var(--color-text-secondary)`             |

#### Destructive Button

Genuinely destructive actions only: Delete, Cancel Invoice.

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Background        | `var(--color-danger)`                     |
| Background hover  | darken 8%                                 |
| Text              | `#FFFFFF`                                 |

Use a secondary destructive variant (danger text, no fill) for less-critical destructive actions.

#### Icon Button

For toolbar actions, table row actions, notification bell, settings gear.

| Property          | Value                                     |
|-------------------|-------------------------------------------|
| Size              | 36×36px minimum (40×40px preferred)       |
| Background        | `transparent`                             |
| Background hover  | `var(--color-surface-secondary)`          |
| Border radius     | `var(--radius-sm)` (6px)                  |
| Icon size         | 20px                                      |
| Tooltip           | Required (accessible label)               |

### Button States

**Every button variant must implement all of these:**

| State      | Visual Treatment                                                  |
|------------|-------------------------------------------------------------------|
| Default    | As specified per variant above                                    |
| Hover      | Background shifts (see variant table). Cursor: pointer.           |
| Active     | Background darkens slightly from hover. Transform: scale(0.98).   |
| Focus      | `outline: 2px solid var(--color-primary); outline-offset: 2px`    |
| Disabled   | `opacity: 0.5; cursor: not-allowed; pointer-events: none`        |
| Loading    | Text replaced by spinner (16px). Button width unchanged (min-width). |
| Success    | Brief green check icon, then reverts (1.5s). Optional per context. |
| Error      | Brief shake animation. Button text stays. Error shown externally.  |

### Loading Flow Example

```
[ Create Invoice ]      default
        ↓ click
[    ◌ Loading    ]     loading spinner, button disabled
        ↓ success
[   ✓ Created     ]     success state, 1.5s
        ↓ auto
[ Create Invoice ]      back to default
```

---

## 8. Form Controls

### Text Input

```
Label *
┌─────────────────────────────────┐
│ Placeholder text                │  40px height, 7px radius
└─────────────────────────────────┘
Helper text or error message
```

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Height            | 40px                                           |
| Padding           | 0 12px                                         |
| Border            | `1px solid var(--color-border)`                |
| Border focus      | `1px solid var(--color-primary)`               |
| Focus ring        | `0 0 0 3px var(--color-primary-soft)`          |
| Border error      | `1px solid var(--color-danger)`                |
| Focus ring error  | `0 0 0 3px var(--color-danger-soft)`           |
| Background        | `var(--color-surface)`                         |
| Border radius     | `var(--radius-input)` (7px)                    |
| Font              | 14px / 400                                     |
| Placeholder color | `var(--color-text-muted)`                      |
| Disabled bg       | `var(--color-surface-secondary)`               |
| Disabled opacity  | 0.6                                            |

### Labels

- Position: **above** the input, never inline/floating.
- Font: 13px / 500, `var(--color-text-primary)`.
- Required indicator: red asterisk `*` after label text.
- Spacing from label to input: 6px.
- Spacing from input to helper/error text: 4px.

### Select

Same dimensions and styling as text input. Includes chevron-down icon (Lucide `ChevronDown`, 16px) on right side.

### Textarea

Same border/radius/focus treatment. Min height: 80px. Resize: vertical only.

### Checkbox & Radio

- Size: 18×18px.
- Border radius: 4px (checkbox), 50% (radio).
- Checked: primary color fill, white check/dot.
- Focus: same ring as inputs.

### Form Layout

```
┌───────────────────────────────────────────────────┐
│ Section Title                                      │
│                                                    │
│ Label *                          Label              │
│ ┌──────────────────┐            ┌──────────────────┐│
│ │ Input            │            │ Input            ││
│ └──────────────────┘            └──────────────────┘│
│                                                    │
│ Label *                                            │
│ ┌──────────────────────────────────────────────────┐│
│ │ Full-width input                                 ││
│ └──────────────────────────────────────────────────┘│
│ Error message appears here in danger color          │
│                                                    │
│                         [ Cancel ]  [ Save ]        │
└───────────────────────────────────────────────────┘
```

- Gap between form fields: 20px vertical.
- Two-column layout on desktop (> 768px), single-column on mobile.
- Action buttons right-aligned at bottom, 12px gap between them.

---

## 9. Cards

```
┌──────────────────────────────────────────────┐
│ Card Title                        [⋯ Actions]│  ← Header zone
│──────────────────────────────────────────────│  ← 1px border divider
│                                              │
│  Card body content                           │  ← Body zone
│  Information, data, forms, etc.              │
│                                              │
│──────────────────────────────────────────────│  ← Optional footer divider
│                         [ Action ] [ Action ]│  ← Footer zone (optional)
└──────────────────────────────────────────────┘
```

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Background        | `var(--color-surface)`                         |
| Border            | `1px solid var(--color-border)`                |
| Border radius     | `var(--radius-card)` (10px)                    |
| Shadow            | `none` (border only)                           |
| Padding           | 24px                                           |
| Header padding    | 24px 24px 16px 24px                            |
| Body padding      | 0 24px 24px 24px (if header present)           |
| Internal divider  | `1px solid var(--color-border)`                |

### KPI Card

A specialized card for dashboard metrics.

```
┌──────────────────────┐
│ Revenue         ↑12% │  ← Caption (12px/500, muted) + trend badge
│ ₹1.24L               │  ← KPI number (28px/650, primary text)
│ vs ₹1.10L last month │  ← Secondary (13px/400, secondary text)
└──────────────────────┘
```

- Same card treatment (border, radius, surface bg).
- Minimum width: 200px.
- Consistent height when placed in a row.

---

## 10. Tables

Tables are the most critical UI component. They must be built as reusable infrastructure — one `<DataTable>` component used everywhere.

### Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Search ___________]  [Filter ▼]  [Columns ▼]         [+ Create]  │  ← Toolbar
│─────────────────────────────────────────────────────────────────────│
│ ☐  CUSTOMER ▲    CONTACT         ORDERS   SPENT      STATUS       │  ← Header
│─────────────────────────────────────────────────────────────────────│
│ ☐  Rahul Sharma  rahul@ex.com      12    ₹48,200   ● Active      │  ← Row
│ ☐  Priya Patel   priya@ex.com       8    ₹32,100   ● Active      │  ← Row
│ ☐  Amit Kumar    amit@ex.com        3    ₹12,800   ○ Archived    │  ← Row
│─────────────────────────────────────────────────────────────────────│
│ Showing 1–10 of 150                    [< 1 2 3 ... 15 >]         │  ← Pagination
└─────────────────────────────────────────────────────────────────────┘
```

### Header Row

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Font              | 12px / 500 (caption)                           |
| Color             | `var(--color-text-muted)`                      |
| Text transform    | Uppercase                                      |
| Padding           | 12px 16px                                      |
| Border bottom     | `1px solid var(--color-border)`                |
| Background        | `var(--color-surface-secondary)`               |
| Sortable columns  | Show sort indicator icon. Hover: cursor pointer.|

### Body Row

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Font              | 14px / 400                                     |
| Padding           | 12px 16px                                      |
| Border bottom     | `1px solid var(--color-border)` (thin)         |
| Background        | `var(--color-surface)`                         |
| Hover background  | `var(--color-surface-secondary)`               |
| Selected bg       | `var(--color-primary-soft)`                    |

### Required Features

Every table must support:

1. **Pagination** — 10/25/50 per page. Numbered pages.
2. **Search** — Debounced (300ms). Filters visible rows.
3. **Sorting** — Click column header. Ascending/descending toggle.
4. **Filtering** — Dropdown filters by status, category, date range.
5. **Selectable rows** — Checkbox per row. Select all. Bulk action bar appears.
6. **Column configuration** — Show/hide columns via dropdown.
7. **Responsive** — Horizontal scroll on mobile, or card view.
8. **Loading state** — Skeleton rows matching column layout.
9. **Empty state** — Centered message with icon and action (see §18).
10. **Row actions** — Inline icon buttons or "⋯" dropdown menu.

### Toolbar

- Left: Search input, filter dropdowns.
- Right: Primary action button (e.g., "+ Create customer").
- Height: 48px area, vertically centered controls.
- Bottom border separates toolbar from header.

---

## 11. Dialogs / Modals

```
┌──────────────────────────────────────────┐
│ Dialog Title                         [✕] │  ← Header
│──────────────────────────────────────────│
│                                          │
│  Dialog body content.                    │  ← Body
│  Forms, confirmations, information.      │
│                                          │
│──────────────────────────────────────────│
│                    [ Cancel ] [ Confirm ] │  ← Footer
└──────────────────────────────────────────┘
```

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Border radius     | `var(--radius-dialog)` (12px)                  |
| Background        | `var(--color-surface)`                         |
| Shadow            | `var(--shadow-md)`                             |
| Overlay           | `rgba(0, 0, 0, 0.5)` (light), `rgba(0, 0, 0, 0.7)` (dark) |
| Min width         | 400px (small), 560px (medium), 720px (large)   |
| Max width         | 90vw                                           |
| Max height        | 85vh, scrollable body                          |
| Header padding    | 24px 24px 16px 24px                            |
| Body padding      | 0 24px                                         |
| Footer padding    | 16px 24px 24px 24px                            |
| Title font        | 16px / 600                                     |
| Close button      | Icon button (X), top-right                     |

### Behavior

- Opens with fade-in + slight scale-up (150ms, ease-out).
- Closes with Escape key.
- Closes on overlay click (unless destructive action in progress).
- Traps focus inside dialog.
- Returns focus to trigger element on close.
- Body scrolls if content exceeds max height; header/footer stay fixed.

### Confirmation Dialog (Destructive)

```
┌──────────────────────────────────────────┐
│ Delete Customer                      [✕] │
│──────────────────────────────────────────│
│                                          │
│  Are you sure you want to archive        │
│  "Rahul Sharma"? This will hide them     │
│  from active lists. Historical records   │
│  will be preserved.                      │
│                                          │
│──────────────────────────────────────────│
│                 [ Cancel ] [ Archive ]    │  ← Destructive button
└──────────────────────────────────────────┘
```

---

## 12. Toast Notifications

```
┌─────────────────────────────────────────────┐
│ ✓  Invoice INV-1042 created successfully  ✕ │
└─────────────────────────────────────────────┘
```

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Position          | Top-right, 16px from viewport edges            |
| Width             | Min 300px, max 420px                           |
| Border radius     | `var(--radius-sm)` (6px)                       |
| Background        | `var(--color-surface)`                         |
| Border            | `1px solid var(--color-border)`                |
| Border-left       | `3px solid [status color]`                     |
| Shadow            | `var(--shadow-sm)`                             |
| Padding           | 12px 16px                                      |
| Font              | 14px / 400                                     |
| Auto-dismiss      | 5 seconds (errors: manual dismiss only)        |
| Stack direction   | New toasts appear below, push old ones up       |
| Max visible       | 3 at once                                      |
| Animation         | Slide in from right (200ms, ease-out)           |

### Types

| Type      | Left border color       | Icon               |
|-----------|------------------------|--------------------|
| Success   | `var(--color-success)` | `CheckCircle`      |
| Error     | `var(--color-danger)`  | `AlertCircle`      |
| Warning   | `var(--color-warning)` | `AlertTriangle`    |
| Info      | `var(--color-primary)` | `Info`             |

---

## 13. Badges / Status Indicators

### Status Badge (Pill)

```
 ┌──────────┐
 │ ● Paid   │   ← soft background, darker text, small dot
 └──────────┘
```

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Height            | 24px                                           |
| Padding           | 0 10px                                         |
| Border radius     | `var(--radius-pill)` (999px)                   |
| Font              | 12px / 500                                     |
| Dot size          | 6px, matching text color                       |
| Dot margin-right  | 6px                                            |

### Status Color Map

| Status           | Background                  | Text                      |
|------------------|-----------------------------|-----------------------------|
| Active / Paid    | `var(--color-success-soft)` | `var(--color-success)`      |
| Draft            | `var(--color-surface-secondary)` | `var(--color-text-secondary)` |
| Issued / Pending | `var(--color-primary-soft)` | `var(--color-primary)`      |
| Overdue / Danger | `var(--color-danger-soft)`  | `var(--color-danger)`       |
| Warning / Low    | `var(--color-warning-soft)` | `var(--color-warning)`      |
| Archived         | `var(--color-surface-secondary)` | `var(--color-text-muted)` |
| Cancelled        | `var(--color-surface-secondary)` | `var(--color-text-muted)` |

### Count Badge

For notification counts, small red circle:

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Size              | 18px (circle)                                  |
| Background        | `var(--color-danger)`                          |
| Text              | `#FFFFFF`, 11px / 600                          |
| Position          | Absolute, top-right of icon                    |

---

## 14. Iconography

### Library

**Lucide React** — the only icon library allowed.

```bash
npm install lucide-react
```

### Sizes

| Context          | Size | Examples                                     |
|------------------|------|----------------------------------------------|
| Compact (tables) | 16px | Sort arrows, inline status dots              |
| Default          | 20px | Button icons, sidebar nav, form controls     |
| Header           | 24px | Page header icons, notification bell         |
| Empty state      | 48px | Empty state illustrations                    |

### Stroke Width

Default (2). Do not change per-icon.

### Rules

- Every icon must serve a functional purpose. No decorative icons.
- Icons in buttons: left of text, 8px gap.
- Standalone icon buttons must have an `aria-label` or wrapping tooltip.
- Color: inherit from parent text color by default.
- Do not import from other icon libraries (Heroicons, FontAwesome, etc.).

---

## 15. Motion

### Standard Transition

```css
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Where to Use

| Element          | Duration | Easing    | Property                   |
|------------------|----------|-----------|----------------------------|
| Button hover     | 150ms    | ease-out  | background-color           |
| Dropdown open    | 150ms    | ease-out  | opacity, transform         |
| Dialog open      | 200ms    | ease-out  | opacity, transform (scale) |
| Drawer slide     | 200ms    | ease-out  | transform (translateX)     |
| Toast enter      | 200ms    | ease-out  | transform (translateX)     |
| Sidebar collapse | 200ms    | ease-out  | width                      |
| Skeleton pulse   | 1.5s     | ease-in-out | opacity (infinite loop)  |
| Page transition  | 150ms    | ease-out  | opacity                    |

### What NOT to Animate

- Dashboard counters counting up.
- Cards bouncing in on page load.
- Parallax scrolling.
- Background gradient shifts.
- Decorative particle effects.

### Respecting Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 16. Application Layout

### Desktop (≥ 1024px)

```
┌──────────┬──────────────────────────────────────────────────┐
│          │  ≡  Dashboard          🔍 Search     🔔 👤       │ 56px header
│          ├──────────────────────────────────────────────────┤
│  240px   │                                                  │
│ Sidebar  │                                                  │
│          │              Main content area                    │
│  ○ Logo  │              (scrollable)                        │
│          │                                                  │
│  NAV     │              max-width: 1200px                   │
│  ITEMS   │              padding: 32px                       │
│          │                                                  │
│          │                                                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Sidebar

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Width expanded    | 240px                                          |
| Width collapsed   | 64px                                           |
| Background        | `var(--color-surface)`                         |
| Border right      | `1px solid var(--color-border)`                |
| Nav item height   | 36px                                           |
| Nav item padding  | 8px 12px                                       |
| Nav item radius   | `var(--radius-sm)` (6px)                       |
| Active item bg    | `var(--color-primary-soft)`                    |
| Active item text  | `var(--color-primary)`                         |
| Hover bg          | `var(--color-surface-secondary)`               |
| Section label     | 11px / 600, uppercase, `var(--color-text-muted)`, 24px top margin |
| Icon size         | 20px                                           |
| Icon-to-text gap  | 12px                                           |

### Sidebar Sections

```
WORKSPACE
  ◇ Overview
  ◇ Customers
  ◇ Sales
  ◇ Orders
  ◇ Invoices
  ◇ Payments

OPERATIONS
  ◇ Products
  ◇ Inventory
  ◇ Suppliers
  ◇ Purchases
  ◇ Expenses

INSIGHTS
  ◇ Reports
  ◇ Analytics

ADMINISTRATION
  ◇ Staff
  ◇ Notifications
  ◇ Settings
```

### Top Header

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Height            | 56px                                           |
| Background        | `var(--color-surface)`                         |
| Border bottom     | `1px solid var(--color-border)`                |
| Left content      | Page title / breadcrumb                        |
| Center-right      | Global search trigger (Ctrl+K)                 |
| Right             | Notification bell, help, business switcher, avatar |
| Padding           | 0 24px                                         |

### Main Content

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Background        | `var(--color-bg)`                              |
| Padding           | 32px                                           |
| Max width         | 1200px (data pages can exceed for wide tables) |
| Overflow          | Scroll vertical                                |

---

## 17. Responsive Breakpoints

| Breakpoint | Name    | Width       | Layout changes                                     |
|------------|---------|-------------|-----------------------------------------------------|
| sm         | Mobile  | < 768px     | Sidebar → drawer. Forms single-column. Tables → cards or scroll. |
| md         | Tablet  | 768–1024px  | Sidebar collapsed by default. Content fills width.   |
| lg         | Desktop | > 1024px    | Full sidebar. Two-column forms. Full tables.         |

### Mobile-Specific Rules

- Sidebar becomes a slide-in drawer (from left, overlay) triggered by hamburger ≡ icon.
- Primary action buttons become full-width or sticky bottom bar.
- Dialog max-width becomes `calc(100vw - 32px)` and opens from bottom on small screens.
- Tables either scroll horizontally or convert to stacked card layout.
- Command palette becomes full-screen overlay.

---

## 18. Empty States

```
┌──────────────────────────────────────────────┐
│                                              │
│              📦  (48px, muted)               │
│                                              │
│          No customers yet                    │  ← 16px / 600
│                                              │
│     Add your first customer to start         │  ← 14px / 400, muted
│     managing customer relationships.         │
│                                              │
│          [ + Add Customer ]                  │  ← Primary button
│                                              │
└──────────────────────────────────────────────┘
```

### Rules

- Icon: Lucide, 48px, `var(--color-text-muted)`.
- Title: 16px / 600, `var(--color-text-primary)`.
- Description: 14px / 400, `var(--color-text-secondary)`. Max 2 lines.
- Action: Primary button.
- No giant illustrations or SVG artwork.
- Center vertically and horizontally in the available space.
- Every list view, every table, every section that can be empty MUST have an empty state.

---

## 19. Loading States

### Skeleton Screens

Match the eventual layout structure:

```
┌──────────────────────────────────────────────┐
│ ████████  ████                               │  ← Title skeleton
│                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ ██████  │ │ ██████  │ │ ██████  │        │  ← KPI skeletons
│ │ █████   │ │ █████   │ │ █████   │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                              │
│ ██████████████████████████████████████       │  ← Table header skeleton
│ ███████  █████████  ██████  ████████        │
│ ███████  █████████  ██████  ████████        │
│ ███████  █████████  ██████  ████████        │
└──────────────────────────────────────────────┘
```

### Skeleton Properties

| Property          | Value                                          |
|-------------------|------------------------------------------------|
| Background        | `var(--color-surface-secondary)`               |
| Border radius     | 4px (text lines), matches component for shapes  |
| Animation         | Pulse opacity 0.4 → 1.0, 1.5s, ease-in-out    |
| Text height       | Match the text size it replaces                 |
| Width             | Vary between 40–80% to look natural            |

### Rules

- Never display a blank white/dark page while loading.
- Skeletons must approximate the real layout.
- Use `Suspense` boundaries in React for skeleton loading.
- Inline loading (form submit, button action): spinner inside the control.
- Full-page loading (initial data fetch): skeleton of the whole page structure.

---

## 20. Error States

### Page-Level Error

```
┌──────────────────────────────────────────────┐
│                                              │
│              ⚠  (48px, danger)               │
│                                              │
│      Couldn't load your invoices             │  ← 16px / 600
│                                              │
│   Something went wrong on our end.           │  ← 14px / 400, secondary
│   Please try again.                          │
│                                              │
│              [ Retry ]                       │  ← Secondary button
│                                              │
└──────────────────────────────────────────────┘
```

### Inline Error (Form Field)

```
Email *
┌─────────────────────────────────┐
│ not-an-email                    │  ← danger border
└─────────────────────────────────┘
Please enter a valid email address   ← 12px, danger color
```

### Toast Error

For failed background operations (save, delete, API calls).

### Rules

- Always explain **what happened** in plain language.
- Where possible, explain **what the user can do** (Retry, contact support, check input).
- Never show raw error codes (`Error 500`, `ECONNREFUSED`) to users.
- Log technical details to console/audit; show human message in UI.
- Include a Retry action when the operation can be retried.

---

## 21. Miscellaneous Components

### Breadcrumbs

```
Dashboard  /  Customers  /  Rahul Sharma
```

- Font: 13px / 400.
- Separator: `/` or `›` in `var(--color-text-muted)`.
- Current page (last item): `var(--color-text-primary)`, not a link.
- Previous items: `var(--color-text-secondary)`, links.

### Tabs

```
┌─────────┬─────────┬──────────┬──────────┐
│Overview │Invoices │ Payments │ Activity │
├─────────┘         └──────────┴──────────┘
```

- Active tab: `var(--color-primary)` text, 2px bottom border in primary.
- Inactive: `var(--color-text-secondary)`, no bottom border.
- Font: 14px / 500.
- Tab height: 40px.
- Padding: 0 16px.
- Hover: `var(--color-text-primary)`.

### Dropdowns / Select Menus

```
┌────────────────────────┐
│ Option one             │  ← hover: surface-secondary bg
│ Option two             │
│ Option three           │
│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│  ← divider
│ Destructive option     │  ← danger text
└────────────────────────┘
```

- Shadow: `var(--shadow-sm)`.
- Border: `1px solid var(--color-border)`.
- Radius: `var(--radius-card)` (10px).
- Item padding: 8px 12px.
- Item font: 14px / 400.

### Tooltip

- Background: `var(--color-text-primary)` (dark in light mode, light in dark mode — inverted).
- Text: opposite of background, 12px / 500.
- Padding: 6px 10px.
- Radius: `var(--radius-sm)` (6px).
- Max width: 240px.
- Delay: 500ms before show.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│ ORBITOS DESIGN SYSTEM — OBSIDIAN + PAPER            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ COLORS    Primary: #3157D5 / #6E8CFF (dark)        │
│           Surface: #FFFFFF / #15181D (dark)         │
│           Background: #F7F8FA / #0D0F12 (dark)     │
│                                                     │
│ TYPE      Font: Inter                               │
│           Body: 14px / 400                          │
│           Heading: 28px / 650                       │
│                                                     │
│ SPACING   Base: 4px                                 │
│           Scale: 4 8 12 16 20 24 32 40 48 64       │
│                                                     │
│ RADIUS    Input: 7px  Card: 10px  Dialog: 12px     │
│                                                     │
│ SHADOW    Cards: none (border)  Dropdown: sm        │
│           Dialog: md  Command palette: lg           │
│                                                     │
│ BUTTONS   Height: 40px  Radius: 7px                │
│           Primary → Secondary → Ghost → Destructive │
│                                                     │
│ ICONS     Lucide React only  Default: 20px          │
│                                                     │
│ MOTION    150–200ms  ease-out                       │
│                                                     │
│ LAYOUT    Sidebar: 240px / 64px  Header: 56px      │
│           Content max: 1200px  Padding: 32px        │
│                                                     │
│ BREAK     Mobile: <768  Tablet: 768–1024  Desk: >1024│
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

*This document is the single source of truth for all visual decisions in OrbitOS. No component, page, or feature may introduce colors, spacing, radii, shadows, or typography not defined here. When in doubt, refer to the token tables above.*
