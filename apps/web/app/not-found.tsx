import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-xl rounded-3xl border border-brand-secondary/35 bg-panel/80 p-8 text-center shadow-[var(--shadow-panel)] sm:p-10" aria-labelledby="mission-not-found-title">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Navigation scan</p>
        <div className="mx-auto mt-5 flex size-16 items-center justify-center rounded-2xl border border-brand/35 bg-brand/10 text-3xl text-brand" aria-hidden="true">◇</div>
        <h1 id="mission-not-found-title" className="mt-5 font-display text-3xl font-bold text-foreground">Mission not found</h1>
        <p className="mt-3 text-base leading-7 text-muted">This transmission drifted outside the mission journey. Return to the Engineering Bay list and choose an active mission.</p>
        <Link href="/student" className="mt-7 inline-flex min-h-11 items-center rounded-xl border border-brand bg-brand px-4 text-sm font-semibold text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Return to mission journey</Link>
      </section>
    </main>
  );
}
