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
import { IslamicPanel } from "@/components/panels/Islamic";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { byId } from "@/lib/services";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/service/$serviceId")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"] : undefined,
    txn: typeof search["txn"] === "string" ? search["txn"] : undefined,
    mobile: typeof search["mobile"] === "string" ? search["mobile"] : undefined,
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
    case "fund-transfer": return <FundTransferPanel initialPrefill={prefill} />;
    case "phone-transfer": return <PhoneTransferPanel initialMobile={mobile ?? prefill?.["mobile"]} />;
    case "recharge": return <RechargePanel initial={prefill} />;
    case "partner-offers": return <PartnerOffersPanel />;
    case "disputes": return <DisputesPanel txnId={txn} />;
    case "account-sharing": return <AccountSharingPanel />;
    case "islamic-mode": return <IslamicPanel />;
    case "customize-dashboard": return <DashboardCustomizer />;
    case "human-support": return <SupportPanel tickets human />;

    case "bill-payment":
    case "bill-reminder":
    case "saved-billers":
    case "gift-cards":
    case "education-payments":
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
    case "accounts": return <AccountsPanel />;
    case "profile": return <ProfilePanel />;
    case "statements": return <DocumentsPanel kind="statements" />;
    case "certificates": return <DocumentsPanel kind="certificates" />;
    case "receipts": return <DocumentsPanel kind="receipts" />;
    case "loans":
    case "loan-calculator":
      return <LoansPanel />;
    case "limits": return <LimitsPanel />;
    case "personalization": return <PersonalizationPanel />;
    case "islamic":
    case "islamic-accounts":
      return <IslamicPanel />;
    case "islamic-savings": return <SavingsPanel focus="dps" />;
    case "donation":
    case "zakat":
    case "e-toll":
    case "vehicle":
    case "entertainment":
      return <LifestylePanel focus={id} />;

    case "ai-support": return <SupportPanel tickets />;
    case "help-support": return <HelpPanel />;
    case "accessibility": return <AccessibilityPanel />;

    case "transaction-history": return <HistoryPanel />;
    case "beneficiaries": return <BeneficiariesPanel />;
    default: break;
  }

  if (id === "other-bank-transfer") return <TxnFlow serviceId={id} {...OTHER_BANK_CONFIG} initialValues={prefill} initialAmount={prefill?.["amount"]} />;

  const cfg = TXN_CONFIGS[id];
  if (cfg) return <TxnFlow serviceId={id} {...cfg} initialValues={prefill} initialAmount={prefill?.["amount"]} />;

  return <RelatedPanel serviceId={id} />;
}

function ServicePage() {
  const { serviceId } = Route.useParams();
  const { ref, txn, mobile } = Route.useSearch();
  const { useService, state } = useApp();
  const nav = useNavigate();
  const svc = byId(serviceId);
  const prefill = ref ? state.recentEntities.find((r) => r.id === ref)?.prefill : undefined;

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
