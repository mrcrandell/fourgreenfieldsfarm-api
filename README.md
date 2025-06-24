# Four Green Fields Farm API

A Node.js REST API for Four Green Fields Farm, built with [TypeORM](https://typeorm.io/), [routing-controllers](https://github.com/typestack/routing-controllers), and PostgreSQL.

---

## Features

- User authentication with Argon2 and JWT
- Event management (CRUD, recurrence, grouping by day)
- Query and validation for event filtering
- Type-safe request validation with `class-validator`
- Secure route authorization with JWT
- Database migrations and seeding

---

## Project Structure

```
src/
  controllers/      # API route controllers (routing-controllers)
  entity/           # TypeORM entities (database models)
  migration/        # TypeORM migrations
  routes/           # (Legacy) Express route files
  data-source.ts    # TypeORM data source config
  index.ts          # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- PostgreSQL database

### Setup

1. **Clone the repo and install dependencies:**

   ```sh
   git clone <repo-url>
   cd fourgreenfieldsfarm-api
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the root with:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   DEFAULT_USER_PASSWORD=changeme
   PORT=3000
   ```

3. **Run database migrations:**

   ```sh
   npm run migrations
   ```

4. **Start the server:**
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`.

---

## API Overview

### Authentication

- `POST /api/users/login`
  Request body: `{ "email": "...", "password": "..." }`
  Returns: JWT token and user info

### Events

- `GET /api/events`
  Query params: `limit`, `offset`, `startsAt`, `endsAt`
- `GET /api/events/by-day`
  Query params: `startsAt`, `endsAt`
  Returns events grouped by day with day label and day of month
- `POST /api/events`
  (Requires Authorization header with Bearer token)
  Create a new event (supports recurrence)
- `PUT /api/events/:id`
  Update an event (supports scope for recurring events)

---

## Validation

All request bodies and query parameters are validated using `class-validator`.
Invalid requests return a 400 response with error details.

---

## Authorization

Protected routes use JWT-based authorization.
Add `Authorization: Bearer <token>` to your requests.

---

## Migrations

- **Generate a migration:**

  ```sh
  npm run migrations:generate -- MigrationName
  ```

  This will prompt you for a migration name and generate the file in `src/migration/`.

- **Run migrations:**
  ```sh
  npm run migrations
  ```

---

## Development

- Run in watch mode: `npm run dev`
- Build for production: `npm run build`
- Start production build: `npm start`

---

## License

MIT

---
