import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ListRow, Toggle, Button, useToast } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EBL Sky Banking" },
      { name: "description", content: "Manage security, accessibility, notifications and reset the demo data." },
      { property: "og:title", content: "Settings — EBL Sky Banking" },
      { property: "og:description", content: "Manage security, accessibility, notifications and reset the demo data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { state, patch, reset } = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  return (
    <AppShell title="Settings" back>
      <SectionCard title="Account">
        <ListRow icon="IdCard" tint="gray" title="Profile" subtitle={state.user.mobile} onClick={() => go("profile")} />
        <ListRow icon="Landmark" tint="yellow" title="Accounts" onClick={() => go("accounts")} />
        <ListRow icon="Star" tint="purple" title="Personalization" onClick={() => go("personalization")} />
      </SectionCard>

      <SectionCard title="Security">
        <ListRow icon="ShieldCheck" tint="blue" title="Security settings" onClick={() => go("security-settings")} />
        <ListRow icon="MonitorSmartphone" tint="gray" title="Trusted devices" onClick={() => go("trusted-devices")} />
        <ListRow icon="LogIn" tint="gray" title="Login history" onClick={() => go("login-history")} />
        <ListRow
          icon="Bell"
          tint="yellow"
          title="Security alerts"
          right={<Toggle checked={state.security.alerts} onChange={(v) => patch({ security: { ...state.security, alerts: v } })} />}
        />
      </SectionCard>

      <SectionCard title="App">
        <ListRow icon="Accessibility" tint="green" title="Accessibility" onClick={() => go("accessibility")} />
        <ListRow icon="Bell" tint="blue" title="Notifications" onClick={() => go("notifications")} />
        <ListRow icon="LifeBuoy" tint="pink" title="Help and support" onClick={() => go("help-support")} />
        <ListRow
          icon="Sparkles"
          tint="purple"
          title="Demo mode"
          subtitle="Prefilled sample data"
          right={<Toggle checked={state.demoMode} onChange={(v) => patch({ demoMode: v })} />}
        />
      </SectionCard>

      <SectionCard title="Demo data" subtitle="Restore the prototype to its original state">
        <Button
          variant="outline"
          onClick={() => { reset(); toast.show("Demo data reset"); nav({ to: "/home" }); }}
        >
          Reset demo data
        </Button>
        <div className="h-2" />
        <Button variant="ghost" onClick={() => { patch({ loggedIn: false }); nav({ to: "/login" }); }}>
          Logout
        </Button>
      </SectionCard>
      {toast.node}
    </AppShell>
  );
}
