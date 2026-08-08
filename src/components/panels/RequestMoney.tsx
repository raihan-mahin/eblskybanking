import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, SearchField, FormField, TextInput, AmountInput, StatusBadge, SegmentedTabs, useToast, Toast } from "@/components/kit";
import { Icon } from "@/components/Icon";
import { EBL_DIRECTORY } from "@/lib/seed";
import { useApp, money, timeLabel } from "@/lib/store";
import type { MoneyRequest } from "@/lib/types";

interface Candidate {
  name: string;
  account: string;
  mobile?: string | undefined;
  ebl: boolean;
}

const digits = (v: string) => v.replace(/\D/g, "");

export function RequestMoneyPanel() {
  const nav = useNavigate();
  const { state, patch, notify } = useApp();
  const { message: toastMsg, show } = useToast();

  const [tab, setTab] = useState("new");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"pick" | "amount" | "review" | "done">("pick");

  const requests = state.moneyRequests ?? [];
  const incoming = requests.filter((r) => r.direction === "incoming" && r.status === "Pending");

  /* EBL users the prototype knows about: saved EBL beneficiaries + registered mobiles. */
  const candidates: Candidate[] = [
    ...state.beneficiaries.map((b) => ({
      name: b.name,
      account: b.account,
      mobile: EBL_DIRECTORY.find((d) => d.name === b.name)?.mobile,
      ebl: b.kind === "ebl" || b.kind === "own",
    })),
    ...EBL_DIRECTORY.filter((d) => !state.beneficiaries.some((b) => b.name === d.name)).map((d) => ({
      name: d.name, account: d.account, mobile: d.mobile, ebl: true,
    })),
  ];

  const term = q.trim().toLowerCase();
  const filtered = term
    ? candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.mobile && digits(c.mobile).includes(digits(term))) ||
        digits(c.account).includes(digits(term)),
    )
    : candidates;

  const select = (c: Candidate) => {
    if (!c.ebl) {
      setPicked(null);
      setError("Request Money is currently available only for EBL users.");
      return;
    }
    setError(null);
    setPicked(c);
    setStep("amount");
  };

  const send = () => {
    const req: MoneyRequest = {
      id: "MR" + Math.floor(100000 + Math.random() * 899999),
      direction: "outgoing",
      name: picked!.name,
      account: picked!.account,
      ...(picked!.mobile ? { mobile: picked!.mobile } : {}),
      amount: Number(amount),
      ...(note.trim() ? { note: note.trim() } : {}),
      status: "Pending",
      date: timeLabel(),
    };
    patch({ moneyRequests: [req, ...requests] });
    notify("Request sent", `${picked!.name} — ${money(req.amount)}`);
    setStep("done");
  };

  const setStatus = (id: string, status: MoneyRequest["status"]) =>
    patch({ moneyRequests: requests.map((r) => (r.id === id ? { ...r, status } : r)) });

  const payNow = (r: MoneyRequest) => {
    nav({ to: "/service/$serviceId", params: { serviceId: "fund-transfer" }, search: { req: r.id } });
  };

  const reset = () => {
    setPicked(null); setAmount(""); setNote(""); setQ(""); setStep("pick");
  };

  /* ---------------- Success ---------------- */
  if (step === "done") {
    return (
      <SectionCard title="Request Sent">
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-tint-green">
            <Icon name="Check" className="size-7 text-foreground" />
          </span>
          <p className="text-[20px] font-semibold">{money(Number(amount))}</p>
          <p className="text-[13.5px] text-muted-foreground">Requested from {picked?.name}</p>
          {note && <p className="text-[12.5px] text-muted-foreground">“{note}”</p>}
          <StatusBadge status="Pending" />
        </div>
        <div className="space-y-2 pt-2">
          <Button onClick={() => { reset(); setTab("requests"); }}>View Requests</Button>
          <Button variant="outline" onClick={reset}>New Request</Button>
        </div>
      </SectionCard>
    );
  }

  /* ---------------- Review ---------------- */
  if (step === "review" && picked) {
    return (
      <SectionCard title="Review Request">
        <div className="space-y-2 pb-3 text-[14px]">
          <Row label="Request From" value={picked.name} />
          <Row label="EBL Account" value={picked.account} />
          {picked.mobile && <Row label="Mobile" value={picked.mobile} />}
          <Row label="Amount" value={money(Number(amount))} />
          {note && <Row label="Note" value={note} />}
        </div>
        <div className="space-y-2">
          <Button onClick={send}>Send Request</Button>
          <Button variant="outline" onClick={() => setStep("amount")}>Back</Button>
        </div>
      </SectionCard>
    );
  }

  /* ---------------- Amount ---------------- */
  if (step === "amount" && picked) {
    return (
      <SectionCard title="Request Amount" subtitle={`${picked.name} · ${picked.account}`}>
        <div className="space-y-3">
          <AmountInput value={amount} onChange={setAmount} presets={[500, 1000, 2000, 5000]} />
          <FormField label="Note (optional)">
            <TextInput value={note} maxLength={80} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Dinner share" />
          </FormField>
          <Button disabled={!amount || Number(amount) <= 0} onClick={() => setStep("review")}>Review Request</Button>
          <Button variant="outline" onClick={() => { setPicked(null); setStep("pick"); }}>Change Person</Button>
        </div>
      </SectionCard>
    );
  }

  /* ---------------- Pick person + history ---------------- */
  return (
    <>
      <SegmentedTabs
        tabs={[{ id: "new", label: "New Request" }, { id: "requests", label: `Requests${incoming.length ? ` (${incoming.length})` : ""}` }]}
        value={tab}
        onChange={setTab}
      />

      {tab === "new" ? (
        <SectionCard title="Select EBL User" subtitle="Request Money works only between EBL users">
          <div className="pb-2">
            <SearchField value={q} onChange={(v) => { setQ(v); setError(null); }} placeholder="Search name or mobile number" />
          </div>
          {error && (
            <p className="mb-2 rounded-xl bg-tint-pink px-3 py-2 text-[12.5px] font-medium text-foreground">{error}</p>
          )}
          {filtered.length === 0 ? (
            <p className="py-3 text-[13px] text-muted-foreground">No matching person found.</p>
          ) : (
            filtered.map((c) => (
              <ListRow
                key={c.name + c.account}
                icon={c.ebl ? "UserPlus" : "Users"}
                tint={c.ebl ? "green" : "gray"}
                title={c.name}
                subtitle={c.ebl ? `EBL · ${c.mobile ?? c.account}` : "Not an EBL user"}
                onClick={() => select(c)}
              />
            ))
          )}
        </SectionCard>
      ) : (
        <>
          <SectionCard title="Incoming Requests">
            {incoming.length === 0 ? (
              <p className="py-2 text-[13px] text-muted-foreground">No pending requests.</p>
            ) : (
              incoming.map((r) => (
                <div key={r.id} className="border-b border-border py-3 last:border-0">
                  <p className="text-[14.5px] font-medium">{r.name} requested {money(r.amount)}</p>
                  {r.note && <p className="text-[12.5px] text-muted-foreground">“{r.note}”</p>}
                  <p className="text-[11.5px] text-muted-foreground">{r.date}</p>
                  <div className="mt-2 flex gap-2">
                    <Button className="py-2.5" onClick={() => payNow(r)}>Pay Now</Button>
                    <Button className="py-2.5" variant="outline"
                      onClick={() => { setStatus(r.id, "Declined"); show("Request declined"); }}>
                      Decline
                    </Button>
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          <SectionCard title="Request History">
            {requests.length === 0 ? (
              <p className="py-2 text-[13px] text-muted-foreground">No requests yet.</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                  <div>
                    <p className="text-[14px] font-medium">
                      {r.direction === "incoming" ? `${r.name} requested you` : `You requested ${r.name}`}
                    </p>
                    <p className="text-[11.5px] text-muted-foreground">{r.date} · {money(r.amount)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            )}
          </SectionCard>
        </>
      )}
      <Toast message={toastMsg} />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
