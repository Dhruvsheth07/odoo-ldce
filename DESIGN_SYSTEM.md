# GlobeTrotter Design System
*Extracted from Stitch Project: "GlobeTrotter Travel Planner UI"*

## Theme: Coastal Editorial (Light Mode)

The Stitch design uses a **light-mode** "Coastal Editorial" theme — a significant departure from the existing dark-mode glassmorphism CSS. The visual style is "Modern Corporate with Minimalist Editorial influences," targeting a premium, magazine-like travel experience.

> [!IMPORTANT]
> The existing `index.css` uses a dark-mode glassmorphism approach. The Stitch design is a **light-mode**, warm, editorial aesthetic. The CSS must be **replaced** to match Stitch.

---

## Color Palette: "Coastal Slate"

| Token                       | Value      | Usage                                   |
|-----------------------------|------------|-----------------------------------------|
| **primary**                 | `#041627`  | Core brand, primary buttons, nav bg     |
| **primary-container**       | `#1a2b3c`  | Deep navy accents                       |
| **on-primary**              | `#ffffff`  | Text on primary surfaces                |
| **on-primary-container**    | `#8192a7`  | Text on primary-container               |
| **secondary**               | `#50606f`  | Icons, sub-headers, secondary states    |
| **secondary-container**     | `#d1e1f4`  | Secondary backgrounds                   |
| **on-secondary**            | `#ffffff`  | Text on secondary                       |
| **tertiary**                | `#6c5e06`  | Accent gold (premium indicators)        |
| **tertiary-container**      | `#bdac51`  | Gold accent container                   |
| **surface**                 | `#fcf9f4`  | Page background (warm white/sand)       |
| **surface-container**       | `#f0ede8`  | Card backgrounds, sections              |
| **surface-container-high**  | `#ebe8e3`  | Elevated card backgrounds               |
| **surface-container-highest** | `#e5e2dd` | Highest elevation surfaces             |
| **surface-container-low**   | `#f6f3ee`  | Subtle section differentiation          |
| **surface-container-lowest**| `#ffffff`  | Pure white card surfaces                |
| **on-surface**              | `#1c1c19`  | Primary text color                      |
| **on-surface-variant**      | `#44474c`  | Secondary text color                    |
| **outline**                 | `#74777d`  | Borders, dividers                       |
| **outline-variant**         | `#c4c6cd`  | Subtle borders (card edges)             |
| **error**                   | `#ba1a1a`  | Error states                            |
| **error-container**         | `#ffdad6`  | Error backgrounds                       |
| **background**              | `#fcf9f4`  | Page background (same as surface)       |

### Key Color Decisions
- **Primary Navy (#1A2B3C):** Core brand — primary buttons, nav backgrounds, headings
- **Secondary Slate (#708090):** Icons, sub-headers, secondary UI
- **Neutral Sand (#F5F2ED):** Page sectioning, container backgrounds
- **Accent Gold/Tan:** Sparingly for "Premium" or "Loyalty" indicators
- Backgrounds: crisp white (`#ffffff`) for cards, sand (`#fcf9f4`) for page

---

## Typography

| Token                 | Font         | Size | Weight | Line Height | Letter Spacing |
|-----------------------|-------------|------|--------|-------------|----------------|
| **display-lg**        | Montserrat  | 48px | 700    | 56px        | -0.02em        |
| **headline-lg**       | Montserrat  | 32px | 600    | 40px        | -0.01em        |
| **headline-lg-mobile**| Montserrat  | 24px | 600    | 32px        | —              |
| **headline-md**       | Montserrat  | 24px | 600    | 32px        | —              |
| **body-lg**           | Inter       | 18px | 400    | 28px        | —              |
| **body-md**           | Inter       | 16px | 400    | 24px        | —              |
| **body-sm**           | Inter       | 14px | 400    | 20px        | —              |
| **label-caps**        | Inter       | 12px | 600    | 16px        | 0.05em         |

### Typography Rules
- **Headlines:** Montserrat, tight letter-spacing, "locked-in" professional look
- **Body:** Inter, standard tracking for maximum legibility
- **Labels:** Small caps with increased tracking for table headers, category tags, overlines

---

## Spacing

| Token             | Value  | Usage                          |
|-------------------|--------|--------------------------------|
| **base**          | 8px    | Base unit for all spacing      |
| **stack-sm**      | 12px   | Small vertical gaps            |
| **stack-md**      | 24px   | Medium section gaps, gutters   |
| **stack-lg**      | 48px   | Major section separators       |
| **gutter**        | 24px   | Grid column gutters            |
| **container-max** | 1280px | Max content width              |
| **margin-mobile** | 16px   | Mobile side padding            |
| **margin-desktop**| 48px   | Desktop side padding           |

---

## Border Radius

| Token      | Value     | Usage                              |
|------------|-----------|-------------------------------------|
| **sm**     | 0.25rem   | Small elements                      |
| **DEFAULT**| 0.5rem    | Inputs (8px)                        |
| **md**     | 0.75rem   | Medium containers                   |
| **lg**     | 1rem      | Cards, main containers (16px)       |
| **xl**     | 1.5rem    | Primary buttons, large cards (24px) |
| **full**   | 9999px    | Pills, circular buttons             |

### Shape Rules
- **Cards:** `rounded-lg` (16px) or `rounded-xl` (24px) — friendly, tactile look
- **Buttons:** Primary = `rounded-xl` (24px) or pill, to distinguish from structural layout
- **Inputs:** Standard `rounded` (8px) for formal precision

---

## Elevation & Depth

Hierarchy via **Tonal Layering** and **Ambient Shadows** (not heavy drop-shadows):

| Level          | Implementation                                                                 |
|----------------|--------------------------------------------------------------------------------|
| **Surface 0**  | Main white background                                                          |
| **Surface 1**  | White surface + 1px border `#E2E8F0` + soft shadow `(Y:4px, Blur:20px, 4%)` |
| **Surface 2**  | Stronger shadow (10% Navy) for modals/overlays                                 |

> Shadow feel: "light passing through glass onto sand" — natural and soft.

---

## Components

### Buttons
| Style     | Background                | Text  | Shape       | Shadow              |
|-----------|---------------------------|-------|-------------|----------------------|
| Primary   | Navy `#1A2B3C`            | White | Pill/xl     | Subtle hover lift    |
| Ghost     | Transparent               | Slate | Slate border| —                    |
| Danger    | Error red                 | White | Pill/xl     | —                    |

### Cards
- 24px internal padding
- 1px soft border (`outline-variant`)
- Ambient shadow (Surface 1 level)
- Images inside cards match card corner radius

### Chips/Badges
- Pill-shaped
- Neutral sand background (`#F5F2ED`) with Navy text
- Status chips: "Confirmed", "In Transit", etc.

### Inputs
- 48px height
- Slate-Gray border
- Focus: border → Primary Navy + focus ring
- Labels visible above in `label-caps` style

### Itinerary Timeline
- Vertical line using Primary Navy
- Circular nodes for each stop
- Connecting line between nodes

---

## Layout

- **Desktop:** 12-column grid, 24px gutters, max-width 1280px
- **Tablet:** Responsive collapse, cards may go 2-column
- **Mobile:** 4-column grid, 16px side margins, cards full-width

### Vertical Rhythm
- Stack-LG (48px) between major sections (editorial "breathing room")
- Stack-MD (24px) between related components
- Stack-SM (12px) for tight groupings

---

## Responsive Behavior

- Navigation collapses to hamburger on mobile
- Cards stack vertically on mobile
- Tab navigation becomes horizontally scrollable
- Tables convert to stacked cards on mobile
- Modals become near-full-screen sheets on mobile

---

## States

### Loading
- Skeleton loaders matching card shapes
- Subtle shimmer animation on neutral backgrounds

### Empty
- Centered icon + message + CTA button
- Warm, encouraging language

### Error
- Error container background (`#ffdad6`)
- Clear error text + retry button
- "Service temporarily unavailable" for API failures
