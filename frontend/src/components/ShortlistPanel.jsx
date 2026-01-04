import React, { useState } from 'react';
import {
  Heart,
  X,
  Trash2,
  Download,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Globe,
} from 'lucide-react';

const ShortlistPanel = ({
  shortlist = [],
  onRemove,
  onClear,
  onLawyerSelect,
  isOpen,
  onClose,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    if (shortlist.length === 0) return;
    setIsExporting(true);

    const headers = ['Name', 'Firm', 'Practice Area', 'Location', 'Experience', 'Rate', 'Phone', 'Email', 'Website'];
    const rows = shortlist.map((lawyer) => [
      lawyer.name,
      lawyer.firm,
      lawyer.practiceArea,
      `${lawyer.location}, ${lawyer.state}`,
      `${lawyer.experienceYears} years`,
      `$${lawyer.hourlyRate}/hour`,
      lawyer.phone || '',
      lawyer.email || '',
      lawyer.website || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `legalconnect-shortlist-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed lg:relative right-0 top-0 h-full bg-white shadow-2xl lg:shadow-lg z-50 transition-transform duration-300 w-full max-w-md lg:max-w-sm flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        role="complementary"
        aria-label="Shortlisted lawyers"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Heart className="text-primary-600" size={22} fill="currentColor" />
            <h2 className="font-display text-xl font-semibold text-slate-800">
              Shortlist
            </h2>
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              {shortlist.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {shortlist.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  disabled={isExporting}
                  className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Export shortlist as CSV"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={onClear}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Clear all shortlisted lawyers"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
              aria-label="Close shortlist panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {shortlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Heart size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Lawyers Shortlisted
              </h3>
              <p className="text-slate-500 text-sm">
                Swipe right or tap the ✓ button to add lawyers to your shortlist.
              </p>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {shortlist.map((lawyer) => (
                <li
                  key={lawyer.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: lawyer.avatarColor || '#0070c7' }}
                    >
                      {lawyer.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {lawyer.name}
                      </h3>
                      <p className="text-sm text-slate-600 truncate">{lawyer.firm}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin size={12} />
                        <span>{lawyer.location}, {lawyer.state}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                        {lawyer.practiceArea}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => onLawyerSelect?.(lawyer)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        aria-label={`View ${lawyer.name} on map`}
                      >
                        <ChevronRight size={18} />
                      </button>
                      <button
                        onClick={() => onRemove(lawyer.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Remove ${lawyer.name} from shortlist`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Contact Row */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                    {lawyer.website ? (
                      <a
                        href={lawyer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-white text-primary-600 border border-primary-200 rounded text-xs font-medium hover:bg-primary-50 transition-colors"
                        aria-label={`Visit ${lawyer.name}'s website (opens in new tab)`}
                      >
                        <Globe size={12} />
                        Website
                        <ExternalLink size={10} />
                      </a>
                    ) : lawyer.email ? (
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="flex items-center gap-1 px-2 py-1 bg-white text-primary-600 border border-primary-200 rounded text-xs font-medium hover:bg-primary-50 transition-colors"
                        aria-label={`Email ${lawyer.firm}`}
                      >
                        <Mail size={12} />
                        Contact Firm
                      </a>
                    ) : null}

                    {lawyer.phone && (
                      <a
                        href={`tel:${lawyer.phone}`}
                        className="flex items-center gap-1 px-2 py-1 bg-white text-slate-600 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                        aria-label={`Call ${lawyer.phone}`}
                      >
                        <Phone size={12} />
                        Call
                      </a>
                    )}

                    {lawyer.email && lawyer.website && (
                      <a
                        href={`mailto:${lawyer.email}`}
                        className="flex items-center gap-1 px-2 py-1 bg-white text-slate-600 border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors"
                        aria-label={`Email ${lawyer.email}`}
                      >
                        <Mail size={12} />
                        Email
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {shortlist.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
              aria-label="Export shortlist"
            >
              <Download size={18} />
              {isExporting ? 'Exporting...' : 'Export Shortlist'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ShortlistPanel;

