import { useNavigate } from "@tanstack/react-router";
import { ProgressBar } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { money } from "@/lib/store";
import { NEXT_REWARD } from "@/lib/extras";

export function NextRewardCard({ compact }: { compact?: boolean }) {
  const nav = useNavigate();
  const remaining = Math.max(0, NEXT_REWARD.target - NEXT_REWARD.progress);
  const pct = (NEXT_REWARD.progress / NEXT_REWARD.target) * 100;

  if (compact) {
    return (
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tint-yellow">
          <Icon name="Award" className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] text-muted-foreground">Next Reward</p>
          <p className="text-[14px] font-semibold text-primary">{NEXT_REWARD.title}</p>
          <p className="text-[12.5px] text-muted-foreground">Spend {money(remaining)} more to unlock.</p>
          <ProgressBar className="mt-1.5 h-1.5" value={pct} />
          <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{money(NEXT_REWARD.progress)} of {money(NEXT_REWARD.target)}</span>
            <span>Expires {NEXT_REWARD.expiry}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="app-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tint-yellow">
          <Icon name="Award" className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted-foreground">Next Reward</p>
          <p className="text-[15px] font-semibold text-primary">{NEXT_REWARD.title}</p>
          <p className="text-[12.5px] text-muted-foreground">Spend {money(remaining)} more to unlock this reward.</p>
          <ProgressBar className="mt-2 h-1.5" value={pct} />
          <div className="mt-1.5 flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span>{money(NEXT_REWARD.progress)} of {money(NEXT_REWARD.target)}</span>
            <span>Expires {NEXT_REWARD.expiry}</span>
          </div>
          <button
            onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "partner-offers" } })}
            className="press mt-2 text-[12.5px] font-medium text-primary"
          >
            View Details
          </button>
        </div>
      </div>
    </section>
  );
}
