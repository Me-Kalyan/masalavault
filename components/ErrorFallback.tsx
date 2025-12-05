'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  message?: string;
}

export default function ErrorFallback({ 
  error, 
  resetError, 
  title = 'Something went wrong',
  message 
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center animate-bounce-in">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-200">{title}</h2>
        <p className="text-slate-400 mb-2">
          {message || error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={resetError}
            className="magnetic-button px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white/10 text-slate-300 rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Home size={18} />
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-slate-500 cursor-pointer mb-2">Error Details</summary>
            <pre className="text-xs text-slate-600 bg-black/30 p-4 rounded-lg overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

