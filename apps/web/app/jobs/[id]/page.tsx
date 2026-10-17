"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getJob, type Job } from "@/lib/api";
import StageTracker from "@/components/StageTracker";
import ClipResults from "@/components/ClipResults";

const POLL_INTERVAL_MS = 3000;

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const result = await getJob(id);
        if (cancelled) return;
        setJob(result);
        setPollError(null);

        if (result.status !== "done" && result.status !== "failed") {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        setPollError(err instanceof Error ? err.message : "فشل تحديث حالة الطلب");
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <main className="min-h-screen px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-ink-muted text-sm hover:text-ink transition-colors mb-8 inline-block">
          ← ارفع فيديو تاني
        </Link>

        <div className="bg-bg-card border border-line rounded-2xl p-6 md:p-8 mb-8">
          <p className="text-ink-muted text-xs font-mono mb-6 break-all">{id}</p>

          {job ? (
            <StageTracker status={job.status} />
          ) : (
            <p className="text-ink-muted text-center py-4">جاري تحميل حالة الطلب...</p>
          )}

          {job?.status === "failed" && job.error && (
            <p className="mt-6 text-danger text-sm bg-danger/10 rounded-lg p-4">{job.error}</p>
          )}

          {pollError && (
            <p className="mt-4 text-ink-muted text-xs">{pollError} -- بنحاول تاني...</p>
          )}
        </div>

        {job?.status === "done" && <ClipResults clips={job.clip_urls} />}
      </div>
    </main>
  );
}
