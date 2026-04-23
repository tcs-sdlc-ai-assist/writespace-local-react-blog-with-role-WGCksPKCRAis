# Changelog

All notable changes to the **WriteSpace** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added

#### Public Landing Page (SCRUM-7446)
- Public-facing landing page showcasing the platform's purpose and features
- Navigation header with links to login and register pages
- Responsive hero section with call-to-action buttons
- Featured blog posts section visible to unauthenticated visitors

#### Authentication & Role-Based Access Control (SCRUM-7447)
- User registration with username, email, and password
- Login form with credential validation
- Role-based access control supporting `admin` and `author` roles
- Protected routes that redirect unauthenticated users to the login page
- localStorage persistence for user session data across browser refreshes
- Logout functionality that clears session and redirects to the landing page

#### Blog CRUD & Admin Dashboard (SCRUM-7448)
- Full blog post management: create, read, update, and delete operations
- Rich blog post form with title, content, and excerpt fields
- Individual blog post detail view accessible via dynamic routing
- Admin dashboard with platform statistics and overview metrics
- User management panel for administrators to view and manage registered users
- Role-based UI rendering — admin-only features hidden from non-admin users

#### UI & Deployment
- Fully responsive UI built with Tailwind CSS utility classes
- Mobile-first design with responsive breakpoints (sm, md, lg, xl)
- Consistent component styling with hover and focus states
- Client-side routing with React Router for seamless navigation
- Optimized production build configured for Vercel deployment
- Environment-ready configuration using Vite and `import.meta.env`