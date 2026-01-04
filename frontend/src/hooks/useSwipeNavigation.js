import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for swipe navigation with touch and keyboard support
 * @param {Object} options - Configuration options
 * @returns {Object} - Swipe state and handlers
 */
export function useSwipeNavigation({
  totalItems,
  onSwipeRight,
  onSwipeLeft,
  minSwipeDistance = 50,
  enabled = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const containerRef = useRef(null);

  const isAtEnd = currentIndex >= totalItems;
  const isAtStart = currentIndex === 0;

  // Navigate to next item (swipe left / skip)
  const goNext = useCallback(() => {
    if (isAtEnd || !enabled) return;
    
    setSwipeDirection('left');
    onSwipeLeft?.();
    
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, totalItems));
      setSwipeDirection(null);
      setDragOffset(0);
    }, 300);
  }, [isAtEnd, enabled, totalItems, onSwipeLeft]);

  // Navigate to previous item (swipe right / shortlist)
  const goPrev = useCallback(() => {
    if (isAtEnd || !enabled) return;
    
    setSwipeDirection('right');
    onSwipeRight?.();
    
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, totalItems));
      setSwipeDirection(null);
      setDragOffset(0);
    }, 300);
  }, [isAtEnd, enabled, totalItems, onSwipeRight]);

  // Reset to beginning
  const reset = useCallback(() => {
    setCurrentIndex(0);
    setSwipeDirection(null);
    setDragOffset(0);
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback((e) => {
    if (!enabled || isAtEnd) return;
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  }, [enabled, isAtEnd]);

  const handleTouchMove = useCallback((e) => {
    if (!enabled || isAtEnd || !touchStartRef.current) return;
    touchEndRef.current = e.targetTouches[0].clientX;
    const offset = touchEndRef.current - touchStartRef.current;
    setDragOffset(offset);
  }, [enabled, isAtEnd]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || isAtEnd) return;
    setIsDragging(false);
    
    if (!touchStartRef.current || !touchEndRef.current) {
      setDragOffset(0);
      return;
    }
    
    const distance = touchStartRef.current - touchEndRef.current;
    
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goNext(); // Swipe left - skip
      } else {
        goPrev(); // Swipe right - shortlist
      }
    } else {
      setDragOffset(0);
    }
    
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [enabled, isAtEnd, minSwipeDistance, goNext, goPrev]);

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback((e) => {
    if (!enabled || isAtEnd) return;
    touchEndRef.current = null;
    touchStartRef.current = e.clientX;
    setIsDragging(true);
  }, [enabled, isAtEnd]);

  const handleMouseMove = useCallback((e) => {
    if (!enabled || isAtEnd || !isDragging || !touchStartRef.current) return;
    touchEndRef.current = e.clientX;
    const offset = touchEndRef.current - touchStartRef.current;
    setDragOffset(offset);
  }, [enabled, isAtEnd, isDragging]);

  const handleMouseUp = useCallback(() => {
    handleTouchEnd();
  }, [handleTouchEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleTouchEnd();
    }
  }, [isDragging, handleTouchEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!enabled || isAtEnd) return;
      
      // Only handle if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goPrev();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          goPrev(); // Shortlist on enter/space
          break;
        case 'Escape':
          e.preventDefault();
          goNext(); // Skip on escape
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isAtEnd, goNext, goPrev]);

  return {
    currentIndex,
    swipeDirection,
    isDragging,
    dragOffset,
    isAtEnd,
    isAtStart,
    containerRef,
    goNext,
    goPrev,
    reset,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}

export default useSwipeNavigation;

