import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  key?: React.Key;
  post: Post;
  onClick: () => void;
  onCategoryClick: (category: string, e: React.MouseEvent) => void;
}

export default function PostCard({ post, onClick, onCategoryClick }: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900"
      id={`post-card-${post.slug}`}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={post.cover}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          id={`post-card-img-${post.slug}`}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1" id="card-categories">
          {post.categories.map((cat) => (
            <button
              key={cat}
              onClick={(e) => onCategoryClick(cat, e)}
              className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-xs hover:bg-blue-600 hover:text-white dark:bg-slate-900/90 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
              id={`cat-badge-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Metadata Row */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 dark:text-slate-500 mb-3" id="card-metadata">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors line-clamp-2" id="card-title">
          {post.title}
        </h3>

        {/* Description */}
        <p className="mt-2 font-sans text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed flex-1">
          {post.description}
        </p>

        {/* Author & Read More Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 dark:border-slate-800/60" id="card-footer">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-7 w-7 rounded-full object-cover"
              referrerPolicy="no-referrer"
              id="card-author-avatar"
            />
            <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
              {post.author.name}
            </span>
          </div>

          <span className="flex items-center gap-1 font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:gap-2 transition-all">
            Read Post
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
