import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../src/App.tsx';
import { samplePosts } from '../src/data/posts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteName = 'Euro Travels Guide';
const siteUrl = 'https://eurotravelsguide.eu.org';
const defaultOgImage = `${siteUrl}/default-og.jpg`;
const publisherLogo = `${siteUrl}/android-chrome-192x192.png`;

const distDir = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

interface RouteMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogImage: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authorName: string;
    categories: string[];
    tags: string[];
  };
}

function generateHeadTags(meta: RouteMeta): string {
  const formattedTitle = meta.title.includes(siteName)
    ? meta.title
    : `${meta.title} | ${siteName}`;

  const primaryCategory = meta.article?.categories?.[0] || 'Travel';
  const authorName = meta.article?.authorName || 'Sophia Rossi';
  const resolvedOgImage = meta.ogImage || defaultOgImage;

  const schemaData = meta.article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': meta.canonicalUrl,
        },
        'headline': meta.title,
        'description': meta.description,
        'image': [resolvedOgImage],
        'datePublished': meta.article.publishedTime,
        'dateModified': meta.article.modifiedTime || meta.article.publishedTime,
        'author': {
          '@type': 'Person',
          'name': authorName,
          'url': `${siteUrl}/about`,
        },
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'url': siteUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': publisherLogo,
          },
        },
        'articleSection': primaryCategory,
        'keywords': meta.article.tags?.join(', '),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': siteUrl,
        'name': siteName,
        'description': meta.description,
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'url': siteUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': publisherLogo,
          },
        },
      };

  return `
    <title>${escapeXml(formattedTitle)}</title>
    <meta name="description" content="${escapeXml(meta.description)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${meta.canonicalUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="${meta.ogType}" />
    <meta property="og:title" content="${escapeXml(formattedTitle)}" />
    <meta property="og:description" content="${escapeXml(meta.description)}" />
    <meta property="og:url" content="${meta.canonicalUrl}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:image" content="${resolvedOgImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    ${meta.article ? `<meta property="article:published_time" content="${meta.article.publishedTime}" />` : ''}
    ${meta.article?.modifiedTime ? `<meta property="article:modified_time" content="${meta.article.modifiedTime}" />` : ''}
    ${meta.article ? `<meta property="article:author" content="${authorName}" />` : ''}
    ${meta.article ? `<meta property="article:section" content="${primaryCategory}" />` : ''}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(formattedTitle)}" />
    <meta name="twitter:description" content="${escapeXml(meta.description)}" />
    <meta name="twitter:image" content="${resolvedOgImage}" />
    <meta name="twitter:creator" content="@sophia_travels" />
    <meta name="twitter:site" content="@sophia_travels" />

    <!-- Schema JSON-LD -->
    <script type="application/ld+json">${JSON.stringify(schemaData)}</script>
`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function injectHeadIntoHtml(templateHtml: string, meta: RouteMeta): string {
  const headContent = generateHeadTags(meta);

  // Remove existing title, meta description, canonical, og, twitter, json-ld tags from base template
  let cleanedHtml = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/gi, '')
    .replace(/<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/gi, '')
    .replace(/<meta\s+property="og:[\s\S]*?"\s+content="[\s\S]*?"\s*\/?>/gi, '')
    .replace(/<meta\s+name="twitter:[\s\S]*?"\s+content="[\s\S]*?"\s*\/?>/gi, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  return cleanedHtml.replace('</head>', `${headContent}\n  </head>`);
}

function renderRouteHtml(templateHtml: string, routePath: string, meta: RouteMeta): string {
  const helmetContext: Record<string, any> = {};

  const appHtml = ReactDOMServer.renderToString(
    React.createElement(
      HelmetProvider,
      { context: helmetContext },
      React.createElement(
        MemoryRouter,
        { initialEntries: [routePath] },
        React.createElement(App)
      )
    )
  );

  const htmlWithHead = injectHeadIntoHtml(templateHtml, meta);
  return htmlWithHead.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

function writeRouteHtml(routePath: string, htmlContent: string) {
  let targetFile: string;
  if (routePath === '/' || routePath === '') {
    targetFile = path.join(distDir, 'index.html');
  } else {
    const cleanPath = routePath.replace(/^\//, '');
    const targetFolder = path.join(distDir, cleanPath);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    targetFile = path.join(targetFolder, 'index.html');
  }

  fs.writeFileSync(targetFile, htmlContent, 'utf-8');
  console.log(`[Prerender] Written: ${path.relative(distDir, targetFile)}`);
}

async function prerender() {
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[Prerender Error] dist/index.html does not exist. Run "vite build" first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // 1. Static Pages
  const staticRoutes: Array<{ path: string; meta: RouteMeta }> = [
    {
      path: '/',
      meta: {
        title: 'Euro Travels Guide — Ultimate European Travel Itineraries & Budget Tips',
        description: 'Discover curated European travel itineraries, budget travel tips, hidden gems, and authentic cultural experiences across Europe with Euro Travels Guide.',
        canonicalUrl: `${siteUrl}/`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/blog',
      meta: {
        title: 'All Travel Articles & Destination Guides | Euro Travels Guide',
        description: 'Explore our complete collection of European destination guides, itineraries, food tours, and travel advice.',
        canonicalUrl: `${siteUrl}/blog`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/archive',
      meta: {
        title: 'Chronological Article Archive | Euro Travels Guide',
        description: 'Browse all past European travel articles, itineraries, and guides organized chronologically.',
        canonicalUrl: `${siteUrl}/archive`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/about',
      meta: {
        title: 'About Sophia Rossi & Euro Travels Guide',
        description: 'Learn about Sophia Rossi, Florence-based travel writer and photographer crafting authentic, slow-travel guides across Europe.',
        canonicalUrl: `${siteUrl}/about`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/contact',
      meta: {
        title: 'Contact Author | Euro Travels Guide',
        description: 'Get in touch with Sophia Rossi for European travel questions, editorial feedback, or partnership inquiries.',
        canonicalUrl: `${siteUrl}/contact`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/privacy',
      meta: {
        title: 'Privacy Policy & Cookie Consent | Euro Travels Guide',
        description: 'Read the privacy policy, data collection practices, and cookie usage guidelines for Euro Travels Guide.',
        canonicalUrl: `${siteUrl}/privacy`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
    {
      path: '/terms',
      meta: {
        title: 'Terms of Service | Euro Travels Guide',
        description: 'Read the terms of service and legal conditions for using Euro Travels Guide.',
        canonicalUrl: `${siteUrl}/terms`,
        ogType: 'website',
        ogImage: defaultOgImage,
      },
    },
  ];

  for (const route of staticRoutes) {
    const html = renderRouteHtml(templateHtml, route.path, route.meta);
    writeRouteHtml(route.path, html);
  }

  // 2. Blog Post Pages (/blog/:slug and /post/:slug)
  for (const post of samplePosts) {
    const postMeta: RouteMeta = {
      title: `${post.title} | Euro Travels Guide`,
      description: post.description,
      canonicalUrl: `${siteUrl}/blog/${post.slug}`,
      ogType: 'article',
      ogImage: post.cover || defaultOgImage,
      article: {
        publishedTime: post.date,
        modifiedTime: post.updated || post.date,
        authorName: post.author.name,
        categories: post.categories,
        tags: post.tags,
      },
    };

    const blogHtml = renderRouteHtml(templateHtml, `/blog/${post.slug}`, postMeta);
    writeRouteHtml(`/blog/${post.slug}`, blogHtml);

    const postHtml = renderRouteHtml(templateHtml, `/post/${post.slug}`, postMeta);
    writeRouteHtml(`/post/${post.slug}`, postHtml);
  }

  // 3. Generate sitemap.xml dynamically from unified source of truth
  generateSitemap(staticRoutes);

  console.log(`[Prerender Success] Successfully pre-rendered static HTML with full React body content for ${staticRoutes.length + samplePosts.length * 2} routes!`);
}

function generateSitemap(staticRoutes: Array<{ path: string; meta: RouteMeta }>) {
  const publicDir = path.join(__dirname, '..', 'public');
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  const distSitemapPath = path.join(distDir, 'sitemap.xml');

  const staticUrls = staticRoutes.map((route) => {
    let freq = 'monthly';
    let priority = '0.7';
    if (route.path === '/') {
      freq = 'daily';
      priority = '1.0';
    } else if (route.path === '/blog') {
      freq = 'daily';
      priority = '0.9';
    } else if (route.path === '/archive') {
      freq = 'weekly';
      priority = '0.8';
    } else if (route.path === '/about') {
      priority = '0.8';
    } else if (route.path === '/contact') {
      priority = '0.6';
    } else if (route.path === '/privacy' || route.path === '/terms') {
      freq = 'yearly';
      priority = '0.5';
    }

    const url = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>2026-07-31</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const postUrls = samplePosts.map((post) => {
    const lastmod = post.updated || post.date;
    const locUrl = `${siteUrl}/blog/${encodeURI(post.slug)}`;
    return `  <url>
    <loc>${locUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Core Pages -->
${staticUrls.join('\n')}

  <!-- Article Publications -->
${postUrls.join('\n')}
</urlset>
`;

  fs.writeFileSync(publicSitemapPath, sitemapXml, 'utf-8');
  fs.writeFileSync(distSitemapPath, sitemapXml, 'utf-8');
  console.log(`[Sitemap] Generated sitemap.xml with ${staticRoutes.length + samplePosts.length} URLs in /public and /dist`);
}

prerender().catch((err) => {
  console.error('[Prerender Error]', err);
  process.exit(1);
});
