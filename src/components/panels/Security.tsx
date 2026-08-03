import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SectionCard, ListRow, Button, FormField, TextInput, Select, Toggle, Sheet, useToast, cx } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { useApp } from "@/lib/store";

export function SecurityPanel({ focus }: { focus: string }) {
  const { state, patch, notify } = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const [flow, setFlow] = useState<string | null>(focus === "security-settings" ? null : focus);
  const go = (id: string) => nav({ to: "/service/$serviceId", params: { serviceId: id } });
  const sec = state.security;

  if (flow && flow !== "security-settings") return <SecurityFlow flow={flow} onDone={() => setFlow(null)} />;

  return (
    <>
      <SectionCard title="PIN & Biometrics">
        <ListRow icon="KeyRound" tint="yellow" title="Change Login PIN" onClick={() => setFlow("change-login-pin")} />
        <ListRow icon="KeyRound" tint="pink" title="Reset Login PIN" subtitle="Requires OTP" onClick={() => setFlow("reset-login-pin")} />
        <ListRow icon="CreditCard" tint="pink" title="Reset Card PIN" subtitle="Requires OTP" onClick={() => setFlow("reset-card-pin")} />
        <ListRow icon="Fingerprint" tint="yellow" title="Enable Fingerprint" subtitle={sec.fingerprint ? "Enrolled" : "Not enrolled"} onClick={() => setFlow("fingerprint-setup")} />
        <ListRow icon="ScanFace" tint="blue" title="Enable Face ID" subtitle={sec.faceId ? "Enrolled" : "Not enrolled"} onClick={() => setFlow("faceid-setup")} />
        <ListRow icon="Fingerprint" tint="purple" title="Reset Biometric Verification" onClick={() => setFlow("biometric-reset")} />
      </SectionCard>

      <SectionCard title="Preferences">
        <FormField label="Preferred confirmation method">
          <Select value={sec.preferred} onChange={(v) => patch({ security: { ...sec, preferred: v as never } })}
            options={[{ value: "fingerprint", label: "Fingerprint" }, { value: "faceid", label: "Face ID" }, { value: "pin", label: "PIN" }]} />
        </FormField>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[14.5px]">Security alerts</span>
          <Toggle checked={sec.alerts} onChange={(v) => patch({ security: { ...sec, alerts: v } })} />
        </div>
        <div className="mt-3">
          <FormField label="Auto logout duration">
            <Select value={sec.autoLogout} onChange={(v) => patch({ security: { ...sec, autoLogout: v } })}
              options={["1 minute", "5 minutes", "15 minutes", "Never"]} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Devices & sessions">
        <ListRow icon="MonitorSmartphone" title="Trusted Devices" subtitle={`${sec.devices.length} devices`} onClick={() => setFlow("trusted-devices")} />
        <ListRow icon="MonitorSmartphone" title="Active Sessions" subtitle={`${sec.sessions.length} active`} onClick={() => setFlow("active-sessions")} />
        <ListRow icon="LogIn" title="Login History" onClick={() => setFlow("login-history")} />
        <ListRow icon="Snowflake" title="Freeze Card" subtitle="Quick card lock" onClick={() => go("card-controls")} />
      </SectionCard>
      {toast.node}
    </>
  );
}

function SecurityFlow({ flow, onDone }: { flow: string; onDone: () => void }) {
  const { state, patch, notify } = useApp();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [current, setCurrent] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [card, setCard] = useState(state.cards[0].id);
  const [target, setTarget] = useState("Fingerprint");
  const [auth, setAuth] = useState(false);
  const sec = state.security;

  const finish = (msg: string) => { notify("Security updated", msg, "security"); toast.show(msg); setStep(99); };

  const pinField = (label: string, v: string, set: (s: string) => void) => (
    <FormField label={label}>
      <TextInput inputMode="numeric" maxLength={4} value={v} onChange={(e) => set(e.target.value.replace(/\D/g, ""))} placeholder="••••" />
    </FormField>
  );

  if (step === 99)
    return (
      <SectionCard>
        <p className="py-6 text-center text-[15px] font-medium text-success">Completed successfully</p>
        <Button onClick={onDone}>Back to Security</Button>
      </SectionCard>
    );

  if (flow === "trusted-devices" || flow === "active-sessions" || flow === "login-history") {
    const rows = flow === "login-history" ? sec.history.map((h) => ({ id: h.id, a: h.name, b: `${h.date} · ${h.status}` }))
      : flow === "active-sessions" ? sec.sessions.map((s) => ({ id: s.id, a: s.name, b: s.last }))
        : sec.devices.map((d) => ({ id: d.id, a: d.name, b: d.last }));
    return (
      <SectionCard title={flow.replace("-", " ")}>
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div><p className="text-[14.5px]">{r.a}</p><p className="text-[12.5px] text-muted-foreground">{r.b}</p></div>
            {flow !== "login-history" && (
              <button className="press text-[13px] text-error"
                onClick={() => {
                  if (flow === "active-sessions") patch({ security: { ...sec, sessions: sec.sessions.filter((x) => x.id !== r.id) } });
                  else patch({ security: { ...sec, devices: sec.devices.filter((x) => x.id !== r.id) } });
                  toast.show("Removed");
                }}>Remove</button>
            )}
          </div>
        ))}
        {flow === "trusted-devices" && (
          <Button className="mt-3" onClick={() => setAuth(true)}>Register this device</Button>
        )}
        <AuthenticationSheet open={auth} forceOtp onClose={() => setAuth(false)} purpose="Register trusted device"
          onSuccess={() => {
            setAuth(false);
            patch({ security: { ...sec, devices: [...sec.devices, { id: "d" + Date.now(), name: "This device · Web", last: "Just now" }] } });
            toast.show("Device registered");
          }} />
        <Button variant="ghost" className="mt-2" onClick={onDone}>Back</Button>
        {toast.node}
      </SectionCard>
    );
  }

  return (
    <SectionCard title={TITLES[flow] ?? "Security"}>
      <div className="space-y-3">
        {flow === "change-login-pin" && (
          <>
            {pinField("Current PIN", current, setCurrent)}
            {pinField("New 4-digit PIN", pin, setPin)}
            {pinField("Confirm new PIN", confirm, setConfirm)}
            <Button onClick={() => {
              if (current !== sec.pin) return toast.show("Current PIN is incorrect");
              if (pin.length !== 4 || pin !== confirm) return toast.show("New PINs must match and be 4 digits");
              setAuth(true);
            }}>Continue</Button>
            <AuthenticationSheet open={auth} onClose={() => setAuth(false)} purpose="Confirm PIN change"
              onSuccess={() => { setAuth(false); patch({ security: { ...sec, pin } }); finish("Login PIN changed successfully"); }} />
          </>
        )}

        {flow === "reset-login-pin" && (
          <>
            <FormField label="Registered mobile number"><TextInput value={state.user.mobile} readOnly /></FormField>
            <FormField label="OTP (demo 123456)"><TextInput inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} /></FormField>
            {pinField("New 4-digit PIN", pin, setPin)}
            {pinField("Confirm new PIN", confirm, setConfirm)}
            <Button onClick={() => {
              if (otp !== "123456") return toast.show("Invalid OTP");
              if (pin.length !== 4 || pin !== confirm) return toast.show("New PINs must match and be 4 digits");
              patch({ security: { ...sec, pin } });
              finish("Login PIN reset successfully");
            }}>Reset PIN</Button>
          </>
        )}

        {flow === "reset-card-pin" && (
          <>
            <FormField label="Select card">
              <Select value={card} onChange={setCard} options={state.cards.map((c) => ({ value: c.id, label: `${c.name} · ${c.masked}` }))} />
            </FormField>
            <p className="text-[13px] text-muted-foreground">{state.cards.find((c) => c.id === card)?.masked}</p>
            {step === 0 ? (
              <Button onClick={() => setAuth(true)}>Confirm identity</Button>
            ) : (
              <>
                <FormField label="OTP (demo 123456)"><TextInput inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} /></FormField>
                {pinField("New card PIN", pin, setPin)}
                {pinField("Confirm card PIN", confirm, setConfirm)}
                <Button onClick={() => {
                  if (otp !== "123456") return toast.show("Invalid OTP");
                  if (pin.length !== 4 || pin !== confirm) return toast.show("PINs must match and be 4 digits");
                  patch({ cards: state.cards.map((c) => (c.id === card ? { ...c, pinSet: true } : c)) });
                  finish("Card PIN reset successfully");
                }}>Save new card PIN</Button>
              </>
            )}
            <AuthenticationSheet open={auth} onClose={() => setAuth(false)} purpose="Confirm your identity"
              onSuccess={() => { setAuth(false); setStep(1); toast.show("OTP sent to your mobile"); }} />
          </>
        )}

        {(flow === "fingerprint-setup" || flow === "faceid-setup") && (
          <>
            {pinField("Confirm current login PIN", current, setCurrent)}
            <Button onClick={() => {
              if (current !== sec.pin) return toast.show("Incorrect PIN");
              setAuth(true);
            }}>Start {flow === "faceid-setup" ? "face scan" : "fingerprint scan"}</Button>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[14.5px]">Use as default confirmation method</span>
              <Toggle checked={sec.preferred === (flow === "faceid-setup" ? "faceid" : "fingerprint")}
                onChange={() => patch({ security: { ...sec, preferred: flow === "faceid-setup" ? "faceid" : "fingerprint" } })} />
            </div>
            <AuthenticationSheet open={auth} onClose={() => setAuth(false)} purpose="Enroll biometric"
              onSuccess={() => {
                setAuth(false);
                patch({ security: { ...sec, [flow === "faceid-setup" ? "faceId" : "fingerprint"]: true } });
                finish(flow === "faceid-setup" ? "Face ID enrolled" : "Fingerprint enrolled");
              }} />
          </>
        )}

        {flow === "biometric-reset" && (
          <>
            {pinField("Confirm current login PIN", current, setCurrent)}
            <FormField label="Select method">
              <Select value={target} onChange={setTarget} options={["Fingerprint", "Face ID"]} />
            </FormField>
            <FormField label="OTP (demo 123456)"><TextInput inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} /></FormField>
            <Button onClick={() => {
              if (current !== sec.pin) return toast.show("Incorrect PIN");
              if (otp !== "123456") return toast.show("Invalid OTP");
              patch({ security: { ...sec, fingerprint: target === "Fingerprint" ? false : sec.fingerprint, faceId: target === "Face ID" ? false : sec.faceId } });
              finish(`${target} enrollment removed — you can enroll again`);
            }}>Remove enrollment</Button>
          </>
        )}

        <Button variant="ghost" onClick={onDone}>Back</Button>
      </div>
      {toast.node}
    </SectionCard>
  );
}

const TITLES: Record<string, string> = {
  "change-login-pin": "Change Login PIN",
  "reset-login-pin": "Reset Login PIN",
  "reset-card-pin": "Reset Card PIN",
  "fingerprint-setup": "Fingerprint Setup",
  "faceid-setup": "Face ID Setup",
  "biometric-reset": "Biometric Reset",
};

export function AccessibilityPanel() {
  const { state, patch } = useApp();
  const a = state.accessibility;
  const set = (p: Partial<typeof a>) => patch({ accessibility: { ...a, ...p } });
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance("You are on the accessibility screen of EBL Sky Banking. You can change text size, contrast and voice guidance.");
    u.rate = a.speechSpeed;
    speechSynthesis.speak(u);
  };
  return (
    <>
      <SectionCard title="Display">
        <FormField label="Text size">
          <div className="grid grid-cols-3 gap-2">
            {(["normal", "large", "xlarge"] as const).map((t) => (
              <button key={t} onClick={() => set({ textSize: t })}
                className={cx("press rounded-xl border py-2.5 text-[13px] capitalize", a.textSize === t ? "border-brand bg-brand-soft" : "border-border")}>
                {t === "xlarge" ? "Extra large" : t}
              </button>
            ))}
          </div>
        </FormField>
        {[["High contrast", a.contrast, (v: boolean) => set({ contrast: v })],
        ["Reduce motion", a.reduceMotion, (v: boolean) => set({ reduceMotion: v })],
        ["Visible keyboard focus", a.focus, (v: boolean) => set({ focus: v })]].map(([l, v, f]) => (
          <div key={l as string} className="mt-3 flex items-center justify-between">
            <span className="text-[14.5px]">{l as string}</span>
            <Toggle checked={v as boolean} onChange={f as (v: boolean) => void} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Voice & language">
        <div className="flex items-center justify-between">
          <span className="text-[14.5px]">Voice guidance</span>
          <Toggle checked={a.voiceGuidance} onChange={(v) => set({ voiceGuidance: v })} />
        </div>
        <div className="mt-3">
          <FormField label={`Speech speed: ${a.speechSpeed.toFixed(1)}x`}>
            <input type="range" min={0.5} max={2} step={0.1} value={a.speechSpeed}
              onChange={(e) => set({ speechSpeed: Number(e.target.value) })} className="w-full accent-[oklch(0.845_0.169_87.5)]" />
          </FormField>
        </div>
        <Button variant="outline" onClick={speak}>Read current screen</Button>
        <div className="mt-3">
          <FormField label="Language">
            <Select value={a.language} onChange={(v) => set({ language: v as never })} options={["English", "Bangla"]} />
          </FormField>
        </div>
        <p className="text-[12px] text-muted-foreground">Screen-reader labels are enabled on all interactive elements.</p>
      </SectionCard>
    </>
  );
}
