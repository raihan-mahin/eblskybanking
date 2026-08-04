import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SearchField } from "@/components/kit";
import { useApp, money } from "@/lib/store";
import { byId, searchServices, categoryTitle } from "@/lib/services";
import { PAY_GROUPS } from "@/lib/extras";

export const Route = createFileRoute("/pay-transfer")({
  head: () => ({
    meta: [
      { title: "Pay & Transfer — EBL Sky Banking" },
      { name: "description", content: "Fund transfer, bill payment, recharge, fees and scheduled payments in one hub." },
      { property: "og:title", content: "Pay & Transfer — EBL Sky Banking" },
      { property: "og:description", content: "Fund transfer, bill payment, recharge, fees and scheduled payments in one hub." },
    ],
  }),
  component: PayTransferPage,
});

const SHORTCUTS = ["re2", "re1", "re4"];

function PayTransferPage() {
  const nav = useNavigate();
  const { state } = useApp();
  const [q, setQ] = useState("");
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const results = searchServices(q);

  const shortcuts = SHORTCUTS
    .map((id) => state.recentEntities.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const tile = (id: string, label?: string) => {
    const s = byId(id);
    if (!s) return null;
    return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={label ?? s.title} onClick={() => go(id)} />;
  };

  return (
    <AppShell title="Pay & Transfer">
      <SearchField value={q} onChange={setQ} placeholder="Search payments and transfers" />

      {q ? (
        <SectionCard title="Results" subtitle={`${results.length} services`}>
          {results.map((r) => (
            <ListRow key={r.id} icon={r.icon} tint={r.tint} title={r.title} subtitle={categoryTitle(r.category)} onClick={() => go(r.id)} />
          ))}
          {results.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing found for “{q}”.</p>}
        </SectionCard>
      ) : (
        <>
          {shortcuts.length > 0 && (
            <SectionCard title="Recent" subtitle="Prefilled from your history">
              <div className="grid grid-cols-3 gap-2">
                {shortcuts.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: r.serviceId }, search: { ref: r.id } })}
                    className="press rounded-2xl border border-border p-2.5 text-left"
                  >
                    <p className="truncate text-[12.5px] font-semibold">{r.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{r.masked}</p>
                    <p className="mt-1 text-[11.5px] font-medium text-primary">{money(r.amount)}</p>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {PAY_GROUPS.map((g) => (
            <SectionCard
              key={g.id}
              title={g.title}
              subtitle={g.subtitle}
              {...(g.more.length ? { action: "See All", onAction: () => nav({ to: "/category/$categoryId", params: { categoryId: g.id } }) } : {})}
            >
              <div className="grid grid-cols-3">
                {g.primary.map((p) => tile(p.id, p.label))}
              </div>
            </SectionCard>
          ))}
        </>
      )}

    </AppShell>
  );
}
