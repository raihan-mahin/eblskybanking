export type ID = string;

export interface Account {
  id: ID;
  name: string;
  masked: string;
  balance: number;
  type: "savings" | "current" | "card";
}

export interface Txn {
  id: ID;
  title: string;
  serviceId: string;
  category: string;
  amount: number;
  fee: number;
  direction: "debit" | "credit";
  status: "success" | "failed" | "pending";
  date: string;
  note?: string | undefined;
  points: number;
  ref: string;
  meta?: Record<string, string> | undefined;
}

export interface Notification {
  id: ID;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "txn" | "security" | "reward" | "info";
}

export interface Beneficiary {
  id: ID;
  name: string;
  bank: string;
  account: string;
  kind: "ebl" | "other" | "mfs" | "own";
}

export interface CardItem {
  id: ID;
  name: string;
  masked: string;
  kind: "credit" | "debit" | "prepaid";
  balance: number;
  frozen: boolean;
  online: boolean;
  intl: boolean;
  contactless: boolean;
  limit: number;
  pinSet: boolean;
  active: boolean;
}

export interface Goal {
  id: ID;
  title: string;
  icon: string;
  target: number;
  saved: number;
  monthly: number;
  date: string;
  auto: boolean;
}

export interface GroupMember {
  name: string;
  status: "Paid" | "Pending";
}

export interface GroupDPS {
  id: ID;
  title: string;
  target: number;
  saved: number;
  monthly: number;
  next: string;
  members: GroupMember[];
  activity: { id: ID; text: string; date: string; amount: number; status: string }[];
}

export interface SplitPay {
  id: ID;
  title: string;
  total: number;
  note?: string | undefined;
  direction: "sent" | "received";
  from: string;
  status: "Requested" | "Pending" | "Partially Paid" | "Paid" | "Declined" | "Cancelled";
  participants: { name: string; amount: number; paid: boolean }[];
  date: string;
}

export interface Schedule {
  id: ID;
  name: string;
  serviceType: string;
  recipient: string;
  amount: number;
  frequency: "Monthly" | "Weekly" | "Quarterly" | "Once";
  start: string;
  end?: string | undefined;
  account: string;
  reminder: boolean;
  active: boolean;
  autoPay: boolean;
  history: { date: string; amount: number; status: string }[];
}

export interface Receipt {
  id: ID;
  txnId: ID;
  title: string;
  amount: number;
  date: string;
  ref: string;
  status: string;
}

export interface RewardHistory {
  id: ID;
  title: string;
  points: number;
  date: string;
}

export interface RewardOffer {
  id: ID;
  title: string;
  cost: number;
  value: string;
  kind: string;
}

export interface Mission {
  id: ID;
  title: string;
  progress: number;
  goal: number;
  points: number;
  expiry: string;
}

export interface Ticket {
  id: ID;
  category: string;
  subject: string;
  description: string;
  txnId?: string | undefined;
  contact: string;
  status: "Submitted" | "In Review" | "Resolved";
  date: string;
}

export interface Insight {
  id: ID;
  text: string;
  action: string;
  target: string;
  tone: "info" | "warn" | "good";
}

export interface RecentEntity {
  id: ID;
  serviceId: string;
  label: string;
  entity: string;
  masked: string;
  detail: string;
  date: string;
  amount: number;
  icon: string;
  tint: "yellow" | "green" | "blue" | "purple" | "pink" | "gray";
  prefill: Record<string, string>;
  /** How many times this recipient/action has been repeated (frequency ranking). */
  count?: number;
  /** Saved as a Favorite shortcut (defaults to true for existing saved data). */
  favorite?: boolean;
}


export interface DisputeUpdate {
  stage: string;
  date: string;
  note: string;
}

export interface Dispute {
  id: ID;
  txnId: string;
  txnTitle: string;
  amount: number;
  date: string;
  issue: string;
  description: string;
  contact: string;
  attachment: boolean;
  status: "Submitted" | "Under Review" | "Additional Information Required" | "Resolved" | "Rejected";
  expected: string;
  timeline: DisputeUpdate[];
}

export interface NfcShare {
  id: ID;
  accountName: string;
  method: string;
  date: string;
}

export interface AppState {

  loggedIn: boolean;
  demoMode: boolean;
  user: { name: string; mobile: string; email: string; greeting: string };
  security: {
    pin: string;
    fingerprint: boolean;
    faceId: boolean;
    preferred: "fingerprint" | "faceid" | "pin";
    alerts: boolean;
    autoLogout: string;
    devices: { id: ID; name: string; last: string }[];
    sessions: { id: ID; name: string; last: string }[];
    history: { id: ID; name: string; date: string; status: string }[];
  };
  accessibility: {
    textSize: "normal" | "large" | "xlarge";
    contrast: boolean;
    reduceMotion: boolean;
    voiceGuidance: boolean;
    speechSpeed: number;
    language: "English" | "Bangla";
    focus: boolean;
  };
  personalization: { enabled: boolean; pinned: string[]; hidden: string[] };
  accounts: Account[];
  cards: CardItem[];
  transactions: Txn[];
  notifications: Notification[];
  beneficiaries: Beneficiary[];
  banks: string[];
  mfs: string[];
  billers: { id: ID; name: string; type: string; customer: string }[];
  mobiles: { id: ID; number: string; operator: string }[];
  goals: Goal[];
  dps: { id: ID; title: string; monthly: number; saved: number; target: number; matures: string }[];
  fdr: { id: ID; title: string; amount: number; rate: number; matures: string }[];
  groupDps: GroupDPS[];
  splits: SplitPay[];
  schedules: Schedule[];
  receipts: Receipt[];
  rewards: {
    points: number;
    monthPoints: number;
    expiring: number;
    history: RewardHistory[];
    offers: RewardOffer[];
    missions: Mission[];
  };
  recent: { serviceId: string; date: string }[];
  usage: Record<string, number>;
  tickets: Ticket[];
  chat: { id: ID; role: "user" | "bot"; text: string }[];
  esa: {
    salary: number;
    limit: number;
    status: "Eligible" | "Submitted" | "Approved" | "Disbursed" | "Repayment Pending" | "Repaid";
    amount: number;
    fee: number;
  };
  onboarding: { submitted: boolean; accountNumber?: string; type?: string };
  insights: Insight[];
  giftCards: { id: ID; brand: string; value: number; code: string; date: string }[];
  dashboard: { order: string[]; hidden: string[] };
  quickBanking: string[];
  recentEntities: RecentEntity[];
  disputes: Dispute[];
  islamic: { mode: "conventional" | "islamic"; hasAccount: boolean };
  offers: { saved: string[]; used: string[] };
  nfcShares: NfcShare[];
  birthday: { name: string; date: string; offerId: string; read: boolean; saved: boolean; dismissed: boolean };
  supportHandoff: { escalated: boolean; ticketId: string | null };
  /** One-time local data migration marker. */
  migration?: number;
}


