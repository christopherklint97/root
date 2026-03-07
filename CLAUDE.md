# CLAUDE.md

## Repository Overview

Personal website and blog for Christopher Klint (christopherklint.com). Built with Astro v5, Tailwind CSS v4, shadcn/ui, and React. Deployed on Cloudflare Pages.

Repository: `https://github.com/christopherklint97/root`

## Project Structure

```
root/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (button, badge, card, dropdown-menu, separator)
│   │   ├── Header.astro     # Sticky header with nav links and theme toggle
│   │   ├── Footer.astro     # Site footer with social links
│   │   ├── ThemeToggle.tsx   # React: light/dark/system theme switcher
│   │   └── MobileNav.tsx    # React: hamburger menu for small screens
│   ├── content/
│   │   └── thoughts/        # Markdown blog posts (created at runtime, glob-loaded)
│   ├── data/
│   │   └── projects.ts      # GitHub repo fetching, pinned repos config, language colors
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Root HTML layout (head, header, footer, fonts, theme script)
│   │   └── BlogPost.astro    # Blog post layout with title, date, tags, prose styling
│   ├── lib/
│   │   └── utils.ts          # cn() utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── index.astro       # Homepage: hero, projects preview, thoughts list, speaking
│   │   ├── about.astro       # CV/resume: experience timeline, education, languages
│   │   ├── projects.astro    # All GitHub repos (fetched at build time from GitHub API)
│   │   ├── contact.astro     # Contact info, cal.com booking link
│   │   ├── thoughts/
│   │   │   ├── index.astro   # Blog listing page
│   │   │   └── [...slug].astro  # Dynamic blog post pages
│   │   └── rss.xml.ts        # RSS feed generation
│   ├── styles/
│   │   └── globals.css       # Tailwind config, theme colors (light/dark), animations
│   └── content.config.ts     # Astro content collection schema for "thoughts"
├── public/
│   └── favicon.svg
├── astro.config.mjs          # Astro config: site URL, Tailwind/React/MDX/Sitemap integrations
├── components.json           # shadcn/ui config (new-york style, slate base color)
├── wrangler.toml             # Cloudflare Pages config (output: ./dist)
├── tsconfig.json             # Strict mode, path alias @/* -> ./src/*
└── package.json
```

## Key Conventions

### Framework & Rendering
- **Astro v5** with static site generation (SSG). Pages are `.astro` files.
- **React** is used only for interactive islands: `ThemeToggle` and `MobileNav` (loaded via `client:load`).
- All other components are Astro components (server-rendered, zero JS).

### Styling
- **Tailwind CSS v4** configured via Vite plugin (not PostCSS).
- **shadcn/ui** with "new-york" style, slate base color, CSS variables enabled.
- Custom theme in `globals.css` using CSS custom properties: warm editorial palette with a terracotta primary color (`hsl(14 65% 48%)`).
- Dark mode via `.dark` class on `<html>`, toggled by `ThemeToggle` component with localStorage persistence.
- Fonts: **Instrument Serif** (headings), **Plus Jakarta Sans** (body), **JetBrains Mono** (code) -- loaded from Google Fonts.
- Staggered entrance animations (`animate-slide-up`, `stagger-1` through `stagger-8`) with `prefers-reduced-motion` support.

### Content
- Blog posts ("thoughts") use **Astro Content Collections** with a glob loader reading `src/content/thoughts/*.md`.
- Frontmatter schema: `title` (string), `description` (string), `date` (date), `updated` (date, optional), `tags` (string[], default []), `draft` (boolean, default false).
- Drafts (`draft: true`) are filtered out in all listings and the RSS feed.
- Posts are sorted by date descending. The homepage shows the latest 5.

### Projects
- The projects page fetches repos from the GitHub API at **build time** (`https://api.github.com/users/christopherklint97/repos`).
- Pinned repos are configured in `src/data/projects.ts` with optional custom descriptions.
- Hidden repos, fork repos, and archived repos are filtered out.
- The homepage shows the top 4 repos.

### Path Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Development

```sh
npm install          # Install dependencies
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist
npm run preview      # Preview production build locally
```

## Deployment

- Hosted on **Cloudflare Pages**.
- `wrangler.toml` points to `./dist` as the build output directory.
- The site is built with `npm run build` (standard Astro static build).
- GitHub repos are fetched at build time, so a rebuild is needed to reflect new/updated repos.

## Adding Content

### New blog post
1. Create `src/content/thoughts/my-post.md` with the required frontmatter:
   ```md
   ---
   title: "Post Title"
   description: "Short description for RSS and meta tags."
   date: 2026-01-15
   tags: ["engineering", "leadership"]
   ---

   Post content here.
   ```
2. Set `draft: true` in frontmatter to hide from listings while writing.

### New shadcn/ui component
Use the shadcn CLI or manually add components to `src/components/ui/`. The config is in `components.json`.

### Pinning a project
Add an entry to the `pinnedRepos` array in `src/data/projects.ts` with the repo name and optional custom description.

### Hiding a project
Add the repo name to the `hiddenRepos` array in `src/data/projects.ts`.
