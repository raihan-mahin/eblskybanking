import { useEffect, useState, type ReactNode } from "react";
import { ChevronRight, X, Check, Search } from "lucide-react";
import { Icon } from "./Icon";
import { TINT_BG, type Tint } from "@/lib/services";

export const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

/* ---------- structure ---------- */

export function SectionCard({
  title, action, onAction, children, className, subtitle,
}: {
  title?: string; subtitle?: string; action?: string; onAction?: () => void;
  children: ReactNode; className?: string;
}) {
  return (
    <section className={cx("app-card p-4", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            {title && <h2 className="text-[17px] font-semibold text-primary">{title}</h2>}
            {subtitle && <p className="text-[12.5px] text-muted-foreground">{subtitle}</p>}
          </div>
          {action && (
            <button onClick={onAction} className="press flex items-center gap-0.5 text-[13px] font-medium text-primary">
              {action} <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function ListRow({
  icon, tint = "gray", title, subtitle, right, onClick, className,
}: {
  icon?: string; tint?: Tint; title: string; subtitle?: string;
  right?: ReactNode; onClick?: () => void; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "press flex w-full items-center gap-3 border-b border-border py-3 text-left last:border-0",
        className,
      )}
    >
      {icon && (
        <span className={cx("grid size-10 shrink-0 place-items-center rounded-full", TINT_BG[tint])}>
          <Icon name={icon} className="size-5 text-foreground" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium">{title}</span>
        {subtitle && <span className="block truncate text-[12.5px] text-muted-foreground">{subtitle}</span>}
      </span>
      {right ?? <ChevronRight className="size-5 shrink-0 text-muted-foreground" />}
    </button>
  );
}

export function ServiceTile({
  icon, tint = "gray", label, badge, onClick, note,
}: {
  icon: string; tint?: Tint; label: string; badge?: string; note?: string; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="press flex flex-col items-center gap-1.5 px-1 py-3">
      <span className={cx("grid size-14 place-items-center rounded-full", TINT_BG[tint])}>
        <Icon name={icon} className="size-6 text-foreground" />
      </span>
      <span className="text-center text-[13px] leading-tight font-medium">{label}</span>
      {note && (
        <span className="rounded-md bg-tint-pink px-2 py-0.5 text-[10.5px] text-foreground">{note}</span>
      )}
      {badge && <span className="text-[10.5px] font-medium text-accent">{badge}</span>}
    </button>
  );
}

export function SegmentedTabs({
  tabs, value, onChange,
}: { tabs: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 rounded-xl bg-muted p-0.5">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            "press rounded-[10px] py-2.5 text-[15px] font-medium transition-colors",
            value === t.id
              ? "border-b-2 border-brand bg-brand-soft text-foreground"
              : "text-muted-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    ["paid", "success", "resolved", "approved", "repaid", "active", "eligible", "disbursed"].some((x) => s.includes(x))
      ? "bg-tint-green text-success"
      : ["fail", "declined", "cancel", "blocked", "error"].some((x) => s.includes(x))
        ? "bg-tint-pink text-error"
        : "bg-tint-yellow text-pending";
  return <span className={cx("rounded-md px-2.5 py-1 text-[12px] font-medium", tone)}>{status}</span>;
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function CircularProgress({ value, label, sub, size = 132 }: { value: number; label: string; sub?: string; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="10" className="stroke-muted" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth="10" fill="none" strokeLinecap="round"
          className="stroke-brand transition-all duration-500"
          strokeDasharray={c} strokeDashoffset={c - (Math.min(100, value) / 100) * c}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-[20px] font-semibold">{label}</div>
        {sub && <div className="text-[11.5px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

export function MiniBarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div className="w-full rounded-t-md bg-brand transition-all" style={{ height: `${(d / max) * 100}%` }} />
          </div>
          <span className="text-[10.5px] text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${40 - ((d - min) / (max - min || 1)) * 34}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="h-24 w-full">
      <polyline points={pts} fill="none" className="stroke-primary" strokeWidth="1.6" strokeLinejoin="round" />
      <polyline points={`0,44 ${pts} 100,44`} className="fill-tint-blue" opacity="0.6" stroke="none" />
    </svg>
  );
}

export function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const el = (
            <circle key={i} cx="66" cy="66" r={r} fill="none" strokeWidth="16" stroke={d.color}
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} />
          );
          acc += len;
          return el;
        })}
      </svg>
      <ul className="flex-1 space-y-1.5">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-[12.5px]">
            <span className="size-2.5 rounded-full" style={{ background: d.color }} />
            <span className="flex-1 text-muted-foreground">{d.label}</span>
            <span className="font-medium">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- forms ---------- */

export function FormField({
  label, children, hint,
}: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3.5 py-3 text-[15px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputCls, props.className)} />;
}

export function Select({
  value, onChange, options, placeholder,
}: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, "appearance-none")}>
      <option value="">{placeholder ?? "Select"}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function AmountInput({ value, onChange, presets = [500, 1000, 5000, 10000] }: { value: string; onChange: (v: string) => void; presets?: number[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center rounded-xl border border-border bg-card px-3.5 py-2.5">
        <span className="pr-3 text-[18px] text-muted-foreground">৳</span>
        <span className="mr-3 h-6 w-px bg-border" />
        <input
          inputMode="numeric" value={value} placeholder="Enter amount here"
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full bg-transparent text-[18px] font-medium outline-none"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {presets.map((p) => (
          <button key={p} onClick={() => onChange(String(p))}
            className="press shrink-0 rounded-full border border-border px-3 py-1.5 text-[12.5px] text-muted-foreground">
            ৳{p.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SearchField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-muted px-4 py-3">
      <Search className="size-5 text-muted-foreground" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-muted-foreground" />
    </div>
  );
}

export function Button({
  children, onClick, variant = "primary", disabled, className, type,
}: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "outline" | "danger" | "accent";
  disabled?: boolean; className?: string; type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-brand text-foreground",
    accent: "bg-accent text-accent-foreground",
    outline: "border border-border bg-card text-foreground",
    ghost: "text-primary",
    danger: "bg-error text-white",
  }[variant];
  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled}
      className={cx("press w-full rounded-xl py-3.5 text-[15px] font-medium disabled:opacity-45", styles, className)}>
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cx("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand" : "bg-border")}>
      <span className={cx("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

/* ---------- overlays ---------- */

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[430px] flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-h-[88vh] overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 animate-in slide-in-from-bottom duration-200">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-primary">{title}</h3>
          <button onClick={onClose} className="press grid size-8 place-items-center rounded-full bg-muted">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmationDialog({
  open, title, body, onConfirm, onCancel, confirmLabel = "Confirm",
}: { open: boolean; title: string; body: string; onConfirm: () => void; onCancel: () => void; confirmLabel?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 mx-auto grid max-w-[430px] place-items-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full rounded-2xl bg-card p-5">
        <h3 className="text-[17px] font-semibold">{title}</h3>
        <p className="mt-1 text-[13.5px] text-muted-foreground">{body}</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry, onCancel, onSupport }: { message: string; onRetry?: () => void; onCancel?: () => void; onSupport?: () => void }) {
  return (
    <div className="app-card p-5 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-tint-pink">
        <X className="size-7 text-error" />
      </div>
      <h3 className="mt-3 text-[17px] font-semibold">Transaction failed</h3>
      <p className="mt-1 text-[13.5px] text-muted-foreground">{message}</p>
      <div className="mt-4 space-y-2">
        {onRetry && <Button onClick={onRetry}>Retry</Button>}
        {onSupport && <Button variant="outline" onClick={onSupport}>Get AI Support</Button>}
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </div>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-[60] w-[86%] max-w-[380px] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl bg-foreground/92 px-4 py-3 text-[13.5px] text-white shadow-lg">
        <Check className="size-4 shrink-0" /> {message}
      </div>
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const show = (m: string) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 2200);
  };
  return { message, show, node: <Toast message={message} /> };
}

export function InsightCard({ text, action, onAction, onDismiss, tone = "info" }: { text: string; action: string; onAction: () => void; onDismiss?: () => void; tone?: string }) {
  const bg = tone === "warn" ? "bg-tint-yellow" : tone === "good" ? "bg-tint-green" : "bg-tint-blue";
  return (
    <div className={cx("rounded-2xl p-3.5", bg)}>
      <p className="text-[13.5px] leading-snug">{text}</p>
      <div className="mt-2.5 flex gap-2">
        <button onClick={onAction} className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">{action}</button>
        {onDismiss && <button onClick={onDismiss} className="press px-2 text-[12.5px] text-muted-foreground">Dismiss</button>}
      </div>
    </div>
  );
}
