export type Flow =
  | "transaction" | "management" | "dashboard" | "savings" | "scheduling"
  | "assistant" | "onboarding" | "settings" | "information";

export type Tint = "yellow" | "green" | "blue" | "purple" | "pink" | "gray";

export interface Service {
  id: string;
  title: string;
  /** Permanent category id from CATEGORIES — single source of truth. */
  category: string;
  description: string;
  icon: string;
  tint: Tint;
  flow: Flow;
  auth: "none" | "confirm" | "otp";
  /** Search-only aliases. Never used as a visible service name. */
  keywords: string[];
}

const s = (
  id: string, title: string, category: string, description: string, icon: string,
  tint: Tint, flow: Flow, auth: Service["auth"], keywords: string[],
): Service => ({ id, title, category, description, icon, tint, flow, auth, keywords });

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tint: Tint;
  /** Payment categories appear on Pay & Transfer as well as Explore. */
  payment?: boolean;
}

/** Master taxonomy. Order is the canonical category order everywhere. */
export const CATEGORIES: Category[] = [
  { id: "transfers", title: "Transfers", subtitle: "Send money to any account", icon: "ArrowLeftRight", tint: "yellow", payment: true },
  { id: "everyday", title: "Everyday Payments", subtitle: "Recharge, QR and card payments", icon: "Wallet", tint: "green", payment: true },
  { id: "utility", title: "Utility Bills", subtitle: "Electricity, gas, water and more", icon: "Zap", tint: "blue", payment: true },
  { id: "edugov", title: "Education & Government", subtitle: "Fees, challan and official payments", icon: "GraduationCap", tint: "green", payment: true },
  { id: "travel", title: "Travel & Entertainment", subtitle: "Tickets, hotels and gift cards", icon: "Plane", tint: "purple", payment: true },
  { id: "donations", title: "Donations & Giving", subtitle: "Donations, zakat and campaigns", icon: "HeartHandshake", tint: "pink", payment: true },
  { id: "scheduled", title: "Scheduled Payments", subtitle: "Auto pay and future payments", icon: "CalendarDays", tint: "blue", payment: true },
  { id: "account", title: "Account Services", subtitle: "Balances, statements & details", icon: "Landmark", tint: "green" },
  { id: "cards", title: "Cards", subtitle: "Controls, limits and card bills", icon: "CreditCard", tint: "purple" },
  { id: "savings", title: "DPS, Savings & Goals", subtitle: "Grow your money", icon: "PiggyBank", tint: "green" },
  { id: "loans", title: "Loans & Salary", subtitle: "Borrow and plan repayments", icon: "Banknote", tint: "blue" },
  { id: "ai", title: "AI & Money Tools", subtitle: "Smart tools to manage & plan", icon: "Sparkles", tint: "purple" },
  { id: "rewards", title: "Rewards & Offers", subtitle: "Points, levels & partners", icon: "Award", tint: "yellow" },
  { id: "security", title: "Security & Support", subtitle: "Protect your account & get help", icon: "ShieldCheck", tint: "blue" },
  { id: "skybanking", title: "Other EBL Services", subtitle: "Programmes, information & app settings", icon: "LayoutGrid", tint: "yellow" },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
export const categoryTitle = (id: string) => categoryById(id)?.title ?? "Services";

export const SERVICES: Service[] = [
  /* ---------------- Transfers ---------------- */
  s("fund-transfer", "Fund Transfer", "transfers", "Send money to any account", "ArrowLeftRight", "yellow", "management", "confirm", ["send", "transfer", "money", "bank", "ebl transfer"]),
  s("to-my-account", "To My Account", "transfers", "Move money between your own accounts", "Repeat", "green", "management", "confirm", ["own account", "self", "move", "my account"]),
  s("other-bank-transfer", "Other Bank Transfer", "transfers", "Send to another bank via NPSB/BEFTN", "Landmark", "blue", "transaction", "confirm", ["other bank", "npsb", "beftn", "transfer"]),
  s("mfs-transfer", "MFS Transfer", "transfers", "Send to mobile wallets", "Smartphone", "blue", "transaction", "confirm", ["mfs", "bkash", "nagad", "rocket", "upay", "wallet"]),
  s("phone-transfer", "Send by Mobile Number", "transfers", "Find the linked account by phone number", "Send", "green", "transaction", "confirm", ["phone", "mobile", "number", "send", "transfer"]),
  s("request-money", "Request Money", "transfers", "Request money from another EBL user", "HeartHandshake", "green", "transaction", "confirm", ["request", "request money", "ask money", "collect"]),
  s("split-pay", "Split Pay", "transfers", "Split bills & pay together", "Users", "pink", "management", "confirm", ["split", "share", "request"]),
  s("beneficiaries", "Beneficiaries", "transfers", "Manage saved recipients", "UserPlus", "gray", "management", "none", ["beneficiary", "recipient", "saved"]),
  s("transaction-history", "Transfer History", "transfers", "All your transactions", "History", "gray", "information", "none", ["history", "statement", "transactions", "recent"]),

  /* ---------------- Everyday Payments ---------------- */
  s("recharge", "Mobile Recharge", "everyday", "Recharge any operator", "Smartphone", "purple", "transaction", "confirm", ["recharge", "topup", "top up", "mobile", "airtime"]),
  s("qr-payment", "QR Payment", "everyday", "Pay merchants by QR", "QrCode", "green", "transaction", "confirm", ["qr", "scan", "merchant"]),
  s("card-payment", "Card Payment", "everyday", "Pay your card bill", "CreditCard", "blue", "transaction", "confirm", ["card", "payment", "credit card bill"]),

  /* ---------------- Utility Bills ---------------- */
  s("bill-electricity", "Electricity", "utility", "Pay electricity bills", "Zap", "yellow", "transaction", "confirm", ["electricity", "desco", "dpdc", "bill", "utility"]),
  s("bill-gas", "Gas", "utility", "Pay gas bills", "Flame", "pink", "transaction", "confirm", ["gas", "titas", "bill"]),
  s("bill-water", "Water", "utility", "Pay water bills", "Droplet", "green", "transaction", "confirm", ["water", "wasa", "bill"]),
  s("bill-internet", "Internet Bill", "utility", "Pay your internet bill", "Globe", "blue", "transaction", "confirm", ["internet", "broadband", "wifi", "wi-fi", "isp", "internet payment"]),
  s("bill-tv", "TV / Cable", "utility", "Pay TV & DTH bills", "Tv", "purple", "transaction", "confirm", ["tv", "dth", "cable", "dish"]),
  s("bill-telephone", "Telephone", "utility", "Pay landline & telephone bills", "Phone", "gray", "transaction", "confirm", ["telephone", "landline", "btcl", "phone bill"]),
  s("saved-billers", "Saved Utility Billers", "utility", "Your saved billers", "BookmarkCheck", "green", "management", "none", ["saved", "biller"]),
  s("bill-payment", "Utility Payment History", "utility", "Recent utility payments", "Receipt", "green", "information", "none", ["utility history", "bill history", "recent utility"]),
  s("bill-reminder", "Smart Bill Reminder", "utility", "Never miss a due date", "Bell", "yellow", "information", "none", ["reminder", "due", "bill"]),

  /* ---------------- Education & Government ---------------- */
  s("school-fee", "School Fee", "edugov", "Pay school fees", "GraduationCap", "green", "transaction", "confirm", ["school", "fee"]),
  s("college-fee", "College Fee", "edugov", "Pay college fees", "GraduationCap", "blue", "transaction", "confirm", ["college", "fee"]),
  s("university-fee", "University Fee", "edugov", "Pay university fees", "GraduationCap", "purple", "transaction", "confirm", ["university", "fee", "semester"]),
  s("tuition-fee", "Tuition Fee", "edugov", "Pay school & university fees", "GraduationCap", "green", "transaction", "confirm", ["tuition", "school", "university", "education"]),
  s("visa-fee", "Visa Fee", "edugov", "Pay your visa fee", "CreditCard", "pink", "transaction", "confirm", ["visa", "fee", "embassy"]),
  s("e-challan", "e-Challan", "edugov", "Pay traffic and government challan", "Car", "yellow", "transaction", "confirm", ["challan", "traffic", "government", "fine"]),
  s("universal-pension", "Universal Pension", "edugov", "Contribute to the universal pension scheme", "Landmark", "blue", "transaction", "confirm", ["pension", "universal", "shorbojonin"]),
  s("government-fees", "Government Fees", "edugov", "Official and government payments", "Landmark", "gray", "transaction", "confirm", ["government", "fee", "official", "passport"]),
  s("education-payments", "Education Payment History", "edugov", "Recent education & fee payments", "Receipt", "green", "information", "none", ["education history", "fee history"]),
  s("e-toll", "E-Toll", "edugov", "Pay highway tolls", "Car", "yellow", "transaction", "confirm", ["toll", "highway", "car"]),
  s("vehicle", "Vehicle Management", "edugov", "Vehicles, tax & fitness", "Car", "blue", "management", "none", ["vehicle", "car", "tax", "fitness"]),

  /* ---------------- Travel & Entertainment ---------------- */
  s("air-tickets", "Air Tickets", "travel", "Book flights with an EBL card offer", "Plane", "blue", "information", "none", ["air", "flight", "ticket", "airline", "travel"]),
  s("hotel-booking", "Hotel Booking", "travel", "Book hotels with an EBL card offer", "Landmark", "green", "information", "none", ["hotel", "booking", "stay", "resort"]),
  s("movie-tickets", "Movie Tickets", "travel", "Book movie tickets with an EBL offer", "Tv", "purple", "information", "none", ["movie", "cinema", "ticket", "film"]),
  s("star-cineplex", "Star Cineplex", "travel", "Star Cineplex ticket offer", "Tv", "pink", "information", "none", ["cineplex", "star", "movie", "cinema"]),
  s("gift-netflix", "Netflix Gift Card", "travel", "Netflix gift card", "Tv", "pink", "transaction", "confirm", ["netflix", "gift"]),
  s("gift-spotify", "Spotify Premium", "travel", "Spotify premium", "Sparkles", "green", "transaction", "confirm", ["spotify", "music"]),
  s("gift-google", "Google Play Gift Card", "travel", "Google Play credit", "Smartphone", "blue", "transaction", "confirm", ["google", "play", "gift"]),
  s("gift-apple", "Apple Gift Card", "travel", "Apple gift card", "ShoppingBag", "gray", "transaction", "confirm", ["apple", "itunes", "gift"]),
  s("gift-cards", "Entertainment Gift Cards", "travel", "Buy digital gift cards", "Gift", "purple", "transaction", "confirm", ["gift", "card", "entertainment"]),
  s("entertainment", "Entertainment", "travel", "Subscriptions & gift cards", "Tv", "purple", "management", "none", ["entertainment", "movie", "subscription"]),

  /* ---------------- Donations & Giving ---------------- */
  s("donation", "Donations", "donations", "Give to trusted causes", "HeartHandshake", "pink", "transaction", "confirm", ["donate", "charity", "giving"]),
  s("zakat", "Zakat", "donations", "Calculate and give zakat", "Moon", "green", "transaction", "confirm", ["zakat", "sadaqah"]),
  s("charity-campaigns", "Charity Campaigns", "donations", "Active giving campaigns", "HeartHandshake", "yellow", "information", "none", ["campaign", "charity", "fundraiser"]),
  s("saved-organizations", "Saved Organizations", "donations", "Your saved charities", "BookmarkCheck", "green", "management", "none", ["saved", "organization", "ngo"]),
  s("donation-history", "Donation History", "donations", "Your past donations", "Receipt", "gray", "information", "none", ["donation history", "giving history"]),
  s("scheduled-donation", "Scheduled Donation", "donations", "Automate recurring giving", "CalendarDays", "pink", "scheduling", "confirm", ["schedule", "donation", "recurring"]),

  /* ---------------- Scheduled Payments ---------------- */
  s("auto-pay", "Auto Pay", "scheduled", "Automate recurring payments", "Repeat", "blue", "scheduling", "confirm", ["auto", "recurring", "pay"]),
  s("scheduled-transfer", "Scheduled Transfer", "scheduled", "Schedule future transfers", "CalendarDays", "yellow", "scheduling", "confirm", ["schedule", "future", "transfer"]),
  s("scheduled-recharge", "Scheduled Recharge", "scheduled", "Automate your mobile recharge", "Repeat", "purple", "scheduling", "confirm", ["schedule", "recharge", "auto"]),
  s("scheduled-bill", "Scheduled Utility Bill", "scheduled", "Automate a utility bill", "Zap", "blue", "scheduling", "confirm", ["schedule", "bill", "utility", "auto"]),
  s("scheduled-tuition", "Scheduled Tuition Fee", "scheduled", "Automate a tuition payment", "GraduationCap", "green", "scheduling", "confirm", ["schedule", "tuition", "fee"]),
  s("scheduled-card-payment", "Scheduled Card Payment", "scheduled", "Automate your card bill", "CreditCard", "purple", "scheduling", "confirm", ["schedule", "card", "payment"]),
  s("schedule-history", "Schedule History", "scheduled", "Past scheduled payments", "History", "gray", "information", "none", ["schedule history", "past schedules"]),
  s("upcoming-payments", "Upcoming Payments", "scheduled", "Bills and schedules due soon", "Clock", "blue", "information", "none", ["due", "upcoming", "bills"]),

  /* ---------------- Account Services ---------------- */
  s("accounts", "Accounts", "account", "Your bank accounts", "Landmark", "yellow", "information", "none", ["account", "balance"]),
  s("account-details", "Account Details", "account", "Account number, branch & type", "IdCard", "blue", "information", "none", ["account details", "number", "branch"]),
  s("statements", "Account Statement", "account", "Download statements", "FileText", "gray", "information", "none", ["statement", "download"]),
  s("account-sharing", "Account Sharing", "account", "Copy, share or send by NFC", "Share2", "blue", "management", "none", ["share", "nfc", "account", "details", "copy", "qr"]),
  s("certificates", "Certificates", "account", "Balance, tax & account certificates", "FileText", "blue", "information", "none", ["certificate", "tax", "balance certificate"]),
  s("receipts", "Receipts", "account", "All transaction receipts", "Receipt", "green", "information", "none", ["receipt", "proof"]),
  s("limits", "Transaction Limits", "account", "View and set limits", "ListChecks", "gray", "settings", "confirm", ["limit", "transaction"]),
  s("account-opening", "Instant Account Opening", "account", "Open an account with eKYC", "IdCard", "green", "onboarding", "otp", ["account", "open", "ekyc", "nid"]),
  s("profile", "Profile", "account", "Your personal details", "IdCard", "gray", "information", "none", ["profile", "personal"]),

  /* ---------------- Card Management ---------------- */
  s("my-card", "My Card", "cards", "Your card details and controls", "CreditCard", "blue", "management", "confirm", ["card", "my card"]),
  s("card-services", "Card Services", "cards", "Manage all your cards", "CreditCard", "blue", "management", "confirm", ["card", "manage"]),
  s("add-card", "Add Card", "cards", "Add a new card", "PlusCircle", "green", "management", "confirm", ["add", "card"]),
  s("activate-card", "Card Activation", "cards", "Activate a new card", "ShieldCheck", "yellow", "management", "confirm", ["activate", "card"]),
  s("card-controls", "Card Controls", "cards", "Freeze, limits & channels", "Snowflake", "blue", "management", "confirm", ["freeze", "control", "limit", "contactless", "international"]),
  s("reset-card-pin", "Card PIN Reset", "cards", "Reset your card PIN", "CreditCard", "pink", "settings", "otp", ["card", "pin", "reset"]),

  /* ---------------- DPS, Savings & Goals ---------------- */
  s("instant-dps", "Instant DPS", "savings", "Start your DPS in seconds", "Download", "blue", "savings", "confirm", ["dps", "deposit", "instant"]),
  s("group-dps", "Group DPS", "savings", "Save together for shared goals", "Users", "purple", "savings", "confirm", ["group", "dps", "shared"]),
  s("dps", "DPS", "savings", "Deposit pension scheme", "PiggyBank", "green", "savings", "confirm", ["dps", "savings"]),
  s("fdr", "Fixed Deposit", "savings", "Open a fixed deposit", "Landmark", "yellow", "savings", "confirm", ["fdr", "fixed", "deposit"]),
  s("savings-goals", "Savings Goals", "savings", "Track every goal", "Target", "yellow", "savings", "none", ["goal", "savings", "nepal", "iphone"]),
  s("goal-setting", "Goal Setting", "savings", "Plan and achieve your goals", "Target", "yellow", "savings", "none", ["goal", "target", "save"]),
  s("auto-contribution", "Auto Contribution", "savings", "Automate goal savings", "Repeat", "blue", "scheduling", "confirm", ["auto", "contribution"]),
  s("islamic-savings", "Mudaraba Savings", "savings", "Mudaraba savings & deposits", "PiggyBank", "green", "savings", "confirm", ["islamic", "savings", "mudaraba", "dps"]),

  /* ---------------- Loans & Salary ---------------- */
  s("early-salary", "Early Salary Access", "loans", "Get salary before payday", "Banknote", "blue", "transaction", "confirm", ["salary", "advance", "early"]),
  s("loans", "Loan Services", "loans", "Explore loan products", "Coins", "yellow", "information", "none", ["loan", "credit", "repayment", "eligibility"]),
  s("loan-calculator", "Loan Calculator", "loans", "Estimate EMI and loan cost", "Coins", "blue", "information", "none", ["loan", "emi", "calculator"]),

  /* ---------------- AI & Money Tools ---------------- */
  s("ai-money-manager", "AI Money Manager", "ai", "Insights on income, spending & savings", "PieChart", "green", "dashboard", "none", ["budget", "spending", "insights", "money"]),
  s("ai-advisor", "AI Financial Advisor", "ai", "Ask questions about your money", "Lightbulb", "blue", "assistant", "none", ["advisor", "advice", "ai", "chat"]),
  s("voice-assistant", "AI Voice Assistant", "ai", "Speak or type commands", "Mic", "purple", "assistant", "none", ["voice", "speech", "assistant"]),
  s("budget", "Budget Management", "ai", "Set monthly category budgets", "ChartColumn", "yellow", "management", "none", ["budget", "limit"]),
  s("spending-insights", "Smart Insights", "ai", "Where your money goes", "TrendingUp", "green", "dashboard", "none", ["spend", "insight", "analysis", "spending analysis"]),
  s("payment-intelligence", "Automatic Payment Intelligence", "ai", "Detect repeating payments", "Repeat", "purple", "management", "none", ["auto", "detect", "repeat", "intelligence", "recurring detection"]),

  /* ---------------- Rewards & Offers ---------------- */
  s("rewards", "Rewards", "rewards", "Points, levels & redemption", "Award", "yellow", "dashboard", "none", ["reward", "points", "loyalty", "redeem"]),
  s("next-reward", "Next Reward", "rewards", "Your active reward challenge", "Award", "yellow", "dashboard", "none", ["next", "reward", "challenge", "unlock"]),
  s("partner-offers", "Partner Offers", "rewards", "Discounts from local partners", "BadgePercent", "yellow", "management", "none", ["offer", "partner", "discount", "dining", "shopping", "travel offer"]),
  s("reward-offers", "Redeem Points", "rewards", "Redeem your points", "BadgePercent", "pink", "management", "confirm", ["offer", "redeem", "voucher", "points history"]),

  /* ---------------- Security & Support ---------------- */
  s("ai-support", "AI Help", "security", "24/7 instant answers", "Headphones", "purple", "assistant", "none", ["support", "help", "chat", "ai", "helpline"]),
  s("human-support", "Human Agent", "security", "Escalate to a human agent", "Headphones", "blue", "assistant", "none", ["human", "agent", "call", "escalate", "support"]),
  s("help-support", "Support Cases", "security", "Cases & contact", "LifeBuoy", "blue", "management", "none", ["help", "ticket", "support", "case", "complaint"]),
  s("disputes", "Transaction Disputes", "security", "Report and track transaction issues", "ShieldCheck", "pink", "management", "none", ["dispute", "issue", "report", "refund", "complaint"]),
  s("reset-login-pin", "Reset Login PIN", "security", "Reset with OTP", "KeyRound", "pink", "settings", "otp", ["pin", "reset", "login"]),
  s("fingerprint-setup", "Fingerprint Setup", "security", "Enroll fingerprint", "Fingerprint", "yellow", "settings", "confirm", ["fingerprint", "biometric"]),
  s("faceid-setup", "Face ID Setup", "security", "Enroll Face ID", "ScanFace", "blue", "settings", "confirm", ["face", "biometric"]),
  s("biometric-reset", "Biometric Reset", "security", "Remove & re-enroll", "Fingerprint", "purple", "settings", "otp", ["biometric", "reset"]),
  s("trusted-devices", "Trusted Devices", "security", "Manage devices", "MonitorSmartphone", "gray", "settings", "otp", ["device", "trusted"]),
  s("active-sessions", "Active Sessions", "security", "Sign out sessions", "MonitorSmartphone", "blue", "settings", "confirm", ["session", "active"]),
  s("login-history", "Login History", "security", "Recent logins", "LogIn", "gray", "information", "none", ["login", "history"]),
  s("security-settings", "Security", "security", "All security controls", "ShieldCheck", "blue", "settings", "confirm", ["security", "pin", "biometric"]),
  s("faqs", "FAQs", "security", "Common questions", "HelpCircle", "gray", "information", "none", ["faq", "question"]),
  s("tutorials", "Tutorials", "security", "Learn the app", "Lightbulb", "yellow", "information", "none", ["tutorial", "guide"]),
  s("accessibility", "Accessibility", "security", "Text, contrast & voice", "Accessibility", "blue", "settings", "none", ["accessibility", "contrast", "text"]),

  /* ---------------- Other EBL Services ---------------- */
  s("student-file", "EBL Student File Service", "skybanking", "Support for students studying abroad", "GraduationCap", "blue", "information", "none", ["student", "file", "abroad", "study"]),
  s("payroll-banking", "Payroll Banking", "skybanking", "Salary account solutions for organisations", "Banknote", "green", "information", "none", ["payroll", "salary", "corporate"]),
  s("women-payroll", "EBL Women Payroll Suite", "skybanking", "Payroll banking designed for women", "HeartHandshake", "pink", "information", "none", ["women", "payroll", "suite"]),
  s("agent-banking", "Agent Banking", "skybanking", "Banking services through EBL agent points", "Landmark", "yellow", "information", "none", ["agent", "banking", "outlet"]),
  s("entrepreneurial-services", "Entrepreneurial Services", "skybanking", "Support for small businesses and entrepreneurs", "Coins", "purple", "information", "none", ["entrepreneur", "sme", "business"]),
  s("super-saver", "EBL Super Saver", "skybanking", "A savings proposition with added benefits", "PiggyBank", "green", "information", "none", ["super saver", "savings"]),
  s("deposit-rate-sheet", "Deposit Rate Sheet", "skybanking", "Where to find current deposit rates", "FileText", "blue", "information", "none", ["deposit", "rate", "interest"]),
  s("schedule-of-charges", "Schedule of Charges", "skybanking", "Where to find current fees and charges", "FileText", "gray", "information", "none", ["charges", "fees", "schedule"]),
  s("personalization", "Personalization", "skybanking", "Recommendations & pins", "Star", "purple", "settings", "none", ["personalize", "recommend", "favorites", "saved services"]),
  s("customize-dashboard", "Dashboard Settings", "skybanking", "Reorder and hide Home modules", "ListChecks", "purple", "settings", "none", ["dashboard", "customize", "reorder", "home", "layout"]),
  s("notifications", "Notifications", "skybanking", "All alerts", "Bell", "yellow", "information", "none", ["notification", "alert"]),
  s("language", "Language", "skybanking", "English or Bangla", "Languages", "green", "settings", "none", ["language", "bangla"]),
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

/** Legacy service ids retired or merged into a permanent service. */
export const SERVICE_ALIAS_IDS: Record<string, string> = {
  "add-money": "mfs-transfer",
  islamic: "zakat",
  "islamic-mode": "zakat",
  "islamic-accounts": "accounts",
  "security-settings-old": "security-settings",
};

export const resolveServiceId = (id: string) => (byId(id) ? id : SERVICE_ALIAS_IDS[id] ?? id);

export const TINT_BG: Record<Tint, string> = {
  yellow: "bg-tint-yellow",
  green: "bg-tint-green",
  blue: "bg-tint-blue",
  purple: "bg-tint-purple",
  pink: "bg-tint-pink",
  gray: "bg-tint-gray",
};
