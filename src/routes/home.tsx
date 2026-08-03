import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SegmentedTabs, InsightCard, SearchField, ProgressBar } from "@/components/kit";
import { useApp, money, levelFor, nextLevel } from "@/lib/store";
import { byId, searchServices, SERVICES } from "@/lib/services";

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

const QUICK = [
  "fund-transfer", "add-money", "recharge", "bill-payment",
  "split-pay", "qr-payment", "instant-dps", "rewards",
];

function HomePage() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("quick");
  const [q, setQ] = useState("");
  const [showBal, setShowBal] = useState(true);

  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const total = state.accounts.reduce((a, b) => a + b.balance, 0);
  const results = searchServices(q);
  const pts = state.rewards.points;
  const nl = nextLevel(pts);
  const pinned = state.personalization.pinned.filter((id) => byId(id));
  const quickIds = [...new Set([...pinned, ...QUICK])].slice(0, 8);
  const recentIds = state.recent.map((r) => r.serviceId).filter((id) => byId(id));
  const popular = SERVICES.slice()
    .sort((a, b) => (state.usage[b.id] ?? 0) - (state.usage[a.id] ?? 0))
    .slice(0, 8);
  const tiles = tab === "quick" ? quickIds.map((id) => byId(id)!) : (recentIds.length ? recentIds.map((id) => byId(id)!) : popular);

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

      <SectionCard className="bg-brand-soft">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-muted-foreground">Total available balance</p>
            <p className="text-[27px] leading-tight font-semibold">{showBal ? money(total) : "৳ ••••••"}</p>
          </div>
          <button onClick={() => setShowBal(!showBal)} className="press text-[12.5px] font-medium text-primary">
            {showBal ? "Hide" : "Show"}
          </button>
        </div>
        <div className="mt-3 space-y-1">
          {state.accounts.map((a) => (
            <ListRow
              key={a.id}
              icon="Landmark"
              tint="yellow"
              title={a.name}
              subtitle={a.masked}
              right={<span className="text-[14px] font-semibold">{showBal ? money(a.balance) : "••••"}</span>}
              onClick={() => go("accounts")}
            />
          ))}
        </div>
      </SectionCard>

      <SegmentedTabs
        tabs={[{ id: "quick", label: "Quick Banking" }, { id: "recent", label: "Recent" }]}
        value={tab}
        onChange={setTab}
      />

      <SectionCard
        title={tab === "quick" ? "Quick Banking" : "Recent"}
        subtitle={tab === "quick" ? "Your most used services" : recentIds.length ? "Recently opened" : "Popular with you"}
        action="See all"
        onAction={() => nav({ to: "/explore" })}
      >
        <div className="grid grid-cols-4">
          {tiles.map((s) => (
            <ServiceTile key={s.id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(s.id)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Smart insights" subtitle="Personalised for you">
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

      <SectionCard title="Rewards" subtitle={`${levelFor(pts)} · ${pts.toLocaleString()} points`} action="Open" onAction={() => go("rewards")}>
        <ProgressBar value={((pts - nl.floor) / Math.max(1, nl.ceil - nl.floor)) * 100} />
        <p className="mt-2 text-[12.5px] text-muted-foreground">
          {nl.need > 0 ? `${nl.need.toLocaleString()} points to ${nl.name}` : "Top level reached"}
        </p>
      </SectionCard>

      <SectionCard title="Recent transactions" action="View all" onAction={() => go("transaction-history")}>
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
    </AppShell>
  );
}
