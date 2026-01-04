import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for filtering lawyers
 * @param {Array} lawyers - Array of all lawyers
 * @returns {Object} - Filtered lawyers and filter controls
 */
export function useFilters(lawyers) {
  const [filters, setFilters] = useState({
    practiceArea: '',
    location: '',
    minExperience: 0,
    maxRate: Infinity,
    verified: false,
    mediationCertified: false,
    language: '',
    searchQuery: '',
  });

  // Update a single filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      practiceArea: '',
      location: '',
      minExperience: 0,
      maxRate: Infinity,
      verified: false,
      mediationCertified: false,
      language: '',
      searchQuery: '',
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.practiceArea !== '' ||
      filters.location !== '' ||
      filters.minExperience > 0 ||
      filters.maxRate !== Infinity ||
      filters.verified === true ||
      filters.mediationCertified === true ||
      filters.language !== '' ||
      filters.searchQuery !== ''
    );
  }, [filters]);

  // Get filtered lawyers
  const filteredLawyers = useMemo(() => {
    if (!lawyers) return [];
    
    return lawyers.filter((lawyer) => {
      // Practice area filter
      if (filters.practiceArea && lawyer.practiceArea !== filters.practiceArea) {
        return false;
      }
      
      // Location filter (suburb)
      if (filters.location && !lawyer.location?.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Experience filter
      if (filters.minExperience > 0 && (lawyer.experienceYears || 0) < filters.minExperience) {
        return false;
      }
      
      // Rate filter
      if (filters.maxRate !== Infinity && (lawyer.hourlyRate || 0) > filters.maxRate) {
        return false;
      }
      
      // Verified filter
      if (filters.verified && !lawyer.verified) {
        return false;
      }
      
      // Mediation certified filter
      if (filters.mediationCertified && !lawyer.mediationCertified) {
        return false;
      }
      
      // Language filter
      if (filters.language && !lawyer.languages?.some(
        (lang) => lang.toLowerCase().includes(filters.language.toLowerCase())
      )) {
        return false;
      }
      
      // Search query filter (name, firm, specialties)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchFields = [
          lawyer.name,
          lawyer.firm,
          lawyer.location,
          ...(lawyer.specialties || []),
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [lawyers, filters]);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    if (!lawyers) return { practiceAreas: [], locations: [], languages: [] };
    
    const practiceAreas = [...new Set(lawyers.map((l) => l.practiceArea).filter(Boolean))];
    const locations = [...new Set(lawyers.map((l) => l.location).filter(Boolean))];
    const languages = [...new Set(lawyers.flatMap((l) => l.languages || []).filter(Boolean))];
    
    return {
      practiceAreas: practiceAreas.sort(),
      locations: locations.sort(),
      languages: languages.sort(),
    };
  }, [lawyers]);

  // Get nearby lawyers when no results
  const getNearbyLawyers = useCallback((targetLocation, limit = 5) => {
    if (!lawyers || !targetLocation) return [];
    
    // Simple distance-based sorting (for nearby suggestions)
    // In production, use actual geo distance calculation
    return lawyers
      .filter((l) => l.location !== targetLocation)
      .slice(0, limit);
  }, [lawyers]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    filteredLawyers,
    filterOptions,
    getNearbyLawyers,
    resultCount: filteredLawyers.length,
    totalCount: lawyers?.length || 0,
  };
}

export default useFilters;

