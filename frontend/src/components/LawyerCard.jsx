import React from 'react';
import {
  MapPin,
  Briefcase,
  Award,
  TrendingUp,
  CheckCircle,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Languages,
} from 'lucide-react';

// Placeholder image for lawyers without photos
const PlaceholderAvatar = ({ name, color }) => {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';

  return (
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-display font-bold shadow-lg"
      style={{ backgroundColor: color || '#0070c7' }}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

const LawyerCard = ({
  lawyer,
  isActive = false,
  onShortlist,
  onSkip,
  onViewProfile,
  dragOffset = 0,
  showActions = true,
  compact = false,
}) => {
  if (!lawyer) return null;

  const {
    name,
    firm,
    location,
    state,
    practiceArea,
    subSpecialisation,
    specialties = [],
    experienceYears,
    caseCount,
    successRate,
    hourlyRate,
    verified,
    mediationCertified,
    languages = [],
    title,
    bio,
    website,
    email,
    phone,
    image,
    avatarColor,
    maraNumber,
  } = lawyer;

  // Calculate rotation based on drag
  const rotation = dragOffset ? (dragOffset / 20) * -1 : 0;
  const opacity = Math.max(0.3, 1 - Math.abs(dragOffset) / 300);

  const cardStyle = isActive
    ? {
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        opacity,
        zIndex: 20,
      }
    : {};

  const handleContactClick = (e) => {
    e.stopPropagation();
  };

  if (compact) {
    return (
      <article
        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-slate-100"
        role="article"
        aria-label={`Lawyer profile: ${name}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {image ? (
              <img
                src={image}
                alt={`Photo of ${name}`}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <PlaceholderAvatar name={name} color={avatarColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 truncate">{name}</h3>
              {verified && (
                <CheckCircle
                  size={16}
                  className="text-green-600 flex-shrink-0"
                  aria-label="Verified lawyer"
                />
              )}
            </div>
            <p className="text-sm text-slate-600 truncate">{firm}</p>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <MapPin size={14} />
              <span>{location}, {state}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {practiceArea}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      className="bg-white rounded-3xl shadow-2xl overflow-hidden swipe-card"
      style={cardStyle}
      role="article"
      aria-label={`Lawyer profile: ${name}`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-legal-navy to-primary-700 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            {image ? (
              <img
                src={image}
                alt={`Photo of ${name}`}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <PlaceholderAvatar name={name} color={avatarColor} />
            )}
          </div>
          
          <h2 className="text-2xl font-display font-bold mb-1">{name}</h2>
          <p className="text-primary-200 mb-1">{title || 'Legal Professional'}</p>
          <p className="text-white/80 text-sm mb-3">{firm}</p>
          
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              {practiceArea}
            </span>
            {subSpecialisation && subSpecialisation !== 'All' && (
              <span className="px-3 py-1 bg-legal-gold/30 text-legal-gold rounded-full text-xs">
                {subSpecialisation}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
            <MapPin size={18} className="text-primary-600" />
            <span className="font-medium">{location}, {state}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 text-center">
              <Briefcase className="mx-auto mb-2 text-blue-600" size={22} />
              <div className="text-2xl font-bold text-slate-800">{experienceYears}</div>
              <div className="text-xs text-slate-600">Years Experience</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-green-600" size={22} />
              <div className="text-2xl font-bold text-slate-800">{successRate}%</div>
              <div className="text-xs text-slate-600">Success Rate</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 text-center">
              <Award className="mx-auto mb-2 text-purple-600" size={22} />
              <div className="text-2xl font-bold text-slate-800">{caseCount}+</div>
              <div className="text-xs text-slate-600">Cases Handled</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 text-center">
              <span className="text-xl mb-2 block">💰</span>
              <div className="text-2xl font-bold text-slate-800">${hourlyRate}</div>
              <div className="text-xs text-slate-600">Per Hour</div>
            </div>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {verified && (
              <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                <CheckCircle size={14} />
                Verified
              </span>
            )}
            {mediationCertified && (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                🏅 Mediation Certified
              </span>
            )}
            {maraNumber && (
              <span className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                📋 {maraNumber}
              </span>
            )}
          </div>

          {/* Languages */}
          {languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-5">
              <Languages size={16} className="text-slate-500" />
              <span>{languages.join(', ')}</span>
            </div>
          )}

          {/* Bio */}
          {bio && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">About</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Contact Links */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                onClick={handleContactClick}
                aria-label={`Visit ${name}'s website (opens in new tab)`}
              >
                <Globe size={16} />
                Website
                <ExternalLink size={12} />
              </a>
            ) : (
              <a
                href={`mailto:${email}?subject=Enquiry from LegalConnect`}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                onClick={handleContactClick}
                aria-label={`Contact ${firm} via email`}
              >
                <Mail size={16} />
                Contact Firm
              </a>
            )}
            
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                onClick={handleContactClick}
                aria-label={`Call ${phone}`}
              >
                <Phone size={16} />
                Call
              </a>
            )}
            
            {email && (
              <a
                href={`mailto:${email}?subject=Enquiry from LegalConnect`}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                onClick={handleContactClick}
                aria-label={`Email ${email}`}
              >
                <Mail size={16} />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default LawyerCard;

