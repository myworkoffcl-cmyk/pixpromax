import { GoogleAd } from "@/components/google-ad";

const adSlots = {
  "home-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM,
  "tool-bottom": process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_BOTTOM,
} as const;

export function AdSlot({ placement }: { placement: keyof typeof adSlots }) {
  const slot = adSlots[placement];
  const adsEnabled = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT && slot);

  return (
    <aside className="ad-wrap shell" aria-label="Advertisement">
      <span>Advertisement</span>
      <div className="ad-slot" data-ad-placement={placement}>
        {adsEnabled && slot ? <GoogleAd slot={slot} /> : <p>Reserved for a responsive Google ad</p>}
      </div>
    </aside>
  );
}
