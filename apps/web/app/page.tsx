export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0e1a] text-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cyan-400">
          Galaxy Robot Academy
        </h1>
        <p className="mt-4 text-gray-400">
          Welcome, Engineer. Head to{" "}
          <a href="/student" className="text-purple-400 underline">
            /student
          </a>{" "}
          to begin your mission.
        </p>
      </div>
    </main>
  );
}
