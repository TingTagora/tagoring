# Tagoring Admin Panel

A modern admin panel for managing the Tagora job application website. Built with React, Vite, Tailwind CSS, and Firebase.

## Features

- 🔐 Firebase Authentication
- 📊 Dashboard with analytics
- 👥 User management
- 📄 Application management
- 🔍 System logs monitoring
- 🎨 Dark theme UI with Tailwind CSS
- ⚡ Fast development with Vite
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Forms**: React Hook Form + Yup validation
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: React Toastify

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/TingTagora/tagoring.git
   cd tagoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase configuration in the `.env` file:
   - `VITE_FIREBASE_API_KEY` - Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID` - Your Firebase app ID
   - `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID
   - `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:5000)

4. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Enable Firestore Database
   - Add your domain to authorized domains in Authentication settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardLayout.jsx
│   ├── Login.jsx
│   └── PrivateRoute.jsx
├── context/            # React Context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── ApplicationsPage.jsx
│   ├── LogsPage.jsx
│   ├── StatsPage.jsx
│   └── UsersPage.jsx
├── firebase.js         # Firebase configuration
├── App.jsx            # Main App component
└── main.jsx           # Entry point
```

## Environment Variables

All environment variables should be prefixed with `VITE_` to be accessible in the client-side code when using Vite.

## Security

- Never commit `.env` files to version control
- Use `.env.example` to document required environment variables
- All sensitive configuration is handled through environment variables
- Firebase security rules should be properly configured

## Development

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting (if configured)
- **PostCSS** with Tailwind CSS for styling
- **Vite** for fast development and building

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Contact

For questions or support, contact: tingtagora@gmail.com
