"use client";
import type { AnchorHTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/config";
import { recordMeasurement } from "@/lib/measurement";

export function PropertyLink({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const route = usePathname();
  function track() {
    const url = new URL(href);
    const property = url.origin === site.fundingSite ? "funding" : url.origin === site.toolsSite ? "tools" : url.origin === site.acquireSite ? "acquire" : null;
    if (property && route) recordMeasurement({ name: "cross_property_cta_selected", source_route: route, destination_property: property, cta_id: property });
  }
  return <a {...props} href={href} onClick={track}>{children}</a>;
}
