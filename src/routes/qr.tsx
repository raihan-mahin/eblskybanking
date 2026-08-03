import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, ScanLine } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SectionCard, ListRow, SegmentedTabs, Button, cx } from "@/components/kit";
import { TxnFlow } from "@/components/TxnFlow";
import { useApp, money } from "@/lib/store";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Payments — EBL Sky Banking" },
      { name: "description", content: "Scan a merchant QR to pay instantly or share your personal QR to get paid." },
      { property: "og:title", content: "QR Payments — EBL Sky Banking" },
      { property: "og:description", content: "Scan a merchant QR to pay instantly or share your personal QR to get paid." },
    ],
  }),
  component: QrPage,
});

const MERCHANTS = [
  { name: "Shwapno Gulshan", note: "Grocery" },
  { name: "Coffee World Banani", note: "Cafe" },
  { name: "Aarong Uttara", note: "Lifestyle" },
];

function QrPage() {
  const { state } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("scan");
  const [scanning, setScanning] = useState(false);
  const [merchant, setMerchant] = useState<string | null>(null);

  const scan = (name?: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setMerchant(name ?? MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)]!.name);
    }, 1300);
  };

  if (merchant) {
    return (
      <AppShell title="QR Payment" back>
        <SectionCard title={merchant} subtitle="Merchant verified · EBL QR">
          <TxnFlow
            serviceId="qr-payment"
            title={`QR Payment — ${merchant}`}
            category="QR"
            amountPresets={[200, 500, 1200, 2500]}
            submitLabel="Pay merchant"
            onDone={() => setMerchant(null)}
          />
        </SectionCard>
        <Button variant="ghost" onClick={() => setMerchant(null)}>Scan another QR</Button>
      </AppShell>
    );
  }

  return (
    <AppShell title="QR">
      <SegmentedTabs
        tabs={[{ id: "scan", label: "Scan QR" }, { id: "mine", label: "My QR" }]}
        value={tab}
        onChange={setTab}
      />

      {tab === "scan" ? (
        <>
          <SectionCard>
            <div className={cx("relative grid aspect-square w-full place-items-center rounded-2xl bg-foreground/90", scanning && "animate-pulse")}>
              <div className="grid size-44 place-items-center rounded-xl border-2 border-dashed border-brand">
                <ScanLine className="size-16 text-brand" />
              </div>
              <p className="absolute bottom-4 text-[12.5px] text-white/80">
                {scanning ? "Scanning QR code…" : "Align the QR inside the frame"}
              </p>
            </div>
            <Button className="mt-3" onClick={() => scan()}>{scanning ? "Scanning…" : "Simulate scan"}</Button>
          </SectionCard>

          <SectionCard title="Nearby merchants" subtitle="Tap to simulate a scan">
            {MERCHANTS.map((m) => (
              <ListRow key={m.name} icon="ShoppingBag" tint="green" title={m.name} subtitle={m.note} onClick={() => scan(m.name)} />
            ))}
          </SectionCard>
        </>
      ) : (
        <>
          <SectionCard title="My QR" subtitle="Show this to receive money">
            <div className="grid place-items-center py-4">
              <div className="grid size-56 place-items-center rounded-2xl bg-tint-yellow">
                <QrCode className="size-40 text-foreground" />
              </div>
              <p className="mt-3 text-[15px] font-semibold">{state.user.name}</p>
              <p className="text-[12.5px] text-muted-foreground">{state.accounts[0]!.masked}</p>
            </div>
          </SectionCard>
          <SectionCard title="Recent QR payments" action="History" onAction={() => nav({ to: "/service/$serviceId", params: { serviceId: "transaction-history" } })}>
            {state.transactions.filter((t) => t.serviceId === "qr-payment").slice(0, 5).map((t) => (
              <ListRow key={t.id} icon="QrCode" tint="green" title={t.title} subtitle={t.date}
                right={<span className="text-[14px] font-semibold">-{money(t.amount)}</span>} />
            ))}
          </SectionCard>
        </>
      )}
    </AppShell>
  );
}
