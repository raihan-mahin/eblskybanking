import { useState } from "react";
import { Share2 } from "lucide-react";
import { SectionCard, Button, ProgressBar, StatusBadge, ServiceTile, FormField, TextInput, Sheet, useToast } from "@/components/kit";
import { AuthenticationSheet } from "@/components/AuthenticationSheet";
import { useApp, money } from "@/lib/store";

export function GroupDpsPanel() {
  const { state, patch, commitTxn } = useApp();
  const toast = useToast();
  const group = state.groupDps[0];
  const [pay, setPay] = useState(false);
  const [auth, setAuth] = useState(false);
  const [amount, setAmount] = useState(String(group?.monthly ?? 500));
  const [member, setMember] = useState("Mahin");
  const [create, setCreate] = useState(false);
  const [form, setForm] = useState({ title: "", target: "", monthly: "" });

  if (!group) return <SectionCard title="Group DPS"><p className="text-[13.5px] text-muted-foreground">No groups yet.</p></SectionCard>;

  const pct = (group.saved / group.target) * 100;

  const contribute = () => {
    const amt = Number(amount || 0);
    commitTxn({ title: `Group DPS — ${group.title}`, serviceId: "group-dps", category: "Savings", amount: amt });
    patch({
      groupDps: state.groupDps.map((g) => g.id === group.id ? {
        ...g,
        saved: g.saved + amt,
        members: g.members.map((m) => (m.name === member ? { ...m, status: "Paid" as const } : m)),
        activity: [{ id: "ga" + Date.now(), text: `${member} contributed ${money(amt)}`, date: "Today", amount: amt, status: "success" }, ...g.activity],
      } : g),
    });
    setPay(false); toast.show("Contribution successful");
  };

  const action = (label: string) => {
    if (label === "Add Member") {
      patch({ groupDps: state.groupDps.map((g) => g.id === group.id ? { ...g, members: [...g.members, { name: "New Member", status: "Pending" }] } : g) });
      toast.show("Member invited");
    } else if (label === "Remind Members") toast.show("Reminders sent to pending members");
    else if (label === "Set Auto Contribution") {
      patch({ schedules: [{ id: "sc" + Date.now(), name: `${group.title} auto contribution`, serviceType: "Group DPS", recipient: group.title, amount: group.monthly, frequency: "Monthly", start: group.next, account: state.accounts[0].name, reminder: true, active: true, autoPay: true, history: [] }, ...state.schedules] });
      toast.show("Auto contribution scheduled");
    } else toast.show(`${group.activity.length} activity entries`);
  };

  return (
    <>
      <SectionCard>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-primary">{group.title}</h2>
            <p className="text-[13px] text-muted-foreground">Save together for shared goals.</p>
          </div>
          <button onClick={() => toast.show("Invite link copied")} className="press grid size-9 place-items-center rounded-full bg-muted">
            <Share2 className="size-4" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[["Target Amount", money(group.target)], ["Total Saved", money(group.saved)], ["Monthly / Member", money(group.monthly)]].map(([l, v]) => (
            <div key={l}>
              <p className="text-[11.5px] text-muted-foreground">{l}</p>
              <p className="text-[14.5px] font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <ProgressBar value={pct} />
          <span className="text-[12.5px] font-semibold text-accent">{pct.toFixed(1)}%</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-[13px]">
          <div><p className="text-muted-foreground">Next Contribution</p><p className="font-medium">{group.next}</p></div>
          <div><p className="text-muted-foreground">Group Members</p><p className="font-medium">{group.members.length} Members</p></div>
        </div>
      </SectionCard>

      <SectionCard title="Group Members">
        {group.members.map((m) => (
          <div key={m.name} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
            <span className="grid size-9 place-items-center rounded-full bg-tint-green text-[13px] font-semibold">{m.name.slice(0, 1)}</span>
            <span className="flex-1 text-[15px]">{m.name}</span>
            <StatusBadge status={m.status} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Actions">
        <div className="grid grid-cols-4">
          {[["Add Member", "UserPlus", "yellow"], ["Set Auto Contribution", "Repeat", "green"], ["Remind Members", "Bell", "blue"], ["Activity History", "FileText", "purple"]].map(([l, i, t]) => (
            <ServiceTile key={l} icon={i!} tint={t as never} label={l!} onClick={() => action(l!)} />
          ))}
        </div>
        <Button className="mt-2" onClick={() => setPay(true)}>Pay Contribution</Button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setCreate(true)}>Create Group</Button>
          <Button variant="outline" onClick={() => toast.show("You left the group (demo)")}>Leave Group</Button>
        </div>
      </SectionCard>

      <SectionCard title="Recent Activity">
        {group.activity.map((a) => (
          <div key={a.id} className="flex items-center justify-between border-b border-border py-3 last:border-0">
            <div>
              <p className="text-[14px]">{a.text}</p>
              <p className="text-[12px] text-muted-foreground">{a.date}</p>
            </div>
            <span className={a.status === "success" ? "text-[13px] text-success" : "text-[13px] text-pending"}>
              {a.status === "success" ? `+${money(a.amount)}` : "Pending"}
            </span>
          </div>
        ))}
      </SectionCard>

      <Sheet open={pay} onClose={() => setPay(false)} title="Pay contribution">
        <div className="space-y-3">
          <FormField label="Member">
            <select value={member} onChange={(e) => setMember(e.target.value)} className="w-full rounded-xl border border-border px-3.5 py-3 text-[15px]">
              {group.members.map((m) => <option key={m.name}>{m.name}</option>)}
            </select>
          </FormField>
          <FormField label="Amount"><TextInput inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} /></FormField>
          <p className="text-[13px] text-muted-foreground">From {state.accounts[0].name} · {state.accounts[0].masked}</p>
          <Button onClick={() => setAuth(true)}>Review & Confirm</Button>
        </div>
      </Sheet>

      <Sheet open={create} onClose={() => setCreate(false)} title="Create group">
        <div className="space-y-3">
          <FormField label="Group goal"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Target amount"><TextInput inputMode="numeric" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value.replace(/\D/g, "") })} /></FormField>
          <FormField label="Monthly per member"><TextInput inputMode="numeric" value={form.monthly} onChange={(e) => setForm({ ...form, monthly: e.target.value.replace(/\D/g, "") })} /></FormField>
          <Button onClick={() => {
            if (!form.title || !form.target) return toast.show("Enter goal and target");
            patch({ groupDps: [...state.groupDps, { id: "gd" + Date.now(), title: form.title, target: Number(form.target), saved: 0, monthly: Number(form.monthly || 0), next: "01 Jun 2025", members: [{ name: "Mahin", status: "Pending" }], activity: [] }] });
            setCreate(false); toast.show("Group created");
          }}>Create group</Button>
        </div>
      </Sheet>

      <AuthenticationSheet open={auth} amount={Number(amount || 0)} onClose={() => setAuth(false)}
        onSuccess={() => { setAuth(false); contribute(); }} />
      {toast.node}
    </>
  );
}
