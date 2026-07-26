import React from 'react';
import { Compass, Github, Twitter, Linkedin } from 'lucide-react';
import { defaultAuthor } from '../data/posts';

interface FooterProps {
  setRoute: (route: string) => void;
}

export default function Footer({ setRoute }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950" id="main-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <button
              onClick={() => setRoute('home')}
              className="flex items-center gap-2 text-left focus:outline-none"
              id="footer-logo"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-cyan-500">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                eurotravels<span className="text-blue-600 dark:text-cyan-400">guide</span>
              </span>
            </button>
            <p className="mt-4 max-w-md font-sans text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              An elegant, lightning-fast travel blog dedicated to helping you discover Europe's hidden cobblestones, authentic culinary delights, and breathtaking slow-travel itineraries at <span className="font-mono text-blue-600 dark:text-cyan-400">eurotravelsguide.eu.org</span>.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Resources
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <button
                  onClick={() => setRoute('home')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('blog')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  All Posts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('archive')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Legal & Support
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <button
                  onClick={() => setRoute('about')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  About the Author
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('contact')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Contact Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('privacy')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute('terms')}
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400"
                >
                  Sitemap XML
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 pt-8 dark:border-slate-800/80">
          <p className="font-sans text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} Sophia Rossi. Built as an optimized React & Astro template. Released under Apache-2.0.
          </p>

          <div className="mt-4 sm:mt-0 flex gap-4">
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
      </div>
    </footer>
  );
}
