import type { JobStatus } from "@/lib/api";

const STAGES: { key: JobStatus; label: string }[] = [
  { key: "queued", label: "في الانتظار" },
  { key: "ingesting", label: "تحميل الفيديو" },
  { key: "transcribing", label: "تفريغ الصوت" },
  { key: "refining", label: "تدقيق النص" },
  { key: "scoring", label: "اختيار أفضل اللحظات" },
  { key: "rendering", label: "تجهيز المقاطع" },
  { key: "uploading", label: "رفع النتائج" },
  { key: "done", label: "تم" },
];

export default function StageTracker({ status }: { status: JobStatus }) {
  const currentIndex = STAGES.findIndex((s) => s.key === status);
  const isFailed = status === "failed";

  return (
    <div className="w-full" role="status" aria-live="polite">
      {isFailed ? (
        <div className="flex items-center gap-3 text-danger font-medium">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-danger" />
          حصل خطأ أثناء المعالجة
        </div>
      ) : (
        <ol className="flex items-center w-full">
          {STAGES.map((stage, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <li key={stage.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 min-w-[64px]">
                  <span
                    className={[
                      "w-3 h-3 rounded-full border-2 transition-colors duration-500",
                      isDone
                        ? "bg-gold border-gold"
                        : isCurrent
                        ? "bg-leaf border-leaf-bright animate-pulse"
                        : "bg-transparent border-line",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-xs text-center leading-tight max-w-[70px]",
                      isDone || isCurrent ? "text-ink" : "text-ink-muted",
                    ].join(" ")}
                  >
                    {stage.label}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="flex-1 h-px mx-1 relative -translate-y-4">
                    <div className="absolute inset-0 bg-line" />
                    <div
                      className="absolute inset-y-0 right-0 bg-gold transition-all duration-700"
                      style={{ width: isDone ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
