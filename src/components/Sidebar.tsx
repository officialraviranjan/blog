import React from 'react';
import { Twitter, Github, Linkedin, Bookmark, Tags, ArrowRight } from 'lucide-react';
import { defaultAuthor, samplePosts } from '../data/posts';

interface SidebarProps {
  onCategoryClick: (category: string) => void;
  onTagClick: (tag: string) => void;
  selectedCategory?: string;
  selectedTag?: string;
}

export default function Sidebar({
  onCategoryClick,
  onTagClick,
  selectedCategory,
  selectedTag,
}: SidebarProps) {
  // Calculate Categories with counts
  const categoriesMap: { [key: string]: number } = {};
  // Calculate Tags with counts
  const tagsMap: { [key: string]: number } = {};

  samplePosts.forEach((post) => {
    if (!post.draft) {
      post.categories.forEach((cat) => {
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });
      post.tags.forEach((tag) => {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      });
    }
  });

  const categories = Object.entries(categoriesMap).map(([name, count]) => ({ name, count }));
  const tags = Object.entries(tagsMap).map(([name, count]) => ({ name, count }));

  return (
    <aside className="flex flex-col gap-8 w-full lg:w-80 shrink-0" id="blog-sidebar">
      {/* Author Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/60" id="sidebar-author-box">
        <div className="flex items-center gap-4">
          <img
            src={defaultAuthor.avatar}
            alt={defaultAuthor.name}
            className="h-14 w-14 rounded-full object-cover border-2 border-blue-100 dark:border-slate-700"
            referrerPolicy="no-referrer"
            id="author-avatar"
          />
          <div>
            <h3 className="font-sans text-base font-bold text-slate-900 dark:text-white" id="author-name">
              {defaultAuthor.name}
            </h3>
            <p className="font-mono text-xs text-blue-600 dark:text-cyan-400">
              Travel Writer & Photographer
            </p>
          </div>
        </div>
        <p className="mt-4 font-sans text-sm text-slate-600 leading-relaxed dark:text-slate-300">
          {defaultAuthor.bio}
        </p>
        <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800" id="author-social-links">
          {defaultAuthor.twitter && (
            <a
              href={defaultAuthor.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-blue-500 transition-colors"
              title="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {defaultAuthor.github && (
            <a
              href={defaultAuthor.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {defaultAuthor.linkedin && (
            <a
              href={defaultAuthor.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-blue-600 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/60" id="sidebar-categories-box">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Bookmark className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="font-sans text-sm font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Categories
          </h3>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <li key={cat.name}>
                <button
                  onClick={() => onCategoryClick(cat.name)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-blue-600 font-semibold text-white dark:bg-cyan-500'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                  id={`cat-btn-${cat.name}`}
                >
                  <span className="flex items-center gap-2">
                    <ArrowRight className={`h-3 w-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    {cat.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-mono font-medium ${
                      isSelected
                        ? 'bg-blue-700 text-white dark:bg-cyan-600'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tags Widget */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/60" id="sidebar-tags-box">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Tags className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="font-sans text-sm font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Popular Tags
          </h3>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" id="tags-cloud">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag.name;
            return (
              <button
                key={tag.name}
                onClick={() => onTagClick(tag.name)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white dark:bg-cyan-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-cyan-400'
                }`}
                id={`tag-btn-${tag.name}`}
              >
                #{tag.name}
                <span className="ml-1 text-[10px] opacity-70">({tag.count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
