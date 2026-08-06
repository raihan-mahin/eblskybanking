import { DEFAULT_DASHBOARD_ORDER, DEFAULT_QUICK } from "./extras";
import type { AppState } from "./types";

const uid = (p: string, i: number) => `${p}-${i}`;

export const BANKS = [
  "City Bank",
  "BRAC Bank",
  "Islami Bank Bangladesh PLC",
  "Dutch-Bangla Bank",
  "Eastern Bank PLC",
  "Standard Chartered Bangladesh",
  "Bank Asia",
  "Prime Bank",
  "Mutual Trust Bank",
  "United Commercial Bank",
];

export const MFS = ["bKash", "Nagad", "Rocket", "Upay"];

/** Frequent Transactions — repeated recipients, billers and actions (prototype data). */
export const FREQUENT_SEED: AppState["recentEntities"] = [
  {
    id: "fr-self-recharge", serviceId: "recharge", label: "Self Recharge", entity: "My Number", masked: "017XX XXX 678",
    detail: "Grameenphone · ৳300 last time", date: "Today, 5:10 PM", amount: 300, icon: "Smartphone", tint: "green",
    count: 12,
    prefill: { mobile: "01712345678", operator: "Grameenphone", contact: "My Number", amount: "300" },
  },
  {
    id: "fr-bariwala", serviceId: "fund-transfer", label: "Bariwala", entity: "Kamrul Islam (Bariwala)", masked: "1102 **** **** 7788",
    detail: "Eastern Bank PLC · ৳12,000 last time", date: "Yesterday, 8:02 PM", amount: 12000, icon: "ArrowLeftRight", tint: "yellow",
    count: 9,
    prefill: { beneficiary: "Kamrul Islam (Bariwala)", bank: "Eastern Bank PLC", account: "1102938477887788", amount: "12000" },
  },
  {
    id: "fr-home-internet", serviceId: "bill-internet", label: "Home Internet Bill", entity: "Link3", masked: "ID link3-88213",
    detail: "Internet · ৳1,200 last time", date: "8 May, 2025", amount: 1200, icon: "Globe", tint: "purple",
    count: 7,
    prefill: { biller: "Link3", account: "link3-88213", customer: "link3-88213", amount: "1200" },
  },
  {
    id: "fr-desco", serviceId: "bill-electricity", label: "Electricity Bill", entity: "DESCO", masked: "Acc 4453 **** 21",
    detail: "Electricity · ৳1,840 last time", date: "Today, 4:20 PM", amount: 1840, icon: "Zap", tint: "blue",
    count: 6,
    prefill: { biller: "DESCO", account: "44531234521", customer: "44531234521", amount: "1840" },
  },
  {
    id: "fr-rahim", serviceId: "recharge", label: "Recharge Rahim", entity: "Rahim Uddin", masked: "016XX XXX 900",
    detail: "Airtel · ৳300 last time", date: "11 May, 2025", amount: 300, icon: "Smartphone", tint: "green",
    count: 4,
    prefill: { mobile: "01677889900", operator: "Airtel", contact: "Rahim Uddin", amount: "300" },
  },
  {
    id: "fr-arnav", serviceId: "fund-transfer", label: "Transfer to Arnav", entity: "Arnav Hasan", masked: "2050 **** **** 1234",
    detail: "Eastern Bank PLC · ৳2,500 last time", date: "7 May, 2025", amount: 2500, icon: "ArrowLeftRight", tint: "yellow",
    count: 3,
    prefill: { beneficiary: "Arnav Hasan", bank: "Eastern Bank PLC", account: "2050000012341234", amount: "2500" },
  },
  {
    id: "fr-tuition", serviceId: "tuition-fee", label: "Tuition Fee", entity: "BRAC University", masked: "Student 21301****",
    detail: "Education · ৳12,500 last time", date: "12 May, 2025", amount: 12500, icon: "GraduationCap", tint: "green",
    count: 2,
    prefill: { institution: "BRAC University", student: "21301234", amount: "12500" },
  },
];


export const seedState = (): AppState => ({
  loggedIn: false,
  demoMode: false,
  user: {
    name: "Abu Raihan Mahin",
    mobile: "01712-345678",
    email: "mahin@example.com",
    greeting: "Good Evening",
  },
  security: {
    pin: "1234",
    fingerprint: true,
    faceId: false,
    preferred: "fingerprint",
    alerts: true,
    autoLogout: "5 minutes",
    devices: [
      { id: "d1", name: "Pixel 8 · Dhaka", last: "Today, 7:12 PM" },
      { id: "d2", name: "iPad Air · Dhaka", last: "10 May, 2025" },
    ],
    sessions: [{ id: "s1", name: "This device · Android", last: "Active now" }],
    history: [
      { id: "h1", name: "Pixel 8", date: "Today, 7:12 PM", status: "Success" },
      { id: "h2", name: "Unknown device", date: "9 May, 2025", status: "Blocked" },
      { id: "h3", name: "iPad Air", date: "8 May, 2025", status: "Success" },
    ],
  },
  accessibility: {
    textSize: "normal",
    contrast: false,
    reduceMotion: false,
    voiceGuidance: false,
    speechSpeed: 1,
    language: "English",
    focus: true,
  },
  personalization: { enabled: true, pinned: [], hidden: [] },
  accounts: [
    { id: "acc-1", name: "EBL Savings Account", masked: "XXXX XXXX XXXX 1234", balance: 9950, type: "savings" },
  ],
  cards: [
    { id: "card-1", name: "My Card", masked: "4212 XXXX XXXX 7781", kind: "credit", balance: 42000, frozen: false, online: true, intl: false, contactless: true, limit: 100000, pinSet: true, active: true },
  ],

  transactions: [
    { id: "t1", title: "MFS Transfer — bKash", serviceId: "mfs-transfer", category: "Transfer", amount: 3000, fee: 0, direction: "debit", status: "success", date: "Today, 6:45 PM", points: 0, ref: "EBL8241001" },

    { id: "t2", title: "Electricity Bill — DESCO", serviceId: "bill-electricity", category: "Bills", amount: 1840, fee: 0, direction: "debit", status: "success", date: "Today, 4:20 PM", points: 18, ref: "EBL8241002" },
    { id: "t3", title: "Split Pay — Dinner at Banani", serviceId: "split-pay", category: "Split Pay", amount: 1000, fee: 0, direction: "debit", status: "success", date: "Yesterday, 9:15 PM", points: 10, ref: "EBL8241003" },
    { id: "t4", title: "Tuition Fee — BRAC University", serviceId: "tuition-fee", category: "Education", amount: 12500, fee: 20, direction: "debit", status: "success", date: "12 May, 2025", points: 125, ref: "EBL8241004" },
    { id: "t5", title: "Recharge — Grameenphone", serviceId: "recharge", category: "Recharge", amount: 300, fee: 0, direction: "debit", status: "success", date: "11 May, 2025", points: 3, ref: "EBL8241005" },
    { id: "t6", title: "Salary Credit", serviceId: "salary", category: "Income", amount: 70000, fee: 0, direction: "credit", status: "success", date: "10 May, 2025", points: 0, ref: "EBL8241006" },
    { id: "t7", title: "Internet Bill — Link3", serviceId: "bill-internet", category: "Bills", amount: 1200, fee: 0, direction: "debit", status: "success", date: "8 May, 2025", points: 12, ref: "EBL8241007" },
    { id: "t8", title: "Fund Transfer — Arnav", serviceId: "fund-transfer", category: "Transfer", amount: 5000, fee: 10, direction: "debit", status: "success", date: "7 May, 2025", points: 0, ref: "EBL8241008" },
    { id: "t9", title: "Card Payment — EBL Visa", serviceId: "card-payment", category: "Cards", amount: 8000, fee: 0, direction: "debit", status: "success", date: "6 May, 2025", points: 80, ref: "EBL8241009" },
    { id: "t10", title: "Netflix Gift Card", serviceId: "gift-netflix", category: "Entertainment", amount: 1500, fee: 0, direction: "debit", status: "success", date: "5 May, 2025", points: 15, ref: "EBL8241010" },
    { id: "t11", title: "Grocery — Shwapno", serviceId: "qr-payment", category: "Shopping", amount: 2350, fee: 0, direction: "debit", status: "success", date: "4 May, 2025", points: 23, ref: "EBL8241011" },
    { id: "t12", title: "DPS Contribution", serviceId: "dps", category: "Savings", amount: 2000, fee: 0, direction: "debit", status: "success", date: "3 May, 2025", points: 20, ref: "EBL8241012" },
    { id: "t13", title: "Gas Bill — Titas", serviceId: "bill-gas", category: "Bills", amount: 1080, fee: 0, direction: "debit", status: "success", date: "2 May, 2025", points: 10, ref: "EBL8241013" },
    { id: "t14", title: "MFS Transfer — Nagad", serviceId: "mfs-transfer", category: "Transfer", amount: 2500, fee: 15, direction: "debit", status: "failed", date: "1 May, 2025", points: 0, ref: "EBL8241014" },
    { id: "t15", title: "Group DPS — Sri Lanka\u00a0Trip", serviceId: "group-dps", category: "Savings", amount: 500, fee: 0, direction: "debit", status: "success", date: "15 Apr, 2025", points: 5, ref: "EBL8241015" },
  ],
  notifications: [
    { id: "n1", title: "Transfer successful", body: "৳3,000 sent to bKash wallet.", date: "Today, 6:45 PM", read: false, kind: "txn" },
    { id: "n2", title: "Bill paid", body: "DESCO electricity bill of ৳1,840 paid.", date: "Today, 4:20 PM", read: false, kind: "txn" },
    { id: "n3", title: "Split request", body: "Arnav requested ৳750 for Lunch.", date: "Yesterday", read: false, kind: "info" },
    { id: "n4", title: "Reward points earned", body: "You earned 125 points from tuition payment.", date: "12 May, 2025", read: true, kind: "reward" },
    { id: "n5", title: "Security alert", body: "Login attempt blocked from unknown device.", date: "9 May, 2025", read: true, kind: "security" },
    { id: "n6", title: "Bill due soon", body: "Link3 internet bill due in 3 days.", date: "8 May, 2025", read: true, kind: "info" },
    { id: "n7", title: "Group DPS", body: "Wasif contribution is pending.", date: "15 Apr, 2025", read: true, kind: "info" },
    { id: "n8", title: "Early Salary Access", body: "You are eligible for up to ৳20,000.", date: "10 Apr, 2025", read: true, kind: "info" },
  ],
  beneficiaries: [
    { id: "b1", name: "Arnav Hasan", bank: "Eastern Bank PLC", account: "1102938475601", kind: "ebl" },
    { id: "b2", name: "Taslim Ahmed", bank: "BRAC Bank", account: "2039485762013", kind: "other" },
    { id: "b3", name: "Suddhi Roy", bank: "City Bank", account: "3948576201948", kind: "other" },
    { id: "b4", name: "Wasif Karim", bank: "bKash", account: "01811-223344", kind: "mfs" },
    { id: "b5", name: "Ammu", bank: "Dutch-Bangla Bank", account: "1029384756102", kind: "other" },
    { id: "b6", name: "My Current Account", bank: "Eastern Bank PLC", account: "XXXX 8890", kind: "own" },
  ],
  banks: BANKS,
  mfs: MFS,
  billers: [
    { id: "bl1", name: "DESCO", type: "Electricity", customer: "4410029384" },
    { id: "bl2", name: "Titas Gas", type: "Gas", customer: "9928374611" },
    { id: "bl3", name: "Dhaka WASA", type: "Water", customer: "5561200394" },
    { id: "bl4", name: "Link3 Broadband", type: "Internet", customer: "LK-882910" },
    { id: "bl5", name: "Akash DTH", type: "TV", customer: "AK-772014" },
  ],
  mobiles: [
    { id: "m1", number: "01712-345678", operator: "Grameenphone" },
    { id: "m2", number: "01811-223344", operator: "Banglalink" },
    { id: "m3", number: "01911-556677", operator: "Banglalink" },
    { id: "m4", number: "01611-889900", operator: "Banglalink" },
    { id: "m5", number: "01521-334455", operator: "Teletalk" },
  ],
  goals: [
    { id: "g1", title: "Sri Lanka\u00a0Trip", icon: "Plane", target: 100000, saved: 62500, monthly: 5000, date: "Dec 2025", auto: true },
    { id: "g2", title: "New iPhone", icon: "Smartphone", target: 150000, saved: 10000, monthly: 6000, date: "Oct 2026", auto: false },
  ],
  dps: [
    { id: "dp1", title: "EBL DPS 5 Year", monthly: 2000, saved: 48000, target: 120000, matures: "Jan 2029" },
    { id: "dp2", title: "EBL Student DPS", monthly: 1000, saved: 12000, target: 60000, matures: "Aug 2030" },
  ],
  fdr: [{ id: "f1", title: "EBL Fixed Deposit", amount: 100000, rate: 8.25, matures: "Feb 2027" }],
  groupDps: [
    {
      id: "gd1",
      title: "Sri Lanka\u00a0Trip",
      target: 100000,
      saved: 62500,
      monthly: 500,
      next: "15 May 2024",
      members: [
        { name: "Mahin", status: "Paid" },
        { name: "Arnav", status: "Paid" },
        { name: "Taslim", status: "Paid" },
        { name: "Suddhi", status: "Pending" },
        { name: "Wasif", status: "Pending" },
      ],
      activity: [
        { id: "ga1", text: "Mahin contributed ৳500", date: "15 Apr 2024, 10:30 AM", amount: 500, status: "success" },
        { id: "ga2", text: "Wasif is pending", date: "15 Apr 2024, 10:30 AM", amount: 0, status: "pending" },
      ],
    },
  ],
  splits: [
    {
      id: "sp1", title: "Dinner at Banani", total: 5000, direction: "sent", from: "Mahin", status: "Partially Paid", date: "Yesterday",
      participants: [
        { name: "Mahin", amount: 1000, paid: true },
        { name: "Arnav", amount: 1000, paid: true },
        { name: "Taslim", amount: 1000, paid: false },
        { name: "Suddhi", amount: 1000, paid: false },
        { name: "Wasif", amount: 1000, paid: false },
      ],
    },
    { id: "sp2", title: "Lunch at Dhanmondi", total: 1500, direction: "received", from: "Arnav", status: "Requested", date: "Yesterday", participants: [{ name: "Mahin", amount: 750, paid: false }, { name: "Arnav", amount: 750, paid: true }] },
    { id: "sp3", title: "Cox's Bazar Hotel", total: 12000, direction: "received", from: "Taslim", status: "Requested", date: "10 May, 2025", participants: [{ name: "Mahin", amount: 3000, paid: false }, { name: "Taslim", amount: 3000, paid: true }, { name: "Suddhi", amount: 3000, paid: true }, { name: "Wasif", amount: 3000, paid: false }] },
    { id: "sp4", title: "Office Gift", total: 2400, direction: "sent", from: "Mahin", status: "Paid", date: "2 May, 2025", participants: [{ name: "Mahin", amount: 800, paid: true }, { name: "Arnav", amount: 800, paid: true }, { name: "Suddhi", amount: 800, paid: true }] },
  ],
  schedules: [
    { id: "sc1", name: "Family Transfer", serviceType: "Transfer", recipient: "Ammu · DBBL", amount: 10000, frequency: "Monthly", start: "01 Jun 2025", account: "EBL Savings Account", reminder: true, active: true, autoPay: false, history: [{ date: "01 May 2025", amount: 10000, status: "Success" }] },
    { id: "sc2", name: "Sri Lanka\u00a0Trip Saving", serviceType: "DPS", recipient: "Group DPS — Sri Lanka\u00a0Trip", amount: 500, frequency: "Monthly", start: "15 Jun 2025", account: "EBL Savings Account", reminder: true, active: true, autoPay: false, history: [] },
    { id: "sc3", name: "Monthly Recharge", serviceType: "Recharge", recipient: "01712-345678", amount: 300, frequency: "Monthly", start: "05 Jun 2025", account: "EBL Savings Account", reminder: false, active: false, autoPay: false, history: [] },
  ],
  receipts: Array.from({ length: 10 }).map((_, i) => ({
    id: uid("r", i + 1),
    txnId: uid("t", i + 1),
    title: [
      "MFS Transfer — bKash", "Electricity Bill — DESCO", "Split Pay — Dinner at Banani", "Tuition Fee — BRAC University",
      "Recharge — Grameenphone", "Salary Credit", "Internet Bill — Link3", "Fund Transfer — Arnav",
      "Card Payment — EBL Visa", "Netflix Gift Card",
    ][i]!,
    amount: [3000, 1840, 1000, 12500, 300, 70000, 1200, 5000, 8000, 1500][i]!,
    date: ["Today", "Today", "Yesterday", "12 May, 2025", "11 May, 2025", "10 May, 2025", "8 May, 2025", "7 May, 2025", "6 May, 2025", "5 May, 2025"][i]!,
    ref: `EBL824100${i + 1}`,
    status: "Success",
  })),
  rewards: {
    points: 3240,
    monthPoints: 35,
    expiring: 120,
    history: [
      { id: "rh1", title: "Tuition payment", points: 125, date: "12 May, 2025" },
      { id: "rh2", title: "Card payment", points: 80, date: "6 May, 2025" },
      { id: "rh3", title: "QR payment at Unimart", points: 30, date: "Today" },
      { id: "rh4", title: "QR payment at Shwapno", points: 23, date: "4 May, 2025" },
      { id: "rh5", title: "DPS contribution", points: 20, date: "3 May, 2025" },
      { id: "rh6", title: "Electricity bill", points: 18, date: "Today" },
      { id: "rh7", title: "Netflix gift card", points: 15, date: "5 May, 2025" },
      { id: "rh8", title: "Internet bill", points: 12, date: "8 May, 2025" },
      { id: "rh9", title: "Gas bill", points: 10, date: "2 May, 2025" },
      { id: "rh10", title: "Group DPS", points: 5, date: "15 Apr, 2025" },
    ],
    offers: [
      { id: "ro1", title: "৳50 cashback", cost: 500, value: "৳50", kind: "cashback" },
      { id: "ro2", title: "৳100 recharge voucher", cost: 800, value: "৳100", kind: "recharge" },
      { id: "ro3", title: "৳100 bill voucher", cost: 1000, value: "৳100", kind: "bill" },
      { id: "ro4", title: "৳150 entertainment discount", cost: 1500, value: "৳150", kind: "entertainment" },
      { id: "ro5", title: "৳200 statement adjustment", cost: 2000, value: "৳200", kind: "statement" },
      { id: "ro6", title: "Donate 500 points", cost: 500, value: "৳50", kind: "donation" },
      { id: "ro7", title: "৳300 travel voucher", cost: 3000, value: "৳300", kind: "travel" },
      { id: "ro8", title: "৳500 shopping voucher", cost: 5000, value: "৳500", kind: "shopping" },
    ],
    missions: [
      { id: "mi1", title: "Pay 3 utility bills", progress: 2, goal: 3, points: 150, expiry: "31 May" },
      { id: "mi2", title: "Complete 2 recharges", progress: 1, goal: 2, points: 80, expiry: "31 May" },
      { id: "mi3", title: "Make one QR payment", progress: 1, goal: 1, points: 60, expiry: "31 May" },
      { id: "mi4", title: "Contribute to a DPS", progress: 0, goal: 1, points: 100, expiry: "31 May" },
    ],
  },
  recent: [
    { serviceId: "mfs-transfer", date: "Today, 6:45 PM" },
    { serviceId: "bill-electricity", date: "Today, 4:20 PM" },
    { serviceId: "split-pay", date: "Yesterday, 9:15 PM" },
    { serviceId: "tuition-fee", date: "12 May, 2025" },
    { serviceId: "recharge", date: "11 May, 2025" },
  ],
  usage: { "fund-transfer": 6, "bill-electricity": 5, "split-pay": 4, "tuition-fee": 2, recharge: 3 },
  tickets: [
    { id: "TKT-2026-0042", category: "Rewards", subject: "Reward points not credited", description: "Points for a partner offer were missing.", contact: "Email", status: "Resolved", date: "12 Jan, 2026" },
    { id: "TCK-100234", category: "Transaction", subject: "MFS transfer failed", description: "Nagad transfer of ৳2,500 failed but I was charged.", contact: "Mobile", status: "In Review", date: "2 May, 2025" },
    { id: "TCK-100235", category: "Rewards", subject: "Missing reward points", description: "Points for gift card purchase not added.", contact: "Email", status: "Resolved", date: "28 Apr, 2025" },
  ],
  chat: [],
  esa: { salary: 70000, limit: 20000, status: "Eligible", amount: 0, fee: 0 },
  onboarding: { submitted: false },
  insights: [
    { id: "i1", text: "Your food spending is 15% higher than last month.", action: "View Transactions", target: "transaction-history", tone: "warn" },
    { id: "i2", text: "You have 2 bills due this week.", action: "Enable Auto Pay", target: "auto-pay", tone: "warn" },
    { id: "i3", text: "Your savings rate is 18%.", action: "Set Budget", target: "budget", tone: "good" },
    { id: "i4", text: "You are ৳37,500 away from your Sri Lanka\u00a0Trip goal.", action: "Create Goal", target: "goal-setting", tone: "info" },
    { id: "i5", text: "You usually recharge this number near the 5th.", action: "Schedule Recharge", target: "scheduled-transfer", tone: "info" },
    { id: "i6", text: "Internet bill repeats every month — automate it.", action: "Enable Auto Pay", target: "auto-pay", tone: "info" },
    { id: "i7", text: "Card payment due in 6 days.", action: "View Transactions", target: "card-payment", tone: "warn" },
    { id: "i8", text: "Entertainment spending is within budget.", action: "Set Budget", target: "budget", tone: "good" },
    { id: "i9", text: "You could earn 120 more points this month.", action: "View Transactions", target: "rewards", tone: "info" },
    { id: "i10", text: "Group DPS has 2 pending members.", action: "View Transactions", target: "group-dps", tone: "warn" },
    { id: "i11", text: "Transport cost dropped 8% this month.", action: "View Transactions", target: "spending-insights", tone: "good" },
    { id: "i12", text: "Early Salary Access of ৳20,000 is available.", action: "View Transactions", target: "early-salary", tone: "info" },
  ],
  giftCards: [],
  dashboard: { order: DEFAULT_DASHBOARD_ORDER, hidden: [] },
  quickBanking: DEFAULT_QUICK,
  recentEntities: FREQUENT_SEED,

  disputes: [
    {
      id: "DSP-2026-0001", txnId: "EBL8241014", txnTitle: "MFS Transfer — Nagad", amount: 2500, date: "10 Jan, 2026",
      issue: "Money deducted but recipient not credited", description: "The transfer failed but the amount was debited.",
      contact: "Mobile", attachment: false, status: "Under Review", expected: "Expected resolution by 17 Jan, 2026",
      timeline: [
        { stage: "Submitted", date: "10 Jan, 2026", note: "Dispute received and reference created." },
        { stage: "Under Review", date: "11 Jan, 2026", note: "Our team is checking the transaction with the partner." },
      ],
    },
    {
      id: "DSP-100011", txnId: "EBL482910334", txnTitle: "MFS Transfer — Nagad", amount: 2500, date: "2 May, 2025",
      issue: "Money deducted but recipient not credited", description: "Nagad transfer failed but the amount was debited.",
      contact: "Mobile", attachment: false, status: "Under Review", expected: "Expected resolution by 9 May, 2025",
      timeline: [
        { stage: "Submitted", date: "2 May, 2025", note: "Dispute received and reference created." },
        { stage: "Under Review", date: "3 May, 2025", note: "Our team is checking the transaction with the partner." },
      ],
    },
  ],
  islamic: { mode: "conventional", hasAccount: true },
  offers: { saved: [], used: [] },
  nfcShares: [],
  birthday: { name: "Mahin", date: "Today", offerId: "po-birthday", read: false, saved: false, dismissed: false },
  supportHandoff: { escalated: false, ticketId: null },
  migration: MIGRATION_VERSION,

});

/* ---------------- One-time local data migration ---------------- */

export const MIGRATION_VERSION = 2;

/** Applies the incremental prototype update to an already-saved local state, once. */
export function migrateState(state: AppState): AppState {
  if (state.migration === MIGRATION_VERSION) return state;

  const fresh = seedState();

  // Goals: keep Nepal Trip and one iPhone goal only; funds live outside available savings.
  const nepal = state.goals.find((g) => /nepal/i.test(g.title)) ?? fresh.goals[0]!;
  const iphone =
    state.goals.find((g) => /iphone/i.test(g.title)) ??
    { ...fresh.goals[1]!, id: "g2" };
  const goals = [nepal, iphone];

  const goalTotal = goals.reduce((a, g) => a + g.saved, 0);
  const TOTAL_OWNED = 82450;

  const accounts = state.accounts.length
    ? [{ ...state.accounts[0]!, balance: Math.max(0, TOTAL_OWNED - goalTotal) }]
    : fresh.accounts;

  const stripAddMoney = <T,>(list: T[], get: (x: T) => string) => list.filter((x) => get(x) !== "add-money");
  const usage: Record<string, number> = { ...state.usage };
  delete usage["add-money"];

  const customFrequents = state.recentEntities.filter(
    (r) => !FREQUENT_SEED.some((f) => f.id === r.id) && r.serviceId !== "add-money",
  );

  return {
    ...state,
    accounts,
    cards: state.cards.slice(0, 1),
    goals,
    usage,
    recent: stripAddMoney(state.recent, (r) => r.serviceId),
    quickBanking: stripAddMoney(state.quickBanking, (id) => id),
    personalization: {
      ...state.personalization,
      pinned: stripAddMoney(state.personalization.pinned, (id) => id),
    },
    dashboard: { order: DEFAULT_DASHBOARD_ORDER, hidden: state.dashboard.hidden.filter((id) => DEFAULT_DASHBOARD_ORDER.includes(id)) },
    recentEntities: [...FREQUENT_SEED, ...customFrequents],
    transactions: state.transactions.map((t) =>
      t.serviceId === "add-money" ? { ...t, serviceId: "mfs-transfer", category: "Transfer" } : t,
    ),
    migration: MIGRATION_VERSION,
  };
}

/* ---------------- Categorization migration (idempotent, data-preserving) ----------------
   Only service ids are remapped — transactions, balances, goals, rewards,
   complaints, favorites, pinned services and settings are preserved as-is. */

const RETIRED_SERVICE_IDS: Record<string, string> = {
  "add-money": "mfs-transfer",
  "islamic-mode": "zakat",
  "islamic-accounts": "accounts",
  islamic: "zakat",
  "help-support": "help-support",
};

const remapId = (id: string) => RETIRED_SERVICE_IDS[id] ?? id;
const uniq = (list: string[]) => Array.from(new Set(list));

export function remapServiceCategories(state: AppState): AppState {
  return {
    ...state,
    quickBanking: uniq(state.quickBanking.map(remapId)),
    personalization: {
      ...state.personalization,
      pinned: uniq(state.personalization.pinned.map(remapId)),
    },
    recent: state.recent.map((r) => ({ ...r, serviceId: remapId(r.serviceId) })),
    recentEntities: state.recentEntities.map((r) => ({ ...r, serviceId: remapId(r.serviceId) })),
    transactions: state.transactions.map((t) => ({ ...t, serviceId: remapId(t.serviceId) })),
  };
}
