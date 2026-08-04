import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { cx } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { TINT_BG } from "@/lib/services";
import { PRODUCT_CATEGORIES } from "@/lib/extras";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "EBL Products — EBL Sky Banking" },
      { name: "description", content: "Browse EBL product categories: accounts, savings, loans, cards, transfers, payments and more." },
      { property: "og:title", content: "EBL Products — EBL Sky Banking" },
      { property: "og:description", content: "Browse EBL product categories: accounts, savings, loans, cards, transfers, payments and more." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const nav = useNavigate();

  return (
    <AppShell title="Products" back>
      <div className="grid grid-cols-3 gap-2">
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => nav({ to: "/category/$categoryId", params: { categoryId: c.id } })}
            className="press flex flex-col items-center gap-2 rounded-[16px] bg-card px-1.5 py-3.5 text-center"
          >
            <span className={cx("grid size-11 place-items-center rounded-full", TINT_BG[c.tint])}>
              <Icon name={c.icon} className="size-5" />
            </span>
            <span className="text-[11.5px] font-medium leading-tight text-primary">{c.title}</span>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
