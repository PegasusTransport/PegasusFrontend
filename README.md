# Pegasus Transport Portal

A comprehensive web application for managing taxi/transport bookings with separate interfaces for customers, drivers, and administrators.

## 🚖 Overview

Pegasus Transport Portal is a full-featured transportation management system that enables:
- **Customers** to book rides, manage their bookings, and track their transportation history
- **Drivers** to accept jobs, manage their availability, and track their bookings
- **Administrators** to oversee all bookings, manage drivers, configure pricing, and monitor operations

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Components**: Headless UI, Hero Icons
- **HTTP Client**: Axios
- **Notifications**: Vue Toastification
- **Maps Integration**: Google Maps API

### Key Dependencies
- `@headlessui/vue` - Unstyled, accessible UI components
- `@heroicons/vue` - SVG icon library
- `axios` - HTTP client for API communication
- `lodash-es` - Utility library
- `vue-router` - Client-side routing
- `pinia` - State management

## 📋 Prerequisites

- **Node.js**: ^20.19.0 or >=22.12.0
- **npm**: Latest version recommended
- **Backend API**: Running instance of the Pegasus Transport backend

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pegasus-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the `pegasus-frontend` directory:
```env
VITE_BACKEND_URL=<your-backend-api-url>
VITE_GOOGLEMAPS=<your-google-maps-api-key>
```

### Development

Run the development server with hot-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

Build for production:
```bash
npm run build
```

Type-check, compile and minify:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🏗️ Project Structure

```
pegasus-frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts)
│   ├── components/      # Vue components
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── customer/    # Customer-specific components
│   │   ├── driver/      # Driver-specific components
│   │   ├── reusables/   # Shared/reusable components
│   │   └── sidebars/    # Navigation sidebars
│   ├── endpoints/       # API endpoint definitions
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── autoComplete.ts
│   │   ├── driver.ts
│   │   └── user.ts
│   ├── hooks/           # Custom Vue hooks
│   ├── pages/           # Page components
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Customer/
│   │   └── Driver/
│   ├── plugins/         # Plugin configurations (axios, etc.)
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   ├── types/           # TypeScript type definitions
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Public static files
├── .github/             # GitHub Actions workflows
│   └── workflows/
│       └── main_pegasustransportportal.yml
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── web.config          # IIS configuration
```

## 👥 User Roles

### Customer
- View and book rides
- Manage personal bookings
- Update profile information
- View booking history
- Cancel bookings (24 hours in advance)

### Driver
- View available bookings
- Accept job assignments
- View assigned bookings
- Manage car information
- Update profile and settings
- View route trajectories on Google Maps

### Administrator
- Manage all bookings
- Oversee driver accounts
- Configure pricing settings
- View all travels/trips
- Manage system-wide settings

## 🔐 Authentication Features

- User registration with email verification
- Two-factor authentication (2FA)
- Password reset functionality
- JWT-based authentication with refresh tokens
- Role-based access control
- Guest booking with email confirmation

## 🎯 Key Features

### Booking Management
- Real-time booking creation and updates
- Multi-stop support (pickup, first stop, second stop, drop-off)
- Google Maps integration for address autocomplete
- Route trajectory visualization
- Flight number tracking for airport pickups
- Booking status tracking (Pending, Confirmed, Cancelled, Completed)

### Address Autocomplete
- Google Places API integration
- Session-based autocomplete for cost optimization
- Coordinate retrieval for mapping
- Address validation

### Pricing System
- Dynamic pricing based on:
  - Distance (km)
  - Duration (minutes)
  - Start price
  - Zone pricing
- Admin-configurable pricing settings

### Search and Filtering
- Date range filtering
- Search by various criteria
- Sortable results
- Pagination support

## 🌐 API Integration

The frontend communicates with the backend API using Axios with the following features:

- Automatic token refresh on 401 errors
- Request/response interceptors
- Centralized error handling
- Cookie-based authentication
- Retry logic for failed requests

### API Endpoints Structure

```typescript
// Authentication
POST /api/Auth/Login
POST /api/Auth/Register
POST /api/Auth/RefreshToken
POST /api/Auth/ChangePassword
POST /api/Auth/RequestPasswordReset
POST /api/Auth/ResetPassword

// User
GET  /api/User/GetLoggedInUserData
PUT  /api/User/UpdateUser
POST /api/User/ResendVerificationEmail
POST /api/User/ConfirmEmail

// Booking
GET  /api/Booking/getMyBookings
GET  /api/Booking/GetBookingById/{id}
PUT  /api/Booking/updateBooking
PUT  /api/Booking/CancelBooking/{id}
GET  /api/Booking/confirmBooking

// Driver
GET  /api/Driver/GetAvailableBookings
POST /api/Driver/AcceptJob/{id}

// Admin
GET  /api/Admin/GetAllBookings
GET  /api/Admin/GetAllDrivers
PUT  /api/Admin/UpdatePricing

// Maps
POST /api/Map/AutoComplete
GET  /api/Map/GetLongNLat
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration in `tailwind.config.js`.

### TypeScript
TypeScript configuration is split into:
- `tsconfig.json` - Main configuration
- `tsconfig.app.json` - Application configuration
- `tsconfig.node.json` - Node/Vite configuration

### Vite
Custom Vite configuration includes:
- Vue plugin
- TypeScript support
- Path aliases (@/ → src/)
- Vue DevTools integration (development)
- Tailwind CSS integration

## 🚢 Deployment

### Azure Web App (Production)

The project uses GitHub Actions for CI/CD to Azure Web App:

1. **Build Phase**:
   - Runs on Windows latest
   - Node.js 22.x
   - Installs dependencies
   - Builds the project with environment variables
   - Copies web.config to dist folder

2. **Deploy Phase**:
   - Deploys to Azure Web App
   - App name: PegasusTransportPortal
   - Uses Azure login with service principal

### Environment Variables Required

Set these secrets in GitHub Actions:
- `VITE_BACKEND_URL` - Backend API URL
- `VITE_GOOGLEMAPS` - Google Maps API key
- `AZUREAPPSERVICE_CLIENTID_*` - Azure service principal client ID
- `AZUREAPPSERVICE_TENANTID_*` - Azure tenant ID
- `AZUREAPPSERVICE_SUBSCRIPTIONID_*` - Azure subscription ID

### IIS Configuration

The `web.config` file configures URL rewriting for SPA routing on IIS:
- Serves index.html as default document
- Rewrites all non-file requests to root for client-side routing
- Custom 404 error handling

## 🧪 Development Tools

### Recommended IDE Setup
- **VS Code** with [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension
- Disable Vetur if installed

### Browser Extensions
- **Chrome/Edge/Brave**: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox**: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- Enable Custom Object Formatter in DevTools

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## 🔍 Type Support

TypeScript support for `.vue` files:
- Uses `vue-tsc` for type checking instead of `tsc`
- Volar extension provides TypeScript language service for Vue files
- Full type safety across the application

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tailwind CSS utility classes
- Adaptive layouts for different screen sizes
- Touch-friendly UI components

## 🎨 UI Components

### Reusable Components
- AutoCompleteInput - Address autocomplete with Google Places
- Button - Styled button component
- TextInput - Form input with validation
- CodeInput - 2FA code input
- TimeCounter - Countdown timer
- Modal - Dialog/modal component
- Pagination - Page navigation
- TaxiSpinner - Loading spinner

### Layout Components
- Sidebars for each user role
- Responsive navigation
- Role-based menu items

## 🔒 Security Features

- HTTP-only cookies for authentication
- CSRF protection
- Token refresh mechanism
- Secure password requirements
- Email verification
- Two-factor authentication
- Role-based access control
- Input validation and sanitization

## 📄 License

[Add your license information here]

## 👨‍💻 Contributing

[Add contribution guidelines here]

## 📞 Support

For support and inquiries, visit [https://pegasustransport.se/](https://pegasustransport.se/)

## 🔗 Related Links

- [Company Website](https://pegasustransport.se/)
- [Booking Portal](https://pegasustransport.se/Booking)

---

Built with ❤️ by the Pegasus Transport team
