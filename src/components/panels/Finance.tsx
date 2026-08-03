import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, ProgressBar, CircularProgress, MiniBarChart, MiniLineChart, DonutChart, StatusBadge, FormField, TextInput, Select, Sheet, Toggle, InsightCard, useToast, cx } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { useApp, money, levelFor, nextLevel } from "@/lib/store";
import type { Goal } from "@/lib/types";

/* ---------------- Rewards ---------------- */

export function RewardsPanel() {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const [auth, setAuth] = useState<null | string>(null);
  const pts = state.rewards.points;
  const lvl = levelFor(pts);
  const nx = nextLevel(pts);
  const pct = nx.ceil === nx.floor ? 100 : ((pts - nx.floor) / (nx.ceil - nx.floor)) * 100;

  const redeem = (id: string) => {
    const offer = state.rewards.offers.find((o) => o.id === id)!;
    if (offer.cost > pts) return toast.show("Not enough points for this reward");
    patch({
      rewards: {
        ...state.rewards,
        points: pts - offer.cost,
        history: [{ id: "H" + Date.now(), title: `Redeemed ${offer.title}`, points: -offer.cost, date: "Today" }, ...state.rewards.history],
      },
    });
    notify("Reward redeemed", `${offer.title} — ${offer.cost} points used.`, "reward");
    toast.show(`${offer.title} redeemed`);
  };

  return (
    <>
      <SectionCard>
        <div className="flex items-center gap-4">
          <CircularProgress value={pct} label={pts.toLocaleString()} sub="points" />
          <div className="flex-1 space-y-1">
            <p className="text-[18px] font-semibold text-primary">{lvl} Level</p>
            <p className="text-[13px] text-muted-foreground">{nx.need > 0 ? `${nx.need} points to ${nx.name}` : "Top level reached"}</p>
            <p className="text-[13px] text-success">+{state.rewards.monthPoints} points this month</p>
            <p className="text-[12.5px] text-muted-foreground">{state.rewards.expiring} points expiring soon</p>
            <p className="text-[12.5px] text-muted-foreground">≈ {money(Math.floor(pts / 10))} redeemable value</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Monthly points">
        <MiniBarChart data={[120, 210, 180, 260, 190, 240]} labels={["Dec", "Jan", "Feb", "Mar", "Apr", "May"]} />
      </SectionCard>

      <SectionCard title="Bonus missions">
        {state.rewards.missions.map((m) => (
          <div key={m.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between">
              <p className="text-[14.5px] font-medium">{m.title}</p>
              <span className="text-[12.5px] text-accent">+{m.points} pts</span>
            </div>
            <div className="mt-2"><ProgressBar value={(m.progress / m.goal) * 100} /></div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {m.progress}/{m.goal} · expires {m.expiry} {m.progress >= m.goal && "· Completed"}
            </p>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Redeem points">
        {state.rewards.offers.map((o) => (
          <div key={o.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div>
              <p className="text-[14.5px] font-medium">{o.title}</p>
              <p className="text-[12.5px] text-muted-foreground">{o.cost} points · worth {o.value}</p>
            </div>
            <Button className="w-24 py-2" variant={o.cost > pts ? "outline" : "primary"} disabled={o.cost > pts}
              onClick={() => setAuth(o.id)}>Redeem</Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Reward history">
        {state.rewards.history.slice(0, 12).map((h) => (
          <div key={h.id} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
            <div>
              <p className="text-[14px]">{h.title}</p>
              <p className="text-[12px] text-muted-foreground">{h.date}</p>
            </div>
            <span className={cx("text-[13.5px] font-medium", h.points < 0 ? "text-error" : "text-success")}>
              {h.points > 0 ? "+" : ""}{h.points}
            </span>
          </div>
        ))}
      </SectionCard>

      <AuthenticationSheet open={!!auth} onClose={() => setAuth(null)} purpose="Confirm redemption"
        onSuccess={() => { if (auth) redeem(auth); setAuth(null); }} />
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
  const [amount, setAmount] = useState("");
  const [auth, setAuth] = useState(false);
  const [form, setForm] = useState({ title: "", icon: "Target", target: "", saved: "", date: "", monthly: "", auto: false });

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
    commitTxn({ title: `Goal contribution — ${add.title}`, serviceId: "goal-setting", category: "Savings", amount: amt });
    patch({ goals: state.goals.map((g) => (g.id === add.id ? { ...g, saved: g.saved + amt } : g)) });
    setAdd(null); setAmount(""); toast.show("Contribution added");
  };

  return (
    <>
      <SectionCard title="Savings Goals" subtitle="Plan and achieve your goals">
        <Button onClick={() => setOpen(true)}>Create new goal</Button>
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
              <span className="text-[13px] font-semibold text-accent">{Math.round(pct)}%</span>
            </div>
            <ProgressBar className="mt-3" value={pct} />
            <div className="mt-2 grid grid-cols-2 gap-3 text-[12.5px] text-muted-foreground">
              <span>Remaining {money(Math.max(0, g.target - g.saved))}</span>
              <span className="text-right">Suggested {money(g.monthly)}/month</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setAdd(g)} className="press rounded-lg bg-brand px-3 py-1.5 text-[12.5px] font-medium">Add Money</button>
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

      <Sheet open={!!add} onClose={() => setAdd(null)} title={`Add to ${add?.title ?? ""}`}>
        <FormField label="Amount"><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} /></FormField>
        <Button className="mt-3" onClick={() => (Number(amount) > 0 ? setAuth(true) : toast.show("Enter an amount"))}>Continue</Button>
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
