# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vet Viajante** is a static website for a veterinary clinic specializing in small animals (dogs and cats up to 25kg). The project is split into three files: `index.html`, `style.css`, and `main.js`. There is no build system or package manager.

> `vet_viajante_site_final.html` is the original monolithic prototype — **do not edit it**. The active codebase is `index.html` + `style.css` + `main.js`.

## Local Development

Serve locally with either:
```bash
python -m http.server
# or
npx serve .
```

No build, lint, or test commands exist.

## JavaScript Architecture (`main.js`)

Single IIFE (`VetViajante`) that exposes only `init()`. Internal sub-modules:

| Module | Responsibility |
|---|---|
| `FAQ` | Accordion toggle with max-height CSS transition |
| `Modal` | Lead capture form: open/close, WhatsApp mask, validation, WA link generation, success panel |
| `Calculator` | NER formula: `70 × peso^0.75` kcal/day, updates DOM result in place |
| `ScrollReveal` | `IntersectionObserver` adds `.visible` to `.reveal` elements as they enter the viewport |
| `SmoothScroll` | Native `scrollTo` with header offset compensation for all `a[href^="#"]` links |
| `Nav` | Mobile hamburger: toggles `.open` class on `#hd-nav` and `#hd-hamburger` |

**WhatsApp number** is the constant `WA_NUMBER` at the top of `main.js` — change it before going live.

## Architecture

The CSS uses custom properties defined in `:root` for the design system:

| Variable | Value | Purpose |
|---|---|---|
| `--dk` | `#0b5e6c` | Primary dark teal |
| `--md` | `#0e7d8f` | Medium teal |
| `--br` | `#1ac8d4` | Bright cyan accent |
| `--lt` | `#e4f7f9` | Light background |
| `--tx` | `#0d2b31` | Dark text |
| `--mu` | `#4a7a83` | Muted text |
| `--go` | `#f0a500` | Gold (ratings) |
| `--r` / `--rs` / `--rl` | `12px` / `8px` / `20px` | Border radii |

Layout uses CSS Grid (`repeat(auto-fit, minmax(...))`) and Flexbox. Typography is fluid via `clamp()`. Max content width is 1080px (`.container`).

## CSS Architecture (`style.css`)

Organized top-to-bottom: variables → utilities → components → modal → scroll reveal → responsive breakpoints.

Breakpoints: `≤ 1024px` (tablet — 2-column footer), `≤ 768px` (mobile — hamburger, single-column layouts), `≤ 480px` (small mobile — all grids go 1-column).

## Page Sections (top to bottom)

| Class | Description |
|---|---|
| `.hd` | Sticky header/nav + hamburger |
| `.hero` | Landing hero with stats |
| `#sobre` | About section (two-column grid) |
| `#servicos` | Services card grid (6 cards) |
| `#calculadora` | NER nutritional calculator card |
| `#diferenciais` | Differentiators (dark background) |
| `#depoimentos` | Testimonials |
| `.obj-grid` | Transparency Q&A (two-column) |
| `.cta-sec` | Final CTA (dark background) |
| `#faq` | Expandable FAQ accordion |
| `.footer` | Four-column footer |
| `.wa` | Fixed WhatsApp floating button |
| `#modal-overlay` | Lead capture modal (two panels: form / success) |

## Content Notes

- All images are external Unsplash URLs with fallback `onerror` attributes.
- Placeholder credentials exist in the HTML (e.g., `CRMV-SP #XXXXX`) — these need real values before go-live.
- The FAQ accordion is visual-only structure; adding interactivity requires JavaScript.
- Emojis are used as icons throughout (no icon font or SVG sprite).

## Deployment

Drop the single HTML file on any static host (GitHub Pages, Netlify, Vercel, traditional hosting). No build step required.
