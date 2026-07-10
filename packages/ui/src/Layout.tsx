import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-[calc(100vh-5rem)] text-foreground">
      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {title && (
          <h1 className="mb-7 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
