import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Star, ChevronUp, ChevronDown, Pin } from "lucide-react";
import { AppShell, FullSheet } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SegmentedTabs, ProgressBar, cx } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { AccountCarousel } from "@/components/AccountCarousel";
import { ReorderableStack } from "@/components/ReorderableStack";
import { toast } from "sonner";
import { BirthdayNotice } from "@/components/BirthdayNotice";
import { NextRewardCard } from "@/components/NextReward";
import { useApp, money } from "@/lib/store";
import { byId, TINT_BG } from "@/lib/services";

import { DEFAULT_DASHBOARD_ORDER, DEFAULT_QUICK, MORE_SERVICES_PRIORITY, QUICK_CATALOGUE } from "@/lib/extras";

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

function ArrowPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="press mx-auto -mb-1 mt-1 flex flex-col items-center justify-center px-8 py-1 text-black active:opacity-70"
    >
      <ChevronDown className="double-chevron-top size-4" strokeWidth={1.5} />
      <ChevronDown className="double-chevron-bottom -mt-[9px] size-4" strokeWidth={1.5} />
    </button>
  );
}

function GoalsCarousel({ goal, go }: { goal?: { id: string; title: string; saved: number; target: number }; go: (id: string) => void }) {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; left: number; active: boolean; moved: boolean } | null>(null);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    setIdx(i > 0 ? 1 : 0);
  };

  const slideTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIdx(i);
  };

  // Pointer-drag fallback (desktop / preview emulation); native touch scrolling handles phones.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, active: true, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d?.active || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = trackRef.current;
    drag.current = null;
    if (!d?.moved || !el) return;
    e.preventDefault();
    const dx = e.clientX - d.x;
    const cur = Math.round(d.left / Math.max(1, el.clientWidth));
    const next = Math.abs(dx) > 40 ? (dx < 0 ? cur + 1 : cur - 1) : cur;
    slideTo(Math.min(1, Math.max(0, next)));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-primary">DPS, Savings & Goals</h2>
        <button onClick={() => go("savings-goals")} className="press text-[12.5px] font-medium text-muted-foreground">All goals</button>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={() => { drag.current = null; }}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
        className="-mx-1 flex snap-x snap-mandatory items-stretch overflow-x-auto overflow-y-hidden px-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x pan-y pinch-zoom", overscrollBehaviorX: "contain" }}
      >
        <div className="w-full shrink-0 snap-start py-2">
          {goal && (
            <>
              <div className="flex items-center justify-between text-[14.5px] font-medium">
                <span>{goal.title}</span>
                <span>{money(goal.saved)} / {money(goal.target)}</span>
              </div>
              <ProgressBar className="mt-2" value={(goal.saved / goal.target) * 100} />
              <div className="mt-2.5 flex gap-2">
                <button onClick={() => go("goal-setting")} className="press rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium">Contribute</button>
                <button onClick={() => go("savings-goals")} className="press rounded-lg border border-border px-3 py-1.5 text-[12.5px]">All Goals</button>
              </div>
            </>
          )}
        </div>
        <div className="flex w-full shrink-0 snap-start py-2">
          <button onClick={() => go("instant-dps")} className="press w-full rounded-2xl bg-tint-blue p-3 text-left">
            <p className="text-[14.5px] font-semibold text-primary">Instant DPS</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">Start your DPS in seconds</p>
            <span className="mt-2 inline-block rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium text-foreground">Start Now</span>
          </button>
        </div>
      </div>

      <div className="mt-1 flex justify-center gap-1.5">
        {[0, 1].map((i) => (
          <button
            key={i}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => slideTo(i)}
            className={cx("h-1.5 rounded-full transition-all", i === idx ? "w-4 bg-primary" : "w-1.5 bg-border")}
          />
        ))}
      </div>
    </div>
  );
}



function HomePage() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("quick");
  const [allQuick, setAllQuick] = useState(false);

  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const nepal = state.goals.find((g) => g.title === "Sri Lanka\u00a0Trip") ?? state.goals[0];


  const pinned = state.personalization.pinned.filter((id) => byId(id));
  const quickIds = [...new Set([...pinned, ...DEFAULT_QUICK, ...state.quickBanking])]
    .filter((id) => byId(id))
    .slice(0, 3);

  const moreIds = MORE_SERVICES_PRIORITY.filter((id) => byId(id)).slice(0, 3);


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
      <SectionCard key="quick" className="!py-2.5">
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
            <ArrowPill label="Show all Quick Banking services" onClick={() => setAllQuick(true)} />

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
      <SectionCard key="insights" title="Smart Insights" action="See All" onAction={() => go("spending-insights")} className="!py-2.5">
        <div className="rounded-2xl bg-tint-green p-2.5">
          <p className="text-[14.5px] font-semibold text-primary">Your Sri Lanka adventure is getting closer</p>
          <p className="mt-1 text-[13.5px] leading-snug">Just ৳37,500 to go. Sri Lanka is calling!!</p>
          <div className="mt-1.5 flex gap-2">
            <button onClick={() => go("goal-setting")} className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">Contribute</button>
            <button onClick={() => go("savings-goals")} className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">View Goal</button>
            <button onClick={() => go("spending-insights")} className="press px-2 text-[12.5px] text-muted-foreground">See All</button>
          </div>
        </div>
      </SectionCard>
    ),
    rewards: (
      <SectionCard key="rewards" title="Rewards" action="View Rewards" onAction={() => nav({ to: "/category/$categoryId", params: { categoryId: "rewards" } })} className="!py-2.5">
        <NextRewardCard compact />
      </SectionCard>
    ),


    goals: (
      <div key="goals" className="flex flex-col gap-3">
        <SectionCard className="!py-3">
          <GoalsCarousel goal={nepal} go={go} />
        </SectionCard>
        <button
          onClick={() => go("gift-netflix")}
          aria-label="Netflix payment offer"
          className="press block w-full overflow-hidden rounded-[18px]"
        >
          <img
            src={netflixPromo.url}
            alt="Stranger Things — Netflix payment offer"
            className="h-[104px] w-full object-cover object-[30%_center]"
          />
        </button>
      </div>
    ),


    more: (
      <SectionCard key="more" title="More services" className="!py-2.5">
        <div className="grid grid-cols-3">
          {moreIds.map((id) => {
            const s = byId(id)!;
            return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
          })}
        </div>
        <ArrowPill label="Open EBL Products" onClick={() => nav({ to: "/products", state: { fromHome: true } as never })} />

      </SectionCard>
    ),
  };

  return (
    <AppShell>
      <BirthdayNotice />


      <AccountCarousel />

      <ReorderableStack
        items={order.filter((id) => modules[id]).map((id) => ({ id, node: modules[id] }))}
        onReorder={(ids) => {
          patch({ dashboard: { ...state.dashboard, order: ids } });
          toast("Dashboard updated");
        }}
        afterItem={{ goals: <NetflixBanner onClick={() => go("gift-netflix")} /> }}
      />

      <FullSheet open={allQuick} onClose={() => setAllQuick(false)} title="All Shortcuts">
        <SectionCard title="All shortcuts" subtitle="Pin a service to keep it on Home">
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            {QUICK_CATALOGUE.map((id) => {
              const s = byId(id);
              if (!s) return null;
              const isPinned = state.personalization.pinned.includes(id);
              return (
                <div
                  key={id}
                  className={cx(
                    "relative flex h-[112px] w-full flex-col items-center rounded-2xl border px-1.5 pt-3 pb-2",
                    isPinned ? "border-brand bg-brand-soft" : "border-transparent",
                  )}
                >
                  <button
                    onClick={() => { setAllQuick(false); go(id); }}
                    className="press flex w-full flex-1 flex-col items-center gap-1.5"
                  >
                    <span className={cx("grid size-12 shrink-0 place-items-center rounded-full", TINT_BG[s.tint])}>
                      <Icon name={s.icon} className="size-6 text-foreground" />
                    </span>
                    <span className="line-clamp-2 h-[30px] w-full text-center text-[12px] leading-[15px] font-medium">
                      {s.title}
                    </span>
                  </button>
                  <button
                    aria-label={isPinned ? `Unpin ${s.title}` : `Pin ${s.title}`}
                    onClick={() => togglePin(id)}
                    className="press absolute top-1 right-1 grid size-7 place-items-center rounded-full"
                  >
                    <Pin className={cx("size-3.5", isPinned ? "fill-current text-primary" : "text-muted-foreground")} strokeWidth={1.8} />
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
