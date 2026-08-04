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
    <div className={cx("flex items-center gap-2.5 rounded-2xl border border-brand bg-brand-soft px-3 py-2", !compact && "mb-1")}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-tint-pink">
        <Gift className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">Happy Birthday, {b.name}!</p>
        <p className="truncate text-[11.5px] text-muted-foreground">
          {offer.discount} off at {offer.partner}
        </p>
      </div>
      <button
        className="press shrink-0 text-[12px] font-medium text-primary"
        onClick={() => {
          patch({ birthday: { ...b, read: true } });
          nav({ to: "/service/$serviceId", params: { serviceId: "notifications" } });
        }}
      >
        View All
      </button>
      <button
        aria-label="Dismiss birthday offer"
        className="press grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground"
        onClick={() => patch({ birthday: { ...b, dismissed: true } })}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
