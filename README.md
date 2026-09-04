# CITY Hospital Management System (HMS)

Full-stack Hospital Management System with a React + Vite frontend and an Express + MongoDB (Mongoose) backend.

## Project Structure

```
Project/
├── src/                 # React frontend (Vite)
│   ├── api/             # API client & endpoint wrappers
│   ├── components/      # Public sections + role-based portals
│   └── data/            # Initial demo/mock data (also used to seed DB)
├── server/              # Express + Mongoose backend
│   └── src/
│       ├── config/      # DB connection
│       ├── middleware/  # JWT auth (protect / authorize)
│       ├── models/      # Mongoose schemas
│       └── routes/      # REST endpoints
└── vite.config.js       # Proxies /api -> http://localhost:5000
```

## Requirements

- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## Setup

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server
npm install
```

The server reads `server/.env` (already provided). Defaults:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/city_hospital
JWT_SECRET=city_hospital_dev_secret_change_me
JWT_EXPIRES_IN=7d
```

## Seed the Database

Populates users, staff, patients, rooms, expenses, reports, complaints, notices,
bills, appointments, prescriptions, leaves, catalogs, room-change requests,
requisitions and doctor schedules with realistic demo data:

```bash
cd server
npm run seed
```

## Run

```bash
# Terminal 1 – Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 – Frontend (http://localhost:5173)
npm run dev
```

Open http://localhost:5173.

## Demo Login Credentials

| Role        | User ID  | Password  |
|-------------|----------|-----------|
| Admin       | ADM-001  | admin123  |
| Receptionist| STF-201  | rec123    |
| Nurse       | NUR-01   | nurse123  |
| Doctor      | DOC-101  | doc123    |
| Patient     | PAT-1001 | pat123    |

Credentials are pre-filled in the login modal based on the selected role.

## Feature Overview

- **Public site**: home/about with live stats, services & rooms, reviews (5-star).
- **Admin Portal**: budget & expenses, staff management & salaries, patient
  notices, complaint box, and leave + equipment requisition approvals.
- **Receptionist Portal**: staff attendance, patient admission & discharge,
  room availability matrix, visiting-doctors roster, leave reader, and room
  change request approvals (auto-assigns an available room).
- **Nurse Portal**: ward inventory & medicine stock, requisitions, patient room
  occupancy & discharge forms, leave forms (self + doctor schedule).
- **Doctor Portal**: OPD schedule/cabin/status, electronic prescriptions,
  diagnostic report upload, equipment requests, and leave applications.
- **Patient Portal**: book OPD appointments, pay hospital bills online, room
  change requests, prescriptions & reports locker, grievance complaints.

## API Overview

All protected routes require `Authorization: Bearer <token>`.

- `POST /api/auth/login`, `GET /api/auth/me`
- `/api/staff`, `/api/patients`, `/api/expenses`, `/api/complaints`,
  `/api/reports`, `/api/rooms`, `/api/reviews`, `/api/notices`,
  `/api/appointments`, `/api/bills`, `/api/prescriptions`, `/api/leaves`,
  `/api/room-requests`, `/api/requisitions`, `/api/doctor-schedules`
- `/api/stats`, `/api/doctors`, `/api/nurses`, `/api/medicines`,
  `/api/machines`, `/api/visiting-doctors` (public catalog data)

## Scripts

| Directory | Command         | Description                  |
|-----------|-----------------|------------------------------|
| root      | `npm run dev`   | Start Vite dev server        |
| root      | `npm run build` | Production build             |
| root      | `npm run lint`  | Run Oxlint                   |
| server    | `npm run dev`   | Start backend with nodemon   |
| server    | `npm run seed`  | Wipe + reseed the database   |
