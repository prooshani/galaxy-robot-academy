import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({ className, variant = "primary", size = "md", loading, disabled, children, ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "border-brand bg-brand text-canvas shadow-[var(--shadow-glow-cyan)] hover:brightness-110",
    secondary: "border-border bg-elevated text-foreground hover:border-brand-secondary",
    ghost: "border-transparent bg-transparent text-muted hover:bg-white/5 hover:text-foreground",
    danger: "border-danger/40 bg-danger/15 text-red-200 hover:bg-danger/25",
  };
  const sizes: Record<ButtonSize, string> = { sm: "min-h-10 px-3 text-sm", md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-base" };
  return <button className={cx("inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition duration-200", variants[variant], sizes[size], className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>{loading && <span aria-hidden="true">◌</span>}{children}</button>;
}

export function IconButton({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cx("inline-flex size-11 items-center justify-center rounded-xl border border-border bg-elevated text-foreground transition hover:border-brand hover:text-brand", className)} {...props}>{children}</button>;
}

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("surface rounded-2xl p-5 sm:p-6", className)} {...props} />;
}

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8", className)} {...props} />;
}

export function PageHeader({ title, description, eyebrow, actions, className }: { title: string; description?: string; eyebrow?: string; actions?: ReactNode; className?: string }) {
  return <header className={cx("mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}><div className="max-w-3xl">{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-brand">{eyebrow}</p>}<h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>{description && <p className="mt-3 text-base text-muted sm:text-lg">{description}</p>}</div>{actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}</header>;
}

export function SectionHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>{actions}</div>;
}

const fieldClass = "w-full rounded-xl border border-border bg-canvas/75 px-3.5 py-2.5 text-foreground shadow-inner outline-none transition placeholder:text-muted/70 hover:border-strong-border focus:border-brand";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cx(fieldClass, className)} {...props} />; }
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cx(fieldClass, className)} {...props} />; }
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cx(fieldClass, className)} {...props} />; }
export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input type="checkbox" className={cx("size-5 shrink-0 accent-brand", className)} {...props} />; }

export function FormField({ label, htmlFor, hint, error, required, children }: { label: string; htmlFor: string; hint?: string; error?: string; required?: boolean; children: ReactNode }) {
  return <div><label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-foreground">{label}{required && <span className="ml-1 font-normal text-danger">(required)</span>}</label>{hint && <p className="mb-2 text-sm text-muted">{hint}</p>}{children}{error && <p className="mt-2 flex gap-1.5 text-sm text-danger" role="alert"><span aria-hidden="true">!</span>{error}</p>}</div>;
}

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "locked" | "submitted";
const statusStyles: Record<StatusTone, string> = { neutral: "border-border bg-white/5 text-muted", info: "border-info/35 bg-info/10 text-blue-200", success: "border-success/35 bg-success/10 text-green-200", warning: "border-warning/35 bg-warning/10 text-yellow-100", danger: "border-danger/35 bg-danger/10 text-red-200", locked: "border-locked/35 bg-locked/10 text-slate-300", submitted: "border-submitted/35 bg-submitted/10 text-purple-200" };
const statusIcons: Record<StatusTone, string> = { neutral: "•", info: "i", success: "✓", warning: "!", danger: "×", locked: "▣", submitted: "↑" };
export function StatusChip({ children, tone = "neutral", className }: { children: ReactNode; tone?: StatusTone; className?: string }) { return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", statusStyles[tone], className)}><span aria-hidden="true">{statusIcons[tone]}</span>{children}</span>; }
export function GalaxyEnergyChip({ value, className }: { value: number | string; className?: string }) { return <span className={cx("inline-flex items-center gap-1.5 rounded-full border border-energy/35 bg-energy/10 px-2.5 py-1 text-xs font-bold text-yellow-100", className)}><span aria-hidden="true">✦</span>{value} GE</span>; }
export function Divider({ className }: { className?: string }) { return <hr className={cx("my-6 border-0 border-t border-border", className)} />; }
export function ProgressBar({ value, max = 100, label = "Progress", className }: { value: number; max?: number; label?: string; className?: string }) { const safe = Math.min(Math.max(value, 0), max); return <div className={className}><div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-foreground">{label}</span><span className="text-muted">{safe} / {max}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={safe}><div className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-brand transition-[width]" style={{ width: `${max > 0 ? (safe / max) * 100 : 0}%` }} /></div></div>; }
export function EmptyState({ title, description, action, icon = "◇" }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) { return <Panel className="flex flex-col items-center py-10 text-center"><span className="mb-3 text-3xl text-brand" aria-hidden="true">{icon}</span><h3 className="text-lg font-semibold text-foreground">{title}</h3>{description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}{action && <div className="mt-5">{action}</div>}</Panel>; }
