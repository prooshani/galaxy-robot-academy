"use client";
// Account: cadet identity (3D Suit Forge) + editable profile fields.

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { normalizeSuit, type AnyProfile, type SuitConfig } from "@galaxy/types";
import { uploadAvatar } from "@/lib/firebase/storage-client";
import { useUser } from "@/app/contexts/UserContext";

// WebGL can't server-render — load 3D on the client only.
const SuitStudio = dynamic(() => import("@/components/suit/SuitStudio"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-panel/50">
      <span className="stamp-label text-xs text-muted">Booting suit forge…</span>
    </div>
  ),
});
const SuitAvatar3D = dynamic(() => import("@/components/suit/SuitAvatar3D").then((m) => m.SuitAvatar3D), {
  ssr: false,
  loading: () => <div className="size-full rounded-full bg-black/30" />,
});

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: string;
}) {
  return (
    <label className="block">
      <span className="stamp-label flex items-center gap-1 text-[.58rem] text-muted">
        {icon && <span aria-hidden>{icon}</span>}
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-black/30 px-3 py-2.5 text-sm outline-none transition placeholder:text-muted/50 focus:border-brand focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(175,80,255,0.18)]"
      />
    </label>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-panel/70 p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/12 text-lg" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold leading-tight">{title}</h2>
          {subtitle && <p className="text-[.7rem] text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function HudStat({ icon, value, label, tint }: { icon: string; value: React.ReactNode; label: string; tint?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-black/25 px-3 py-2">
      <span className="text-lg leading-none" aria-hidden>{icon}</span>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-bold" style={tint ? { color: tint } : undefined}>{value}</div>
        <div className="stamp-label text-[.48rem] text-muted">{label}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-black/20 px-3 py-3 transition hover:border-brand/40">
      <div className="stamp-label flex items-center gap-1 text-[.52rem] text-muted">
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-foreground">{value ?? "—"}</div>
    </div>
  );
}

const BADGE_SLOTS = [
  { icon: "🚀", label: "Liftoff" },
  { icon: "🛰️", label: "Orbit" },
  { icon: "🤖", label: "Builder" },
  { icon: "🧠", label: "Genius" },
  { icon: "⭐", label: "Star" },
  { icon: "🏆", label: "Champion" },
];

function BadgeSlot({ earned, icon, label }: { earned: boolean; icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`grid size-12 place-items-center rounded-full border text-xl transition ${
          earned
            ? "border-energy/70 bg-energy/15 shadow-[0_0_14px_rgba(246,200,95,0.35)]"
            : "border-border bg-black/30 opacity-45"
        }`}
      >
        {earned ? icon : "🔒"}
      </div>
      <span className="stamp-label text-[.46rem] text-muted">{label}</span>
    </div>
  );
}

const s = (v: unknown) => (typeof v === "string" ? v : "");

export default function AccountPage() {
  const { refreshProfile } = useUser();
  const [profile, setProfile] = useState<AnyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Last suit config persisted to Firestore — guards the auto-save effect.
  const savedSuitRef = useRef<string | null>(null);

  // shared
  const [displayName, setDisplayName] = useState("");
  const [suit, setSuit] = useState<SuitConfig>(() => normalizeSuit(null));
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  // student
  const [school, setSchool] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  // teacher
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  function hydrate(p: AnyProfile) {
    setProfile(p);
    setDisplayName(s(p.displayName));
    const hydratedSuit = normalizeSuit(p.suit);
    setSuit(hydratedSuit);
    savedSuitRef.current = JSON.stringify(hydratedSuit);
    setPhotoURL(p.photoURL ?? null);
    setFirstName(s(p.personal?.firstName));
    setLastName(s(p.personal?.lastName));
    setDateOfBirth(s(p.personal?.dateOfBirth));
    setBio(s(p.personal?.bio));
    setPhone(s(p.contact?.phone));
    setCity(s(p.contact?.address?.city));
    setCountry(s(p.contact?.address?.country));
    setTimezone(s(p.contact?.timezone));
    if (p.role === "student") {
      setSchool(s(p.personal?.school));
      setGradeLevel(s(p.personal?.gradeLevel));
      setGuardianName(s(p.personal?.guardianName));
      setGuardianEmail(s(p.personal?.guardianEmail));
    }
    if (p.role === "teacher") {
      setTitle(s(p.teaching?.title));
      setSubjects((p.teaching?.subjects ?? []).join(", "));
      setYearsExperience(p.teaching?.yearsExperience != null ? String(p.teaching.yearsExperience) : "");
    }
  }

  async function load() {
    setLoading(true);
    const res = await fetch("/api/user/profile", { cache: "no-store" });
    if (res.ok) hydrate((await res.json()) as AnyProfile);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  // Auto-persist the chosen suit to Firestore the moment it changes, so the
  // cadet's 3D identity is adopted across the app without a manual save.
  useEffect(() => {
    if (!profile) return;
    const key = JSON.stringify(suit);
    if (savedSuitRef.current === key) return;
    savedSuitRef.current = key;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suit }),
        });
        if (res.ok && !cancelled) await refreshProfile();
      } catch {
        /* non-blocking; the Save button remains a fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [suit, profile, refreshProfile]);

  const completion = useMemo(() => {
    const checks = [!!displayName, true, !!firstName, !!lastName, !!country, !!bio, !!phone];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [displayName, firstName, lastName, country, bio, phone]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const url = await uploadAvatar(file);
      setPhotoURL(url);
      await refreshProfile();
      setMsg("Photo uploaded.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    if (!profile) return;
    setBusy(true);
    setMsg(null);
    const patch: Record<string, unknown> = {
      displayName,
      suit,
      contact: {
        phone: phone || null,
        timezone: timezone || null,
        address: { city: city || null, country: country || null },
      },
      personal: {
        firstName: firstName || null,
        lastName: lastName || null,
        dateOfBirth: dateOfBirth || null,
        bio: bio || null,
        ...(profile.role === "student"
          ? {
              school: school || null,
              gradeLevel: gradeLevel || null,
              guardianName: guardianName || null,
              guardianEmail: guardianEmail || null,
            }
          : {}),
      },
    };
    if (profile.role === "teacher") {
      patch.teaching = {
        title: title || null,
        bio: bio || null,
        subjects: subjects.split(",").map((x) => x.trim()).filter(Boolean),
        yearsExperience: yearsExperience ? Number(yearsExperience) : null,
      };
    }
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Save failed");
      hydrate((await res.json()) as AnyProfile);
      await refreshProfile();
      setMsg("Profile saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted" role="status">Loading your profile…</p>
      </main>
    );
  }
  if (!profile) {
    return (
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-muted">Profile unavailable.</p>
      </main>
    );
  }

  const roleLabel = profile.role === "admin" ? "Admin" : profile.role === "teacher" ? "Capitan" : "Cadet";
  const g = profile.role === "student" ? profile.gamification : null;
  const level = g?.level ?? 1;
  const ge = g?.totalGE ?? 0;
  const streak = g?.streakDays ?? 0;
  const badges = g?.badgeIds.length ?? 0;
  const rank = g?.rankId ?? "cadet";

  return (
    <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(420px,1fr)_1.05fr] lg:items-start">
        {/* ===== Suit Forge — the 3D character selector, ~80vh, sticky ===== */}
        <section className="lg:sticky lg:top-20">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <span className="stamp-label text-[.6rem] text-halo">CADET IDENTITY</span>
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold">Suit Forge</h2>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-brand hover:text-foreground disabled:opacity-60"
            >
              {busy ? "Working…" : photoURL ? "Change photo" : "Upload photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </div>
          <div className="h-[82vh] min-h-[600px]">
            <SuitStudio value={suit} onChange={setSuit} className="h-full" />
          </div>
        </section>

        {/* ===== Cadet dossier (game profile) ===== */}
        <div className="flex flex-col gap-5">
          {/* HUD header */}
          <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-[#0b1020] p-5">
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/10 blur-3xl" aria-hidden />
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="size-[92px] overflow-hidden rounded-2xl border border-brand/40 bg-black/40 shadow-[0_0_20px_rgba(175,80,255,0.25)]">
                  {photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoURL} alt="Your avatar" className="size-full object-cover" />
                  ) : (
                    <SuitAvatar3D modelId={suit.modelId} size={92} />
                  )}
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[.55rem] font-bold text-black shadow">
                  LV {level}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 text-[.6rem] font-semibold uppercase tracking-widest text-brand">
                  {roleLabel}
                </span>
                <h1 className="mt-1.5 truncate font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold">{displayName || roleLabel}</h1>
                <p className="truncate text-xs text-muted">{profile.email}</p>
              </div>
            </div>

            {/* HUD stat row */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <HudStat icon="⚡" value={ge.toLocaleString()} label="Galaxy Energy" tint="var(--color-energy)" />
              <HudStat icon="🔥" value={`${streak}d`} label="Day Streak" />
              <HudStat icon="🎖️" value={rank} label="Rank" />
            </div>

            {/* Clearance bar */}
            <div className="mt-4">
              <div className="flex justify-between">
                <span className="stamp-label text-[.55rem] text-muted">CADET CLEARANCE</span>
                <span className="stamp-label text-[.55rem] text-brand">{completion}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-brand to-halo transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </section>

          {/* Badge shelf */}
          <section className="rounded-2xl border border-border bg-panel/70 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-energy/15 text-lg" aria-hidden>🏆</span>
                <div>
                  <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold leading-tight">Badge Vault</h2>
                  <p className="text-[.7rem] text-muted">{badges} earned · keep flying to unlock more</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {BADGE_SLOTS.map((b, i) => (
                <BadgeSlot key={b.label} earned={i < badges} icon={b.icon} label={b.label} />
              ))}
            </div>
          </section>

          {/* Cadet file */}
          <SectionCard icon="📋" title="Cadet File" subtitle="How the Academy knows you">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Callsign" icon="📛" value={displayName} onChange={setDisplayName} placeholder="Star Commander" />
              <Field label="Date of birth" icon="🎂" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
              <Field label="First name" value={firstName} onChange={setFirstName} />
              <Field label="Last name" value={lastName} onChange={setLastName} />
            </div>
            <label className="mt-4 block">
              <span className="stamp-label flex items-center gap-1 text-[.58rem] text-muted"><span aria-hidden>📖</span>MISSION LOG (BIO)</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell the crew about your missions…"
                className="mt-1.5 w-full rounded-xl border border-border bg-black/30 px-3 py-2.5 text-sm outline-none transition placeholder:text-muted/50 focus:border-brand focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(175,80,255,0.18)]"
              />
            </label>
          </SectionCard>

          {/* Comms & coordinates */}
          <SectionCard icon="📡" title="Comms & Coordinates" subtitle="Where in the galaxy are you">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Comms channel (phone)" icon="📞" value={phone} onChange={setPhone} placeholder="+41 79 …" />
              <Field label="Time zone" icon="🕐" value={timezone} onChange={setTimezone} placeholder="Europe/Zurich" />
              <Field label="Home base (city)" icon="🏙️" value={city} onChange={setCity} />
              <Field label="Homeworld (country)" icon="🌍" value={country} onChange={setCountry} placeholder="CH" />
            </div>
          </SectionCard>

          {/* Role-specific: STUDENT */}
          {profile.role === "student" && (
            <>
              <SectionCard icon="🎓" title="Academy & Guardian" subtitle="School crew & flight supervisor">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="School" icon="🏫" value={school} onChange={setSchool} />
                  <Field label="Grade level" icon="📶" value={gradeLevel} onChange={setGradeLevel} />
                  <Field label="Guardian name" icon="🧑‍🚀" value={guardianName} onChange={setGuardianName} />
                  <Field label="Guardian email" icon="✉️" value={guardianEmail} onChange={setGuardianEmail} type="email" />
                </div>
              </SectionCard>
              <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard icon="⭐" label="Level" value={level} />
                <StatCard icon="⚡" label="Galaxy Energy" value={ge.toLocaleString()} />
                <StatCard icon="🏆" label="Badges" value={badges} />
                <StatCard icon="🔥" label="Streak" value={`${streak}d`} />
                <StatCard icon="📚" label="Courses" value={profile.courses.length} />
                <StatCard icon="🎖️" label="Rank" value={rank} />
                <StatCard icon="🚀" label="Plan" value={profile.subscription.plan} />
                <StatCard icon="🎟️" label="Invite code" value={profile.affiliate.code ?? "—"} />
              </section>
            </>
          )}

          {/* Role-specific: TEACHER */}
          {profile.role === "teacher" && (
            <>
              <SectionCard icon="🧑‍🚀" title="Flight Instructor" subtitle="Your teaching profile">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" icon="🏷️" value={title} onChange={setTitle} placeholder="Flight Instructor" />
                  <Field label="Years of experience" icon="📈" value={yearsExperience} onChange={setYearsExperience} type="number" />
                  <div className="sm:col-span-2">
                    <Field label="Subjects" icon="🧪" value={subjects} onChange={setSubjects} placeholder="Robotics, Python" />
                  </div>
                </div>
              </SectionCard>
              <section className="grid grid-cols-3 gap-3">
                <StatCard icon="✅" label="Verified" value={profile.teaching.verified ? "Yes" : "No"} />
                <StatCard icon="👥" label="Cohorts" value={profile.teaching.cohortIds.length} />
                <StatCard icon="📚" label="Courses" value={profile.teaching.managedCourseIds.length} />
              </section>
            </>
          )}

          {/* Role-specific: ADMIN */}
          {profile.role === "admin" && (
            <section className="grid grid-cols-3 gap-3">
              <StatCard icon="🔑" label="Access level" value={profile.admin.accessLevel} />
              <StatCard icon="🛡️" label="Permissions" value={profile.admin.permissions.length} />
              <StatCard icon="📡" label="Status" value={profile.status} />
            </section>
          )}

          {/* Save */}
          <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-2xl border border-border bg-panel/90 p-3 backdrop-blur">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="zerog rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(175,80,255,0.35)] transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? "Saving…" : "🚀 Save cadet profile"}
            </button>
            {msg && <span className="text-sm font-medium text-brand" role="status">{msg}</span>}
          </div>
        </div>
      </div>
    </main>
  );
}
