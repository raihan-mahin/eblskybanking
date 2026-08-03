import { useNavigate } from "@tanstack/react-router";
import { Headphones } from "lucide-react";

export function SupportFab() {
  const nav = useNavigate();
  return (
    <button
      aria-label="Open AI Support"
      onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "ai-support" } })}
      className="press fixed bottom-24 left-1/2 z-40 ml-[92px] grid size-12 -translate-x-1/2 place-items-center rounded-full bg-primary text-white shadow-lg"
    >
      <Headphones className="size-5" strokeWidth={1.8} />
    </button>
  );
}
