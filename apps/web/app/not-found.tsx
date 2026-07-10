import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-gray-100">
      <div className="text-center">
        <p className="text-5xl" aria-hidden="true">
          🛸
        </p>
        <h1 className="mt-4 text-2xl font-bold text-cyan-400">
          Mission Not Found
        </h1>
        <p className="mt-2 text-gray-400">
          This mission seems to have drifted into deep space.
        </p>
        <Link
          href="/student"
          className="mt-4 inline-block text-purple-400 underline hover:text-purple-300 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none rounded"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
