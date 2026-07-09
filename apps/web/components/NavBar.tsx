"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/contexts/UserContext";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/student", label: "Student" },
  { href: "/badges", label: "Badges" },
  { href: "/teacher", label: "Teacher" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { user } = useUser();

  const visibleLinks = navLinks.filter(
    (link) => link.href !== "/teacher" || user.role === "teacher"
  );

  return (
    <nav className="border-b border-purple-900/50 bg-[#080c18]/95 text-gray-100 shadow-lg shadow-purple-950/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/student" className="group inline-flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            🚀
          </span>
          <span className="text-base font-bold text-cyan-300 transition-colors group-hover:text-cyan-200">
            Galaxy Robot Academy
          </span>
        </Link>

        <div className="flex flex-wrap gap-2">
          {visibleLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200 shadow-sm shadow-cyan-950/40"
                    : "border-purple-500/20 bg-[#111827] text-gray-300 hover:border-purple-400/50 hover:text-purple-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
