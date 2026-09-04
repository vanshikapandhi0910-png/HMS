# CITY Hospital Management System — Step-by-Step Startup Guide

Step-by-step procedure to install, run, and (optionally) push this project to GitHub.

---

## 1. Prerequisites

Make sure the following are installed on your machine:

| Software      | Version            | Purpose                            |
|---------------|--------------------|------------------------------------|
| Node.js       | 18 or newer        | Runs both frontend and backend     |
| npm           | 9 or newer         | Package manager (ships with Node)  |
| MongoDB       | 6+ (local service) | Database, default port 27017       |
| Git           | any                | Required for pushing to GitHub     |

> **Windows check:** MongoDB should show as a running service. You can verify with
> `Get-Service -Name MongoDB*` (PowerShell).

---

## 2. Get the project code

```bash
# If you downloaded a ZIP, extract it and open the folder in a terminal.
# OR clone from GitHub:
git clone https://github.com/<your-username>/<your-repo>.git
cd Project
```

> From here on, all commands are run from the project root `Project/`.

---

## 3. Backend setup (first time only)

```bash
cd server
npm install
```

This installs Express, Mongoose, JSON Web Token, bcryptjs, CORS, dotenv, and nodemon.

### 3.1 Check the environment file

The backend needs `server/.env`. It already exists in this project with:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/city_hospital
JWT_SECRET=city_hospital_dev_secret_change_me
JWT_EXPIRES_IN=7d
```

If it is missing, create `server/.env` with the above contents.

### 3.2 Seed the database (first time only)

This wipes and repopulates the database with demo data (users, staff, patients,
rooms, expenses, bills, leaves, requisitions, doctor schedules, etc.):

```bash
npm run seed
```

Expected output ends with `Seed complete: { User: 5, ... Room: 150, ... }`.

> Run this again any time you want to reset the data back to the demo state.

---

## 4. Start the backend

```bash
cd server
npm run dev
```

The API will be available at **http://localhost:5000**.

- Verify: open http://localhost:5000/api/health → `{"status":"ok","service":"CITY Hospital API"}`
- `npm run dev` uses nodemon (auto-restarts on file changes).
- To run without auto-restart: `npm start`.

---

## 5. Frontend setup (first time only)

Open a **second terminal** at the project root:

```bash
cd Project
npm install
```

This installs React, Vite, Lucide icons, and Oxlint.

---

## 6. Start the frontend

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

- The Vite dev server proxies `/api` requests to http://localhost:5000 automatically
  (configured in `vite.config.js`), so no extra configuration is needed.
- Open http://localhost:5173 in your browser.

> Both terminals must be running at the same time: one for the backend (step 4)
> and one for the frontend (step 6).

---

## 7. Login with demo accounts

Click **Login with ID / Role** in the navbar. Credentials auto-fill when you pick a role.

| Role          | User ID  | Password  | Name / Description |
|---------------|----------|-----------|--------------------|
| Admin         | ADM-001  | admin123  | Dr. Rajesh Gupta (Chief Admin) |
| Receptionist  | STF-201  | rec123    | Suresh Gupta (Lead Receptionist) |
| Receptionist  | STF-202  | rec123    | Priya Sharma (Senior Receptionist) |
| Nurse         | NUR-01   | nurse123  | Sister Mary Fernandez (Head ICU Nurse) |
| Doctor        | DOC-101  | doc123    | Dr. Arvind Swamy (Cardiologist) |
| Patient       | PAT-1001 | pat123    | Aarav Kumar (Patient #1001) |

---

## 8. Useful commands

| Command               | Directory | What it does                          |
|-----------------------|-----------|---------------------------------------|
| `npm run dev`         | root      | Start Vite frontend                   |
| `npm run build`       | root      | Create a production build in `dist/`  |
| `npm run lint`        | root      | Run Oxlint on the frontend code       |
| `npm run dev`         | server    | Start backend with nodemon            |
| `npm start`           | server    | Start backend without nodemon         |
| `npm run seed`        | server    | Wipe + reseed the database            |

---

## 9. Push the code to GitHub

> The `.gitignore` already excludes `node_modules`, `dist`, and `.env`, so secrets
> and dependencies will NOT be uploaded.

```bash
# 9.1 Go to the project root
cd Project

# 9.2 Initialize a local Git repository (if not already one)
git init

# 9.3 Stage all project files (only tracked, gitignored files are skipped)
git add .

# 9.4 Commit with a message
git commit -m "Complete City Hospital Management System with backend API"

# 9.5 Create an empty repository on GitHub (e.g. 'city-hospital-hms')
#     WITHOUT README/.gitignore/gitignore checkboxes (the project already has them).

# 9.6 Connect your local repo to GitHub
git remote add origin https://github.com/<your-username>/<your-repo>.git

# 9.7 Push to GitHub
git branch -M main
git push -u origin main
```

Verify: your repository now contains `src/`, `server/`, `.gitignore`, `README.md`,
and this `STARTUP.md`, but **no** `node_modules/` and **no** `.env` files.

---

## 10. Troubleshooting

| Problem                                 | Solution                                                     |
|-----------------------------------------|--------------------------------------------------------------|
| Backend exits with "MongoDB connection error" | Make sure the MongoDB service is running on port 27017. |
| Frontend shows "Request failed (500)" on login | Backend isn't running — start it (`cd server && npm run dev`). |
| Login says "No account found"            | Run `npm run seed` in `server/` to repopulate demo users.     |
| Port 5000 already in use                | Change `PORT` in `server/.env` and restart the backend.       |
| `/api` calls fail in production build   | Serve the backend and `dist/` from the same origin, or set a reverse proxy / CORS for the API host. |
