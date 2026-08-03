import { useNavigate } from "@tanstack/react-router";
import { Headphones } from "lucide-react";

export function SupportFab() {
  const nav = useNavigate();
  return (
    <button
      aria-label="Open AI Support"
      onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "ai-support" } })}
      className="press absolute top-[68px] right-4 z-30 grid size-12 place-items-center rounded-full bg-primary text-white shadow-lg"
    >
      <Headphones className="size-6" strokeWidth={1.8} />
      <span className="absolute -bottom-4 text-[10px] font-medium text-primary">AI</span>
    </button>
  );
}
