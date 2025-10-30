# AuthenticationDemo – Complete Project Explanation

This project is a minimal, production-lean blueprint showing how to implement authentication (register/login) and client-side authorization with JWTs. It includes a Node/Express server backed by MySQL and a small React client that demonstrates the login and welcome flow.

## Tech Stack
- Server: Node.js, Express, MySQL (mysql2/promise), JWT (jsonwebtoken), bcrypt, helmet, rate-limiter
- Client: React (Vite), axios

## Why this structure?
- Keep only what’s essential for auth: register, login, logout on server; demo and welcome on client.
- JWT-based stateless auth (no sessions) to simplify deployment and scaling.
- Minimal code paths, easy to extend with more protected routes.

## Project Structure
```
server/
  config.js         # Server config (port, CORS origin, secrets, limits)
  db.js             # MySQL pool, schema bootstrap, demo user seeding
  index.js          # Express app, CORS/helmet/limits, routes
  middleware/
    auth.js         # JWT verify middleware (reads Bearer token)
  routes/
    auth.js         # /auth/register, /auth/login, /auth/logout

client/
  index.html
  vite.config.js
  src/
    api.js          # axios base client + Authorization header injection
    main.jsx        # Router + App
    App.jsx         # Routes: /demo (login), /register, /welcome
    pages/
      DemoAuth.jsx  # Minimal login form, stores token+user, redirects to /welcome
      Register.jsx  # Minimal create-account form
      Welcome.jsx   # Reads user from localStorage; shows Logout
```

## Database & Seeding
On server start, `server/db.js` ensures required tables exist and seeds a demo user if missing.
- Default DB: `crud_app`
- Demo user (override via env):
  - Email: `demo@example.com`
  - Password: `DemoPass123`

## Environment Variables (server/.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=crud_app
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-here
SESSION_SECRET=session-secret-key
COOKIE_SECRET=cookie-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=DemoPass123
```

## Install & Run
```
cd server && npm install
cd ../client && npm install

# Run
cd ../server && npm run dev    # or npm start
cd ../client && npm run dev    # opens http://localhost:5173
```

## Client Flow
1) Visit `/demo`
   - Enter email/password and click Login
   - On success, the client saves:
     - `localStorage.token` (JWT)
     - `localStorage.user` (id, email, username)
   - Then navigates to `/welcome`
2) Welcome page `/welcome`
   - Displays: “Welcome to <username>”
   - Logout button clears `token` and `user` and returns to `/demo`

## API Overview (Base: http://localhost:4000/api)
- POST `/auth/register`
  - Body: `{ email, password }`
  - Returns: `{ token, user: { id, email, username } }`
  - Use to create a new user; token is immediately valid

- POST `/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ success: true, token, user }`
  - On success, client stores token and user, then redirects to `/welcome`

- POST `/auth/logout`
  - No body
  - Returns: `{ success: true }`
  - JWT is stateless; the client just clears local storage

## Security Notes
- JWT secret in `config.js` is a development default; override via env in production.
- Helmet adds sensible security headers.
- Rate limiting is enabled on `/api/*` (configurable window and cap).
- CORS is restricted to `CORS_ORIGIN` (defaults to Vite dev origin).

## Code Highlights
- `server/middleware/auth.js`: verifies JWT and sets `req.userId`.
- `client/src/api.js`: attaches `Authorization: Bearer <token>` if present; on 401 clears the token and redirects to `/demo`.
- `Welcome.jsx`: demonstrates reading persisted user and performing a clean logout.

## Troubleshooting
- EADDRINUSE 4000: another process is using port 4000; stop it, or change `PORT`.
- 401 responses: login again; ensure the token is in localStorage.
- DB errors: confirm DB connectivity and credentials; the server will log schema/seed steps.

## Extending This Demo
- Add a new protected endpoint: create a route and prepend `auth` middleware.
- Fetch user profile at app start: add a `/me` route and call it on client boot.
- Persist tokens more securely: switch to HttpOnly cookies with CSRF protection if required.
- Add validation: integrate `express-validator` on inputs for production-grade checks.
