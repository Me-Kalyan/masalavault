'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch {
        // Invalid saved data, show banner again
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 animate-slide-up"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-modal="true"
    >
      <div className="max-w-5xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-5">
        {!showSettings ? (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Cookie size={18} className="sm:w-4 sm:h-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 id="cookie-consent-title" className="text-sm sm:text-base font-bold text-slate-200 mb-1.5 sm:mb-1">
                    Cookie Consent
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-2 sm:mb-0">
                    We use cookies to enhance your experience. By clicking "Accept All", you consent to our use of cookies.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500">
                    <a href="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                      Privacy Policy
                    </a>
                    <span>•</span>
                    <a href="/terms" className="text-orange-400 hover:text-orange-300 underline">
                      Terms of Service
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0 sm:hidden"
                  aria-label="Close cookie consent"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:px-3 sm:py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold text-sm sm:text-xs hover:from-orange-600 hover:to-red-700 transition-all whitespace-nowrap"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:px-3 sm:py-1.5 bg-white/10 text-slate-200 rounded-lg font-semibold text-sm sm:text-xs border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Settings size={16} className="sm:w-3.5 sm:h-3.5" />
                  <span className="sm:hidden">Customize</span>
                </button>
                <button
                  onClick={handleRejectAll}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:px-3 sm:py-1.5 bg-white/5 text-slate-300 rounded-lg font-semibold text-sm sm:text-xs border border-white/10 hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="Close cookie consent"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-200">Cookie Preferences</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close settings"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {/* Necessary Cookies */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200">Necessary</h3>
                    <div className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-medium">
                      Always Active
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Required for website functionality.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200">Analytics</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-4.5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Help us understand visitor interactions.
                  </p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200">Marketing</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-4.5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Personalized ads and campaign tracking.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold text-xs hover:from-orange-600 hover:to-red-700 transition-all"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-3 py-1.5 bg-white/10 text-slate-200 rounded-lg font-semibold text-xs border border-white/20 hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

