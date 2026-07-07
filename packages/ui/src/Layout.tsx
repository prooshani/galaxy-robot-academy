import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      <header className="border-b border-purple-900/50 bg-[#0d1225]">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-bold text-cyan-400">
            {title ?? "Galaxy Robot Academy"}
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
