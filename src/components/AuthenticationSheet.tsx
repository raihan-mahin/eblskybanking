import { useState } from "react";
import { Fingerprint, ScanFace, KeyRound, Check, Delete } from "lucide-react";
import { Sheet, Button, cx } from "./kit";
import { useApp } from "@/lib/store";

type Method = "fingerprint" | "faceid" | "pin";

export function AuthenticationSheet({
  open, onClose, onSuccess, amount = 0, forceOtp = false, purpose = "Confirm transaction",
}: {
  open: boolean; onClose: () => void; onSuccess: () => void;
  amount?: number; forceOtp?: boolean; purpose?: string;
}) {
  const { state } = useApp();
  const [method, setMethod] = useState<Method | null>(null);
  const [scanning, setScanning] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const needsOtp = forceOtp || amount > 5000;

  const reset = () => {
    setMethod(null); setScanning(false); setPin(""); setError(""); setOtpStage(false); setOtp("");
  };
  const close = () => { reset(); onClose(); };
  const pass = () => {
    if (needsOtp) { setOtpStage(true); setMethod(null); setScanning(false); setPin(""); }
    else { reset(); onSuccess(); }
  };

  const runBiometric = (m: Method) => {
    setMethod(m); setError(""); setScanning(true);
    setTimeout(() => { setScanning(false); pass(); }, 1400);
  };

  const pressKey = (k: string) => {
    setError("");
    if (k === "del") return setPin((p) => p.slice(0, -1));
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === state.security.pin) pass();
        else { setError("Incorrect PIN. Please try again."); setPin(""); }
      }, 200);
    }
  };

  return (
    <Sheet open={open} onClose={close} title={otpStage ? "Verify OTP" : purpose}>
      {otpStage ? (
        <div>
          <p className="text-[13.5px] text-muted-foreground">
            A 6-digit code was sent to {state.user.mobile}. Use demo code <b>123456</b>.
          </p>
          <input
            inputMode="numeric" value={otp} maxLength={6}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="Enter OTP"
            className="mt-4 w-full rounded-xl border border-border px-4 py-3.5 text-center text-[22px] tracking-[0.4em] outline-none focus:border-brand"
          />
          {error && <p className="mt-2 text-center text-[13px] text-error">{error}</p>}
          <div className="mt-4 space-y-2">
            <Button onClick={() => (otp === "123456" ? (reset(), onSuccess()) : setError("Invalid OTP code."))}>
              Verify & Continue
            </Button>
            <Button variant="ghost" onClick={close}>Cancel</Button>
          </div>
        </div>
      ) : scanning || (method === "pin") ? (
        method === "pin" ? (
          <div>
            <p className="text-[13.5px] text-muted-foreground">Enter your 4-digit login PIN</p>
            <div className="my-5 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cx("size-3.5 rounded-full", i < pin.length ? "bg-brand" : "bg-border")} />
              ))}
            </div>
            {error && <p className="mb-2 text-center text-[13px] text-error">{error}</p>}
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
                k === "" ? <span key={i} /> : (
                  <button key={i} onClick={() => pressKey(k)}
                    className="press grid h-14 place-items-center rounded-xl bg-muted text-[20px] font-medium">
                    {k === "del" ? <Delete className="size-5" /> : k}
                  </button>
                ),
              )}
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => setMethod(null)}>Use another method</Button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className={cx(
              "mx-auto grid size-28 place-items-center rounded-full border-4 border-brand",
              method === "faceid" ? "rounded-3xl" : "",
              "animate-pulse",
            )}>
              {method === "faceid" ? <ScanFace className="size-12 text-primary" /> : <Fingerprint className="size-12 text-accent" />}
            </div>
            <p className="mt-4 text-[14px] text-muted-foreground">
              {method === "faceid" ? "Hold your face inside the frame" : "Touch the fingerprint sensor"}
            </p>
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          {amount > 0 && (
            <div className="mb-1 rounded-xl bg-tint-yellow px-3.5 py-2.5 text-[12.5px]">
              {amount > 5000
                ? "Amounts above ৳5,000 require OTP after confirmation"
                : "One-tap available up to ৳5,000 — no OTP needed"}
            </div>
          )}
          {state.security.fingerprint && (
            <MethodRow icon="finger" label="Fingerprint" sub="Fastest confirmation" onClick={() => runBiometric("fingerprint")} />
          )}
          {state.security.faceId && (
            <MethodRow icon="face" label="Face ID" sub="Look at your device" onClick={() => runBiometric("faceid")} />
          )}
          <MethodRow icon="pin" label="PIN" sub="Enter your 4-digit PIN" onClick={() => { setMethod("pin"); setError(""); }} />
          <Button variant="ghost" onClick={close}>Cancel</Button>
        </div>
      )}
    </Sheet>
  );
}

function MethodRow({ icon, label, sub, onClick }: { icon: string; label: string; sub: string; onClick: () => void }) {
  const I = icon === "finger" ? Fingerprint : icon === "face" ? ScanFace : KeyRound;
  return (
    <button onClick={onClick} className="press flex w-full items-center gap-3 rounded-xl border border-border p-3.5 text-left">
      <span className="grid size-10 place-items-center rounded-full bg-tint-yellow">
        <I className="size-5 text-accent" />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-medium">{label}</span>
        <span className="block text-[12px] text-muted-foreground">{sub}</span>
      </span>
      <Check className="size-4 text-muted-foreground" />
    </button>
  );
}
