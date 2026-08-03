import { useState } from "react";
import { Search, User } from "lucide-react";
import { Sheet, Button, TextInput, FormField } from "./kit";
import { maskMobile } from "@/lib/extras";

/** Prototype-only local contacts, used when the device picker is unavailable. */
export const MOCK_CONTACTS: { name: string; numbers: string[] }[] = [
  { name: "Rahim", numbers: ["01712 345678", "01677889900"] },
  { name: "Arnav", numbers: ["01812 456789"] },
  { name: "Taslim", numbers: ["01912 567890"] },
  { name: "Suddhi", numbers: ["01612 678901"] },
  { name: "Wasif", numbers: ["01512 789012"] },
];

/** +8801712345678 / 8801712345678 / 017-1234 5678 → 01712345678 */
export function normalizeBdMobile(input: string): string {
  let d = input.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  d = d.replace(/\D/g, "");
  if (d.startsWith("880")) d = "0" + d.slice(3);
  else if (d.length === 10 && d.startsWith("1")) d = "0" + d;
  return d;
}

export const isValidBdMobile = (n: string) => /^01[3-9]\d{8}$/.test(n);

interface Picked { name: string; number: string }

export function ContactPicker({
  open, onClose, onPick,
}: {
  open: boolean; onClose: () => void; onPick: (p: Picked) => void;
}) {
  const [q, setQ] = useState("");
  const [manual, setManual] = useState("");
  const [numbersOf, setNumbersOf] = useState<{ name: string; numbers: string[] } | null>(null);
  const [error, setError] = useState("");

  const close = () => { setQ(""); setManual(""); setNumbersOf(null); setError(""); onClose(); };

  const choose = (name: string, raw: string) => {
    const n = normalizeBdMobile(raw);
    if (!isValidBdMobile(n)) { setError("Please select a valid Bangladesh mobile number."); return; }
    setError("");
    onPick({ name, number: n });
    close();
  };

  const list = MOCK_CONTACTS.filter(
    (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.numbers.some((n) => n.includes(q.replace(/\D/g, ""))),
  );

  return (
    <Sheet open={open} onClose={close} title={numbersOf ? `${numbersOf.name} — select a number` : "Select from Contacts"}>
      {numbersOf ? (
        <div className="space-y-2">
          {numbersOf.numbers.map((n) => (
            <button key={n} onClick={() => choose(numbersOf.name, n)}
              className="press flex w-full items-center justify-between rounded-xl border border-border p-3.5 text-left">
              <span className="text-[14.5px]">{n}</span>
              <span className="text-[12px] text-muted-foreground">{maskMobile(normalizeBdMobile(n))}</span>
            </button>
          ))}
          {error && <p className="text-[13px] text-error">{error}</p>}
          <Button variant="ghost" onClick={() => { setNumbersOf(null); setError(""); }}>Back to contacts</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="rounded-xl bg-tint-yellow px-3.5 py-2.5 text-[12.5px]">
            Device contacts are unavailable in this browser.
          </p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <TextInput value={q} placeholder="Search contacts" className="pl-9" onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="space-y-2">
            {list.map((c) => (
              <button key={c.name}
                onClick={() => (c.numbers.length > 1 ? setNumbersOf(c) : choose(c.name, c.numbers[0]!))}
                className="press flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left">
                <span className="grid size-9 place-items-center rounded-full bg-tint-yellow">
                  <User className="size-4 text-accent" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[14.5px] font-medium">{c.name}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {c.numbers.length > 1 ? `${c.numbers.length} numbers` : c.numbers[0]}
                  </span>
                </span>
              </button>
            ))}
            {list.length === 0 && <p className="py-4 text-center text-[13.5px] text-muted-foreground">No contacts found.</p>}
          </div>
          <FormField label="Or enter a number manually">
            <TextInput inputMode="numeric" value={manual} placeholder="01XXXXXXXXX"
              onChange={(e) => { setManual(e.target.value); setError(""); }} />
          </FormField>
          {error && <p className="text-[13px] text-error">{error}</p>}
          <Button onClick={() => choose("", manual)}>Use this number</Button>
          <Button variant="ghost" onClick={close}>Cancel</Button>
        </div>
      )}
    </Sheet>
  );
}

/** Opens the device contact picker when supported, otherwise resolves null. */
export async function pickDeviceContact(): Promise<{ name: string; numbers: string[] } | null> {
  const nav = navigator as Navigator & {
    contacts?: { select: (props: string[], opts?: { multiple?: boolean }) => Promise<Array<{ name?: string[]; tel?: string[] }>> };
  };
  if (!nav.contacts?.select) return null;
  try {
    const res = await nav.contacts.select(["name", "tel"], { multiple: false });
    const c = res?.[0];
    if (!c) return null;
    return { name: c.name?.[0] ?? "", numbers: (c.tel ?? []).filter(Boolean) };
  } catch {
    return null;
  }
}
