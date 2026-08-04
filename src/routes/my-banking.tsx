import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ListRow, ServiceTile, StatusBadge, ProgressBar } from "@/components/kit";
import { useApp, money } from "@/lib/store";

export const Route = createFileRoute("/my-banking")({
  head: () => ({
    meta: [
      { title: "My Banking — EBL Sky Banking" },
      { name: "description", content: "Accounts, cards, deposits, goals and statements in one place." },
      { property: "og:title", content: "My Banking — EBL Sky Banking" },
      { property: "og:description", content: "Accounts, cards, deposits, goals and statements in one place." },
    ],
  }),
  component: MyBankingPage,
});

const SHORTCUTS = [
  { id: "statements", icon: "FileText", label: "Statements", tint: "gray" as const },
  { id: "limits", icon: "ListChecks", label: "Limits", tint: "blue" as const },
  { id: "receipts", icon: "Receipt", label: "Receipts", tint: "green" as const },
  { id: "certificates", icon: "FileText", label: "Certificates", tint: "purple" as const },
];

function MyBankingPage() {
  const { state } = useApp();
  const nav = useNavigate();
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  return (
    <AppShell title="My Banking">
      <SectionCard title="Manage" subtitle="Sharing, layout and banking mode">
        <ListRow icon="Share2" tint="blue" title="Share account details" subtitle="Copy, share sheet or NFC tap" onClick={() => go("account-sharing")} />
        <ListRow icon="ListChecks" tint="purple" title="Personalization" subtitle="Customize your Home dashboard" onClick={() => go("personalization")} />
        <ListRow icon="ShieldCheck" tint="pink" title="Transaction disputes" subtitle={`${state.disputes.length} cases`} onClick={() => go("disputes")} />
      </SectionCard>

      <SectionCard title="Accounts" action="Details" onAction={() => go("accounts")}>

        {state.accounts.map((a) => (
          <ListRow
            key={a.id}
            icon="Landmark"
            tint="yellow"
            title={a.name}
            subtitle={a.masked}
            right={<span className="text-[14px] font-semibold">{money(a.balance)}</span>}
            onClick={() => go("accounts")}
          />
        ))}
      </SectionCard>

      <SectionCard title="Cards" action="Manage" onAction={() => go("card-services")}>
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

      <SectionCard title="Deposits" action="Open new" onAction={() => go("dps")}>
        {state.dps.map((d) => (
          <ListRow
            key={d.id}
            icon="PiggyBank"
            tint="green"
            title={d.title}
            subtitle={`${money(d.monthly)}/month · matures ${d.matures}`}
            right={<span className="text-[13.5px] font-semibold">{money(d.saved)}</span>}
            onClick={() => go("dps")}
          />
        ))}
        {state.fdr.map((f) => (
          <ListRow
            key={f.id}
            icon="Landmark"
            tint="yellow"
            title={f.title}
            subtitle={`${f.rate}% · matures ${f.matures}`}
            right={<span className="text-[13.5px] font-semibold">{money(f.amount)}</span>}
            onClick={() => go("fdr")}
          />
        ))}
      </SectionCard>

      <SectionCard title="Goals" action="All goals" onAction={() => go("savings-goals")}>
        {state.goals.map((g) => (
          <div key={g.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between text-[14.5px] font-medium">
              <span>{g.title}</span>
              <span>{money(g.saved)} / {money(g.target)}</span>
            </div>
            <ProgressBar className="mt-2" value={(g.saved / g.target) * 100} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Group DPS" action="Open" onAction={() => go("group-dps")}>
        {state.groupDps.map((g) => (
          <ListRow key={g.id} icon="Users" tint="purple" title={g.title} subtitle={`${g.members.length} members`} onClick={() => go("group-dps")} />
        ))}
      </SectionCard>

      <SectionCard title="Documents & limits">
        <div className="grid grid-cols-4">
          {SHORTCUTS.map((s) => (
            <ServiceTile key={s.id} icon={s.icon} tint={s.tint} label={s.label} onClick={() => go(s.id)} />
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
