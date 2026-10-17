import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-xl">
        {/* Wordmark */}
        <div className="flex items-center gap-2 mb-14 justify-center">
          <span className="w-2 h-2 rounded-full bg-leaf" />
          <span className="text-ink-muted text-sm font-mono tracking-wide">ZATOONA</span>
        </div>

        {/* Hero: the thesis, shown not told -- long horizontal video becomes short vertical clips */}
        <div className="flex items-center justify-center gap-6 mb-10" aria-hidden="true">
          <div className="w-32 h-20 rounded-lg border border-line bg-bg-card flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-ink-muted" />
          </div>

          <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="text-gold shrink-0">
            <path d="M28 8L20 1v5H0v4h20v5l8-7z" fill="currentColor" transform="scale(-1,1) translate(-28,0)" />
          </svg>

          <div className="w-14 h-24 rounded-lg border-2 border-gold bg-bg-card flex flex-col items-center justify-end gap-1 p-1.5 shrink-0">
            <div className="w-8 h-1 rounded-full bg-leaf-bright" />
            <div className="w-6 h-1 rounded-full bg-leaf-bright/70" />
          </div>
          <div className="w-14 h-24 rounded-lg border-2 border-gold bg-bg-card flex flex-col items-center justify-end gap-1 p-1.5 shrink-0">
            <div className="w-8 h-1 rounded-full bg-leaf-bright" />
            <div className="w-6 h-1 rounded-full bg-leaf-bright/70" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-center leading-tight mb-4">
          فيديو طويل، يطلع منه
          <br />
          <span className="text-gold">أقوى اللحظات</span>
        </h1>
        <p className="text-ink-muted text-center text-lg mb-12">
          ارفع فيديو أو حط رابط يوتيوب، وهنجهزلك مقاطع قصيرة بترجمة عربي صح، جاهزة للنشر.
        </p>

        <UploadForm />
      </div>
    </main>
  );
}
