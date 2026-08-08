import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { migrateState, remapServiceCategories, seedState } from "./seed";
import type { AppState, Txn } from "./types";

const KEY = "ebl-sky-banking-v2";

type Action =
  | { type: "patch"; payload: Partial<AppState> }
  | { type: "reset" }
  | { type: "hydrate"; payload: AppState }
  | { type: "use-service"; id: string; label?: string }
  | { type: "txn"; payload: TxnInput };

export interface TxnInput {
  title: string;
  serviceId: string;
  category: string;
  amount: number;
  fee?: number;
  accountId?: string;
  note?: string;
  points?: number;
  direction?: "debit" | "credit";
  meta?: Record<string, string>;
}

export const POINT_ELIGIBLE = [
  "Bills", "Recharge", "Education", "Entertainment", "Savings", "Cards", "QR", "Add Money", "Donation", "E-Toll",
];

export const pointsFor = (category: string, amount: number) =>
  POINT_ELIGIBLE.includes(category) ? Math.floor(amount / 100) : 0;

export const levelFor = (p: number) =>
  p >= 6000 ? "Platinum" : p >= 3000 ? "Gold" : p >= 1000 ? "Silver" : "Bronze";

export const nextLevel = (p: number) =>
  p >= 6000 ? { name: "Platinum", need: 0, floor: 6000, ceil: 6000 }
    : p >= 3000 ? { name: "Platinum", need: 6000 - p, floor: 3000, ceil: 6000 }
      : p >= 1000 ? { name: "Gold", need: 3000 - p, floor: 1000, ceil: 3000 }
        : { name: "Silver", need: 1000 - p, floor: 0, ceil: 1000 };

export const timeLabel = () => {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `Today, ${h}:${m} ${ap}`;
};

export const money = (n: number) =>
  "৳" + Math.round(n).toLocaleString("en-US");

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "reset":
      return seedState();
    case "patch":
      return { ...state, ...action.payload };
    case "use-service": {
      const recent = [
        { serviceId: action.id, date: timeLabel() },
        ...state.recent.filter((r) => r.serviceId !== action.id),
      ].slice(0, 8);
      return {
        ...state,
        recent,
        usage: { ...state.usage, [action.id]: (state.usage[action.id] ?? 0) + 1 },
      };
    }
    case "txn": {
      const p = action.payload;
      const fee = p.fee ?? 0;
      const dir = p.direction ?? "debit";
      const pts = p.points ?? pointsFor(p.category, p.amount);
      const accId = p.accountId ?? state.accounts[0]!.id;
      const ref = "EBL" + Math.floor(100000000 + Math.random() * 899999999);
      const txn: Txn = {
        id: ref,
        title: p.title,
        serviceId: p.serviceId,
        category: p.category,
        amount: p.amount,
        fee,
        direction: dir,
        status: "success",
        date: timeLabel(),
        note: p.note,
        points: pts,
        ref,
        meta: p.meta,
      };
      const accounts = state.accounts.map((a) =>
        a.id === accId
          ? { ...a, balance: dir === "debit" ? a.balance - p.amount - fee : a.balance + p.amount }
          : a,
      );
      const missions = state.rewards.missions.map((m) => {
        const hit =
          (m.id === "mi1" && p.category === "Bills") ||
          (m.id === "mi2" && p.category === "Recharge") ||
          (m.id === "mi3" && p.category === "QR") ||
          (m.id === "mi4" && p.category === "Savings");
        return hit ? { ...m, progress: Math.min(m.goal, m.progress + 1) } : m;
      });
      const eco = state.eco ?? { count: 0, countedTxnIds: [] };
      const alreadyCounted = eco.countedTxnIds.includes(txn.id);
      return {
        ...state,
        eco: alreadyCounted
          ? eco
          : { count: eco.count + 1, countedTxnIds: [txn.id, ...eco.countedTxnIds].slice(0, 50) },
        accounts,
        transactions: [txn, ...state.transactions],
        receipts: [
          { id: "R" + ref, txnId: txn.id, title: p.title, amount: p.amount + fee, date: txn.date, ref, status: "Success" },
          ...state.receipts,
        ],
        notifications: [
          {
            id: "N" + ref,
            title: dir === "debit" ? "Payment successful" : "Money received",
            body: `${p.title} — ${money(p.amount)}`,
            date: txn.date,
            read: false,
            kind: "txn" as const,
          },
          ...state.notifications,
        ],
        recent: [
          { serviceId: p.serviceId, date: txn.date },
          ...state.recent.filter((r) => r.serviceId !== p.serviceId),
        ].slice(0, 8),
        usage: { ...state.usage, [p.serviceId]: (state.usage[p.serviceId] ?? 0) + 1 },
        rewards: {
          ...state.rewards,
          points: state.rewards.points + pts,
          monthPoints: state.rewards.monthPoints + pts,
          missions,
          history: pts > 0 ? [{ id: "H" + ref, title: p.title, points: pts, date: txn.date }, ...state.rewards.history] : state.rewards.history,
        },
      };
    }
    default:
      return state;
  }
}

interface Ctx {
  state: AppState;
  patch: (p: Partial<AppState>) => void;
  reset: () => void;
  commitTxn: (p: TxnInput) => void;
  useService: (id: string) => void;
  notify: (title: string, body: string, kind?: "txn" | "security" | "reward" | "info") => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, seedState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...seedState(), ...parsed, migration: parsed.migration } as AppState;
        dispatch({ type: "hydrate", payload: remapServiceCategories(migrateState(merged)) });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      patch: (p) => dispatch({ type: "patch", payload: p }),
      reset: () => {
        localStorage.removeItem(KEY);
        dispatch({ type: "reset" });
      },
      commitTxn: (p) => dispatch({ type: "txn", payload: p }),
      useService: (id) => dispatch({ type: "use-service", id }),
      notify: (title, body, kind = "info") =>
        dispatch({
          type: "patch",
          payload: {
            notifications: [
              { id: "N" + Math.random().toString(36).slice(2), title, body, date: timeLabel(), read: false, kind },
              ...state.notifications,
            ],
          },
        }),
    }),
    [state],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
