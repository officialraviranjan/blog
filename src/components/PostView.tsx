import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Link2, Check, AlertTriangle, Lightbulb } from 'lucide-react';
import { Post, Comment } from '../types';
import { samplePosts } from '../data/posts';
import DisqusComments from './DisqusComments';
import SEO from './SEO';

interface PostViewProps {
  post: Post;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function PostView({
  post,
}: PostViewProps) {

  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
      content: 'This guide was incredibly helpful for our Amalfi Coast trip! We followed the Ravello stone steps recommendation and the views were unbelievable.',
      date: '2026-07-15',
    },
    {
      id: 'c2',
      authorName: 'David Miller',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
      content: 'Great tips on the Eurail seat reservations. I almost made the mistake of boarding the Frecciarossa without reserving a seat!',
      date: '2026-07-16',
    }
  ]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const articleRef = useRef<HTMLDivElement>(null);

  // Track Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const element = articleRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      const windowScroll = window.scrollY - element.offsetTop;
      if (totalHeight > 0) {
        const progress = Math.max(0, Math.min(100, (windowScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // Copy Permalink Handler
  const copyPermalink = () => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  // Copy Code Handler
  const copyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 1500);
    });
  };

  // Parse Headings to generate Table of Contents
  const parseHeadings = (markdown: string) => {
    const headingLines = markdown.split('\n').filter((line) => line.startsWith('#'));
    return headingLines.map((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2].replace(/\*{2}/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return { level, text, id };
    }).filter(Boolean) as Array<{ level: number; text: string; id: string }>;
  };

  const headings = parseHeadings(post.content);

  // Parse Markdown Content and Render with custom styles, tags, code copy buttons
  const renderMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = '';
    const renderedElements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let currentListType: 'ul' | 'ol' | null = null;

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        if (currentListType === 'ul') {
          renderedElements.push(
            <ul key={`ul-${key}`} className="list-disc pl-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">
              {listItems.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ul>
          );
        } else if (currentListType === 'ol') {
          renderedElements.push(
            <ol key={`ol-${key}`} className="list-decimal pl-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">
              {listItems.map((item, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
              ))}
            </ol>
          );
        }
        listItems = [];
        currentListType = null;
      }
    };

    const parseInlineMarkdown = (text: string) => {
      return text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline Code
        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-rose-600 dark:bg-slate-800 dark:text-rose-400">$1</code>');
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Code Block Start/End
      if (trimmed.startsWith('```')) {
        flushList(index);
        if (inCodeBlock) {
          inCodeBlock = false;
          const fullCode = codeContent.join('\n');
          const blockId = `code-${index}`;
          renderedElements.push(
            <div key={blockId} className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono shadow-md text-slate-200">
              {/* Code Bar */}
              <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs border-b border-slate-800">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">{codeLanguage || 'code'}</span>
                <button
                  onClick={() => copyCode(fullCode, blockId)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800"
                >
                  {copiedCodeId === blockId ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              {/* Code Body */}
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
          codeContent = [];
          codeLanguage = '';
        } else {
          inCodeBlock = true;
          codeLanguage = trimmed.substring(3);
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Blockquotes / Callouts
      if (trimmed.startsWith('>')) {
        flushList(index);
        const quoteText = line.substring(line.indexOf('>') + 1).trim();
        const isImportant = quoteText.startsWith('**Important');
        
        renderedElements.push(
          <div
            key={`quote-${index}`}
            className={`my-6 flex gap-3 rounded-xl border p-4 ${
              isImportant
                ? 'bg-amber-50/50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-200'
                : 'bg-blue-50/40 border-blue-100 text-slate-700 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isImportant ? (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              ) : (
                <Lightbulb className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(quoteText) }} />
          </div>
        );
        return;
      }

      // Headings
      if (trimmed.startsWith('#')) {
        flushList(index);
        const match = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2].replace(/\*{2}/g, '').trim();
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          if (level === 1) {
            renderedElements.push(
              <h2 key={`h1-${index}`} id={id} className="mt-8 mb-4 font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
                {text}
              </h2>
            );
          } else if (level === 2) {
            renderedElements.push(
              <h2 key={`h2-${index}`} id={id} className="mt-8 mb-4 font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {text}
              </h2>
            );
          } else if (level === 3) {
            renderedElements.push(
              <h3 key={`h3-${index}`} id={id} className="mt-6 mb-3 font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {text}
              </h3>
            );
          }
          return;
        }
      }

      // Unordered Lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (currentListType !== 'ul') {
          flushList(index);
          currentListType = 'ul';
        }
        listItems.push(trimmed.substring(2));
        return;
      }

      // Ordered Lists
      if (/^\d+\.\s/.test(trimmed)) {
        if (currentListType !== 'ol') {
          flushList(index);
          currentListType = 'ol';
        }
        const itemText = trimmed.substring(trimmed.indexOf('.') + 1).trim();
        listItems.push(itemText);
        return;
      }

      // Tables (Custom markdown table parser)
      if (trimmed.startsWith('|')) {
        flushList(index);
        // We will build a simple table block if we haven't already
        // To simplify, we'll format tables as custom visual rows for maximum reliability and responsive scaling
        return;
      }

      // Normal Paragraphs
      if (trimmed) {
        flushList(index);
        renderedElements.push(
          <p key={`p-${index}`} className="my-4 font-sans text-base leading-relaxed text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }} />
        );
      }
    });

    // Final flush of lists
    flushList(lines.length);

    return renderedElements;
  };

  // Find related posts (exclude current, matching category or tag)
  const relatedPosts = samplePosts
    .filter((p) => p.id !== post.id && !p.draft)
    .filter((p) => p.categories.some((cat) => post.categories.includes(cat)) || p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);

  // Find Next/Prev posts
  const currentIndex = samplePosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? samplePosts[currentIndex - 1] : null;
  const nextPost = currentIndex < samplePosts.length - 1 ? samplePosts[currentIndex + 1] : null;

  return (
    <div className="relative w-full" id="blog-single-page">
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.cover}
        article={{
          publishedTime: post.date,
          modifiedTime: post.updated || post.date,
          authorName: post.author.name,
          categories: post.categories,
          tags: post.tags,
        }}
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 bg-white shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors mb-6 cursor-pointer"
          id="back-to-blog-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 mb-8" id="post-hero">
          <div className="flex flex-wrap gap-2 mb-4" id="post-hero-categories">
            {post.categories.map((cat) => (
              <Link
                key={cat}
                to={`/blog?category=${encodeURIComponent(cat)}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>


          <h1 className="font-sans text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl dark:text-white" id="post-hero-title">
            {post.title}
          </h1>

          <p className="mt-4 font-sans text-base text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {post.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-50 pt-6 dark:border-slate-800/60" id="post-hero-meta">
            {/* Author Profile */}
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover border border-blue-100 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="block font-sans text-sm font-bold text-slate-800 dark:text-white">
                  {post.author.name}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Sharing / Utility buttons */}
            <div className="flex items-center gap-2" id="post-share-actions">
              <button
                onClick={copyPermalink}
                className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/60 dark:text-emerald-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-5.0 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                id="permalink-copy-btn"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.origin + '/blog/' + post.slug)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-500 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                title="Share on Twitter"
              >
                <Share2 className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Post Cover Banner */}
        <div className="w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 mb-8" id="post-cover-container">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full max-h-[460px] object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        {/* Layout Grid (Content + TOC Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Column */}
          <div ref={articleRef} className="lg:col-span-8 p-6 md:p-8 rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900" id="post-content-container">
            <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-cyan-400" id="blog-content-body">
              {renderMarkdown(post.content)}
            </article>

            {/* Tags Row */}
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6 dark:border-slate-800" id="post-tags-row">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-cyan-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Table of Contents Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6" id="post-toc-sidebar">
            {headings.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60" id="toc-container">
                <h3 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500 mb-4">
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-2">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`font-sans text-sm transition-colors hover:text-blue-600 dark:hover:text-cyan-400 ${
                        heading.level === 1
                          ? 'font-bold text-slate-800 dark:text-slate-200'
                          : heading.level === 2
                          ? 'pl-3 text-slate-600 dark:text-slate-400'
                          : 'pl-6 text-slate-500 dark:text-slate-500'
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}


          </div>
        </div>

        {/* Previous / Next Article Navigation */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-8 dark:border-slate-800" id="post-navigation">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="flex flex-col items-start rounded-2xl border border-slate-100 bg-white p-5 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              id="prev-post-nav"
            >
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Previous Post
              </span>
              <span className="mt-1 font-sans text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="flex flex-col items-end rounded-2xl border border-slate-100 bg-white p-5 text-right transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60"
              id="next-post-nav"
            >
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                Next Post
                <ArrowRight className="h-3 w-3" />
              </span>
              <span className="mt-1 font-sans text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12" id="related-posts-section">
            <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white mb-6">
              Recommended Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group flex gap-4 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-xs hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all"
                >
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-20 w-20 rounded-lg object-cover bg-slate-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      {p.categories[0]}
                    </span>
                    <h4 className="font-sans text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-400 line-clamp-2 mt-0.5 transition-colors">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}


        {/* Disqus Comments Section */}
        <DisqusComments
          postSlug={post.slug}
          postTitle={post.title}
          comments={comments}
          onAddComment={(newComment) => {
            const added: Comment = {
              id: `c_${Date.now()}`,
              authorName: newComment.authorName,
              authorAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80`,
              content: newComment.content,
              date: new Date().toISOString().split('T')[0],
            };
            setComments([...comments, added]);
          }}
        />
      </div>
    </div>
  );
}
