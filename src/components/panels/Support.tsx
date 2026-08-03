import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, Button, TextInput, FormField, Select, Sheet, StatusBadge, ListRow, useToast, cx } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { useApp, money } from "@/lib/store";

interface Intent { q: string; a: string; action?: string; target?: string; }

const INTENTS: Intent[] = [
  { q: "How do I transfer money?", a: "Open Fund Transfer, choose My Account, EBL, Other Bank or MFS, pick the recipient, enter the amount, review and confirm with fingerprint, Face ID or PIN.", action: "Open Fund Transfer", target: "fund-transfer" },
  { q: "Why is OTP required?", a: "Payments up to ৳5,000 only need biometric or PIN confirmation. Above ৳5,000 an OTP is also required for extra safety.", action: "Open Security", target: "security-settings" },
  { q: "How does one-tap payment work?", a: "For ৳5,000 or less you confirm once with fingerprint, Face ID or PIN — no OTP screen appears.", action: "Open Add Money", target: "add-money" },
  { q: "How do Rewards work?", a: "You earn 1 point per ৳100 of eligible spending such as bills, recharge, tuition, gift cards, QR payments and DPS contributions.", action: "Open Rewards", target: "rewards" },
  { q: "How can I redeem Reward Points?", a: "Open Rewards, pick an offer such as ৳50 cashback for 500 points, confirm and the points are deducted instantly.", action: "Open Reward Offers", target: "reward-offers" },
  { q: "How does Split Pay work?", a: "Create a split, choose participants, split equally or custom, and each person receives a request they can pay in one tap.", action: "Open Split Pay", target: "split-pay" },
  { q: "How do I freeze my card?", a: "Open Card Controls, select the card and toggle Freeze Card. Sensitive card controls need confirmation.", action: "Open Card Controls", target: "card-controls" },
  { q: "How do I pay tuition fees?", a: "Open Tuition Fee, select level and institution, enter the student details, retrieve the amount, then confirm.", action: "Open Tuition Fee", target: "tuition-fee" },
  { q: "What is Early Salary Access?", a: "You can draw up to ৳20,000 of your ৳70,000 salary early, with an illustrative fee, repaid automatically on salary day.", action: "Open Early Salary Access", target: "early-salary" },
  { q: "How does Group DPS work?", a: "A group sets a target and monthly amount per member. Everyone contributes and progress updates for the whole group.", action: "Open Group DPS", target: "group-dps" },
  { q: "Where is my receipt?", a: "Every successful transaction generates a receipt you can download or share from the Receipts screen.", action: "Open Receipts", target: "receipts" },
  { q: "How do I open an account?", a: "Instant Account Opening takes four steps: mobile verification, NID, selfie and details.", action: "Open Instant Account Opening", target: "account-opening" },
  { q: "How do I reset my login PIN?", a: "Confirm your mobile number, verify the OTP, then set and confirm a new 4-digit PIN.", action: "Open Reset Login PIN", target: "reset-login-pin" },
  { q: "How do I reset my card PIN?", a: "Select the card, confirm identity with biometrics or PIN, verify the OTP and set a new card PIN.", action: "Open Reset Card PIN", target: "reset-card-pin" },
  { q: "How do I add Fingerprint verification?", a: "Open Fingerprint Setup, confirm your login PIN and complete the scan to enroll.", action: "Open Fingerprint Setup", target: "fingerprint-setup" },
  { q: "How do I add Face ID?", a: "Open Face ID Setup, confirm your login PIN and complete the face scan to enroll.", action: "Open Face ID Setup", target: "faceid-setup" },
  { q: "How do I reset Fingerprint or Face ID?", a: "Biometric Reset removes the current enrollment after PIN and OTP verification so you can enroll again.", action: "Open Biometric Reset", target: "biometric-reset" },
  { q: "Why did my transaction fail?", a: "Common causes are insufficient balance, an incorrect OTP, an invalid recipient, an expired scheduled date or a transaction limit. You can retry or raise a ticket.", action: "Open Transfer History", target: "transaction-history" },
  { q: "How do I purchase a Netflix gift card?", a: "Open Entertainment Gift Cards, choose Netflix, pick a value, enter the recipient and confirm.", action: "Open Netflix Gift Card", target: "gift-netflix" },
  { q: "How do I enable Auto Pay?", a: "Create an Auto Pay instruction with the biller, amount, frequency and start date, then confirm to activate.", action: "Open Auto Pay", target: "auto-pay" },

  // Incremental feature intents
  { q: "How do I customize my dashboard?", a: "Open Customize Dashboard from Home or Personalization, use the arrows to reorder modules and the toggles to hide the ones you don't need. Your layout is saved on this device.", action: "Open Customize Dashboard", target: "customize-dashboard" },
  { q: "How do I hide a Home module?", a: "In Customize Dashboard, switch off the toggle beside any module such as Rewards or Cards. Turn it back on any time, or reset to the default layout.", action: "Open Customize Dashboard", target: "customize-dashboard" },
  { q: "How do I see my credit card in the carousel?", a: "On Home, swipe the balance card sideways. Accounts come first, then each card with available credit, used amount and quick actions.", action: "Open Cards", target: "card-services" },
  { q: "How do I send money using a phone number?", a: "Open Send by Mobile Number, type the recipient's 11-digit number and tap Find recipient. We show the masked account, bank and a verified badge before you continue.", action: "Open Send by Mobile Number", target: "phone-transfer" },
  { q: "Why is the recipient account masked?", a: "For privacy we only show the first and last four digits of the linked account. Confirm the name and bank before sending.", action: "Open Send by Mobile Number", target: "phone-transfer" },
  { q: "How does operator detection work in recharge?", a: "The first three digits of the number decide the operator: 017 and 013 are Grameenphone, 018 Robi, 016 Airtel, 019 and 014 Banglalink, 015 Teletalk. You can always change it manually.", action: "Open Mobile Recharge", target: "recharge" },
  { q: "How do I buy an internet package?", a: "Open Mobile Recharge, enter the number, then use the Internet, Minutes, SMS or Bundle tab to pick a package and confirm.", action: "Open Mobile Recharge", target: "recharge" },
  { q: "What partner offers are available?", a: "Partner Offers includes local campaigns such as Star Cineplex, Yum Cha, Star Kabab, Richman, Gentle Park, ILLIYEEN, US-Bangla Airlines and 10 Minute School. These are prototype demo offers.", action: "Open Partner Offers", target: "partner-offers" },
  { q: "How do I redeem a partner offer?", a: "Open the offer, review the terms, then redeem it with your points. The voucher is added to your rewards history.", action: "Open Partner Offers", target: "partner-offers" },
  { q: "What is EBL Islamic Mode?", a: "Islamic Mode switches the app to Shariah-compliant products such as Mudaraba DPS, Mudaraba deposits, Islamic financing, Hajj savings and Zakat. Turn it on or off any time.", action: "Open Islamic Mode", target: "islamic-mode" },
  { q: "How do I report a transaction issue?", a: "Open the transaction in History or Receipts and tap Report an issue, or open Transaction Disputes. Pick the issue type, describe it, attach a screenshot and submit.", action: "Open Transaction Disputes", target: "disputes" },
  { q: "How do I track my dispute?", a: "Transaction Disputes shows a timeline for every case: Submitted, Under Review, Additional Information Required and Resolved, with the expected resolution date.", action: "Open Transaction Disputes", target: "disputes" },
  { q: "How do I share my account details?", a: "Open Share Account Details from My Banking. You can copy masked details, use the share sheet, or send them by NFC by holding the phones together.", action: "Open Share Account Details", target: "account-sharing" },
  { q: "Does NFC sharing work on every phone?", a: "Web NFC only works on supported Android devices. On other devices the prototype shows a simulated share and records it in your sharing history.", action: "Open Share Account Details", target: "account-sharing" },
  { q: "Where is Pay & Transfer?", a: "Pay & Transfer is the second item in the bottom navigation. It groups Send Money, Bills, Mobile, Cards, Education and Scheduled payments.", action: "Open Pay & Transfer", target: "__pay" },
  { q: "How do I repeat a recent payment?", a: "On Home switch to the Recent tab and tap an item — the transfer, bill or recharge opens with the recipient and amount already filled in.", action: "Open Pay & Transfer", target: "__pay" },
  { q: "Do I have a birthday offer?", a: "Yes — your pinned birthday notification carries 50% off up to ৳500 at Yum Cha, valid for 7 days from your birthday. Save it to Rewards to use later.", action: "Open Partner Offers", target: "partner-offers" },
  { q: "Can I talk to a human agent?", a: "Yes. Tap Human Agent and I will hand over your chat history to the next available agent, or you can call 16230.", action: "Talk to a human agent", target: "__human" },
];


export function SupportPanel({ tickets, human }: { tickets?: boolean; human?: boolean }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const [log, setLog] = useState<{ role: "user" | "bot" | "agent"; text: string; action?: string; target?: string }[]>([
    { role: "bot", text: "Hello Mahin! How can I help with your banking today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ticket, setTicket] = useState(!!tickets && !human);
  const [auth, setAuth] = useState<null | string>(null);
  const [handoff, setHandoff] = useState<"none" | "queued" | "live">(state.supportHandoff.escalated ? "live" : "none");
  const [form, setForm] = useState({ category: "Transaction", txnId: "", subject: "", description: "", contact: "Mobile" });

  const push = (m: { role: "user" | "bot" | "agent"; text: string; action?: string; target?: string }) => setLog((l) => [...l, m]);

  const escalate = () => {
    if (handoff !== "none") return;
    setHandoff("queued");
    const id = "TCK-" + Math.floor(100000 + Math.random() * 899999);
    push({ role: "bot", text: "Connecting you to a human agent. Your chat history and account context are being transferred…" });
    setTimeout(() => {
      setHandoff("live");
      patch({ supportHandoff: { escalated: true, ticketId: id } });
      push({ role: "agent", text: `Hi Mahin, I'm Nusrat from EBL Sky care (ref ${id}). I can see your chat with the assistant — how can I help?` });
    }, 1800);
  };


  const localAnswer = (q: string): { text: string; action?: string; target?: string } | null => {
    const l = q.toLowerCase();
    if (l.includes("balance")) return { text: `Your ${state.accounts[0].name} balance is ${money(state.accounts[0].balance)}.`, action: "Open Accounts", target: "accounts" };
    if (l.includes("point") || l.includes("level")) return { text: `You have ${state.rewards.points.toLocaleString()} points at Gold level.`, action: "Open Rewards", target: "rewards" };
    if (l.includes("upcoming") || l.includes("due")) return { text: "2 bills are due this week: Link3 ৳1,200 and DESCO ৳1,840.", action: "Pay Bills", target: "bill-payment" };
    if (l.includes("goal")) return { text: `Nepal Trip is at ${money(state.goals[0].saved)} of ${money(state.goals[0].target)}.`, action: "Open Goals", target: "goal-setting" };
    if (l.includes("group")) return { text: `Group DPS "Nepal Trip" has saved ${money(state.groupDps[0].saved)} of ${money(state.groupDps[0].target)}.`, action: "Open Group DPS", target: "group-dps" };
    if (l.includes("split")) return { text: `You have ${state.splits.filter((s) => s.status !== "Paid").length} open split requests.`, action: "Open Split Pay", target: "split-pay" };
    if (l.includes("salary")) return { text: `Early Salary Access limit is ${money(state.esa.limit)} and your status is ${state.esa.status}.`, action: "Open Early Salary Access", target: "early-salary" };
    if (l.includes("last transaction") || l.includes("recent transaction")) return { text: `Your latest transaction is ${state.transactions[0].title} for ${money(state.transactions[0].amount)} — ${state.transactions[0].status}.`, action: "Open History", target: "transaction-history" };
    return null;
  };

  const ask = (q: string) => {
    push({ role: "user", text: q });
    setInput("");
    if (/human|agent|person|representative/i.test(q)) { escalate(); return; }
    if (handoff === "live") {
      setTyping(true);
      setTimeout(() => { setTyping(false); push({ role: "agent", text: "Thanks, I'm checking that on your account now. This is a prototype conversation, so responses are simulated." }); }, 900);
      return;
    }
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const sensitive = /balance|account number|points/.test(q.toLowerCase());
      const local = localAnswer(q);
      const intent = INTENTS.find((i) => i.q.toLowerCase() === q.toLowerCase())
        ?? INTENTS.find((i) => q.toLowerCase().split(" ").filter((w) => w.length > 4).some((w) => i.q.toLowerCase().includes(w)));
      const reply = local ?? (intent ? { text: intent.a, action: intent.action, target: intent.target } : null);
      if (!reply) {
        push({ role: "bot", text: "I could not find an exact answer. Try one of the suggested topics, talk to a human agent, or create a support ticket.", action: "Create Ticket", target: "__ticket" });
        return;
      }
      if (local && sensitive) { setAuth(q); return; }
      push({ role: "bot", ...reply });
    }, 600);
  };


  const submitTicket = () => {
    if (!form.subject || !form.description) return toast.show("Add a subject and description");
    const id = "TCK-" + Math.floor(100000 + Math.random() * 899999);
    patch({
      tickets: [{ id, ...form, status: "Submitted", date: "Today" }, ...state.tickets],
      notifications: [{ id: "N" + id, title: "Support ticket created", body: `${id} — ${form.subject}`, date: "Today", read: false, kind: "info" }, ...state.notifications],
    });
    setTicket(false);
    toast.show(`Ticket ${id} submitted`);
  };

  return (
    <>
      <SectionCard>
        <div className="mb-3 flex items-center gap-3">
          <span className={cx("grid size-10 place-items-center rounded-full text-[15px]", handoff === "live" ? "bg-tint-green" : "bg-tint-purple")}>
            {handoff === "live" ? "NA" : "AI"}
          </span>
          <div>
            <p className="text-[16px] font-semibold">{handoff === "live" ? "Nusrat · Human agent" : "AI Support"}</p>
            <p className={cx("text-[12.5px]", handoff === "queued" ? "text-muted-foreground" : "text-success")}>
              {handoff === "queued" ? "● Connecting to an agent…" : handoff === "live" ? "● Live agent connected" : "● Online"}
            </p>
          </div>
        </div>
        <div className="space-y-2.5">
          {log.map((m, i) => (
            <div key={i} className={cx("max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px]", m.role === "user" ? "ml-auto bg-brand-soft" : m.role === "agent" ? "bg-tint-green" : "bg-muted")}>
              {m.role === "agent" && <p className="mb-0.5 text-[11px] font-medium text-muted-foreground">Human agent</p>}
              {m.text}
              {m.action && (
                <button
                  onClick={() => {
                    if (m.target === "__ticket") return setTicket(true);
                    if (m.target === "__human") return escalate();
                    if (m.target === "__pay") return nav({ to: "/pay-transfer" });
                    nav({ to: "/service/$serviceId", params: { serviceId: m.target! } });
                  }}
                  className="press mt-2 block rounded-lg bg-card px-3 py-1.5 text-[12.5px] font-medium text-primary">
                  {m.action}
                </button>
              )}
            </div>
          ))}
          {typing && <div className="w-16 rounded-2xl bg-muted px-3.5 py-2.5 text-[13.5px]">…</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <TextInput value={input} placeholder={handoff === "live" ? "Message the agent" : "Type your question"} onChange={(e) => setInput(e.target.value)} />
          <Button className="w-20" onClick={() => input && ask(input)}>Send</Button>
        </div>
        {handoff !== "live" && (
          <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
            {INTENTS.map((i) => (
              <button key={i.q} onClick={() => ask(i.q)} className="press rounded-full border border-border px-3 py-1.5 text-[12px]">{i.q}</button>
            ))}
          </div>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "faqs" } })}>FAQs</Button>
          <Button variant="outline" onClick={() => setTicket(true)}>Create Ticket</Button>
          <Button variant="outline" onClick={() => (handoff === "live" ? toast.show("Calling 16230 (demo)") : escalate())}>
            {handoff === "live" ? "Call 16230" : "Human Agent"}
          </Button>
        </div>
      </SectionCard>

      </SectionCard>

      <SectionCard title="Your tickets">
        {state.tickets.map((t) => (
          <div key={t.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div>
              <p className="text-[14.5px] font-medium">{t.subject}</p>
              <p className="text-[12.5px] text-muted-foreground">{t.id} · {t.category} · {t.date}</p>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </SectionCard>

      <Sheet open={ticket} onClose={() => setTicket(false)} title="Create support ticket">
        <div className="space-y-3">
          <FormField label="Issue category">
            <Select value={form.category} onChange={(v) => setForm({ ...form, category: v })}
              options={["Transaction", "Card", "PIN and Security", "Rewards", "Bill Payment", "Add Money", "Account", "Other"]} />
          </FormField>
          <FormField label="Transaction ID (optional)"><TextInput value={form.txnId} onChange={(e) => setForm({ ...form, txnId: e.target.value })} /></FormField>
          <FormField label="Subject"><TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></FormField>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-24 w-full rounded-xl border border-border p-3 text-[14px] outline-none focus:border-brand" />
          </FormField>
          <button className="press w-full rounded-xl border border-dashed border-border py-4 text-[13px] text-muted-foreground"
            onClick={() => toast.show("Attachment added (demo)")}>Add attachment</button>
          <FormField label="Preferred contact method">
            <Select value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} options={["Mobile", "Email", "In-app chat"]} />
          </FormField>
          <Button onClick={submitTicket}>Submit ticket</Button>
        </div>
      </Sheet>

      <AuthenticationSheet open={!!auth} onClose={() => setAuth(null)} purpose="Verify to view account information"
        onSuccess={() => {
          const r = auth ? localAnswer(auth) : null;
          setAuth(null);
          if (r) push({ role: "bot", ...r });
        }} />
      {toast.node}
    </>
  );
}

export function HelpPanel() {
  const nav = useNavigate();
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  return (
    <>
      <SectionCard title="Help and Support">
        <ListRow icon="Headphones" tint="purple" title="AI Customer Support" subtitle="Instant answers, 24/7" onClick={() => go("ai-support")} />
        <ListRow icon="LifeBuoy" tint="blue" title="Create a ticket" subtitle="Report an issue" onClick={() => go("ai-support")} />
        <ListRow icon="HelpCircle" title="FAQs" onClick={() => go("faqs")} />
        <ListRow icon="Lightbulb" tint="yellow" title="Tutorials" onClick={() => go("tutorials")} />
      </SectionCard>
      <SectionCard title="Contact">
        <ListRow icon="Smartphone" title="16230" subtitle="EBL contact centre" />
        <ListRow icon="Globe" title="support@ebl.com.bd" subtitle="Email support" />
      </SectionCard>
    </>
  );
}
