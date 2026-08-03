import { useState } from "react";
import { Copy, Nfc, Share2 } from "lucide-react";
import { SectionCard, Button, StatusBadge, useToast, cx } from "@/components/kit";
import { useApp, timeLabel } from "@/lib/store";

export function AccountSharingPanel() {
  const { state, patch } = useApp();
  const toast = useToast();
  const [sel, setSel] = useState(state.accounts[0]?.id ?? "");
  const [nfcState, setNfcState] = useState<"idle" | "waiting" | "shared" | "unsupported">("idle");

  const account = state.accounts.find((a) => a.id === sel) ?? state.accounts[0];
  if (!account) return null;

  const text = `${state.user.name}\nEastern Bank PLC\nAccount: ${account.masked}\nType: ${account.type}\nBranch: Gulshan\nRouting: 095260726`;

  const record = (method: string) =>
    patch({
      nfcShares: [{ id: "SH" + Math.random().toString(36).slice(2), accountName: account.name, method, date: timeLabel() }, ...state.nfcShares],
    });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.show("Account details copied");
    } catch {
      toast.show("Copy not available — details shown below");
    }
    record("Copy");
  };

  const share = async () => {
    const n = navigator as Navigator & { share?: (d: { title: string; text: string }) => Promise<void> };
    if (n.share) {
      try {
        await n.share({ title: "My EBL account", text });
        record("Share sheet");
        toast.show("Account details shared");
        return;
      } catch { /* cancelled */ }
    }
    toast.show("Sharing not supported on this device");
  };

  const nfc = async () => {
    const w = window as Window & { NDEFReader?: new () => { write: (m: unknown) => Promise<void> } };
    if (!w.NDEFReader) {
      setNfcState("unsupported");
      toast.show("NFC is not available — showing simulation");
      setTimeout(() => { setNfcState("shared"); record("NFC (simulated)"); }, 1200);
      return;
    }
    setNfcState("waiting");
    try {
      const reader = new w.NDEFReader();
      await reader.write({ records: [{ recordType: "text", data: text }] });
      setNfcState("shared");
      record("NFC");
      toast.show("Account details sent over NFC");
    } catch {
      setNfcState("unsupported");
      toast.show("NFC write was blocked — showing simulation");
      setTimeout(() => { setNfcState("shared"); record("NFC (simulated)"); }, 1000);
    }
  };

  return (
    <>
      <SectionCard title="Share account details" subtitle="Choose which account to share">
        <div className="grid grid-cols-3 gap-2">
          {state.accounts.map((a) => (
            <button key={a.id} onClick={() => setSel(a.id)}
              className={cx("press rounded-xl border p-2.5 text-left", sel === a.id ? "border-brand bg-brand-soft" : "border-border")}>
              <p className="truncate text-[12.5px] font-medium">{a.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{a.masked}</p>
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-brand-soft p-3.5">
          <p className="text-[15px] font-semibold">{state.user.name}</p>
          <p className="text-[13px] text-muted-foreground">Eastern Bank PLC · Gulshan Branch</p>
          <p className="text-[13px] text-muted-foreground">Account {account.masked}</p>
          <p className="text-[13px] text-muted-foreground">Routing 095260726</p>
          <p className="mt-2 text-[12px] text-muted-foreground">Only masked details are shared, never your PIN or OTP.</p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button variant="outline" onClick={copy}>
            <span className="inline-flex items-center justify-center gap-1.5"><Copy className="size-4" /> Copy</span>
          </Button>
          <Button variant="outline" onClick={share}>
            <span className="inline-flex items-center justify-center gap-1.5"><Share2 className="size-4" /> Share</span>
          </Button>
          <Button variant="outline" onClick={nfc}>
            <span className="inline-flex items-center justify-center gap-1.5"><Nfc className="size-4" /> NFC</span>
          </Button>
        </div>

        {nfcState !== "idle" && (
          <div className="mt-3 rounded-2xl border border-border p-3.5 text-center">
            <Nfc className={cx("mx-auto size-8", nfcState === "waiting" && "animate-pulse")} />
            <p className="mt-2 text-[13.5px] font-medium">
              {nfcState === "waiting" ? "Hold your phone near the other device…"
                : nfcState === "shared" ? "Account details sent"
                  : "NFC not supported on this device"}
            </p>
            <p className="text-[12.5px] text-muted-foreground">
              {nfcState === "shared" ? "The receiver can save you as a beneficiary." : "This is a prototype simulation of NFC sharing."}
            </p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Sharing history" subtitle={`${state.nfcShares.length} shares`}>
        {state.nfcShares.map((s) => (
          <div key={s.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div>
              <p className="text-[14.5px] font-medium">{s.accountName}</p>
              <p className="text-[12.5px] text-muted-foreground">{s.method} · {s.date}</p>
            </div>
            <StatusBadge status="Shared" />
          </div>
        ))}
        {state.nfcShares.length === 0 && <p className="py-5 text-center text-[13.5px] text-muted-foreground">Nothing shared yet.</p>}
      </SectionCard>
      {toast.node}
    </>
  );
}
