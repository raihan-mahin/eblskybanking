import { useApp } from "@/lib/store";

/** Compact tree that gets slightly fuller as the paperless counter grows. */
function TreeMark({ count }: { count: number }) {
  // Growth ring: every transaction adds a leaf, up to a full canopy.
  const leaves = [
    { cx: 32, cy: 26, r: 11 },
    { cx: 22, cy: 33, r: 9 },
    { cx: 42, cy: 33, r: 9 },
    { cx: 27, cy: 19, r: 7.5 },
    { cx: 38, cy: 19, r: 7.5 },
    { cx: 17, cy: 25, r: 6 },
    { cx: 47, cy: 25, r: 6 },
    { cx: 32, cy: 14, r: 6.5 },
  ];
  const grown = Math.min(leaves.length, 2 + (count % (leaves.length - 1)));
  const branch = count > 2;

  return (
    <svg viewBox="0 0 64 64" className="size-14 shrink-0" role="img" aria-label={`Eco tree with ${count} paperless transactions`}>
      <circle cx="32" cy="32" r="32" className="fill-tint-green" />
      <path d="M32 54V30" stroke="currentColor" className="text-success" strokeWidth="3" strokeLinecap="round" />
      {branch && (
        <>
          <path d="M32 38l-7-6" stroke="currentColor" className="text-success" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M32 34l7-6" stroke="currentColor" className="text-success" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
      {leaves.slice(0, grown).map((l, i) => (
        <circle
          key={i}
          cx={l.cx}
          cy={l.cy}
          r={l.r}
          className="fill-success animate-scale-in"
          opacity={i === grown - 1 ? 0.95 : 0.75}
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
