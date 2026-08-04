import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ListRow, SearchField, ServiceTile } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { searchServices, byId, TINT_BG, categoryTitle } from "@/lib/services";
import { EXPLORE_GROUPS, type ExploreItem } from "@/lib/extras";
import { cx } from "@/components/kit";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Services — EBL Sky Banking" },
      { name: "description", content: "Browse every banking service by category: payments, bills, savings, cards and support." },
      { property: "og:title", content: "Explore Services — EBL Sky Banking" },
      { property: "og:description", content: "Browse every banking service by category: payments, bills, savings, cards and support." },
    ],
  }),
  component: ExplorePage,
});

const GROUPS = EXPLORE_GROUPS;

function ExplorePage() {
  const nav = useNavigate();
  const fromHome = useRouterState({
    select: (s) => Boolean((s.location.state as { fromHome?: boolean }).fromHome),
  });
  const [q, setQ] = useState("");
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const results = searchServices(q);

  const openItem = (i: ExploreItem) => {
    if (i.route === "/home") { nav({ to: "/home" }); return; }
    if (i.serviceId) go(i.serviceId);
  };


  const tileFor = (i: ExploreItem) => {
    const svc = i.serviceId ? byId(i.serviceId) : undefined;
    const icon = i.icon ?? svc?.icon ?? "Sparkles";
    const tint = i.tint ?? svc?.tint ?? "gray";
    const label = i.label ?? svc?.title ?? i.key;
    return <ServiceTile key={i.key} icon={icon} tint={tint} label={label} onClick={() => openItem(i)} />;
  };

  return (
    <AppShell title={fromHome ? "Explore Services" : "Explore"} back={fromHome}>

      <SearchField value={q} onChange={setQ} placeholder="Search all services" />

      {q ? (
        <SectionCard title="Results" subtitle={`${results.length} services`}>
          {results.map((r) => (
            <ListRow key={r.id} icon={r.icon} tint={r.tint} title={r.title} subtitle={categoryTitle(r.category)} onClick={() => go(r.id)} />
          ))}
          {results.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing found for “{q}”.</p>}
        </SectionCard>
      ) : (
        GROUPS.map((g) => (
          <section key={g.id} className="app-card overflow-hidden">
            <div className="flex items-center gap-3 p-4 pb-2">
              <span className={cx("grid size-11 shrink-0 place-items-center rounded-full", TINT_BG[g.tint])}>
                <Icon name={g.icon} className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-semibold text-primary">{g.title}</span>
                <span className="block truncate text-[12.5px] text-muted-foreground">{g.subtitle}</span>
              </span>
              {g.more.length > 0 && (
                <button onClick={() => nav({ to: "/category/$categoryId", params: { categoryId: g.id } })} className="press shrink-0 text-[13px] font-medium text-primary">See All</button>
              )}
            </div>
            <div className="grid grid-cols-3 border-t border-border px-1 pb-2">
              {g.primary.map(tileFor)}
            </div>
          </section>
        ))
      )}

    </AppShell>
  );
}
