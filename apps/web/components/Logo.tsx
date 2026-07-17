import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

/** Heights for the badge artwork (original aspect 324x197). */
const badge: Record<LogoSize, { h: number; w: number }> = {
  sm: { h: 28, w: 46 },
  md: { h: 38, w: 63 },
  lg: { h: 56, w: 92 },
};

/**
 * Official brand artwork (provided master, background removed) from /public/brand:
 * logo-original.png (untouched), logo.png (full lockup, transparent),
 * logo-badge.png (robot-head badge only, transparent — used here).
 */
export function Logo({ size = "md", withWordmark = true, className }: { size?: LogoSize; withWordmark?: boolean; className?: string }) {
  const { h, w } = badge[size];
  return (
    <span className={`inline-flex min-w-0 items-center gap-3 ${className ?? ""}`}>
      <Image src="/brand/logo-badge.png" alt="" aria-hidden="true" width={w} height={h} priority className="shrink-0" />
      {withWordmark && (
        <span className="min-w-0">
          <span className={`block truncate font-display font-bold tracking-tight text-foreground ${size === "lg" ? "text-xl" : "text-sm sm:text-base"}`}>Galaxy Robot Academy</span>
          <span className="stamp-label block text-[.6rem] text-halo">Mission Control</span>
        </span>
      )}
    </span>
  );
}
