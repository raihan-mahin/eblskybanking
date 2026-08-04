/* Local mock data for the incremental prototype updates.
   Everything here is prototype/demo data — not live banking data. */

import { CATEGORIES, inCategory, type Category, type Tint } from "./services";

/* ---------------- 1. Dashboard modules ---------------- */

export interface DashboardModule {
  id: string;
  label: string;
  description: string;
  locked?: boolean;
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: "quick", label: "Quick Banking / Favorites", description: "Your top services and saved shortcuts" },
  { id: "more", label: "More Services", description: "Three everyday shortcuts" },
  { id: "goals", label: "DPS, Savings & Goals", description: "Featured goal progress" },
  { id: "insights", label: "Smart Insight", description: "One personalised money insight" },
  { id: "rewards", label: "Rewards", description: "Next reward and progress" },
];

export const DEFAULT_DASHBOARD_ORDER = DASHBOARD_MODULES.map((m) => m.id);

/* ---------------- 2. Quick Banking defaults ---------------- */

export const DEFAULT_QUICK = ["fund-transfer", "recharge", "mfs-transfer"];

/** More Services — priority list; the first three not already shown in Quick Banking are used. */
export const MORE_SERVICES_PRIORITY: string[] = [
  "group-dps",
  "card-payment",
  "bill-internet",
];

export const QUICK_CATALOGUE = [
  "fund-transfer", "bill-payment", "recharge", "split-pay", "qr-payment",
  "instant-dps", "rewards", "mfs-transfer", "tuition-fee", "card-payment", "e-toll",
  "beneficiaries", "auto-pay", "savings-goals", "transaction-history",
];


/* ---------------- 3. Recipient phone directory (mock) ---------------- */

export interface DirectoryEntry {
  mobile: string;
  name: string;
  bank: string;
  account: string;
  accountType: string;
  verified: boolean;
}

export const RECIPIENT_DIRECTORY: DirectoryEntry[] = [
  { mobile: "01711223344", name: "Arnav Hasan", bank: "Eastern Bank PLC", account: "2050000012341234", accountType: "Savings", verified: true },
  { mobile: "01811223344", name: "Wasif Karim", bank: "City Bank", account: "2050887766551234", accountType: "Current", verified: true },
  { mobile: "01911556677", name: "Suddhi Roy", bank: "BRAC Bank", account: "1120334455669988", accountType: "Savings", verified: true },
  { mobile: "01521334455", name: "Taslim Ahmed", bank: "Dutch-Bangla Bank", account: "1450998877665544", accountType: "Savings", verified: true },
  { mobile: "01312445566", name: "Nusrat Jahan", bank: "Islami Bank Bangladesh PLC", account: "2033445566778899", accountType: "Mudaraba Savings", verified: true },
  { mobile: "01677889900", name: "Rahim Uddin", bank: "Prime Bank", account: "2088776655443322", accountType: "Savings", verified: true },
  { mobile: "01412009911", name: "Ammu", bank: "Dutch-Bangla Bank", account: "1029384756102938", accountType: "Savings", verified: true },
];

export const maskAccount = (acc: string) => {
  const clean = acc.replace(/\s/g, "");
  if (clean.length < 8) return clean;
  return `${clean.slice(0, 4)} **** **** ${clean.slice(-4)}`;
};

export const maskMobile = (m: string) => {
  const clean = m.replace(/[^0-9]/g, "");
  if (clean.length < 7) return m;
  return `${clean.slice(0, 3)}XX XXX ${clean.slice(-3)}`;
};

const FALLBACK_NAMES = ["Tanvir Ahmed", "Farhana Islam", "Sabbir Hossain", "Mehjabin Chowdhury", "Rafiul Karim", "Nabila Rahman", "Imran Kabir", "Sadia Noor"];
const FALLBACK_BANKS = ["Eastern Bank PLC", "Eastern Bank PLC", "BRAC Bank", "City Bank", "Dutch-Bangla Bank"];

export const lookupMobile = (m: string): DirectoryEntry | null => {
  const clean = m.replace(/[^0-9]/g, "");
  const hit = RECIPIENT_DIRECTORY.find((d) => d.mobile === clean);
  if (hit) return hit;
  if (!/^01[3-9]\d{8}$/.test(clean)) return null;
  const seed = clean.split("").reduce((a, c) => a + Number(c), 0);
  const bank = FALLBACK_BANKS[seed % FALLBACK_BANKS.length]!;
  return {
    name: FALLBACK_NAMES[seed % FALLBACK_NAMES.length]!,
    mobile: clean,
    bank,
    account: `${bank === "Eastern Bank PLC" ? "1101" : "3402"}${clean.slice(3, 7)}${clean.slice(-4)}`,
    accountType: seed % 3 === 0 ? "Current" : "Savings",
    verified: seed % 4 !== 0,
  };

};


/* ---------------- 4. Recharge operator detection ---------------- */

export const OPERATOR_PREFIX: Record<string, string> = {
  "013": "Grameenphone",
  "017": "Grameenphone",
  "014": "Banglalink",
  "019": "Banglalink",
  "015": "Teletalk",
  "016": "Airtel",
  "018": "Robi",
};

export const OPERATORS = ["Grameenphone", "Robi", "Airtel", "Banglalink", "Teletalk"];

export const detectOperator = (mobile: string) => {
  const clean = mobile.replace(/[^0-9]/g, "");
  if (clean.length < 3) return null;
  return OPERATOR_PREFIX[clean.slice(0, 3)] ?? null;
};

export const SAVED_MOBILES: { number: string; name: string }[] = [
  { number: "01677889900", name: "Rahim Uddin" },
  { number: "01711223344", name: "Arnav Hasan" },
  { number: "01712345678", name: "My Number" },
  { number: "01911556677", name: "Suddhi Roy" },
];

export const savedMobileName = (m: string) => {
  const clean = m.replace(/[^0-9]/g, "");
  return SAVED_MOBILES.find((s) => s.number === clean)?.name ?? null;
};

/* ---------------- 5. Recharge package catalogue (prototype data) ---------------- */

export type PackType = "Amount" | "Minutes" | "Internet" | "SMS" | "Bundle";

export interface RechargePack {
  id: string;
  operator: string;
  type: PackType;
  title: string;
  detail: string;
  validity: string;
  price: number;
  original?: number;
  badge?: string;
}

const packs = (operator: string, seed: number): RechargePack[] => [
  { id: `${operator}-i1`, operator, type: "Internet", title: "5 GB Internet", detail: "5 GB data", validity: "7 days", price: 198 + seed, original: 248 + seed, badge: "Best Internet Deal" },
  { id: `${operator}-i2`, operator, type: "Internet", title: "25 GB Internet", detail: "25 GB data", validity: "30 days", price: 598 + seed, original: 698 + seed, badge: "Best Value" },
  { id: `${operator}-m1`, operator, type: "Minutes", title: "200 Minutes", detail: "200 min any operator", validity: "30 days", price: 197 + seed, original: 229 + seed, badge: "Best Minutes Deal" },
  { id: `${operator}-m2`, operator, type: "Minutes", title: "60 Minutes", detail: "60 min any operator", validity: "7 days", price: 78 + seed },
  { id: `${operator}-s1`, operator, type: "SMS", title: "500 SMS", detail: "500 SMS any operator", validity: "30 days", price: 49 },
  { id: `${operator}-b1`, operator, type: "Bundle", title: "Combo 10 GB + 300 Min", detail: "10 GB · 300 min · 100 SMS", validity: "30 days", price: 549 + seed, original: 649 + seed, badge: "Most Popular" },
  { id: `${operator}-b2`, operator, type: "Bundle", title: "EBL Card Combo", detail: "8 GB · 200 min", validity: "30 days", price: 399 + seed, original: 499 + seed, badge: "EBL User Offer" },
];

export const RECHARGE_PACKS: RechargePack[] = [
  ...packs("Grameenphone", 0),
  ...packs("Robi", 2),
  ...packs("Airtel", 1),
  ...packs("Banglalink", 3),
  ...packs("Teletalk", -4),
];

export const AMOUNT_PRESETS = [29, 49, 99, 199, 300, 500, 1000];

/* ---------------- 6. Reward partner offers (mock campaigns) ---------------- */

export interface PartnerOffer {
  id: string;
  partner: string;
  category: string;
  title: string;
  discount: string;
  maxBenefit: number;
  minSpend: number;
  points: number;
  expiry: string;
  terms: string[];
  color: string;
  icon: string;
  tint: Tint;
}

export const REWARD_CATEGORIES = [
  "Movies & Entertainment", "Dining", "Shopping & Fashion", "Travel", "Education", "Bills & Recharge", "Birthday Offers",
];

export const PARTNER_OFFERS: PartnerOffer[] = [
  { id: "po-cineplex", partner: "Star Cineplex", category: "Movies & Entertainment", title: "10% off selected movie tickets", discount: "10%", maxBenefit: 300, minSpend: 0, points: 400, expiry: "31 Dec 2026", terms: ["Valid on selected shows", "Cannot be combined with other campaigns", "Prototype demo offer"], color: "#7C3AED", icon: "Tv", tint: "purple" },
  { id: "po-yumcha", partner: "Yum Cha", category: "Dining", title: "15% discount on dine-in", discount: "15%", maxBenefit: 500, minSpend: 1500, points: 600, expiry: "31 Dec 2026", terms: ["Minimum spend ৳1,500", "Dine-in only", "Prototype demo offer"], color: "#DC2626", icon: "HeartHandshake", tint: "pink" },
  { id: "po-starkabab", partner: "Star Kabab", category: "Dining", title: "10% discount on total bill", discount: "10%", maxBenefit: 300, minSpend: 1000, points: 350, expiry: "31 Dec 2026", terms: ["Minimum spend ৳1,000", "Prototype demo offer"], color: "#B45309", icon: "HeartHandshake", tint: "yellow" },
  { id: "po-richman", partner: "Richman", category: "Shopping & Fashion", title: "12% discount on selected purchases", discount: "12%", maxBenefit: 1000, minSpend: 2000, points: 700, expiry: "31 Dec 2026", terms: ["Selected items only", "Prototype demo offer"], color: "#1F2937", icon: "ShoppingBag", tint: "gray" },
  { id: "po-illiyeen", partner: "ILLIYEEN", category: "Shopping & Fashion", title: "10% discount on selected purchases", discount: "10%", maxBenefit: 800, minSpend: 1500, points: 500, expiry: "31 Dec 2026", terms: ["Selected items only", "Prototype demo offer"], color: "#0F766E", icon: "ShoppingBag", tint: "green" },
  { id: "po-gentlepark", partner: "Gentle Park", category: "Shopping & Fashion", title: "15% discount on selected purchases", discount: "15%", maxBenefit: 1200, minSpend: 2500, points: 900, expiry: "31 Dec 2026", terms: ["Selected items only", "Prototype demo offer"], color: "#1D4ED8", icon: "ShoppingBag", tint: "blue" },
  { id: "po-usbangla", partner: "US-Bangla Airlines", category: "Travel", title: "8% off domestic tickets", discount: "8%", maxBenefit: 1500, minSpend: 5000, points: 1200, expiry: "31 Dec 2026", terms: ["Domestic routes only", "Prototype demo offer"], color: "#0EA5E9", icon: "Plane", tint: "blue" },
  { id: "po-tenminute", partner: "10 Minute School", category: "Education", title: "20% off course bundles", discount: "20%", maxBenefit: 1000, minSpend: 1000, points: 600, expiry: "31 Dec 2026", terms: ["Selected courses", "Prototype demo offer"], color: "#F59E0B", icon: "GraduationCap", tint: "yellow" },
  { id: "po-recharge", partner: "EBL Recharge", category: "Bills & Recharge", title: "৳100 recharge voucher", discount: "৳100", maxBenefit: 100, minSpend: 0, points: 800, expiry: "31 Dec 2026", terms: ["One voucher per month", "Prototype demo offer"], color: "#16A34A", icon: "Smartphone", tint: "green" },
  { id: "po-birthday", partner: "Yum Cha", category: "Birthday Offers", title: "50% off up to ৳500 on your birthday", discount: "50%", maxBenefit: 500, minSpend: 0, points: 0, expiry: "Valid for 7 days from your birthday", terms: ["Valid only in your birthday month", "One-time use", "Prototype demo offer"], color: "#DB2777", icon: "Gift", tint: "pink" },
];

export const offerById = (id: string) => PARTNER_OFFERS.find((o) => o.id === id);

/* ---------------- 7. Islamic mode ---------------- */

export const ISLAMIC_SERVICES: { id: string; label: string; icon: string; tint: Tint; target: string }[] = [
  { id: "is-account", label: "Islamic Account", icon: "Landmark", tint: "green", target: "accounts" },
  { id: "is-mudaraba", label: "Mudaraba DPS", icon: "PiggyBank", tint: "green", target: "dps" },
  { id: "is-deposit", label: "Mudaraba Deposit", icon: "Coins", tint: "green", target: "fdr" },
  { id: "is-finance", label: "Islamic Financing", icon: "Banknote", tint: "green", target: "loans" },
  { id: "is-zakat", label: "Zakat", icon: "HeartHandshake", tint: "green", target: "zakat" },
  { id: "is-hajj", label: "Hajj Savings", icon: "Moon", tint: "green", target: "savings-goals" },
];

/* ---------------- 8. Disputes ---------------- */

export const DISPUTE_ISSUES = [
  "Money deducted but recipient not credited",
  "Duplicate charge",
  "Incorrect amount",
  "Unauthorized transaction",
  "Bill not updated",
  "Recharge not received",
  "Gift card not received",
  "Other",
];

export const DISPUTE_STAGES = ["Submitted", "Under Review", "Additional Information Required", "Resolved", "Rejected"];

/* ---------------- 9. Human support queue ---------------- */

export const SUPPORT_QUEUE = {
  agents: 4,
  position: 2,
  wait: "About 3 minutes",
  helpline: "16230",
};

export const HANDOFF_KEYWORDS = ["human", "agent", "representative", "person", "talk to a person", "not helpful", "didn't help", "did not help"];

/* ---------------- 10. Demo indicative rates ---------------- */

export const DEMO_RATES: { pair: string; rate: string }[] = [
  { pair: "USD / BDT", rate: "121.50" },
  { pair: "EUR / BDT", rate: "132.10" },
  { pair: "GBP / BDT", rate: "155.40" },
  { pair: "SAR / BDT", rate: "32.35" },
];

export const DEMO_RATE_TIMESTAMP = "Locally configured · 01 Jan 2026, 10:00 AM";

/* ---------------- 11. Next reward challenge (single active) ---------------- */

export const NEXT_REWARD = {
  offerId: "po-gentlepark",
  partner: "Gentle Park",
  title: "Unlock 10% off at Gentle Park",
  target: 2500,
  progress: 2000,
  expiry: "31 Dec 2026",
};

/* ---------------- 12. Category-driven groups (3 primary + See All) ----------------
   Explore and Pay & Transfer are both generated from the master taxonomy in
   src/lib/services.ts, so a service can never change category between pages. */

export interface ExploreItem {
  key: string;
  label?: string;
  serviceId?: string;
  route?: string;
  icon?: string;
  tint?: Tint;
}

export interface ExploreGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tint: Tint;
  primary: ExploreItem[];
  more: string[];
}

/** First three services shown as the compact preview for each category. */
export const CATEGORY_PRIORITY: Record<string, string[]> = {
  transfers: ["fund-transfer", "other-bank-transfer", "mfs-transfer"],
  everyday: ["recharge", "qr-payment", "card-payment"],
  utility: ["bill-electricity", "bill-gas", "bill-internet"],
  edugov: ["tuition-fee", "visa-fee", "e-challan"],
  travel: ["air-tickets", "hotel-booking", "movie-tickets"],
  donations: ["donation", "zakat", "charity-campaigns"],
  scheduled: ["auto-pay", "scheduled-transfer", "scheduled-recharge"],
  account: ["accounts", "statements", "account-sharing"],
  cards: ["my-card", "card-controls", "activate-card"],
  savings: ["instant-dps", "group-dps", "savings-goals"],
  loans: ["early-salary", "loans", "loan-calculator"],
  ai: ["ai-money-manager", "ai-advisor", "voice-assistant"],
  rewards: ["rewards", "next-reward", "partner-offers"],
  security: ["ai-support", "security-settings", "disputes"],
  skybanking: ["personalization", "customize-dashboard", "notifications"],
};

const groupFor = (c: Category): ExploreGroup => {
  const all = inCategory(c.id).map((x) => x.id);
  const primary = (CATEGORY_PRIORITY[c.id] ?? all.slice(0, 3)).filter((id) => all.includes(id));
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    icon: c.icon,
    tint: c.tint,
    primary: primary.map((id) => ({ key: id, serviceId: id })),
    more: all.filter((id) => !primary.includes(id)),
  };
};

export const EXPLORE_GROUPS: ExploreGroup[] = CATEGORIES.map(groupFor);

/* ---------------- 13. Pay & Transfer groups (payment categories only) ---------------- */

export interface PayGroup { id: string; title: string; subtitle: string; primary: { id: string; label?: string }[]; more: string[] }

export const PAY_GROUPS: PayGroup[] = CATEGORIES.filter((c) => c.payment).map((c) => {
  const g = groupFor(c);
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    primary: g.primary.map((p) => ({ id: p.serviceId! })),
    more: g.more,
  };
});

/* ---------------- 14. Travel & entertainment demo offers ---------------- */

export interface TravelOffer {
  serviceId: string;
  title: string;
  blurb: string;
  offer: string;
  discount: string;
  maxBenefit: string;
  minSpend: string;
  eligible: string;
  expiry: string;
  terms: string[];
  partner: string;
  partnerUrl?: string;
}

export const TRAVEL_OFFERS: TravelOffer[] = [
  {
    serviceId: "air-tickets",
    title: "Air Tickets",
    blurb: "Book domestic and international flights through an EBL travel partner.",
    offer: "Save 10% on selected air-ticket bookings when paying with an eligible EBL card.",
    discount: "10%",
    maxBenefit: "৳3,000",
    minSpend: "৳10,000",
    eligible: "EBL Credit or Debit Card",
    expiry: "31 Dec 2026",
    terms: ["Selected routes and fare classes only", "Discount applied by the partner at checkout", "Demo offer for prototype purposes"],
    partner: "EBL Travel Partner",
    partnerUrl: "https://www.ebl.com.bd/",
  },
  {
    serviceId: "hotel-booking",
    title: "Hotel Booking",
    blurb: "Reserve hotels and resorts with an EBL card benefit.",
    offer: "Get up to 12% off selected hotel bookings with an eligible EBL card.",
    discount: "12%",
    maxBenefit: "৳4,000",
    minSpend: "৳6,000",
    eligible: "EBL Credit Card or EBL Savings Account card",
    expiry: "31 Dec 2026",
    terms: ["Selected properties only", "Blackout dates may apply", "Demo offer for prototype purposes"],
    partner: "EBL Hotel Partner",
    partnerUrl: "https://www.ebl.com.bd/",
  },
  {
    serviceId: "movie-tickets",
    title: "Movie Tickets",
    blurb: "Book cinema tickets, including Star Cineplex shows.",
    offer: "Get 10% off selected Star Cineplex tickets.",
    discount: "10%",
    maxBenefit: "৳300",
    minSpend: "৳500",
    eligible: "EBL Credit or Debit Card",
    expiry: "31 Dec 2026",
    terms: ["Selected shows and seats only", "Cannot be combined with other campaigns", "Demo offer for prototype purposes"],
    partner: "Star Cineplex",
  },
  {
    serviceId: "star-cineplex",
    title: "Star Cineplex",
    blurb: "Star Cineplex ticket benefit for EBL cardholders.",
    offer: "Get 10% off selected Star Cineplex tickets.",
    discount: "10%",
    maxBenefit: "৳300",
    minSpend: "৳500",
    eligible: "EBL Credit or Debit Card",
    expiry: "31 Dec 2026",
    terms: ["Selected shows only", "Demo offer for prototype purposes"],
    partner: "Star Cineplex",
  },
];

export const travelOfferFor = (serviceId: string) => TRAVEL_OFFERS.find((t) => t.serviceId === serviceId);

