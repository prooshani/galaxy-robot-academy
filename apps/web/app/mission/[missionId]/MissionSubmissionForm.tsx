"use client";

import { useState, type FormEvent } from "react";
import { useSubmissions } from "@/app/contexts/SubmissionsContext";
import { useUser } from "@/app/contexts/UserContext";

export function MissionSubmissionForm({ missionId }: { missionId: string }) {
  const { addSubmission } = useSubmissions();
  const { user, setMissionStatus } = useUser();
  const [codeSnippet, setCodeSnippet] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedCodeSnippet = codeSnippet.trim();

    if (!trimmedCodeSnippet) {
      return;
    }

    addSubmission({
      missionId,
      userId: user.id,
      codeSnippet: trimmedCodeSnippet,
    });
    setMissionStatus(missionId, "submitted");
    setSubmitted(true);
    setCodeSnippet("");
  };

  return (
    <section className="rounded-lg border border-blue-500/30 bg-[#111827] p-5 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-blue-300">
        Submit Solution
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="code-snippet" className="sr-only">
          Code snippet
        </label>
        <textarea
          id="code-snippet"
          value={codeSnippet}
          onChange={(event) => setCodeSnippet(event.target.value)}
          rows={8}
          placeholder="Paste your code snippet here..."
          className="w-full rounded-lg border border-blue-500/30 bg-[#0d1225] p-3 font-mono text-sm text-gray-100 transition-colors placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:border-cyan-400 hover:text-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            aria-label="Submit Mission"
          >
            Submit Mission
          </button>
          {submitted && (
            <p className="text-sm font-medium text-green-400">
              Submission received. Your teacher can now review it.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
