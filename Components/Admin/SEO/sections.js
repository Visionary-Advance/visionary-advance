import { ChartLine, KeyRound, ListChecks, FileText, Settings } from 'lucide-react';

// A site's sections, in sidebar / tab order. slug '' is the overview at /admin/seo/sites/[id].
export const SITE_SECTIONS = [
  { slug: '', label: 'Overview', icon: ChartLine },
  { slug: 'keywords', label: 'Keywords', icon: KeyRound },
  { slug: 'plan', label: 'Plan', icon: ListChecks },
  { slug: 'reports', label: 'Reports', icon: FileText },
  { slug: 'settings', label: 'Settings', icon: Settings },
];

export function sectionHref(siteId, slug) {
  return slug ? `/admin/seo/sites/${siteId}/${slug}` : `/admin/seo/sites/${siteId}`;
}

// Which section a pathname is on ('' for overview), or null if not inside a site.
export function currentSection(pathname, siteId) {
  const base = `/admin/seo/sites/${siteId}`;
  if (!pathname.startsWith(base)) return null;
  return pathname.slice(base.length).split('/').filter(Boolean)[0] || '';
}
