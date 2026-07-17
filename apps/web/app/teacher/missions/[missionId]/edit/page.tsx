"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@galaxy/ui";
import { canTeach } from "@galaxy/types";
import { useMissionsContext } from "@/app/contexts/MissionsContext";
import { useUser } from "@/app/contexts/UserContext";
import { TeacherMissionForm } from "@/components/TeacherMissionForm";

export default function EditMissionPage() {
  const { user } = useUser(); const router = useRouter(); const params = useParams(); const { missions, updateMission } = useMissionsContext();
  const missionId = Array.isArray(params.missionId) ? params.missionId[0] : params.missionId; const mission = missions.find((item) => item.missionId === missionId);
  if (!canTeach(user.role)) return <Layout title="Edit Mission"><p>Access denied. <Link href="/login" className="text-brand underline">Sign in as a teacher</Link>.</p></Layout>;
  if (!mission) return <Layout><main className="mx-auto max-w-xl surface rounded-2xl p-8 text-center"><p className="text-xs font-bold uppercase tracking-widest text-danger">Invalid mission ID</p><h1 className="mt-3 text-2xl font-bold">Mission not found</h1><p className="mt-2 text-muted">Mission may have been deleted from this device.</p><Link href="/teacher" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-brand px-5 font-bold text-slate-950">Return to Mission Control</Link></main></Layout>;
  return <Layout><main className="mx-auto max-w-4xl space-y-6"><header><Link href="/teacher" className="text-sm text-brand hover:underline">← Mission Control</Link><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-brand">Session {mission.sessionNumber}</p><h1 className="mt-2 text-3xl font-bold">Edit {mission.title}</h1><p className="mt-2 text-muted">Update briefing, tasks, and rewards.</p></header><TeacherMissionForm mission={mission} onSave={(input) => { updateMission(mission.missionId, input); router.push("/teacher"); }} /></main></Layout>;
}
