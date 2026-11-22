# Ocean Pyramid Properties: CI and deployment

## Continuous integration

The workflow at `.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`.

It installs dependencies with `npm ci`, runs the backend Jest/Supertest suite, runs the frontend Node.js service tests, and creates a production Vite build. A failed test or build fails the workflow.

## Local verification

From the repository root:

```bash
cd backend && npm ci && npm test
cd ../frontend && npm ci && npm test && npm run build
```

## Environment configuration

Backend: copy `backend/.env.example` to `backend/.env` and set real MySQL credentials and a long, unique `JWT_SECRET`. Never commit `.env` files.

Frontend: copy `frontend/.env.example` to `frontend/.env` if needed. For local development, the Vite proxy forwards `/api` and `/uploads` to `http://localhost:4000`. In production, set `VITE_API_BASE_URL` to the deployed backend API base, including `/api`, for example `https://api.example.com/api`.

Set the backend `CLIENT_URL` to the production frontend origin. If more than one browser origin is needed, list them comma-separated in `CLIENT_URLS`.

## Production deployment is host-dependent

The GitHub Actions workflow currently provides the automated CI gate and frontend production build. It does not deploy to a hosting provider yet: no hosting provider or production environment has been selected. Add a provider-specific deployment job only after the frontend host, backend host, database host, persistent image storage, and required GitHub Actions secrets are chosen. Do not put production credentials in the repository.

The backend currently writes uploaded property images to `backend/uploads`. Before production, configure persistent object storage or a persistent disk and update the upload middleware accordingly; ephemeral application filesystems can lose uploads during redeployment.

Database schema changes must continue to be applied using Sequelize migrations. Do not use `sequelize.sync()` to create or modify production tables.
