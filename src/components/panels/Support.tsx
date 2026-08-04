import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { RecentComplaints } from "./Disputes";
import { SectionCard, Button, TextInput, FormField, Select, Sheet, StatusBadge, ListRow, useToast, cx } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { useApp, money } from "@/lib/store";
import { KB, KB_CATEGORIES, QUICK_CHIPS, NEVER_SHARE, isLiveInfoQuestion, matchTopic, topicsByCategory, type KbAction, type KbCategory, type KbTopic } from "@/lib/supportKb";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Msg {
  id: string;
  role: "user" | "bot" | "agent";
  text: string;
  steps?: string[];
  actions?: KbAction[];
  warn?: boolean;
  feedback?: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const CASE_ISSUES = [
  "Transfer problem", "Mobile recharge problem", "Bill-payment problem",
  "Card problem", "PIN or login problem", "Unauthorized transaction", "Other",
];

const CASE_STATUS_LABEL: Record<string, string> = {
  Submitted: "Submitted",
  "In Review": "Being Reviewed",
  "Additional Information Required": "Need More Information",
  Resolved: "Resolved",
};

const HUMAN_ACTION: KbAction = { label: "Talk to Human", target: "__human" };

/* ------------------------------------------------------------------ */
/* Support panel                                                       */
/* ------------------------------------------------------------------ */

export function SupportPanel({ human }: { tickets?: boolean; human?: boolean }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState<"ai" | "human">(human ? "human" : "ai");
  const [log, setLog] = useState<Msg[]>([
    { id: uid(), role: "bot", text: "Hello Mahin! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [more, setMore] = useState(false);
  const [auth, setAuth] = useState<null | string>(null);
  const [unknown, setUnknown] = useState(0);
  const [handoff, setHandoff] = useState<"none" | "queued" | "live">(state.supportHandoff.escalated ? "live" : "none");
  const [caseSheet, setCaseSheet] = useState(false);
  const [quickCase, setQuickCase] = useState<null | { issue: string; txnId?: string; detail: string }>(null);
  const [done, setDone] = useState<null | { id: string; issue: string }>(null);
  const [form, setForm] = useState({ issue: CASE_ISSUES[0]!, txnId: "", detail: "", attachment: false });
  const [summary, setSummary] = useState("");
  const [editSummary, setEditSummary] = useState(false);

  const push = (m: Omit<Msg, "id">) => setLog((l) => [...l, { id: uid(), ...m }]);

  /* ---------------- local data helpers ---------------- */

  const lastFailed = useMemo(
    () => (id?: string) => state.transactions.find((t) => t.status === "failed" && (!id || t.serviceId.includes(id))),
    [state.transactions],
  );

  const maskNumber = (n: string) => (n.length > 6 ? `${n.slice(0, 5)}****${n.slice(-2)}` : n);

  const chatSummary = () => {
    const lastUser = [...log].reverse().find((m) => m.role === "user");
    const lastBot = [...log].reverse().find((m) => m.role === "bot");
    return [
      `Customer: ${state.user.name} (${state.user.mobile})`,
      lastUser ? `Issue: ${lastUser.text}` : "Issue: General banking help",
      lastBot ? `Assistant said: ${lastBot.text}` : "",
    ].filter(Boolean).join("\n");
  };

  /* ---------------- escalation ---------------- */

  const escalate = (note?: string) => {
    setSummary(note ?? chatSummary());
    setTab("human");
    if (handoff !== "none") return;
    setHandoff("queued");
    const id = "CASE-" + Math.floor(100000 + Math.random() * 899999);
    setTimeout(() => {
      setHandoff("live");
      patch({ supportHandoff: { escalated: true, ticketId: id } });
    }, 1600);
  };

  /* ---------------- answering ---------------- */

  const answerTopic = (t: KbTopic) => {
    // Topics that should read live local app data first.
    if (t.id === "balance") { setAuth("balance"); return; }

    if (t.id === "transfer-failed") {
      const txn = lastFailed("transfer");
      if (txn) {
        push({
          role: "bot",
          text: `Your ${txn.title} of ${money(txn.amount)} was not completed (${txn.date}). Reason: incorrect OTP. No money was deducted.`,
          actions: [{ label: "Retry Transfer", target: "fund-transfer" }, { label: "View Details", target: "transaction-history" }, { label: "Report This Issue", target: `__quick:Transfer problem:${txn.id}:${txn.title} of ${money(txn.amount)} failed (incorrect OTP)` }, HUMAN_ACTION],
          feedback: true,
        });
        return;
      }
    }

    if (t.id === "recharge-failed") {
      const txn = state.transactions.find((x) => x.serviceId === "recharge" && x.status !== "success");
      const saved = state.recentEntities.find((r) => r.serviceId === "recharge");
      if (txn || saved) {
        const num = saved ? maskNumber(saved.masked || saved.entity) : "your saved number";
        push({
          role: "bot",
          text: txn
            ? `Your recharge of ${money(txn.amount)} to ${num} did not complete (${txn.date}, ref ${txn.ref}). Your saved number is still available, so you do not need to enter it again.`
            : `No failed recharge is recorded. Your last saved recharge number is ${num}.`,
          actions: [{ label: "Retry Recharge", target: "recharge" }, { label: "Change Operator", target: "recharge" }, ...(txn ? [{ label: "Report This Issue", target: `__quick:Mobile recharge problem:${txn.id}:Recharge of ${money(txn.amount)} to ${num} did not complete` }] : []), HUMAN_ACTION],
          feedback: true,
        });
        return;
      }
    }

    if (t.id === "goals") {
      const g = state.goals[0];
      if (g) {
        push({
          role: "bot",
          text: `You need ${money(g.target - g.saved)} more to reach your ${g.title} goal (${money(g.saved)} of ${money(g.target)} saved).`,
          actions: t.actions ?? [], feedback: true,
        });
        return;
      }
    }

    if (t.id === "rewards") {
      push({
        role: "bot",
        text: `You have ${state.rewards.points.toLocaleString()} reward points. ${t.answer}`,
        steps: t.steps ?? [], actions: t.actions ?? [], feedback: true,
      });
      return;
    }

    if (t.id === "track-case") {
      const open = state.tickets.filter((x) => x.status !== "Resolved");
      push({
        role: "bot",
        text: open.length
          ? `You have ${open.length} open case${open.length > 1 ? "s" : ""}. Latest: ${open[0]!.id} — ${open[0]!.subject} (${CASE_STATUS_LABEL[open[0]!.status] ?? open[0]!.status}).`
          : "All your support cases are resolved.",
        actions: t.actions ?? [], feedback: true,
      });
      return;
    }

    push({
      role: "bot", text: t.answer,
      steps: t.steps ?? [],
      actions: t.urgent ? [...(t.actions ?? [])] : (t.actions ?? []),
      warn: t.warn ?? false,
      feedback: true,
    });
    setUnknown(0);
  };

  const ask = (q: string) => {
    push({ role: "user", text: q });
    setInput("");
    const l = q.toLowerCase();

    if (/\b(human|agent|representative|person)\b/.test(l)) {
      push({ role: "bot", text: "Sure — connecting you with a human agent and passing on this conversation." });
      escalate();
      return;
    }

    setTyping(true);
    setTimeout(() => {
      setTyping(false);

      if (isLiveInfoQuestion(q)) {
        push({
          role: "bot", text: "Live information is not available in this prototype.",
          actions: [{ label: "View available information", target: "__explore" }, HUMAN_ACTION, { label: "Call EBL", target: "__call" }],
        });
        return;
      }

      const topic = matchTopic(q);
      if (topic) { answerTopic(topic); return; }

      const next = unknown + 1;
      setUnknown(next);
      if (next === 1) {
        push({
          role: "bot",
          text: "I'm not completely sure what you need. Is this about a transfer, card, recharge, bill, PIN or something else?",
          actions: [
            { label: "Transfers", target: "__cat:Transfers" }, { label: "Cards", target: "__cat:Cards" },
            { label: "Recharge", target: "__cat:Mobile Recharge" }, { label: "Bills", target: "__cat:Bills & Payments" },
            { label: "PIN & Login", target: "__cat:Login & Security" }, { label: "More Topics", target: "__more" },
          ],
        });
      } else {
        push({
          role: "bot",
          text: "I couldn't find a reliable answer. I can connect you with a human agent.",
          actions: [HUMAN_ACTION, { label: "Request Callback", target: "__callback" }, { label: "Report an Issue", target: "__case" }],
        });
      }
    }, 550);
  };

  /* ---------------- actions ---------------- */

  const runAction = (target: string) => {
    if (target === "__human") return escalate();
    if (target === "__call") return toast.show("Calling EBL 16230 (demo)");
    if (target === "__callback") { escalate(); return toast.show("Callback requested — an agent will call 016... (demo)"); }
    if (target === "__pay") return nav({ to: "/pay-transfer" });
    if (target === "__explore") return nav({ to: "/explore" });
    if (target === "__case") return setCaseSheet(true);
    if (target === "__cases") return toast.show("Your cases are listed below the chat");
    if (target === "__more") return setMore(true);
    if (target.startsWith("__cat:")) {
      const cat = target.slice(6) as KbCategory;
      push({
        role: "bot", text: `Here are the ${cat} topics I can help with.`,
        actions: topicsByCategory(cat).slice(0, 6).map((t) => ({ label: t.label, target: `__topic:${t.id}` })),
      });
      return;
    }
    if (target.startsWith("__topic:")) {
      const t = KB.find((x) => x.id === target.slice(8));
      if (t) { push({ role: "user", text: t.label }); answerTopic(t); }
      return;
    }
    if (target.startsWith("__quick:")) {
      const [, issue, txnId, detail] = target.split(":");
      setQuickCase({ issue: issue!, txnId: txnId!, detail: detail! });
      return;
    }
    nav({ to: "/service/$serviceId", params: { serviceId: target } });
  };

  /* ---------------- case creation ---------------- */

  const createCase = (issue: string, txnId: string, detail: string) => {
    const id = "CASE-" + Math.floor(100000 + Math.random() * 899999);
    patch({
      tickets: [{ id, category: issue, subject: issue, description: detail || chatSummary(), txnId: txnId || undefined, contact: "Mobile", status: "Submitted", date: "Today" }, ...state.tickets],
      notifications: [{ id: "N" + id, title: "Support case created", body: `${id} — ${issue}`, date: "Today", read: false, kind: "info" }, ...state.notifications],
    });
    setCaseSheet(false);
    setQuickCase(null);
    setDone({ id, issue });
    setForm({ issue: CASE_ISSUES[0]!, txnId: "", detail: "", attachment: false });
  };

  const txnOptions = state.transactions.slice(0, 8);

  /* ---------------- render ---------------- */

  return (
    <>
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
        {(["ai", "human"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cx("press rounded-xl py-2 text-[13.5px] font-medium", tab === t ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
            {t === "ai" ? "AI Assistant" : "Human Agent"}
          </button>
        ))}
      </div>

      {tab === "ai" ? (
        <SectionCard>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-tint-purple text-[13px] font-semibold">AI</span>
            <div>
              <p className="text-[15.5px] font-semibold text-primary">EBL AI Help</p>
              <p className="text-[12px] text-success">● Available</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {log.map((m) => (
              <div key={m.id} className={cx("max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13.5px]", m.role === "user" ? "ml-auto bg-brand-soft" : "bg-muted")}>
                <p>{m.text}</p>
                {m.steps && m.steps.length > 0 && (
                  <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-[13px] text-muted-foreground">
                    {m.steps.slice(0, 3).map((s) => <li key={s}>{s}</li>)}
                  </ol>
                )}
                {m.warn && <p className="mt-1.5 rounded-lg bg-tint-yellow px-2.5 py-1.5 text-[11.5px]">{NEVER_SHARE}</p>}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <button key={a.label + a.target} onClick={() => runAction(a.target)}
                        className="press rounded-lg bg-card px-2.5 py-1.5 text-[12px] font-medium text-primary">{a.label}</button>
                    ))}
                  </div>
                )}
                {m.feedback && (
                  <div className="mt-2 flex gap-3 text-[11.5px] text-muted-foreground">
                    <button className="press" onClick={() => toast.show("Thanks for the feedback")}>👍 Helpful</button>
                    <button className="press" onClick={() => push({
                      role: "bot", text: "Sorry that didn't help. Would you like a human agent to take a look?",
                      actions: [HUMAN_ACTION, { label: "More Topics", target: "__more" }],
                    })}>👎 Not Helpful</button>
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="w-16 rounded-2xl bg-muted px-3.5 py-2.5 text-[13.5px]">…</div>}
          </div>

          <div className="mt-3 flex gap-2">
            <TextInput value={input} placeholder="Type your question"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) ask(input.trim()); }} />
            <Button className="w-20" onClick={() => input.trim() && ask(input.trim())}>Send</Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {QUICK_CHIPS.slice(0, 6).map((c) => (
              <button key={c} onClick={() => ask(c)} className="press rounded-full border border-border px-2.5 py-1.5 text-[11.5px]">{c}</button>
            ))}
            <button onClick={() => setMore(true)} className="press rounded-full border border-brand bg-brand-soft px-2.5 py-1.5 text-[11.5px] font-medium">More Topics</button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setCaseSheet(true)}>Report an Issue</Button>
            <Button onClick={() => escalate()}>Talk to a Human</Button>
          </div>
        </SectionCard>
      ) : (
        <SectionCard>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-tint-green text-[13px] font-semibold">NA</span>
            <div>
              <p className="text-[15.5px] font-semibold text-primary">Human Agent</p>
              <p className={cx("text-[12px]", handoff === "queued" ? "text-muted-foreground" : "text-success")}>
                {handoff === "queued" ? "● Connecting you to a human agent…" : handoff === "live" ? "● Nusrat connected · avg wait 1 min" : "● Agents available 24/7"}
              </p>
            </div>
          </div>

          {(summary || handoff !== "none") && (
            <div className="mb-3 rounded-xl bg-muted p-3">
              <p className="mb-1 text-[12px] font-semibold text-primary">Issue summary</p>
              {editSummary ? (
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
                  className="min-h-20 w-full rounded-lg border border-border bg-card p-2 text-[12.5px] outline-none focus:border-brand" />
              ) : (
                <p className="whitespace-pre-line text-[12.5px] text-muted-foreground">{summary || chatSummary()}</p>
              )}
              <button className="press mt-1 text-[12px] text-primary" onClick={() => { if (!summary) setSummary(chatSummary()); setEditSummary(!editSummary); }}>
                {editSummary ? "Save summary" : "Edit summary"}
              </button>
            </div>
          )}

          {handoff === "live" && (
            <div className="mb-3 rounded-2xl bg-tint-green px-3.5 py-2.5 text-[13.5px]">
              Hi Mahin, I'm Nusrat from EBL Sky care. I can see your chat summary — no need to repeat anything.
            </div>
          )}

          <div className="grid gap-2">
            <Button onClick={() => escalate()}>Start Live Chat</Button>
            <Button variant="outline" onClick={() => toast.show("Callback requested (demo)")}>Request Callback</Button>
            <Button variant="outline" onClick={() => toast.show("Calling EBL 16230 (demo)")}>Call EBL · 16230</Button>
            <Button variant="outline" onClick={() => setCaseSheet(true)}>Create Support Case</Button>
            <Button variant="ghost" onClick={() => setTab("ai")}>Return to AI Assistant</Button>
          </div>
        </SectionCard>
      )}

      {/* Cases */}
      <SectionCard title="Your support cases">
        {state.tickets.map((t) => (
          <div key={t.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-medium">{t.subject}</p>
                <p className="text-[12px] text-muted-foreground">{t.id}{t.txnId ? ` · ${t.txnId}` : ""} · {t.date}</p>
              </div>
              <StatusBadge status={CASE_STATUS_LABEL[t.status] ?? t.status} />
            </div>
            <div className="mt-2 flex gap-3 text-[12px] text-primary">
              <button className="press" onClick={() => toast.show(`${t.id}: ${CASE_STATUS_LABEL[t.status] ?? t.status}`)}>View Update</button>
              <button className="press" onClick={() => { setForm({ issue: t.category, txnId: t.txnId ?? "", detail: "", attachment: false }); setCaseSheet(true); }}>Add Information</button>
              <button className="press" onClick={() => escalate(`Case ${t.id} — ${t.subject}`)}>Talk to Human</button>
            </div>
          </div>
        ))}
      </SectionCard>

      {/* More topics */}
      <Sheet open={more} onClose={() => setMore(false)} title="More topics">
        {KB_CATEGORIES.map((c) => (
          <div key={c} className="mb-2">
            <p className="mb-1 text-[12.5px] font-semibold text-primary">{c}</p>
            <div className="flex flex-wrap gap-1.5">
              {topicsByCategory(c).map((t) => (
                <button key={t.id} onClick={() => { setMore(false); setTab("ai"); push({ role: "user", text: t.label }); answerTopic(t); }}
                  className="press rounded-full border border-border px-2.5 py-1.5 text-[11.5px]">{t.label}</button>
              ))}
            </div>
          </div>
        ))}
      </Sheet>

      {/* Report an issue */}
      <Sheet open={caseSheet} onClose={() => setCaseSheet(false)} title="Report an issue">
        <div className="space-y-3">
          <FormField label="What is the issue?">
            <Select value={form.issue} onChange={(v) => setForm({ ...form, issue: v })} options={CASE_ISSUES} />
          </FormField>
          <FormField label="Related transaction (optional)">
            <Select value={form.txnId} onChange={(v) => setForm({ ...form, txnId: v })}
              options={["", ...txnOptions.map((t) => `${t.id} · ${t.title} · ${money(t.amount)}`)]} />
          </FormField>
          <div className="rounded-xl bg-muted p-3 text-[12.5px] text-muted-foreground">
            <p><span className="font-medium text-foreground">{state.user.name}</span> · {state.user.mobile}</p>
            <p>{state.accounts[0]?.masked}</p>
            <p className="mt-1 whitespace-pre-line">{chatSummary()}</p>
          </div>
          <FormField label="Add any extra details">
            <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })}
              className="min-h-20 w-full rounded-xl border border-border p-3 text-[14px] outline-none focus:border-brand" />
          </FormField>
          <button className="press w-full rounded-xl border border-dashed border-border py-3 text-[12.5px] text-muted-foreground"
            onClick={() => { setForm({ ...form, attachment: true }); toast.show("Attachment added (demo)"); }}>
            {form.attachment ? "Attachment added" : "Add one attachment (optional)"}
          </button>
          <Button onClick={() => createCase(form.issue, form.txnId.split(" ")[0] ?? "", form.detail)}>Submit</Button>
        </div>
      </Sheet>

      {/* One-tap confirmation */}
      <Sheet open={!!quickCase} onClose={() => setQuickCase(null)} title="Confirm report">
        {quickCase && (
          <div className="space-y-3">
            <div className="rounded-xl bg-muted p-3 text-[13px]">
              <p className="font-medium">{quickCase.issue}</p>
              <p className="mt-1 text-muted-foreground">{quickCase.detail}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">Transaction {quickCase.txnId} · {state.user.name} · {state.user.mobile}</p>
            </div>
            <Button onClick={() => createCase(quickCase.issue, quickCase.txnId ?? "", quickCase.detail)}>Confirm and submit</Button>
          </div>
        )}
      </Sheet>

      {/* Submitted */}
      <Sheet open={!!done} onClose={() => setDone(null)} title="Case submitted">
        {done && (
          <div className="space-y-3">
            <div className="rounded-xl bg-tint-green p-3 text-[13.5px]">
              <p className="font-semibold">{done.id}</p>
              <p className="text-muted-foreground">{done.issue} · Submitted · Today</p>
              <p className="mt-1 text-[12.5px]">Next step: our team reviews the case and updates you within 24 hours.</p>
            </div>
            <Button variant="outline" onClick={() => { setDone(null); escalate(`Case ${done.id} — ${done.issue}`); }}>Talk to Human</Button>
            <Button onClick={() => setDone(null)}>Done</Button>
          </div>
        )}
      </Sheet>

      <AuthenticationSheet open={!!auth} onClose={() => setAuth(null)} purpose="Verify to view account information"
        onSuccess={() => {
          setAuth(null);
          const a = state.accounts[0];
          if (a) push({ role: "bot", text: `Your ${a.name} (${a.masked}) balance is ${money(a.balance)}.`, actions: [{ label: "Open Accounts", target: "accounts" }], feedback: true });
        }} />
      {toast.node}
    </>
  );
}

/* ------------------------------------------------------------------ */

export function HelpPanel() {
  const nav = useNavigate();
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  return (
    <>
      <RecentComplaints />
      <SectionCard title="Help and Support">
        <ListRow icon="Headphones" tint="purple" title="EBL AI Help" subtitle="Instant answers, 24/7" onClick={() => go("ai-support")} />
        <ListRow icon="LifeBuoy" tint="blue" title="Report an issue" subtitle="Create a support case" onClick={() => go("ai-support")} />
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
