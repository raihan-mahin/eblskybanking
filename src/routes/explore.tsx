import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ListRow, SearchField, ServiceTile } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { CATEGORIES, inCategory, searchServices, TINT_BG } from "@/lib/services";
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

function ExplorePage() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("ai");
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const results = searchServices(q);

  return (
    <AppShell title="Explore">
      <SearchField value={q} onChange={setQ} placeholder="Search all services" />

      {q ? (
        <SectionCard title="Results" subtitle={`${results.length} services`}>
          {results.map((r) => (
            <ListRow key={r.id} icon={r.icon} tint={r.tint} title={r.title} subtitle={r.description} onClick={() => go(r.id)} />
          ))}
          {results.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing found for “{q}”.</p>}
        </SectionCard>
      ) : (
        CATEGORIES.map((c) => {
          const items = inCategory(c.id);
          const isOpen = open === c.id;
          return (
            <section key={c.id} className="app-card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="press flex w-full items-center gap-3 p-4 text-left"
              >
                <span className={cx("grid size-11 shrink-0 place-items-center rounded-full", TINT_BG[c.tint])}>
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-primary">{c.title}</span>
                  <span className="block truncate text-[12.5px] text-muted-foreground">{c.subtitle}</span>
                </span>
                <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} className="size-5 text-muted-foreground" />
              </button>
              {isOpen && (
                <div className="grid grid-cols-4 border-t border-border px-1 pb-2">
                  {items.map((s) => (
                    <ServiceTile key={s.id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(s.id)} />
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}
    </AppShell>
  );
}
