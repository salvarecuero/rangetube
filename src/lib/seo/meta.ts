export interface HeadMetaInput {
  title: string;
  description: string;
  site: string | URL;
  pathname: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export interface HeadMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: string;
  noindex: boolean;
}

export function absoluteUrl(path: string, site: string | URL): string {
  if (!site) throw new Error("buildHeadMeta: `site` is required (set `site` in astro.config).");
  return new URL(path, site).toString();
}

export function buildHeadMeta(input: HeadMetaInput): HeadMeta {
  const { title, description, site, pathname } = input;
  if (!site) throw new Error("buildHeadMeta: `site` is required (set `site` in astro.config).");
  const canonical = absoluteUrl(pathname, site);
  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: absoluteUrl(input.ogImage ?? "/og.png", site),
    ogType: input.ogType ?? "website",
    noindex: input.noindex ?? false,
  };
}
