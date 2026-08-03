import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/LoginScreen";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — EBL Sky Banking" },
      { name: "description", content: "Sign in to EBL Sky Banking with fingerprint, Face ID or PIN." },
      { property: "og:title", content: "Login — EBL Sky Banking" },
      { property: "og:description", content: "Sign in to EBL Sky Banking with fingerprint, Face ID or PIN." },
    ],
  }),
  component: LoginScreen,
});
