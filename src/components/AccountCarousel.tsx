import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ChevronRight as Chevron, Eye, EyeOff, Share2 } from "lucide-react";
import { useApp, money } from "@/lib/store";
import { cx, ProgressBar } from "./kit";
import { Icon } from "./Icon";

/** Every carousel card uses exactly this frame — same width, height, radius, padding. */
const CARD_FRAME = "flex h-[168px] flex-col justify-between rounded-2xl p-4";
const SLIDE = "w-full shrink-0 snap-center px-4 pb-4";

export function AccountCarousel() {
  const { state } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardTapRef = useRef<{ x: number; y: number; t: number; moved: boolean } | null>(null);
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  const account = state.accounts[0];
  const card = state.cards[0];
  const nepal = state.goals.find((g) => /nepal/i.test(g.title));
  const iphone = state.goals.find((g) => /iphone/i.test(g.title));

  const slides = [account && "account", card && "card", nepal && "nepal", iphone && "iphone"].filter(Boolean) as string[];

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setIndex(Math.round(el.scrollLeft / w));
  };

  const slideTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.min(slides.length - 1, Math.max(0, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  const hidden = "৳ ••••••";
  const fullNumber = account ? "1102 9384 7560 1234" : "";
  const outstanding = card?.balance ?? 0;

  return (
    <section className="app-card overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 pt-3.5">
        <p className="text-[13px] text-muted-foreground">Accounts &amp; Cards · swipe to switch</p>
        <button onClick={() => setShow(!show)} className="press flex items-center gap-1 text-[12.5px] font-medium text-primary">
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {show ? "Hide" : "Show"}
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-2 flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {account && (
          <div className={SLIDE}>
            <div className={cx(CARD_FRAME, "bg-brand-soft")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] text-muted-foreground">{account.name}</p>
                    <button
                      onClick={() => go("account-sharing")}
                      className="press inline-flex shrink-0 items-center gap-1 rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-primary"
                    >
                      <Share2 className="size-3" /> Share Info
                    </button>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p className="text-[12.5px] tracking-wide text-muted-foreground">
                      {showNumber ? fullNumber : account.masked}
                    </p>
                    <button
                      aria-label={showNumber ? "Hide account number" : "Reveal account number"}
                      onClick={() => setShowNumber(!showNumber)}
                      className="press grid size-6 place-items-center rounded-full text-muted-foreground"
                    >
                      {showNumber ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tint-yellow">
                  <Icon name="Landmark" className="size-5" />
                </span>
              </div>

              <button
                onClick={() => go("transaction-history")}
                aria-label="Open recent transaction history"
                className="press block w-full text-left"
              >
                <p className="text-[27px] leading-tight font-semibold">{show ? money(account.balance) : hidden}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[12.5px] text-muted-foreground">Available Balance · tap for history</p>
                  <Chevron className="size-4 text-muted-foreground" />
                </div>
              </button>
            </div>
          </div>
        )}

        {card && (
          <div className={SLIDE}>
            <div className={cx(CARD_FRAME, "bg-tint-blue")}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-muted-foreground">{card.name}</p>
                  <p className="text-[12.5px] tracking-wide text-muted-foreground">{card.masked}</p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card">
                  <Icon name="CreditCard" className="size-5" />
                </span>
              </div>
              <div>
                <p className="text-[27px] leading-tight font-semibold">
                  {show ? money(Math.max(0, card.limit - outstanding)) : hidden}
                </p>
                <p className="text-[12.5px] text-muted-foreground">Available limit</p>
              </div>
            </div>
          </div>
        )}

        {nepal && <GoalSlide goal={nepal} show={show} tint="bg-tint-green" hidden={hidden} go={go} />}
        {iphone && <GoalSlide goal={iphone} show={show} tint="bg-tint-purple" hidden={hidden} go={go} />}
      </div>

      <div className="flex items-center justify-center gap-3 pb-3">
        <button aria-label="Previous card" onClick={() => slideTo(index - 1)} disabled={index === 0}
          className="press grid size-7 place-items-center rounded-full bg-muted disabled:opacity-40">
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-1.5">
          {slides.map((s, i) => (
            <span key={s} className={cx("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-brand" : "w-1.5 bg-muted")} />
          ))}
        </div>
        <button aria-label="Next card" onClick={() => slideTo(index + 1)} disabled={index === slides.length - 1}
          className="press grid size-7 place-items-center rounded-full bg-muted disabled:opacity-40">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

function GoalSlide({
  goal, show, tint, hidden, go,
}: {
  goal: { id: string; title: string; icon: string; saved: number; target: number };
  show: boolean; tint: string; hidden: string; go: (id: string) => void;
}) {
  const pct = (goal.saved / Math.max(1, goal.target)) * 100;
  return (
    <div className={SLIDE}>
      <div className={cx(CARD_FRAME, tint)}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-muted-foreground">{goal.title} Savings Goal</p>
            <p className="truncate text-[12.5px] text-muted-foreground">Target {money(goal.target)}</p>
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card">
            <Icon name={goal.icon} className="size-5" />
          </span>
        </div>
        <div>
          <p className="text-[27px] leading-tight font-semibold">{show ? money(goal.saved) : hidden}</p>
          <ProgressBar className="mt-1.5" value={pct} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <CarouselAction label="Contribute" onClick={() => go("goal-setting")} />
          <CarouselAction label="View Goal" onClick={() => go("savings-goals")} />
        </div>
      </div>
    </div>
  );
}

function CarouselAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press rounded-xl bg-card px-1 py-1.5 text-[11.5px] leading-tight font-medium text-primary">
      {label}
    </button>
  );
}
