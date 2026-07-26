import React, { useEffect, useState } from 'react';
import { MessageSquare, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Comment } from '../types';

interface DisqusCommentsProps {
  postSlug: string;
  postTitle: string;
  shortname?: string;
  comments: Comment[];
  onAddComment: (comment: { authorName: string; content: string }) => void;
}

export default function DisqusComments({
  postSlug,
  postTitle,
  shortname = 'eurotravelsguide-eu-org',
  comments,
  onAddComment,
}: DisqusCommentsProps) {
  const [activeTab, setActiveTab] = useState<'disqus' | 'native'>('disqus');
  const [disqusError, setDisqusError] = useState<boolean>(false);
  const [isScriptLoading, setIsScriptLoading] = useState<boolean>(true);

  // Local state for native comment form
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [nativeError, setNativeError] = useState('');

  const canonicalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/posts/${postSlug}` 
    : `https://eurotravelsguide.eu.org/posts/${postSlug}`;

  useEffect(() => {
    if (activeTab !== 'disqus') return;

    setIsScriptLoading(true);
    setDisqusError(false);

    // Set Disqus global configuration
    const windowObj = window as any;
    windowObj.disqus_config = function () {
      this.page.url = canonicalUrl;
      this.page.identifier = postSlug;
      this.page.title = postTitle;
    };

    // Timeout guard to prevent infinite loading if Disqus is blocked or non-existent
    const timeoutTimer = setTimeout(() => {
      setIsScriptLoading((loading) => {
        if (loading) {
          setDisqusError(true);
          return false;
        }
        return false;
      });
    }, 4500);

    // If DISQUS is already loaded on page, reload with new config
    if (windowObj.DISQUS) {
      try {
        windowObj.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = canonicalUrl;
            this.page.identifier = postSlug;
            this.page.title = postTitle;
          },
        });
        clearTimeout(timeoutTimer);
        setIsScriptLoading(false);
      } catch (e) {
        console.warn('Disqus reset error:', e);
        clearTimeout(timeoutTimer);
        setIsScriptLoading(false);
        setDisqusError(true);
      }
      return () => clearTimeout(timeoutTimer);
    }

    // Otherwise, append script tag dynamically
    const scriptId = 'disqus-embed-script';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', new Date().getTime().toString());
    script.async = true;

    script.onload = () => {
      clearTimeout(timeoutTimer);
      setIsScriptLoading(false);
    };

    script.onerror = () => {
      clearTimeout(timeoutTimer);
      setIsScriptLoading(false);
      setDisqusError(true);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeoutTimer);
    };
  }, [postSlug, postTitle, shortname, activeTab, canonicalUrl]);

  const handleNativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) {
      setNativeError('Please enter both your name and a comment message.');
      return;
    }
    onAddComment({ authorName: newAuthor.trim(), content: newText.trim() });
    setNewAuthor('');
    setNewText('');
    setNativeError('');
  };

  return (
    <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900" id="comments-wrapper">
      {/* Comments Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
            Community Discussion
          </h3>
        </div>

        {/* Engine Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('disqus')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'disqus'
                ? 'bg-white text-blue-600 shadow-2xs dark:bg-slate-800 dark:text-cyan-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            id="tab-disqus-comments"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Disqus Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('native')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'native'
                ? 'bg-white text-blue-600 shadow-2xs dark:bg-slate-800 dark:text-cyan-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            id="tab-native-comments"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Native ({comments.length})</span>
          </button>
        </div>
      </div>

      {/* DISQUS TAB CONTENT */}
      {activeTab === 'disqus' && (
        <div className="pt-6" id="disqus-tab-content">
          {/* Disqus Script Loading Spinner / Fallback UI */}
          {isScriptLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 dark:text-cyan-400 mb-2" />
              <p className="text-xs font-medium">Connecting to Disqus comment network...</p>
            </div>
          )}

          {/* Error Notice (e.g., if adblocker blocks or invalid shortname in preview) */}
          {disqusError && (
            <div className="my-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <p className="font-bold">Disqus Sandbox Notice</p>
                  <p className="mt-1">
                    The Disqus thread for <code className="font-bold">{shortname}</code> could not be loaded directly inside this sandbox iframe. This happens if the shortname hasn't been created on Disqus.com yet or if an adblocker is active.
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('native')}
                      className="rounded bg-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 cursor-pointer"
                    >
                      Use Native Comments
                    </button>
                    <a
                      href={`https://${shortname}.disqus.com`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-amber-800 underline dark:text-amber-300"
                    >
                      Open Disqus Setup
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REAL DISQUS THREAD TARGET CONTAINER */}
          <div id="disqus_thread" className="min-h-[250px] w-full" />

          {/* Helper Footer for Site Owners */}
          <div className="mt-8 border-t border-slate-100 pt-4 text-center dark:border-slate-800">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Powered by <a href="https://disqus.com" target="_blank" rel="noreferrer" className="font-semibold hover:underline text-blue-600 dark:text-cyan-400">Disqus</a>. Moderated & synced with Decap CMS/Astro SSG static builds.
            </p>
          </div>
        </div>
      )}

      {/* NATIVE LOCAL COMMENTS TAB CONTENT */}
      {activeTab === 'native' && (
        <div className="pt-6" id="native-tab-content">
          {/* Comment List */}
          <div className="flex flex-col gap-6" id="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 items-start" id={`comment-item-${comment.id}`}>
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="h-9 w-9 rounded-full object-cover bg-slate-50 border border-slate-200 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-slate-800 dark:text-white">
                      {comment.authorName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {comment.date}
                    </span>
                  </div>
                  <p className="mt-2 font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Native Comment Form */}
          <form onSubmit={handleNativeSubmit} className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800" id="add-comment-form">
            <h4 className="font-sans text-sm font-bold text-slate-800 dark:text-white mb-4">
              Leave a native comment
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g., Marco Rossi"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
                  id="comment-author-input"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Comment
                </label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts on this travel guide..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
                  id="comment-text-input"
                />
              </div>

              {nativeError && (
                <p className="text-xs text-rose-500 font-medium" id="comment-form-error">
                  {nativeError}
                </p>
              )}

              <div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-400 cursor-pointer"
                  id="comment-submit-btn"
                >
                  Submit Native Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
