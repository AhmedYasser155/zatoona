# Zatoona — Setup Guide (fresh machine)

Everything needed to get the project running again from a clean clone.

## 1. Prerequisites to install

| Tool                            | Check with         | Install                           |
| ------------------------------- | ------------------ | --------------------------------- |
| Git                             | `git --version`    | https://git-scm.com               |
| Python 3.11+                    | `python --version` | https://python.org                |
| Node.js 20+                     | `node --version`   | https://nodejs.org                |
| pnpm                            | `pnpm --version`   | `npm install -g pnpm`             |
| FFmpeg                          | `ffmpeg -version`  | `winget install ffmpeg` (Windows) |
| GitHub CLI (optional, for auth) | `gh --version`     | `winget install --id GitHub.cli`  |

## 2. Clone the repo

```powershell
git clone https://github.com/<your-username>/zatoona.git
cd zatoona
```

## 3. Recreate your `.env` file — this is NOT in the repo, on purpose

`.env` is gitignored (correctly — it holds real API keys/secrets). You need to recreate it by hand with your actual values:

```powershell
cd apps\worker
notepad .env
```

Paste in (replace with your real values):

```
GROQ_API_KEY=your_groq_key_here
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=zatoona-media
```

(`GEMINI_API_KEY` only needed if you ever rerun the model-comparison test — safe to leave out.)

Also create the frontend's env file:

```powershell
cd ..\..\apps\web
copy .env.local.example .env.local
```

(Default value `http://localhost:8000` is fine unless you change where the backend runs.)

## 4. Install backend dependencies

```powershell
cd apps\worker
pip install fastapi uvicorn python-multipart groq boto3 requests opencv-python-headless mediapipe python-dotenv pydantic-settings yt-dlp
```

## 5. Install frontend dependencies

```powershell
cd ..\web
pnpm install
```

## 6. Confirm the Quran reference file made it through

```powershell
dir ..\..\packages\prompts\arabic\quran.json
```

This should already be there from the clone (assuming it was committed, not gitignored as a media/binary file). If it's missing, you'll need to re-save it at that exact path — `pipeline/quran_reference.py` depends on it.

## 7. Smoke-test the pieces that talk to external services

Quick sanity checks before running the whole thing, in order of how likely something's gone stale:

```powershell
cd apps\worker

REM Confirm Groq is reachable and the key still works
python -c "from groq import Groq; from dotenv import load_dotenv; load_dotenv(); print(Groq().models.list().data[0].id)"

REM Confirm R2 credentials still work (reuses logic from test_r2_upload.py if you kept it)
python test_r2_upload.py
```

## 8. Run the full pipeline once, directly (no server yet)

Edit `SOURCE_VIDEO_PATH` in `run_pipeline_test.py` to point at a real video file on this machine, then:

```powershell
python run_pipeline_test.py
```

This is the fastest way to confirm everything (transcription, refinement, Quran matching, scoring, rendering, captions, R2 upload) still works end to end on the new machine before touching the API/frontend layer.

## 9. Run the real app (two terminals)

**Terminal 1 — backend:**

```powershell
cd apps\worker
uvicorn app.main:app --reload
```

**Terminal 2 — frontend:**

```powershell
cd apps\web
pnpm dev
```

Open **http://localhost:3000**.

## 10. Quick reference: what each test script does

| Script                          | Tests                                                           |
| ------------------------------- | --------------------------------------------------------------- |
| `test_whisper_arabic.py`        | Arabic transcription via Groq Whisper (chunking for long files) |
| `test_r2_upload.py`             | Presigned upload/download to Cloudflare R2                      |
| `test_ffmpeg_split_screen.py`   | Face detection + auto single/split-screen reframing             |
| `test_arabic_captions.py`       | RTL Arabic caption burn-in                                      |
| `run_refine_transcript_test.py` | Transcript correction + Quran/Hadith/Quote classification       |
| `test_quran_reference.py`       | Quran verse matching accuracy (15 test cases)                   |
| `test_yt_dlp_ingest.py`         | YouTube video downloading                                       |
| `run_pipeline_test.py`          | The whole pipeline, end to end, no server needed                |

## Known open items (not bugs — just not built yet)

- Job storage is in-memory (`core/jobs.py`) — lost on server restart. Fine for testing, needs Supabase before real users.
- No user accounts/auth yet.
- No payments yet.
