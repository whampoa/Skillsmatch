import React, { useEffect, useCallback, useRef } from 'react';
import { Check, ArrowRight, RotateCcw, Heart, MapPin } from 'lucide-react';
import LawyerCard from './LawyerCard';
import { useSwipeNavigation, useShortlist } from '../hooks';

const SwipeToBrowse = ({ lawyers = [], onLawyerChange, initialIndex = 0 }) => {
  const currentIndexRef = useRef(0);
  
  const {
    shortlist,
    viewedIds,
    addToShortlist,
    markAsViewed,
    shortlistCount,
    viewedCount,
    resetAll,
  } = useShortlist();

  const handleSwipeRight = useCallback(() => {
    const currentLawyer = lawyers[currentIndexRef.current];
    if (currentLawyer) {
      addToShortlist(currentLawyer);
      markAsViewed(currentLawyer.id);
    }
  }, [lawyers, addToShortlist, markAsViewed]);

  const handleSwipeLeft = useCallback(() => {
    const currentLawyer = lawyers[currentIndexRef.current];
    if (currentLawyer) {
      markAsViewed(currentLawyer.id);
    }
  }, [lawyers, markAsViewed]);

  const swipeNav = useSwipeNavigation({
    totalItems: lawyers.length,
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
    minSwipeDistance: 50,
    enabled: true,
  });

  const {
    currentIndex,
    swipeDirection,
    isDragging,
    dragOffset,
    isAtEnd,
    goNext,
    goPrev,
    reset,
    handlers,
  } = swipeNav;

  // Keep ref in sync
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const currentLawyer = lawyers[currentIndex];
  const progress = lawyers.length > 0 ? ((currentIndex + 1) / lawyers.length) * 100 : 0;

  // Notify parent when current lawyer changes
  useEffect(() => {
    if (currentLawyer && onLawyerChange) {
      onLawyerChange(currentLawyer);
    }
  }, [currentLawyer, onLawyerChange]);

  // Handle reset
  const handleReset = () => {
    reset();
    resetAll();
  };

  if (lawyers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Lawyers Found</h3>
        <p className="text-slate-600 mb-4">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6 w-full">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">
          Browse Lawyers
        </h2>
        <p className="text-slate-600">
          <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">→</kbd> or swipe right to shortlist
          <span className="mx-2">•</span>
          <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">←</kbd> or swipe left to skip
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Progress</span>
          <span>{Math.min(currentIndex + 1, lawyers.length)} of {lawyers.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
            role="progressbar"
            aria-valuenow={Math.min(currentIndex + 1, lawyers.length)}
            aria-valuemin={0}
            aria-valuemax={lawyers.length}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div
        className="relative w-full h-[560px] mb-6"
        role="region"
        aria-label="Lawyer cards"
        aria-live="polite"
      >
        {!isAtEnd ? (
          <>
            {/* Background cards */}
            {lawyers.slice(currentIndex + 1, currentIndex + 3).map((lawyer, idx) => (
              <div
                key={lawyer.id}
                className="absolute inset-0 bg-white rounded-3xl shadow-xl pointer-events-none"
                style={{
                  transform: `scale(${1 - (idx + 1) * 0.04}) translateY(${(idx + 1) * -12}px)`,
                  opacity: 1 - (idx + 1) * 0.2,
                  zIndex: 10 - idx,
                }}
                aria-hidden="true"
              />
            ))}

            {/* Active card */}
            <div
              {...handlers}
              className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-transform ${
                swipeDirection === 'right' ? 'animate-swipe-right' : ''
              } ${swipeDirection === 'left' ? 'animate-swipe-left' : ''}`}
              style={{
                transform: isDragging
                  ? `translateX(${dragOffset}px) rotate(${dragOffset / 20}deg)`
                  : undefined,
                zIndex: 20,
              }}
              tabIndex={0}
              role="button"
              aria-label={`${currentLawyer?.name}'s profile. Press Enter or Arrow Right to shortlist, Arrow Left or Escape to skip.`}
            >
              <LawyerCard
                lawyer={currentLawyer}
                isActive
                dragOffset={isDragging ? dragOffset : 0}
              />

              {/* Swipe indicators */}
              {isDragging && dragOffset > 30 && (
                <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-500 text-white p-4 rounded-full animate-scale-in">
                  <Heart size={32} fill="white" />
                </div>
              )}
              {isDragging && dragOffset < -30 && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-slate-500 text-white p-4 rounded-full animate-scale-in">
                  <ArrowRight size={32} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Completion Screen */
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-legal-navy rounded-3xl shadow-2xl flex items-center justify-center p-8 text-white text-center animate-fade-in">
            <div>
              <div className="text-7xl mb-6">🎉</div>
              <h2 className="text-3xl font-display font-bold mb-4">All Done!</h2>
              <p className="text-lg mb-8 opacity-90">
                You've reviewed all {lawyers.length} lawyers
              </p>

              <div className="bg-white/20 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold mb-1">{shortlistCount}</div>
                    <div className="text-sm opacity-80 flex items-center justify-center gap-1">
                      <Heart size={14} />
                      Shortlisted
                    </div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1">{viewedCount}</div>
                    <div className="text-sm opacity-80 flex items-center justify-center gap-1">
                      <MapPin size={14} />
                      Viewed
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all mx-auto"
                aria-label="Start over and reset shortlist"
              >
                <RotateCcw size={20} />
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isAtEnd && (
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={goPrev}
            className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-200 focus:ring-4 focus:ring-green-300"
            aria-label="Add to shortlist (shortcut: Right arrow or Enter)"
          >
            <Check size={32} strokeWidth={3} />
          </button>

          <button
            onClick={goNext}
            className="w-16 h-16 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-200 focus:ring-4 focus:ring-slate-300"
            aria-label="Skip to next lawyer (shortcut: Left arrow or Escape)"
          >
            <ArrowRight size={32} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex justify-center gap-8 text-center">
        <div className="flex items-center gap-2">
          <Heart className="text-green-500" size={20} />
          <div>
            <div className="text-xl font-bold text-slate-800">{shortlistCount}</div>
            <div className="text-xs text-slate-600">Shortlisted</div>
          </div>
        </div>
        <div className="w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <MapPin className="text-slate-500" size={20} />
          <div>
            <div className="text-xl font-bold text-slate-800">{viewedCount}</div>
            <div className="text-xs text-slate-600">Viewed</div>
          </div>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="mt-6 text-center text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
        <p>💡 <strong>Keyboard shortcuts:</strong></p>
        <p className="mt-1">
          <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">→</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Enter</kbd> to shortlist
          <span className="mx-2">•</span>
          <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">←</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs">Esc</kbd> to skip
        </p>
      </div>
    </div>
  );
};

export default SwipeToBrowse;

