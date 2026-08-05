import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, ProgressBar, CircularProgress, MiniBarChart, MiniLineChart, DonutChart, StatusBadge, FormField, TextInput, Select, Sheet, Toggle, InsightCard, useToast, cx } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { Icon } from "@/components/Icon";
import { useApp, money, levelFor, nextLevel } from "@/lib/store";
import type { Goal } from "@/lib/types";
import starCineplexLogo from "@/assets/star-cineplex.png.asset.json";
import gentleParkLogo from "@/assets/gentle-park.png.asset.json";

/* ---------------- Rewards ---------------- */

interface RewardOption { id: string; title: string; cost: number; value: string; icon: string; expiry: string; demo?: boolean; logo?: string; logoFill?: boolean }

const FEATURED_REWARDS: RewardOption[] = [
  { id: "rw-cineplex", title: "10% off at Star Cineplex", cost: 500, value: "10% off", icon: "Tv", expiry: "31 Dec 2026", demo: true, logo: starCineplexLogo.url, logoFill: true },
  { id: "rw-gentlepark", title: "10% off at Gentle Park", cost: 700, value: "10% off", icon: "ShoppingBag", expiry: "30 Nov 2026", demo: true, logo: gentleParkLogo.url },
  { id: "rw-dining", title: "15% off selected dining", cost: 600, value: "15% off", icon: "Gift", expiry: "31 Oct 2026", demo: true },
];

export function RewardsPanel() {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const nav = useNavigate();
  const [confirm, setConfirm] = useState<RewardOption | null>(null);
  const [sheet, setSheet] = useState<null | "missions" | "rewards" | "history" | "vouchers">(null);
  const pts = state.rewards.points;
  const lvl = levelFor(pts);
  const nx = nextLevel(pts);
  const pct = nx.ceil > nx.floor ? ((pts - nx.floor) / (nx.ceil - nx.floor)) * 100 : 100;

  const allRewards: RewardOption[] = [
    ...FEATURED_REWARDS,
    ...state.rewards.offers.map((o) => ({ id: o.id, title: o.title, cost: o.cost, value: o.value, icon: "BadgePercent", expiry: "31 Dec 2026", demo: true })),
  ];

  const redeem = (o: RewardOption) => {
    if (o.cost > pts) return toast.show("Not enough points for this reward");
    patch({
      rewards: {
        ...state.rewards,
        points: pts - o.cost,
        history: [{ id: "H" + Date.now(), title: `Redeemed ${o.title}`, points: -o.cost, date: "Today" }, ...state.rewards.history],
      },
      giftCards: [
        { id: "V" + Date.now(), brand: o.title, value: o.cost, code: "EBL-" + Math.random().toString(36).slice(2, 8).toUpperCase(), date: "Today" },
        ...state.giftCards,
      ],
    });
    notify("Reward redeemed", `${o.title} — ${o.cost} points used.`, "reward");
    toast.show(`${o.title} added to My Vouchers`);
  };

  const MissionRow = ({ m }: { m: { id: string; title: string; progress: number; goal: number; points: number } }) => (
    <div className="border-b border-border py-2.5 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-medium">{m.title}</p>
        <span className="shrink-0 text-[12.5px] text-accent">+{m.points} pts</span>
      </div>
      <div className="mt-1.5"><ProgressBar value={(m.progress / m.goal) * 100} /></div>
      <p className="mt-1 text-[12px] text-muted-foreground">{m.progress} of {m.goal}</p>
    </div>
  );

  const RewardRow = ({ o }: { o: RewardOption }) => (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-brand/20">
        {o.logo ? (
          <img src={o.logo} alt="" className={cx("object-contain", o.logoFill ? "size-full" : "size-[26px]")} />
        ) : (
          <Icon name={o.icon} className="size-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium">{o.title}</p>
        <p className="text-[12px] text-muted-foreground">{o.cost} points · expires {o.expiry}</p>
        {o.demo && <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10.5px] text-muted-foreground">Demo Offer</span>}
      </div>
      <div className="w-[84px] shrink-0">
        <Button className="!py-1.5 !text-[13px]" variant={o.cost > pts ? "outline" : "primary"} disabled={o.cost > pts}
          onClick={() => setConfirm(o)}>Redeem</Button>
      </div>
    </div>
  );

  const HistoryRow = ({ h }: { h: { id: string; title: string; points: number; date: string } }) => (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <div>
        <p className="text-[14px]">{h.title}</p>
        <p className="text-[12px] text-muted-foreground">{h.date}</p>
      </div>
      <span className={cx("text-[13.5px] font-medium", h.points < 0 ? "text-error" : "text-success")}>
        {h.points > 0 ? "+" : ""}{h.points}
      </span>
    </div>
  );

  return (
    <>
      <SectionCard className="!py-3.5">
        <div className="flex items-center gap-4">
          <CircularProgress size={112} value={pct} label={pts.toLocaleString()} sub="points" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="grid size-5 place-items-center rounded-full bg-brand">
                <Icon name="Crown" className="size-3 text-[#123B82]" />
              </span>
              <span className="text-[15px] font-semibold text-[#B8860B]">{lvl} Level</span>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              {nx.need > 0 ? `${nx.need.toLocaleString()} points to ${nx.name}` : "Top level reached"}
            </p>
            <button onClick={() => setSheet("vouchers")} className="press mt-2.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-primary">
              My Vouchers
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Monthly points" className="!py-3.5">
        <MiniBarChart data={[120, 210, 180, 260, 190, state.rewards.monthPoints || 240]} labels={["Dec", "Jan", "Feb", "Mar", "Apr", "May"]} />
        <p className="mt-2 text-[12.5px] text-muted-foreground">You earned {(state.rewards.monthPoints || 1250).toLocaleString()} points this month.</p>
      </SectionCard>

      <SectionCard title="Bonus missions" action="See More Missions" onAction={() => setSheet("missions")} className="!py-3.5">
        {state.rewards.missions.slice(0, 3).map((m) => <MissionRow key={m.id} m={m} />)}
      </SectionCard>

      <SectionCard title="Redeem points" action="See More Rewards" onAction={() => setSheet("rewards")} className="!py-3.5">
        {FEATURED_REWARDS.map((o) => <RewardRow key={o.id} o={o} />)}
      </SectionCard>

      <SectionCard title="Recent Reward History" action="See Full History" onAction={() => setSheet("history")} className="!py-3.5">
        {state.rewards.history.slice(0, 2).map((h) => <HistoryRow key={h.id} h={h} />)}
      </SectionCard>

      <Sheet open={!!confirm} onClose={() => setConfirm(null)} title="Confirm redemption">
        {confirm && (
          <>
            <div className="space-y-2 rounded-2xl bg-muted p-3.5">
              {[["Reward", confirm.title], ["Points required", confirm.cost.toLocaleString()], ["Current points", pts.toLocaleString()], ["Remaining after redemption", Math.max(0, pts - confirm.cost).toLocaleString()]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between gap-3 text-[13.5px]">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2.5">
              <Button variant="outline" className="flex-1" onClick={() => setConfirm(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { redeem(confirm); setConfirm(null); }}>Confirm</Button>
            </div>
          </>
        )}
      </Sheet>

      <Sheet open={sheet === "missions"} onClose={() => setSheet(null)} title="All missions">
        {state.rewards.missions.map((m) => <MissionRow key={m.id} m={m} />)}
      </Sheet>

      <Sheet open={sheet === "rewards"} onClose={() => setSheet(null)} title="All rewards">
        {allRewards.map((o) => <RewardRow key={o.id} o={o} />)}
      </Sheet>

      <Sheet open={sheet === "history"} onClose={() => setSheet(null)} title="Reward history">
        {state.rewards.history.map((h) => <HistoryRow key={h.id} h={h} />)}
      </Sheet>

      <Sheet open={sheet === "vouchers"} onClose={() => setSheet(null)} title="My Vouchers">
        {state.giftCards.length === 0
          ? <p className="py-4 text-[13.5px] text-muted-foreground">No vouchers yet. Redeem points to collect vouchers.</p>
          : state.giftCards.map((v) => (
            <div key={v.id} className="border-b border-border py-2.5 last:border-0">
              <p className="text-[14px] font-medium">{v.brand}</p>
              <p className="text-[12px] text-muted-foreground">Code {v.code} · {v.date}</p>
            </div>
          ))}
      </Sheet>

      {toast.node}
    </>
  );
}


/* ---------------- AI Money Manager ---------------- */

export function MoneyManagerPanel() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const income = 70000;
  const expenses = state.transactions.filter((t) => t.direction === "debit" && t.status === "success").reduce((a, b) => a + b.amount, 0);
  const net = income - expenses;

  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {[["Income", money(income), "text-success"], ["Expenses", money(expenses), "text-error"], ["Net Savings", money(net), "text-primary"]].map(([l, v, c]) => (
          <div key={l} className="app-card p-3 text-center">
            <p className="text-[11.5px] text-muted-foreground">{l}</p>
            <p className={cx("text-[15px] font-semibold", c)}>{v}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Spending by category">
        <DonutChart data={[
          { label: "Bills", value: 4660, color: "#FFC400" },
          { label: "Education", value: 12500, color: "#123B82" },
          { label: "Food", value: 5400, color: "#FF5A00" },
          { label: "Shopping", value: 2350, color: "#279B48" },
          { label: "Savings", value: 2500, color: "#8B7BD8" },
        ]} />
      </SectionCard>

      <SectionCard title="Weekly spending">
        <MiniBarChart data={[1200, 800, 2400, 600, 1840, 3000, 950]} labels={["S", "M", "T", "W", "T", "F", "S"]} />
      </SectionCard>

      <SectionCard title="Savings trend">
        <MiniLineChart data={[8000, 12000, 9500, 15000, 18000, 22000]} />
        <p className="text-[12.5px] text-muted-foreground">Savings rate 18% · up 4% from last month</p>
      </SectionCard>

      <SectionCard title="Budget progress">
        {[["Food", 5400, 8000], ["Transport", 1800, 3000], ["Entertainment", 1500, 2000]].map(([l, s, t]) => (
          <div key={l as string} className="py-2.5">
            <div className="flex justify-between text-[13.5px]">
              <span>{l as string}</span><span className="text-muted-foreground">{money(s as number)} / {money(t as number)}</span>
            </div>
            <ProgressBar className="mt-1.5" value={((s as number) / (t as number)) * 100} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Upcoming payments">
        {state.schedules.filter((s) => s.active).map((s) => (
          <ListRow key={s.id} icon="CalendarDays" tint="blue" title={s.name} subtitle={`${s.start} · ${money(s.amount)}`} onClick={() => go("scheduled-transfer")} />
        ))}
      </SectionCard>

      <SectionCard title="Insights for you">
        <div className="space-y-2">
          {state.insights.slice(0, 6).map((i) => (
            <InsightCard key={i.id} text={i.text} action={i.action} tone={i.tone}
              onAction={() => go(i.target)}
              onDismiss={() => patch({ insights: state.insights.filter((x) => x.id !== i.id) })} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}

/* ---------------- AI Financial Advisor ---------------- */

const ADVISOR_Q = [
  "Can I afford a new phone?",
  "How much should I save this month?",
  "Where did I spend the most?",
  "Will I have enough for tuition?",
  "How can I reach my Nepal Trip goal faster?",
  "What bills are due soon?",
];

export function AdvisorPanel() {
  const { state } = useApp();
  const nav = useNavigate();
  const [log, setLog] = useState<{ role: "user" | "bot"; text: string; action?: string; target?: string }[]>([
    { role: "bot", text: `Hello Mahin! Ask me anything about your money. Your balance is ${money(state.accounts[0].balance)}.` },
  ]);
  const [input, setInput] = useState("");

  const answer = (q: string) => {
    const lower = q.toLowerCase();
    const goal = state.goals[0];
    let a = { text: "I can help with savings, spending, bills and goals. Try one of the suggestions below.", action: "Open AI Support", target: "ai-support" };
    if (lower.includes("phone")) a = { text: `A ৳90,000 phone would use most of your ৳${state.accounts[0].balance.toLocaleString()} balance. Saving ৳6,000/month reaches it in 11 months without touching your emergency fund.`, action: "Create Goal", target: "goal-setting" };
    else if (lower.includes("save this month") || lower.includes("how much should i save")) a = { text: "Based on ৳70,000 income and ৳57,000 average spending, aim to save ৳13,000 this month — about 18% of income.", action: "Set Budget", target: "budget" };
    else if (lower.includes("spend the most")) a = { text: "Education was your largest category at ৳12,500, followed by food at ৳5,400.", action: "View Insights", target: "ai-money-manager" };
    else if (lower.includes("tuition")) a = { text: "Your next tuition instalment is ৳12,500. Your balance covers it, and scheduling it avoids a late fee.", action: "Enable Auto Pay", target: "auto-pay" };
    else if (lower.includes("nepal")) a = { text: `Nepal Trip is at ${money(goal.saved)} of ${money(goal.target)}. Adding ৳2,500/month on top of your ৳5,000 finishes 3 months earlier.`, action: "Open Goals", target: "goal-setting" };
    else if (lower.includes("bill")) a = { text: "2 bills are due this week: Link3 internet ৳1,200 and DESCO electricity ৳1,840.", action: "Pay Bills", target: "bill-payment" };
    setLog((l) => [...l, { role: "user", text: q }, { role: "bot", ...a }]);
    setInput("");
  };

  return (
    <>
      <SectionCard title="AI Financial Advisor" subtitle="Answers built from your local data">
        <div className="space-y-2.5">
          {log.map((m, i) => (
            <div key={i} className={cx("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px]",
              m.role === "user" ? "ml-auto bg-brand-soft" : "bg-muted")}>
              {m.text}
              {m.action && (
                <button onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: m.target! } })}
                  className="press mt-2 block rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">{m.action}</button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <TextInput value={input} placeholder="Ask a question" onChange={(e) => setInput(e.target.value)} />
          <Button className="w-20" onClick={() => input && answer(input)}>Ask</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADVISOR_Q.map((q) => (
            <button key={q} onClick={() => answer(q)} className="press rounded-full border border-border px-3 py-1.5 text-[12.5px]">{q}</button>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

/* ---------------- Goals ---------------- */

export function GoalsPanel() {
  const { state, patch, commitTxn } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [add, setAdd] = useState<Goal | null>(null);
  const [mode, setMode] = useState<"add" | "withdraw">("add");
  const [amount, setAmount] = useState("");
  const [auth, setAuth] = useState(false);
  const [form, setForm] = useState({ title: "", icon: "Target", target: "", saved: "", date: "", monthly: "", auto: false });

  const savings = state.accounts[0];
  const goalTotal = state.goals.reduce((a, g) => a + g.saved, 0);

  const create = () => {
    if (!form.title || !form.target) return toast.show("Enter a title and target amount");
    patch({
      goals: [{
        id: "g" + Date.now(), title: form.title, icon: form.icon, target: Number(form.target),
        saved: Number(form.saved || 0), monthly: Number(form.monthly || 0), date: form.date || "Dec 2025", auto: form.auto,
      }, ...state.goals],
    });
    setOpen(false); toast.show("Goal created");
  };

  const contribute = () => {
    if (!add) return;
    const amt = Number(amount || 0);
    if (mode === "add") {
      if (amt > (savings?.balance ?? 0)) {
        setAdd(null); setAmount("");
        return toast.show("Amount exceeds your available savings balance");
      }
      commitTxn({ title: `Goal contribution — ${add.title}`, serviceId: "goal-setting", category: "Savings", amount: amt });
      patch({ goals: state.goals.map((g) => (g.id === add.id ? { ...g, saved: g.saved + amt } : g)) });
      toast.show("Moved from EBL Savings to your goal");
    } else {
      if (amt > add.saved) {
        setAdd(null); setAmount("");
        return toast.show("Amount exceeds the balance saved in this goal");
      }
      commitTxn({
        title: `Goal withdrawal — ${add.title}`, serviceId: "goal-setting", category: "Savings",
        amount: amt, direction: "credit", points: 0,
      });
      patch({ goals: state.goals.map((g) => (g.id === add.id ? { ...g, saved: Math.max(0, g.saved - amt) } : g)) });
      toast.show("Returned to your EBL Savings Account");
    }
    setAdd(null); setAmount("");
  };

  const openSheet = (g: Goal, m: "add" | "withdraw") => { setMode(m); setAmount(""); setAdd(g); };

  return (
    <>
      <SectionCard title="Savings Goals" subtitle="Goal money is moved out of your EBL Savings Account">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-brand-soft p-2.5">
            <p className="text-[11.5px] text-muted-foreground">Available</p>
            <p className="text-[14px] font-semibold">{money(savings?.balance ?? 0)}</p>
          </div>
          <div className="rounded-xl bg-tint-green p-2.5">
            <p className="text-[11.5px] text-muted-foreground">In goals</p>
            <p className="text-[14px] font-semibold">{money(goalTotal)}</p>
          </div>
          <div className="rounded-xl bg-tint-blue p-2.5">
            <p className="text-[11.5px] text-muted-foreground">Combined</p>
            <p className="text-[14px] font-semibold">{money((savings?.balance ?? 0) + goalTotal)}</p>
          </div>
        </div>
        <Button className="mt-3" onClick={() => setOpen(true)}>Create new goal</Button>
      </SectionCard>

      {state.goals.map((g) => {
        const pct = (g.saved / g.target) * 100;
        return (
          <SectionCard key={g.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-tint-yellow text-[15px] font-semibold">{g.title.slice(0, 1)}</span>
              <div className="flex-1">
                <p className="text-[15.5px] font-medium">{g.title}</p>
                <p className="text-[12.5px] text-muted-foreground">{money(g.saved)} of {money(g.target)} · by {g.date}</p>
              </div>
              <span className="text-[13px] font-semibold text-accent">{pct.toFixed(1)}%</span>
            </div>
            <ProgressBar className="mt-3" value={pct} />
            <div className="mt-2 grid grid-cols-2 gap-3 text-[12.5px] text-muted-foreground">
              <span>Remaining {money(Math.max(0, g.target - g.saved))}</span>
              <span className="text-right">Suggested {money(g.monthly)}/month</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => openSheet(g, "add")} className="press rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium">Contribute</button>
              <button onClick={() => openSheet(g, "withdraw")} className="press rounded-lg border border-border px-3 py-1.5 text-[12.5px]">Withdraw</button>
              <button onClick={() => { patch({ goals: state.goals.map((x) => (x.id === g.id ? { ...x, auto: !x.auto } : x)) }); toast.show(g.auto ? "Auto contribution paused" : "Auto contribution enabled"); }}
                className="press rounded-lg border border-border px-3 py-1.5 text-[12.5px]">{g.auto ? "Pause Auto" : "Enable Auto"}</button>
              <button onClick={() => { patch({ goals: state.goals.filter((x) => x.id !== g.id) }); toast.show("Goal deleted"); }}
                className="press rounded-lg border border-border px-3 py-1.5 text-[12.5px] text-error">Delete</button>
            </div>
          </SectionCard>
        );
      })}


      <Sheet open={open} onClose={() => setOpen(false)} title="Create goal">
        <div className="space-y-3">
          <FormField label="Goal title"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Nepal Trip" /></FormField>
          <FormField label="Icon"><Select value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} options={["Target", "Plane", "Laptop", "Smartphone", "ShieldCheck", "GraduationCap"]} /></FormField>
          <FormField label="Target amount"><TextInput inputMode="numeric" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value.replace(/\D/g, "") })} /></FormField>
          <FormField label="Current savings"><TextInput inputMode="numeric" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value.replace(/\D/g, "") })} /></FormField>
          <FormField label="Target date"><TextInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
          <FormField label="Monthly contribution"><TextInput inputMode="numeric" value={form.monthly} onChange={(e) => setForm({ ...form, monthly: e.target.value.replace(/\D/g, "") })} /></FormField>
          <div className="flex items-center justify-between">
            <span className="text-[14px]">Enable auto contribution</span>
            <Toggle checked={form.auto} onChange={(v) => setForm({ ...form, auto: v })} />
          </div>
          <Button onClick={create}>Save goal</Button>
        </div>
      </Sheet>

      <Sheet open={!!add} onClose={() => setAdd(null)} title={`${mode === "add" ? "Add to" : "Withdraw from"} ${add?.title ?? ""}`}>
        <p className="mb-2 text-[12.5px] text-muted-foreground">
          {mode === "add"
            ? `Available in EBL Savings: ${money(savings?.balance ?? 0)}`
            : `Saved in this goal: ${money(add?.saved ?? 0)}`}
        </p>
        <FormField label="Amount"><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} /></FormField>
        <Button className="mt-3" onClick={() => {
          const amt = Number(amount || 0);
          if (amt <= 0) return toast.show("Enter an amount");
          if (mode === "add" && amt > (savings?.balance ?? 0)) return toast.show("Amount exceeds your available balance");
          if (mode === "withdraw" && amt > (add?.saved ?? 0)) return toast.show("Amount exceeds the goal balance");
          setAuth(true);
        }}>Continue</Button>
      </Sheet>


      <AuthenticationSheet open={auth} amount={Number(amount || 0)} onClose={() => setAuth(false)}
        onSuccess={() => { setAuth(false); contribute(); }} />
      {toast.node}
    </>
  );
}

/* ---------------- Early Salary Access ---------------- */

export function EarlySalaryPanel() {
  const { state, patch, commitTxn } = useApp();
  const toast = useToast();
  const [amount, setAmount] = useState("10000");
  const [terms, setTerms] = useState(false);
  const [auth, setAuth] = useState(false);
  const amt = Number(amount || 0);
  const fee = Math.round(amt * 0.025);

  const submit = () => {
    commitTxn({ title: "Early Salary Access", serviceId: "early-salary", category: "Salary Advance", amount: amt, direction: "credit", points: 0 });
    patch({ esa: { ...state.esa, status: "Disbursed", amount: amt, fee } });
    toast.show("Approved and disbursed to your account");
  };

  return (
    <>
      <SectionCard title="Early Salary Access" subtitle="Get part of your salary before payday">
        <dl className="space-y-2 text-[13.5px]">
          <RowLine k="Monthly salary" v={money(state.esa.salary)} />
          <RowLine k="Eligible limit" v={money(state.esa.limit)} />
          <RowLine k="Status" v={state.esa.status} />
          <RowLine k="Salary date" v="28 May 2025" />
        </dl>
      </SectionCard>

      <SectionCard title="Request amount">
        <TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
        <dl className="mt-3 space-y-2 text-[13.5px]">
          <RowLine k="Requested" v={money(amt)} />
          <RowLine k="Illustrative fee" v={money(fee)} />
          <RowLine k="Repayment on salary day" v={money(amt + fee)} />
        </dl>
        <label className="mt-3 flex items-start gap-2 text-[13px]">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1" />
          <span>I accept the demo terms. Repayment will be auto-deducted from my next salary.</span>
        </label>
        <Button className="mt-3" disabled={!terms || amt <= 0 || amt > state.esa.limit}
          onClick={() => setAuth(true)}>Request {money(amt)}</Button>
        {amt > state.esa.limit && <p className="mt-2 text-[12.5px] text-error">Amount exceeds your eligible limit.</p>}
      </SectionCard>

      {state.esa.status !== "Eligible" && (
        <SectionCard title="Repayment status">
          <div className="flex items-center justify-between">
            <p className="text-[14px]">{money(state.esa.amount + state.esa.fee)} due on 28 May 2025</p>
            <StatusBadge status={state.esa.status} />
          </div>
        </SectionCard>
      )}

      <AuthenticationSheet open={auth} amount={amt} onClose={() => setAuth(false)}
        onSuccess={() => { setAuth(false); submit(); }} />
      {toast.node}
    </>
  );
}

export function RowLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd>
    </div>
  );
}
