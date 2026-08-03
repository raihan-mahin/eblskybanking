import { useNavigate } from "@tanstack/react-router";
import { Headphones } from "lucide-react";

export function SupportFab() {
  const nav = useNavigate();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[152px] z-40">
      <div className="pointer-events-none mx-auto flex w-full max-w-[430px] justify-end px-4">
        <button
          aria-label="Open AI Support"
          onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "ai-support" } })}
          className="press pointer-events-auto flex items-center gap-2 rounded-full bg-primary py-3 pr-4 pl-3.5 text-white shadow-lg"
        >
          <Headphones className="size-5" strokeWidth={1.8} />
          <span className="text-[13px] font-medium">AI Support</span>
        </button>
      </div>
    </div>
  );
}
