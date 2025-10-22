# CRUD React + Node + MySQL — Project Overview

This document explains the sample CRUD application (React frontend + Express backend + MySQL) in detail and includes run instructions, API documentation, database schema, and recommended next steps.

---

## Table of contents

- Project summary
- Architecture and file map
- Data model
- API endpoints (examples)
- How to run (dev) — backend and frontend
- Environment variables
- Where to change styles and behavior
- Suggestions and next steps
- Troubleshooting

---

## Project summary

This repository contains a minimal but complete CRUD web application. It demonstrates a standard separation of concerns:

- `server/`: Express API that communicates with a MySQL database.
- `client/`: React app bootstrapped using Vite that calls the backend API via axios.

Functionality: create, read, update, delete `todos` (title + description). The application uses REST endpoints and a small React router for navigation.

## Architecture and file map

Root files and important folders (abridged):

- `client/`

  - `index.html` — app HTML shell for Vite
  - `package.json` — client dependencies and scripts (dev/build/preview)
  - `vite.config.js` — Vite configuration
  - `src/`
    - `main.jsx` — React entry point and routing
    - `api.js` — axios instance with baseURL
    - `index.css` — global stylesheet (colors, layout)
    - `pages/`
      - `TodoList.jsx` — list view (GET /todos, delete)
      - `TodoForm.jsx` — create/edit form (GET /todos/:id, POST, PUT)

- `server/`
  - `index.js` — Express entry; mounts `/api/todos`
  - `db.js` — mysql2/promise connection pool
  - `routes/todos.js` — REST CRUD endpoints for `todos`
  - `schema.sql` — SQL to create the `todos` table

## Data model

The app uses a single `todos` table with the following columns:

- `id` INT AUTO_INCREMENT PRIMARY KEY
- `title` VARCHAR(255) NOT NULL
- `description` TEXT (nullable)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Example JSON representation of a todo:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, bread, eggs",
  "created_at": "2025-10-21T12:34:56.000Z"
}
```

## API endpoints

Base path: `http://<server-host>:<PORT>/api/todos`

- GET `/` — Get all todos

  - Response: 200, JSON array of todos

- GET `/:id` — Get a specific todo

  - Response: 200 and todo object, or 404 if not found

- POST `/` — Create a todo

  - Request JSON: { title: string, description?: string }
  - Response: 201 and created todo object

- PUT `/:id` — Update a todo

  - Request JSON: { title: string, description?: string }
  - Response: 200 and updated todo, or 404

- DELETE `/:id` — Delete a todo
  - Response: 200 and { success: true }

## How to run (development)

Prerequisites

- Node.js (v16+ recommended)
- MySQL server

1. Database setup

- Create a database (e.g., `crud_app`).
- Run the SQL in `server/schema.sql` to create the `todos` table.

2. Backend (server)

From `server/`:

```powershell
cd server
npm install    # if you haven't already
# create a .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT (optional)
node index.js
```

The server will listen on `PORT` or 4000 by default. It exposes the endpoints above under `/api/todos`.

3. Frontend (client)

From `client/`:

```powershell
cd client
npm install    # if you haven't already
npm run dev
```

Open the Vite dev server URL shown in the terminal (usually `http://localhost:5173`). If your API runs on a different host/port, set `VITE_API_BASE` in `client/.env` to `http://<host>:<port>/api`.

## Environment variables

Server (`server/.env`):

- `DB_HOST` — MySQL host (default: localhost)
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — MySQL database name
- `PORT` — server port (default: 4000)

Client (`client/.env`):

- `VITE_API_BASE` — base URL for API calls (e.g., `http://localhost:4000/api`)

## Where to change styles and UI

- Global styles: `client/src/index.css` — colors, layout, variables are defined here.
- Per-page styles: create `client/src/pages/TodoList.css` and `TodoForm.css` and import them in the components.
- Colors: update `:root` CSS variables in `index.css` (e.g., `--accent`) to change accents globally.

## Suggestions and potential improvements

- Validation: Add server-side validation to return 400 on invalid input.
- UI: Replace `window.alert` and `confirm` with in-app modals/notifications.
- Tests: Add API tests (Jest + supertest) for routes and component tests for the React app.
- Auth: Add basic auth or JWT if you want per-user todos.
- Deployment: Containerize server with Docker and deploy the client as a static build.

## Troubleshooting

- CORS: If client can't reach server, ensure server has `cors()` enabled (it does) and client `VITE_API_BASE` is correct.
- Database connection: Verify `.env` variables and that MySQL is running; check `server/index.js` logs.
- Ports: Make sure the server and vite dev server ports are not conflicting with other services.

---

If you want this document exported to PDF or another format, let me know and I will generate it and add it to the repository (or provide a downloadable link).
