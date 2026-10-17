"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createJob, getUploadUrl, uploadFileToR2 } from "@/lib/api";

type Mode = "link" | "file";

export default function UploadForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("link");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      let source: string;

      if (mode === "link") {
        if (!url.trim()) throw new Error("الصق رابط يوتيوب الأول");
        source = url.trim();
      } else {
        if (!file) throw new Error("اختار فيديو الأول");
        const { upload_url, key } = await getUploadUrl(file.name);
        await uploadFileToR2(upload_url, file);
        source = `r2://${key}`;
      }

      const job = await createJob(source);
      router.push(`/jobs/${job.job_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حصل خطأ غير متوقع");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2 mb-4" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "link"}
          onClick={() => setMode("link")}
          className={[
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === "link" ? "bg-gold text-bg" : "bg-bg-card text-ink-muted hover:text-ink",
          ].join(" ")}
        >
          رابط يوتيوب
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "file"}
          onClick={() => setMode("file")}
          className={[
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === "file" ? "bg-gold text-bg" : "bg-bg-card text-ink-muted hover:text-ink",
          ].join(" ")}
        >
          رفع فيديو
        </button>
      </div>

      {mode === "link" ? (
        <input
          type="url"
          inputMode="url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          dir="ltr"
          className="w-full bg-bg-card border border-line rounded-xl px-5 py-4 text-ink placeholder:text-ink-muted text-left focus:border-gold outline-none transition-colors"
        />
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-bg-card border-2 border-dashed border-line rounded-xl px-5 py-8 text-center cursor-pointer hover:border-gold transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-ink">
            {file ? file.name : "اضغط هنا واختار فيديو أو صوت"}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 text-danger text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full bg-gold hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg font-bold text-lg rounded-xl px-6 py-4 transition-colors"
      >
        {busy ? "جاري الرفع..." : "ابدأ التقطيع"}
      </button>
    </form>
  );
}
