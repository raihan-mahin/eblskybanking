import { useState } from "react";
import { BadgeCheck, Search } from "lucide-react";
import { SectionCard, FormField, TextInput, Button, ListRow, cx } from "@/components/kit";
import { TxnFlow } from "@/components/TxnFlow";
import { lookupMobile, maskAccount, maskMobile, RECIPIENT_DIRECTORY, type DirectoryEntry } from "@/lib/extras";
import { useApp } from "@/lib/store";

export function PhoneTransferPanel({ initialMobile }: { initialMobile?: string | undefined }) {
  const { state } = useApp();
  const [mobile, setMobile] = useState(initialMobile ?? "");
  const [status, setStatus] = useState<"idle" | "searching" | "found" | "missing">("idle");
  const [match, setMatch] = useState<DirectoryEntry | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const clean = mobile.replace(/[^0-9]/g, "");
  const valid = /^01[3-9]\d{8}$/.test(clean);

  const search = () => {
    if (!valid) { setStatus("missing"); setMatch(null); return; }
    setStatus("searching");
    setTimeout(() => {
      const hit = lookupMobile(clean);
      setMatch(hit);
      setStatus(hit ? "found" : "missing");
    }, 500);
  };

  if (confirmed && match) {
    return (
      <TxnFlow
        serviceId="fund-transfer"
        title={`Send to ${match.name}`}
        category="Transfer"
        intro={`${match.bank} · ${maskAccount(match.account)}`}
        banner={`Verified recipient · ${maskMobile(match.mobile)}`}
        fields={[
          { key: "recipient", label: "Recipient", type: "text", placeholder: "Recipient name" },
          { key: "mobile", label: "Mobile number", type: "text", placeholder: "01XXXXXXXXX" },
          { key: "bank", label: "Bank", type: "text", placeholder: "Bank name" },
          { key: "account", label: "Account", type: "text", placeholder: "Account" },
        ]}
        initialValues={{
          recipient: match.name,
          mobile: maskMobile(match.mobile),
          bank: match.bank,
          account: maskAccount(match.account),
        }}
      />
    );
  }

  const recents = state.recentEntities.filter((r) => r.prefill["mobile"]).slice(0, 4);

  return (
    <>
      <SectionCard title="Send by mobile number" subtitle="We find the linked account for you">
        <FormField label="Recipient mobile number" hint="Bangladesh numbers only · 11 digits">
          <TextInput
            inputMode="numeric"
            value={mobile}
            placeholder="01XXXXXXXXX"
            onChange={(e) => { setMobile(e.target.value); setStatus("idle"); setMatch(null); }}
          />
        </FormField>
        {!valid && mobile.length > 0 && (
          <p className="text-[12.5px] text-destructive">Enter a valid 11-digit Bangladesh mobile number.</p>
        )}
        <div className="mt-3">
          <Button onClick={search} disabled={!valid || status === "searching"}>
            <span className="inline-flex items-center justify-center gap-2">
              <Search className="size-4" /> {status === "searching" ? "Looking up account…" : "Find recipient"}
            </span>
          </Button>
        </div>

        {status === "found" && match && (
          <div className="mt-4 rounded-2xl border border-brand bg-brand-soft p-3.5">
            <div className="flex items-center gap-2">
              <p className="text-[16px] font-semibold">{match.name}</p>
              {match.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2 py-0.5 text-[11.5px] font-medium text-success">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{match.bank} · {match.accountType}</p>
            <p className="text-[13px] text-muted-foreground">Account {maskAccount(match.account)}</p>
            <p className="text-[13px] text-muted-foreground">Mobile {maskMobile(match.mobile)}</p>
            <p className="mt-2 text-[12px] text-muted-foreground">
              Account details are masked for privacy. Confirm the name before sending.
            </p>
            <div className="mt-3">
              <Button onClick={() => setConfirmed(true)}>Confirm recipient &amp; continue</Button>
            </div>
          </div>
        )}

        {status === "missing" && (
          <div className="mt-4 rounded-2xl bg-tint-yellow p-3.5">
            <p className="text-[13.5px] font-medium">No linked account found</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              This number is not linked to a bank account in the demo directory. Try another number or send using an account number.
            </p>
          </div>
        )}
      </SectionCard>

      {recents.length > 0 && (
        <SectionCard title="Recent recipients">
          {recents.map((r) => (
            <ListRow
              key={r.id}
              icon={r.icon}
              tint={r.tint}
              title={r.entity}
              subtitle={r.masked}
              onClick={() => { setMobile(r.prefill["mobile"]!); setStatus("idle"); setMatch(null); }}
            />
          ))}
        </SectionCard>
      )}

      <SectionCard title="Directory shortcuts" subtitle="Demo numbers you can try">
        <div className={cx("grid grid-cols-3 gap-2")}>
          {RECIPIENT_DIRECTORY.slice(0, 6).map((d) => (
            <button
              key={d.mobile}
              onClick={() => { setMobile(d.mobile); setStatus("idle"); setMatch(null); }}
              className="press rounded-xl border border-border p-2.5 text-left"
            >
              <p className="truncate text-[12.5px] font-medium">{d.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{maskMobile(d.mobile)}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
