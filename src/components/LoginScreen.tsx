import { useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, User, Lock, Eye, EyeOff, ScanFace, Check, Compass, MapPin, Search, Navigation } from "lucide-react";
import { Button, FormField, TextInput, Sheet, cx } from "./kit";
import { useApp } from "@/lib/store";

const SAVED_ID_KEY = "ebl-saved-user-id";

type Place = { id: string; type: "Branch" | "ATM" | "Agent"; name: string; area: string; hours: string };

const PLACES: Place[] = [
  { id: "p1", type: "Branch", name: "Gulshan Branch", area: "Gulshan Avenue, Dhaka", hours: "10:00 AM – 4:00 PM" },
  { id: "p2", type: "Branch", name: "Dhanmondi Branch", area: "Satmasjid Road, Dhaka", hours: "10:00 AM – 4:00 PM" },
  { id: "p3", type: "ATM", name: "Banani 24/7 ATM", area: "Kemal Ataturk Ave, Dhaka", hours: "Open 24 hours" },
  { id: "p4", type: "ATM", name: "Uttara Sector 7 ATM", area: "Uttara, Dhaka", hours: "Open 24 hours" },
  { id: "p5", type: "Agent", name: "EBL Agent — Mirpur 10", area: "Mirpur, Dhaka", hours: "9:00 AM – 8:00 PM" },
  { id: "p6", type: "Agent", name: "EBL Agent — Savar Bazar", area: "Savar, Dhaka", hours: "9:00 AM – 8:00 PM" },
  { id: "p7", type: "Branch", name: "Agrabad Branch", area: "Agrabad C/A, Chattogram", hours: "10:00 AM – 4:00 PM" },
  { id: "p8", type: "ATM", name: "Sylhet Zindabazar ATM", area: "Zindabazar, Sylhet", hours: "Open 24 hours" },
];

export function LoginScreen() {
  const { patch } = useApp();
  const nav = useNavigate();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [findOpen, setFindOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Place["type"]>("All");
  const [near, setNear] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(SAVED_ID_KEY) : null;
    if (saved) { setUserId(saved); setSaveId(true); }
  }, []);

  const enter = () => {
    if (saveId && userId.trim()) window.localStorage.setItem(SAVED_ID_KEY, userId.trim());
    if (!saveId) window.localStorage.removeItem(SAVED_ID_KEY);
    patch({ loggedIn: true, demoMode: true });
    nav({ to: "/home" });
  };

  const login = () => {
    if (!userId.trim()) return setError("Enter your User ID to continue.");
    if (!password) return setError("Enter your password to continue.");
    enter();
  };

  const faceId = () => {
    setError("");
    setScanning(true);
    setTimeout(() => { setScanning(false); enter(); }, 1200);
  };

  const results = PLACES.filter(
    (p) =>
      (filter === "All" || p.type === filter) &&
      (query.trim() === "" ||
        (p.name + p.area).toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-background px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-8">
      <button
        onClick={() => router.history.back()}
        aria-label="Go back"
        className="press -ml-1 grid size-10 place-items-center rounded-full"
      >
        <ArrowLeft className="size-6 text-foreground" strokeWidth={2.4} />
      </button>

      <div className="mt-10">
        <h1 className="text-[32px] leading-tight font-semibold text-foreground">Log In</h1>
        <p
          className="bg-clip-text text-[34px] leading-tight font-bold text-transparent"
          style={{ backgroundImage: "linear-gradient(90deg,#0FA9A0 0%,#1E9BE0 45%,#1668E3 100%)" }}
        >
          EBL Skybanking
        </p>
      </div>

      <div className="mt-9 space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4">
          <User className="size-6 shrink-0 text-foreground" strokeWidth={1.8} />
          <span className="h-6 w-px bg-border" />
          <input
            value={userId}
            onChange={(e) => { setError(""); setUserId(e.target.value); }}
            placeholder="Enter User ID"
            autoComplete="username"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setSaveId((v) => !v)}
            className="press flex shrink-0 items-center gap-2"
            aria-pressed={saveId}
          >
            <span className="text-[14px] text-muted-foreground">Save ID</span>
            <span
              style={{ borderRadius: 8 }}
              className={cx(
                "grid size-7 place-items-center border",
                saveId ? "border-success bg-success" : "border-border bg-background",
              )}
            >
              {saveId && <Check className="size-5 text-white" strokeWidth={3} />}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4">
          <Lock className="size-6 shrink-0 text-foreground" strokeWidth={1.8} />
          <span className="h-6 w-px bg-border" />
          <input
            value={password}
            type={showPw ? "text" : "password"}
            onChange={(e) => { setError(""); setPassword(e.target.value); }}
            placeholder="Enter Password"
            autoComplete="current-password"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setShowPw((v) => !v)} className="press shrink-0" aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <Eye className="size-6 text-muted-foreground" strokeWidth={1.8} /> : <EyeOff className="size-6 text-muted-foreground" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <button
        onClick={() => { setOtpSent(false); setForgotOpen(true); }}
        className="press mt-6 self-start border-b-2 border-success pb-0.5 text-[15px] font-semibold text-success"
      >
        Forgot ID or Password?
      </button>

      {error && <p className="mt-3 text-[13px] text-error">{error}</p>}

      <div className="mt-7 flex items-stretch gap-3">
        <button
          onClick={login}
          className="press flex-1 rounded-2xl bg-brand py-4 text-[17px] font-bold text-foreground"
        >
          Login
        </button>
        <button
          onClick={faceId}
          aria-label="Login with Face ID"
          className={cx("press grid w-[76px] place-items-center rounded-2xl bg-muted", scanning && "animate-pulse")}
        >
          <ScanFace className="size-8 text-primary" strokeWidth={1.8} />
        </button>
      </div>

      <div className="mt-10 h-px w-full bg-border" />

      <p className="mt-6 text-center text-[15px] text-muted-foreground">
        New to EBL Skybanking ?{" "}
        <button
          onClick={() => nav({ to: "/service/$serviceId", params: { serviceId: "account-opening" } })}
          className="press border-b-2 border-error font-bold text-error"
        >
          Sign Up
        </button>
      </p>

      <div className="mt-auto flex items-center justify-center gap-10 pt-14">
        <button onClick={() => nav({ to: "/explore" })} className="press flex w-28 flex-col items-center gap-2">
          <span className="grid size-11 place-items-center rounded-full border-2 border-foreground">
            <Compass className="size-5 text-foreground" />
          </span>
          <span className="text-[14px] text-foreground">Explore</span>
        </button>
        <span className="h-14 w-px bg-border" />
        <button onClick={() => setFindOpen(true)} className="press flex w-28 flex-col items-center gap-2">
          <span className="grid size-11 place-items-center rounded-full border-2 border-foreground">
            <MapPin className="size-5 text-foreground" />
          </span>
          <span className="text-[14px] text-foreground">Find EBL</span>
        </button>
      </div>

      <Sheet open={forgotOpen} onClose={() => setForgotOpen(false)} title="Forgot ID or Password?">
        {otpSent ? (
          <div className="py-2 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-tint-green">
              <Check className="size-7 text-success" strokeWidth={3} />
            </span>
            <p className="mt-3 text-[16px] font-semibold text-primary">OTP sent</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              We sent a 6-digit code to {phone || "your registered number"}.
            </p>
            <div className="mt-4">
              <Button onClick={() => setForgotOpen(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-3 text-[13px] text-muted-foreground">
              Enter your registered mobile number and we'll send a recovery OTP.
            </p>
            <FormField label="Mobile number">
              <TextInput
                value={phone}
                inputMode="numeric"
                maxLength={11}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="01XXXXXXXXX"
              />
            </FormField>
            <Button disabled={phone.length < 11} onClick={() => setOtpSent(true)}>Send OTP</Button>
          </>
        )}
      </Sheet>

      <Sheet open={findOpen} onClose={() => setFindOpen(false)} title="Find EBL near you">
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search branch, ATM or area"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mb-3 flex gap-2">
          {(["All", "Branch", "ATM", "Agent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx(
                "press rounded-full px-3 py-1.5 text-[13px] font-medium",
                filter === f ? "bg-brand text-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setNear("Locating…");
            if (typeof navigator !== "undefined" && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                () => setNear("Showing points nearest to your current location"),
                () => setNear("Location unavailable — showing Dhaka points"),
              );
            } else setNear("Location unavailable — showing Dhaka points");
          }}
          className="press mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-[13.5px] font-medium text-primary"
        >
          <Navigation className="size-4" /> Use my location
        </button>
        {near && <p className="mb-2 text-[12.5px] text-muted-foreground">{near}</p>}
        <div className="max-h-[46vh] space-y-2 overflow-y-auto">
          {results.map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14.5px] font-semibold text-primary">{p.name}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{p.type}</span>
              </div>
              <p className="mt-0.5 text-[12.5px] text-muted-foreground">{p.area}</p>
              <p className="text-[12.5px] text-muted-foreground">{p.hours}</p>
            </div>
          ))}
          {results.length === 0 && (
            <p className="py-6 text-center text-[13px] text-muted-foreground">No locations found.</p>
          )}
        </div>
      </Sheet>
    </div>
  );
}
