import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { Sheet, Button, TextInput, cx } from "./kit";
import { useApp, money } from "@/lib/store";
import { searchServices } from "@/lib/services";

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

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [listening, setListening] = useState(false);
  const { state, patch } = useApp();
  const nav = useNavigate();

  const goService = (id: string) => { setOpen(false); nav({ to: "/service/$serviceId", params: { serviceId: id } }); };

  const run = (raw: string) => {
    const q = raw.toLowerCase().trim();
    setText("");
    if (q.includes("balance")) return setReply(`Your EBL Savings Account balance is ${money(state.accounts[0].balance)}.`);
    if (q.includes("recent")) return goService("transaction-history");
    if (q.includes("high contrast")) { patch({ accessibility: { ...state.accessibility, contrast: true } }); return setReply("High contrast is now on."); }
    if (q.includes("text size")) {
      const next = state.accessibility.textSize === "normal" ? "large" : "xlarge";
      patch({ accessibility: { ...state.accessibility, textSize: next } });
      return setReply(`Text size set to ${next}.`);
    }
    if (q.includes("go back")) { setOpen(false); return history.back(); }
    if (q.includes("explain")) return setReply("This screen belongs to EBL Sky Banking. Use the bottom navigation for Home, My Banking, QR and Explore, and tap any tile to open a full flow.");
    if (q.includes("support")) return goService("ai-support");
    if (q.includes("reward")) return goService("rewards");
    if (q.includes("electricity")) return goService("bill-electricity");
    const hit = searchServices(q.replace("open", "").trim())[0];
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
