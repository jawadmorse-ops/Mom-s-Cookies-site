---
name: Cookie Site Project Setup
description: Tech stack and structure for the Crumble & Co. cookie ordering website
type: project
---

Crumble & Co. is a professional cookie ordering website built with Astro, Tailwind CSS, and Framer Motion.

**Stack:**
- Framework: Astro 6 (static output)
- Styling: Tailwind CSS 3 with custom cookie/chocolate/cream color palette and Playfair Display + Plus Jakarta Sans fonts
- Animations: Framer Motion 12 (via @astrojs/react integration)
- React 19 for interactive components (client:load / client:visible directives)

**Pages:**
- `/` — Home: Hero, featured cookies, why-us, testimonials, CTA
- `/menu` — Browse all 12 cookies with live search + category filter
- `/order` — 2-step order form (cookie picker + customer details) with sidebar summary

**Key files:**
- `src/data/cookies.ts` — All cookie data (12 flavors), pack sizes, categories
- `src/styles/global.css` — Global styles, Tailwind layers, Google Fonts import
- `src/components/*.tsx` — React/Framer Motion components
- `src/components/*.astro` — Navbar, Footer (Astro components)
- `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json` — Config files

**Why:** User wants a professional cookie bakery website where customers can browse and order.
**How to apply:** When extending this site, follow existing component patterns, color tokens, and Astro client directive conventions (client:load for above-fold, client:visible for below-fold).
