# CareerBridge Job Portal — Windows Beginner Guide

## 1. Project Overview

This local college project lets candidates register, search jobs, upload resumes, apply, and track status. Recruiters register, create company profiles, post jobs, view applicants, download resumes, and update statuses. The browser frontend talks to an Express REST API, which stores data in local MySQL.

## 2. Features

- Candidate and recruiter JWT login; passwords are hashed with bcrypt
- Keyword, location, job-type, and salary job filters
- Recruiter company profiles and job posting/management
- PDF, DOC, DOCX resume upload (5 MB maximum)
- Duplicate application prevention and status tracking

## 3. Technology Stack

HTML5, CSS3, vanilla JavaScript, Node.js, Express, MySQL, mysql2, JWT, bcryptjs, Multer, CORS, and dotenv.

## 4. Complete Folder Structure

```text
Job-Portal/
  frontend/  index.html, login.html, register.html, jobs.html, job-details.html,
             candidate-dashboard.html, recruiter-dashboard.html, css/, js/, assets/
  backend/   server.js, package.json, .env.example, config/, routes/, controllers/,
             models/, middleware/, uploads/resumes/
  database/job_portal.sql
  README.md
```

The existing frontend keeps its page files directly inside `frontend/`, while
shared behavior is separated into `frontend/js/` and shared styling is split
across `frontend/css/`. This is intentional: moving the working pages into a
new `pages/` folder would require changing every relative script, stylesheet,
and navigation link without adding application behavior.

## 5. Prerequisites

This guide uses Windows Command Prompt (CMD). Press **Windows + R**, type `cmd`, and press Enter.

**WHERE TO RUN: CMD**

```cmd
node --version
npm --version
mysql --version
```

**EXPECTED RESULT:** each command prints a version. If Node/npm is not recognized, install Node.js LTS, close CMD, then reopen it. If MySQL is not recognized, install MySQL Server or add its `bin` folder to PATH.

Navigate to this project (change the path if yours differs):

**WHERE TO RUN: CMD**

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal
cd
dir
```

**EXPECTED RESULT:** `dir` lists `frontend`, `backend`, and `database`. Commands must be run in the correct folder.

## 6. Installation

Install Node dependencies only inside `backend`, where `package.json` exists.

**WHERE TO RUN: CMD, project root**

```cmd
cd backend
dir
npm install
```

**EXPECTED RESULT:** `dir` shows `package.json`; npm creates `node_modules`. Do **not** run files in `routes`, `controllers`, `models`, `middleware`, or `config` directly. Start the API only with `npm start` in `backend`.

## 7. Database Setup

The database is local MySQL at `localhost:3306`. Check it:

**WHERE TO RUN: CMD (Administrator if required)**

```cmd
sc query MySQL84
netstat -ano | findstr :3306
```

**EXPECTED RESULT:** a running MySQL service and/or port 3306 listener. If necessary, open `services.msc`, locate MySQL, and click Start, or run `net start MySQL84`. Service names can vary.

Import the ready-made schema:

**WHERE TO RUN: CMD, project root**

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal
mysql -u root -p < database\job_portal.sql
```

Enter the MySQL password. Verify tables:

**WHERE TO RUN: CMD**

```cmd
mysql -u root -p
```

**WHERE TO RUN: MySQL prompt (`mysql>`)**

```sql
SHOW DATABASES;
USE job_portal;
SHOW TABLES;
```

**EXPECTED RESULT:** `users`, `companies`, `jobs`, `resumes`, and `applications`. If `mysql` is not recognized, open `database/job_portal.sql` in MySQL Workbench and execute it, or add the MySQL `bin` folder (often `C:\Program Files\MySQL\MySQL Server 8.4\bin`) to PATH.

## 8. Backend Setup

Create your private configuration.

**WHERE TO RUN: CMD, backend folder**

```cmd
copy .env.example .env
notepad .env
```

Set `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root`, your real `DB_PASSWORD`, `DB_NAME=job_portal`, and a long private `JWT_SECRET`. `PORT=5000` is the API port. Never commit or share `.env`.

**WHERE TO RUN: CMD, backend folder**

```cmd
npm start
```

**EXPECTED RESULT:** `Job Portal API running at http://localhost:5000`. Keep this window open. In a new CMD window, test it:

```cmd
curl http://localhost:5000/api/jobs
```

It returns `[]` before jobs are posted.

## 9. Frontend Setup

The main entry point is `frontend/index.html`; do not run each HTML/JS file separately. Recommended: open the project in VS Code, open the `frontend` folder, right-click `index.html`, then choose **Open with Live Server**. It uses `http://localhost:5500`.

Without Live Server, run:

**WHERE TO RUN: a new CMD window, project root**

```cmd
cd frontend
py -m http.server 5500
```

**EXPECTED RESULT:** a serving message. Browse to http://localhost:5500 and keep the CMD window open.

## 10. How to Run the Complete Project

### How to Run the Project Every Time

**CMD Window 1 — MySQL:** ensure MySQL is running on port 3306.

**CMD Window 2 — Backend:**

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal\backend
npm start
```

**CMD Window 3 — Frontend:**

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal\frontend
py -m http.server 5500
```

Then open http://localhost:5500. Flow: **Browser → Frontend → API (5000) → MySQL (3306)**.

## 11. How to Stop the Project

Click each command window and press `Ctrl + C`. To stop MySQL, use Services or `net stop MySQL84` in an administrator CMD only if you need to.

## 12. Common Errors and Fixes

### If You Get Path Errors

`The system cannot find the path specified` means the path is wrong. Run `cd` and `dir`, then move one folder at a time:

```cmd
cd C:\Users\bharg\OneDrive\Documents
dir
cd Job-Portal
cd backend
```

Folder names must exactly match `dir`.

| Error | Meaning and exact fix |
|---|---|
| `'node'` / `'npm' is not recognized` | Install Node.js LTS, reopen CMD, run `node --version`. |
| `'mysql' is not recognized` | Use MySQL Workbench or add the MySQL `bin` folder to PATH. |
| `Cannot find module` or `ENOENT` | Run `cd backend`, verify `package.json` with `dir`, then run `npm install`. |
| `EADDRINUSE` / port 5000 in use | Stop old server with Ctrl+C; check `netstat -ano | findstr :5000`. |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL is off. Start its service and check port 3306. |
| `Access denied for user root` | Wrong `.env` password. Test it with `mysql -u root -p`. |
| `Database does not exist` | Import `database\job_portal.sql` again from project root. |
| CORS error | Run backend at 5000 and frontend at 5500; browse `http://localhost:5500`. |
| 404 API error | Confirm backend is running and URL begins `/api/`. |
| `Cannot find package.json` | You are outside `backend`; run `cd ...\Job-Portal\backend`. |

## 13. API Overview

`POST /api/auth/register`, `POST /api/auth/login`; `GET/POST/PUT/DELETE /api/jobs`; `GET/PUT /api/companies/me`; `POST /api/resumes/upload`, `GET /api/resumes/:id`; `POST /api/applications`, `GET /api/applications/my`, `GET /api/applications/job/:jobId`, and `PUT /api/applications/:id/status`. Private APIs require `Authorization: Bearer <JWT>`.

Successful writes return `201` (registration, job creation, resume upload, and
applications). Validation errors return `422`, authentication failures return
`401`, role or ownership failures return `403` or `404`, duplicate accounts and
applications return `409`, and unexpected server/database failures return
`500` with a user-safe message. The browser uses one API base URL in
`frontend/js/config.js`; database credentials remain only in `backend/.env`.

## 14. Default Local URLs

- Frontend: http://localhost:5500
- Backend: http://localhost:5000
- MySQL: localhost:3306

## Final Checklist

- [ ] Node.js installed
- [ ] MySQL running on port 3306
- [ ] `job_portal` database/tables imported
- [ ] `backend/.env` configured
- [ ] `npm install` completed in backend
- [ ] Backend on port 5000 and frontend on port 5500
- [ ] Candidate/recruiter registration, job posting/search, resume upload, application and tracking tested

## 5-Minute Quick Start

**WHERE TO RUN: CMD**

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal
mysql -u root -p < database\job_portal.sql
cd backend
copy .env.example .env
notepad .env
npm install
npm start
```

Open another CMD:

```cmd
cd C:\Users\bharg\OneDrive\Documents\Job-Portal\frontend
py -m http.server 5500
```

Open http://localhost:5500, create recruiter/company/job first, then create a candidate and apply.
