import React from 'react';
import { MapPin, ArrowRight, Users, Navigation } from 'lucide-react';

const NearbyLawyers = ({
  lawyers = [],
  searchedLocation = '',
  onLawyerSelect,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
      {/* Empty State Illustration */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Navigation size={40} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-display font-semibold text-slate-800 mb-2">
          No Lawyers Found
          {searchedLocation && (
            <span className="block text-base font-normal text-slate-500 mt-1">
              in {searchedLocation}
            </span>
          )}
        </h3>
        <p className="text-slate-600 max-w-md mx-auto">
          We couldn't find lawyers matching your current filters.
          {lawyers.length > 0 && ' Here are some nearby specialists who may be able to help.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
          aria-label="Reset all filters"
        >
          Clear Filters
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Nearby Lawyers */}
      {lawyers.length > 0 && (
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-center gap-2 text-slate-600 mb-4">
            <Users size={18} />
            <h4 className="font-semibold">Nearby Specialists</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lawyers.slice(0, 6).map((lawyer) => (
              <button
                key={lawyer.id}
                onClick={() => onLawyerSelect?.(lawyer)}
                className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all text-left group"
                aria-label={`View ${lawyer.name}'s profile`}
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: lawyer.avatarColor || '#0070c7' }}
                >
                  {lawyer.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                    {lawyer.name}
                  </h5>
                  <p className="text-sm text-slate-600 truncate">{lawyer.firm}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin size={12} />
                    <span>{lawyer.location}, {lawyer.state}</span>
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {lawyer.practiceArea}
                  </span>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-primary-600 flex-shrink-0 mt-1 transition-colors"
                />
              </button>
            ))}
          </div>

          {lawyers.length > 6 && (
            <p className="text-sm text-slate-500 mt-4">
              + {lawyers.length - 6} more lawyers available. Reset filters to see all.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyLawyers;

