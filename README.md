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
- **Transactional email rendering with Vue and inlined CSS**
- Email template preview and build scripts

---

## Project Structure

```
src/
  controllers/      # API route controllers (routing-controllers)
  entity/           # TypeORM entities (database models)
  migration/        # TypeORM migrations
  emails/           # Vue email templates and components
  templates/        # Built HTML email templates (output)
  utils/            # Utility functions (e.g., email sending)
  data-source.ts    # TypeORM data source config
  index.ts          # App entry point

scripts/
  buildEmailTemplates.ts   # Script to build HTML emails from Vue SFCs
  collectVueStyles.ts      # Helper for collecting styles from Vue files
  generate-migration.js    # Migration generation helper
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x (LTS versions recommended)
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
   MAILGUN_API_KEY=your_api_key
   MAILGUN_DOMAIN=your_domain
   MAIL_FROM=your_from_address
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

## Email Functionality

### Overview

Transactional emails are built using Vue Single File Components (SFCs) in `src/emails/`.
These templates are rendered to HTML with inlined CSS for maximum compatibility.

- **Preview emails in the browser:**
  Run the preview server to see emails live as you develop.

- **Build HTML templates for production:**
  Use the build script to generate inlined HTML files in `src/templates/`.

### Email Scripts

- **Preview emails in the browser:**

  ```sh
  npm run email:preview
  ```

  Visit the local URL shown in the terminal to view email previews.

- **Build HTML email templates:**
  ```sh
  npm run email:build
  ```
  This will generate HTML files in `src/templates/` for each Vue email component.

### Adding or Editing Email Templates

1. Add or edit Vue SFCs in `src/emails/` (e.g., `ContactEmail.vue`).
2. Run the preview or build script to see changes reflected in the output.
3. The built HTML can be used for sending transactional emails via your preferred provider.

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

##
