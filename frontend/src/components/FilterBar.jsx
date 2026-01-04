import React, { useState } from 'react';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle,
  Award,
} from 'lucide-react';

const FilterBar = ({
  filters,
  filterOptions,
  onFilterChange,
  onReset,
  resultCount,
  totalCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = 
    filters.practiceArea ||
    filters.location ||
    filters.minExperience > 0 ||
    filters.maxRate < 1000 ||
    filters.verified ||
    filters.mediationCertified ||
    filters.language ||
    filters.searchQuery;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Search and Quick Filters */}
      <div className="p-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, firm, or specialty..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            aria-label="Search lawyers by name, firm, or specialty"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Practice Area */}
          <div className="relative">
            <select
              value={filters.practiceArea}
              onChange={(e) => onFilterChange('practiceArea', e.target.value)}
              className="appearance-none px-4 py-2 pr-8 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              aria-label="Filter by practice area"
            >
              <option value="">All Practice Areas</option>
              {filterOptions.practiceAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="appearance-none px-4 py-2 pr-8 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              aria-label="Filter by location"
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>

          {/* Verified Toggle */}
          <button
            onClick={() => onFilterChange('verified', !filters.verified)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.verified
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
            aria-pressed={filters.verified}
            aria-label="Filter verified lawyers only"
          >
            <CheckCircle size={14} />
            Verified
          </button>

          {/* Mediation Certified Toggle */}
          <button
            onClick={() => onFilterChange('mediationCertified', !filters.mediationCertified)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.mediationCertified
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
            aria-pressed={filters.mediationCertified}
            aria-label="Filter mediation certified lawyers only"
          >
            <Award size={14} />
            Mediation
          </button>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            aria-expanded={isExpanded}
            aria-label="Show more filters"
          >
            <Filter size={14} />
            More
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <strong className="text-slate-800">{resultCount}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong> lawyers
          </p>
          
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
              aria-label="Reset all filters"
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Minimum Experience */}
            <div>
              <label
                htmlFor="minExperience"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Minimum Experience: {filters.minExperience} years
              </label>
              <input
                type="range"
                id="minExperience"
                min="0"
                max="30"
                step="1"
                value={filters.minExperience}
                onChange={(e) => onFilterChange('minExperience', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                aria-label="Filter by minimum experience years"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0 years</span>
                <span>30+ years</span>
              </div>
            </div>

            {/* Maximum Rate */}
            <div>
              <label
                htmlFor="maxRate"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Maximum Rate: ${filters.maxRate >= 1000 ? '1000+' : filters.maxRate}/hour
              </label>
              <input
                type="range"
                id="maxRate"
                min="100"
                max="1000"
                step="50"
                value={Math.min(filters.maxRate, 1000)}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onFilterChange('maxRate', val >= 1000 ? Infinity : val);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                aria-label="Filter by maximum hourly rate"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>$100</span>
                <span>$1000+</span>
              </div>
            </div>

            {/* Language */}
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={filters.language}
                  onChange={(e) => onFilterChange('language', e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-8 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Filter by language spoken"
                >
                  <option value="">Any Language</option>
                  {filterOptions.languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

