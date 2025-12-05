'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Confetti from './Confetti';

type CookRecipe = {
  title: string;
  cuisine?: string;
  time: string;
  difficulty: string;
  instructions: string[];
};

interface CookModeOverlayProps {
  recipe: CookRecipe | null;
  stepIndex: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
  onComplete?: () => void;
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
};

export default function CookModeOverlay({
  recipe,
  stepIndex,
  onStepChange,
  onClose,
  onComplete,
}: CookModeOverlayProps) {
  const [elapsed, setElapsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // timer
  useEffect(() => {
    if (!recipe) return;
    setElapsed(0);
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [recipe]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!recipe) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        onStepChange(stepIndex - 1);
      } else if (e.key === 'ArrowRight' && stepIndex < recipe.instructions.length - 1) {
        onStepChange(stepIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recipe, stepIndex, onStepChange, onClose]);

  const handleComplete = useCallback(() => {
    setShowConfetti(true);
    onComplete?.();
  }, [onComplete]);

  if (!recipe) return null;

  const totalSteps = recipe.instructions.length;
  const canPrev = stepIndex > 0;
  const canNext = stepIndex < totalSteps - 1;
  const isLastStep = stepIndex === totalSteps - 1;
  const progressPercent = ((stepIndex + 1) / totalSteps) * 100;

  const goPrev = () => {
    if (!canPrev) return;
    onStepChange(stepIndex - 1);
  };

  const goNext = () => {
    if (!canNext) return;
    onStepChange(stepIndex + 1);
  };

  return (
    <>
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div
        className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-2xl flex items-center justify-center px-4"
        // swipe gestures on mobile
        onTouchStart={(e) => {
          (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const startX = (e.currentTarget as any)._touchStartX;
          if (startX == null) return;
          const delta = e.changedTouches[0].clientX - startX;
          const threshold = 60;
          if (delta > threshold && canPrev) {
            goPrev();
          } else if (delta < -threshold && canNext) {
            goNext();
          }
        }}
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-white/[0.08] rounded-2xl p-5 md:p-7 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/[0.05] rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all"
          >
            Exit
          </button>
          
          <div className="mb-6 mt-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400/70 mb-1.5 font-medium">
              Cook Mode
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              {recipe.title}
            </h2>
            {recipe.cuisine && (
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em] mb-2">
                {recipe.cuisine}
              </p>
            )}
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-slate-400">
                Step {stepIndex + 1} of {totalSteps}
              </p>
              {/* Step dots */}
              <div className="flex gap-1">
                {recipe.instructions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onStepChange(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === stepIndex
                        ? 'bg-orange-400 scale-150'
                        : i < stepIndex
                        ? 'bg-emerald-500/80'
                        : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center px-4 md:px-8 min-h-[180px] py-8">
            <p className="text-base md:text-xl font-medium text-slate-100 leading-relaxed">
              {recipe.instructions[stepIndex]}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-orange-400">⏱</span>
                {formatDuration(elapsed)}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <span className="hidden sm:inline text-slate-500">
                {recipe.time} • {recipe.difficulty}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                disabled={!canPrev}
                className="px-4 py-2.5 rounded-xl text-[12px] font-medium bg-white/[0.05] border border-white/[0.08] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.08] transition-all"
              >
                Previous
              </button>
              {isLastStep ? (
                <button
                  onClick={handleComplete}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
                >
                  🎉 Complete!
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                >
                  Next step
                </button>
              )}
            </div>
          </div>
          
          {/* Keyboard hint */}
          <p className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-600">
            ← → navigate • Esc exit
          </p>
        </div>
      </div>
    </>
  );
}
