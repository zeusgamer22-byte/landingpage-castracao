# GitHub Copilot Workspace Instructions

## Project overview

Vet Viajante is a small static website for a veterinary clinic. The active codebase is:
- `index.html`
- `style.css`
- `main.js`

There is no build system or package manager.

## Primary responsibilities

When helping in this workspace, prefer working with the active files above. Do not edit `vet_viajante_site_final.html` if it exists as a prototype.

## Local development

Serve locally with either:

```bash
python -m http.server
# or
npx serve .
```

## Architecture notes

- `main.js` is a single IIFE exposing `init()`.
- JavaScript modules include: `FAQ`, `Modal`, `Calculator`, `ScrollReveal`, `SmoothScroll`, `Nav`.
- CSS uses custom properties in `:root`, CSS Grid, Flexbox, and responsive breakpoints at 1024px, 768px, and 480px.

## Key files

- `index.html` — page structure and content
- `style.css` — styling and responsive layout
- `main.js` — interactive behavior and form logic

## Style guidance

- Keep changes minimal and static-site friendly.
- Preserve existing HTML/CSS structure unless fixing bugs or improving accessibility.
- Avoid introducing build dependencies.

## Notes

- The WhatsApp contact number is defined in `main.js`.
- Placeholder clinic credentials may need real values before deployment.
