import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {title && (
          <h1 className="mb-6 text-2xl font-bold text-cyan-400 sm:text-3xl">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
