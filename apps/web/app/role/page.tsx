"use client";

import { useRouter } from "next/navigation";
import { Layout, PageHeader, Panel, StatusChip } from "@galaxy/ui";
import { useUser } from "@/app/contexts/UserContext";

export default function RoleSelectionPage() {
  const { user, setRole } = useUser();
  const router = useRouter();
  const select = (role: "student" | "teacher") => { setRole(role); router.push(role === "teacher" ? "/teacher" : "/student"); };

  return <Layout><PageHeader eyebrow="Academy entry gate" title="Choose your station" description="Select how you are entering today. You can switch roles here at any time." />
    <div className="grid gap-5 md:grid-cols-2">
      <button type="button" onClick={() => select("student")} aria-pressed={user.role === "student"} className="group rounded-2xl text-left focus-visible:outline-none"><Panel className="h-full border-brand/30 transition group-hover:border-brand group-hover:-translate-y-0.5 group-aria-pressed:border-brand group-aria-pressed:bg-brand/10 motion-reduce:transform-none"><StatusChip tone="info">Student experience</StatusChip><span className="mt-6 block text-3xl text-brand" aria-hidden="true">◇</span><span className="mt-4 block font-display text-2xl font-bold text-foreground">Enter as Student Engineer</span><span className="mt-2 block text-muted">Complete missions, build R0-B0, track Galaxy Energy, and unlock badges.</span><span className="mt-6 block font-semibold text-brand">Open Explorer Cockpit →</span></Panel></button>
      <button type="button" onClick={() => select("teacher")} aria-pressed={user.role === "teacher"} className="group rounded-2xl text-left focus-visible:outline-none"><Panel className="h-full border-brand-secondary/30 transition group-hover:border-brand-secondary group-hover:-translate-y-0.5 group-aria-pressed:border-brand-secondary group-aria-pressed:bg-brand-secondary/10 motion-reduce:transform-none"><StatusChip tone="submitted">Teacher experience</StatusChip><span className="mt-6 block text-3xl text-brand-secondary" aria-hidden="true">▦</span><span className="mt-4 block font-display text-2xl font-bold text-foreground">Enter Mission Control</span><span className="mt-2 block text-muted">Plan missions, review transmissions, give feedback, and manage rewards.</span><span className="mt-6 block font-semibold text-brand-secondary">Open Mission Control →</span></Panel></button>
    </div>
  </Layout>;
}
