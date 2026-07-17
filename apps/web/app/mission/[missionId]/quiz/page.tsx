"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Panel, ProgressBar, StatusChip } from "@galaxy/ui";
import {
  getMissionById,
  type StudentQuiz,
  type StudentQuizQuestion,
} from "@/lib/academyContent";
import { useUser } from "@/app/contexts/UserContext";
import type { QuestionResult } from "@/lib/quizLogic";

interface AttemptResponse {
  score: number;
  total: number;
  passed: boolean;
  results: QuestionResult[];
  geAwarded: number;
}

function QuestionBlock({
  quiz,
  question,
  index,
  selected,
  onSelect,
  result,
}: {
  quiz: StudentQuiz;
  question: StudentQuizQuestion;
  index: number;
  selected: string[];
  onSelect: (optionId: string) => void;
  result?: QuestionResult;
}) {
  const isSelectAll = question.type === "select-all";
  const inputType = isSelectAll ? "checkbox" : "radio";
  const answered = result !== undefined;

  return (
    <fieldset className="rounded-2xl border border-border bg-panel/75 p-5 sm:p-6" aria-describedby={answered ? `${question.questionId}-feedback` : undefined}>
      <legend className="float-left w-full">
        <span className="text-xs font-bold uppercase tracking-[.14em] text-brand-secondary">
          Question {index + 1} of {quiz.questions.length}
          {isSelectAll && " · Select all that apply"}
        </span>
        <span className="mt-2 block text-base font-semibold leading-7 text-foreground">{question.prompt}</span>
      </legend>
      <div className="clear-both" />
      {question.code && (
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-canvas p-4 font-mono text-sm leading-6 text-foreground">
          <code>{question.code}</code>
        </pre>
      )}
      <div className="mt-4 space-y-2">
        {question.options.map((option) => {
          const checked = selected.includes(option.id);
          const isCorrectOption = answered && result.correctOptionIds.includes(option.id);
          const isWrongPick = answered && checked && !isCorrectOption;
          return (
            <label
              key={option.id}
              className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 transition focus-within:ring-2 focus-within:ring-brand ${
                isCorrectOption
                  ? "border-success/50 bg-success/10"
                  : isWrongPick
                    ? "border-danger/50 bg-danger/10"
                    : checked
                      ? "border-brand/60 bg-brand/10"
                      : "border-border hover:bg-white/5"
              } ${answered ? "cursor-default" : ""}`}
            >
              <input
                type={inputType}
                name={question.questionId}
                value={option.id}
                checked={checked}
                disabled={answered}
                onChange={() => onSelect(option.id)}
                className="mt-1 size-4 accent-[var(--brand,#AF50FF)]"
              />
              <span className="whitespace-pre-wrap font-mono text-sm leading-6 text-foreground">{option.label}</span>
              {isCorrectOption && <span className="ml-auto text-sm font-bold text-success" aria-hidden="true">✓</span>}
              {isWrongPick && <span className="ml-auto text-sm font-bold text-danger" aria-hidden="true">✗</span>}
            </label>
          );
        })}
      </div>
      {answered && (
        <p
          id={`${question.questionId}-feedback`}
          className={`mt-4 rounded-xl border p-3 text-sm leading-6 ${result.correct ? "border-success/35 bg-success/10 text-foreground" : "border-warning/35 bg-warning/10 text-foreground"}`}
        >
          <span className={`font-bold ${result.correct ? "text-success" : "text-warning"}`}>
            {result.correct ? "Correct. " : "Not quite. "}
          </span>
          {result.explanation}
        </p>
      )}
    </fieldset>
  );
}

export default function MissionQuizPage() {
  const params = useParams();
  const { user, authStatus, refreshProfile } = useUser();
  const missionId = Array.isArray(params?.missionId) ? params.missionId[0] : params?.missionId;
  const mission = missionId ? getMissionById(missionId) : undefined;
  const quizId = mission?.quizId;

  // The question sheet (no answer key) is fetched from the server; answers and
  // explanations only ever arrive via the graded attempt response.
  const [quiz, setQuiz] = useState<StudentQuiz | null>(null);
  const [quizStatus, setQuizStatus] = useState<"loading" | "ready" | "error">("loading");
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadQuiz = useCallback(async () => {
    if (!quizId) return;
    setQuizStatus("loading");
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { quiz?: StudentQuiz } | null;
      if (!res.ok || !data?.quiz) {
        setQuizStatus("error");
        return;
      }
      setQuiz(data.quiz);
      setQuizStatus("ready");
    } catch {
      setQuizStatus("error");
    }
  }, [quizId]);

  useEffect(() => {
    if (authStatus === "authed" && quizId) void loadQuiz();
  }, [authStatus, quizId, loadQuiz]);

  const resultByQuestion = useMemo(() => {
    const map = new Map<string, QuestionResult>();
    for (const r of attempt?.results ?? []) map.set(r.questionId, r);
    return map;
  }, [attempt]);

  if (!mission || !quizId) notFound();

  const progress = user.quizzes[quizId];
  const questionCount = quiz?.questions.length ?? 0;
  const answeredCount = quiz ? quiz.questions.filter((q) => (answers[q.questionId] ?? []).length > 0).length : 0;
  const allAnswered = quiz !== null && answeredCount === questionCount;

  const select = (question: StudentQuizQuestion, optionId: string) => {
    if (attempt) return;
    setAnswers((current) => {
      const existing = current[question.questionId] ?? [];
      if (question.type === "select-all") {
        return {
          ...current,
          [question.questionId]: existing.includes(optionId)
            ? existing.filter((id) => id !== optionId)
            : [...existing, optionId],
        };
      }
      return { ...current, [question.questionId]: [optionId] };
    });
  };

  const submit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/quizzes/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = (await res.json().catch(() => null)) as (AttemptResponse & { error?: string }) | null;
      if (!res.ok || !data) {
        setError(data?.error ?? "Transmission failed. Check your connection and try again.");
        return;
      }
      setAttempt(data);
      // Pull the fresh GE total / quiz progress from the server.
      void refreshProfile();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Transmission failed. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const retry = () => {
    setAnswers({});
    setAttempt(null);
    setError("");
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href={`/mission/${mission.missionId}`} className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
          ← Back to {mission.title}
        </Link>
      </nav>

      <header className="rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-panel to-brand-secondary/10 p-6 shadow-[var(--shadow-panel)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Knowledge check · Session {mission.sessionNumber}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{quiz?.title ?? `${mission.title} quiz`}</h1>
        {quiz && (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            {quiz.questions.length} questions · pass with {quiz.passingScore} or more · retry as many times as you like.
            Passing earns {quiz.rewardGE} GE, once.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {progress?.passed && questionCount > 0 && <StatusChip tone="success">Passed · best {progress.bestScore}/{questionCount}</StatusChip>}
          {progress && !progress.passed && progress.attempts > 0 && questionCount > 0 && (
            <StatusChip tone="warning">Best so far {progress.bestScore}/{questionCount} · {progress.attempts} {progress.attempts === 1 ? "attempt" : "attempts"}</StatusChip>
          )}
          {progress?.geAwarded && quiz && <StatusChip tone="info">{quiz.rewardGE} GE earned</StatusChip>}
        </div>
      </header>

      {attempt && quiz && (
        <Panel className={`mt-6 ${attempt.passed ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10"}`} aria-live="polite">
          <p className={`text-xs font-bold uppercase tracking-[.16em] ${attempt.passed ? "text-success" : "text-warning"}`}>
            {attempt.passed ? "Systems check passed" : "Almost there"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
            {attempt.score} of {attempt.total} correct
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary">
            {attempt.passed
              ? attempt.geAwarded > 0
                ? `R0-B0 systems verified! ${attempt.geAwarded} GE added to your total.`
                : "Passed again — GE for this quiz was already earned, and that is safe in the bank."
              : `You need ${quiz.passingScore} to pass. Review the explanations below, then try again — retries are unlimited and never lose GE.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {!attempt.passed && <Button type="button" onClick={retry}>Try again</Button>}
            {attempt.passed && (
              <Link href={`/mission/${mission.missionId}`} className="inline-flex min-h-11 items-center rounded-xl border border-brand bg-brand px-4 text-sm font-semibold text-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                Continue mission
              </Link>
            )}
            {attempt.passed && <Button type="button" variant="secondary" onClick={retry}>Practice again</Button>}
          </div>
        </Panel>
      )}

      {authStatus === "anon" ? (
        <Panel className="mt-6">
          <p className="text-sm leading-6 text-muted">
            <Link href="/login" className="font-semibold text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">Sign in</Link>{" "}
            to take the quiz and save your progress.
          </p>
        </Panel>
      ) : authStatus === "loading" || quizStatus === "loading" ? (
        <Panel className="mt-6"><p className="text-sm text-muted" role="status">Loading the quiz…</p></Panel>
      ) : quizStatus === "error" || !quiz ? (
        <Panel className="mt-6">
          <p className="text-sm leading-6 text-muted" role="alert">Signal lost — the quiz could not be loaded.</p>
          <Button type="button" className="mt-4" onClick={() => void loadQuiz()}>Retry</Button>
        </Panel>
      ) : (
        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => { event.preventDefault(); void submit(); }}
        >
          {!attempt && (
            <div className="rounded-xl border border-border bg-panel/60 p-4">
              <ProgressBar value={answeredCount} max={quiz.questions.length} label="Questions answered" />
            </div>
          )}
          {quiz.questions.map((question, index) => (
            <QuestionBlock
              key={question.questionId}
              quiz={quiz}
              question={question}
              index={index}
              selected={answers[question.questionId] ?? []}
              onSelect={(optionId) => select(question, optionId)}
              result={resultByQuestion.get(question.questionId)}
            />
          ))}
          {error && <p className="rounded-xl border border-danger/50 bg-danger/10 p-3 text-sm text-foreground" role="alert">{error}</p>}
          {!attempt && user.role === "student" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted" aria-live="polite">
                {allAnswered ? "All questions answered. Send it when you are ready." : `${quiz.questions.length - answeredCount} question${quiz.questions.length - answeredCount === 1 ? "" : "s"} left.`}
              </p>
              <Button type="submit" disabled={!allAnswered || sending}>
                {sending ? "Checking…" : "Check my answers"}
              </Button>
            </div>
          )}
          {!attempt && user.role !== "student" && (
            <p className="text-sm text-muted">Teachers can preview the quiz, but only student accounts can record attempts.</p>
          )}
        </form>
      )}
    </main>
  );
}
