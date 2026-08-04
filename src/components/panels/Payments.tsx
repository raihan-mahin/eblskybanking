import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, SearchField, ServiceTile, StatusBadge, ProgressBar, FormField, TextInput, Select, Sheet, Toggle, useToast, cx } from "@/components/kit";
import { TxnFlow } from "@/components/TxnFlow";
import { Icon } from "@/components/Icon";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { TXN_CONFIGS, OTHER_BANK_CONFIG } from "./txnConfigs";
import { PhoneTransferPanel } from "./PhoneTransfer";
import { useApp, money } from "@/lib/store";
import type { SplitPay } from "@/lib/types";

/* ---------------- Fund Transfer ---------------- */

export function FundTransferPanel({ initialPrefill }: { initialPrefill?: Record<string, string> | undefined }) {
  const nav = useNavigate();
  const { state } = useApp();
  const [mode, setMode] = useState<string | null>(
    initialPrefill?.["mobile"] ? "phone" : initialPrefill?.["beneficiary"] || initialPrefill?.["account"] ? "ebl" : null,
  );
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  if (mode === "phone") return <PhoneTransferPanel initialMobile={initialPrefill?.["mobile"]} />;
  if (mode === "other") return <TxnFlow serviceId="fund-transfer" {...OTHER_BANK_CONFIG} />;
  if (mode === "ebl")
    return (
      <TxnFlow serviceId="fund-transfer" title="EBL Transfer" category="Transfer"
        initialAmount={initialPrefill?.["amount"]}
        fields={[
          { key: "beneficiary", label: "Beneficiary", type: "select", options: state.beneficiaries.filter((b) => b.kind === "ebl").map((b) => `${b.name} · ${b.account}`) },
          { key: "account", label: "Or Enter Account Number", type: "text", placeholder: "EBL account number", optional: true },
        ]} />
    );
  if (mode === "own")
    return (
      <TxnFlow serviceId="fund-transfer" title="My Account Transfer" category="Own Transfer"
        fields={[{ key: "to", label: "To Account", type: "select", options: state.accounts.map((a) => `${a.name} · ${a.masked}`) }]} />
    );
  if (mode === "mfs") return <TxnFlow serviceId="mfs-transfer" {...TXN_CONFIGS["mfs-transfer"]!} />;

  return (
    <>
      <SectionCard title="Transfer Options">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["phone", "Mobile No.", "Find by phone", "Send", "green"],
            ["own", "My Account", "To Own Account", "Wallet", "yellow"],
            ["ebl", "EBL", "To EBL Account", "Landmark", "yellow"],
            ["other", "Other Bank", "To Other Bank", "ArrowLeftRight", "green"],
            ["mfs", "MFS", "To Mobile Wallets", "Smartphone", "blue"],
          ].map(([id, label, sub, icon, tint]) => (
            <button key={id} onClick={() => setMode(id!)} className="press rounded-xl border border-border p-2">
              <ServiceTile icon={icon!} tint={tint as never} label={label!} />
              <p className="-mt-1 pb-2 text-center text-[10.5px] text-muted-foreground">{sub}</p>
            </button>
          ))}
        </div>
      </SectionCard>


      <SectionCard title="Smart Shortcuts">
        <div className="grid grid-cols-2 gap-2">
          <ListRow icon="Users" tint="purple" title="Split Pay" subtitle="Split bills & pay together" onClick={() => go("split-pay")} className="border-0" />
          <ListRow icon="Repeat" tint="blue" title="Auto Pay" subtitle="Set up automatic payments" onClick={() => go("auto-pay")} className="border-0" />
        </div>
      </SectionCard>

      <SectionCard title="Manage">
        <ListRow icon="Users" title="Beneficiary" onClick={() => go("beneficiaries")} />
        <ListRow icon="CalendarDays" title="Scheduled Transfer List" onClick={() => go("scheduled-transfer")} />
        <ListRow icon="FileText" title="Transfer History" onClick={() => go("transaction-history")} />
      </SectionCard>

      <SectionCard title="Split Pay" subtitle="Manage split payments easily">
        <div className="grid grid-cols-2 gap-2">
          <ListRow icon="HeartHandshake" tint="yellow" title="Request Money" subtitle="Request from friends" onClick={() => go("split-pay")} className="border-0" />
          <ListRow icon="Send" tint="green" title="Pay Request" subtitle="Pay requested money" onClick={() => go("split-pay")} className="border-0" />
        </div>
      </SectionCard>
    </>
  );
}

/* ---------------- Bill Payments ---------------- */

export function BillsPanel() {
  const nav = useNavigate();
  const { state } = useApp();
  const [q, setQ] = useState("");
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });

  const utilities = [
    ["bill-electricity", "Electricity", "Zap", "yellow"], ["bill-gas", "Gas", "Flame", "pink"],
    ["bill-water", "Water", "Droplet", "green"], ["bill-internet", "Internet", "Globe", "blue"],
    ["bill-tv", "TV", "Tv", "purple"],
  ];
  const filtered = q ? utilities.filter((u) => u[1]!.toLowerCase().includes(q.toLowerCase())) : utilities;

  return (
    <>
      <div className="app-card p-4">
        <h1 className="text-[24px] font-semibold">Bill Payments</h1>
        <p className="text-[13.5px] text-muted-foreground">Pay your bills & subscriptions</p>
        <div className="mt-3"><SearchField value={q} onChange={setQ} placeholder="Search biller or service" /></div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[["Recent Payment", "Clock", "transaction-history"], ["Saved Billers", "BookmarkCheck", "saved-billers"], ["Auto Pay", "Repeat", "auto-pay"]].map(([l, i, t]) => (
          <button key={l} onClick={() => go(t!)} className="press app-card flex flex-col items-center gap-1.5 p-3">
            <span className="grid size-9 place-items-center rounded-full bg-tint-yellow">
              <span className="text-[0px]">{l}</span>
              <ServiceTileIcon name={i!} />
            </span>
            <span className="text-center text-[11.5px] font-medium">{l}</span>
          </button>
        ))}
      </div>

      <SectionCard title="Utilities" action="See All" onAction={() => go("saved-billers")}>
        <div className="grid grid-cols-5 gap-1">
          {filtered.map(([id, label, icon, tint]) => (
            <ServiceTile key={id} icon={icon!} tint={tint as never} label={label!} onClick={() => go(id!)} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Fees & Services">
        <div className="grid grid-cols-2 gap-2">
          <ListRow icon="CreditCard" tint="pink" title="Visa Fee" subtitle="Pay your visa fee" onClick={() => go("visa-fee")} className="border-0" />
          <ListRow icon="GraduationCap" tint="green" title="Tuition Fee" subtitle="School & university" onClick={() => go("tuition-fee")} className="border-0" />
        </div>
      </SectionCard>

      <SectionCard title="Entertainment & Gift Cards" action="See All" onAction={() => go("entertainment")}>
        <div className="grid grid-cols-2 gap-2">
          {[["gift-netflix", "Netflix", "Gift Card", "#E50914"], ["gift-spotify", "Spotify", "Premium", "#1DB954"],
          ["gift-google", "Google Play", "Gift Card", "#4285F4"], ["gift-apple", "Apple", "Gift Card", "#111111"]].map(([id, brand, sub, color]) => (
            <button key={id} onClick={() => go(id!)} className="press rounded-xl border border-border p-3 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-xl text-[13px] font-bold text-white" style={{ background: color }}>
                {brand!.slice(0, 1)}
              </span>
              <p className="mt-2 text-[13.5px] font-medium">{brand}</p>
              <p className="text-[11.5px] text-muted-foreground">{sub}</p>
              <p className="mt-1 text-[12px] font-medium text-accent">Buy Now</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Giving">
        <ListRow icon="Moon" tint="green" title="Zakat" subtitle="Calculate and give zakat" onClick={() => go("zakat")} />
        <ListRow icon="HeartHandshake" tint="pink" title="Donation" subtitle="Give to charity and help those in need" onClick={() => go("donation")} />
      </SectionCard>

      <button onClick={() => go("bill-reminder")} className="press flex w-full items-center gap-3 rounded-2xl bg-tint-yellow p-4 text-left">
        <span className="grid size-10 place-items-center rounded-full bg-card"><ServiceTileIcon name="Bell" /></span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium">Smart Bill Reminder</span>
          <span className="block text-[12.5px] text-muted-foreground">
            {state.billers.length} saved billers · 2 bills due this week
          </span>
        </span>
      </button>
    </>
  );
}

function ServiceTileIcon({ name }: { name: string }) {
  return <Icon name={name} className="size-5 text-foreground" />;
}

/* ---------------- Split Pay ---------------- */

export function SplitPayPanel() {
  const { state, patch, commitTxn } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<"active" | "sent" | "received" | "completed">("active");
  const [create, setCreate] = useState(false);
  const [pay, setPay] = useState<SplitPay | null>(null);
  const [auth, setAuth] = useState(false);
  const [title, setTitle] = useState("Dinner at Banani");
  const [total, setTotal] = useState("5000");
  const [people, setPeople] = useState<string[]>(["Mahin", "Arnav", "Taslim"]);
  const [mode, setMode] = useState<"Equal" | "Custom">("Equal");

  const NAMES = ["Mahin", "Arnav", "Taslim", "Suddhi", "Wasif", "Ammu"];
  const lists = {
    active: state.splits.filter((s) => s.status !== "Paid" && s.status !== "Cancelled"),
    sent: state.splits.filter((s) => s.direction === "sent"),
    received: state.splits.filter((s) => s.direction === "received"),
    completed: state.splits.filter((s) => s.status === "Paid"),
  };

  const submitCreate = () => {
    const amt = Number(total || 0);
    if (!title || !amt || people.length < 2) return toast.show("Add a title, amount and at least 2 people");
    const each = Math.round(amt / people.length);
    const rec: SplitPay = {
      id: "sp" + Date.now(), title, total: amt, direction: "sent", from: "Mahin", status: "Requested", date: "Today",
      participants: people.map((n) => ({ name: n, amount: each, paid: n === "Mahin" })),
    };
    patch({ splits: [rec, ...state.splits] });
    setCreate(false);
    toast.show(`Split created — ${money(each)} requested from each`);
  };

  const payRequest = () => {
    if (!pay) return;
    const mine = pay.participants.find((p) => p.name === "Mahin");
    commitTxn({ title: `Split Pay — ${pay.title}`, serviceId: "split-pay", category: "Split Pay", amount: mine?.amount ?? 0 });
    patch({
      splits: state.splits.map((s) =>
        s.id === pay.id
          ? { ...s, status: "Paid", participants: s.participants.map((p) => (p.name === "Mahin" ? { ...p, paid: true } : p)) }
          : s,
      ),
    });
    setPay(null);
    toast.show("Split payment completed");
  };

  return (
    <>
      <SectionCard title="Split Pay" subtitle="Split bills & settle up with friends">
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={() => setCreate(true)}>Create Split</Button>
          <Button variant="outline" onClick={() => setCreate(true)}>Request</Button>
          <Button variant="outline" onClick={() => setTab("received")}>Pay Request</Button>
        </div>
      </SectionCard>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {(["active", "sent", "received", "completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cx("press shrink-0 rounded-full border px-4 py-2 text-[13px] capitalize",
              tab === t ? "border-brand bg-brand-soft font-medium" : "border-border text-muted-foreground")}>
            {t}
          </button>
        ))}
      </div>

      <SectionCard>
        {lists[tab].length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing here yet.</p>}
        {lists[tab].map((s) => {
          const paid = s.participants.filter((p) => p.paid).length;
          const mine = s.participants.find((p) => p.name === "Mahin");
          return (
            <div key={s.id} className="border-b border-border py-3 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[15px] font-medium">{s.title}</p>
                  <p className="text-[12.5px] text-muted-foreground">
                    {s.direction === "sent" ? "You requested" : `From ${s.from}`} · {money(s.total)} · {s.date}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-2"><ProgressBar value={(paid / s.participants.length) * 100} /></div>
              <p className="mt-1 text-[12px] text-muted-foreground">{paid}/{s.participants.length} paid</p>
              {s.direction === "received" && mine && !mine.paid && (
                <Button className="mt-2" onClick={() => setPay(s)}>Pay {money(mine.amount)}</Button>
              )}
            </div>
          );
        })}
      </SectionCard>

      <Sheet open={create} onClose={() => setCreate(false)} title="Create Split">
        <div className="space-y-3">
          <FormField label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></FormField>
          <FormField label="Total Amount"><TextInput inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))} /></FormField>
          <div>
            <p className="mb-2 text-[13px] font-medium text-muted-foreground">Participants</p>
            <div className="flex flex-wrap gap-2">
              {NAMES.map((n) => (
                <button key={n} onClick={() => setPeople((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))}
                  className={cx("press rounded-full border px-3 py-1.5 text-[13px]", people.includes(n) ? "border-brand bg-brand-soft" : "border-border")}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <FormField label="Split Type">
            <Select value={mode} onChange={(v) => setMode(v as never)} options={["Equal", "Custom"]} />
          </FormField>
          <p className="rounded-xl bg-tint-yellow p-3 text-[13px]">
            {people.length > 0 ? `${money(Math.round(Number(total || 0) / people.length))} per person` : "Select participants"}
          </p>
          <Button onClick={submitCreate}>Send Requests</Button>
        </div>
      </Sheet>

      <Sheet open={!!pay} onClose={() => setPay(null)} title="Pay Request">
        {pay && (
          <div className="space-y-3">
            <p className="text-[14px]">{pay.from} requested for <b>{pay.title}</b></p>
            <p className="text-[28px] font-semibold">{money(pay.participants.find((p) => p.name === "Mahin")?.amount ?? 0)}</p>
            <p className="text-[13px] text-muted-foreground">From {state.accounts[0].name} · {state.accounts[0].masked}</p>
            <Button onClick={() => setAuth(true)}>Confirm & Pay</Button>
          </div>
        )}
      </Sheet>

      <AuthenticationSheet open={auth} amount={pay?.participants.find((p) => p.name === "Mahin")?.amount ?? 0}
        onClose={() => setAuth(false)} onSuccess={() => { setAuth(false); payRequest(); }} />
      {toast.node}
    </>
  );
}

/* ---------------- Cards ---------------- */

export function CardsPanel({ focus }: { focus?: string }) {
  const { state, patch, notify } = useApp();
  const nav = useNavigate();
  const goto = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const toast = useToast();
  const [sel, setSel] = useState(state.cards[0].id);
  const [auth, setAuth] = useState<null | (() => void)>(null);
  const card = state.cards.find((c) => c.id === sel)!;

  const update = (p: Partial<typeof card>) => patch({ cards: state.cards.map((c) => (c.id === sel ? { ...c, ...p } : c)) });
  const secure = (fn: () => void) => setAuth(() => fn);

  return (
    <>
      <SectionCard title="My Cards">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {state.cards.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)}
              className={cx("press w-64 shrink-0 rounded-2xl p-4 text-left text-white",
                c.id === sel ? "ring-2 ring-brand" : "")}
              style={{ background: c.kind === "credit" ? "#123B82" : c.kind === "debit" ? "#151515" : "#FF5A00" }}>
              <p className="text-[13px] opacity-80">{c.name}</p>
              <p className="mt-6 text-[16px] tracking-widest">{c.masked}</p>
              <p className="mt-2 text-[12px] opacity-80">{c.frozen ? "Frozen" : c.active ? "Active" : "Not activated"} · {money(c.balance)}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Card Controls" subtitle={focus === "card-controls" ? "Sensitive controls need confirmation" : undefined}>
        {[
          ["Freeze Card", card.frozen, () => update({ frozen: !card.frozen })],
          ["Online Transactions", card.online, () => update({ online: !card.online })],
          ["International Transactions", card.intl, () => update({ intl: !card.intl })],
          ["Contactless Payments", card.contactless, () => update({ contactless: !card.contactless })],
        ].map(([label, val, fn]) => (
          <div key={label as string} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <span className="text-[14.5px]">{label as string}</span>
            <Toggle checked={val as boolean} onChange={() => secure(() => { (fn as () => void)(); toast.show(`${label} updated`); })} />
          </div>
        ))}
        <ListRow icon="ListChecks" title="Transaction Limit" subtitle={money(card.limit) + " per transaction"}
          onClick={() => secure(() => { update({ limit: card.limit + 10000 }); toast.show("Limit increased by ৳10,000"); })} />
        <ListRow icon="Snowflake" title="Report Lost Card"
          onClick={() => secure(() => { update({ frozen: true }); notify("Card reported lost", `${card.name} has been frozen.`, "security"); toast.show("Card reported and frozen"); })} />
      </SectionCard>

      <SectionCard title="Card Services">
        <ListRow icon="PlusCircle" title="Add Card" subtitle="Link an EBL or other bank card"
          onClick={() => secure(() => { patch({ cards: [...state.cards, { ...card, id: "card" + Date.now(), name: "EBL Platinum Card", masked: "4455 XXXX XXXX 9021", active: false, pinSet: false }] }); toast.show("Card added — activate to use"); })} />
        <ListRow icon="ShieldCheck" title="Activate Card" subtitle={card.active ? "Active" : "Tap to activate"}
          onClick={() => secure(() => { update({ active: true }); toast.show("Card activated"); })} />
        <ListRow icon="CreditCard" title="Card Payment" subtitle="Pay your card bill" onClick={() => goto("card-payment")} />
        <ListRow icon="FileText" title="Card Statement" subtitle="Last 3 months" onClick={() => goto("statements")} />
        <ListRow icon="Receipt" title="Unbilled Transactions" subtitle={money(4230)} onClick={() => goto("transaction-history")} />
        <ListRow icon="KeyRound" title="Reset Card PIN" subtitle="Requires OTP" onClick={() => goto("reset-card-pin")} />
      </SectionCard>

      <AuthenticationSheet open={!!auth} onClose={() => setAuth(null)} purpose="Confirm card action"
        onSuccess={() => { auth?.(); setAuth(null); }} />
      {toast.node}
    </>
  );
}

/* ---------------- Scheduling / Auto Pay ---------------- */

export function SchedulePanel({ autoPay }: { autoPay?: boolean }) {
  const { state, patch } = useApp();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [form, setForm] = useState({ name: "", serviceType: "Transfer", recipient: "", amount: "", frequency: "Monthly", start: "", account: state.accounts[0].name, reminder: true });

  const save = () => {
    if (!form.name || !form.amount || !form.start) return toast.show("Fill name, amount and start date");
    if (new Date(form.start) < new Date(new Date().toDateString())) return toast.show("Start date cannot be in the past");
    setAuth(true);
  };
  const activate = () => {
    patch({
      schedules: [{
        id: "sc" + Date.now(), ...form, amount: Number(form.amount),
        frequency: form.frequency as never, active: true, autoPay: !!autoPay, history: [],
      }, ...state.schedules],
    });
    setOpen(false);
    toast.show(autoPay ? "Auto Pay instruction activated" : "Schedule activated");
  };

  const toggle = (id: string) => patch({ schedules: state.schedules.map((s) => (s.id === id ? { ...s, active: !s.active } : s)) });

  return (
    <>
      <SectionCard title={autoPay ? "Auto Pay" : "Scheduled Transfers"} subtitle="Create, pause and manage instructions">
        <Button onClick={() => setOpen(true)}>Create new instruction</Button>
      </SectionCard>

      <SectionCard title="Your instructions">
        {state.schedules.map((s) => (
          <div key={s.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-medium">{s.name}</p>
                <p className="text-[12.5px] text-muted-foreground">{s.serviceType} · {s.recipient} · {money(s.amount)} · {s.frequency}</p>
                <p className="text-[12px] text-muted-foreground">Starts {s.start} · {s.account}</p>
              </div>
              <Toggle checked={s.active} onChange={() => toggle(s.id)} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Skip Next", "View History", "Delete"].map((a) => (
                <button key={a} onClick={() => {
                  if (a === "Delete") { patch({ schedules: state.schedules.filter((x) => x.id !== s.id) }); toast.show("Instruction deleted"); }
                  else if (a === "Skip Next") toast.show("Next execution skipped");
                  else toast.show(`${s.history.length} past executions`);
                }} className="press rounded-lg border border-border px-3 py-1.5 text-[12px]">{a}</button>
              ))}
            </div>
          </div>
        ))}
      </SectionCard>

      <Sheet open={open} onClose={() => setOpen(false)} title="New instruction">
        <div className="space-y-3">
          <FormField label="Schedule name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Service type">
            <Select value={form.serviceType} onChange={(v) => setForm({ ...form, serviceType: v })}
              options={["Transfer", "Utility Bill", "Internet", "Recharge", "Tuition Fee", "Card Payment", "MFS", "DPS", "Group DPS", "Donation"]} />
          </FormField>
          <FormField label="Recipient or biller"><TextInput value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} /></FormField>
          <FormField label="Amount"><TextInput inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/\D/g, "") })} /></FormField>
          <FormField label="Frequency">
            <Select value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} options={["Once", "Weekly", "Monthly", "Quarterly"]} />
          </FormField>
          <FormField label="Start date"><TextInput type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></FormField>
          <FormField label="Source account">
            <Select value={form.account} onChange={(v) => setForm({ ...form, account: v })} options={state.accounts.map((a) => a.name)} />
          </FormField>
          <div className="flex items-center justify-between">
            <span className="text-[14px]">Reminder before execution</span>
            <Toggle checked={form.reminder} onChange={(v) => setForm({ ...form, reminder: v })} />
          </div>
          <Button onClick={save}>Activate</Button>
        </div>
      </Sheet>

      <AuthenticationSheet open={auth} onClose={() => setAuth(false)} purpose="Confirm instruction"
        onSuccess={() => { setAuth(false); activate(); }} />
      {toast.node}
    </>
  );
}
