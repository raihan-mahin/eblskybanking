import { useNavigate } from "@tanstack/react-router";
import { SectionCard, Toggle, ServiceTile, ListRow, useToast, cx } from "@/components/kit";
import { useApp, money } from "@/lib/store";
import { ISLAMIC_SERVICES, DEMO_RATES, DEMO_RATE_TIMESTAMP } from "@/lib/extras";

export function IslamicPanel() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const on = state.islamic.mode === "islamic";
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  return (
    <>
      <SectionCard className={cx(on && "border border-success bg-tint-green")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[17px] font-semibold text-primary">EBL Islamic Mode</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              One tap switches the app to Shariah-compliant accounts, deposits and services.
            </p>
          </div>
          <Toggle
            checked={on}
            onChange={(v) => {
              patch({ islamic: { ...state.islamic, mode: v ? "islamic" : "conventional" } });
              toast.show(v ? "Islamic mode on" : "Islamic mode off");
            }}
          />
        </div>
        <p className={cx("mt-3 rounded-xl px-3.5 py-2.5 text-[12.5px]", on ? "bg-card" : "bg-tint-yellow")}>
          {on
            ? "Islamic mode is active. Interest-based products are hidden and profit-sharing products are shown."
            : "Currently in conventional mode. Turn on Islamic mode to see Shariah-compliant products first."}
        </p>
      </SectionCard>

      <SectionCard title="Islamic services" subtitle="Shariah-compliant products">
        <div className="grid grid-cols-3">
          {ISLAMIC_SERVICES.map((s) => (
            <ServiceTile key={s.id} icon={s.icon} tint={s.tint} label={s.label} onClick={() => go(s.target)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Indicative profit rates" subtitle="Prototype values, not live rates">
        <ListRow icon="PiggyBank" tint="green" title="Mudaraba DPS" subtitle="Profit shared monthly" right={<span className="text-[14px] font-semibold">7.25%</span>} />
        <ListRow icon="Landmark" tint="green" title="Mudaraba Term Deposit" subtitle="1 year tenure" right={<span className="text-[14px] font-semibold">8.10%</span>} />
        <ListRow icon="Banknote" tint="green" title="Islamic Financing" subtitle="Murabaha basis" right={<span className="text-[14px] font-semibold">9.50%</span>} />
      </SectionCard>

      <SectionCard title="Zakat" subtitle="Calculate on your holdings">
        <p className="text-[13.5px]">
          Estimated zakat on {money(state.accounts.reduce((a, b) => a + b.balance, 0))} is{" "}
          <span className="font-semibold">{money(state.accounts.reduce((a, b) => a + b.balance, 0) * 0.025)}</span> at 2.5%.
        </p>
        <div className="mt-2">
          <ListRow icon="Moon" tint="green" title="Open Zakat" subtitle="Calculate and give" onClick={() => go("zakat")} />
        </div>
      </SectionCard>

      <SectionCard title="Indicative FX rates" subtitle={DEMO_RATE_TIMESTAMP}>
        {DEMO_RATES.map((r) => (
          <div key={r.pair} className="flex justify-between border-b border-border py-2.5 text-[13.5px] last:border-0">
            <span>{r.pair}</span>
            <span className="font-medium">{r.rate}</span>
          </div>
        ))}
      </SectionCard>
      {toast.node}
    </>
  );
}
