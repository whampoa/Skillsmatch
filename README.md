# LegalConnect - Legal Expertise Matching Platform

A production-ready web application for finding and comparing Australian legal professionals. Built with React, Flask, and Leaflet maps.

![LegalConnect](https://img.shields.io/badge/LegalConnect-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-ISC-orange)

## ✨ Features

### Core Functionality
- **Swipe-to-Browse Interface**: Tinder-style card swiping to browse lawyer profiles
- **Interactive Map**: Leaflet map with marker clustering for 1000+ lawyers
- **Smart Filtering**: Filter by practice area, location, experience, rate, and more
- **Shortlist Management**: Save favourite lawyers with localStorage persistence
- **Export Functionality**: Download shortlist as CSV

### Performance & Data
- **Pre-Geocoded Data**: Static lat/lng coordinates - no API calls on page load
- **Marker Clustering**: Optimized for large datasets with viewport filtering
- **Smooth Animations**: Map `flyTo()` animations when browsing lawyers

### Accessibility & Compliance
- **WCAG 2.1 AA**: Full keyboard navigation, aria-labels, colour contrast
- **Legal Disclaimer**: Clear Australian legal compliance messaging
- **External Links**: All external links use `rel="noopener noreferrer"`

### Error Handling
- **Fallback UI**: Placeholder avatars for missing images
- **Zero-Result State**: Shows nearby specialists when no matches found
- **Contact Fallbacks**: mailto: links when website unavailable

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+ (for frontend development)

### Production Mode

```bash
# Clone the repository
git clone https://github.com/whampoa/Skillsmatch
cd Skillsmatch

# Make start script executable
chmod +x start.sh

# Start the application
./start.sh
```

The app will be available at `http://localhost:3000`

### Development Mode

```bash
# Start both backend and frontend dev servers
chmod +x start_dev.sh
./start_dev.sh
```

- Backend API: `http://localhost:3000`
- Frontend Dev: `http://localhost:5173`

## 📁 Project Structure

```
LegalConnect/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── database/
│   │   └── db.py             # SQLite database setup
│   ├── middleware/
│   │   └── auth.py           # JWT authentication
│   └── routes/
│       ├── auth.py           # Auth endpoints
│       ├── lawyers.py        # Lawyer CRUD
│       ├── shortlist.py      # Shortlist management
│       ├── comparison.py     # Comparison features
│       └── history.py        # Search history
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx    # With legal disclaimer
│   │   │   ├── LawyerCard.jsx
│   │   │   ├── LawyerMap.jsx # Leaflet with clustering
│   │   │   ├── SwipeToBrowse.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── ShortlistPanel.jsx
│   │   │   └── NearbyLawyers.jsx
│   │   │
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useShortlist.js
│   │   │   ├── useSwipeNavigation.js
│   │   │   ├── useMapNavigation.js
│   │   │   └── useFilters.js
│   │   │
│   │   ├── data/
│   │   │   └── lawyers.json  # Pre-geocoded lawyer data
│   │   │
│   │   ├── App.jsx           # Main application
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Tailwind CSS
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── start.sh                  # Production start script
├── start_dev.sh              # Development start script
└── README.md
```

## 🎨 UI/UX Features

### Swipe Interface
- Touch and mouse swipe support
- Keyboard navigation (←/→ arrows, Enter, Escape)
- Visual feedback with swipe indicators
- Smooth card stack animations

### Map Features
- Marker clustering for performance
- Custom marker icons with lawyer initials
- Popup cards with quick contact options
- Fly-to animation on lawyer selection
- Map legend and lawyer count

### Responsive Design
- Mobile-first approach
- Split view on desktop
- Full-screen modes available
- Slide-out shortlist panel

## ⚖️ Legal Compliance

### Disclaimer
The footer includes a comprehensive legal disclaimer stating:
- This is a directory service, not legal advice
- Information is for general purposes only
- Users should verify credentials directly
- Always seek appropriate professional advice

### Advertising Rules
- No claims of specialist status without verification
- Clear disclosure of directory nature
- Links to official regulatory bodies (Law Society, MARA)

## 🔧 Configuration

### Environment Variables

Create `backend/.env`:

```env
FLASK_ENV=production
PORT=3000
JWT_SECRET=your-secure-secret-key
```

### Adding New Lawyers

Edit `frontend/src/data/lawyers.json`:

```json
{
  "id": 13,
  "name": "New Lawyer",
  "firm": "Law Firm Name",
  "location": "Sydney",
  "state": "NSW",
  "practiceArea": "Family Law",
  "lat": -33.8688,
  "lng": 151.2093,
  "experienceYears": 10,
  "hourlyRate": 400,
  "verified": true,
  "email": "lawyer@firm.com",
  "phone": "0291234567",
  "website": "https://firm.com",
  "specialties": ["Divorce", "Custody"],
  "avatarColor": "#0070c7"
}
```

## 🛠️ Development

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Backend Commands

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Leaflet](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📄 License

ISC License - see LICENSE file for details.

---

**Built with ❤️ for Australian Legal Professionals**
