Tales Echo 🌍📖

A modern travel journal web application built with the MERN stack + TypeScript, featuring secure authentication, image uploads, and a clean dashboard for managing personal travel stories (“tales”).

This project follows production-grade auth patterns, modern React architecture, and strict TypeScript discipline.

Features:
  Authentication (Secure & Modern)
    JWT access tokens (in memory)
    JWT refresh tokens (httpOnly cookies)
    Automatic token refresh on expiry
    Logout invalidates all refresh tokens
    Protected routes (frontend + backend)

  📝 Travel Tales
    Create, edit, delete travel stories
    Upload multiple images per tale
    Toggle favorite stories
    Filter stories by date range
    Search stories by keyword

  🖼 Image Handling
    Multer-based multi-image uploads
    Images stored locally (/uploads) for MVP
    URLs stored in DB
    Image deletion removes both DB reference and file

  🧠 State Management
    Global auth state via Zustand
    Axios interceptors for token handling
    Bootstrap auth on app load

🧱 Tech Stack:
  Frontend
    React 18
    TypeScript
    Vite
    Tailwind CSS
    React Router v6 (Data Router)
    Zustand (state management)
    Axios
    React Day Picker

  Backend
    Node.js
    Express
    TypeScript
    MongoDB + Mongoose
    Zod (validation)
    Multer (file uploads)
    JWT (auth)


🔐 Authentication Flow (Summary)
User logs in
  Backend returns:
    accessToken (response body)
    refreshToken (httpOnly cookie)
  Frontend:
    Stores access token in memory (Zustand)
  On 401:
    Axios interceptor calls /auth/refresh
    New access token is issued
Logout:
  Refresh token invalidated
  Access token cleared
❌ No tokens in localStorage
✅ Cookie-based refresh flow
✅ Secure by default