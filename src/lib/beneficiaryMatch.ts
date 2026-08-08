// Confidence-scored matching of a spoken phrase against saved beneficiaries.
// Purely presentational helper: it never creates or mutates beneficiary data.

const FILLER = new Set([
  "send", "sent", "money", "cash", "taka", "tk", "to", "the", "transfer", "transfers",
  "pay", "paying", "payment", "open", "fund", "funds", "please", "my", "a", "an",
  "account", "beneficiary", "for", "with", "and", "show", "find", "search", "make",
]);

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export const extractNameQuery = (raw: string) =>
  normalize(raw).split(" ").filter((w) => w && !FILLER.has(w)).join(" ");

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length || !b.length) return Math.max(a.length, b.length);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j]! + 1,
        row[j - 1]! + 1,
        prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = row;
  }
  return prev[b.length]!;
}

const similarity = (a: string, b: string) => {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 0 : 1 - levenshtein(a, b) / max;
};

/** Score one query token against one name token: exact > prefix > fuzzy. */
function tokenScore(q: string, t: string): number {
  if (q === t) return 1;
  if (t.startsWith(q)) return q.length >= 3 ? 0.92 : 0.72;
  if (q.startsWith(t)) return 0.85;
  if (t.includes(q) && q.length >= 4) return 0.78;
  const sim = similarity(q, t);
  return sim >= 0.7 ? sim * 0.9 : 0;
}

export interface BenLike {
  id: string;
  name: string;
  bank: string;
  account: string;
  kind: string;
}

export interface ScoredBeneficiary<T extends BenLike> {
  item: T;
  score: number;
}

/**
 * Returns beneficiaries ranked by confidence (0-1), best first.
 * Only candidates above a minimum confidence are returned.
 */
export function matchBeneficiaries<T extends BenLike>(
  query: string,
  beneficiaries: readonly T[],
  minScore = 0.45,
): ScoredBeneficiary<T>[] {

  const qTokens = extractNameQuery(query).split(" ").filter(Boolean);
  if (!qTokens.length) return [];

  const digits = query.replace(/\D/g, "");

  const joined = qTokens.join(" ");

  const scored = beneficiaries.map((b) => {
    const fullName = normalize(b.name);
    const nameTokens = fullName.split(" ").filter(Boolean);
    const bankTokens = normalize(b.bank).split(" ").filter(Boolean);

    const bests = qTokens.map((q) =>
      Math.max(
        0,
        ...nameTokens.map((t) => tokenScore(q, t)),
        ...bankTokens.map((t) => tokenScore(q, t) * 0.55),
      ),
    );
    const avg = bests.reduce((a, v) => a + v, 0) / bests.length;
    const bestSingle = Math.max(...bests);

    // Extra spoken words ("send five hundred to ammu") must not drown a strong name hit.
    let score = Math.max(avg, bestSingle * 0.9);

    // Reward covering more of the stored name (full-name utterances beat single-token ones).
    const covered = nameTokens.filter((t) => qTokens.some((q) => tokenScore(q, t) >= 0.7)).length;
    score += (covered / Math.max(1, nameTokens.length)) * 0.12;

    // Direct substring of the saved name is a strong, speech-friendly signal.
    if (joined.length >= 3 && fullName.includes(joined)) score += 0.25;

    // Account-number mention is a strong signal.
    if (digits.length >= 4 && b.account.replace(/\D/g, "").includes(digits)) score += 0.35;

    return { item: b, score: Math.min(1, score) };
  });


  return scored
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

/** Decide what the assistant should do with the ranked results. */
export function resolveMatch<T extends BenLike>(ranked: ScoredBeneficiary<T>[]) {
  if (!ranked.length) return { kind: "none" as const };
  const [top, second] = ranked;
  const confident = top!.score >= 0.82 && (!second || top!.score - second.score >= 0.12);
  if (confident) return { kind: "one" as const, item: top!.item };
  return { kind: "many" as const, items: ranked.slice(0, 6).map((r) => r.item) };
}
