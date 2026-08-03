import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { SectionCard, FormField, TextInput, Button, SegmentedTabs, ListRow, cx } from "@/components/kit";
import { TxnFlow } from "@/components/TxnFlow";
import { useApp, money } from "@/lib/store";
import {
  AMOUNT_PRESETS, detectOperator, maskMobile, OPERATORS, RECHARGE_PACKS, SAVED_MOBILES,
  savedMobileName, type PackType, type RechargePack,
} from "@/lib/extras";

const TABS: PackType[] = ["Amount", "Minutes", "Internet", "SMS", "Bundle"];

export function RechargePanel({ initial }: { initial?: Record<string, string> | undefined }) {
  const { state } = useApp();
  const [mobile, setMobile] = useState(initial?.["mobile"] ?? "");
  const [override, setOverride] = useState<string | null>(initial?.["operator"] ?? null);
  const [tab, setTab] = useState<PackType>("Amount");
  const [amount, setAmount] = useState(initial?.["amount"] ?? "");
  const [pack, setPack] = useState<RechargePack | null>(null);
  const [pay, setPay] = useState(false);
  const [connection, setConnection] = useState("Prepaid");

  const clean = mobile.replace(/[^0-9]/g, "");
  const detected = detectOperator(clean);
  const operator = override ?? detected;
  const valid = /^01[3-9]\d{8}$/.test(clean);
  const savedName = savedMobileName(clean);

  const packs = useMemo(
    () => RECHARGE_PACKS.filter((p) => p.operator === operator && p.type === tab),
    [operator, tab],
  );

  if (pay && operator && valid) {
    const value = pack ? pack.price : Number(amount || 0);
    return (
      <TxnFlow
        serviceId="recharge"
        title={`${operator} Recharge`}
        category="Recharge"
        intro={`${maskMobile(clean)} · ${connection}${pack ? ` · ${pack.title}` : ""}`}
        banner={pack ? `${pack.title} · ${pack.detail} · valid ${pack.validity}` : `Top-up of ${money(value)}`}
        fixedAmount={value}
        fields={[
          { key: "mobile", label: "Mobile number", type: "text" },
          { key: "operator", label: "Operator", type: "text" },
          { key: "package", label: "Package", type: "text", optional: true },
        ]}
        initialValues={{
          mobile: maskMobile(clean),
          operator: `${operator} · ${connection}`,
          package: pack ? `${pack.title} (${pack.validity})` : "Plain amount top-up",
        }}
        onDone={() => setPay(false)}
      />
    );
  }

  return (
    <>
      <SectionCard title="Mobile Recharge" subtitle="We detect the operator from the number">
        <FormField label="Mobile number" hint="Operator is detected from the first three digits">
          <TextInput
            inputMode="numeric"
            value={mobile}
            placeholder="01XXXXXXXXX"
            onChange={(e) => { setMobile(e.target.value); setOverride(null); setPack(null); }}
          />
        </FormField>
        {savedName && <p className="-mt-1 text-[12.5px] text-muted-foreground">Saved as {savedName}</p>}

        {clean.length >= 3 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {operator ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2.5 py-1 text-[12.5px] font-medium text-success">
                <BadgeCheck className="size-3.5" /> {operator} detected
              </span>
            ) : (
              <span className="rounded-full bg-tint-yellow px-2.5 py-1 text-[12.5px]">Operator not recognised — select manually</span>
            )}
          </div>
        )}

        <div className="mt-3">
          <p className="mb-2 text-[13px] font-medium text-muted-foreground">Operator (tap to change)</p>
          <div className="grid grid-cols-3 gap-2">
            {OPERATORS.map((o) => (
              <button key={o} onClick={() => { setOverride(o); setPack(null); }}
                className={cx("press rounded-xl border p-2.5 text-[12.5px] font-medium",
                  operator === o ? "border-brand bg-brand-soft" : "border-border")}>
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="mb-2 text-[13px] font-medium text-muted-foreground">Connection type</p>
          <div className="grid grid-cols-3 gap-2">
            {["Prepaid", "Postpaid", "Skitto"].map((c) => (
              <button key={c} onClick={() => setConnection(c)}
                className={cx("press rounded-xl border p-2.5 text-[12.5px] font-medium",
                  connection === c ? "border-brand bg-brand-soft" : "border-border")}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Saved numbers">
        <div className="grid grid-cols-3 gap-2">
          {SAVED_MOBILES.map((s) => (
            <button key={s.number} onClick={() => { setMobile(s.number); setOverride(null); setPack(null); }}
              className="press rounded-xl border border-border p-2.5 text-left">
              <p className="truncate text-[12.5px] font-medium">{s.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{maskMobile(s.number)}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      {operator && (
        <>
          <SegmentedTabs
            tabs={TABS.map((t) => ({ id: t, label: t }))}
            value={tab}
            onChange={(v) => { setTab(v as PackType); setPack(null); }}
          />
          {tab === "Amount" ? (
            <SectionCard title="Top-up amount" subtitle={`${operator} · ${connection}`}>
              <div className="grid grid-cols-3 gap-2">
                {AMOUNT_PRESETS.map((a) => (
                  <button key={a} onClick={() => { setAmount(String(a)); setPack(null); }}
                    className={cx("press rounded-xl border p-3 text-[13px] font-medium",
                      amount === String(a) ? "border-brand bg-brand-soft" : "border-border")}>
                    {money(a)}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <FormField label="Or enter amount">
                  <TextInput inputMode="numeric" value={amount} placeholder="Enter amount"
                    onChange={(e) => { setAmount(e.target.value); setPack(null); }} />
                </FormField>
              </div>
            </SectionCard>
          ) : (
            <SectionCard title={`${tab} packages`} subtitle={`${packs.length} ${operator} offers`}>
              {packs.map((p) => (
                <button key={p.id} onClick={() => { setPack(p); setAmount(String(p.price)); }}
                  className={cx("press mb-2 block w-full rounded-2xl border p-3.5 text-left last:mb-0",
                    pack?.id === p.id ? "border-brand bg-brand-soft" : "border-border")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-medium">{p.title}</p>
                      <p className="text-[12.5px] text-muted-foreground">{p.detail} · valid {p.validity}</p>
                      {p.badge && <span className="mt-1.5 inline-block rounded-full bg-tint-yellow px-2 py-0.5 text-[11px] font-medium">{p.badge}</span>}
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-semibold">{money(p.price)}</p>
                      {p.original && <p className="text-[11.5px] text-muted-foreground line-through">{money(p.original)}</p>}
                    </div>
                  </div>
                </button>
              ))}
              {packs.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">No packages for this selection.</p>}
            </SectionCard>
          )}

          <div className="px-1">
            <Button
              disabled={!valid || (!pack && !Number(amount))}
              onClick={() => setPay(true)}
            >
              Continue {pack ? `· ${money(pack.price)}` : amount ? `· ${money(Number(amount))}` : ""}
            </Button>
            {!valid && <p className="mt-2 text-[12.5px] text-muted-foreground">Enter a valid 11-digit mobile number to continue.</p>}
          </div>
        </>
      )}

      <SectionCard title="Recent recharges">
        {state.transactions.filter((t) => t.serviceId === "recharge").slice(0, 4).map((t) => (
          <ListRow key={t.id} icon="Smartphone" tint="green" title={t.title} subtitle={t.date}
            right={<span className="text-[14px] font-semibold">{money(t.amount)}</span>} />
        ))}
        {state.transactions.filter((t) => t.serviceId === "recharge").length === 0 && (
          <p className="py-4 text-center text-[13.5px] text-muted-foreground">No recharges yet.</p>
        )}
      </SectionCard>
    </>
  );
}
