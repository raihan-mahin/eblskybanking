import { useState } from "react";
import { SectionCard, ListRow, Button, Sheet, StatusBadge } from "../kit";
import { Icon } from "../Icon";
import { travelOfferFor } from "@/lib/extras";
import { byId } from "@/lib/services";
import starCineplexLogo from "@/assets/star-cineplex-logo.png.asset.json";


export function TravelOfferPanel({ serviceId }: { serviceId: string }) {
  const svc = byId(serviceId);
  const offer = travelOfferFor(serviceId);
  const [confirm, setConfirm] = useState(false);
  const [noPartner, setNoPartner] = useState(false);

  if (!offer) return null;

  const proceed = () => {
    setConfirm(false);
    if (!offer.partnerUrl) { setNoPartner(true); return; }
    window.open(offer.partnerUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <SectionCard>
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tint-yellow overflow-hidden">
            {serviceId === "star-cineplex" ? (
              <img
                src={starCineplexLogo.url}
                alt="Star Cineplex logo"
                className="h-7 w-auto object-contain"
              />
            ) : (
              <Icon name={svc?.icon ?? "Plane"} className="size-6" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold text-primary">{offer.title}</h2>
              <StatusBadge status="Demo Offer" />
            </div>
            <p className="text-[13.5px] text-muted-foreground">{offer.blurb}</p>
          </div>
        </div>
      </SectionCard>



      <SectionCard title="Your EBL offer" subtitle="Personalised for your card">
        <p className="rounded-xl bg-tint-yellow p-3 text-[13.5px] font-medium">{offer.offer}</p>
        <ListRow icon="BadgePercent" tint="green" title="Discount" right={<span className="text-[14px] font-semibold">{offer.discount}</span>} />
        <ListRow icon="Coins" tint="yellow" title="Maximum discount" right={<span className="text-[14px] font-semibold">{offer.maxBenefit}</span>} />
        <ListRow icon="Wallet" tint="blue" title="Minimum spend" right={<span className="text-[14px] font-semibold">{offer.minSpend}</span>} />
        <ListRow icon="CreditCard" tint="purple" title="Eligible payment method" subtitle={offer.eligible} />
        <ListRow icon="CalendarDays" tint="pink" title="Valid until" right={<span className="text-[14px] font-semibold">{offer.expiry}</span>} />
      </SectionCard>

      <SectionCard title="Terms">
        <ul className="list-disc pl-5 text-[12.5px] text-muted-foreground">
          {offer.terms.map((t) => <li key={t} className="py-0.5">{t}</li>)}
        </ul>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
          <Icon name="ExternalLink" className="size-4" />
          <span>Booking is completed on the partner site. This is a prototype demo offer, not a live EBL partnership.</span>
        </div>
        <Button className="mt-3" onClick={() => setConfirm(true)}>Continue to Partner</Button>
      </SectionCard>

      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Leaving EBL Sky Banking">
        <p className="text-[13.5px] text-muted-foreground">
          You are about to leave EBL Sky Banking and continue on the partner site.
        </p>
        <ListRow icon="Store" tint="blue" title="Partner" subtitle={offer.partner} />
        <ListRow icon="BadgePercent" tint="green" title="Selected offer" subtitle={offer.offer} />
        <p className="mt-2 text-[11.5px] text-muted-foreground">
          No PIN, OTP, account or card details are shared with the partner.
        </p>
        <div className="mt-3 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button className="flex-1" onClick={proceed}>Continue</Button>
        </div>
      </Sheet>

      <Sheet open={noPartner} onClose={() => setNoPartner(false)} title="Partner link coming soon">
        <p className="text-[13.5px] text-muted-foreground">
          This demo offer does not have a partner link configured yet. Your offer stays saved and you can return to it any time.
        </p>
        <Button className="mt-3" onClick={() => setNoPartner(false)}>Back to offer</Button>
      </Sheet>
    </>
  );
}
