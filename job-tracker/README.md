# Trackr - Job & Internship Tracker (MERN)

Full-stack MERN app: register/login/logout, protected routes, add/edit/delete/view/search/filter applications,
statuses (Applied, Interview, Rejected, Offer), animated dashboard, dark + light mode.

## Run locally
1. Install MongoDB (or use a free MongoDB Atlas URI) and start it.
2. Backend:  `cd server && npm install && npm run dev`   (runs on http://localhost:5000)
3. Frontend: `cd client && npm install && npm run dev`   (runs on http://localhost:5173)

Edit `server/.env` (copy of `.env.example`) for your MONGO_URI and JWT_SECRET.

## Structure
- server/  Express API (models, routes, middleware)
- client/  React (Vite) app (pages, components, context)

## Live Demo
- Frontend: https://mern-final-project-day-21-28-phiq.vercel.app
- Backend API: https://mern-final-project-day-21-28.vercel.app