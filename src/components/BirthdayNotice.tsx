import { useNavigate } from "@tanstack/react-router";
import { Gift, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { offerById } from "@/lib/extras";
import { cx } from "./kit";

export function BirthdayNotice({ compact }: { compact?: boolean }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const b = state.birthday;
  const offer = offerById(b.offerId);
  if (b.dismissed || !offer) return null;

  return (
    <div className={cx("rounded-2xl border border-brand bg-brand-soft p-3.5", !compact && "mb-1")}>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tint-pink">
          <Gift className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">Pinned · Birthday</p>
          <p className="text-[15px] font-semibold">Happy Birthday, {b.name}!</p>
          <p className="text-[13px] text-muted-foreground">
            Enjoy {offer.discount} off up to ৳{offer.maxBenefit} at {offer.partner}. {offer.expiry}.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              className="press rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium"
              onClick={() => {
                patch({ birthday: { ...b, read: true } });
                nav({ to: "/service/$serviceId", params: { serviceId: "reward-offers" } });
              }}
            >
              View Offer
            </button>
            <button
              className="press rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary"
              onClick={() => patch({
                birthday: { ...b, saved: true, read: true },
                offers: { ...state.offers, saved: [...new Set([...state.offers.saved, b.offerId])] },
              })}
            >
              {b.saved ? "Saved to Rewards" : "Save to Rewards"}
            </button>
          </div>
        </div>
        <button
          aria-label="Dismiss birthday offer"
          className="press grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground"
          onClick={() => patch({ birthday: { ...b, dismissed: true } })}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
