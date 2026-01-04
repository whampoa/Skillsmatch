import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing lawyer shortlist with localStorage persistence
 * @returns {Object} - Shortlist state and management functions
 */
export function useShortlist() {
  const [shortlist, setShortlist, clearShortlist] = useLocalStorage('legalconnect_shortlist', []);
  const [viewedIds, setViewedIds] = useLocalStorage('legalconnect_viewed', []);

  // Add lawyer to shortlist
  const addToShortlist = useCallback((lawyer) => {
    setShortlist((prev) => {
      // Check if already in shortlist
      if (prev.some((l) => l.id === lawyer.id)) {
        return prev;
      }
      return [...prev, { ...lawyer, shortlistedAt: new Date().toISOString() }];
    });
  }, [setShortlist]);

  // Remove lawyer from shortlist
  const removeFromShortlist = useCallback((lawyerId) => {
    setShortlist((prev) => prev.filter((l) => l.id !== lawyerId));
  }, [setShortlist]);

  // Check if lawyer is in shortlist
  const isShortlisted = useCallback((lawyerId) => {
    return shortlist.some((l) => l.id === lawyerId);
  }, [shortlist]);

  // Mark lawyer as viewed
  const markAsViewed = useCallback((lawyerId) => {
    setViewedIds((prev) => {
      if (prev.includes(lawyerId)) {
        return prev;
      }
      return [...prev, lawyerId];
    });
  }, [setViewedIds]);

  // Check if lawyer has been viewed
  const hasBeenViewed = useCallback((lawyerId) => {
    return viewedIds.includes(lawyerId);
  }, [viewedIds]);

  // Toggle shortlist status
  const toggleShortlist = useCallback((lawyer) => {
    if (isShortlisted(lawyer.id)) {
      removeFromShortlist(lawyer.id);
    } else {
      addToShortlist(lawyer);
    }
  }, [isShortlisted, removeFromShortlist, addToShortlist]);

  // Clear all viewed
  const clearViewed = useCallback(() => {
    setViewedIds([]);
  }, [setViewedIds]);

  // Reset everything
  const resetAll = useCallback(() => {
    clearShortlist();
    clearViewed();
  }, [clearShortlist, clearViewed]);

  // Get shortlist count
  const shortlistCount = useMemo(() => shortlist.length, [shortlist]);

  // Get viewed count
  const viewedCount = useMemo(() => viewedIds.length, [viewedIds]);

  return {
    shortlist,
    viewedIds,
    shortlistCount,
    viewedCount,
    addToShortlist,
    removeFromShortlist,
    isShortlisted,
    markAsViewed,
    hasBeenViewed,
    toggleShortlist,
    clearShortlist,
    clearViewed,
    resetAll,
  };
}

export default useShortlist;

