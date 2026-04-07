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
      <div className="sticky top-24 bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <List size={20} className="text-[#008070]" />
          <h3 className="font-inter-display font-bold text-lg text-gray-900">Table of Contents</h3>
        </div>

        {/* Links */}
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li key={id} style={{ paddingLeft: `${(level - 2) * 0.75}rem` }}>
              <a
                href={`#${id}`}
                className={`block font-manrope text-sm py-2 px-3 rounded-lg transition-all ${
                  activeId === id
                    ? 'text-[#008070] bg-[#008070]/10 border-l-2 border-[#008070]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
