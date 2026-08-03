import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, FormField, TextInput, Select, ProgressBar, StatusBadge, Sheet, SearchField, SegmentedTabs, useToast, cx } from "@/components/kit";
import { Row } from "@/components/TxnFlow";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { Icon } from "@/components/Icon";
import { useApp, money } from "@/lib/store";

/* ---------------- Instant Account Opening (eKYC) ---------------- */

export function AccountOpeningPanel() {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const [step, setStep] = useState(state.onboarding.submitted ? 4 : 0);
  const [mobile, setMobile] = useState(state.user.mobile);
  const [otp, setOtp] = useState("");
  const [nid, setNid] = useState("");
  const [nidCaptured, setNidCaptured] = useState(false);
  const [selfie, setSelfie] = useState(false);
  const [form, setForm] = useState({ name: state.user.name, dob: "1996-04-12", occupation: "Service", nominee: "Rifat Hasan", type: "Savings Account", branch: "Gulshan" });

  const steps = ["Mobile", "NID", "Selfie", "Details"];

  const submit = () => {
    const acc = "1502" + Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 9);
    patch({ onboarding: { submitted: true, accountNumber: acc, type: form.type } });
    notify("Account request submitted", `${form.type} · ${acc} pending activation`, "info");
    setStep(4);
  };

  return (
    <>
      <SectionCard>
        <div className="mb-4 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={cx("h-1.5 rounded-full", i <= step ? "bg-brand" : "bg-muted")} />
              <p className={cx("mt-1.5 text-[11px]", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3">
            <FormField label="Mobile number"><TextInput value={mobile} onChange={(e) => setMobile(e.target.value)} inputMode="tel" /></FormField>
            <FormField label="OTP (demo 123456)"><TextInput value={otp} inputMode="numeric" onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} /></FormField>
            <Button onClick={() => (otp === "123456" ? setStep(1) : toast.show("Invalid OTP — use 123456"))}>Verify & continue</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <FormField label="NID number"><TextInput value={nid} inputMode="numeric" onChange={(e) => setNid(e.target.value.replace(/\D/g, ""))} placeholder="10 or 17 digits" /></FormField>
            <button onClick={() => setNidCaptured(true)}
              className={cx("press grid h-36 w-full place-items-center rounded-2xl border-2 border-dashed text-[13px]", nidCaptured ? "border-success text-success" : "border-border text-muted-foreground")}>
              {nidCaptured ? "NID front & back captured ✓" : "Tap to capture NID front & back"}
            </button>
            <Button onClick={() => (nid.length >= 10 && nidCaptured ? setStep(2) : toast.show("Enter NID and capture both sides"))}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <button onClick={() => setSelfie(true)}
              className={cx("press grid h-44 w-full place-items-center rounded-full border-2 border-dashed text-[13px]", selfie ? "border-success text-success" : "border-border text-muted-foreground")}>
              {selfie ? "Liveness check passed ✓" : "Tap to take a selfie"}
            </button>
            <p className="text-center text-[12.5px] text-muted-foreground">Blink twice when prompted for the liveness check.</p>
            <Button onClick={() => (selfie ? setStep(3) : toast.show("Complete the selfie step"))}>Continue</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <FormField label="Full name"><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Date of birth"><TextInput type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></FormField>
            <FormField label="Occupation"><Select value={form.occupation} onChange={(v) => setForm({ ...form, occupation: v })} options={["Service", "Business", "Student", "Freelancer", "Other"]} /></FormField>
            <FormField label="Nominee"><TextInput value={form.nominee} onChange={(e) => setForm({ ...form, nominee: e.target.value })} /></FormField>
            <FormField label="Account type"><Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={["Savings Account", "Current Account", "Student Account", "Salary Account"]} /></FormField>
            <FormField label="Branch"><Select value={form.branch} onChange={(v) => setForm({ ...form, branch: v })} options={["Gulshan", "Dhanmondi", "Banani", "Uttara", "Motijheel"]} /></FormField>
            <Button onClick={submit}>Submit application</Button>
          </div>
        )}

        {step === 4 && (
          <div className="py-4 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-tint-green"><Icon name="Check" className="size-7 text-success" /></div>
            <p className="mt-3 text-[16px] font-semibold">Account request submitted</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{state.onboarding.type} · {state.onboarding.accountNumber}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">Status: pending activation (demo)</p>
            <Button className="mt-4" variant="outline" onClick={() => { patch({ onboarding: { submitted: false } }); setStep(0); }}>Start another application</Button>
          </div>
        )}
      </SectionCard>
      {toast.node}
    </>
  );
}

/* ---------------- Savings: DPS / FDR ---------------- */

export function SavingsPanel({ focus }: { focus: string }) {
  const { state, patch, commitTxn, notify } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState(focus === "fdr" ? "FDR" : "DPS");
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("3 years");
  const [auth, setAuth] = useState(false);

  const create = () => {
    const amt = Number(amount);
    if (!amt) return toast.show("Enter an amount");
    if (amt > state.accounts[0].balance) return toast.show("Insufficient balance");
    setAuth(true);
  };

  const confirm = () => {
    const amt = Number(amount);
    setAuth(false);
    setOpen(false);
    if (tab === "DPS") {
      patch({ dps: [...state.dps, { id: "dps" + Date.now(), title: "New DPS", monthly: amt, saved: amt, target: amt * 36, matures: "2029" }] });
      commitTxn({ title: "DPS contribution", serviceId: "dps", amount: amt, direction: "debit", category: "DPS", accountId: state.accounts[0].id });
      notify("DPS opened", `Monthly ${money(amt)} · ${tenure}`, "txn");
    } else {
      patch({ fdr: [...state.fdr, { id: "fdr" + Date.now(), title: "New FDR", amount: amt, rate: 8.5, matures: "2027" }] });
      commitTxn({ title: "Fixed deposit", serviceId: "fdr", amount: amt, direction: "debit", category: "FDR", accountId: state.accounts[0].id });
      notify("Fixed deposit created", `${money(amt)} at 8.5% · ${tenure}`, "txn");
    }
    setAmount("");
    toast.show(tab === "DPS" ? "DPS opened successfully" : "Fixed deposit created");
  };

  return (
    <>
      <SegmentedTabs tabs={[{ id: "DPS", label: "DPS" }, { id: "FDR", label: "FDR" }]} value={tab} onChange={setTab} />
      {tab === "DPS" ? (
        <SectionCard title="Your DPS schemes">
          {state.dps.map((d) => (
            <div key={d.id} className="border-b border-border py-3 last:border-0">
              <div className="flex justify-between text-[14.5px] font-medium"><span>{d.title}</span><span>{money(d.monthly)}/mo</span></div>
              <ProgressBar value={(d.saved / d.target) * 100} className="my-2" />
              <p className="text-[12.5px] text-muted-foreground">{money(d.saved)} of {money(d.target)} · matures {d.matures}</p>
            </div>
          ))}
          <Button className="mt-3" onClick={() => setOpen(true)}>Open Instant DPS</Button>
        </SectionCard>
      ) : (
        <SectionCard title="Fixed deposits">
          {state.fdr.map((f) => (
            <div key={f.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
              <div><p className="text-[14.5px] font-medium">{f.title}</p><p className="text-[12.5px] text-muted-foreground">{f.rate}% · matures {f.matures}</p></div>
              <span className="text-[15px] font-semibold">{money(f.amount)}</span>
            </div>
          ))}
          <Button className="mt-3" onClick={() => setOpen(true)}>Open Fixed Deposit</Button>
        </SectionCard>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title={tab === "DPS" ? "Open Instant DPS" : "Open Fixed Deposit"}>
        <div className="space-y-3">
          <FormField label={tab === "DPS" ? "Monthly amount (৳)" : "Deposit amount (৳)"}>
            <TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
          </FormField>
          <FormField label="Tenure"><Select value={tenure} onChange={setTenure} options={["1 year", "2 years", "3 years", "5 years"]} /></FormField>
          <FormField label="Debit account">
            <Select value={state.accounts[0].id} onChange={() => undefined} options={state.accounts.map((a) => ({ value: a.id, label: `${a.name} · ${money(a.balance)}` }))} />
          </FormField>
          <p className="text-[12.5px] text-muted-foreground">Indicative rate 8.5% p.a. Demo figures only.</p>
          <Button onClick={create}>Continue</Button>
        </div>
      </Sheet>

      <AuthenticationSheet open={auth} amount={Number(amount)} onClose={() => setAuth(false)} purpose="Confirm savings setup" onSuccess={confirm} />
      {toast.node}
    </>
  );
}

/* ---------------- Information panels ---------------- */

const FAQS = [
  { c: "Payments", q: "How do I transfer money?", a: "Fund Transfer supports My Account, EBL accounts, other banks and MFS wallets. Choose the recipient, enter an amount, review and confirm." },
  { c: "Payments", q: "What are the transaction limits?", a: "Demo limits: ৳50,000 per transaction and ৳2,00,000 per day. You can view them in Transaction Limits." },
  { c: "Security", q: "When is an OTP required?", a: "Payments above ৳5,000, PIN resets, biometric resets and trusted device changes require an OTP." },
  { c: "Security", q: "Is one-tap payment safe?", a: "Yes — every payment still needs fingerprint, Face ID or PIN confirmation." },
  { c: "Rewards", q: "How do I earn points?", a: "You earn 1 point for every ৳100 spent on bills, recharge, tuition, gift cards, QR payments and DPS contributions." },
  { c: "Rewards", q: "Do points expire?", a: "Points expire 12 months after they are earned. Expiring points are shown on the Rewards screen." },
  { c: "Cards", q: "How do I freeze my card?", a: "Card Controls lets you freeze or unfreeze a card, set limits and toggle online, ATM and international usage." },
  { c: "Accounts", q: "How do I open an account?", a: "Instant Account Opening takes four steps: mobile verification, NID capture, selfie liveness and personal details." },
  { c: "Support", q: "How do I raise a ticket?", a: "Open AI Customer Support and choose Create Ticket. You will get a ticket ID you can track." },
];

export function FaqPanel() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const cats = ["All", ...Array.from(new Set(FAQS.map((f) => f.c)))];
  const list = FAQS.filter((f) => (cat === "All" || f.c === cat) && (f.q + f.a).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <SectionCard>
        <SearchField value={q} onChange={setQ} placeholder="Search FAQs" />
        <div className="mt-3 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cx("press rounded-full border px-3 py-1.5 text-[12.5px]", cat === c ? "border-brand bg-brand-soft" : "border-border")}>{c}</button>
          ))}
        </div>
      </SectionCard>
      <SectionCard>
        {list.map((f) => (
          <div key={f.q} className="border-b border-border py-3 last:border-0">
            <button className="press flex w-full items-center justify-between text-left" onClick={() => setOpen(open === f.q ? null : f.q)}>
              <span className="text-[14.5px] font-medium">{f.q}</span>
              <Icon name={open === f.q ? "ChevronUp" : "ChevronDown"} className="size-4 text-muted-foreground" />
            </button>
            {open === f.q && <p className="mt-2 text-[13.5px] text-muted-foreground">{f.a}</p>}
          </div>
        ))}
        {!list.length && <p className="py-6 text-center text-[13.5px] text-muted-foreground">No FAQs matched your search.</p>}
      </SectionCard>
    </>
  );
}

const TUTORIALS = [
  { t: "Make your first transfer", steps: ["Open Fund Transfer", "Pick a recipient", "Enter the amount", "Confirm with biometrics"] },
  { t: "Pay a bill in 30 seconds", steps: ["Open Bill Payment", "Choose the biller", "Retrieve the bill", "Confirm payment"] },
  { t: "Earn and redeem rewards", steps: ["Spend on eligible categories", "Watch your points grow", "Open Reward Offers", "Redeem an offer"] },
  { t: "Set up Group DPS", steps: ["Create a group", "Invite members", "Set the monthly amount", "Contribute together"] },
  { t: "Secure your account", steps: ["Enroll fingerprint or Face ID", "Set auto logout", "Review trusted devices", "Turn on alerts"] },
];

export function TutorialsPanel() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <SectionCard title="Tutorials">
      {TUTORIALS.map((t) => (
        <div key={t.t} className="border-b border-border py-3 last:border-0">
          <button className="press flex w-full items-center justify-between text-left" onClick={() => setOpen(open === t.t ? null : t.t)}>
            <span className="text-[14.5px] font-medium">{t.t}</span>
            <Icon name={open === t.t ? "ChevronUp" : "ChevronDown"} className="size-4 text-muted-foreground" />
          </button>
          {open === t.t && (
            <ol className="mt-2 space-y-1.5">
              {t.steps.map((s, i) => (
                <li key={s} className="flex gap-2 text-[13.5px] text-muted-foreground">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] text-foreground">{i + 1}</span>{s}
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </SectionCard>
  );
}

export function NotificationsPanel() {
  const { state, patch } = useApp();
  const [tab, setTab] = useState("All");
  const kinds: Record<string, string> = { All: "", Transactions: "txn", Security: "security", Rewards: "reward", Info: "info" };
  const list = state.notifications.filter((n) => !kinds[tab] || n.kind === kinds[tab]);
  return (
    <>
      <SegmentedTabs tabs={Object.keys(kinds).map((k) => ({ id: k, label: k }))} value={tab} onChange={setTab} />
      <SectionCard>
        <button className="press mb-2 text-[13px] text-primary"
          onClick={() => patch({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })}>Mark all as read</button>
        {list.map((n) => (
          <div key={n.id} className={cx("border-b border-border py-3 last:border-0", !n.read && "bg-brand-soft/40")}>
            <div className="flex justify-between">
              <p className="text-[14.5px] font-medium">{n.title}</p>
              <span className="text-[12px] text-muted-foreground">{n.date}</span>
            </div>
            <p className="text-[13px] text-muted-foreground">{n.body}</p>
          </div>
        ))}
        {!list.length && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Nothing here yet.</p>}
      </SectionCard>
    </>
  );
}

export function AccountsPanel() {
  const { state } = useApp();
  const nav = useNavigate();
  return (
    <>
      {state.accounts.map((a) => (
        <SectionCard key={a.id}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-semibold">{a.name}</p>
              <p className="text-[12.5px] text-muted-foreground">{a.masked} · {a.type}</p>
            </div>
            <StatusBadge status="Active" />
          </div>
          <p className="mt-3 text-[26px] font-semibold text-primary">{money(a.balance)}</p>
          <p className="text-[12.5px] text-muted-foreground">Available balance</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button variant="outline" onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "fund-transfer" } })}>Transfer</Button>
            <Button variant="outline" onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "transaction-history" } })}>History</Button>
            <Button variant="outline" onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "statements" } })}>Statement</Button>
          </div>
        </SectionCard>
      ))}
    </>
  );
}

export function ProfilePanel() {
  const { state } = useApp();
  const nav = useNavigate();
  const u = state.user;
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  return (
    <>
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-brand-soft text-[18px] font-semibold">{u.name.charAt(0)}</div>
          <div>
            <p className="text-[17px] font-semibold">{u.name}</p>
            <p className="text-[13px] text-muted-foreground">{u.mobile}</p>
            <p className="text-[13px] text-muted-foreground">{u.email}</p>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Details">
        <Row k="Customer ID" v="EBL-4471902" />
        <Row k="Branch" v="Gulshan" />
        <Row k="KYC status" v="Verified" />
        <Row k="Member since" v="March 2019" />
      </SectionCard>
      <SectionCard title="Manage">
        <ListRow icon="ShieldCheck" tint="blue" title="Security" onClick={() => go("security-settings")} />
        <ListRow icon="Accessibility" tint="green" title="Accessibility" onClick={() => go("accessibility")} />
        <ListRow icon="Star" tint="purple" title="Personalization" onClick={() => go("personalization")} />
        <ListRow icon="Bell" tint="yellow" title="Notifications" onClick={() => go("notifications")} />
      </SectionCard>
    </>
  );
}

export function DocumentsPanel({ kind }: { kind: "statements" | "certificates" | "receipts" }) {
  const { state } = useApp();
  const toast = useToast();
  if (kind === "receipts")
    return (
      <>
        <SectionCard title="Receipts">
          {state.receipts.map((r) => (
            <div key={r.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
              <div><p className="text-[14.5px] font-medium">{r.title}</p><p className="text-[12.5px] text-muted-foreground">{r.id} · {r.date}</p></div>
              <div className="flex items-center gap-3">
                <span className="text-[14.5px] font-semibold">{money(r.amount)}</span>
                <button className="press text-[13px] text-primary" onClick={() => toast.show("Receipt downloaded (demo)")}>Save</button>
              </div>
            </div>
          ))}
          {!state.receipts.length && <p className="py-6 text-center text-[13.5px] text-muted-foreground">Complete a transaction to see receipts.</p>}
        </SectionCard>
        {toast.node}
      </>
    );

  const items = kind === "statements"
    ? ["January 2025", "December 2024", "November 2024", "October 2024"]
    : ["Bank Solvency Certificate", "Tax Certificate 2024-25", "Account Confirmation Letter", "Interest Certificate"];
  return (
    <>
      <SectionCard title={kind === "statements" ? "Account statements" : "Certificates"}>
        {items.map((i) => (
          <ListRow key={i} icon="FileText" title={i} subtitle={kind === "statements" ? "PDF · e-statement" : "PDF · request instantly"}
            onClick={() => toast.show(kind === "statements" ? `${i} statement downloaded (demo)` : `${i} requested (demo)`)} />
        ))}
      </SectionCard>
      {toast.node}
    </>
  );
}

export function LoansPanel() {
  const toast = useToast();
  const products = [
    { t: "Personal Loan", r: "9.5% p.a.", d: "Up to ৳20,00,000 · 5 years" },
    { t: "Home Loan", r: "8.75% p.a.", d: "Up to ৳2,00,00,000 · 25 years" },
    { t: "Auto Loan", r: "9.0% p.a.", d: "Up to ৳40,00,000 · 6 years" },
    { t: "Credit Card EMI", r: "0% for 3 months", d: "Convert purchases to EMI" },
  ];
  const [amount, setAmount] = useState("500000");
  const [years, setYears] = useState("5");
  const emi = (() => {
    const p = Number(amount) || 0, n = Number(years) * 12, r = 0.095 / 12;
    return n ? Math.round((p * r) / (1 - Math.pow(1 + r, -n))) : 0;
  })();
  return (
    <>
      <SectionCard title="Loan products">
        {products.map((p) => (
          <div key={p.t} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div><p className="text-[14.5px] font-medium">{p.t}</p><p className="text-[12.5px] text-muted-foreground">{p.d}</p></div>
            <span className="text-[13px] font-medium text-success">{p.r}</span>
          </div>
        ))}
      </SectionCard>
      <SectionCard title="EMI calculator">
        <FormField label="Loan amount (৳)"><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} /></FormField>
        <FormField label="Tenure (years)"><Select value={years} onChange={setYears} options={["1", "2", "3", "5", "7", "10"]} /></FormField>
        <p className="mt-2 text-[13px] text-muted-foreground">Estimated monthly EMI at 9.5% p.a.</p>
        <p className="text-[24px] font-semibold text-primary">{money(emi)}</p>
        <Button className="mt-3" onClick={() => toast.show("Loan enquiry submitted — a officer will call you (demo)")}>Apply now</Button>
      </SectionCard>
      {toast.node}
    </>
  );
}

export function LimitsPanel() {
  const { state } = useApp();
  const toast = useToast();
  const [auth, setAuth] = useState<null | string>(null);
  const [limits, setLimits] = useState({ perTxn: "50000", daily: "200000", monthly: "1000000" });
  const [draft, setDraft] = useState(limits);
  return (
    <>
      <SectionCard title="Transaction limits">
        <FormField label="Per transaction (৳)"><TextInput inputMode="numeric" value={draft.perTxn} onChange={(e) => setDraft({ ...draft, perTxn: e.target.value.replace(/\D/g, "") })} /></FormField>
        <FormField label="Daily (৳)"><TextInput inputMode="numeric" value={draft.daily} onChange={(e) => setDraft({ ...draft, daily: e.target.value.replace(/\D/g, "") })} /></FormField>
        <FormField label="Monthly (৳)"><TextInput inputMode="numeric" value={draft.monthly} onChange={(e) => setDraft({ ...draft, monthly: e.target.value.replace(/\D/g, "") })} /></FormField>
        <p className="text-[12.5px] text-muted-foreground">Current: {money(Number(limits.perTxn))} per transaction · {money(Number(limits.daily))} daily.</p>
        <Button className="mt-3" onClick={() => setAuth("save")}>Save limits</Button>
      </SectionCard>
      <SectionCard title="Cards">
        {state.cards.map((c) => (
          <div key={c.id} className="border-b border-border py-3 last:border-0">
            <p className="text-[14.5px] font-medium">{c.name}</p>
            <p className="text-[12.5px] text-muted-foreground">{c.masked} · daily limit {money(c.limit)}</p>
          </div>
        ))}
      </SectionCard>
      <AuthenticationSheet open={!!auth} forceOtp onClose={() => setAuth(null)} purpose="Confirm limit change"
        onSuccess={() => { setLimits(draft); setAuth(null); toast.show("Transaction limits updated"); }} />
      {toast.node}
    </>
  );
}

export function LifestylePanel({ focus }: { focus: string }) {
  const { state, commitTxn, notify } = useApp();
  const toast = useToast();
  const [auth, setAuth] = useState<{ title: string; amount: number; category: string } | null>(null);

  const pay = (title: string, amount: number, category: string) => setAuth({ title, amount, category });
  const done = () => {
    if (!auth) return;
    commitTxn({ title: auth.title, serviceId: focus, amount: auth.amount, direction: "debit", category: auth.category, accountId: state.accounts[0].id });
    notify("Payment successful", `${auth.title} · ${money(auth.amount)}`, "txn");
    toast.show(`${auth.title} paid`);
    setAuth(null);
  };

  const blocks: Record<string, { title: string; rows: { t: string; s: string; amt: number }[] }> = {
    donation: { title: "Donations", rows: [{ t: "Orphan Care Fund", s: "Verified NGO", amt: 1000 }, { t: "Flood Relief", s: "Emergency appeal", amt: 2000 }, { t: "Winter Blanket Drive", s: "Seasonal", amt: 500 }] },
    zakat: { title: "Zakat", rows: [{ t: "Zakat Fund", s: "2.5% of eligible wealth", amt: 5000 }, { t: "Sadaqah", s: "Voluntary giving", amt: 1000 }] },
    islamic: { title: "Islamic Features", rows: [{ t: "Zakat calculator", s: "2.5% on savings", amt: 5000 }, { t: "Halal investment enquiry", s: "Shariah compliant", amt: 0 }] },
    "e-toll": { title: "E-Toll", rows: [{ t: "Padma Bridge toll", s: "Private car", amt: 750 }, { t: "Dhaka–Mawa Expressway", s: "Private car", amt: 200 }, { t: "Recharge toll tag", s: "Auto deduct", amt: 1000 }] },
    vehicle: { title: "Vehicle Management", rows: [{ t: "Road tax renewal", s: "Dhaka Metro-GA-14-2288", amt: 12500 }, { t: "Fitness certificate", s: "Expires Mar 2026", amt: 3200 }, { t: "Insurance premium", s: "Annual", amt: 8600 }] },
    entertainment: { title: "Entertainment", rows: [{ t: "Netflix subscription", s: "Monthly", amt: 1100 }, { t: "Spotify Premium", s: "Monthly", amt: 199 }, { t: "Chorki", s: "Monthly", amt: 149 }] },
    "education-payments": { title: "Education Payments", rows: [{ t: "Admission fee", s: "Institution payment", amt: 15000 }, { t: "Exam fee", s: "Board registration", amt: 2500 }, { t: "Hostel fee", s: "Quarterly", amt: 18000 }] },
  };
  const b = blocks[focus] ?? blocks["donation"]!;

  return (
    <>
      <SectionCard title={b.title}>
        {b.rows.map((r) => (
          <div key={r.t} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div><p className="text-[14.5px] font-medium">{r.t}</p><p className="text-[12.5px] text-muted-foreground">{r.s}</p></div>
            <Button className="w-24" variant="outline" onClick={() => pay(r.t, r.amt || 1000, b.title)}>
              {r.amt ? money(r.amt) : "Enquire"}
            </Button>
          </div>
        ))}
      </SectionCard>
      <AuthenticationSheet open={!!auth} amount={auth?.amount ?? 0} onClose={() => setAuth(null)} purpose={`Confirm ${auth?.title ?? "payment"}`} onSuccess={done} />
      {toast.node}
    </>
  );
}

export function PersonalizationPanel() {
  const { state, patch } = useApp();
  const p = state.personalization;
  const top = Object.entries(state.usage).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <SectionCard title="Recommendations">
        <div className="flex items-center justify-between">
          <span className="text-[14.5px]">Personalized recommendations</span>
          <button className={cx("press h-7 w-12 rounded-full", p.enabled ? "bg-brand" : "bg-muted")}
            onClick={() => patch({ personalization: { ...p, enabled: !p.enabled } })}>
            <span className={cx("block size-6 rounded-full bg-card transition-transform", p.enabled && "translate-x-5")} />
          </button>
        </div>
        <p className="mt-2 text-[12.5px] text-muted-foreground">Home and Explore reorder services based on how often you use them.</p>
      </SectionCard>
      <SectionCard title="Dashboard layout" subtitle="Reorder or hide Home modules">
        <DashboardCustomizer />
      </SectionCard>

      <SectionCard title="Most used services">
        {top.length ? top.map(([id, n]) => (
          <div key={id} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
            <span className="text-[14px]">{id.replace(/-/g, " ")}</span>
            <span className="text-[12.5px] text-muted-foreground">{n} times</span>
          </div>
        )) : <p className="py-4 text-center text-[13.5px] text-muted-foreground">Use a few services to see them here.</p>}
      </SectionCard>
    </>
  );
}
