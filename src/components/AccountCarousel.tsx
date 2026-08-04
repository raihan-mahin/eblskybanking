import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Share2 } from "lucide-react";
import { useApp, money } from "@/lib/store";
import { cx, ProgressBar } from "./kit";
import { Icon } from "./Icon";

/** Compact shared frame: every carousel card uses identical width, height, radius, padding. */
const CARD_FRAME = "flex h-[148px] flex-col justify-between rounded-2xl p-3";
const SLIDE = "w-full shrink-0 snap-center px-4 pb-0";

type Tap = { x: number; y: number; t: number; moved: boolean };

/** Distinguishes a real tap from a swipe / drag, and ignores taps on controls. */
function useTapIntent(onTap: () => void) {
  const ref = useRef<Tap | null>(null);
  return {
    onPointerDown: (e: React.PointerEvent) => {
      ref.current = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const r = ref.current;
      if (!r || r.moved) return;
      if (Math.hypot(e.clientX - r.x, e.clientY - r.y) > 12) r.moved = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      const r = ref.current;
      ref.current = null;
      if (!r || r.moved) return;
      if (Date.now() - r.t >= 300) return;
      if ((e.target as HTMLElement).closest("button,a,[role='button']")) return;
      onTap();
    },
    onPointerLeave: () => { ref.current = null; },
    onPointerCancel: () => { ref.current = null; },
  };
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      aria-label={show ? "Hide sensitive information" : "Show sensitive information"}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="press grid size-8 shrink-0 place-items-center rounded-full bg-card/70 text-muted-foreground"
    >
      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

export function AccountCarousel() {
  const { state } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
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
  const toggle = () => setShow((v) => !v);

  const accountTap = useTapIntent(() => go("transaction-history"));
  const cardTap = useTapIntent(() => go("card-services"));

  return (
    <section className="app-card overflow-hidden p-0">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pt-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {account && (
          <div className={SLIDE}>
            <div
              {...accountTap}
              className={cx(CARD_FRAME, "bg-brand-soft cursor-pointer transition-transform active:scale-[0.98]")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[13px] text-muted-foreground">{account.name}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); go("account-sharing"); }}
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
                      onClick={(e) => { e.stopPropagation(); setShowNumber(!showNumber); }}
                      className="press grid size-6 place-items-center rounded-full text-muted-foreground"
                    >
                      {showNumber ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <EyeToggle show={show} onToggle={toggle} />
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tint-yellow">
                    <Icon name="Landmark" className="size-5" />
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[27px] leading-tight font-semibold">{show ? money(account.balance) : hidden}</p>
                <p className="text-[12.5px] text-muted-foreground">Available Balance</p>
              </div>
            </div>
          </div>
        )}

        {card && (
          <div className={SLIDE}>
            <div
              {...cardTap}
              className={cx(CARD_FRAME, "bg-tint-blue", "relative cursor-pointer transition-transform active:scale-[0.98]")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-muted-foreground">{card.name}</p>
                  <p className="text-[12.5px] tracking-wide text-muted-foreground">{card.masked}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <EyeToggle show={show} onToggle={toggle} />
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card">
                    <Icon name="CreditCard" className="size-5" />
                  </span>
                </div>
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

        {nepal && <GoalSlide goal={nepal} show={show} onToggle={toggle} tint="bg-tint-green" hidden={hidden} go={go} />}
        {iphone && <GoalSlide goal={iphone} show={show} onToggle={toggle} tint="bg-tint-purple" hidden={hidden} go={go} />}
      </div>

      <div className="flex items-center justify-center gap-2 pb-1.5">
        <button aria-label="Previous card" onClick={() => slideTo(index - 1)} disabled={index === 0}
          className="press grid size-6 place-items-center rounded-full bg-muted disabled:opacity-40">
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex gap-1">
          {slides.map((s, i) => (
            <span key={s} className={cx("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-brand" : "w-1.5 bg-muted")} />
          ))}
        </div>
        <button aria-label="Next card" onClick={() => slideTo(index + 1)} disabled={index === slides.length - 1}
          className="press grid size-6 place-items-center rounded-full bg-muted disabled:opacity-40">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}

function GoalSlide({
  goal, show, onToggle, tint, hidden, go,
}: {
  goal: { id: string; title: string; icon: string; saved: number; target: number };
  show: boolean; onToggle: () => void; tint: string; hidden: string; go: (id: string) => void;
}) {
  const pct = (goal.saved / Math.max(1, goal.target)) * 100;
  const tap = useTapIntent(() => go("savings-goals"));
  return (
    <div className={SLIDE}>
      <div {...tap} className={cx(CARD_FRAME, tint, "cursor-pointer transition-transform active:scale-[0.98]")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13px] text-muted-foreground">{goal.title} Savings Goal</p>
            <p className="truncate text-[12.5px] text-muted-foreground">
              Target {show ? money(goal.target) : hidden}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <EyeToggle show={show} onToggle={onToggle} />
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card">
              <Icon name={goal.icon} className="size-5" />
            </span>
          </div>
        </div>
        <div>
          <p className="text-[27px] leading-tight font-semibold">{show ? money(goal.saved) : hidden}</p>
          {show ? (
            <ProgressBar className="mt-1.5" value={pct} />
          ) : (
            <div className="mt-1.5 h-2 w-full rounded-full bg-muted" />
          )}
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
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="press rounded-xl bg-card px-1 py-1.5 text-[11.5px] leading-tight font-medium text-primary"
    >
      {label}
    </button>
  );
}
