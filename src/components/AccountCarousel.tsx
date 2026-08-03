import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useApp, money } from "@/lib/store";
import { cx, StatusBadge, ProgressBar } from "./kit";
import { Icon } from "./Icon";

export function AccountCarousel() {
  const { state } = useApp();
  const nav = useNavigate();
  const [show, setShow] = useState(true);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  const slides = [
    ...state.accounts.map((a) => ({ kind: "account" as const, item: a })),
    ...state.cards.map((c) => ({ kind: "card" as const, item: c })),
  ];

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setIndex(Math.round(el.scrollLeft / w));
  };

  const hidden = "৳ ••••••";

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
        {slides.map((s) => (
          <div key={s.kind + s.item.id} className="w-full shrink-0 snap-center px-4 pb-4">
            {s.kind === "account" ? (
              <div className="rounded-2xl bg-brand-soft p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] text-muted-foreground">{s.item.name}</p>
                    <p className="text-[12.5px] text-muted-foreground">{s.item.masked}</p>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-tint-yellow">
                    <Icon name="Landmark" className="size-5" />
                  </span>
                </div>
                <p className="mt-3 text-[27px] leading-tight font-semibold">{show ? money(s.item.balance) : hidden}</p>
                <p className="text-[12.5px] text-muted-foreground">Available balance</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <CarouselAction label="Transfer" onClick={() => go("fund-transfer")} />
                  <CarouselAction label="Add Money" onClick={() => go("add-money")} />
                  <CarouselAction label="Details" onClick={() => go("accounts")} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-tint-blue p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] text-muted-foreground">{s.item.name}</p>
                    <p className="text-[12.5px] text-muted-foreground">{s.item.masked} · {s.item.kind}</p>
                  </div>
                  <StatusBadge status={s.item.frozen ? "Frozen" : s.item.active ? "Active" : "Inactive"} />
                </div>
                <p className="mt-3 text-[24px] leading-tight font-semibold">
                  {show ? money(Math.max(0, s.item.limit - s.item.balance)) : hidden}
                </p>
                <p className="text-[12.5px] text-muted-foreground">
                  Available credit · used {show ? money(s.item.balance) : "••••"} of {money(s.item.limit)}
                </p>
                <ProgressBar className="mt-2" value={(s.item.balance / Math.max(1, s.item.limit)) * 100} />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <CarouselAction label="Pay Bill" onClick={() => go("card-payment")} />
                  <CarouselAction label="Controls" onClick={() => go("card-controls")} />
                  <CarouselAction label="Details" onClick={() => go("card-services")} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 pb-3">
        {slides.map((s, i) => (
          <span key={s.kind + s.item.id} className={cx("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-brand" : "w-1.5 bg-muted")} />
        ))}
      </div>
    </section>
  );
}

function CarouselAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press rounded-xl bg-card py-2 text-[12.5px] font-medium text-primary">
      {label}
    </button>
  );
}
