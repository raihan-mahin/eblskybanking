import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { LoginScreen } from "@/components/LoginScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EBL Sky Banking — Mobile Banking Prototype" },
      { name: "description", content: "Pay bills, transfer funds, save and earn rewards in one mobile banking app." },
      { property: "og:title", content: "EBL Sky Banking — Mobile Banking Prototype" },
      { property: "og:description", content: "Pay bills, transfer funds, save and earn rewards in one mobile banking app." },
    ],
  }),
  component: Index,
});

function Index() {
  const { state } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (state.loggedIn) nav({ to: "/home" });
  }, [state.loggedIn, nav]);

  return <LoginScreen />;
}
