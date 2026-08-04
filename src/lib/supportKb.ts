/**
 * Local banking-support knowledge base for the EBL Sky AI Helpline.
 * Pure local data + intent matching — no external API, no backend.
 */

export interface KbAction {
  label: string;
  /** Service id, or a special token: __human, __case, __call, __more, __pay */
  target: string;
}

export interface KbTopic {
  id: string;
  /** Short chip label */
  label: string;
  category: KbCategory;
  keywords: string[];
  answer: string;
  steps?: string[];
  actions?: KbAction[];
  /** Show the never-share warning with this answer */
  warn?: boolean;
  /** Offer human help immediately (urgent security topics) */
  urgent?: boolean;
}

export type KbCategory =
  | "Login & Security"
  | "Cards"
  | "Transfers"
  | "Mobile Recharge"
  | "Bills & Payments"
  | "Accounts & Savings"
  | "Rewards"
  | "Complaints"
  | "General";

export const KB_CATEGORIES: KbCategory[] = [
  "Login & Security", "Cards", "Transfers", "Mobile Recharge",
  "Bills & Payments", "Accounts & Savings", "Rewards", "Complaints", "General",
];

const HUMAN: KbAction = { label: "Talk to Human", target: "__human" };

export const KB: KbTopic[] = [
  // ---------------- Login & Security ----------------
  {
    id: "reset-login-pin", label: "Reset Login PIN", category: "Login & Security",
    keywords: ["reset login pin", "login pin", "forgot pin", "pin reset", "change login pin", "new pin"],
    answer: "You can reset your login PIN after verifying your registered mobile number.",
    steps: ["Open Security.", "Select Reset Login PIN.", "Complete OTP verification and set a new PIN."],
    actions: [{ label: "Open PIN Reset", target: "reset-login-pin" }, HUMAN], warn: true,
  },
  {
    id: "change-login-pin", label: "Change Login PIN", category: "Login & Security",
    keywords: ["change pin", "update pin", "set new login pin"],
    answer: "Changing your login PIN takes a few seconds from Security settings.",
    steps: ["Open Security settings.", "Select Reset Login PIN.", "Confirm the OTP and set the new PIN."],
    actions: [{ label: "Open Security", target: "security-settings" }, HUMAN], warn: true,
  },
  {
    id: "forgot-password", label: "Forgotten password", category: "Login & Security",
    keywords: ["password", "forgot password", "cannot login", "can't log in", "login problem"],
    answer: "Password recovery uses the same mobile-number verification as PIN reset.",
    steps: ["Open Reset Login PIN.", "Verify your registered mobile number.", "Set a new PIN or password."],
    actions: [{ label: "Open PIN Reset", target: "reset-login-pin" }, HUMAN], warn: true,
  },
  {
    id: "account-locked", label: "Account locked", category: "Login & Security",
    keywords: ["locked", "blocked account", "temporarily locked", "too many attempts", "incorrect pin attempts"],
    answer: "Repeated incorrect PIN attempts lock the app for 30 minutes to protect your account.",
    steps: ["Wait for the lock period, or", "Reset your login PIN with OTP verification.", "Log in again."],
    actions: [{ label: "Open PIN Reset", target: "reset-login-pin" }, HUMAN],
  },
  {
    id: "fingerprint-setup", label: "Fingerprint setup", category: "Login & Security",
    keywords: ["fingerprint", "touch id", "biometric setup"],
    answer: "Fingerprint login is enrolled from Fingerprint Setup.",
    steps: ["Open Fingerprint Setup.", "Confirm your login PIN.", "Complete the scan to enroll."],
    actions: [{ label: "Open Fingerprint Setup", target: "fingerprint-setup" }],
  },
  {
    id: "faceid-setup", label: "Face ID setup", category: "Login & Security",
    keywords: ["face id", "face unlock", "facial"],
    answer: "Face ID login is enrolled from Face ID Setup.",
    steps: ["Open Face ID Setup.", "Confirm your login PIN.", "Complete the face scan."],
    actions: [{ label: "Open Face ID Setup", target: "faceid-setup" }],
  },
  {
    id: "biometric-reset", label: "Reset biometrics", category: "Login & Security",
    keywords: ["biometric reset", "remove fingerprint", "reset face id"],
    answer: "Biometric Reset removes the current enrollment so you can enroll again.",
    steps: ["Open Biometric Reset.", "Verify PIN and OTP.", "Enroll fingerprint or Face ID again."],
    actions: [{ label: "Open Biometric Reset", target: "biometric-reset" }],
  },
  {
    id: "otp-not-received", label: "OTP Not Received", category: "Login & Security",
    keywords: ["otp not received", "no otp", "otp missing", "did not get otp", "resend otp"],
    answer: "OTP delivery can be delayed by network congestion. It stays valid for 2 minutes.",
    steps: ["Check network coverage and SMS inbox.", "Wait 30 seconds and tap Resend OTP.", "Confirm your registered mobile number is correct."],
    actions: [{ label: "Open Profile", target: "profile" }, HUMAN], warn: true,
  },
  {
    id: "otp-incorrect", label: "Incorrect OTP", category: "Login & Security",
    keywords: ["incorrect otp", "wrong otp", "otp invalid", "otp expired"],
    answer: "An incorrect or expired OTP cancels the transaction — no money is deducted.",
    steps: ["Start the action again.", "Request a fresh OTP.", "Enter it within 2 minutes."],
    actions: [{ label: "View History", target: "transaction-history" }, HUMAN], warn: true,
  },
  {
    id: "new-device", label: "New device registration", category: "Login & Security",
    keywords: ["new device", "register device", "another phone", "device registration"],
    answer: "A new device must be registered with OTP before it can access your account.",
    steps: ["Log in on the new device.", "Verify the OTP sent to your registered number.", "Approve the device in Trusted Devices."],
    actions: [{ label: "Trusted Devices", target: "trusted-devices" }, HUMAN],
  },
  {
    id: "trusted-devices", label: "Trusted devices", category: "Login & Security",
    keywords: ["trusted device", "device list", "remove device"],
    answer: "Trusted Devices lists every device signed in to your account. Remove any you don't recognise.",
    actions: [{ label: "Trusted Devices", target: "trusted-devices" }, { label: "End Active Sessions", target: "active-sessions" }],
  },
  {
    id: "suspicious-login", label: "Suspicious login", category: "Login & Security",
    keywords: ["suspicious login", "unknown login", "someone logged in", "hacked", "pin exposed"],
    answer: "Act now: end other sessions and change your PIN. Never share your PIN or OTP with anyone.",
    steps: ["End all active sessions.", "Reset your login PIN.", "Review Login History for unknown entries."],
    actions: [{ label: "End Active Sessions", target: "active-sessions" }, { label: "Change PIN", target: "reset-login-pin" }, { label: "Login History", target: "login-history" }, HUMAN],
    warn: true, urgent: true,
  },
  {
    id: "lost-phone", label: "Lost or stolen phone", category: "Login & Security",
    keywords: ["lost phone", "stolen phone", "phone stolen", "phone missing"],
    answer: "Secure the account immediately by ending sessions and freezing your card.",
    steps: ["End all active sessions.", "Freeze your card from Card Controls.", "Call EBL on 16230 to confirm."],
    actions: [{ label: "End Active Sessions", target: "active-sessions" }, { label: "Freeze Card", target: "card-controls" }, { label: "Call EBL", target: "__call" }, HUMAN],
    urgent: true,
  },

  // ---------------- Cards ----------------
  {
    id: "card-activation", label: "Card activation", category: "Cards",
    keywords: ["activate card", "card activation", "new card", "card not active"],
    answer: "A new card is activated from Card Services after identity verification.",
    steps: ["Open Activate Card.", "Select the card to activate.", "Confirm with biometrics or PIN and OTP."],
    actions: [{ label: "Activate Card", target: "activate-card" }, { label: "Open Card Services", target: "card-services" }, HUMAN], warn: true,
  },
  {
    id: "card-pin", label: "Activate or Reset Card PIN", category: "Cards",
    keywords: ["card pin", "reset card pin", "generate card pin", "change card pin", "atm pin"],
    answer: "You can generate or reset your card PIN in the app — never share it with anyone.",
    steps: ["Open Reset Card PIN.", "Select the card and verify identity.", "Confirm the OTP and set the new card PIN."],
    actions: [{ label: "Reset Card PIN", target: "reset-card-pin" }, { label: "Open Card Services", target: "card-services" }, HUMAN], warn: true,
  },
  {
    id: "card-frozen", label: "Card Lost or Blocked", category: "Cards",
    keywords: ["card lost", "lost card", "card blocked", "card frozen", "freeze card", "unfreeze", "card stolen"],
    answer: "Freeze the card instantly from Card Controls — you can unfreeze it any time.",
    steps: ["Open Card Controls.", "Select the card and toggle Freeze Card.", "Call 16230 if the card was stolen."],
    actions: [{ label: "Freeze Card", target: "card-controls" }, { label: "Call EBL", target: "__call" }, HUMAN], urgent: true,
  },
  {
    id: "card-controls", label: "Card transaction controls", category: "Cards",
    keywords: ["online transaction", "international transaction", "contactless", "card limit", "transaction control"],
    answer: "Online, international, contactless usage and limits are all managed in Card Controls.",
    steps: ["Open Card Controls.", "Select the card.", "Toggle the control or adjust the limit."],
    actions: [{ label: "Open Card Controls", target: "card-controls" }],
  },
  {
    id: "card-statement", label: "Card statement", category: "Cards",
    keywords: ["card statement", "unbilled", "card bill", "card due"],
    answer: "Card statements and unbilled transactions are listed under Card Services.",
    steps: ["Open Card Services.", "Select the card.", "View the statement or unbilled transactions."],
    actions: [{ label: "Open Card Services", target: "card-services" }, { label: "Statements", target: "statements" }],
  },
  {
    id: "card-payment", label: "Card payment", category: "Cards",
    keywords: ["card payment", "pay card bill", "credit card bill"],
    answer: "Pay your card bill from Card Payment using any linked account.",
    steps: ["Open Card Payment.", "Choose the card and amount.", "Confirm with biometrics or PIN."],
    actions: [{ label: "Open Card Payment", target: "card-payment" }],
  },
  {
    id: "card-unauthorized", label: "Unauthorized card transaction", category: "Cards",
    keywords: ["unauthorized", "unauthorised", "i did not make", "fraud", "not my transaction"],
    answer: "Freeze the card first, then report the transaction so it can be investigated.",
    steps: ["Freeze the card in Card Controls.", "Report the transaction as a support case.", "An agent follows up on the case."],
    actions: [{ label: "Freeze Card", target: "card-controls" }, { label: "Report an Issue", target: "__case" }, HUMAN],
    warn: true, urgent: true,
  },

  // ---------------- Transfers ----------------
  {
    id: "transfer-how", label: "How to transfer money", category: "Transfers",
    keywords: ["transfer money", "send money", "fund transfer", "how to transfer"],
    answer: "Fund Transfer supports own account, EBL, other banks and MFS wallets.",
    steps: ["Open Fund Transfer and pick the type.", "Select the recipient and enter the amount.", "Confirm with biometrics or PIN (OTP above ৳5,000)."],
    actions: [{ label: "Open Fund Transfer", target: "fund-transfer" }],
  },
  {
    id: "transfer-mfs", label: "MFS transfer", category: "Transfers",
    keywords: ["bkash", "nagad", "rocket", "upay", "mfs", "wallet"],
    answer: "MFS Transfer sends money to bKash, Nagad, Rocket or Upay wallets.",
    steps: ["Open MFS Transfer.", "Select the provider and wallet number.", "Enter the amount and confirm."],
    actions: [{ label: "Open MFS Transfer", target: "mfs-transfer" }],
  },
  {
    id: "transfer-phone", label: "Phone-number transfer", category: "Transfers",
    keywords: ["phone number transfer", "send by mobile", "mobile number transfer"],
    answer: "Send by Mobile Number finds the linked account from an 11-digit number.",
    steps: ["Open Send by Mobile Number.", "Enter the number and tap Find recipient.", "Check the masked account and name, then confirm."],
    actions: [{ label: "Send by Mobile Number", target: "phone-transfer" }],
  },
  {
    id: "beneficiary", label: "Beneficiary problems", category: "Transfers",
    keywords: ["beneficiary", "add recipient", "saved recipient", "recipient details"],
    answer: "Beneficiaries are saved recipients you can reuse for one-tap transfers.",
    steps: ["Open Beneficiaries.", "Add, edit or remove a recipient.", "New beneficiaries are active immediately."],
    actions: [{ label: "Open Beneficiaries", target: "beneficiaries" }, HUMAN],
  },
  {
    id: "transfer-failed", label: "Transfer Failed", category: "Transfers",
    keywords: ["transfer failed", "transfer not successful", "money not sent", "failed transfer"],
    answer: "Let me check your latest transfer record and the stored failure reason.",
    actions: [{ label: "View Transaction", target: "transaction-history" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "transfer-pending", label: "Transfer pending", category: "Transfers",
    keywords: ["transfer pending", "processing", "still pending", "not credited", "recipient did not receive"],
    answer: "Pending transfers usually settle within 30 minutes; other-bank transfers can take one working day.",
    steps: ["Check the status in Transfer History.", "Wait for the settlement window.", "Report an issue if it stays pending."],
    actions: [{ label: "View History", target: "transaction-history" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "transfer-limit", label: "Transaction limit", category: "Transfers",
    keywords: ["limit", "daily limit", "maximum transfer", "limit exceeded"],
    answer: "Daily and per-transaction limits are shown in Limits and can be adjusted there.",
    actions: [{ label: "Open Limits", target: "limits" }, HUMAN],
  },
  {
    id: "scheduled-transfer", label: "Scheduled transfer", category: "Transfers",
    keywords: ["scheduled transfer", "schedule", "future transfer", "cancel schedule", "edit schedule"],
    answer: "Scheduled transfers can be edited or cancelled any time before the run date.",
    steps: ["Open Scheduled Transfer.", "Select the instruction.", "Edit the details or cancel it."],
    actions: [{ label: "Scheduled Transfer", target: "scheduled-transfer" }],
  },
  {
    id: "transfer-receipt", label: "Transfer receipt", category: "Transfers",
    keywords: ["receipt", "download receipt", "proof of payment", "share receipt"],
    answer: "Every successful transaction generates a receipt you can download or share.",
    steps: ["Open Receipts.", "Select the transaction.", "Download or share the receipt."],
    actions: [{ label: "Open Receipts", target: "receipts" }],
  },
  {
    id: "repeat-transfer", label: "Repeat a transfer", category: "Transfers",
    keywords: ["repeat transfer", "send again", "same recipient"],
    answer: "Favorites on Home reopen a transfer with the recipient and amount prefilled.",
    actions: [{ label: "Open Pay & Transfer", target: "__pay" }],
  },

  // ---------------- Mobile Recharge ----------------
  {
    id: "recharge-how", label: "How to recharge", category: "Mobile Recharge",
    keywords: ["recharge", "top up", "mobile recharge", "flexiload"],
    answer: "Mobile Recharge detects the operator from the number automatically.",
    steps: ["Open Mobile Recharge and enter or pick the number.", "Check the detected operator.", "Enter the amount and confirm."],
    actions: [{ label: "Open Mobile Recharge", target: "recharge" }],
  },
  {
    id: "recharge-contacts", label: "Select from contacts", category: "Mobile Recharge",
    keywords: ["contacts", "select contact", "phonebook", "contact picker"],
    answer: "Tap Select from Contacts in Mobile Recharge to pick a saved number — it is normalised to 11 digits automatically.",
    actions: [{ label: "Open Mobile Recharge", target: "recharge" }],
  },
  {
    id: "recharge-operator", label: "Operator detection", category: "Mobile Recharge",
    keywords: ["operator", "grameenphone", "robi", "airtel", "banglalink", "teletalk", "change operator"],
    answer: "The prefix sets the operator: 017/013 GP, 018 Robi, 016 Airtel, 019/014 Banglalink, 015 Teletalk. Tap the operator tile to change it.",
    actions: [{ label: "Open Mobile Recharge", target: "recharge" }],
  },
  {
    id: "recharge-failed", label: "Mobile Recharge Failed", category: "Mobile Recharge",
    keywords: ["recharge failed", "recharge not received", "balance deducted", "recharge problem", "recharge pending"],
    answer: "Let me check your latest recharge record and the stored failure reason.",
    actions: [{ label: "Retry Recharge", target: "recharge" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "recharge-packs", label: "Internet or minute packs", category: "Mobile Recharge",
    keywords: ["internet pack", "minute pack", "bundle", "data pack", "sms pack"],
    answer: "Packs are on the Internet, Minutes, SMS and Bundle tabs inside Mobile Recharge.",
    steps: ["Open Mobile Recharge and enter the number.", "Switch to the pack tab.", "Select a pack and confirm."],
    actions: [{ label: "Open Mobile Recharge", target: "recharge" }],
  },
  {
    id: "recharge-wrong-number", label: "Wrong mobile number", category: "Mobile Recharge",
    keywords: ["wrong number", "incorrect mobile number", "recharged wrong"],
    answer: "A completed recharge to a wrong number needs investigation — report it as a support case.",
    actions: [{ label: "Report an Issue", target: "__case" }, HUMAN],
  },

  // ---------------- Bills & Payments ----------------
  {
    id: "bill-how", label: "Bill Payment Problem", category: "Bills & Payments",
    keywords: ["bill", "electricity", "gas bill", "water bill", "internet bill", "desco", "wasa", "bill payment"],
    answer: "Electricity, gas, water, internet and TV bills are all paid from Bill Payment.",
    steps: ["Open Bill Payment and choose the biller.", "Enter the account or meter number.", "Review the amount and confirm."],
    actions: [{ label: "Open Bill Payment", target: "bill-payment" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "bill-not-updated", label: "Bill paid but not updated", category: "Bills & Payments",
    keywords: ["bill not updated", "duplicate payment", "paid twice", "double deduction"],
    answer: "Billers can take up to 24 hours to update. A duplicate deduction can be reported for refund.",
    steps: ["Check the receipt in Receipts.", "Wait for the biller update window.", "Report an issue if it is still wrong."],
    actions: [{ label: "Open Receipts", target: "receipts" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "auto-pay", label: "Auto Pay & saved billers", category: "Bills & Payments",
    keywords: ["auto pay", "autopay", "saved biller", "bill reminder", "scheduled bill"],
    answer: "Auto Pay pays a saved biller automatically on your chosen schedule.",
    steps: ["Open Auto Pay.", "Pick the biller, amount and frequency.", "Confirm to activate."],
    actions: [{ label: "Open Auto Pay", target: "auto-pay" }, { label: "Saved Billers", target: "saved-billers" }],
  },
  {
    id: "tuition", label: "Tuition fee", category: "Bills & Payments",
    keywords: ["tuition", "school fee", "university fee", "education payment"],
    answer: "Tuition Fee retrieves the payable amount after you enter the student details.",
    steps: ["Open Tuition Fee.", "Select level and institution.", "Retrieve the amount and confirm."],
    actions: [{ label: "Open Tuition Fee", target: "tuition-fee" }],
  },

  // ---------------- Accounts & Savings ----------------
  {
    id: "balance", label: "Account balance", category: "Accounts & Savings",
    keywords: ["balance", "how much money", "available balance"],
    answer: "I can show your balance after a quick verification.",
    actions: [{ label: "Open Accounts", target: "accounts" }],
  },
  {
    id: "statement", label: "Statement & history", category: "Accounts & Savings",
    keywords: ["statement", "transaction history", "download statement", "history"],
    answer: "Transaction History shows every entry; Statements generates a downloadable PDF.",
    actions: [{ label: "Open History", target: "transaction-history" }, { label: "Statements", target: "statements" }],
  },
  {
    id: "share-account", label: "Share account information", category: "Accounts & Savings",
    keywords: ["share account", "account qr", "nfc", "share info"],
    answer: "Share Account Details copies masked details, shows an account QR or shares by NFC.",
    actions: [{ label: "Share Account Details", target: "account-sharing" }, { label: "Account QR", target: "qr-payment" }],
  },
  {
    id: "goals", label: "Savings goals", category: "Accounts & Savings",
    keywords: ["goal", "nepal", "iphone", "savings goal", "contribute"],
    answer: "Goal progress and contributions are managed in Savings Goals; contributions move money from Savings.",
    actions: [{ label: "Open Goals", target: "savings-goals" }],
  },
  {
    id: "dps", label: "DPS & deposits", category: "Accounts & Savings",
    keywords: ["dps", "instant dps", "group dps", "fixed deposit", "fdr", "deposit"],
    answer: "Instant DPS opens in seconds, Group DPS saves with others, and FDR holds a fixed deposit.",
    actions: [{ label: "Instant DPS", target: "instant-dps" }, { label: "Group DPS", target: "group-dps" }, { label: "Open FDR", target: "fdr" }],
  },

  // ---------------- Rewards ----------------
  {
    id: "rewards", label: "Reward points", category: "Rewards",
    keywords: ["reward", "points", "next reward", "redeem", "cashback"],
    answer: "You earn 1 point per ৳100 of eligible spending and can redeem points for offers.",
    steps: ["Open Rewards to see your balance.", "Pick an offer in Reward Offers.", "Confirm to redeem instantly."],
    actions: [{ label: "Open Rewards", target: "rewards" }, { label: "Reward Offers", target: "reward-offers" }],
  },
  {
    id: "partner-offers", label: "Partner offers", category: "Rewards",
    keywords: ["partner offer", "discount", "birthday offer", "voucher", "offer expiry"],
    answer: "Partner Offers lists current demo campaigns, including your birthday offer, with their validity.",
    actions: [{ label: "Partner Offers", target: "partner-offers" }],
  },
  {
    id: "reward-missing", label: "Reward not received", category: "Rewards",
    keywords: ["reward not received", "points missing", "points not added"],
    answer: "Points post after the transaction settles, usually within a day. If they are still missing, report it.",
    actions: [{ label: "Open Rewards", target: "rewards" }, { label: "Report an Issue", target: "__case" }, HUMAN],
  },

  // ---------------- Complaints ----------------
  {
    id: "report-issue", label: "Report an issue", category: "Complaints",
    keywords: ["report", "complaint", "issue", "dispute", "problem"],
    answer: "Reporting takes one step — pick the issue and I prefill everything else from your account.",
    actions: [{ label: "Report an Issue", target: "__case" }, HUMAN],
  },
  {
    id: "track-case", label: "Track a Complaint", category: "Complaints",
    keywords: ["track", "case status", "complaint status", "my cases", "previous complaint", "ticket"],
    answer: "Your support cases and their status are listed below the chat, and disputes have a full timeline.",
    actions: [{ label: "Track Case", target: "__cases" }, { label: "Open Disputes", target: "disputes" }],
  },

  // ---------------- General ----------------
  {
    id: "contact", label: "Contact EBL", category: "General",
    keywords: ["contact", "call", "phone number", "hotline", "16230", "branch", "atm"],
    answer: "EBL Contact Centre: 16230 (local) or +880 9666 777 777 from overseas. Branch and ATM details are in Explore.",
    actions: [{ label: "Call EBL", target: "__call" }, HUMAN],
  },
  {
    id: "navigation", label: "App navigation", category: "General",
    keywords: ["find", "where is", "navigate", "search service", "explore"],
    answer: "Use Search in the header for any service, or browse Explore for the full catalogue.",
    actions: [{ label: "Open Explore", target: "__explore" }],
  },
  {
    id: "settings", label: "Accessibility & notifications", category: "General",
    keywords: ["accessibility", "text size", "notification", "language", "settings"],
    answer: "Text size, contrast, notifications and language are all in Settings.",
    actions: [{ label: "Accessibility", target: "accessibility" }, { label: "Notifications", target: "notifications" }],
  },
];

/** Chips shown by default in the AI assistant. */
export const QUICK_CHIPS = [
  "Reset Login PIN", "Activate or Reset Card PIN", "Transfer Failed", "Mobile Recharge Failed",
  "OTP Not Received", "Card Lost or Blocked", "Bill Payment Problem", "Track a Complaint",
];

/** Topics that must never be answered with invented live data. */
const LIVE_PATTERNS = /dollar rate|exchange rate|usd rate|current charge|today'?s rate|current offer|branch open|opening hour|market rate/i;

export const isLiveInfoQuestion = (q: string) => LIVE_PATTERNS.test(q);

export const NEVER_SHARE = "Never share your PIN, password, CVV or OTP with anyone, including support agents.";

/** Simple keyword-score intent matching over the local knowledge base. */
export function matchTopic(query: string): KbTopic | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const words = q.split(/[^a-z0-9\u0980-\u09FF]+/).filter((w) => w.length > 2);
  let best: { topic: KbTopic; score: number } | null = null;

  for (const topic of KB) {
    let score = 0;
    if (topic.label.toLowerCase() === q) score += 100;
    for (const k of topic.keywords) {
      if (q.includes(k)) score += 10 + k.length / 4;
      else if (k.split(" ").every((part) => words.includes(part))) score += 6;
    }
    for (const w of words) if (topic.label.toLowerCase().includes(w)) score += 2;
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best && best.score >= 6 ? best.topic : null;
}

export const topicsByCategory = (c: KbCategory) => KB.filter((t) => t.category === c);
