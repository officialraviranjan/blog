import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl md:p-10"
      id="newsletter-container"
    >
      {/* Decorative Orbs */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-md">
          <span className="font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            Newsletter
          </span>
          <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight md:text-3xl">
            Stay updated with European travel guides
          </h3>
          <p className="mt-2 font-sans text-sm text-slate-300 leading-relaxed">
            Get premium travel guides, hidden culinary gems, and curated itineraries across Europe delivered directly to your inbox. No spam, ever.
          </p>
        </div>

        <div className="w-full md:max-w-sm shrink-0">
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle className="h-10 w-10 text-cyan-400" />
              <h4 className="mt-2 font-sans font-bold text-lg">You are on the list!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Thank you for subscribing to eurotravelsguide.eu.org.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-white/10 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  id="newsletter-email-input"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold hover:bg-blue-500 transition-colors cursor-pointer flex items-center gap-1.5"
                  id="newsletter-submit-btn"
                >
                  <Send className="h-3.5 w-3.5" />
                  Subscribe
                </button>
              </div>
              {error && (
                <p className="text-xs text-rose-400 font-medium px-1" id="newsletter-error">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
