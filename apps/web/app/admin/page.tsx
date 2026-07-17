"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserRole } from "@galaxy/types";

interface Row {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  status: string;
  groupName: string | null;
  disabled: boolean;
  emailVerified: boolean;
  lastSignInAt: string | null;
}

const ROLES: UserRole[] = ["student", "teacher", "admin"];

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  // invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.status === 403) {
      setError("Admins only.");
      setLoading(false);
      return;
    }
    if (res.ok) setRows(((await res.json()) as { users: Row[] }).users);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(
      (r) => (r.email ?? "").toLowerCase().includes(t) || (r.displayName ?? "").toLowerCase().includes(t),
    );
  }, [rows, q]);

  async function act(uid: string, body: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    setBusyUid(uid);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setNotice((data.error as string) ?? "Action failed");
        return null;
      }
      await load();
      return data;
    } finally {
      setBusyUid(null);
    }
  }

  async function onRole(uid: string, role: UserRole) {
    await act(uid, { action: "setRole", role });
    setNotice(`Role changed to ${role}. The user must sign in again.`);
  }
  async function onToggleDisabled(r: Row) {
    await act(r.uid, { action: "setStatus", disabled: !r.disabled });
  }
  async function onReset(r: Row) {
    const data = await act(r.uid, { action: "resetPassword", email: r.email });
    if (data?.link) setNotice(`Password reset link for ${r.email}: ${data.link as string}`);
  }
  async function onGroup(r: Row) {
    const name = window.prompt(`Assign ${r.displayName ?? r.email} to which class/group?`, r.groupName ?? "");
    if (name === null) return;
    await act(r.uid, { action: "setGroup", groupId: name ? name.toLowerCase().replace(/\s+/g, "-") : null, groupName: name || null });
  }
  async function onDelete(r: Row) {
    if (!window.confirm(`Permanently delete ${r.email}? This cannot be undone.`)) return;
    await act(r.uid, { action: "delete" });
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, displayName: inviteName || undefined }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      setNotice((data.error as string) ?? "Invite failed");
      return;
    }
    setInviteEmail("");
    setInviteName("");
    await load();
    setNotice(`Teacher invited. Set-password link: ${data.setupLink as string}`);
  }

  if (error) {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-muted">{error}</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold">Admin console</h1>
      <p className="mt-1 text-sm text-muted">Full control over all accounts across students, teachers and admins.</p>

      {/* Invite teacher */}
      <form onSubmit={invite} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-panel/70 p-5">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Invite teacher — email</span>
          <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="mt-1 w-64 rounded-lg border border-border bg-black/20 px-3 py-2 text-sm outline-none focus:border-brand" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-muted">Name (optional)</span>
          <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} className="mt-1 w-48 rounded-lg border border-border bg-black/20 px-3 py-2 text-sm outline-none focus:border-brand" />
        </label>
        <button type="submit" className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-black">Invite</button>
      </form>

      {notice && (
        <div className="mt-4 break-all rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-foreground">
          {notice}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <input placeholder="Search email or name…" value={q} onChange={(e) => setQ(e.target.value)} className="w-72 rounded-lg border border-border bg-black/20 px-3 py-2 text-sm outline-none focus:border-brand" />
        <span className="text-xs text-muted">{filtered.length} users</span>
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-white/5 text-[.65rem] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Group</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Last sign-in</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted">No users.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.uid} className="border-t border-border/60">
                  <td className="px-3 py-3">
                    <div className="font-medium text-foreground">{r.displayName ?? "—"}</div>
                    <div className="text-xs text-muted">{r.email} {r.emailVerified ? "" : "· unverified"}</div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={r.role}
                      disabled={busyUid === r.uid}
                      onChange={(e) => onRole(r.uid, e.target.value as UserRole)}
                      className="rounded-md border border-border bg-black/20 px-2 py-1 text-sm capitalize outline-none focus:border-brand"
                    >
                      {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">{r.role === "student" ? (r.groupName ?? "—") : "—"}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.disabled ? "bg-red-500/15 text-red-400" : "bg-success/15 text-success"}`}>
                      {r.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted">{r.lastSignInAt ? new Date(r.lastSignInAt).toLocaleDateString() : "never"}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {r.role === "student" && (
                        <button type="button" disabled={busyUid === r.uid} onClick={() => onGroup(r)} className="rounded-md border border-border px-2 py-1 text-xs hover:border-brand disabled:opacity-50">Group</button>
                      )}
                      <button type="button" disabled={busyUid === r.uid} onClick={() => onReset(r)} className="rounded-md border border-border px-2 py-1 text-xs hover:border-brand disabled:opacity-50">Reset password</button>
                      <button type="button" disabled={busyUid === r.uid} onClick={() => onToggleDisabled(r)} className="rounded-md border border-border px-2 py-1 text-xs hover:border-brand disabled:opacity-50">{r.disabled ? "Enable" : "Disable"}</button>
                      <button type="button" disabled={busyUid === r.uid} onClick={() => onDelete(r)} className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
