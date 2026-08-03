import { useState } from "react";
import { SectionCard, Button, FormField, Select, TextInput, StatusBadge, ListRow, useToast, cx } from "@/components/kit";
import { useApp, money, timeLabel } from "@/lib/store";
import { DISPUTE_ISSUES } from "@/lib/extras";
import type { Dispute } from "@/lib/types";

export function DisputesPanel({ txnId }: { txnId?: string | undefined }) {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const [creating, setCreating] = useState(!!txnId);
  const [form, setForm] = useState({
    txnId: txnId ?? "",
    issue: DISPUTE_ISSUES[0]!,
    description: "",
    contact: "Mobile",
    attachment: false,
  });

  const txn = state.transactions.find((t) => t.id === form.txnId || t.ref === form.txnId);

  const submit = () => {
    if (!form.txnId) return toast.show("Select a transaction");
    if (form.description.trim().length < 10) return toast.show("Describe the issue in a bit more detail");
    const id = "DSP-" + Math.floor(100000 + Math.random() * 899999);
    const dispute: Dispute = {
      id,
      txnId: form.txnId,
      txnTitle: txn?.title ?? "Transaction",
      amount: txn?.amount ?? 0,
      date: timeLabel(),
      issue: form.issue,
      description: form.description,
      contact: form.contact,
      attachment: form.attachment,
      status: "Submitted",
      expected: "Expected resolution within 5 working days",
      timeline: [{ stage: "Submitted", date: timeLabel(), note: "Dispute received and reference created." }],
    };
    patch({ disputes: [dispute, ...state.disputes] });
    notify("Dispute submitted", `${id} — ${form.issue}`, "info");
    setCreating(false);
    setForm({ txnId: "", issue: DISPUTE_ISSUES[0]!, description: "", contact: "Mobile", attachment: false });
    toast.show(`Dispute ${id} submitted`);
  };

  const advance = (d: Dispute) => {
    const order: Dispute["status"][] = ["Submitted", "Under Review", "Additional Information Required", "Resolved"];
    const next = order[Math.min(order.length - 1, order.indexOf(d.status) + 1)]!;
    const notes: Record<string, string> = {
      "Under Review": "Our team is checking the transaction with the partner.",
      "Additional Information Required": "Please share a screenshot or extra details.",
      Resolved: "Dispute resolved. Refund posted to your account where applicable.",
    };
    patch({
      disputes: state.disputes.map((x) =>
        x.id === d.id
          ? { ...x, status: next, timeline: [...x.timeline, { stage: next, date: timeLabel(), note: notes[next] ?? "Status updated." }] }
          : x,
      ),
    });
    toast.show(`${d.id} is now ${next}`);
  };

  return (
    <>
      {creating ? (
        <SectionCard title="Report an issue" subtitle="Tell us what went wrong with this transaction">
          <div className="space-y-3">
            <FormField label="Transaction">
              <Select
                value={form.txnId}
                onChange={(v) => setForm({ ...form, txnId: v })}
                placeholder="Select a transaction"
                options={state.transactions.slice(0, 20).map((t) => ({ value: t.id, label: `${t.title} · ${money(t.amount)} · ${t.date}` }))}
              />
            </FormField>
            <FormField label="Issue type">
              <Select value={form.issue} onChange={(v) => setForm({ ...form, issue: v })} options={DISPUTE_ISSUES} />
            </FormField>
            <FormField label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what happened"
                className="min-h-24 w-full rounded-xl border border-border p-3 text-[14px] outline-none focus:border-brand"
              />
            </FormField>
            <button
              onClick={() => { setForm({ ...form, attachment: !form.attachment }); toast.show(form.attachment ? "Attachment removed" : "Attachment added (demo)"); }}
              className={cx("press w-full rounded-xl border border-dashed py-4 text-[13px]",
                form.attachment ? "border-brand bg-brand-soft" : "border-border text-muted-foreground")}
            >
              {form.attachment ? "Screenshot attached" : "Add attachment"}
            </button>
            <FormField label="Preferred contact method">
              <Select value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} options={["Mobile", "Email", "In-app chat"]} />
            </FormField>
            <TextInput readOnly value="Expected resolution within 5 working days" />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              <Button onClick={submit}>Submit dispute</Button>
            </div>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Transaction disputes" subtitle="Track everything you have reported">
          <Button onClick={() => setCreating(true)}>Report a transaction issue</Button>
        </SectionCard>
      )}

      <SectionCard title="Your disputes" subtitle={`${state.disputes.length} cases`}>
        {state.disputes.map((d) => (
          <div key={d.id} className="border-b border-border py-3 last:border-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14.5px] font-medium">{d.txnTitle}</p>
                <p className="text-[12.5px] text-muted-foreground">{d.id} · {money(d.amount)} · {d.date}</p>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground">{d.issue}</p>
              </div>
              <StatusBadge status={d.status} />
            </div>

            <ol className="mt-3 space-y-2.5 border-l border-border pl-4">
              {d.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className={cx("absolute -left-[21px] top-1 size-2.5 rounded-full",
                    i === d.timeline.length - 1 ? "bg-brand" : "bg-muted")} />
                  <p className="text-[13.5px] font-medium">{t.stage}</p>
                  <p className="text-[12px] text-muted-foreground">{t.date} · {t.note}</p>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[12px] text-muted-foreground">{d.expected}</p>
            {d.status !== "Resolved" && d.status !== "Rejected" && (
              <button onClick={() => advance(d)} className="press mt-2 text-[12.5px] font-medium text-primary">
                Simulate next update
              </button>
            )}
          </div>
        ))}
        {state.disputes.length === 0 && <p className="py-6 text-center text-[13.5px] text-muted-foreground">No disputes reported.</p>}
      </SectionCard>

      <SectionCard title="Need more help?">
        <ListRow icon="Headphones" tint="purple" title="Chat with AI Support" subtitle="Ask about your dispute status" onClick={() => location.assign("/service/ai-support")} />
      </SectionCard>
      {toast.node}
    </>
  );
}
