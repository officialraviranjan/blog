import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authorName?: string;
    categories?: string[];
    tags?: string[];
  };
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Euro Travels Guide — Ultimate Travel & Destination Guides",
  description = "Discover curated European travel itineraries, budget travel tips, hidden gems, and authentic cultural experiences across Europe with Euro Travels Guide.",
  canonical,
  ogType = "website",
  ogImage = "https://eurotravelsguide.eu.org/default-og.jpg",
  article,
  noIndex = false,
}) => {
  const siteName = "Euro Travels Guide";
  const siteUrl = "https://eurotravelsguide.eu.org";

  // Formatted title
  const formattedTitle = title.includes(siteName)
    ? title
    : `${title} | ${siteName}`;

  // Canonical URL
  const canonicalUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical.startsWith('/') ? canonical : '/' + canonical}`)
    : siteUrl;

  const primaryCategory = article?.categories?.[0] || 'Travel';
  const authorName = article?.authorName || 'Sophia Rossi';
  const resolvedOgImage = ogImage || `${siteUrl}/default-og.jpg`;

  // Schema JSON-LD
  const schemaData = article
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "headline": title,
        "description": description,
        "image": [resolvedOgImage],
        "datePublished": article.publishedTime || "2026-07-01",
        "dateModified": article.modifiedTime || article.publishedTime || "2026-07-01",
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": `${siteUrl}/about`
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/android-chrome-192x192.png`
          }
        },
        "articleSection": primaryCategory,
        "keywords": article.tags?.join(', ')
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteUrl,
        "name": siteName,
        "description": description,
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/android-chrome-192x192.png`
          }
        }
      };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {authorName && (
        <meta property="article:author" content={authorName} />
      )}
      {primaryCategory && (
        <meta property="article:section" content={primaryCategory} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="twitter:creator" content="@sophia_travels" />
      <meta name="twitter:site" content="@sophia_travels" />

      {/* Schema JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SEO;
