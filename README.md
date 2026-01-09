# iPrescribe Admin Dashboard

A modern, responsive admin dashboard application for managing healthcare prescriptions, consultations, and patient data. Built with React, Vite, and Tailwind CSS.

## Features

- 🔐 **Authentication System** - Secure login with JWT token-based authentication
- 📊 **Interactive Dashboard** - Comprehensive analytics with charts and statistics
- 👥 **Patient Management** - View and manage patient records with sortable tables
- 📈 **Data Visualization** - Multiple chart types (Line, Bar, Pie) using Recharts
- 📱 **Responsive Design** - Fully responsive layout for desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean interface built with Material-UI and Tailwind CSS
- 🔒 **Protected Routes** - Route protection with authentication checks
- 📅 **Date Range Filtering** - Filter dashboard data by date ranges
- 🎯 **Dynamic Icons** - Custom SVG icon system with dynamic color theming
- 🔔 **Notifications** - Notification system for user feedback
- 👤 **User Profile** - User profile display with role-based information

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: 
  - Tailwind CSS 4.1.18
  - Material-UI 7.3.6
  - Emotion (CSS-in-JS)
- **State Management**: Zustand (with persistence) - Note: Ensure Zustand is installed via `npm install zustand`
- **Routing**: React Router DOM 7.11.0
- **Charts**: Recharts 3.6.0
- **HTTP Client**: Fetch API
- **Icons**: Custom SVG icon system with dynamic theming

## Project Structure

```
iPrescribe/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and SVG icons
│   ├── components/        # Reusable components
│   │   ├── DynamicIcon.jsx    # Dynamic SVG icon component with theming
│   │   ├── Icon.jsx           # Icon mapping and exports
│   │   ├── Navbar.jsx         # Top navigation bar with user profile
│   │   ├── Notification.jsx   # Notification component
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   └── Sidebar/           # Sidebar navigation
│   │       ├── Sidebar.jsx
│   │       └── SidebarItem.jsx
│   ├── layouts/           # Layout components
│   │   ├── AuthLayout.jsx     # Authentication page layout
│   │   └── DashboardLayout.jsx   # Dashboard page layout
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx      # Main dashboard with analytics
│   │   ├── Home.jsx           # Landing page with waitlist
│   │   ├── Login.jsx          # Login page
│   │   └── NotFound.jsx       # 404 error page
│   ├── services/          # API services
│   │   ├── api.js            # Base API client with auth
│   │   ├── auth.js           # Authentication services
│   │   └── dashboard.js      # Dashboard data services
│   ├── store/             # State management
│   │   └── authStore.js      # Zustand auth store with persistence
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   ├── theme.js           # Material-UI theme configuration
│   ├── App.css            # Global app styles
│   └── index.css          # Base styles
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iPrescribe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### API Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const BASE_URL = 'https://stagingapi.iprescribe.online/api/v1';
```

Update this value to point to your API endpoint.

## Features Overview

### Authentication

- JWT token-based authentication
- Persistent login state using localStorage
- Protected routes that redirect to login if not authenticated
- User profile display with role information

### Dashboard

The dashboard provides comprehensive analytics and data visualization:

- **Summary Cards**: Key metrics including:
  - Total Patients
  - Total Doctors
  - Pending Reviews
  - Total Consultations
  - Prescriptions Issued
  - Percentage changes with trend indicators

- **Charts**:
  - Consultation Over Time (Line Chart) - Shows consultation trends over selected date range
  - Prescription Volume Trend (Line Chart) - Displays prescription issuance patterns
  - Active Doctors vs Active Patients (Bar Chart) - Comparative analysis of active users
  - Top Specialties in Demand (Pie Chart) - Distribution of medical specialties

- **Recent Patients Table**: 
  - Sortable columns for easy data organization
  - Patient information display with status indicators
  - Date range filtering for time-based analysis
  - Responsive table design

- **Date Range Picker**: 
  - Filter all dashboard data by custom date ranges
  - Quick preset options (Last 7 days, Last 30 days, etc.)
  - Real-time data updates based on selected range

### Home Page

- Landing page with hero section
- Waitlist signup functionality with email validation
- Responsive navigation with mobile menu
- Social media links (WhatsApp, YouTube, Facebook)
- App store links (Play Store, App Store)
- Smooth scrolling navigation

## Available Scripts

- `npm run dev` - Start development server (runs on `http://localhost:5173`)
- `npm run build` - Build for production (outputs to `dist` directory)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Environment Setup

Currently, the application uses a hardcoded API URL in `src/services/api.js`. For production, consider using environment variables:

1. Create a `.env` file in the root directory
2. Add your API URL:
```
VITE_API_BASE_URL=https://api.iprescribe.online/api/v1
```

3. Update `src/services/api.js` to use the environment variable:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stagingapi.iprescribe.online/api/v1';
```

### API Endpoints

The application uses the following API endpoints:

- **Authentication**: `/auth/login`
- **Dashboard Stats**: `/admin/dashboard/stats`
- **Consultations**: `/admin/dashboard/consultations`
- **Prescriptions**: `/admin/dashboard/prescriptions`
- **Active Users**: `/admin/dashboard/active`
- **Patients**: `/admin/patients`
- **Specialties**: `/admin/dashboard/specialties`

All endpoints support optional `start_date` and `end_date` query parameters for date filtering.

## State Management

The application uses Zustand for state management with persistence:

- **Auth Store** (`src/store/authStore.js`): 
  - Manages authentication state, user data, and tokens
  - Provides login, logout, and initialization methods
  - State is persisted to localStorage for session persistence
  - Automatically syncs with localStorage for token and user data

**Note**: Make sure to install Zustand if not already installed:
```bash
npm install zustand
```

## Routing

The application uses React Router for navigation:

- `/` - Home page (public)
- `/login` - Login page (public, wrapped in AuthLayout)
- `/dashboard` - Dashboard (protected route, requires authentication)
- `*` - 404 Not Found page

### Sidebar Navigation

The sidebar includes navigation items for:
- **Main Menu**: Dashboard, User Management, Consult. & Presp, Pharm. & Orders Mgt, Payments
- **Admin Menu**: Settings, Roles & Permission, Activity Log, Blog/Health Tips, Notifications Mgt., Website Updates

*Note: Most sidebar routes are placeholders and will be implemented in future updates.*

## Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Material-UI**: Component library for complex UI elements (tables, cards, buttons, etc.)
- **Emotion**: CSS-in-JS solution for dynamic styling and Material-UI integration
- **Custom Components**: Dynamic icon system with SVG theming support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@iprescribe.online or open an issue in the repository.

## Components Overview

### Core Components

- **DynamicIcon**: Handles SVG icons with dynamic color theming based on active state
- **Icon**: Centralized icon mapping system for all SVG assets
- **Navbar**: Top navigation with user profile, notifications, and logout functionality
- **Sidebar**: Collapsible sidebar navigation with Main Menu and Admin Menu sections
- **ProtectedRoute**: HOC that protects routes requiring authentication
- **Notification**: Toast-style notification component for user feedback

### Layouts

- **AuthLayout**: Wrapper for authentication pages (Login)
- **DashboardLayout**: Main layout for authenticated pages with Navbar and Sidebar

## Acknowledgments

- Material-UI for the component library
- Recharts for chart visualization
- Tailwind CSS for styling utilities
- Zustand for lightweight state management
- React team for the amazing framework
- Vite for the fast build tooling
