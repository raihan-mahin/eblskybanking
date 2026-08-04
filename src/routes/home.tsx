import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal, Star, ChevronUp, ChevronDown } from "lucide-react";
import { AppShell, FullSheet } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SegmentedTabs, ProgressBar, cx } from "@/components/kit";
import { AccountCarousel } from "@/components/AccountCarousel";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { BirthdayNotice } from "@/components/BirthdayNotice";
import { NextRewardCard } from "@/components/NextReward";
import { useApp, money } from "@/lib/store";
import { byId, SERVICES } from "@/lib/services";

import { DEFAULT_DASHBOARD_ORDER, DEFAULT_QUICK, MORE_SERVICES, QUICK_CATALOGUE } from "@/lib/extras";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — EBL Sky Banking" },
      { name: "description", content: "Your balance, quick banking shortcuts, insights and recent activity." },
      { property: "og:title", content: "Home — EBL Sky Banking" },
      { property: "og:description", content: "Your balance, quick banking shortcuts, insights and recent activity." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("quick");
  const [customize, setCustomize] = useState(false);
  const [allQuick, setAllQuick] = useState(false);

  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const nepal = state.goals.find((g) => g.title === "Nepal Trip") ?? state.goals[0];


  const pinned = state.personalization.pinned.filter((id) => byId(id));
  const byUsage = SERVICES.slice()
    .sort((a, b) => (state.usage[b.id] ?? 0) - (state.usage[a.id] ?? 0))
    .filter((s) => (state.usage[s.id] ?? 0) > 0)
    .map((s) => s.id);
  const quickIds = [...new Set([...pinned, ...byUsage, ...state.quickBanking, ...DEFAULT_QUICK])]
    .filter((id) => byId(id))
    .slice(0, 3);

  const togglePin = (id: string) => {
    const p = state.personalization;
    patch({
      personalization: {
        ...p,
        pinned: p.pinned.includes(id) ? p.pinned.filter((x) => x !== id) : [...p.pinned, id].slice(-6),
      },
    });
  };

  const order = [
    ...state.dashboard.order.filter((id) => DEFAULT_DASHBOARD_ORDER.includes(id)),
    ...DEFAULT_DASHBOARD_ORDER.filter((id) => !state.dashboard.order.includes(id)),
  ].filter((id) => !state.dashboard.hidden.includes(id));

  const favorites = state.recentEntities.filter((r) => r.favorite !== false);

  const toggleFavorite = (id: string) =>
    patch({
      recentEntities: state.recentEntities.map((r) =>
        r.id === id ? { ...r, favorite: r.favorite === false } : r,
      ),
    });

  const moveFavorite = (id: string, dir: -1 | 1) => {
    const list = state.recentEntities.slice();
    const i = list.findIndex((r) => r.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j]!, list[i]!];
    patch({ recentEntities: list });
  };

  const modules: Record<string, React.ReactNode> = {
    quick: (
      <SectionCard key="quick" className="!py-3">
        <SegmentedTabs
          tabs={[{ id: "quick", label: "Quick Banking" }, { id: "recent", label: "Favorites" }]}
          value={tab}
          onChange={setTab}
        />
        {tab === "quick" ? (
          <>
            <div className="grid grid-cols-3">
              {quickIds.map((id) => {
                const s = byId(id)!;
                return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
              })}
            </div>
            <button
              aria-label="Show all Quick Banking services"
              onClick={() => setAllQuick(true)}
              className="press mx-auto -mb-1 flex h-7 w-16 items-center justify-center rounded-full text-muted-foreground"
            >
              <ChevronDown className="size-4" />
            </button>
          </>
        ) : (

          <div className="mt-1">
            {favorites.slice(0, 6).map((r) => (
              <ListRow
                key={r.id}
                icon={r.icon}
                tint={r.tint}
                title={r.label}
                subtitle={`${r.masked} · ${r.detail}`}
                right={
                  <span className="flex items-center gap-1">
                    <button aria-label="Move up" onClick={(e) => { e.stopPropagation(); moveFavorite(r.id, -1); }}
                      className="press grid size-7 place-items-center rounded-full text-muted-foreground">
                      <ChevronUp className="size-4" />
                    </button>
                    <button aria-label="Move down" onClick={(e) => { e.stopPropagation(); moveFavorite(r.id, 1); }}
                      className="press grid size-7 place-items-center rounded-full text-muted-foreground">
                      <ChevronDown className="size-4" />
                    </button>
                    <button aria-label="Remove from Favorites" onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}
                      className="press grid size-7 place-items-center rounded-full text-accent">
                      <Star className="size-4 fill-current" />
                    </button>
                  </span>
                }
                onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: r.serviceId }, search: { ref: r.id } })}
              />
            ))}
            {favorites.length === 0 && (
              <p className="py-5 text-center text-[13.5px] text-muted-foreground">No favorites yet.</p>
            )}
            {state.recentEntities.some((r) => r.favorite === false) && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="mb-1 text-[12.5px] text-muted-foreground">Not in Favorites</p>
                {state.recentEntities.filter((r) => r.favorite === false).map((r) => (
                  <ListRow
                    key={r.id}
                    icon={r.icon}
                    tint={r.tint}
                    title={r.label}
                    subtitle={r.masked}
                    right={
                      <button aria-label="Add to Favorites" onClick={(e) => { e.stopPropagation(); toggleFavorite(r.id); }}
                        className="press grid size-7 place-items-center rounded-full text-muted-foreground">
                        <Star className="size-4" />
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </SectionCard>
    ),

    insights: (
      <SectionCard key="insights" title="Smart Insights" action="See All" onAction={() => go("spending-insights")} className="!py-3">
        <div className="rounded-2xl bg-tint-green p-3">
          <p className="text-[14.5px] font-semibold text-primary">Your Nepal adventure is getting closer</p>
          <p className="mt-1 text-[13.5px] leading-snug">
            You have saved {money(nepal?.saved ?? 62500)}. Only {money(Math.max(0, (nepal?.target ?? 100000) - (nepal?.saved ?? 62500)))} remains to reach your Nepal Trip goal.
          </p>
          <div className="mt-2 flex gap-2">
            <button onClick={() => go("goal-setting")} className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">Contribute</button>
            <button onClick={() => go("savings-goals")} className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">View Goal</button>
            <button onClick={() => go("spending-insights")} className="press px-2 text-[12.5px] text-muted-foreground">See All</button>
          </div>
        </div>
      </SectionCard>
    ),
    rewards: (
      <SectionCard key="rewards" title="Rewards" action="View Rewards" onAction={() => go("rewards")} className="!py-3">
        <NextRewardCard compact />
      </SectionCard>
    ),


    goals: (
      <SectionCard key="goals" title="DPS, Savings & Goals" action="All goals" onAction={() => go("savings-goals")}>
        {(nepal ? [nepal] : state.goals.slice(0, 1)).map((g) => (
          <div key={g.id} className="py-2">
            <div className="flex items-center justify-between text-[14.5px] font-medium">
              <span>{g.title}</span>
              <span>{money(g.saved)} / {money(g.target)}</span>
            </div>
            <ProgressBar className="mt-2" value={(g.saved / g.target) * 100} />
            <div className="mt-2.5 flex gap-2">
              <button onClick={() => go("goal-setting")} className="press rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium">Contribute</button>
              <button onClick={() => go("savings-goals")} className="press rounded-lg border border-border px-3 py-1.5 text-[12.5px]">All Goals</button>
            </div>
          </div>
        ))}
      </SectionCard>
    ),
    more: (
      <SectionCard key="more" title="More services">
        <div className="grid grid-cols-3">
          {MORE_SERVICES.map((m) => {
            if (m.route) {
              return <ServiceTile key={m.id} icon="Compass" tint="yellow" label={m.label} onClick={() => nav({ to: "/explore" })} />;
            }
            const s = byId(m.id);
            if (!s) return null;
            return <ServiceTile key={m.id} icon={s.icon} tint={s.tint} label={m.label} onClick={() => go(m.id)} />;
          })}
        </div>
      </SectionCard>
    ),
  };

  return (
    <AppShell>
      <BirthdayNotice />


      <AccountCarousel />

      <div className="flex justify-end">
        <button onClick={() => setCustomize(true)} className="press flex items-center gap-1.5 text-[12.5px] font-medium text-primary">
          <SlidersHorizontal className="size-4" /> Customize dashboard
        </button>
      </div>

      {order.map((id) => modules[id] ?? null)}

      <FullSheet open={customize} onClose={() => setCustomize(false)} title="Customize Dashboard">
        <DashboardCustomizer />
      </FullSheet>

      <FullSheet open={allQuick} onClose={() => setAllQuick(false)} title="Quick Banking">
        <SectionCard title="All shortcuts" subtitle="Pin a service to keep it on Home">
          <div className="grid grid-cols-3 gap-1">
            {QUICK_CATALOGUE.map((id) => {
              const s = byId(id);
              if (!s) return null;
              const isPinned = state.personalization.pinned.includes(id);
              return (
                <div key={id} className={cx("rounded-2xl border p-1", isPinned ? "border-brand bg-brand-soft" : "border-transparent")}>
                  <ServiceTile icon={s.icon} tint={s.tint} label={s.title} onClick={() => { setAllQuick(false); go(id); }} />
                  <button onClick={() => togglePin(id)} className="press mb-1 w-full text-center text-[11px] font-medium text-primary">
                    {isPinned ? "Unpin" : "Pin"}
                  </button>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </FullSheet>
    </AppShell>
  );
}
