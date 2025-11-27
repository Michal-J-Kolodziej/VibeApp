---
description: How to deploy the application to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying the VibeApp (Angular Frontend + NestJS Backend) to Vercel.

## Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account

## Steps

1.  **Login to Vercel**
    If you haven't already, login to Vercel via the CLI:
    ```bash
    vercel login
    ```

2.  **Deploy**
    Run the deployment command from the root directory:
    ```bash
    vercel --prod
    ```

3.  **Configure Environment Variables**
    In the Vercel dashboard for your project, ensure the following environment variables are set:
    - `DATABASE_URL`: Your Prisma Data Proxy URL (starts with `prisma://`)
    - `POSTGRES_URL`: Your direct PostgreSQL URL (starts with `postgres://`)
    - `PRISMA_DATABASE_URL`: Same as `DATABASE_URL` (if needed by your config)

4.  **Verify Deployment**
    Visit the URL provided by Vercel to verify the application is running.
