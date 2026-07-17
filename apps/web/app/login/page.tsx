"use client";

import { useEffect, useState, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  type Role,
} from "@/lib/firebase/auth";
import { getRecaptchaToken } from "@/lib/recaptcha-client";
import { canTeach } from "@galaxy/types";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

type Lane = "student" | "teacher";
type Mode = "signin" | "signup";

function destForRole(role: Role): string {
  return canTeach(role) ? "/teacher" : "/student";
}

// Boot log printed on the readout rail when the terminal powers up.
const BOOT_LINES = [
  "PWR ......... ONLINE",
  "LIFE SUPPORT  NOMINAL",
  "COMMS LINK .. LOCKED",
  "AIRLOCK 07 .. SEALED",
  "AWAITING CREW ID",
];

export default function LoginPage() {
  const router = useRouter();
  const [lane, setLane] = useState<Lane>("student");
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Teachers are provisioned by the Academy — no self sign-up in this lane.
  const canSignUp = lane === "student";
  const effectiveMode: Mode = canSignUp ? mode : "signin";

  function selectLane(next: Lane) {
    setLane(next);
    setMode("signin");
    setError(null);
  }

  async function finish(role: Role) {
    router.push(destForRole(role));
  }

  // Run the reCAPTCHA Enterprise gate before any auth call. Throws on failure.
  async function verifyHuman(action: "LOGIN" | "SIGNUP") {
    if (!RECAPTCHA_SITE_KEY) return; // No key configured -> skip (dev fallback).
    const token = await getRecaptchaToken(action);
    const res = await fetch("/api/auth/recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });
    if (!res.ok) throw new Error("Security check failed. Please try again.");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (effectiveMode === "signup") {
        await verifyHuman("SIGNUP");
        await finish(await signUpWithEmail(email, password, displayName || undefined));
      } else {
        await verifyHuman("LOGIN");
        await finish(await signInWithEmail(email, password));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      await verifyHuman("LOGIN");
      const role = await signInWithGoogle();
      await finish(role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const status = error ? "err" : busy ? "busy" : "ok";

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-10"
    >
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <div className="console-screen relative w-full max-w-4xl">
        <span className="console-notch notch-tl" aria-hidden />
        <span className="console-notch notch-tr" aria-hidden />
        <span className="console-notch notch-bl" aria-hidden />
        <span className="console-notch notch-br" aria-hidden />
        <span className="console-tag">Access Terminal · Airlock 07</span>

        {/* Scanning beam sweeps the whole console while credentials verify */}
        {busy && <span className="auth-scan" aria-hidden />}

        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* ——— Readout rail: live ship systems ——— */}
          <aside className="relative hidden flex-col justify-between border-r border-border/60 p-8 md:flex">
            <div>
              <p className="stamp-label text-[.6rem] text-muted">
                GX-A Orbital Platform
              </p>
              <h2 className="display-serif mt-3 text-4xl text-halo">
                {lane === "teacher" ? "Command deck" : "Crew entry"}
              </h2>

              <div className="stamp-label mt-8 space-y-2 text-[.62rem] leading-relaxed text-muted">
                {BOOT_LINES.map((line, i) => (
                  <p
                    key={line}
                    className="boot-line"
                    style={{ animationDelay: `${i * 160}ms` }}
                  >
                    <span className="mr-2 text-brand-secondary/80">▸</span>
                    {line}
                    {i === BOOT_LINES.length - 1 && (
                      <span className="boot-cursor ml-2" aria-hidden />
                    )}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Live status row reacts to auth state */}
              <div className="flex items-center gap-3">
                <span className={`term-dot term-dot-${status}`} aria-hidden />
                <span className="stamp-label text-[.6rem] text-muted">
                  {error
                    ? "Access fault"
                    : busy
                      ? "Verifying credentials"
                      : "Channel secure"}
                </span>
                <span className="stamp-label ml-auto text-[.6rem] tabular-nums text-muted/70">
                  T {clock}
                </span>
              </div>
              <div className="instrument-row static! flex">
                <span className="inst-cyan inst-blink" />
                <span className="inst-violet" />
                <span className="inst-amber inst-blink" style={{ animationDelay: "-1.8s" }} />
                <span className="inst-cyan" />
                <span className="inst-violet inst-blink" style={{ animationDelay: "-.7s" }} />
              </div>
              <div className="barcode h-8 w-40 opacity-60" aria-hidden />
            </div>
          </aside>

          {/* ——— Credential entry ——— */}
          <section className="relative p-6 sm:p-8">
            {/* Lane switch: chamfered hardware toggle, not a web pill */}
            <div
              role="tablist"
              aria-label="Choose entry"
              className="chamfer mb-7 grid grid-cols-2 border border-border bg-black/30 p-1"
            >
              {(["student", "teacher"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lane === l}
                  onClick={() => selectLane(l)}
                  className={`chamfer-sm stamp-label px-4 py-2.5 text-[.65rem] transition-colors duration-150 ${
                    lane === l
                      ? "bg-brand text-black shadow-[0_0_18px_rgb(175_80_255/.35)]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {l === "student" ? "Cadet" : "Command"}
                </button>
              ))}
            </div>

            <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold holo-title">
              {lane === "teacher"
                ? "Mission Control sign-in"
                : effectiveMode === "signin"
                  ? "Welcome back, cadet"
                  : "Join the Academy"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {lane === "teacher"
                ? "Teacher accounts are issued by the Academy. Sign in to open Mission Control."
                : effectiveMode === "signin"
                  ? "Sign in to resume your missions."
                  : "Create a student account to launch your first mission."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {effectiveMode === "signup" && (
                <label className="block">
                  <span className="stamp-label text-[.62rem] text-muted">
                    Crew name
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                    className="term-input mt-1.5 w-full px-3 py-2"
                  />
                </label>
              )}
              <label className="block">
                <span className="stamp-label text-[.62rem] text-muted">
                  Crew ID · Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="cadet@galaxy.academy"
                  className="term-input mt-1.5 w-full px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="stamp-label text-[.62rem] text-muted">
                  Access code · Password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    effectiveMode === "signin" ? "current-password" : "new-password"
                  }
                  placeholder="••••••••"
                  className="term-input mt-1.5 w-full px-3 py-2"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="term-alert chamfer-sm px-3 py-2.5 text-sm text-danger"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="term-engage chamfer stamp-label w-full bg-brand px-4 py-3 text-[.7rem] font-bold text-black disabled:opacity-60"
              >
                {busy
                  ? "Authenticating…"
                  : effectiveMode === "signin"
                    ? "Initiate docking"
                    : "Enlist cadet"}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-border/70" />
              <span className="stamp-label text-[.58rem] text-muted/70">
                External uplink
              </span>
              <span className="h-px flex-1 bg-border/70" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="term-engage chamfer stamp-label mt-4 w-full border border-border bg-black/25 px-4 py-3 text-[.7rem] text-foreground hover:border-brand-secondary/50 disabled:opacity-60"
            >
              Continue with Google
            </button>

            {canSignUp && (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                }}
                className="mt-6 w-full text-center text-sm text-muted underline-offset-4 hover:text-halo hover:underline"
              >
                {mode === "signin"
                  ? "Need an account? Sign up"
                  : "Already enrolled? Sign in"}
              </button>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
