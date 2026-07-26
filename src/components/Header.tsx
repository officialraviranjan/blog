import React, { useState } from 'react';
import { Sun, Moon, Search, Menu, X, Compass } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  openSearch: () => void;
}

export default function Header({
  currentRoute,
  setRoute,
  darkMode,
  setDarkMode,
  openSearch,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Blog', value: 'blog' },
    { label: 'Archive', value: 'archive' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/80" id="main-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setRoute('home')}
          className="flex items-center gap-2 text-left focus:outline-none"
          id="logo-button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              eurotravels<span className="text-blue-600 dark:text-cyan-400">guide</span>
            </span>
            <span className="block text-[10px] font-mono leading-none tracking-widest text-slate-400 lowercase">
              eurotravelsguide.eu.org
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" id="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setRoute(item.value)}
              className={`font-sans text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-cyan-400 focus:outline-none ${
                currentRoute === item.value || (item.value === 'blog' && currentRoute.startsWith('blog/'))
                  ? 'text-blue-600 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              id={`nav-${item.value}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-4" id="utility-actions">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
            title="Search posts (Ctrl+K)"
            id="search-trigger-btn"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
            title="Toggle theme"
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-4 duration-200" id="mobile-menu">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setRoute(item.value);
                  setMobileMenuOpen(false);
                }}
                className={`text-left font-sans text-base font-semibold py-1.5 transition-colors ${
                  currentRoute === item.value || (item.value === 'blog' && currentRoute.startsWith('blog/'))
                    ? 'text-blue-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
                id={`mobile-nav-${item.value}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
