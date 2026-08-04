import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ServiceTile } from "@/components/kit";
import { categoryById, inCategory } from "@/lib/services";
import { CATEGORY_PRIORITY } from "@/lib/extras";

export const Route = createFileRoute("/category/$categoryId")({
  head: ({ params }) => {
    const c = categoryById(params.categoryId);
    const title = `${c?.title ?? "Services"} — EBL Sky Banking`;
    const description = c?.subtitle ?? "Browse services in this category.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const nav = useNavigate();
  const cat = categoryById(categoryId);
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  if (!cat) {
    return (
      <AppShell title="Services" back>
        <SectionCard title="Category not found" subtitle={`No category matches “${categoryId}”.`}>
          <button className="press text-[14px] font-medium text-primary" onClick={() => nav({ to: "/explore" })}>
            Browse all services
          </button>
        </SectionCard>
      </AppShell>
    );
  }

  const all = inCategory(cat.id).map((s) => s.id);
  const priority = (CATEGORY_PRIORITY[cat.id] ?? []).filter((id) => all.includes(id));
  const ordered = [...priority, ...all.filter((id) => !priority.includes(id))];

  return (
    <AppShell title={cat.title} back>
      <SectionCard title={cat.title} subtitle={cat.subtitle}>
        <div className="grid grid-cols-3">
          {ordered.map((id) => {
            const s = inCategory(cat.id).find((x) => x.id === id)!;
            return <ServiceTile key={id} icon={s.icon} tint={s.tint} label={s.title} onClick={() => go(id)} />;
          })}
        </div>
      </SectionCard>
    </AppShell>
  );
}
