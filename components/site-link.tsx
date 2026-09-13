import type { AnchorHTMLAttributes } from "react";

// Native navigation works in both Next.js and the hosted Worker runtime.
export default function SiteLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
