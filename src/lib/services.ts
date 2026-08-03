export type Flow =
  | "transaction" | "management" | "dashboard" | "savings" | "scheduling"
  | "assistant" | "onboarding" | "settings" | "information";

export type Tint = "yellow" | "green" | "blue" | "purple" | "pink" | "gray";

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  tint: Tint;
  flow: Flow;
  auth: "none" | "confirm" | "otp";
  keywords: string[];
}

const s = (
  id: string, title: string, category: string, description: string, icon: string,
  tint: Tint, flow: Flow, auth: Service["auth"], keywords: string[],
): Service => ({ id, title, category, description, icon, tint, flow, auth, keywords });

export const CATEGORIES = [
  { id: "ai", title: "AI & Personal Finance", subtitle: "Smart tools to manage, plan & grow", icon: "Sparkles", tint: "yellow" as Tint },
  { id: "payments", title: "Payments & Transfers", subtitle: "Send, receive & settle instantly", icon: "ArrowLeftRight", tint: "green" as Tint },
  { id: "bills", title: "Bills, Education & Entertainment", subtitle: "Pay bills, fees & subscriptions", icon: "Zap", tint: "blue" as Tint },
  { id: "savings", title: "Savings & Growth", subtitle: "Build savings, unlock growth", icon: "PiggyBank", tint: "green" as Tint },
  { id: "cards", title: "Cards, Loans & Rewards", subtitle: "Manage cards, limits & points", icon: "CreditCard", tint: "purple" as Tint },
  { id: "community", title: "Community & Lifestyle", subtitle: "Support, connect & simplify life", icon: "HeartHandshake", tint: "pink" as Tint },
  { id: "security", title: "Security, Access & Support", subtitle: "Protect your account & get help", icon: "ShieldCheck", tint: "blue" as Tint },
];

export const SERVICES: Service[] = [
  // AI & Personal Finance
  s("ai-money-manager", "AI Money Manager", "ai", "Insights on income, spending & savings", "PieChart", "green", "dashboard", "none", ["budget", "spending", "insights", "money"]),
  s("goal-setting", "Goal Setting", "ai", "Plan and achieve your goals", "Target", "yellow", "savings", "none", ["goal", "target", "save"]),
  s("ai-advisor", "AI Financial Advisor", "ai", "Ask questions about your money", "Lightbulb", "blue", "assistant", "none", ["advisor", "advice", "ai", "chat"]),
  s("payment-intelligence", "Automatic Payment Intelligence", "ai", "Detect repeating payments", "Repeat", "purple", "management", "none", ["auto", "detect", "repeat", "intelligence"]),
  s("voice-assistant", "AI Voice Assistant", "ai", "Speak or type commands", "Mic", "purple", "assistant", "none", ["voice", "speech", "assistant"]),
  s("budget", "Budget Management", "ai", "Set monthly category budgets", "ChartColumn", "yellow", "management", "none", ["budget", "limit"]),
  s("spending-insights", "Spending Insights", "ai", "Where your money goes", "TrendingUp", "green", "dashboard", "none", ["spend", "insight", "analysis"]),
  s("upcoming-payments", "Upcoming Payments", "ai", "Bills and schedules due soon", "Clock", "blue", "information", "none", ["due", "upcoming", "bills"]),

  // Payments & Transfers
  s("fund-transfer", "Fund Transfer", "payments", "Send money to any account", "ArrowLeftRight", "yellow", "management", "confirm", ["send", "transfer", "money", "bank"]),
  s("split-pay", "Split Pay", "payments", "Split bills & pay together", "Users", "pink", "management", "confirm", ["split", "share", "request"]),
  s("add-money", "Add Money", "payments", "Add from bKash, Nagad, Rocket", "PlusCircle", "pink", "transaction", "confirm", ["add", "wallet", "bkash", "nagad", "rocket", "top up"]),
  s("mfs-transfer", "MFS Transfer", "payments", "Send to mobile wallets", "Smartphone", "blue", "transaction", "confirm", ["mfs", "bkash", "nagad", "rocket", "upay"]),
  s("recharge", "Mobile Recharge", "payments", "Recharge any operator", "Smartphone", "purple", "transaction", "confirm", ["recharge", "topup", "mobile"]),
  s("auto-pay", "Auto Pay", "payments", "Automate recurring payments", "Repeat", "blue", "scheduling", "confirm", ["auto", "recurring", "pay"]),
  s("scheduled-transfer", "Scheduled Transfer", "payments", "Schedule future transfers", "CalendarDays", "yellow", "scheduling", "confirm", ["schedule", "future", "transfer"]),
  s("qr-payment", "QR Payment", "payments", "Pay merchants by QR", "QrCode", "green", "transaction", "confirm", ["qr", "scan", "merchant"]),
  s("beneficiaries", "Beneficiaries", "payments", "Manage saved recipients", "UserPlus", "gray", "management", "none", ["beneficiary", "recipient", "saved"]),
  s("transaction-history", "Transfer History", "payments", "All your transactions", "History", "gray", "information", "none", ["history", "statement", "transactions"]),

  // Bills, Education & Entertainment
  s("bill-electricity", "Electricity", "bills", "Pay electricity bills", "Zap", "yellow", "transaction", "confirm", ["electricity", "desco", "bill", "utility"]),
  s("bill-gas", "Gas", "bills", "Pay gas bills", "Flame", "pink", "transaction", "confirm", ["gas", "titas", "bill"]),
  s("bill-water", "Water", "bills", "Pay water bills", "Droplet", "green", "transaction", "confirm", ["water", "wasa", "bill"]),
  s("bill-internet", "Internet", "bills", "Pay internet bills", "Globe", "blue", "transaction", "confirm", ["internet", "broadband", "bill"]),
  s("bill-tv", "TV", "bills", "Pay TV & DTH bills", "Tv", "purple", "transaction", "confirm", ["tv", "dth", "cable"]),
  s("visa-fee", "Visa Fee", "bills", "Pay your visa fee", "CreditCard", "pink", "transaction", "confirm", ["visa", "fee", "embassy"]),
  s("tuition-fee", "Tuition Fee", "bills", "Pay school & university fees", "GraduationCap", "green", "transaction", "confirm", ["tuition", "school", "university", "education"]),
  s("gift-cards", "Entertainment Gift Cards", "bills", "Buy digital gift cards", "Gift", "purple", "transaction", "confirm", ["gift", "card", "entertainment"]),
  s("gift-netflix", "Netflix Gift Card", "bills", "Netflix gift card", "Tv", "pink", "transaction", "confirm", ["netflix", "gift"]),
  s("gift-spotify", "Spotify Premium", "bills", "Spotify premium", "Sparkles", "green", "transaction", "confirm", ["spotify", "music"]),
  s("gift-google", "Google Play Gift Card", "bills", "Google Play credit", "Smartphone", "blue", "transaction", "confirm", ["google", "play", "gift"]),
  s("gift-apple", "Apple Gift Card", "bills", "Apple gift card", "ShoppingBag", "gray", "transaction", "confirm", ["apple", "itunes", "gift"]),
  s("bill-reminder", "Smart Bill Reminder", "bills", "Never miss a due date", "Bell", "yellow", "information", "none", ["reminder", "due", "bill"]),
  s("saved-billers", "Saved Billers", "bills", "Your saved billers", "BookmarkCheck", "green", "management", "none", ["saved", "biller"]),
  s("bill-payment", "Bill Payment", "bills", "Pay your bills & subscriptions", "Wallet", "green", "management", "confirm", ["bill", "payment", "utility"]),

  // Savings & Growth
  s("instant-dps", "Instant DPS", "savings", "Start your DPS in seconds", "Download", "blue", "savings", "confirm", ["dps", "deposit", "instant"]),
  s("dps", "DPS", "savings", "Deposit pension scheme", "PiggyBank", "green", "savings", "confirm", ["dps", "savings"]),
  s("fdr", "Fixed Deposit", "savings", "Open a fixed deposit", "Landmark", "yellow", "savings", "confirm", ["fdr", "fixed", "deposit"]),
  s("group-dps", "Group DPS", "savings", "Save together for shared goals", "Users", "purple", "savings", "confirm", ["group", "dps", "shared"]),
  s("savings-goals", "Savings Goals", "savings", "Track every goal", "Target", "yellow", "savings", "none", ["goal", "savings"]),
  s("auto-contribution", "Auto Contribution", "savings", "Automate goal savings", "Repeat", "blue", "scheduling", "confirm", ["auto", "contribution"]),
  s("early-salary", "Early Salary Access", "savings", "Get salary before payday", "Banknote", "blue", "transaction", "confirm", ["salary", "advance", "early"]),
  s("account-opening", "Instant Account Opening", "savings", "Open an account with eKYC", "IdCard", "green", "onboarding", "otp", ["account", "open", "ekyc", "nid"]),

  // Cards, Loans & Rewards
  s("card-services", "Card Services", "cards", "Manage all your cards", "CreditCard", "blue", "management", "confirm", ["card", "manage"]),
  s("add-card", "Add Card", "cards", "Add a new card", "PlusCircle", "green", "management", "confirm", ["add", "card"]),
  s("activate-card", "Activate Card", "cards", "Activate a new card", "ShieldCheck", "yellow", "management", "confirm", ["activate", "card"]),
  s("card-controls", "Card Controls", "cards", "Freeze, limits & channels", "Snowflake", "blue", "management", "confirm", ["freeze", "control", "limit"]),
  s("card-payment", "Card Payment", "cards", "Pay your card bill", "CreditCard", "blue", "transaction", "confirm", ["card", "payment", "bill"]),
  s("rewards", "Rewards", "cards", "Points, levels & redemption", "Award", "yellow", "dashboard", "none", ["reward", "points", "loyalty"]),
  s("reward-offers", "Reward Offers", "cards", "Redeem your points", "BadgePercent", "pink", "management", "confirm", ["offer", "redeem", "voucher"]),
  s("loans", "Loan Services", "cards", "Explore loan products", "Coins", "yellow", "information", "none", ["loan", "credit"]),
  s("limits", "Transaction Limits", "cards", "View and set limits", "ListChecks", "gray", "settings", "confirm", ["limit", "transaction"]),
  s("statements", "Statements", "cards", "Download statements", "FileText", "gray", "information", "none", ["statement", "download"]),
  s("certificates", "Certificates", "cards", "Bank certificates", "FileText", "blue", "information", "none", ["certificate", "tax"]),
  s("receipts", "Receipts", "cards", "All transaction receipts", "Receipt", "green", "information", "none", ["receipt", "proof"]),

  // Community & Lifestyle
  s("donation", "Donations", "community", "Give to trusted causes", "HeartHandshake", "pink", "transaction", "confirm", ["donate", "charity"]),
  s("zakat", "Zakat", "community", "Calculate and give zakat", "Moon", "green", "transaction", "confirm", ["zakat", "islamic"]),
  s("islamic", "Islamic Features", "community", "Prayer, zakat & halal banking", "Moon", "green", "information", "none", ["islamic", "halal", "prayer"]),
  s("e-toll", "E-Toll", "community", "Pay highway tolls", "Car", "yellow", "transaction", "confirm", ["toll", "highway", "car"]),
  s("vehicle", "Vehicle Management", "community", "Vehicles, tax & fitness", "Car", "blue", "management", "none", ["vehicle", "car", "tax"]),
  s("entertainment", "Entertainment", "community", "Subscriptions & gift cards", "Tv", "purple", "management", "none", ["entertainment", "movie"]),
  s("education-payments", "Education Payments", "community", "Institution payments", "GraduationCap", "green", "management", "none", ["education", "school"]),

  // Security, Access & Support
  s("ai-support", "AI Customer Support", "security", "24/7 instant answers", "Headphones", "purple", "assistant", "none", ["support", "help", "chat", "ai"]),
  s("help-support", "Help and Support", "security", "Tickets & contact", "LifeBuoy", "blue", "management", "none", ["help", "ticket", "support"]),
  s("tutorials", "Tutorials", "security", "Learn the app", "Lightbulb", "yellow", "information", "none", ["tutorial", "guide"]),
  s("faqs", "FAQs", "security", "Common questions", "HelpCircle", "gray", "information", "none", ["faq", "question"]),
  s("reset-login-pin", "Login PIN Reset", "security", "Reset with OTP", "KeyRound", "pink", "settings", "otp", ["pin", "reset", "login"]),
  s("reset-card-pin", "Card PIN Reset", "security", "Reset your card PIN", "CreditCard", "pink", "settings", "otp", ["card", "pin", "reset"]),
  s("fingerprint-setup", "Fingerprint Setup", "security", "Enroll fingerprint", "Fingerprint", "yellow", "settings", "confirm", ["fingerprint", "biometric"]),
  s("faceid-setup", "Face ID Setup", "security", "Enroll Face ID", "ScanFace", "blue", "settings", "confirm", ["face", "biometric"]),
  s("biometric-reset", "Biometric Reset", "security", "Remove & re-enroll", "Fingerprint", "purple", "settings", "otp", ["biometric", "reset"]),
  s("accessibility", "Accessibility", "security", "Text, contrast & voice", "Accessibility", "blue", "settings", "none", ["accessibility", "contrast", "text"]),
  s("notifications", "Notifications", "security", "All alerts", "Bell", "yellow", "information", "none", ["notification", "alert"]),
  s("language", "Language", "security", "English or Bangla", "Languages", "green", "settings", "none", ["language", "bangla"]),
  s("trusted-devices", "Trusted Devices", "security", "Manage devices", "MonitorSmartphone", "gray", "settings", "otp", ["device", "trusted"]),
  s("login-history", "Login History", "security", "Recent logins", "LogIn", "gray", "information", "none", ["login", "history"]),
  s("active-sessions", "Active Sessions", "security", "Sign out sessions", "MonitorSmartphone", "blue", "settings", "confirm", ["session", "active"]),
  s("security-settings", "Security", "security", "All security controls", "ShieldCheck", "blue", "settings", "confirm", ["security", "pin", "biometric"]),
  s("profile", "Profile", "security", "Your personal details", "IdCard", "gray", "information", "none", ["profile", "account"]),
  s("accounts", "Accounts", "security", "Your bank accounts", "Landmark", "yellow", "information", "none", ["account", "balance"]),
  s("personalization", "Personalization", "security", "Recommendations & pins", "Star", "purple", "settings", "none", ["personalize", "recommend"]),

  // Incremental additions
  s("phone-transfer", "Send by Mobile Number", "payments", "Find the linked account by phone number", "Send", "green", "transaction", "confirm", ["phone", "mobile", "number", "send", "transfer"]),
  s("customize-dashboard", "Customize Dashboard", "security", "Reorder and hide Home modules", "ListChecks", "purple", "settings", "none", ["dashboard", "customize", "reorder", "home", "layout"]),
  s("disputes", "Transaction Disputes", "security", "Report and track transaction issues", "ShieldCheck", "pink", "management", "none", ["dispute", "issue", "report", "refund", "complaint"]),
  s("account-sharing", "Share Account Details", "security", "Copy or share by NFC", "Share2", "blue", "management", "none", ["share", "nfc", "account", "details", "copy"]),
  s("partner-offers", "Partner Offers", "cards", "Discounts from local partners", "BadgePercent", "yellow", "management", "none", ["offer", "partner", "discount", "cineplex", "yum cha"]),
  s("islamic-mode", "EBL Islamic Mode", "community", "One-tap Shariah-compliant banking", "Moon", "green", "settings", "none", ["islamic", "halal", "shariah", "mode"]),
  s("human-support", "Human Agent Support", "security", "Escalate to a human agent", "Headphones", "blue", "assistant", "none", ["human", "agent", "call", "escalate", "support"]),

];

export const byId = (id: string) => SERVICES.find((x) => x.id === id);

export const searchServices = (q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return SERVICES.filter(
    (x) =>
      x.title.toLowerCase().includes(t) ||
      x.description.toLowerCase().includes(t) ||
      x.keywords.some((k) => k.includes(t)),
  );
};

export const inCategory = (cat: string) => SERVICES.filter((x) => x.category === cat);

export const TINT_BG: Record<Tint, string> = {
  yellow: "bg-tint-yellow",
  green: "bg-tint-green",
  blue: "bg-tint-blue",
  purple: "bg-tint-purple",
  pink: "bg-tint-pink",
  gray: "bg-tint-gray",
};
