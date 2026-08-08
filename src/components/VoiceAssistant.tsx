import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Mic } from "lucide-react";
import { Sheet, Button, TextInput, cx } from "./kit";
import { useApp, money } from "@/lib/store";
import { searchServices } from "@/lib/services";
import type { AppState } from "@/lib/types";
import { extractNameQuery, resolveSpokenBeneficiary } from "@/lib/beneficiaryMatch";

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";

const maskAccount = (account: string) => {
  const clean = account.replace(/\s|-/g, "");
  return clean.length <= 4 ? clean : `•••• ${clean.slice(-4)}`;
};

const kindLabel = (kind: string) =>
  kind === "mfs" ? "Mobile wallet" : kind === "other" ? "Other bank" : kind === "own" ? "Own account" : "EBL";

const COMMANDS: { phrase: string; label: string }[] = [
  { phrase: "open fund transfer", label: "Open Fund Transfer" },
  { phrase: "open split pay", label: "Open Split Pay" },
  { phrase: "pay electricity bill", label: "Pay Electricity Bill" },
  { phrase: "open recharge", label: "Open Recharge" },
  { phrase: "open rewards", label: "Open Rewards" },
  { phrase: "show recent transactions", label: "Show Recent Transactions" },
  { phrase: "read my balance", label: "Read My Balance" },
  { phrase: "explain this page", label: "Explain This Page" },
  { phrase: "open ai support", label: "Open AI Support" },
  { phrase: "turn on high contrast", label: "Turn On High Contrast" },
  { phrase: "increase text size", label: "Increase Text Size" },
  { phrase: "go back", label: "Go Back" },
];

/** Normalize speech: lowercase, strip punctuation, collapse spaces, drop filler verbs. */
const normalizeSpeech = (raw: string) =>
  raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const stripLeadIn = (q: string) =>
  q.replace(/^(please\s+)?(can you\s+|could you\s+)?(go to|take me to|navigate to|show me|show|open up|open|launch|start)\s+/, "").trim();

/** Every visible suggestion maps to one of these intents, so spoken = tapped. */
const INTENTS: { test: RegExp; run: (ctx: IntentCtx) => void }[] = [
  { test: /\b(fund transfer|transfer money|send money|money transfer|bank transfer|fund transfers)\b|^transfer$/, run: (c) => c.goService("fund-transfer") },
  { test: /\b(split pay|split bill|split payment)\b/, run: (c) => c.goService("split-pay") },
  { test: /\b(electricity|desco|dpdc)\b/, run: (c) => c.goService("bill-electricity") },
  { test: /\b(gas bill)\b/, run: (c) => c.goService("bill-gas") },
  { test: /\b(water bill)\b/, run: (c) => c.goService("bill-water") },
  { test: /\b(recharge|top up|topup|airtime)\b/, run: (c) => c.goService("recharge") },
  { test: /\b(reward|rewards|points|loyalty)\b/, run: (c) => c.goService("rewards") },
  { test: /\b(recent transactions|transaction history|transfer history|statement|recent)\b/, run: (c) => c.goService("transaction-history") },
  { test: /\b(ai support|support|helpline|help|customer care)\b/, run: (c) => c.goService("ai-support") },
  { test: /\b(mfs|bkash|nagad|rocket|upay|mobile wallet)\b/, run: (c) => c.goService("mfs-transfer") },
  { test: /\b(qr)\b/, run: (c) => c.goService("qr-payment") },
];

interface IntentCtx { goService: (id: string) => void }

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [listening, setListening] = useState(false);
  const [matches, setMatches] = useState<AppState["beneficiaries"]>([]);
  const { state, patch } = useApp();
  const nav = useNavigate();

  const goService = (id: string) => { setOpen(false); nav({ to: "/service/$serviceId", params: { serviceId: id } }); };

  const openBeneficiary = (b: { id: string; kind: string }) => {
    setOpen(false);
    setMatches([]);
    const serviceId = b.kind === "mfs" ? "mfs-transfer" : b.kind === "other" ? "other-bank-transfer" : "fund-transfer";
    nav({ to: "/service/$serviceId", params: { serviceId }, search: { ben: b.id } });
  };

  const run = (raw: string) => {
    const q = normalizeSpeech(raw);
    setText("");
    setMatches([]);

    // Saved beneficiaries: voice shortcut into the existing transfer flow.
    const tryBeneficiary = () => {
      const nameQuery = extractNameQuery(q);
      if (nameQuery.length < 2) return false;
      const result = resolveSpokenBeneficiary(q, state.beneficiaries);
      if (result.kind === "one") {
        setReply(`Found ${result.item.name}. Opening the transfer screen — enter the amount to continue.`);
        openBeneficiary(result.item);
        return true;
      }
      if (result.kind === "many") {
        setMatches(result.items);
        setReply(`I found ${result.items.length} saved beneficiaries that sound like “${nameQuery}”. Which one did you mean?`);
        return true;
      }
      return false;
    };

    // An explicit transfer intent should reach beneficiaries before generic keywords.
    if (/\b(send|transfer|pay|money to|open)\b/.test(q) && tryBeneficiary()) return;

    if (q.includes("balance")) return setReply(`Your EBL Savings Account balance is ${money(state.accounts[0].balance)}.`);
    if (q.includes("high contrast")) { patch({ accessibility: { ...state.accessibility, contrast: true } }); return setReply("High contrast is now on."); }
    if (q.includes("text size")) {
      const next = state.accessibility.textSize === "normal" ? "large" : "xlarge";
      patch({ accessibility: { ...state.accessibility, textSize: next } });
      return setReply(`Text size set to ${next}.`);
    }
    if (q.includes("go back")) { setOpen(false); return history.back(); }
    if (q.includes("explain")) return setReply("This screen belongs to EBL Sky Banking. Use the bottom navigation for Home, My Banking, QR and Explore, and tap any tile to open a full flow.");

    // Shared intent map — same actions the visible suggestion chips run.
    const stripped = stripLeadIn(q);
    const intent = INTENTS.find((i) => i.test.test(q) || i.test.test(stripped));
    if (intent) return intent.run({ goService });

    if (tryBeneficiary()) return;

    const hit = searchServices(stripLeadIn(q))[0];
    if (hit) return goService(hit.id);

    setReply("I could not match that command. Try one of the suggestions below.");
  };



  const listen = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return setReply("Speech recognition is not supported on this browser. Please type your command below.");
    const r = new SR();
    r.lang = "en-US";
    setListening(true);
    r.onresult = (e: any) => { setListening(false); run(e.results[0][0].transcript); };
    r.onerror = () => { setListening(false); setReply("Could not hear that. Please type your command."); };
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="AI Voice Assistant"
        className="press fixed bottom-24 left-1/2 z-40 ml-[152px] grid size-12 -translate-x-1/2 place-items-center rounded-full bg-accent text-white shadow-lg"
      >
        <Mic className="size-5" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="AI Voice Assistant">
        <div className="text-center">
          <button onClick={listen}
            className={cx("press mx-auto grid size-20 place-items-center rounded-full bg-tint-yellow", listening && "animate-pulse")}>
            <Mic className="size-8 text-accent" />
          </button>
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            {listening ? "Listening…" : "Tap to speak, or type your command"}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <TextInput value={text} placeholder="e.g. Open Fund Transfer" onChange={(e) => setText(e.target.value)} />
          <Button className="w-24" onClick={() => run(text)}>Run</Button>
        </div>
        {reply && <p className="mt-3 rounded-xl bg-tint-blue p-3 text-[13.5px]">{reply}</p>}
        {matches.length > 0 && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-heading">Select a beneficiary</p>
              <button onClick={() => { setMatches([]); setReply("Okay, cancelled. Try saying the full name."); }}
                className="press text-[12.5px] text-muted-foreground">Cancel</button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              {matches.map((b) => (
                <button key={b.id} onClick={() => openBeneficiary(b)}
                  className="press flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-tint-yellow text-[12.5px] font-semibold text-accent">
                    {initials(b.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-medium">{b.name}</span>
                    <span className="block truncate text-[12.5px] text-muted-foreground">
                      {b.bank} · {maskAccount(b.account)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {kindLabel(b.kind)}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11.5px] text-muted-foreground">
              Tap a name to continue — nothing is sent until you confirm the amount.
            </p>
          </div>
        )}


        <p className="mt-4 mb-2 text-[13px] font-medium text-muted-foreground">Try saying</p>
        <div className="flex flex-wrap gap-2">
          {COMMANDS.map((c) => (
            <button key={c.phrase} onClick={() => run(c.phrase)}
              className="press rounded-full border border-border px-3 py-1.5 text-[12.5px]">{c.label}</button>
          ))}
        </div>
        <p className="mt-3 text-[11.5px] text-muted-foreground">
          The assistant can navigate and prepare forms, but payments always need your confirmation.
        </p>
      </Sheet>
    </>
  );
}
