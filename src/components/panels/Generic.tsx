import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, SearchField, StatusBadge, Button, SegmentedTabs, ProgressBar } from "../kit";
import { Icon } from "../Icon";
import { useApp, money } from "@/lib/store";
import { byId, SERVICES } from "@/lib/services";

export function HistoryPanel() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const list = state.transactions.filter(
    (t) =>
      (tab === "all" || t.direction === tab) &&
      (t.title.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <>
      <SearchField value={q} onChange={setQ} placeholder="Search transactions" />
      <SegmentedTabs
        tabs={[{ id: "all", label: "All" }, { id: "debit", label: "Payments" }]}
        value={tab === "credit" ? "all" : tab}
        onChange={setTab}
      />
      <SectionCard title="Transactions" subtitle={`${list.length} records`}>
        {list.map((t) => (
          <ListRow
            key={t.id}
            icon={byId(t.serviceId)?.icon ?? "Receipt"}
            tint={t.direction === "credit" ? "green" : "gray"}
            title={t.title}
            subtitle={`${t.date} · Ref ${t.ref}`}
            right={
              <span className={t.direction === "credit" ? "text-[14px] font-semibold text-success" : "text-[14px] font-semibold"}>
                {t.direction === "credit" ? "+" : "-"}
                {money(t.amount)}
              </span>
            }
          />
        ))}
        {list.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">No transactions found.</p>}
      </SectionCard>
    </>
  );
}

export function BeneficiariesPanel() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const list = state.beneficiaries.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <SearchField value={q} onChange={setQ} placeholder="Search beneficiaries" />
      <SectionCard title="Saved recipients" subtitle={`${state.beneficiaries.length} saved`}>
        {list.map((b) => (
          <ListRow
            key={b.id}
            icon="UserPlus"
            tint="blue"
            title={b.name}
            subtitle={`${b.bank} · ${b.account}`}
            onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "fund-transfer" } })}
          />
        ))}
      </SectionCard>
      <SectionCard title="Manage">
        <ListRow
          icon="PlusCircle"
          tint="green"
          title="Add beneficiary"
          subtitle="Save a new recipient"
          onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "fund-transfer" } })}
        />
        <ListRow
          icon="X"
          tint="pink"
          title="Remove last added"
          onClick={() => patch({ beneficiaries: state.beneficiaries.slice(0, -1) })}
        />
      </SectionCard>
    </>
  );
}

export function UpcomingPanel() {
  const { state } = useApp();
  const nav = useNavigate();
  return (
    <SectionCard title="Upcoming payments" subtitle="Scheduled and recurring">
      {state.schedules.map((s) => (
        <ListRow
          key={s.id}
          icon="Clock"
          tint="blue"
          title={s.name}
          subtitle={`${s.start} · ${s.frequency} · ${money(s.amount)}`}
          right={<StatusBadge status={s.active ? "Active" : "Paused"} />}
          onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "scheduled-transfer" } })}
        />
      ))}
      {state.schedules.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing scheduled yet.</p>}
    </SectionCard>
  );
}

export function BudgetPanel() {
  const { state } = useApp();
  const spend: Record<string, number> = {};
  state.transactions
    .filter((t) => t.direction === "debit")
    .forEach((t) => (spend[t.category] = (spend[t.category] ?? 0) + t.amount));
  const entries = Object.entries(spend).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  return (
    <SectionCard title="Budget management" subtitle="Monthly category budgets">
      {entries.map(([cat, val]) => {
        const b = budgets[cat] ?? Math.max(2000, Math.ceil((val * 1.3) / 500) * 500);
        return (
          <div key={cat} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between text-[14.5px] font-medium">
              <span>{cat}</span>
              <span>{money(val)} / {money(b)}</span>
            </div>
            <ProgressBar className="mt-2" value={(val / b) * 100} />
            <div className="mt-2 flex gap-2">
              <Button variant="outline" className="h-9 text-[12.5px]" onClick={() => setBudgets({ ...budgets, [cat]: b + 1000 })}>
                Increase ৳1,000
              </Button>
              <Button variant="ghost" className="h-9 text-[12.5px]" onClick={() => setBudgets({ ...budgets, [cat]: Math.max(500, b - 1000) })}>
                Decrease
              </Button>
            </div>
          </div>
        );
      })}
    </SectionCard>
  );
}

export function RelatedPanel({ serviceId }: { serviceId: string }) {
  const nav = useNavigate();
  const svc = byId(serviceId);
  const related = SERVICES.filter((x) => x.category === svc?.category && x.id !== serviceId).slice(0, 8);
  return (
    <>
      <SectionCard>
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tint-yellow">
            <Icon name={svc?.icon ?? "Sparkles"} className="size-6" />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold text-primary">{svc?.title ?? "Service"}</h2>
            <p className="text-[13.5px] text-muted-foreground">{svc?.description}</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Related services">
        {related.map((r) => (
          <ListRow
            key={r.id}
            icon={r.icon}
            tint={r.tint}
            title={r.title}
            subtitle={r.description}
            onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: r.id } })}
          />
        ))}
      </SectionCard>
    </>
  );
}
