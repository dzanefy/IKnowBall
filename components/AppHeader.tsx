export default function AppHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xl font-extrabold tracking-tight">
            iknow<span className="text-lime-400">ball</span>
          </p>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Premier League 2026/27
          </p>
        </div>

        <div className="hidden text-center md:block">
          <p className="text-sm font-semibold text-slate-300">
            Football intelligence
          </p>
          <p className="text-xs text-slate-500">
            Fixtures · form · predictions
          </p>
        </div>

        <span className="rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-300">
          AI-powered
        </span>
      </div>
    </header>
  );
}