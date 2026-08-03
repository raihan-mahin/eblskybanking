import { useState } from "react";
import { SectionCard, Button, Sheet, StatusBadge, useToast, cx } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { useApp, money, levelFor } from "@/lib/store";
import { NextRewardCard } from "@/components/NextReward";
import { PARTNER_OFFERS, REWARD_CATEGORIES, type PartnerOffer } from "@/lib/extras";

export function PartnerOffersPanel() {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<PartnerOffer | null>(null);

  const list = PARTNER_OFFERS.filter((o) => cat === "All" || o.category === cat);
  const pts = state.rewards.points;

  const save = (o: PartnerOffer) => {
    const saved = state.offers.saved.includes(o.id)
      ? state.offers.saved.filter((x) => x !== o.id)
      : [...state.offers.saved, o.id];
    patch({ offers: { ...state.offers, saved } });
    toast.show(saved.includes(o.id) ? "Offer saved" : "Offer removed");
  };

  const redeem = (o: PartnerOffer) => {
    if (o.points > pts) return toast.show("Not enough points for this offer");
    patch({
      rewards: {
        ...state.rewards,
        points: pts - o.points,
        history: [{ id: "H" + Math.random().toString(36).slice(2), title: `${o.partner} — ${o.title}`, points: -o.points, date: "Today" }, ...state.rewards.history],
      },
      offers: { ...state.offers, used: [...state.offers.used, o.id] },
    });
    notify("Offer redeemed", `${o.partner} — ${o.title}. Show the voucher at the outlet.`, "reward");
    setOpen(null);
    toast.show("Voucher added to your rewards");
  };

  return (
    <>
      <NextRewardCard />
      <SectionCard title="Your points" subtitle={`${levelFor(pts)} · ${pts.toLocaleString()} points available`}>
        <p className="text-[12.5px] text-muted-foreground">
          Partner campaigns below are prototype demo offers from local merchants.
        </p>
      </SectionCard>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["All", ...REWARD_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cx("press shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-medium",
              cat === c ? "border-brand bg-brand-soft" : "border-border")}>
            {c}
          </button>
        ))}
      </div>

      <SectionCard title={cat === "All" ? "All partner offers" : cat} subtitle={`${list.length} offers`}>
        <div className="grid grid-cols-3 gap-2">
          {list.map((o) => (
            <button key={o.id} onClick={() => setOpen(o)} className="press rounded-2xl border border-border p-2.5 text-left">
              <span className={cx("mb-2 grid size-9 place-items-center rounded-full", "bg-tint-" + o.tint)}>
                <Icon name={o.icon} className="size-4.5" />
              </span>
              <p className="truncate text-[12.5px] font-semibold">{o.partner}</p>
              <p className="line-clamp-2 text-[11px] text-muted-foreground">{o.title}</p>
              <p className="mt-1 text-[11.5px] font-medium text-primary">{o.discount} off</p>
              {state.offers.used.includes(o.id) && <p className="text-[10.5px] text-success">Redeemed</p>}
            </button>
          ))}
        </div>
      </SectionCard>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.partner}>
        {open && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-brand-soft p-3.5">
              <p className="text-[15px] font-semibold">{open.title}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{open.category} · valid till {open.expiry}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                <span className="rounded-full bg-card px-2.5 py-1">Max benefit {money(open.maxBenefit)}</span>
                {open.minSpend > 0 && <span className="rounded-full bg-card px-2.5 py-1">Min spend {money(open.minSpend)}</span>}
                <span className="rounded-full bg-card px-2.5 py-1">{open.points ? `${open.points} points` : "Free"}</span>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[13.5px] font-medium">Terms</p>
              <ul className="space-y-1 text-[12.5px] text-muted-foreground">
                {open.terms.map((t) => <li key={t}>• {t}</li>)}
              </ul>
            </div>
            {state.offers.used.includes(open.id) ? (
              <StatusBadge status="Redeemed" />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => save(open)}>
                  {state.offers.saved.includes(open.id) ? "Saved" : "Save offer"}
                </Button>
                <Button onClick={() => redeem(open)}>
                  {open.points ? `Redeem · ${open.points} pts` : "Activate"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Sheet>
      {toast.node}
    </>
  );
}
