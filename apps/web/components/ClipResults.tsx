import type { ClipResult } from "@/lib/api";

function formatDuration(start: number, end: number): string {
  const secs = Math.round(end - start);
  return `${secs} ثانية`;
}

export default function ClipResults({ clips }: { clips: ClipResult[] }) {
  if (clips.length === 0) {
    return (
      <p className="text-ink-muted text-center py-8">
        مفيش مقاطع طلعت من الفيديو ده. جرب فيديو تاني.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {clips.map((clip, i) => (
        <div key={i} className="bg-bg-card border border-line rounded-xl overflow-hidden flex flex-col">
          <video
            src={clip.url}
            controls
            preload="metadata"
            className="w-full aspect-[9/16] bg-black object-contain"
          />
          <div className="p-4 flex flex-col gap-2">
            <p className="font-bold leading-snug">{clip.title}</p>
            <div className="flex items-center justify-between text-xs text-ink-muted font-mono">
              <span>{formatDuration(clip.start, clip.end)}</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {clip.hook_score}/100
              </span>
            </div>
            <a
              href={clip.url}
              download
              className="mt-2 text-center bg-leaf hover:bg-leaf-bright text-bg font-medium text-sm rounded-lg py-2 transition-colors"
            >
              تحميل المقطع
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
