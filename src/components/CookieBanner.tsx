import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export const COOKIE_CONSENT_KEY = 'cookie-consent';

export function getCookieConsent(): 'accepted' | 'declined' | null {
  if (typeof window === 'undefined') return null;
  const val = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (val === 'accepted' || val === 'declined') return val;
  return null;
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => getCookieConsent());
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Show banner only if no stored consent choice exists
    if (consent === null) {
      const timer = setTimeout(() => setIsVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [consent]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setIsVisible(false);

    if (typeof window !== 'undefined') {
      const w = window as any;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.requestNonPersonalizedAds = 0;
      window.dispatchEvent(new Event('cookie-consent-updated'));
    }
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setConsent('declined');
    setIsVisible(false);

    if (typeof window !== 'undefined') {
      const w = window as any;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.requestNonPersonalizedAds = 1;
      window.dispatchEvent(new Event('cookie-consent-updated'));
    }
  };

  if (!isVisible && consent !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent Banner"
      className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
      }`}
      id="cookie-consent-banner"
    >
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100">
        <div className="flex items-start gap-3.5">
          {/* SVG Cookie Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-cyan-400">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white">
              We value your privacy
            </h3>
            <p className="mt-1 font-sans text-xs text-slate-600 leading-relaxed dark:text-slate-300">
              We use cookies to improve your experience and show relevant ads. By clicking Accept, you agree to our use of cookies and data handling. Learn more in our{' '}
              <Link
                to="/privacy"
                className="font-medium text-blue-600 underline hover:text-blue-500 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Privacy Policy
              </Link>.
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-xs hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-400 cursor-pointer transition-colors"
                id="cookie-accept-btn"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 cursor-pointer transition-colors"
                id="cookie-decline-btn"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
