import { useApp } from "@/lib/store";

/** Elegant compact tree: foliage and branches reveal gradually as the count grows. */
function TreeMark({ count }: { count: number }) {
  const branches = [
    "M32 44 L22 34",
    "M32 40 L42 30",
    "M32 32 L24 24",
    "M32 28 L40 20",
  ];
  const leaves = [
    { cx: 32, cy: 24, rx: 12, ry: 11 },
    { cx: 21, cy: 31, rx: 9, ry: 8 },
    { cx: 43, cy: 30, rx: 9, ry: 8 },
    { cx: 24, cy: 19, rx: 8, ry: 7 },
    { cx: 41, cy: 18, rx: 8, ry: 7 },
    { cx: 32, cy: 13, rx: 8, ry: 7 },
    { cx: 15, cy: 25, rx: 6.5, ry: 6 },
    { cx: 49, cy: 24, rx: 6.5, ry: 6 },
  ];
  const step = count % leaves.length;
  const grown = Math.min(leaves.length, 2 + step);
  const branchCount = Math.min(branches.length, 1 + Math.floor(step / 2));

  return (
    <svg
      viewBox="0 0 64 60"
      className="size-16 shrink-0"
      role="img"
      aria-label={`Eco tree, ${count} paperless transactions`}
    >
      <circle cx="32" cy="30" r="30" className="fill-tint-green" />
      {/* ground */}
      <ellipse cx="32" cy="52" rx="14" ry="2.4" className="fill-success" opacity="0.18" />
      {/* trunk */}
      <path d="M32 52 C31 44 31 38 32 26" className="stroke-success" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.85" />
      {branches.slice(0, branchCount).map((d, i) => (
        <path key={d} d={d} className="stroke-success" strokeWidth="2" strokeLinecap="round" fill="none" opacity={0.7 - i * 0.05} />
      ))}
      {leaves.slice(0, grown).map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
          className={i === grown - 1 ? "fill-success animate-scale-in" : "fill-success"}
          opacity={i === grown - 1 ? 0.95 : 0.6 + (i % 3) * 0.08}
        />
      ))}
    </svg>
  );
}

export function EcoTreeCard() {
  const { state } = useApp();
  const count = state.eco?.count ?? 0;
  const pct = Math.min(100, ((count % 25) / 25) * 100);

  return (
    <section className="app-card p-4">
      <div className="flex items-start gap-3">
        <TreeMark count={count} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-primary">🌱 Your transaction just helped your Eco Tree grow.</p>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            Every paperless transaction adds a little more green to your journey.
          </p>
          <p className="mt-2 text-[13px] font-medium text-success">{count} paperless transactions 🌿</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
        EBL digitalisation saved 1.2M sheets (~6 tons of paper) in 2024.
      </p>
    </section>
  );
}
