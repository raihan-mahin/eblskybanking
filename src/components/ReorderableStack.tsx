import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cx } from "./kit";

const HOLD_MS = 2200;
const MOVE_CANCEL_PX = 10;
const EDGE_PX = 90;

type Item = { id: string; node: ReactNode };

const haptic = (pattern: number | number[]) => {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* haptics unsupported */
    }
  }
};

const isInteractive = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el || !el.closest) return false;
  return !!el.closest(
    'button, a, input, select, textarea, label, [role="button"], [role="tab"], [role="switch"], [data-no-drag]',
  );
};

export function ReorderableStack({
  items,
  onReorder,
  className,
}: {
  items: Item[];
  onReorder: (ids: string[]) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<number | null>(null);
  const startPt = useRef<{ x: number; y: number } | null>(null);
  const geometry = useRef<{ tops: number[]; heights: number[]; gap: number } | null>(null);
  const pointerY = useRef(0);
  const autoScroll = useRef<number | null>(null);

  const [pressIndex, setPressIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const clearHold = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setPressIndex(null);
  };

  const stopAutoScroll = () => {
    if (autoScroll.current) window.clearInterval(autoScroll.current);
    autoScroll.current = null;
  };

  const endDrag = useCallback(
    (commit: boolean) => {
      clearHold();
      stopAutoScroll();
      if (commit && dragIndex !== null && targetIndex !== null && targetIndex !== dragIndex) {
        const ids = items.map((i) => i.id);
        const [moved] = ids.splice(dragIndex, 1);
        ids.splice(targetIndex, 0, moved!);
        haptic([10, 40, 10]);
        onReorder(ids);
      }
      setDragIndex(null);
      setTargetIndex(null);
      setOffset(0);
      startPt.current = null;
      geometry.current = null;
      document.body.style.userSelect = "";
    },
    [dragIndex, targetIndex, items, onReorder],
  );

  const measure = (index: number) => {
    const nodes = Array.from(containerRef.current?.children ?? []) as HTMLElement[];
    const rects = nodes.map((n) => n.getBoundingClientRect());
    const sy = window.scrollY;
    const tops = rects.map((r) => r.top + sy);
    const heights = rects.map((r) => r.height);
    const gap = rects.length > 1 ? Math.max(0, rects[1]!.top - rects[0]!.bottom) : 12;
    geometry.current = { tops, heights, gap };
    // clear any accidental text selection created by the long press
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      /* selection API unavailable */
    }
    setPressIndex(null);
    haptic(15);
    setDragIndex(index);
    setTargetIndex(index);
    setOffset(0);
  };

  const computeTarget = useCallback(
    (delta: number) => {
      const g = geometry.current;
      if (!g || dragIndex === null) return;
      const center = g.tops[dragIndex]! + delta + g.heights[dragIndex]! / 2;
      let ti = dragIndex;
      for (let j = 0; j < dragIndex; j++) {
        if (center < g.tops[j]! + g.heights[j]! / 2) {
          ti = j;
          break;
        }
      }
      if (ti === dragIndex) {
        for (let j = g.tops.length - 1; j > dragIndex; j--) {
          if (center > g.tops[j]! + g.heights[j]! / 2) {
            ti = j;
            break;
          }
        }
      }
      setTargetIndex(ti);
    },
    [dragIndex],
  );

  useEffect(() => {
    if (dragIndex === null) return;
    document.body.style.userSelect = "none";

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      pointerY.current = e.clientY;
      const delta = e.pageY - (startPt.current?.y ?? e.pageY);
      setOffset(delta);
      computeTarget(delta);
    };
    const onUp = () => endDrag(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") endDrag(false);
    };

    autoScroll.current = window.setInterval(() => {
      const y = pointerY.current;
      const dy = y < EDGE_PX ? -8 : y > window.innerHeight - EDGE_PX ? 8 : 0;
      if (dy) window.scrollBy(0, dy);
    }, 16);

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", () => endDrag(false));
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      stopAutoScroll();
    };
  }, [dragIndex, computeTarget, endDrag]);

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (dragIndex !== null) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (isInteractive(e.target)) return;
    startPt.current = { x: e.pageX, y: e.pageY };
    pointerY.current = e.clientY;
    clearHold();
    setPressIndex(index);
    holdTimer.current = window.setTimeout(() => measure(index), HOLD_MS);
  };

  useEffect(() => {
    const cancelOnScroll = () => {
      if (dragIndex === null) clearHold();
    };
    window.addEventListener("scroll", cancelOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", cancelOnScroll);
  }, [dragIndex]);

  const handlePointerMoveIdle = (e: React.PointerEvent) => {
    if (dragIndex !== null || !startPt.current || !holdTimer.current) return;
    const dx = Math.abs(e.pageX - startPt.current.x);
    const dy = Math.abs(e.pageY - startPt.current.y);
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearHold();
  };

  const shiftFor = (i: number) => {
    const g = geometry.current;
    if (!g || dragIndex === null || targetIndex === null || i === dragIndex) return 0;
    const span = g.heights[dragIndex]! + g.gap;
    if (dragIndex < i && i <= targetIndex) return -span;
    if (targetIndex <= i && i < dragIndex) return span;
    return 0;
  };

  return (
    <div ref={containerRef} className={cx("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const dragging = dragIndex === i;
        const pressing = pressIndex === i;
        const lockSelection = dragging || pressing;
        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={handlePointerMoveIdle}
            onPointerUp={clearHold}
            onPointerCancel={clearHold}
            onContextMenu={(e) => dragIndex !== null && e.preventDefault()}
            style={{
              transform: dragging
                ? `translateY(${offset}px) scale(1.015)`
                : `translateY(${shiftFor(i)}px)`,
              transition: dragging ? "none" : "transform 180ms ease",
              zIndex: dragging ? 30 : undefined,
              position: "relative",
              touchAction: dragIndex !== null ? "none" : undefined,
              userSelect: lockSelection ? "none" : undefined,
              WebkitUserSelect: lockSelection ? "none" : undefined,
              WebkitTouchCallout: lockSelection ? "none" : undefined,
            }}
            onSelect={(e: React.SyntheticEvent) => {
              if (lockSelection) e.preventDefault();
            }}
            className={cx(dragging && "rounded-[18px] shadow-xl ring-2 ring-brand")}
          >
            {dragging && (
              <span className="pointer-events-none absolute right-2 top-2 z-10 grid size-6 place-items-center rounded-full bg-brand text-foreground">
                <GripVertical className="size-3.5" />
              </span>
            )}
            {item.node}
          </div>
        );
      })}
    </div>
  );
}
