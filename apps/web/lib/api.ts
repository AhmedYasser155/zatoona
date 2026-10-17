const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type JobStatus =
  | "queued"
  | "ingesting"
  | "transcribing"
  | "refining"
  | "scoring"
  | "rendering"
  | "uploading"
  | "done"
  | "failed";

export interface ClipResult {
  url: string;
  title: string;
  hook_score: number;
  start: number;
  end: number;
}

export interface Job {
  job_id: string;
  source: string;
  status: JobStatus;
  created_at: number;
  clip_urls: ClipResult[];
  error: string | null;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `الطلب فشل (${res.status})`);
  }
  return res.json();
}

/** Step 1 of a file upload: ask the server for a presigned R2 URL. */
export function getUploadUrl(filename: string) {
  return apiFetch<{ upload_url: string; key: string }>("/upload-url", {
    method: "POST",
    body: JSON.stringify({ filename }),
  });
}

/** Step 2: browser uploads the file bytes DIRECTLY to R2 -- never through our server. */
export async function uploadFileToR2(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, { method: "PUT", body: file });
  if (!res.ok) {
    throw new Error("فشل رفع الملف. جرب تاني.");
  }
}

export function createJob(source: string) {
  return apiFetch<{ job_id: string; status: string }>("/jobs", {
    method: "POST",
    body: JSON.stringify({ source }),
  });
}

export function getJob(jobId: string) {
  return apiFetch<Job>(`/jobs/${jobId}`);
}
