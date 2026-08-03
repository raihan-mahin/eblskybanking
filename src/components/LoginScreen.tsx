import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint, ScanFace, KeyRound, Landmark } from "lucide-react";
import { Button, FormField, TextInput, cx } from "./kit";
import { useApp } from "@/lib/store";

export function LoginScreen() {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(state.user.mobile);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const enter = () => {
    patch({ loggedIn: true, demoMode: true });
    nav({ to: "/home" });
  };

  const biometric = (m: string) => {
    setError("");
    setBusy(m);
    setTimeout(() => { setBusy(null); enter(); }, 1200);
  };

  const withPin = () => {
    if (pin !== state.security.pin) return setError("Incorrect PIN. Demo PIN is 1234.");
    enter();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background">
      <div className="bg-brand px-[18px] pt-16 pb-12">
        <div className="grid size-14 place-items-center rounded-2xl bg-foreground text-white">
          <Landmark className="size-7" />
        </div>
        <h1 className="mt-4 text-[26px] leading-tight font-semibold text-primary">EBL Sky Banking</h1>
        <p className="text-[14px] text-foreground/80">Everything you bank, in one app.</p>
      </div>

      <div className="-mt-6 flex-1 space-y-4 rounded-t-3xl bg-background px-[18px] pt-6">
        <div className="app-card p-4">
          <FormField label="Mobile number">
            <TextInput value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01XXXXXXXXX" />
          </FormField>
          <FormField label="PIN" hint="Demo PIN is 1234">
            <TextInput
              value={pin}
              inputMode="numeric"
              type="password"
              maxLength={4}
              onChange={(e) => { setError(""); setPin(e.target.value.replace(/\D/g, "")); }}
              placeholder="••••"
            />
          </FormField>
          {error && <p className="mb-2 text-[12.5px] text-error">{error}</p>}
          <Button onClick={withPin}>
            <KeyRound className="mr-1.5 inline size-4" /> Login with PIN
          </Button>
        </div>

        <div className="app-card p-4">
          <p className="mb-3 text-[13px] text-muted-foreground">Or use biometrics</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => biometric("fingerprint")}
              className={cx("press flex flex-col items-center gap-2 rounded-2xl bg-tint-yellow py-5", busy === "fingerprint" && "animate-pulse")}
            >
              <Fingerprint className="size-8 text-accent" />
              <span className="text-[13px] font-medium">{busy === "fingerprint" ? "Scanning…" : "Fingerprint"}</span>
            </button>
            <button
              onClick={() => biometric("faceid")}
              className={cx("press flex flex-col items-center gap-2 rounded-2xl bg-tint-blue py-5", busy === "faceid" && "animate-pulse")}
            >
              <ScanFace className="size-8 text-primary" />
              <span className="text-[13px] font-medium">{busy === "faceid" ? "Scanning…" : "Face ID"}</span>
            </button>
          </div>
        </div>

        <button onClick={enter} className="press w-full py-3 text-center text-[13.5px] font-medium text-primary">
          Continue in demo mode
        </button>
      </div>
    </div>
  );
}
