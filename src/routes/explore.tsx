import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { cx } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { TINT_BG } from "@/lib/services";
import { EXPLORE_OPTIONS, type ExploreOption } from "@/lib/extras";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore EBL — EBL Sky Banking" },
      { name: "description", content: "Explore EBL products, rewards and offers, ZIP partners, biometric login and security & support." },
      { property: "og:title", content: "Explore EBL — EBL Sky Banking" },
      { property: "og:description", content: "Explore EBL products, rewards and offers, ZIP partners, biometric login and security & support." },
    ],
  }),
  component: ExplorePage,
});

const ARROW_BG: Record<string, string> = {
  yellow: "bg-[#F59E0B]",
  blue: "bg-[#2563EB]",
  green: "bg-[#16A34A]",
  purple: "bg-[#7C3AED]",
  pink: "bg-[#DB2777]",
  gray: "bg-[#475569]",
};

const RING: Record<string, string> = {
  yellow: "border-[#F59E0B]/40",
  blue: "border-[#2563EB]/40",
  green: "border-[#16A34A]/40",
  purple: "border-[#7C3AED]/40",
  pink: "border-[#DB2777]/40",
  gray: "border-[#475569]/30",
};

function ExplorePage() {
  const nav = useNavigate();

  const open = (o: ExploreOption) => {
    if (o.to === "/products") { nav({ to: "/products", state: { fromExplore: true } as never }); return; }
    if (o.to === "/category/$categoryId") { nav({ to: "/category/$categoryId", params: { categoryId: o.param! } }); return; }
    if (o.to === "/service/$serviceId") nav({ to: "/service/$serviceId", params: { serviceId: o.param! } });
  };

  const [products, rewards, ...rest] = EXPLORE_OPTIONS;

  const Big = ({ o }: { o: ExploreOption }) => (
    <button
      onClick={() => open(o)}
      className={cx("press flex min-h-[188px] flex-1 flex-col rounded-[18px] border bg-card p-4 text-left", RING[o.tint])}
    >
      <span className={cx("mx-auto grid size-16 place-items-center rounded-full", TINT_BG[o.tint])}>
        <Icon name={o.icon} className="size-8" />
      </span>
      <span className="mt-3 block text-center text-[16px] font-semibold text-primary">{o.title}</span>
      <span className="mt-1 block text-center text-[12.5px] leading-snug text-muted-foreground">{o.subtitle}</span>
      <span className="mt-auto flex justify-end pt-3">
        <span className={cx("grid size-8 place-items-center rounded-full text-white", ARROW_BG[o.tint])}>
          <Icon name="ArrowRight" className="size-4" />
        </span>
      </span>
    </button>
  );

  const Row = ({ o }: { o: ExploreOption }) => (
    <button
      onClick={() => open(o)}
      className={cx("press flex w-full items-center gap-3 rounded-[18px] border bg-card p-4 text-left", RING[o.tint])}
    >
      <span className={cx("grid size-12 shrink-0 place-items-center rounded-full", TINT_BG[o.tint])}>
        <Icon name={o.icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-semibold text-primary">{o.title}</span>
        <span className="block text-[12.5px] leading-snug text-muted-foreground">{o.subtitle}</span>
      </span>
      <span className={cx("grid size-8 shrink-0 place-items-center rounded-full text-white", ARROW_BG[o.tint])}>
        <Icon name="ArrowRight" className="size-4" />
      </span>
    </button>
  );

  return (
    <AppShell title="Explore EBL">
      <div className="flex gap-3">
        {products && <Big o={products} />}
        {rewards && <Big o={rewards} />}
      </div>
      {rest.map((o) => (
        <Row key={o.id} o={o} />
      ))}
    </AppShell>
  );
}
