"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layout } from "@galaxy/ui";
import { canTeach } from "@galaxy/types";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { TeacherMissionForm } from "@/components/TeacherMissionForm";

export default function NewMissionPage() {
  const { user } = useUser(); const router = useRouter(); const { addMission } = useMissionsContext();
  if (!canTeach(user.role)) return <Layout title="Create Mission"><p>Access denied. <Link href="/login" className="text-brand underline">Sign in as a teacher</Link>.</p></Layout>;
  return <Layout><main className="mx-auto max-w-4xl space-y-6"><header><Link href="/teacher" className="text-sm text-brand hover:underline">← Mission Control</Link><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-brand">Mission authoring</p><h1 className="mt-2 text-3xl font-bold">Create mission</h1><p className="mt-2 text-muted">Build next academy transmission using existing curriculum fields.</p></header><TeacherMissionForm onSave={(input) => { addMission(input); router.push("/teacher"); }} /></main></Layout>;
}
