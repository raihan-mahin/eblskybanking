import { ArrowDown, ArrowUp } from "lucide-react";
import { useApp } from "@/lib/store";
import { SectionCard, Toggle, Button, useToast } from "./kit";
import { DASHBOARD_MODULES, DEFAULT_DASHBOARD_ORDER } from "@/lib/extras";

export function DashboardCustomizer() {
  const { state, patch } = useApp();
  const toast = useToast();
  const d = state.dashboard;
  const order = [
    ...d.order.filter((id) => DASHBOARD_MODULES.some((m) => m.id === id)),
    ...DEFAULT_DASHBOARD_ORDER.filter((id) => !d.order.includes(id)),
  ];

  const move = (id: string, dir: -1 | 1) => {
    const i = order.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    const next = [...order];
    next[i] = next[j]!;
    next[j] = id;
    patch({ dashboard: { ...d, order: next } });
  };

  const toggle = (id: string, visible: boolean) =>
    patch({ dashboard: { ...d, hidden: visible ? d.hidden.filter((x) => x !== id) : [...d.hidden, id] } });

  return (
    <>
      <SectionCard title="Customize Dashboard" subtitle="Reorder modules and hide what you don't need">
        {order.map((id, i) => {
          const m = DASHBOARD_MODULES.find((x) => x.id === id)!;
          const visible = !d.hidden.includes(id);
          return (
            <div key={id} className="flex items-center gap-2 border-b border-border py-3 last:border-0">
              <div className="flex flex-col gap-1">
                <button aria-label={`Move ${m.label} up`} disabled={i === 0} onClick={() => move(id, -1)}
                  className="press grid size-7 place-items-center rounded-lg bg-muted disabled:opacity-40">
                  <ArrowUp className="size-4" />
                </button>
                <button aria-label={`Move ${m.label} down`} disabled={i === order.length - 1} onClick={() => move(id, 1)}
                  className="press grid size-7 place-items-center rounded-lg bg-muted disabled:opacity-40">
                  <ArrowDown className="size-4" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-medium">{m.label}</p>
                <p className="truncate text-[12.5px] text-muted-foreground">{m.description}</p>
              </div>
              <Toggle checked={visible} onChange={(v) => toggle(id, v)} />
            </div>
          );
        })}
        <div className="mt-3">
          <Button variant="outline" onClick={() => {
            patch({ dashboard: { order: DEFAULT_DASHBOARD_ORDER, hidden: [] } });
            toast.show("Dashboard layout reset");
          }}>
            Reset to default layout
          </Button>
        </div>
      </SectionCard>
      <p className="px-1 text-[12.5px] text-muted-foreground">
        Your layout is saved on this device and applies to the Home screen immediately.
      </p>
      {toast.node}
    </>
  );
}
