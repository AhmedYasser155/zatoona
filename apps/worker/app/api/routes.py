"""
api/routes.py

Replaces the original stub. Three endpoints:

  POST /upload-url -- returns a presigned R2 upload URL + object key.
                       The BROWSER uploads the file directly to R2
                       using this URL -- the file never passes through
                       this server. See core/storage.py, same
                       mechanism proven in test_r2_upload.py.
  POST /jobs        -- creates a job, kicks off the pipeline in the
                        background, returns a job_id immediately
  GET  /jobs/{id}   -- returns current status and, once done, clip URLs

Uses FastAPI's built-in BackgroundTasks for now -- no Redis/Celery
needed at this volume. Known limitation: jobs are lost if the server
restarts mid-run, and this won't scale across multiple server
instances. That's the trigger point for swapping in a real queue --
nothing in pipeline/orchestrator.py would need to change when you do.
"""

import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.core import jobs, storage
from app.pipeline.orchestrator import run_pipeline

router = APIRouter()


@router.post("/upload-url")
def get_upload_url(payload: dict):
    """
    payload example: {"filename": "my_podcast.mp4"}
    Returns: {"upload_url": "...", "key": "uploads/<uuid>.mp4"}

    Client PUTs the raw file bytes directly to upload_url, then calls
    POST /jobs with source = "r2://" + key.
    """
    filename = payload.get("filename", "video.mp4")
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "mp4"
    key = f"uploads/{uuid.uuid4()}.{ext}"

    upload_url = storage.generate_presigned_upload_url(key)
    return {"upload_url": upload_url, "key": key}


@router.post("/jobs")
def create_job(payload: dict, background_tasks: BackgroundTasks):
    """
    payload example: {"source": "https://youtube.com/watch?v=..."}
    or: {"source": "r2://uploads/abc123.mp4"}  (after a successful /upload-url + PUT)
    """
    source = payload.get("source")
    if not source:
        raise HTTPException(status_code=400, detail="Missing 'source' in request body")

    job_id = jobs.create_job(source=source)
    background_tasks.add_task(run_pipeline, job_id, source)
    return {"job_id": job_id, "status": "queued"}


@router.get("/jobs/{job_id}")
def get_job_status(job_id: str):
    job = jobs.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job