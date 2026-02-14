# Bloom Life

Bloom Life is a wellness landing page built with React + TypeScript, paired with a serverless Node.js API for contact form submissions.

## Project layout

- `src/` - React frontend
- `api/` - Serverless API routes

## Getting started

Install dependencies:

```bash
npm install
```

Run the frontend locally:

```bash
npm run dev
```

The contact form posts to `/api/contact`. For local API testing, use the Vercel CLI (`vercel dev`) so the serverless functions run alongside the frontend.

## Environment variables

Set these in your hosting platform or local environment:

```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=bloomlife
```

## Deployment

This project is structured to deploy on Vercel:

- Frontend: Vite build
- Backend: Serverless functions in `api/`

## Assets

Replace the placeholder hero and logo treatments with your provided brand assets.
