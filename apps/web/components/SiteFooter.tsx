import Image from "next/image";
import Link from "next/link";
import { APP_VERSION } from "@galaxy/types";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Academy Hangar" },
      { href: "/student", label: "Student cockpit" },
      { href: "/badges", label: "Badge Hall" },
      { href: "/login", label: "Sign In" },
    ],
  },
  {
    title: "Mission Control",
    links: [
      { href: "/teacher", label: "Teacher dashboard" },
      { href: "/teacher/missions/new", label: "Plan a mission" },
    ],
  },
];

const facts = ["12-mission expedition", "Galaxy Energy rewards", "R0-B0 grows with you"];

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-white/15 bg-white/[.05] shadow-[inset_0_1px_0_rgba(255,255,255,.09)] backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Image src="/brand/logo-badge.png" alt="Galaxy Robot Academy" width={92} height={56} />
          <p className="stamp-label mt-4 text-[.65rem] text-halo">Build · Think · Explore</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">A software engineering expedition for young engineers — real code, one space robot, twelve missions.</p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={`Footer — ${column.title}`}>
            <h2 className="stamp-label text-[.65rem] text-muted">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm font-medium text-secondary transition hover:text-foreground hover:underline">{link.label}</Link></li>)}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="stamp-label text-[.65rem] text-muted">The Academy</h2>
          <ul className="mt-4 space-y-2.5">
            {facts.map((fact) => <li key={fact} className="flex items-start gap-2 text-sm text-muted"><span aria-hidden="true" className="mt-1 text-halo">✦</span>{fact}</li>)}
          </ul>
        </div>
      </div>

      {/* Coordinate stamp band — the brand signs the page like a postcard from deep space */}
      <div className="border-t border-white/10 bg-white/[.03] pb-[clamp(18px,5vh,52px)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="stamp-label text-[.6rem] text-muted"><span aria-hidden="true">＋</span> Fly Curious · Galaxy Robot Academy</p>
          <p className="text-xs text-muted">© {new Date().getFullYear()} Galaxy Robot Academy · v{APP_VERSION}</p>
          <p className="stamp-label flex items-center gap-2 text-[.6rem] text-muted">Sector 12 · RA 17H45M · Dec −29°00′ <span aria-hidden="true" className="text-halo">♥</span></p>
        </div>
      </div>
    </footer>
  );
}
