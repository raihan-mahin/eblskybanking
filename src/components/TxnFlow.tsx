import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Download, Share2, Repeat } from "lucide-react";
import { Button, FormField, TextInput, Select, AmountInput, SectionCard, ErrorState, cx } from "./kit";
import { AuthenticationSheet } from "./AuthenticationSheet";
import { useApp, money, pointsFor } from "@/lib/store";

export interface FieldDef {
  key: string;
  label: string;
  type: "select" | "text" | "date" | "tiles";
  options?: string[];
  placeholder?: string;
  optional?: boolean;
  hint?: string;
}

export interface TxnFlowProps {
  serviceId: string;
  title: string;
  category: string;
  fields?: FieldDef[];
  fee?: number;
  amountPresets?: number[];
  fixedAmount?: number;
  forceOtp?: boolean;
  submitLabel?: string;
  intro?: string;
  onDone?: (amount: number, values: Record<string, string>) => void;
}

export function TxnFlow(p: TxnFlowProps) {
  const { state, commitTxn, notify } = useApp();
  const nav = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState(p.fixedAmount ? String(p.fixedAmount) : "");
  const [note, setNote] = useState("");
  const [accountId, setAccountId] = useState(state.accounts[0].id);
  const [stage, setStage] = useState<"form" | "review" | "done" | "error">("form");
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ ref: string; amount: number; points: number } | null>(null);

  const fields = p.fields ?? [];
  const fee = p.fee ?? 0;
  const amt = Number(amount || 0);
  const account = state.accounts.find((a) => a.id === accountId)!;
  const points = pointsFor(p.category, amt);
  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const validate = () => {
    for (const f of fields) if (!f.optional && !values[f.key]) return `${f.label} is required.`;
    if (!amt || amt <= 0) return "Enter a valid amount greater than zero.";
    if (amt + fee > account.balance) return "Insufficient balance in the selected account.";
    const mobileField = fields.find((f) => f.key.includes("mobile") || f.key.includes("wallet"));
    if (mobileField && values[mobileField.key] && !/^01[3-9]\d{2}-?\d{6}$/.test(values[mobileField.key].replace(/\s/g, "")))
      return "Enter a valid Bangladesh mobile number (e.g. 01712-345678).";
    return "";
  };

  const goReview = () => {
    const err = validate();
    if (err) { setError(err); setStage("error"); return; }
    setError(""); setStage("review");
  };

  const complete = () => {
    const target = fields.map((f) => values[f.key]).filter(Boolean).join(" · ");
    const ref = "EBL" + Math.floor(100000000 + Math.random() * 899999999);
    commitTxn({
      title: `${p.title}${target ? " — " + target : ""}`,
      serviceId: p.serviceId, category: p.category, amount: amt, fee, accountId, note, meta: values,
    });
    setReceipt({ ref, amount: amt, points });
    p.onDone?.(amt, values);
    setStage("done");
  };

  if (stage === "done" && receipt) {
    return (
      <div className="space-y-3">
        <div className="app-card p-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-tint-green">
            <Check className="size-8 text-success" />
          </div>
          <h2 className="mt-3 text-[20px] font-semibold">Payment successful</h2>
          <p className="text-[13.5px] text-muted-foreground">{p.title}</p>
          <p className="mt-3 text-[30px] font-semibold">{money(receipt.amount)}</p>
          {points > 0 && <p className="mt-1 text-[13px] text-success">+{points} Reward Points earned.</p>}
          <dl className="mt-4 space-y-2 text-left text-[13px]">
            {fields.map((f) => values[f.key] && (
              <Row key={f.key} k={f.label} v={values[f.key]} />
            ))}
            <Row k="From" v={account.name} />
            {fee > 0 && <Row k="Fee" v={money(fee)} />}
            <Row k="Transaction ID" v={receipt.ref} />
            <Row k="Status" v="Success" />
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => notify("Receipt downloaded", `${p.title} receipt saved to your device.`)}>
            <span className="inline-flex items-center gap-2 justify-center"><Download className="size-4" /> Download</span>
          </Button>
          <Button variant="outline" onClick={() => notify("Receipt shared", `${p.title} receipt shared.`)}>
            <span className="inline-flex items-center gap-2 justify-center"><Share2 className="size-4" /> Share</span>
          </Button>
        </div>
        <Button variant="outline" onClick={() => { setStage("form"); setReceipt(null); }}>
          <span className="inline-flex items-center gap-2 justify-center"><Repeat className="size-4" /> Repeat Transaction</span>
        </Button>
        <Button onClick={() => nav({ to: "/home" })}>Done</Button>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <ErrorState
        message={error}
        onRetry={() => setStage("form")}
        onSupport={() => nav({ to: "/service/$serviceId", params: { serviceId: "ai-support" } })}
        onCancel={() => nav({ to: "/home" })}
      />
    );
  }

  if (stage === "review") {
    return (
      <>
        <SectionCard title="Review details">
          <dl className="space-y-2 text-[13.5px]">
            {fields.map((f) => values[f.key] && <Row key={f.key} k={f.label} v={values[f.key]} />)}
            <Row k="From account" v={`${account.name} · ${account.masked}`} />
            <Row k="Amount" v={money(amt)} />
            {fee > 0 && <Row k="Fee" v={money(fee)} />}
            <Row k="Total" v={money(amt + fee)} />
            {note && <Row k="Note" v={note} />}
          </dl>
          {points > 0 && (
            <p className="mt-3 rounded-xl bg-tint-yellow p-3 text-[13px]">
              You will earn approximately {points} Reward Points.
            </p>
          )}
          <p className="mt-2 text-[12px] text-muted-foreground">
            {amt > 5000 ? "Amounts above ৳5,000 require OTP" : "One-tap available up to ৳5,000"}
          </p>
          <div className="mt-4 space-y-2">
            <Button onClick={() => setAuth(true)}>Confirm & Pay {money(amt + fee)}</Button>
            <Button variant="ghost" onClick={() => setStage("form")}>Edit details</Button>
          </div>
        </SectionCard>
        <AuthenticationSheet
          open={auth} amount={amt} forceOtp={p.forceOtp}
          onClose={() => setAuth(false)}
          onSuccess={() => { setAuth(false); complete(); }}
        />
      </>
    );
  }

  return (
    <SectionCard title={p.title} subtitle={p.intro ?? "Enter your details below"}>
      <div className="space-y-3.5">
        <FormField label="Pay From">
          <Select value={accountId} onChange={setAccountId}
            options={state.accounts.map((a) => ({ value: a.id, label: `${a.name} · ${a.masked}` }))}
            placeholder="Select account or card" />
          <p className="mt-1 text-[12px] text-muted-foreground">
            {account.name} · {account.masked} · {money(account.balance)}
          </p>
        </FormField>

        {fields.map((f) =>
          f.type === "tiles" ? (
            <div key={f.key}>
              <p className="mb-2 text-[13px] font-medium text-muted-foreground">{f.label}</p>
              <div className="grid grid-cols-3 gap-2">
                {(f.options ?? []).map((o) => (
                  <button key={o} onClick={() => set(f.key, o)}
                    className={cx(
                      "press rounded-xl border p-3 text-[13px] font-medium",
                      values[f.key] === o ? "border-brand bg-brand-soft" : "border-border",
                    )}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <FormField key={f.key} label={f.label} hint={f.hint}>
              {f.type === "select" ? (
                <Select value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} options={f.options ?? []} placeholder={f.placeholder} />
              ) : (
                <TextInput type={f.type === "date" ? "date" : "text"} value={values[f.key] ?? ""}
                  placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </FormField>
          ),
        )}

        <FormField label="Amount">
          {p.fixedAmount ? (
            <TextInput value={money(p.fixedAmount)} readOnly />
          ) : (
            <AmountInput value={amount} onChange={setAmount} presets={p.amountPresets} />
          )}
        </FormField>

        <FormField label="Note (optional)">
          <TextInput value={note} placeholder="Add a note" onChange={(e) => setNote(e.target.value)} />
        </FormField>

        {fee > 0 && <p className="text-[12.5px] text-muted-foreground">Service fee: {money(fee)}</p>}
        <div className="rounded-xl bg-tint-yellow px-3.5 py-2.5 text-[12.5px]">One-tap available up to ৳5,000</div>
        <div className="rounded-xl bg-tint-blue px-3.5 py-2.5 text-[12.5px]">Amounts above ৳5,000 require OTP</div>

        <Button onClick={goReview}>{p.submitLabel ?? "Next"}</Button>
      </div>
    </SectionCard>
  );
}

export function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
