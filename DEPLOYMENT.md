# Deployment Guide — WriteSpace

## Overview

WriteSpace is a static single-page application (SPA) built with Vite + React. This guide covers deploying to **Vercel**, including configuration for client-side routing.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- A [Vercel](https://vercel.com/) account (free tier works)
- The [Vercel CLI](https://vercel.com/docs/cli) installed globally (optional but recommended):
  ```bash
  npm install -g vercel
  ```

---

## Build Configuration

### Build Command

```bash
npm run build
```

This runs `vite build` under the hood and produces an optimized production bundle.

### Output Directory

```
dist
```

Vite outputs all static assets to the `dist` directory by default. Vercel must be configured to serve from this directory.

---

## Vercel Configuration

### vercel.json

Create a `vercel.json` file in the project root to handle SPA client-side routing. This ensures that all routes are rewritten to `index.html`, allowing React Router to manage navigation:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> **Why rewrites?** Without this configuration, navigating directly to a route like `/editor` or refreshing the page on a nested route will return a 404 from the server. The rewrite rule tells Vercel to serve `index.html` for all paths, letting the client-side router resolve the correct view.

### Deploying via Vercel CLI

1. From the project root, run:
   ```bash
   vercel
   ```
2. Follow the prompts to link or create a new project.
3. Vercel will auto-detect the Vite framework and apply sensible defaults. Confirm the following when prompted:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. For production deployment:
   ```bash
   vercel --prod
   ```

### Deploying via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Log in to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. Vercel should auto-detect the framework as Vite. Verify the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.

---

## Environment Variables

WriteSpace does not require any environment variables for deployment. The application runs entirely on the client side with no external API dependencies.

If you add environment variables in the future, note the following:

- Vite only exposes variables prefixed with `VITE_` to the client bundle.
- Access them via `import.meta.env.VITE_YOUR_VARIABLE` (never `process.env`).
- Add variables in the Vercel Dashboard under **Settings → Environment Variables**.

---

## Troubleshooting

### Direct URL Access Returns 404

**Symptom:** Navigating directly to a route (e.g., `https://your-app.vercel.app/editor`) or refreshing the page on a nested route returns a 404 error.

**Cause:** The server is looking for a file matching the path `/editor`, which does not exist as a static file. The SPA relies on `index.html` being served for all routes.

**Solution:** Ensure `vercel.json` is present in the project root with the rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

After adding or updating `vercel.json`, redeploy:

```bash
vercel --prod
```

### Build Fails on Vercel

**Symptom:** The deployment fails during the build step.

**Solutions:**
- Verify that `npm run build` succeeds locally before deploying.
- Check that the Node.js version on Vercel matches your local version. You can pin it in `package.json`:
  ```json
  {
    "engines": {
      "node": ">=18"
    }
  }
  ```
- Review the build logs in the Vercel Dashboard for specific error messages.

### Assets Not Loading (Blank Page)

**Symptom:** The page loads but is blank, and the browser console shows 404 errors for JavaScript or CSS files.

**Solutions:**
- Confirm the **Output Directory** is set to `dist` in Vercel project settings.
- Ensure `vite.config.js` does not set a custom `base` path unless your deployment requires one. For Vercel root deployments, the default `base: '/'` is correct.

### Stale Content After Redeployment

**Symptom:** Changes are not reflected after a new deployment.

**Solutions:**
- Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) to bypass the cache.
- Vite includes content hashes in filenames by default, so asset caching issues are rare. If the problem persists, check that your build output actually contains the updated code by running `npm run build` locally and inspecting the `dist` directory.

---

## Quick Reference

| Setting          | Value             |
| ---------------- | ----------------- |
| Build Command    | `npm run build`   |
| Output Directory | `dist`            |
| Framework        | Vite              |
| Node.js Version  | >= 18             |
| Env Vars Needed  | None              |
| SPA Rewrites     | `vercel.json`     |