// Cloudflare Pages Function using HTMLRewriter API for Edge Meta Tag Injection
import { samplePosts } from '../src/data/posts';

interface EventContext {
  request: Request;
  env: Record<string, any>;
  next: () => Promise<Response>;
}

const siteName = 'Euro Travels Guide';
const siteUrl = 'https://eurotravelsguide.eu.org';
const defaultOgImage = `${siteUrl}/default-og.jpg`;
const publisherLogo = `${siteUrl}/android-chrome-192x192.png`;

export async function onRequest(context: EventContext): Promise<Response> {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Pass through static assets directly
  if (
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|json|webmanifest|xml|txt)$/)
  ) {
    return context.next();
  }

  // Get raw response from Cloudflare Pages static file server
  const response = await context.next();

  // If response is not HTML, return as is
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Determine route metadata
  let title = 'Euro Travels Guide — Ultimate European Travel Itineraries & Budget Tips';
  let description = 'Discover curated European travel itineraries, budget travel tips, hidden gems, and authentic cultural experiences across Europe with Euro Travels Guide.';
  let canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`;
  let ogType = 'website';
  let ogImage = defaultOgImage;
  let articleMeta: {
    publishedTime: string;
    modifiedTime?: string;
    authorName: string;
    categories: string[];
    tags: string[];
  } | null = null;

  // Match blog post routes
  const blogMatch = pathname.match(/^\/(blog|post)\/([a-zA-Z0-9_-]+)/);
  if (blogMatch) {
    const slug = blogMatch[2];
    const post = samplePosts.find((p) => p.slug === slug);
    if (post) {
      title = `${post.title} | Euro Travels Guide`;
      description = post.description;
      canonicalUrl = `${siteUrl}/blog/${post.slug}`;
      ogType = 'article';
      ogImage = post.cover || defaultOgImage;
      articleMeta = {
        publishedTime: post.date,
        modifiedTime: post.updated || post.date,
        authorName: post.author.name,
        categories: post.categories,
        tags: post.tags,
      };
    }
  } else if (pathname === '/blog') {
    title = 'All Travel Articles & Destination Guides | Euro Travels Guide';
    description = 'Explore our complete collection of European destination guides, itineraries, food tours, and travel advice.';
    canonicalUrl = `${siteUrl}/blog`;
  } else if (pathname === '/archive') {
    title = 'Chronological Article Archive | Euro Travels Guide';
    description = 'Browse all past European travel articles, itineraries, and guides organized chronologically.';
    canonicalUrl = `${siteUrl}/archive`;
  } else if (pathname === '/about') {
    title = 'About Sophia Rossi & Euro Travels Guide';
    description = 'Learn about Sophia Rossi, Florence-based travel writer and photographer crafting authentic, slow-travel guides across Europe.';
    canonicalUrl = `${siteUrl}/about`;
  } else if (pathname === '/contact') {
    title = 'Contact Author | Euro Travels Guide';
    description = 'Get in touch with Sophia Rossi for European travel questions, editorial feedback, or partnership inquiries.';
    canonicalUrl = `${siteUrl}/contact`;
  } else if (pathname === '/privacy') {
    title = 'Privacy Policy & Cookie Consent | Euro Travels Guide';
    description = 'Read the privacy policy, data collection practices, and cookie usage guidelines for Euro Travels Guide.';
    canonicalUrl = `${siteUrl}/privacy`;
  }

  // Generate JSON-LD Schema
  const schemaData = articleMeta
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        'headline': title.replace(` | ${siteName}`, ''),
        'description': description,
        'image': [ogImage],
        'datePublished': articleMeta.publishedTime,
        'dateModified': articleMeta.modifiedTime || articleMeta.publishedTime,
        'author': {
          '@type': 'Person',
          'name': articleMeta.authorName,
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
        'articleSection': articleMeta.categories?.[0] || 'Travel',
        'keywords': articleMeta.tags?.join(', '),
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': siteUrl,
        'name': siteName,
        'description': description,
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

  // HTMLRewriter transforms HTML on Cloudflare Edge
  const rewriter = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(title);
      },
    })
    .on('meta[name="description"]', {
      element(element) {
        element.setAttribute('content', description);
      },
    })
    .on('link[rel="canonical"]', {
      element(element) {
        element.setAttribute('href', canonicalUrl);
      },
    })
    .on('meta[property="og:title"]', {
      element(element) {
        element.setAttribute('content', title);
      },
    })
    .on('meta[property="og:description"]', {
      element(element) {
        element.setAttribute('content', description);
      },
    })
    .on('meta[property="og:url"]', {
      element(element) {
        element.setAttribute('content', canonicalUrl);
      },
    })
    .on('meta[property="og:type"]', {
      element(element) {
        element.setAttribute('content', ogType);
      },
    })
    .on('meta[property="og:image"]', {
      element(element) {
        element.setAttribute('content', ogImage);
      },
    })
    .on('meta[name="twitter:title"]', {
      element(element) {
        element.setAttribute('content', title);
      },
    })
    .on('meta[name="twitter:description"]', {
      element(element) {
        element.setAttribute('content', description);
      },
    })
    .on('meta[name="twitter:image"]', {
      element(element) {
        element.setAttribute('content', ogImage);
      },
    })
    .on('head', {
      element(element) {
        // Append JSON-LD script block before </head>
        element.append(
          `<script type="application/ld+json">${JSON.stringify(schemaData)}</script>`,
          { html: true }
        );
      },
    });

  return rewriter.transform(response);
}
