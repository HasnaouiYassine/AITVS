---
name: TileVision
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#43474e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f86'
  primary: '#032448'
  on-primary: '#ffffff'
  primary-container: '#1f3a5f'
  on-primary-container: '#8ba4cf'
  inverse-primary: '#aec8f4'
  secondary: '#815500'
  on-secondary: '#ffffff'
  secondary-container: '#feb234'
  on-secondary-container: '#6d4700'
  tertiary: '#232523'
  on-tertiary: '#ffffff'
  tertiary-container: '#393a38'
  on-tertiary-container: '#a4a4a1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#aec8f4'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d476d'
  secondary-fixed: '#ffddb2'
  secondary-fixed-dim: '#ffb94c'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#624000'
  tertiary-fixed: '#e3e2df'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  container-max: 1280px
---

## Brand & Style
The design system is built for a professional AI-powered visualization platform that bridges the gap between technical precision and interior design inspiration. The aesthetic is **Modern Minimalist**, drawing influence from high-utility productivity tools and high-end architectural magazines.

The interface prioritizes clarity and focus, using a structured layout to showcase high-resolution tile textures. It avoids visual noise like gradients or glassmorphism, instead relying on a "Tactile Flat" approach—clean surfaces, intentional white space, and subtle depth through shadows to guide the user's eye toward the AI visualization engine.

## Colors
The palette is grounded in a deep Navy (#1F3A5F) to establish professional trust, balanced by an Off-White (#F8F7F4) background that prevents eye fatigue during long design sessions. 

An Amber/Gold accent (#E8A020) is used sparingly but decisively for Call-to-Action (CTA) elements and active states, providing a warm contrast that signals "creativity" and "value." Decorative elements may include subtle, low-opacity (2-5%) tile patterns in the background to reinforce the product's industry niche without distracting from the UI.

## Typography
This design system utilizes **Plus Jakarta Sans** for its geometric clarity and modern humanist feel. It strikes a balance between a technical SaaS vibe and an approachable lifestyle brand.

Headlines use bold weights and tighter letter spacing for a structured, architectural feel. Body text is set with generous line height (1.5–1.6) to ensure legibility when reading technical tile specifications or AI-generated descriptions. Use the Near-black (#1A1A1A) color for all headings to maintain strong visual hierarchy.

## Layout & Spacing
The design system employs a **Fluid Grid** system with a focus on internal padding to create a sense of organized luxury. 

- **Desktop:** 12-column grid, 24px gutters, and 48px page margins.
- **Tablet:** 8-column grid, 20px gutters, and 32px page margins.
- **Mobile:** 4-column grid, 16px gutters, and 16px page margins.

Spacing follows a 4px/8px baseline rhythm. Large sections and card containers should lean towards larger spacing tokens (`lg` or `xl`) to maintain a clean, airy feel reminiscent of a gallery.

## Elevation & Depth
Elevation in this design system is achieved through **Tonal Layers** and **Ambient Shadows** rather than heavy borders or gradients.

- **Level 0 (Base):** Off-white background (#F8F7F4).
- **Level 1 (Cards/Containers):** Pure white (#FFFFFF) with a subtle shadow (0 2px 12px rgba(0,0,0,0.06)).
- **Level 2 (Dropdowns/Modals):** Pure white with a more defined shadow (0 8px 24px rgba(0,0,0,0.10)).

Sidebars are treated as a distinct "utility" plane, using the deep Navy color to provide a strong structural anchor for the application.

## Shapes
The shape language uses a mix of "Soft" and "Rounded" corners to communicate approachability without losing its professional edge. 

- **Standard Elements:** 8px (0.5rem) radius for buttons and input fields.
- **Large Elements:** 12px (0.75rem) radius for cards and modal containers.
- **Indicators:** Progress bars and active state pills use fully rounded/pill-shaped ends.

## Components

### Buttons
- **Primary:** Amber background (#E8A020) with white text. 8px radius. High emphasis.
- **Secondary:** Transparent background with Navy (#1F3A5F) border and text. 8px radius.
- **Tertiary:** Navy text, no background, for low-emphasis actions.

### Cards
- Pure white background, 12px radius, subtle 6% opacity shadow. Internal padding is usually 24px (md).

### Inputs & Form Fields
- 8px radius, light gray border (#E5E7EB), and Navy (#1F3A5F) focus ring. Labels are `label-md` in Near-black.

### Sidebar
- Navy (#1F3A5F) background. Navigation items are white with 60% opacity. Active state: 100% white text with a 4px wide Amber (#E8A020) left border strip.

### Progress Steps
- **Completed:** Amber (#E8A020).
- **Active:** Navy (#1F3A5F).
- **Upcoming:** Light Gray (#E5E7EB).

### Specialized Visualizer Components
- **Tile Swatches:** Squares with 4px radius, arranged in a tight grid (8px spacing).
- **Comparison Slider:** A thin white vertical handle with a subtle shadow, used to wipe between "Original Room" and "AI Visualized Tiles."