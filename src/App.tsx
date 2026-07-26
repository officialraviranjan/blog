import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Sparkles, Send, CheckCircle, Compass } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import SearchModal from './components/SearchModal';
import PostView from './components/PostView';
import { samplePosts } from './data/posts';
import { Post } from './types';

export default function App() {
  const [currentRoute, setRoute] = useState<string>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [searchOpen, setSearchOpen] = useState(false);

  // Apply dark mode theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen to keyboard shortcut (Ctrl+K or Cmd+K) to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Back to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route setter helper
  const navigateTo = (route: string) => {
    setRoute(route);
    setSelectedPost(null);
    if (route !== 'blog') {
      setSelectedCategory(undefined);
      setSelectedTag(undefined);
    }
    window.scrollTo({ top: 0 });
  };

  // Filter handlers
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(undefined);
    setSelectedPost(null);
    setRoute('blog');
    window.scrollTo({ top: 0 });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory(undefined);
    setSelectedPost(null);
    setRoute('blog');
    window.scrollTo({ top: 0 });
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
  };

  // Select post handler
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setRoute(`blog/${post.slug}`);
    window.scrollTo({ top: 0 });
  };

  // Filter posts
  const filteredPosts = samplePosts.filter((post) => {
    if (post.draft) return false;
    if (selectedCategory && !post.categories.includes(selectedCategory)) return false;
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    return true;
  });

  const featuredPost = samplePosts.find((p) => p.featured && !p.draft) || samplePosts[0];
  const recentPosts = samplePosts.filter((p) => p.id !== featuredPost.id && !p.draft);

  // Forms states
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100" id="app-root">
      {/* Header */}
      <Header
        currentRoute={currentRoute}
        setRoute={navigateTo}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openSearch={() => setSearchOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col" id="main-content">
        {/* Router View */}

        {/* 1. HOME ROUTE */}
        {currentRoute === 'home' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="home-view">
            {/* Hero / Prominent Featured Post */}
            <section className="mb-12" id="home-hero">
              <div
                onClick={() => handleSelectPost(featuredPost)}
                className="group cursor-pointer relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800 lg:h-[420px]">
                    <img
                      src={featuredPost.cover}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="lg:col-span-5 p-8 flex flex-col justify-center">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-3 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Featured Article
                    </span>
                    <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-3">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 font-sans text-sm text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                      {featuredPost.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="h-8 w-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {featuredPost.author.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {featuredPost.readingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Layout Columns: Posts vs Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Recent Posts */}
              <div className="lg:col-span-8 flex flex-col gap-8" id="recent-posts-grid">
                <div>
                  <h3 className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                    Latest Publications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => handleSelectPost(post)}
                        onCategoryClick={(cat, e) => {
                          e.stopPropagation();
                          handleCategoryClick(cat);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Newsletter Box */}
                <Newsletter />
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-4">
                <Sidebar
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. BLOG LISTING ROUTE */}
        {currentRoute === 'blog' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="blog-listing-view">
            {/* Filter Alert */}
            {(selectedCategory || selectedTag) && (
              <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60 flex items-center justify-between" id="filter-indicator">
                <span className="font-sans text-sm text-slate-600 dark:text-slate-300">
                  Showing articles matching:{' '}
                  <span className="font-bold text-blue-600 dark:text-cyan-400">
                    {selectedCategory ? `Category: ${selectedCategory}` : `Tag: #${selectedTag}`}
                  </span>
                </span>
                <button
                  onClick={clearFilters}
                  className="font-mono text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Post list */}
              <div className="lg:col-span-8" id="blog-filtered-list">
                <h2 className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
                  {selectedCategory || selectedTag ? 'Filtered Articles' : 'All Publications'}
                </h2>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <p className="font-sans text-slate-500">No posts found with this query.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => handleSelectPost(post)}
                        onCategoryClick={(cat, e) => {
                          e.stopPropagation();
                          handleCategoryClick(cat);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="lg:col-span-4">
                <Sidebar
                  onCategoryClick={handleCategoryClick}
                  onTagClick={handleTagClick}
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. ARCHIVE ROUTE */}
        {currentRoute === 'archive' && (
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="archive-view">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 mb-8">
              Chronological Archive
            </h1>
            <div className="relative border-l border-slate-200 pl-6 dark:border-slate-800 space-y-12">
              {/* Grouped by Year/Month */}
              {samplePosts.map((post) => (
                <div key={post.id} className="relative group" id={`archive-item-${post.slug}`}>
                  {/* Circle Node */}
                  <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-blue-600 bg-white group-hover:bg-blue-600 dark:border-cyan-400 dark:bg-slate-950 dark:group-hover:bg-cyan-400 transition-colors" />
                  
                  <span className="font-mono text-xs text-slate-400">{post.date}</span>
                  <h3
                    onClick={() => handleSelectPost(post)}
                    className="mt-1 font-sans text-base font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-cyan-400 cursor-pointer transition-colors"
                  >
                    {post.title}
                  </h3>
                  <div className="mt-2 flex gap-1.5">
                    {post.categories.map((cat) => (
                      <span key={cat} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ABOUT ROUTE */}
        {currentRoute === 'about' && (
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="about-view">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 mb-8">
              About Sophia Rossi & eurotravelsguide
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Sophia Rossi Avatar"
                  className="rounded-2xl border-4 border-slate-100 dark:border-slate-800 shadow-md w-full"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white">Sophia Rossi</h3>
                  <p className="font-mono text-xs text-blue-600 dark:text-cyan-400 mt-1">Travel Writer & Photographer, Florence</p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Welcome to my travel sanctuary. I am a travel writer and photographer based in Florence, Italy, exploring Europe's hidden cobblestones, authentic local taverns, and scenic railways.
                </p>
                <p>
                  I created this blog template to showcase how to build modern, hyper-fast, highly accessible, and AdSense-optimized travel blogs using <strong>Astro</strong>, <strong>Tailwind CSS</strong>, and the git-based <strong>Decap CMS</strong>.
                </p>
                <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white pt-4">Technical Stack & AdSense Optimization</h3>
                <p>
                  To achieve maximum ad yield and absolute speed, this theme compiles to 100% static HTML (SSG). This eliminates slow database queries and provides perfect, shift-free layouts that Google AdSense demands for maximum visibility.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Static Site Generation (SSG):</strong> Deployed completely on Cloudflare CDN for sub-millisecond response times.</li>
                  <li><strong>Lighthouse 100/100 Core Web Vitals:</strong> Zero layout shifts, meaning ads load seamlessly without disrupting text flow.</li>
                  <li><strong>Decap CMS Integrated:</strong> Edit and publish markdown articles directly from your phone on the road.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTACT ROUTE */}
        {currentRoute === 'contact' && (
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="contact-view">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 mb-8">
              Contact Author
            </h1>
            {contactSubmitted ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-8 text-center dark:border-emerald-900/60 dark:bg-slate-900 animate-in zoom-in-95">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                <h2 className="mt-4 font-sans text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h2>
                <p className="mt-2 font-sans text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. I have received your submission and will get back to you at my earliest convenience.
                </p>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactForm({ name: '', email: '', message: '' });
                  }}
                  className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-900 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (contactForm.name && contactForm.email && contactForm.message) {
                    setContactSubmitted(true);
                  }
                }}
                className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Share your travel questions, partnership inquiries, or message here..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-900 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        )}

        {/* 6. SINGLE BLOG POST VIEW */}
        {currentRoute.startsWith('blog/') && selectedPost && (
          <PostView
            post={selectedPost}
            setRoute={navigateTo}
            onPostSelect={handleSelectPost}
            onCategoryClick={handleCategoryClick}
            onTagClick={handleTagClick}
          />
        )}

        {/* 7. PRIVACY POLICY */}
        {currentRoute === 'privacy' && (
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="privacy-view">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 mb-8">
              Privacy Policy
            </h1>
            <div className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>Last Updated: July 15, 2026</strong>
              </p>
              <p>
                At eurotravelsguide, accessible from <span className="font-mono text-blue-600 dark:text-cyan-400">eurotravelsguide.eu.org</span>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by eurotravelsguide and how we use it.
              </p>
              <p>
                This site integrates Google AdSense advertising. Google uses cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting Ads Settings.
              </p>
              <h2 className="font-sans text-lg font-bold text-slate-950 dark:text-white pt-2">Log Files</h2>
              <p>
                eurotravelsguide follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>
            </div>
          </div>
        )}

        {/* 9. TERMS OF SERVICE */}
        {currentRoute === 'terms' && (
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 w-full animate-in fade-in duration-300" id="terms-view">
            <h1 className="font-sans text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800 mb-8">
              Terms of Service
            </h1>
            <div className="space-y-4 font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>Last Updated: July 15, 2026</strong>
              </p>
              <p>
                Welcome to eurotravelsguide!
              </p>
              <p>
                These terms and conditions outline the rules and regulations for the use of eurotravelsguide, located at eurotravelsguide.eu.org.
              </p>
              <p>
                By accessing this website we assume you accept these terms and conditions. Do not continue to use eurotravelsguide if you do not agree to take all of the terms and conditions stated on this page.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setRoute={navigateTo} />

      {/* Search Modal (Instant Ctrl+K Search) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectPost={handleSelectPost}
      />
    </div>
  );
}
