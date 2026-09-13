# PixProMax

PixProMax is a production-oriented, SEO-first collection of free browser-based image tools. Active tools process images locally so files do not need to be uploaded to a server.

## Available tools

- Image compressor with quality control and before/after reporting
- High-quality image resizer with aspect lock, presets, Pica resizing, format, and quality control
- JPG, PNG, and WebP converter with transparency-aware JPEG backgrounds
- Sequential batch converter with per-file states, retry, and JSZip download
- Target-size optimizer for 20 KB, 50 KB, 100 KB, 200 KB, or custom targets
- Passport photo maker with configurable presets, crop positioning, zoom, and high-resolution export
- Background-removal page with a typed provider interface and honest unavailable state

## Technology

- Next.js App Router, React, strict TypeScript, and Tailwind CSS
- Canvas API, Pica, browser-image-compression, JSZip, and Lucide icons
- Vitest for pure utility tests
- Standards-based service worker for offline-after-first-load application-shell caching

## Architecture

- `app/` — routes, metadata endpoints, global layout, and styles
- `components/ui/` — shared interface primitives
- `components/tools/` — reusable upload, preview, result, layout, and processing interfaces
- `lib/image/` — focused decoding, canvas, resizing, conversion, target-size, filename, and download utilities
- `utils/` — small framework-independent helpers
- `config/` — site metadata, limits, tool registry, and passport presets
- `styles/` — shared visual tokens for light and dark themes
- `types/` — shared tool and processing types
- `public/` — application icons, social preview, and service worker
- `tests/` — pure utility test suite

Adding a tool usually means adding a registry entry in `config/tools.ts`, a route in `app/`, one focused interactive component, and an optional image-processing utility.

## Local setup

Requires a current Node.js LTS-compatible runtime.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation and production

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` when a non-default canonical origin is needed.

```text
NEXT_PUBLIC_SITE_URL=https://pixpromax.com
```

No API keys are used by the MVP. Do not expose future provider secrets in client-side variables.

## Privacy model

The active tools operate with browser APIs and client-side libraries. Selected images are represented with temporary object URLs and canvases, then downloaded directly. User images are never added to the service-worker cache. AI processing is intentionally outside the v1 scope.

## PWA and offline behavior

The production service worker caches the app shell, tool pages, and required same-origin static assets after the first successful load. Browser-based tools can continue working once their code has been cached. The service worker excludes non-GET requests, `blob:` URLs, and `data:` URLs.

## Background-removal architecture

`lib/background-removal/provider.ts` defines `BackgroundRemovalProvider`. The included placeholder provider returns a controlled unavailable error. A real integration can implement the interface using a protected serverless API or a browser-side model.

## Deploying to Vercel

1. Import the repository into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
3. Deploy with the standard Next.js build settings.

The app does not require a backend for its active tools and also works on other Next.js-compatible hosts.
