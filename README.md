# Full-Stack CRUD App (React + Node + MySQL)

This is a beginner-friendly Full-Stack CRUD application example using:
- **Frontend:** React (Vite) + Axios
- **Backend:** Node.js + Express
- **Database:** MySQL (use `mysql` or `mysql2`)

**Features**
- Create, Read, Update, Delete (CRUD) todos
- REST API with Express
- Example SQL schema and `.env.example`

## Quick setup

### 1. MySQL
Create a database and run the SQL in `server/schema.sql`.
Example:
```sql
CREATE DATABASE crud_app;
USE crud_app;
-- then run schema.sql
```

### 2. Backend
```bash
cd server
npm install
# copy .env.example to .env and edit DB credentials, e.g.:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=crud_app
npm start
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

Frontend will call backend at `http://localhost:4000` by default. Edit `client/src/api.js` if backend runs at another URL.

## Notes
- This project is scaffolded for learning. Do not use `.env` with secrets in public repos.
- For production, add proper validation, error handling, and secure practices.

Enjoy! — KVGNAIDU example project
