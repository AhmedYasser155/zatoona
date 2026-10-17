# Zatoona Frontend — Checkpoint

Where the web app stands, what to verify first, and what to build next.
Lives next to `SETUP.md` at the repo root.

## What exists (apps/web)

| Piece | File | Status |
|---|---|---|
| Home page: hero + upload | `app/page.tsx` | Written, not yet run |
| Upload form (YouTube link tab / file tab) | `components/UploadForm.tsx` | Written, not yet run |
| Job status page, polls every 3s | `app/jobs/[id]/page.tsx` | Written, not yet run |
| Stage tracker (real pipeline stages, RTL) | `components/StageTracker.tsx` | Written, not yet run |
| Clip results grid (preview, title, score, download) | `components/ClipResults.tsx` | Written, not yet run |
| API client | `lib/api.ts` | Written, not yet run |
| Design tokens (olive-black, gold, leaf green) | `tailwind.config.ts`, `app/globals.css` | Done |
| RTL + Tajawal / IBM Plex Mono | `app/layout.tsx` | Done |

Backend endpoints it depends on (all in `apps/worker/app/api/routes.py`):
`POST /upload-url`, `POST /jobs`, `GET /jobs/{id}`, plus CORS for `localhost:3000` in `app/main.py`.

## Verify first (the frontend has never been run)

1. `cd apps/web && pnpm install && pnpm dev`. Expect to fix a few small build errors, since this was written without being executed.
2. **Set CORS on the R2 bucket.** Your Python upload test worked because `requests` ignores CORS. A browser `PUT` straight to R2 will be blocked until the bucket allows it. In the Cloudflare dashboard go to R2, open the bucket, then Settings, then CORS policy, and add:

   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000"],
       "AllowedMethods": ["PUT", "GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
   Add your deployed frontend URL to `AllowedOrigins` later.
3. Look at the stage tracker in a real browser. The connector fill direction in RTL was written from reasoning, not seen on screen.
4. Run one job from a YouTube link and one from a file upload, end to end.

## Known gaps

- **Jobs live in memory.** Restart the backend and `/jobs/<id>` returns 404; the page keeps polling forever instead of saying so.
- **Result links expire after 1 hour** (presigned R2 URLs), so old results pages lose their videos.
- **No options on the upload form.** Min/max clip length is a constant in `score.py`; there is no clip count, layout override, or dialect choice.
- **No caption review or editing** before the final render.
- **Quran citations are not shown.** `quran_reference` (surah/ayah) exists in the transcript but is not returned in the clip results.
- **Failed jobs show raw backend error text** inside an Arabic UI.
- **No auth, no job history, no pricing page.**
- CORS only allows `localhost:3000`.

## Suggested build order

1. Verify items above (R2 CORS first).
2. Persistent jobs (Supabase, or SQLite as a stopgap) plus a job history page. Fixes the 404 problem and is needed for everything after.
3. Clip options on the upload form (length range, number of clips), passed through `POST /jobs` into `score.py` and `render.py`.
4. Caption review and edit screen. Splits the pipeline into "analyze" and "render after approval". Your biggest Arabic-accuracy differentiator.
5. Quran citation badge on clips (return `quran_reference` in the job result and show "سورة X: آية Y").
6. Auth and plans, then deployment (frontend on Vercel; backend on a host that can run FFmpeg + MediaPipe).

## File map

```
apps/web/
  app/
    layout.tsx            RTL html, fonts
    globals.css           base styles, focus ring, reduced motion
    page.tsx              home
    jobs/[id]/page.tsx    status + results
  components/
    UploadForm.tsx
    StageTracker.tsx
    ClipResults.tsx
  lib/api.ts
  tailwind.config.ts      design tokens
  .env.local              NEXT_PUBLIC_API_URL (copy from .env.local.example)
```
