import { Link, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Bell, ChevronLeft, Home, Landmark, QrCode, Compass, Mic, X, ArrowLeftRight, Headphones, Search } from "lucide-react";
import profilePhoto from "@/assets/profile.png.asset.json";
import { useApp } from "@/lib/store";
import { cx, Sheet, ListRow, SearchField, Button } from "./kit";
import { VoiceAssistant } from "./VoiceAssistant";
import { BirthdayNotice } from "./BirthdayNotice";
import { searchServices, SERVICES, categoryTitle } from "@/lib/services";


const TABS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/pay-transfer", label: "Pay & Transfer", icon: ArrowLeftRight },
  { to: "/my-banking", label: "My Banking", icon: Landmark },
  { to: "/qr", label: "QR", icon: QrCode },
  { to: "/explore", label: "Explore", icon: Compass },
] as const;


export function AppHeader({ title, back }: { title?: string; back?: boolean }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const router = useRouter();
  const goBack = () => {
    if (router.history.canGoBack()) router.history.back();
    else nav({ to: "/home" });
  };
  const [menu, setMenu] = useState(false);
  const [notif, setNotif] = useState(false);
  const [search, setSearch] = useState(false);

  const unread = state.notifications.filter((n) => !n.read).length;

  const go = (id: string) => { setMenu(false); nav({ to: "/service/$serviceId", params: { serviceId: id } }); };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand px-[18px] pt-[calc(env(safe-area-inset-top)+0.4rem)] pb-3 shadow-sm">
        <div className="flex items-center gap-2">
          {back ? (
            <button aria-label="Go back" onClick={goBack} className="press grid size-10 place-items-center rounded-full">
              <ChevronLeft className="size-6" />
            </button>
          ) : title ? null : (
            <button onClick={() => setMenu(true)} aria-label="Open profile menu" className="press my-0.5 size-12 overflow-hidden rounded-full bg-foreground ring-2 ring-white/70">
              <img src={profilePhoto.url} alt={state.user.name} className="size-full object-cover object-top" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            {title ? (
              <h1 className="truncate text-[19px] font-semibold">{title}</h1>
            ) : (
              <>
                <p className="text-[13px] leading-tight">{state.user.greeting}</p>
                <p className="text-[17px] leading-tight font-semibold whitespace-nowrap">{state.user.name}</p>
              </>
            )}
          </div>
          <button aria-label="Search services" onClick={() => setSearch(true)} className="press grid size-10 place-items-center">
            <Search className="size-6" />
          </button>
          <button
            aria-label="AI Help"
            onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "ai-support" } })}
            className="press grid size-10 place-items-center"
          >
            <Headphones className="size-6" />
          </button>

          <button onClick={() => setNotif(true)} className="press relative grid size-10 place-items-center">
            <Bell className="size-6" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-accent" />}
          </button>
        </div>
      </header>

      <Sheet open={menu} onClose={() => setMenu(false)} title={state.user.name}>
        <p className="-mt-2 mb-2 text-[13px] text-muted-foreground">{state.user.mobile}</p>
        {[
          ["profile", "Profile", "IdCard"], ["accounts", "Accounts", "Landmark"], ["rewards", "Rewards", "Award"],
          ["personalization", "Personalization", "Star"], ["customize-dashboard", "Customize Dashboard", "ListChecks"],
          ["disputes", "Transaction Disputes", "ShieldCheck"],
          ["security-settings", "Security", "ShieldCheck"],
          ["accessibility", "Accessibility", "Accessibility"], ["notifications", "Notifications", "Bell"],
          ["help-support", "Help and Support", "LifeBuoy"],
        ].map(([id, label, icon]) => (
          <ListRow key={id} icon={icon} title={label!} onClick={() => go(id!)} />
        ))}
        <ListRow icon="Settings" title="Settings & Reset Demo Data" onClick={() => { setMenu(false); nav({ to: "/settings" }); }} />
        <ListRow icon="LogIn" title="Logout" onClick={() => { patch({ loggedIn: false, demoMode: false }); nav({ to: "/login" }); }} />
      </Sheet>

      <Sheet open={notif} onClose={() => setNotif(false)} title="Notifications">
        <div className="mb-2 flex justify-end">
          <button className="press text-[13px] text-primary"
            onClick={() => patch({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })}>
            Mark all read
          </button>
        </div>
        <div className="mb-2"><BirthdayNotice compact /></div>
        {state.notifications.map((n) => (
          <div key={n.id} className={cx("border-b border-border py-3 last:border-0", !n.read && "bg-tint-yellow/40")}>
            <p className="text-[14.5px] font-medium">{n.title}</p>
            <p className="text-[13px] text-muted-foreground">{n.body}</p>
            <p className="mt-0.5 text-[11.5px] text-muted-foreground">{n.date}</p>
          </div>
        ))}
      </Sheet>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}

const SEARCH_KEY = "ebl-recent-searches";

const EXTRA_TARGETS = [
  { id: "settings", title: "Settings", description: "App preferences and demo data reset", icon: "Settings", route: "/settings" as const },
  { id: "explore", title: "Explore Services", description: "Full service catalogue", icon: "Compass", route: "/explore" as const },
  { id: "pay", title: "Pay & Transfer", description: "Transfers, bills and recharge", icon: "ArrowLeftRight", route: "/pay-transfer" as const },
  { id: "my-banking", title: "My Banking", description: "Accounts, cards and goals", icon: "Landmark", route: "/my-banking" as const },
];

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    try {
      setRecent(JSON.parse(localStorage.getItem(SEARCH_KEY) ?? "[]"));
    } catch { setRecent([]); }
  }, [open]);

  const remember = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem(SEARCH_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const services = q ? searchServices(q) : [];
  const extras = q
    ? EXTRA_TARGETS.filter((e) => (e.title + " " + e.description).toLowerCase().includes(q.toLowerCase()))
    : [];
  const suggestions = SERVICES.filter((s) =>
    ["fund-transfer", "recharge", "bill-payment", "savings-goals", "rewards", "transaction-history"].includes(s.id),
  );

  const openService = (id: string) => { remember(q); onClose(); nav({ to: "/service/$serviceId", params: { serviceId: id } }); };

  return (
    <FullSheet open={open} onClose={onClose} title="Search">
      <SearchField value={q} onChange={setQ} placeholder="Search services, goals, settings" />

      {!q && recent.length > 0 && (
        <div className="app-card">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14.5px] font-semibold text-primary">Recent searches</p>
            <button className="press text-[12.5px] text-muted-foreground"
              onClick={() => { setRecent([]); try { localStorage.removeItem(SEARCH_KEY); } catch { /* ignore */ } }}>
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button key={r} onClick={() => setQ(r)} className="press rounded-full bg-muted px-3 py-1.5 text-[12.5px]">{r}</button>
            ))}
          </div>
        </div>
      )}

      {!q && (
        <div className="app-card">
          <p className="mb-1 text-[14.5px] font-semibold text-primary">Suggested</p>
          {suggestions.map((s) => (
            <ListRow key={s.id} icon={s.icon} tint={s.tint} title={s.title} subtitle={s.description} onClick={() => openService(s.id)} />
          ))}
        </div>
      )}

      {q && (
        <div className="app-card">
          <p className="mb-1 text-[14.5px] font-semibold text-primary">{services.length + extras.length} results</p>
          {extras.map((e) => (
            <ListRow key={e.id} icon={e.icon} tint="yellow" title={e.title} subtitle={e.description}
              onClick={() => { remember(q); onClose(); nav({ to: e.route }); }} />
          ))}
          {services.slice(0, 20).map((s) => (
            <ListRow key={s.id} icon={s.icon} tint={s.tint} title={s.title} subtitle={categoryTitle(s.category)} onClick={() => openService(s.id)} />
          ))}
          {services.length === 0 && extras.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-[13.5px] text-muted-foreground">No matches for “{q}”.</p>
              <div className="mt-3"><Button variant="outline" onClick={() => setQ("")}>Clear search</Button></div>
            </div>
          )}
        </div>
      )}
    </FullSheet>
  );
}


export function BottomNavigation() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = path === t.to;
          return (
            <Link key={t.to} to={t.to} className="press flex flex-col items-center gap-1 px-0.5 pt-2.5 pb-2">
              <t.icon className={cx("size-[22px]", active ? "text-foreground" : "text-muted-foreground")} strokeWidth={active ? 2 : 1.6} />
              <span className={cx("text-center text-[10.5px] leading-tight", active ? "font-medium text-foreground" : "text-muted-foreground")}>{t.label}</span>

              <span className={cx("h-[3px] w-7 rounded-full", active ? "bg-brand" : "bg-transparent")} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppShell({
  children, title, back, hideNav,
}: { children: ReactNode; title?: string; back?: boolean; hideNav?: boolean }) {
  const { state } = useApp();
  const a = state.accessibility;
  return (
    <div
      className={cx(
        "relative mx-auto min-h-screen w-full max-w-[430px] bg-background",
        a.textSize === "large" && "a11y-large",
        a.textSize === "xlarge" && "a11y-xlarge",
        a.contrast && "a11y-contrast",
        a.reduceMotion && "a11y-reduce",
      )}
    >
      <AppHeader title={title} back={back} />
      <main className="relative -mt-1 space-y-2.5 rounded-t-3xl bg-background px-[18px] pt-4 pb-28">{children}</main>
      <VoiceAssistant />

      {!hideNav && <BottomNavigation />}
    </div>
  );
}

export function FullSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 mx-auto max-w-[430px] overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-brand px-[18px] py-4">
        <button onClick={onClose} className="press grid size-9 place-items-center rounded-full"><ChevronLeft className="size-6" /></button>
        <h2 className="flex-1 text-center text-[17px] font-semibold">{title}</h2>
        <button onClick={onClose} className="press grid size-9 place-items-center rounded-full"><X className="size-5" /></button>
      </div>
      <div className="space-y-3 p-[18px] pb-24">{children}</div>
    </div>
  );
}

export { Mic };
