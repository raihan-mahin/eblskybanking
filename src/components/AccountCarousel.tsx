import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useApp, money } from "@/lib/store";
import { cx, StatusBadge, ProgressBar, Sheet, Button, useToast } from "./kit";
import { Icon } from "./Icon";
import { AuthenticationSheet } from "./AuthenticationSheet";

export function AccountCarousel() {
  const { state } = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const [show, setShow] = useState(true);
  const [index, setIndex] = useState(0);
  const [accountSheet, setAccountSheet] = useState(false);
  const [auth, setAuth] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  const account = state.accounts[0];
  const card = state.cards[0];
  const goal = state.goals.find((g) => g.title === "Nepal Trip") ?? state.goals[0];

  const slides = ["account", "card", "goal"].filter((k) =>
    k === "account" ? !!account : k === "card" ? !!card : !!goal,
  );

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
  const full = account ? account.masked.replace(/X/g, "0").replace(/0000 0000 0000/, "1102 9384 7560") : "";

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(full.replace(/\s/g, ""));
      toast.show("Account number copied");
    } catch {
      toast.show("Copy not available — number shown above");
    }
  };

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
          <div className="w-full shrink-0 snap-center px-4 pb-4">
            <div className="rounded-2xl bg-brand-soft p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">{account.name}</p>
                  <p className="text-[12.5px] text-muted-foreground">{account.masked}</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-tint-yellow">
                  <Icon name="Landmark" className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-[27px] leading-tight font-semibold">{show ? money(account.balance) : hidden}</p>
              <p className="text-[12.5px] text-muted-foreground">Available Balance</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <CarouselAction label="Account Number" onClick={() => { setRevealed(false); setAccountSheet(true); }} />
                <CarouselAction label="View Statement" onClick={() => go("statements")} />
                <CarouselAction label="Transfer Money" onClick={() => go("fund-transfer")} />
              </div>
            </div>
          </div>
        )}

        {card && (
          <div className="w-full shrink-0 snap-center px-4 pb-4">
            <div className="rounded-2xl bg-tint-blue p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">{card.name}</p>
                  <p className="text-[12.5px] text-muted-foreground">{card.masked} · {card.kind}</p>
                </div>
                <StatusBadge status={card.frozen ? "Frozen" : card.active ? "Active" : "Inactive"} />
              </div>
              <p className="mt-3 text-[24px] leading-tight font-semibold">
                {show ? money(Math.max(0, card.limit - card.balance)) : hidden}
              </p>
              <p className="text-[12.5px] text-muted-foreground">
                Available credit · used {show ? money(card.balance) : "••••"} of {money(card.limit)}
              </p>
              <ProgressBar className="mt-2" value={(card.balance / Math.max(1, card.limit)) * 100} />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <CarouselAction label="Pay Bill" onClick={() => go("card-payment")} />
                <CarouselAction label="Controls" onClick={() => go("card-controls")} />
                <CarouselAction label="Details" onClick={() => go("my-card")} />
              </div>
            </div>
          </div>
        )}

        {goal && (
          <div className="w-full shrink-0 snap-center px-4 pb-4">
            <div className="rounded-2xl bg-tint-green p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-muted-foreground">{goal.title} Savings Goal</p>
                  <p className="text-[12.5px] text-muted-foreground">Moved from your EBL Savings Account</p>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-card">
                  <Icon name={goal.icon} className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-[27px] leading-tight font-semibold">{show ? money(goal.saved) : hidden}</p>
              <p className="text-[12.5px] text-muted-foreground">
                Saved of {money(goal.target)} · Remaining {money(Math.max(0, goal.target - goal.saved))}
              </p>
              <ProgressBar className="mt-2" value={(goal.saved / Math.max(1, goal.target)) * 100} />
              <p className="mt-1 text-[12px] text-muted-foreground">
                Progress {((goal.saved / Math.max(1, goal.target)) * 100).toFixed(1)}%
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <CarouselAction label="Add Money" onClick={() => go("goal-setting")} />
                <CarouselAction label="View Goal" onClick={() => go("savings-goals")} />
                <CarouselAction label="Combined" onClick={() => go("accounts")} />
              </div>
            </div>
          </div>
        )}
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

      <Sheet open={accountSheet} onClose={() => setAccountSheet(false)} title="Account Number">
        <div className="rounded-2xl bg-brand-soft p-4">
          <p className="text-[13px] text-muted-foreground">{account?.name}</p>
          <p className="mt-1 text-[19px] font-semibold tracking-wide">{revealed ? full : account?.masked}</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">Eastern Bank PLC · Gulshan Branch · Routing 095260726</p>
        </div>
        <div className="mt-3 space-y-2">
          {!revealed && <Button onClick={() => setAuth(true)}>Authenticate to reveal &amp; copy</Button>}
          {revealed && <Button onClick={copyAccount}>Copy account number</Button>}
          <Button variant="outline" onClick={() => setAccountSheet(false)}>Close</Button>
        </div>
      </Sheet>

      <AuthenticationSheet
        open={auth}
        purpose="Reveal account number"
        onClose={() => setAuth(false)}
        onSuccess={() => { setAuth(false); setRevealed(true); }}
      />
      {toast.node}
    </section>
  );
}

function CarouselAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press rounded-xl bg-card px-1 py-2 text-[11.5px] leading-tight font-medium text-primary">
      {label}
    </button>
  );
}
