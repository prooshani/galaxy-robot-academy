"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@galaxy/ui";
import { useUser } from "@/app/contexts/UserContext";

export default function RoleSelectionPage() {
  const { setRole } = useUser();
  const router = useRouter();

  const handleSelect = (role: "student" | "teacher") => {
    setRole(role);
    router.push(role === "teacher" ? "/teacher" : "/student");
  };

  return (
    <Layout title="Welcome to Galaxy Robot Academy">
      <p className="mb-8 text-center text-gray-400">
        How will you be using the academy today?
      </p>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => handleSelect("student")}
          className="w-full max-w-xs rounded-lg border border-cyan-500/30 bg-[#111827] p-8 text-center shadow-md transition-colors hover:border-cyan-400 hover:shadow-cyan-950/30 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
          aria-label="Select student role"
        >
          <span className="mb-4 block text-4xl">🚀</span>
          <span className="block text-lg font-semibold text-gray-100">
            I&apos;m a Student
          </span>
          <span className="mt-2 block text-sm text-gray-400">
            Complete missions and earn badges
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("teacher")}
          className="w-full max-w-xs rounded-lg border border-purple-500/30 bg-[#111827] p-8 text-center shadow-md transition-colors hover:border-purple-400 hover:shadow-purple-950/30 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
          aria-label="Select teacher role"
        >
          <span className="mb-4 block text-4xl">👩‍🏫</span>
          <span className="block text-lg font-semibold text-gray-100">
            I&apos;m a Teacher
          </span>
          <span className="mt-2 block text-sm text-gray-400">
            Review submissions and manage missions
          </span>
        </button>
      </div>
    </Layout>
  );
}
