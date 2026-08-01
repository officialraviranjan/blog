# Astro Blonde Theme - Production Codebase

This directory contains a complete, optimized static Astro blog template replicating and enhancing the classic **Hugo Blonde Theme**. It is ready to build locally or deploy directly to **Cloudflare Pages** with an integrated, git-based **Decap CMS**.

## Features

- **100/100 Lighthouse Target**: Hyper-fast static HTML pages, minimized CSS/JS overhead, responsive `.webp` cover images.
- **Modern Styling**: Responsive grids, rounded article cards, soft shadows, and clean modern whitespace implemented using Tailwind CSS.
- **Dark Mode Support**: Seamless toggle state persistence across reading sessions.
- **Pagefind Search**: Instant search matching post title, description, and keywords.
- **RSS Feed & XML Sitemap**: Auto-generated for rich search engine indexing.
- **Breadcrumb & Article JSON-LD**: Embedded schemas for maximum SEO rankings.

---

## Folder Hierarchy

```
astro-blog/
├── content/
│   └── posts/                   # Decap CMS markdown post files
│       ├── rise-of-agentic-ai.md
│       └── mastering-react-19.md
├── public/
│   ├── admin/
│   │   ├── index.html           # Decap CMS Admin interface trigger
│   │   └── config.yml           # Decap CMS Admin Fields config
│   ├── _headers                 # Cloudflare caching headers
│   └── _redirects                # Cloudflare redirect list
├── src/
│   ├── components/
│   │   ├── Header.astro         # Astro responsive header
│   │   ├── Footer.astro         # Astro footer
│   │   └── Sidebar.astro        # Sidebar with categories list
│   ├── layouts/
│   │   └── BaseLayout.astro     # Main HTML wrapper (OpenGraph, Analytics)
│   └── pages/
│       ├── index.astro          # Home page (Latest / Featured posts)
│       ├── blog/
│       │   ├── [slug].astro     # Dynamic Single post pages
│       │   └── index.astro      # Blog Listing / grid page
│       ├── categories/
│       │   └── [category].astro # Dynamic category pages
│       ├── tags/
│       │   └── [tag].astro      # Dynamic tag index pages
│       ├── about.astro          # About page
│       ├── contact.astro        # Contact form page
│       └── archive.astro        # Archive listings sorted by date
├── astro.config.mjs             # Integrations (Tailwind, Sitemap)
├── tailwind.config.js           # Styles definitions
└── package.json                 # Core dependencies
```

---

## Local Development Setup

To run this project locally, ensure you have **Node.js v18+** installed.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

3. **Build static assets:**
   ```bash
   npm run build
   ```
   Your production assets will compile into the `dist/` directory.

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## Deploying to Cloudflare Pages

1. **Create a GitHub Repository:**
   Push this folder to a new public or private repository on GitHub.
   ```bash
   git init
   git add .
   git commit -m "feat: init blonde theme"
   git branch -M main
   git remote add origin https://github.com/your-username/your-blog.git
   git push -u origin main
   ```

2. **Link with Cloudflare Pages:**
   - Log in to the Cloudflare dashboard.
   - Navigate to **Workers & Pages** > **Pages** > **Create application** > **Pages**.
   - Select **Connect to Git** and choose your repository.
   - Under **Build settings**, set framework preset to **Astro**.
   - Output folder: `dist`.
   - Click **Save and Deploy**. Cloudflare's global edge will build your site automatically on every push!
