// Components/Blog/CategoryBadge.jsx
// Category badge component

import Link from 'next/link';

export default function CategoryBadge({ category, clickable = true }) {
  const { title, slug, color } = category;
  const badgeColor = color || '#008070';

  const badgeContent = (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-manrope font-semibold transition-opacity hover:opacity-80"
      style={{
        backgroundColor: `${badgeColor}20`,
        color: badgeColor,
        border: `1px solid ${badgeColor}40`,
      }}
    >
      {title}
    </span>
  );

  if (!clickable || !slug?.current) {
    return badgeContent;
  }

  return (
    <Link href={`/blog/category/${slug.current}`}>
      {badgeContent}
    </Link>
  );
}
