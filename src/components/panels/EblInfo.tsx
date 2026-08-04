import { SectionCard, Button, useToast } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { cx } from "@/components/kit";
import { TINT_BG, byId } from "@/lib/services";
import { eblInfoById } from "@/lib/extras";

export function EblInfoPanel({ serviceId }: { serviceId: string }) {
  const svc = byId(serviceId);
  const info = eblInfoById(serviceId);
  const toast = useToast();
  if (!svc || !info) return null;

  return (
    <>
      <SectionCard>
        <div className="flex items-center gap-3">
          <span className={cx("grid size-12 shrink-0 place-items-center rounded-full", TINT_BG[svc.tint])}>
            <Icon name={svc.icon} className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-primary">{svc.title}</p>
            <p className="text-[12.5px] text-muted-foreground">{svc.description}</p>
          </div>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-foreground">{info.description}</p>
        <p className="mt-2 text-[13.5px] font-medium text-primary">{info.benefit}</p>
      </SectionCard>

      <SectionCard title="What to know">
        <ul className="space-y-2">
          {info.points.map((p) => (
            <li key={p} className="flex gap-2 text-[13.5px] text-foreground">
              <Icon name="ChevronRight" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-muted-foreground">
          Prototype information only. Rates, fees and terms shown in the app are not live banking information.
        </p>
      </SectionCard>

      <SectionCard>
        <Button onClick={() => toast.show(info.document ? "Demo document — details are not available in this prototype" : "Learn more — demo content only")}>
          {info.document ? "View Details" : "Learn More"}
        </Button>
        <div className="h-2" />
        <Button variant="outline" onClick={() => toast.show("Demo: EBL helpline 16230")}>
          Contact EBL
        </Button>
      </SectionCard>
      {toast.node}
    </>
  );
}
