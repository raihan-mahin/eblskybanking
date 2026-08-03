import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ServiceTile, ListRow, SearchField, cx } from "@/components/kit";
import { useApp, money } from "@/lib/store";
import { byId, searchServices } from "@/lib/services";

export const Route = createFileRoute("/pay-transfer")({
  head: () => ({
    meta: [
      { title: "Pay & Transfer — EBL Sky Banking" },
      { name: "description", content: "Send money, pay bills, recharge, split payments and manage scheduled transfers in one hub." },
      { property: "og:title", content: "Pay & Transfer — EBL Sky Banking" },
      { property: "og:description", content: "Send money, pay bills, recharge, split payments and manage scheduled transfers in one hub." },
    ],
  }),
  component: PayTransferPage,
});

const GROUPS: { title: string; subtitle: string; ids: string[] }[] = [
  {
    title: "Send Money",
    subtitle: "Transfer to accounts and wallets",
    ids: ["fund-transfer", "phone-transfer", "other-bank-transfer", "mfs-transfer", "beneficiaries", "split-pay"],
  },
  {
    title: "Bills & Utilities",
    subtitle: "Never miss a due date",
    ids: ["bill-payment", "bill-electricity", "bill-gas", "bill-water", "bill-internet", "saved-billers"],
  },
  {
    title: "Mobile & Internet",
    subtitle: "Recharge and packages",
    ids: ["recharge", "bill-tv", "gift-cards"],
  },
  {
    title: "Cards & Credit",
    subtitle: "Pay and control your cards",
    ids: ["card-payment", "card-controls", "card-services"],
  },
  {
    title: "Education & Government",
    subtitle: "Fees, tolls and official payments",
    ids: ["tuition-fee", "education-payments", "visa-fee", "e-toll", "donation", "zakat"],
  },
  {
    title: "Scheduled & Automatic",
    subtitle: "Set it once and relax",
    ids: ["auto-pay", "scheduled-transfer", "upcoming-payments", "transaction-history"],
  },
];

function PayTransferPage() {
  const nav = useNavigate();
  const { state } = useApp();
  const [q, setQ] = useState("");
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const results = searchServices(q);

  return (
    <AppShell title="Pay & Transfer">
      <SearchField value={q} onChange={setQ} placeholder="Search payments and transfers" />

      {q ? (
        <SectionCard title="Results" subtitle={`${results.length} services`}>
          {results.map((r) => (
            <ListRow key={r.id} icon={r.icon} tint={r.tint} title={r.title} subtitle={r.description} onClick={() => go(r.id)} />
          ))}
          {results.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing found for “{q}”.</p>}
        </SectionCard>
      ) : (
        <>
          {state.recentEntities.length > 0 && (
            <SectionCard title="Repeat a payment" subtitle="Prefilled from your history">
              <div className={cx("grid grid-cols-3 gap-2")}>
                {state.recentEntities.slice(0, 6).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: r.serviceId }, search: { ref: r.id } })}
                    className="press rounded-2xl border border-border p-2.5 text-left"
                  >
                    <p className="truncate text-[12.5px] font-semibold">{r.entity}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{r.masked}</p>
                    <p className="mt-1 text-[11.5px] font-medium text-primary">{money(r.amount)}</p>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {GROUPS.map((g) => (
            <SectionCard key={g.title} title={g.title} subtitle={g.subtitle}>
              <div className="grid grid-cols-3">
                {g.ids.map((id) => {
                  const s = byId(id);
                  if (!s) return null;
                  return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
                })}
              </div>
            </SectionCard>
          ))}
        </>
      )}
    </AppShell>
  );
}
