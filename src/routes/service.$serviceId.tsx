import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { SectionCard } from "@/components/kit";
import { TxnFlow } from "@/components/TxnFlow";
import { TXN_CONFIGS, OTHER_BANK_CONFIG } from "@/components/panels/txnConfigs";
import { FundTransferPanel, BillsPanel, SplitPayPanel, CardsPanel, SchedulePanel } from "@/components/panels/Payments";
import { RewardsPanel, MoneyManagerPanel, AdvisorPanel, GoalsPanel, EarlySalaryPanel } from "@/components/panels/Finance";
import { GroupDpsPanel } from "@/components/panels/GroupDps";
import {
  AccountOpeningPanel, SavingsPanel, FaqPanel, TutorialsPanel, NotificationsPanel, AccountsPanel,
  ProfilePanel, DocumentsPanel, LoansPanel, LimitsPanel, LifestylePanel, PersonalizationPanel,
} from "@/components/panels/Info";
import { SupportPanel, HelpPanel } from "@/components/panels/Support";
import { SecurityPanel, AccessibilityPanel } from "@/components/panels/Security";
import { HistoryPanel, BeneficiariesPanel, UpcomingPanel, BudgetPanel, RelatedPanel } from "@/components/panels/Generic";
import { PhoneTransferPanel } from "@/components/panels/PhoneTransfer";
import { RechargePanel } from "@/components/panels/Recharge";
import { PartnerOffersPanel } from "@/components/panels/PartnerOffers";
import { DisputesPanel } from "@/components/panels/Disputes";
import { AccountSharingPanel } from "@/components/panels/Sharing";
import { TravelOfferPanel } from "@/components/panels/TravelOffer";
import { EblInfoPanel } from "@/components/panels/EblInfo";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { byId } from "@/lib/services";
import { useApp } from "@/lib/store";

interface ServiceSearch {
  ref?: string;
  txn?: string;
  mobile?: string;
  ben?: string;
}

export const Route = createFileRoute("/service/$serviceId")({
  validateSearch: (search: Record<string, unknown>): ServiceSearch => ({
    ...(typeof search["ref"] === "string" ? { ref: search["ref"] } : {}),
    ...(typeof search["txn"] === "string" ? { txn: search["txn"] } : {}),
    ...(typeof search["mobile"] === "string" ? { mobile: search["mobile"] } : {}),
    ...(typeof search["ben"] === "string" ? { ben: search["ben"] } : {}),
  }),
  head: ({ params }) => {
    const svc = byId(params.serviceId);
    const title = `${svc?.title ?? "Service"} — EBL Sky Banking`;
    const description = svc?.description ?? "Banking service in EBL Sky Banking.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ServicePage,
});

const SECURITY_IDS = [
  "security-settings", "reset-login-pin", "reset-card-pin", "fingerprint-setup",
  "faceid-setup", "biometric-reset", "trusted-devices", "login-history", "active-sessions", "language",
];

interface PanelArgs {
  id: string;
  prefill?: Record<string, string> | undefined;
  txn?: string | undefined;
  mobile?: string | undefined;
}

function PanelFor({ id, prefill, txn, mobile }: PanelArgs) {
  if (SECURITY_IDS.includes(id)) return <SecurityPanel focus={id} />;

  switch (id) {
    case "fund-transfer":
    case "to-my-account":
      return <FundTransferPanel initialPrefill={prefill} />;
    case "phone-transfer": return <PhoneTransferPanel initialMobile={mobile ?? prefill?.["mobile"]} />;
    case "recharge": return <RechargePanel initial={prefill} />;
    case "partner-offers": return <PartnerOffersPanel />;
    case "disputes": return <DisputesPanel txnId={txn} />;
    case "account-sharing": return <AccountSharingPanel />;
    case "customize-dashboard": return <DashboardCustomizer />;
    case "human-support": return <SupportPanel tickets human />;

    case "air-tickets":
    case "hotel-booking":
    case "movie-tickets":
    case "star-cineplex":
      return <TravelOfferPanel serviceId={id} />;

    case "bill-payment":
    case "bill-reminder":
    case "saved-billers":
    case "gift-cards":
    case "education-payments":
    case "utility-history":
      return <BillsPanel />;
    case "split-pay": return <SplitPayPanel />;
    case "card-services":
    case "my-card":
    case "add-card":
    case "activate-card":
    case "card-controls":
      return <CardsPanel focus={id} />;
    case "auto-pay": return <SchedulePanel autoPay />;
    case "scheduled-transfer":
    case "scheduled-recharge":
    case "scheduled-bill":
    case "scheduled-tuition":
    case "scheduled-card-payment":
    case "scheduled-donation":
    case "schedule-history":
    case "auto-contribution":
    case "payment-intelligence":
      return <SchedulePanel />;

    case "rewards":
    case "reward-offers":
      return <RewardsPanel />;
    case "next-reward": return <PartnerOffersPanel />;
    case "ai-money-manager":
    case "spending-insights":
      return <MoneyManagerPanel />;
    case "ai-advisor":
    case "voice-assistant":
      return <AdvisorPanel />;
    case "goal-setting":
    case "savings-goals":
      return <GoalsPanel />;
    case "early-salary": return <EarlySalaryPanel />;
    case "budget": return <BudgetPanel />;
    case "upcoming-payments": return <UpcomingPanel />;

    case "group-dps": return <GroupDpsPanel />;
    case "account-opening": return <AccountOpeningPanel />;
    case "dps":
    case "instant-dps":
    case "fdr":
      return <SavingsPanel focus={id} />;

    case "faqs": return <FaqPanel />;
    case "tutorials": return <TutorialsPanel />;
    case "notifications": return <NotificationsPanel />;
    case "accounts":
    case "account-details":
      return <AccountsPanel />;
    case "profile": return <ProfilePanel />;
    case "statements": return <DocumentsPanel kind="statements" />;
    case "certificates": return <DocumentsPanel kind="certificates" />;
    case "receipts": return <DocumentsPanel kind="receipts" />;
    case "loans":
    case "loan-calculator":
      return <LoansPanel />;
    case "limits": return <LimitsPanel />;
    case "personalization": return <PersonalizationPanel />;
    case "islamic-savings": return <SavingsPanel focus="dps" />;
    case "donation":
    case "zakat":
    case "charity-campaigns":
    case "saved-organizations":
    case "e-toll":
    case "vehicle":
    case "entertainment":
      return <LifestylePanel focus={id} />;

    case "student-file":
    case "payroll-banking":
    case "women-payroll":
    case "agent-banking":
    case "entrepreneurial-services":
    case "super-saver":
    case "deposit-rate-sheet":
    case "schedule-of-charges":
      return <EblInfoPanel serviceId={id} />;

    case "ai-support": return <SupportPanel tickets />;
    case "help-support": return <HelpPanel />;
    case "accessibility": return <AccessibilityPanel />;

    case "transaction-history":
    case "donation-history":
      return <HistoryPanel />;
    case "beneficiaries": return <BeneficiariesPanel />;
    default: break;
  }

  if (id === "other-bank-transfer") return <TxnFlow serviceId={id} {...OTHER_BANK_CONFIG} initialValues={prefill} initialAmount={prefill?.["amount"]} />;

  // Fee/bill variants reuse an existing transaction flow — no duplicate service pages.
  const FLOW_ALIAS: Record<string, string> = {
    "school-fee": "tuition-fee",
    "college-fee": "tuition-fee",
    "university-fee": "tuition-fee",
    "universal-pension": "tuition-fee",
    "government-fees": "visa-fee",
    "bill-telephone": "bill-internet",
  };

  const cfg = TXN_CONFIGS[id] ?? TXN_CONFIGS[FLOW_ALIAS[id] ?? ""];
  if (cfg) return <TxnFlow serviceId={id} {...cfg} initialValues={prefill} initialAmount={prefill?.["amount"]} />;

  return <RelatedPanel serviceId={id} />;
}

function ServicePage() {
  const { serviceId } = Route.useParams();
  const { ref, txn, mobile, ben } = Route.useSearch();
  const { useService, state } = useApp();
  const nav = useNavigate();
  const svc = byId(serviceId);
  const refPrefill = ref ? state.recentEntities.find((r) => r.id === ref)?.prefill : undefined;
  const benRecord = ben ? state.beneficiaries.find((b) => b.id === ben) : undefined;
  const benPrefill: Record<string, string> | undefined = benRecord
    ? benRecord.kind === "mfs"
      ? { provider: benRecord.bank, wallet: benRecord.account }
      : benRecord.kind === "other"
        ? { bank: benRecord.bank, name: benRecord.name, account: benRecord.account }
        : { beneficiary: `${benRecord.name} · ${benRecord.account}`, account: benRecord.account }
    : undefined;
  const prefill = refPrefill ?? benPrefill;

  // Retired service: MFS Add Money is no longer available.
  useEffect(() => {
    if (serviceId === "add-money") nav({ to: "/pay-transfer", replace: true });
  }, [serviceId, nav]);

  useEffect(() => {
    if (svc) useService(svc.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  if (!svc) {
    return (
      <AppShell title="Service" back>
        <SectionCard title="Service not found" subtitle={`No service matches “${serviceId}”.`}>
          <button className="press text-[14px] font-medium text-primary" onClick={() => nav({ to: "/explore" })}>
            Browse all services
          </button>
        </SectionCard>
      </AppShell>
    );
  }

  return (
    <AppShell title={svc.title} back>
      <PanelFor id={svc.id} prefill={prefill} txn={txn} mobile={mobile} />
    </AppShell>
  );
}
