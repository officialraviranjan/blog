import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, Clock, Compass } from 'lucide-react';
import { samplePosts } from '../data/posts';
import { Post } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (post: Post) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectPost }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = samplePosts.filter((post) => {
      if (post.draft) return false;
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.categories.some((cat) => cat.toLowerCase().includes(lowerQuery)) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });

    setResults(filtered);
  }, [query]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-[10vh] backdrop-blur-xs animate-in fade-in duration-200"
      id="search-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-top-4 duration-300"
        id="search-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800" id="search-input-wrapper">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search articles, categories, or tags..."
            className="flex-1 font-sans text-base text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
            id="search-input-field"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Pane */}
        <div className="max-h-[60vh] overflow-y-auto p-4" id="search-results-pane">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" id="search-placeholder">
              <Compass className="h-10 w-10 text-slate-300 dark:text-slate-700 animate-spin-slow" />
              <p className="mt-2 font-sans text-sm text-slate-500 dark:text-slate-400">
                Search for topics like <span className="font-semibold text-blue-600 dark:text-cyan-400">Amalfi Coast</span>, <span className="font-semibold text-blue-600 dark:text-cyan-400">Paris gems</span>, <span className="font-semibold text-blue-600 dark:text-cyan-400">Train travel</span>...
              </p>
              <p className="mt-1 font-mono text-xs text-slate-400">
                Press <kbd className="rounded bg-slate-100 px-1 py-0.5 text-[10px] dark:bg-slate-800">ESC</kbd> to exit.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center" id="search-no-results">
              <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
                No articles match your query "<span className="font-semibold">{query}</span>".
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Try searching with different keywords.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2" id="search-results-list">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Found {results.length} results
              </p>
              {results.map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post);
                    onClose();
                  }}
                  className="flex flex-col items-start rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 w-full"
                  id={`search-item-${post.slug}`}
                >
                  <div className="flex items-center gap-2">
                    {post.categories.map((cat) => (
                      <span key={cat} className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-slate-800 dark:text-cyan-400">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h4 className="mt-1 font-sans text-sm font-bold text-slate-900 dark:text-white">
                    {post.title}
                  </h4>
                  <p className="mt-0.5 font-sans text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {post.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] font-medium text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
