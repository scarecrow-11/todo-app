## Description

A Full-Stack Todo App build on NextJS

## Pre-requisites

Install NodeJS. Last known working version `20.13.1`

Install PostgreSQL. Last known working version `16`

Add a `.env` file in the root directory. A sample `.env` file is given below with the environment variables.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/db-name?schema=public"
```

## Getting Started

```bash
# installl dependencies
npm ci

# database migration
npx prisma migrate dev

# type generation
npx prisma generate

# run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
