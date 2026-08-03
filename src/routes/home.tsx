import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { AppShell, FullSheet } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SegmentedTabs, InsightCard, SearchField, ProgressBar, StatusBadge, cx } from "@/components/kit";
import { AccountCarousel } from "@/components/AccountCarousel";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { BirthdayNotice } from "@/components/BirthdayNotice";
import { useApp, money, levelFor, nextLevel } from "@/lib/store";
import { byId, searchServices, SERVICES } from "@/lib/services";
import { DEFAULT_DASHBOARD_ORDER, DEFAULT_QUICK, QUICK_CATALOGUE } from "@/lib/extras";

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
  const [q, setQ] = useState("");
  const [customize, setCustomize] = useState(false);
  const [allQuick, setAllQuick] = useState(false);

  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const results = searchServices(q);
  const pts = state.rewards.points;
  const nl = nextLevel(pts);

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

  const modules: Record<string, React.ReactNode> = {
    quick: (
      <SectionCard
        key="quick"
        title={tab === "quick" ? "Quick Banking" : "Recent"}
        subtitle={tab === "quick" ? "Your top 3 services" : "Tap to repeat with details filled in"}
        action="See all"
        onAction={() => (tab === "quick" ? setAllQuick(true) : nav({ to: "/pay-transfer" }))}
      >
        <SegmentedTabs
          tabs={[{ id: "quick", label: "Quick Banking" }, { id: "recent", label: "Recent" }]}
          value={tab}
          onChange={setTab}
        />
        {tab === "quick" ? (
          <div className="grid grid-cols-3">
            {quickIds.map((id) => {
              const s = byId(id)!;
              return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
            })}
          </div>
        ) : (
          <div className="mt-1">
            {state.recentEntities.slice(0, 5).map((r) => (
              <ListRow
                key={r.id}
                icon={r.icon}
                tint={r.tint}
                title={r.label}
                subtitle={`${r.masked} · ${r.detail}`}
                right={<span className="text-[13.5px] font-semibold">{money(r.amount)}</span>}
                onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: r.serviceId }, search: { ref: r.id } })}
              />
            ))}
            {state.recentEntities.length === 0 && (
              <p className="py-5 text-center text-[13.5px] text-muted-foreground">No recent activity yet.</p>
            )}
          </div>
        )}
      </SectionCard>
    ),
    insights: (
      <SectionCard key="insights" title="Smart insights" subtitle="Personalised for you">
        <div className="space-y-2.5">
          {state.insights.slice(0, 3).map((i) => (
            <InsightCard
              key={i.id}
              text={i.text}
              tone={i.tone}
              action={i.action}
              onAction={() => go(i.target)}
              onDismiss={() => patch({ insights: state.insights.filter((x) => x.id !== i.id) })}
            />
          ))}
        </div>
      </SectionCard>
    ),
    rewards: (
      <SectionCard key="rewards" title="Rewards" subtitle={`${levelFor(pts)} · ${pts.toLocaleString()} points`} action="Open" onAction={() => go("rewards")}>
        <ProgressBar value={((pts - nl.floor) / Math.max(1, nl.ceil - nl.floor)) * 100} />
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          {nl.need > 0 ? `${nl.need.toLocaleString()} points to ${nl.name}` : "Top level reached"}
        </p>
        <div className="mt-3">
          <ListRow icon="BadgePercent" tint="pink" title="Partner offers" subtitle="Cineplex, Yum Cha, Gentle Park and more" onClick={() => go("partner-offers")} />
        </div>
      </SectionCard>
    ),
    transactions: (
      <SectionCard key="transactions" title="Recent transactions" action="View all" onAction={() => go("transaction-history")}>
        {state.transactions.slice(0, 5).map((t) => (
          <ListRow
            key={t.id}
            icon={byId(t.serviceId)?.icon ?? "Receipt"}
            tint={t.direction === "credit" ? "green" : "gray"}
            title={t.title}
            subtitle={t.date}
            right={
              <span className={t.direction === "credit" ? "text-[14px] font-semibold text-success" : "text-[14px] font-semibold"}>
                {t.direction === "credit" ? "+" : "-"}{money(t.amount)}
              </span>
            }
            onClick={() => go("transaction-history")}
          />
        ))}
      </SectionCard>
    ),
    goals: (
      <SectionCard key="goals" title="Savings & goals" action="All goals" onAction={() => go("savings-goals")}>
        {state.goals.slice(0, 2).map((g) => (
          <div key={g.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between text-[14.5px] font-medium">
              <span>{g.title}</span>
              <span>{money(g.saved)} / {money(g.target)}</span>
            </div>
            <ProgressBar className="mt-2" value={(g.saved / g.target) * 100} />
          </div>
        ))}
      </SectionCard>
    ),
    cards: (
      <SectionCard key="cards" title="Cards" action="Manage" onAction={() => go("card-services")}>
        {state.cards.map((c) => (
          <ListRow
            key={c.id}
            icon="CreditCard"
            tint="blue"
            title={c.name}
            subtitle={`${c.masked} · ${c.kind}`}
            right={<StatusBadge status={c.frozen ? "Frozen" : c.active ? "Active" : "Inactive"} />}
            onClick={() => go("card-services")}
          />
        ))}
      </SectionCard>
    ),
    more: (
      <SectionCard key="more" title="More services" action="Explore" onAction={() => nav({ to: "/explore" })}>
        <div className="grid grid-cols-3">
          {["split-pay", "qr-payment", "instant-dps", "group-dps", "e-toll", "disputes"].map((id) => {
            const s = byId(id);
            if (!s) return null;
            return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
          })}
        </div>
      </SectionCard>
    ),
    recommended: (
      <SectionCard key="recommended" title="Recommended for you" subtitle="Based on how you bank">
        <ListRow icon="Send" tint="green" title="Send by mobile number" subtitle="Find the linked account instantly" onClick={() => go("phone-transfer")} />
        <ListRow icon="Moon" tint="green" title="Try EBL Islamic mode" subtitle="Shariah-compliant products in one tap" onClick={() => go("islamic-mode")} />
        <ListRow icon="ListChecks" tint="purple" title="Customize your dashboard" subtitle="Reorder or hide Home modules" onClick={() => setCustomize(true)} />
      </SectionCard>
    ),
  };

  return (
    <AppShell>
      <SearchField value={q} onChange={setQ} placeholder="Search services, bills, transfers" />
      {q && (
        <SectionCard title="Search results" subtitle={`${results.length} matches`}>
          {results.slice(0, 12).map((r) => (
            <ListRow key={r.id} icon={r.icon} tint={r.tint} title={r.title} subtitle={r.description} onClick={() => go(r.id)} />
          ))}
          {results.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">No services matched “{q}”.</p>}
        </SectionCard>
      )}

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
