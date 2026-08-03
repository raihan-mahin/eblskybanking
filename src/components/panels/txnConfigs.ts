import type { TxnFlowProps } from "@/components/TxnFlow";
import { BANKS, MFS } from "@/lib/seed";

const OPERATORS = ["Grameenphone", "Banglalink", "Robi", "Airtel", "Teletalk"];

export const TXN_CONFIGS: Record<string, Omit<TxnFlowProps, "serviceId">> = {
  "add-money": {
    title: "Add Money", category: "Add Money", intro: "Enter your details below",
    fields: [
      { key: "provider", label: "Add Money From", type: "tiles", options: ["bKash", "Nagad", "Rocket"] },
      { key: "wallet", label: "Wallet Number", type: "text", placeholder: "01XXX-XXXXXX" },
    ],
    amountPresets: [500, 1000, 3000, 5000],
  },
  "mfs-transfer": {
    title: "MFS Transfer", category: "Transfer",
    fields: [
      { key: "provider", label: "Select Provider", type: "tiles", options: MFS },
      { key: "wallet", label: "Wallet Number", type: "text", placeholder: "01XXX-XXXXXX" },
    ],
    fee: 15,
  },
  recharge: {
    title: "Mobile Recharge", category: "Recharge",
    fields: [
      { key: "mobile", label: "Mobile Number", type: "text", placeholder: "01712-345678" },
      { key: "operator", label: "Operator", type: "select", options: OPERATORS },
      { key: "type", label: "Connection", type: "tiles", options: ["Prepaid", "Postpaid"] },
    ],
    amountPresets: [29, 99, 199, 300, 500],
  },
  "bill-electricity": {
    title: "Electricity Bill", category: "Bills", fixedAmount: 1840,
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["DESCO", "DPDC", "NESCO", "BREB"] },
      { key: "customer", label: "Customer Number", type: "text", placeholder: "Enter customer number" },
    ],
    intro: "Bill retrieved: due 25 May 2025",
  },
  "bill-gas": {
    title: "Gas Bill", category: "Bills", fixedAmount: 1080,
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["Titas Gas", "Bakhrabad Gas", "Jalalabad Gas"] },
      { key: "customer", label: "Customer Number", type: "text", placeholder: "Enter customer number" },
    ],
    intro: "Bill retrieved: due 28 May 2025",
  },
  "bill-water": {
    title: "Water Bill", category: "Bills", fixedAmount: 640,
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["Dhaka WASA", "Chattogram WASA"] },
      { key: "customer", label: "Bill Number", type: "text", placeholder: "Enter bill number" },
    ],
    intro: "Bill retrieved: due 30 May 2025",
  },
  "bill-internet": {
    title: "Internet Bill", category: "Bills", fixedAmount: 1200,
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["Link3", "Amber IT", "Carnival", "Dot Internet"] },
      { key: "customer", label: "Customer ID", type: "text", placeholder: "Enter customer ID" },
    ],
    intro: "Bill retrieved: due 22 May 2025",
  },
  "bill-tv": {
    title: "TV Bill", category: "Bills", fixedAmount: 500,
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["Akash DTH", "Bengal Digital", "Jadoo TV"] },
      { key: "customer", label: "Subscriber ID", type: "text", placeholder: "Enter subscriber ID" },
    ],
  },
  "visa-fee": {
    title: "Visa Fee", category: "Bills",
    fields: [
      { key: "country", label: "Destination", type: "select", options: ["India", "Thailand", "Malaysia", "UAE", "Schengen"] },
      { key: "passport", label: "Passport Number", type: "text", placeholder: "Enter passport number" },
    ],
    amountPresets: [5000, 8500, 12000],
  },
  "tuition-fee": {
    title: "Tuition Fee", category: "Education",
    fields: [
      { key: "level", label: "Education Level", type: "tiles", options: ["School", "College", "University"] },
      { key: "institution", label: "Institution", type: "select", options: ["BRAC University", "North South University", "Dhaka College", "Viqarunnisa Noon School", "IUB", "AIUB"] },
      { key: "student", label: "Student Name", type: "text", placeholder: "Enter student name" },
      { key: "roll", label: "Student ID / Roll", type: "text", placeholder: "Enter ID or roll" },
      { key: "session", label: "Class / Semester", type: "text", placeholder: "e.g. Spring 2025" },
      { key: "feeType", label: "Fee Type", type: "select", options: ["Admission", "Tuition", "Semester", "Examination", "Registration", "Library", "Transport", "Other"] },
    ],
    fixedAmount: 12500, fee: 20,
    intro: "Fee retrieved from institution records",
  },
  "gift-netflix": { title: "Netflix Gift Card", category: "Entertainment", fields: giftFields(), amountPresets: [1000, 1500, 2500] },
  "gift-spotify": { title: "Spotify Premium", category: "Entertainment", fields: giftFields(), amountPresets: [199, 599, 1200] },
  "gift-google": { title: "Google Play Gift Card", category: "Entertainment", fields: giftFields(), amountPresets: [500, 1000, 2000] },
  "gift-apple": { title: "Apple Gift Card", category: "Entertainment", fields: giftFields(), amountPresets: [1000, 2500, 5000] },
  donation: {
    title: "Donation", category: "Donation",
    fields: [{ key: "cause", label: "Select Cause", type: "select", options: ["Bidyanondo Foundation", "As-Sunnah Foundation", "Jaago Foundation", "Flood Relief Fund"] }],
    amountPresets: [200, 500, 1000, 5000],
  },
  zakat: {
    title: "Zakat", category: "Donation",
    fields: [{ key: "fund", label: "Zakat Fund", type: "select", options: ["EBL Zakat Fund", "Center for Zakat Management", "Local Mosque Fund"] }],
    amountPresets: [1000, 2500, 5000, 10000],
  },
  "e-toll": {
    title: "E-Toll", category: "E-Toll",
    fields: [
      { key: "vehicle", label: "Vehicle", type: "select", options: ["Dhaka Metro GA 11-2233", "Dhaka Metro HA 45-6677"] },
      { key: "road", label: "Toll Road", type: "select", options: ["Dhaka Elevated Expressway", "Padma Bridge", "Bangabandhu Bridge"] },
    ],
    amountPresets: [80, 150, 750],
  },
  "e-challan": {
    title: "e-Challan", category: "Bills",
    fields: [
      { key: "vehicle", label: "Vehicle", type: "select", options: ["Dhaka Metro GA 11-2233", "Dhaka Metro HA 45-6677"] },
      { key: "challan", label: "Challan Number", type: "text", placeholder: "e.g. CHL-2026-00921" },
    ],
    amountPresets: [500, 1000, 2000],
  },
  "qr-payment": {
    title: "QR Payment", category: "QR",
    fields: [{ key: "merchant", label: "Merchant", type: "select", options: ["Shwapno Dhanmondi", "Chillox Banani", "Aarong Uttara", "Star Kabab"] }],
    amountPresets: [250, 500, 1200, 2350],
  },
  "card-payment": {
    title: "Card Payment", category: "Cards",
    fields: [{ key: "card", label: "Select Card", type: "select", options: ["My Card · 7781"] }],
    amountPresets: [2000, 5000, 8000, 12000],
  },
  "instant-dps": {
    title: "Instant DPS", category: "Savings",
    fields: [
      { key: "tenure", label: "Tenure", type: "tiles", options: ["3 Years", "5 Years", "10 Years"] },
      { key: "nominee", label: "Nominee", type: "text", placeholder: "Nominee name" },
    ],
    amountPresets: [1000, 2000, 5000], submitLabel: "Start DPS",
  },
  dps: {
    title: "DPS Contribution", category: "Savings",
    fields: [{ key: "scheme", label: "DPS Account", type: "select", options: ["EBL DPS 5 Year", "EBL Student DPS"] }],
    amountPresets: [1000, 2000],
  },
  fdr: {
    title: "Fixed Deposit", category: "Savings",
    fields: [{ key: "tenure", label: "Tenure", type: "tiles", options: ["6 Months", "1 Year", "3 Years"] }],
    amountPresets: [50000, 100000], submitLabel: "Open FDR",
  },
};

function giftFields() {
  return [
    { key: "recipient", label: "Recipient Email or Mobile", type: "text" as const, placeholder: "name@email.com or 01XXXXXXXXX" },
  ];
}

export const OTHER_BANK_CONFIG: Omit<TxnFlowProps, "serviceId"> = {
  title: "Other Bank Transfer", category: "Transfer", fee: 25,
  fields: [
    { key: "bank", label: "Select Bank", type: "select", options: BANKS },
    { key: "name", label: "Account Holder Name", type: "text", placeholder: "Enter full name" },
    { key: "account", label: "Account Number", type: "text", placeholder: "Enter account number" },
    { key: "mode", label: "Transfer Type", type: "tiles", options: ["NPSB", "BEFTN", "RTGS"] },
  ],
};
