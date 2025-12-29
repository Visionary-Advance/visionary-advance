// Components/Blog/TableOfContents.jsx
// Table of contents with sticky sidebar navigation

'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-24 bg-black/30 border border-white/10 rounded-xl p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
          <List size={20} className="text-[#008070]" />
          <h3 className="font-anton text-lg text-white">Table of Contents</h3>
        </div>

        {/* Links */}
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id} style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}>
              <a
                href={`#${id}`}
                className={`block font-manrope text-sm py-2 px-3 rounded-lg transition-all ${
                  activeId === id
                    ? 'text-white bg-[#008070]/20 border-l-2 border-[#008070]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
