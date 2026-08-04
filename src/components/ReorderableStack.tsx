import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { cx } from "./kit";

const HOLD_MS = 800;
const MOVE_CANCEL_PX = 10;
const EDGE_PX = 90;
const FALLBACK_MS = 5000;

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
  const activePointer = useRef<{ id: number; el: HTMLElement } | null>(null);
  const fallbackTimer = useRef<number | null>(null);

  const [pressIndex, setPressIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [fallbackId, setFallbackId] = useState<string | null>(null);

  const clearHold = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setPressIndex(null);
  };

  const stopAutoScroll = () => {
    if (autoScroll.current) window.clearInterval(autoScroll.current);
    autoScroll.current = null;
  };

  const releasePointer = () => {
    const p = activePointer.current;
    if (p) {
      try {
        if (p.el.hasPointerCapture?.(p.id)) p.el.releasePointerCapture(p.id);
      } catch {
        /* capture already gone */
      }
    }
    activePointer.current = null;
  };

  const armFallback = useCallback((id: string) => {
    setFallbackId(id);
    if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current);
    fallbackTimer.current = window.setTimeout(() => setFallbackId(null), FALLBACK_MS);
  }, []);

  const endDrag = useCallback(
    (commit: boolean) => {
      clearHold();
      stopAutoScroll();
      releasePointer();
      if (dragIndex !== null) {
        const draggedId = items[dragIndex]?.id;
        if (commit && targetIndex !== null && targetIndex !== dragIndex) {
          const ids = items.map((i) => i.id);
          const [moved] = ids.splice(dragIndex, 1);
          ids.splice(targetIndex, 0, moved!);
          haptic([10, 40, 10]);
          onReorder(ids);
        }
        if (draggedId) armFallback(draggedId);
      }
      setDragIndex(null);
      setTargetIndex(null);
      setOffset(0);
      startPt.current = null;
      geometry.current = null;
      document.body.style.userSelect = "";
    },
    [dragIndex, targetIndex, items, onReorder, armFallback],
  );

  const measure = (index: number) => {
    const nodes = Array.from(containerRef.current?.children ?? []) as HTMLElement[];
    const rects = nodes.map((n) => n.getBoundingClientRect());
    const sy = window.scrollY;
    const tops = rects.map((r) => r.top + sy);
    const heights = rects.map((r) => r.height);
    const gap = rects.length > 1 ? Math.max(0, rects[1]!.top - rects[0]!.bottom) : 12;
    geometry.current = { tops, heights, gap };
    // keep receiving pointer events even if the browser wants to scroll
    const p = activePointer.current;
    if (p) {
      try {
        p.el.setPointerCapture(p.id);
      } catch {
        /* capture unsupported */
      }
    }
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      /* selection API unavailable */
    }
    setPressIndex(null);
    setFallbackId(null);
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

  const offsetRef = useRef(0);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    if (dragIndex === null) return;
    document.body.style.userSelect = "none";

    const applyMove = (pageY: number, clientY: number) => {
      pointerY.current = clientY;
      const delta = pageY - (startPt.current?.y ?? pageY);
      setOffset(delta);
      computeTarget(delta);
    };

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      applyMove(e.pageY, e.clientY);
    };
    // touch fallback + blocks native scrolling mid-gesture
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      applyMove(t.pageY, t.clientY);
    };
    const onUp = () => endDrag(true);
    const onCancel = () => endDrag(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") endDrag(false);
    };

    autoScroll.current = window.setInterval(() => {
      const y = pointerY.current;
      const dy = y < EDGE_PX ? -8 : y > window.innerHeight - EDGE_PX ? 8 : 0;
      if (dy) {
        window.scrollBy(0, dy);
        // keep the card glued to the finger while the page moves
        setOffset((o) => o + dy);
        computeTarget(offsetRef.current + dy);
      }
    }, 16);

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("keydown", onKey);
      stopAutoScroll();
    };
  }, [dragIndex, computeTarget, endDrag]);

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (dragIndex !== null) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (isInteractive(e.target)) return;
    activePointer.current = { id: e.pointerId, el: e.currentTarget as HTMLElement };
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

  const idleRelease = () => {
    clearHold();
    releasePointer();
  };

  const nudge = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((i) => i.id);
    const [moved] = ids.splice(index, 1);
    ids.splice(j, 0, moved!);
    haptic(10);
    onReorder(ids);
    armFallback(items[index]!.id);
  };

  const shiftFor = (i: number) => {
    const g = geometry.current;
    if (!g || dragIndex === null || targetIndex === null || i === dragIndex) return 0;
    const span = g.heights[dragIndex]! + g.gap;
    if (dragIndex < i && i <= targetIndex) return -span;
    if (targetIndex <= i && i < dragIndex) return span;
    return 0;
  };

  const placeholderShift = () => {
    const g = geometry.current;
    if (!g || dragIndex === null || targetIndex === null) return 0;
    if (targetIndex === dragIndex) return 0;
    let d = 0;
    if (targetIndex > dragIndex) {
      for (let j = dragIndex + 1; j <= targetIndex; j++) d += g.heights[j]! + g.gap;
    } else {
      for (let j = targetIndex; j < dragIndex; j++) d -= g.heights[j]! + g.gap;
    }
    return d;
  };

  return (
    <div ref={containerRef} className={cx("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const dragging = dragIndex === i;
        const pressing = pressIndex === i;
        const lockSelection = dragging || pressing;
        const showFallback = dragIndex === null && fallbackId === item.id;
        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onPointerMove={handlePointerMoveIdle}
            onPointerUp={idleRelease}
            onPointerCancel={idleRelease}
            onContextMenu={(e) => (dragIndex !== null || pressing) && e.preventDefault()}
            style={{
              transform: dragging
                ? `translateY(${offset}px) scale(1.015)`
                : `translateY(${shiftFor(i)}px) scale(${pressing ? 0.99 : 1})`,
              transition: dragging ? "none" : "transform 180ms ease, opacity 180ms ease",
              opacity: pressing ? 0.94 : 1,
              zIndex: dragging ? 30 : undefined,
              position: "relative",
              touchAction: dragging ? "none" : undefined,
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
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 rounded-[18px] border-2 border-dashed border-brand/60 bg-brand-soft/30"
                  style={{
                    top: 0,
                    height: "100%",
                    transform: `translateY(${placeholderShift() - offset}px)`,
                    zIndex: -1,
                  }}
                />
                <span className="pointer-events-none absolute right-2 top-2 z-10 grid size-6 place-items-center rounded-full bg-brand text-foreground">
                  <GripVertical className="size-3.5" />
                </span>
              </>
            )}
            {showFallback && (
              <div className="absolute right-2 top-2 z-20 flex gap-1" data-no-drag>
                <button
                  aria-label="Move section up"
                  disabled={i === 0}
                  onClick={() => nudge(i, -1)}
                  className="press grid size-6 place-items-center rounded-full bg-muted/90 shadow-sm disabled:opacity-40"
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  aria-label="Move section down"
                  disabled={i === items.length - 1}
                  onClick={() => nudge(i, 1)}
                  className="press grid size-6 place-items-center rounded-full bg-muted/90 shadow-sm disabled:opacity-40"
                >
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            )}
            {item.node}
          </div>
        );
      })}
    </div>
  );
}
