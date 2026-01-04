import React, { useState, useCallback, useMemo } from 'react';
import {
  Header,
  Footer,
  LawyerMap,
  SwipeToBrowse,
  FilterBar,
  ShortlistPanel,
  NearbyLawyers,
} from './components';
import { useShortlist, useFilters } from './hooks';
import lawyersData from './data/lawyers.json';

function App() {
  // State
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'browse', 'map'

  // Custom hooks
  const {
    shortlist,
    shortlistCount,
    removeFromShortlist,
    clearShortlist,
  } = useShortlist();

  const {
    filters,
    updateFilter,
    resetFilters,
    filteredLawyers,
    filterOptions,
    resultCount,
    totalCount,
    getNearbyLawyers,
  } = useFilters(lawyersData);

  // Handlers
  const handleLawyerChange = useCallback((lawyer) => {
    setSelectedLawyer(lawyer);
  }, []);

  const handleLawyerSelectFromMap = useCallback((lawyer) => {
    setSelectedLawyer(lawyer);
  }, []);

  const handleShortlistClick = useCallback(() => {
    setIsShortlistOpen(true);
  }, []);

  const handleShortlistClose = useCallback(() => {
    setIsShortlistOpen(false);
  }, []);

  const handleMenuClick = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleShortlistLawyerSelect = useCallback((lawyer) => {
    setSelectedLawyer(lawyer);
    setIsShortlistOpen(false);
  }, []);

  // Get nearby lawyers for zero-result state
  const nearbyLawyers = useMemo(() => {
    if (resultCount === 0 && filters.location) {
      return getNearbyLawyers(filters.location, 6);
    }
    return [];
  }, [resultCount, filters.location, getNearbyLawyers]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <Header
        shortlistCount={shortlistCount}
        onShortlistClick={handleShortlistClick}
        onMenuClick={handleMenuClick}
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-legal-navy via-primary-800 to-primary-900 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Find Your Perfect Legal Expert
            </h1>
            <p className="text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto mb-6">
              Browse and compare qualified Australian lawyers. 
              Swipe through profiles, shortlist your favourites, and find the right representation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                ⚖️ Family Law
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                🏠 Conveyancing
              </span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                ✈️ Immigration
              </span>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            resultCount={resultCount}
            totalCount={totalCount}
          />
        </section>

        {/* View Mode Toggle */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setViewMode('split')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'split'
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                aria-pressed={viewMode === 'split'}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('browse')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'browse'
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                aria-pressed={viewMode === 'browse'}
              >
                Browse Cards
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                aria-pressed={viewMode === 'map'}
              >
                Map View
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section
          id="browse"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {resultCount === 0 ? (
            /* Zero Results State */
            <NearbyLawyers
              lawyers={nearbyLawyers.length > 0 ? nearbyLawyers : lawyersData.slice(0, 6)}
              searchedLocation={filters.location}
              onLawyerSelect={handleLawyerSelectFromMap}
              onResetFilters={resetFilters}
            />
          ) : (
            /* Main Content Grid */
            <div
              className={`grid gap-6 ${
                viewMode === 'split'
                  ? 'lg:grid-cols-2'
                  : viewMode === 'browse'
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : 'grid-cols-1'
              }`}
            >
              {/* Swipe Cards */}
              {(viewMode === 'split' || viewMode === 'browse') && (
                <div className={viewMode === 'split' ? 'order-1' : ''}>
                  <SwipeToBrowse
                    lawyers={filteredLawyers}
                    onLawyerChange={handleLawyerChange}
                  />
                </div>
              )}

              {/* Map */}
              {(viewMode === 'split' || viewMode === 'map') && (
                <div
                  id="map"
                  className={`${
                    viewMode === 'split'
                      ? 'order-2 h-[600px] lg:h-[700px]'
                      : 'h-[70vh] min-h-[500px]'
                  }`}
                >
                  <LawyerMap
                    lawyers={filteredLawyers}
                    selectedLawyer={selectedLawyer}
                    onLawyerSelect={handleLawyerSelectFromMap}
                    className="h-full"
                    enableClustering={filteredLawyers.length > 20}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section id="about" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-center text-slate-800 mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  1. Browse & Filter
                </h3>
                <p className="text-slate-600">
                  Search by practice area, location, experience, and more to find lawyers that match your needs.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💚</span>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  2. Swipe & Shortlist
                </h3>
                <p className="text-slate-600">
                  Swipe through profiles. Swipe right to add to your shortlist, left to skip. Your choices are saved automatically.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📞</span>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  3. Connect Directly
                </h3>
                <p className="text-slate-600">
                  Contact your shortlisted lawyers directly via phone, email, or their website. Export your list anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-primary-600 to-legal-navy py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
              <div>
                <div className="text-4xl font-bold mb-1">{lawyersData.length}+</div>
                <div className="text-primary-200">Verified Lawyers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">3</div>
                <div className="text-primary-200">Practice Areas</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">NSW</div>
                <div className="text-primary-200">Coverage</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">100%</div>
                <div className="text-primary-200">Free to Use</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Disclaimer */}
      <Footer />

      {/* Shortlist Panel */}
      <ShortlistPanel
        shortlist={shortlist}
        onRemove={removeFromShortlist}
        onClear={clearShortlist}
        onLawyerSelect={handleShortlistLawyerSelect}
        isOpen={isShortlistOpen}
        onClose={handleShortlistClose}
      />
    </div>
  );
}

export default App;

