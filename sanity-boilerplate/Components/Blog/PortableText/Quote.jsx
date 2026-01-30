// Components/Blog/PortableText/Quote.jsx
// Styled quote component for testimonials or notable quotes

import { Quote as QuoteIcon } from 'lucide-react';

export default function Quote({ value }) {
  const { quote, author, role, company } = value;

  return (
    <div className="my-8 relative">
      <div className="bg-black/30 border-l-4 border-[#008070] rounded-r-xl p-8">
        {/* Quote Icon */}
        <div className="absolute -top-4 left-6 w-12 h-12 bg-[#008070]/20 border-2 border-[#008070] rounded-full flex items-center justify-center">
          <QuoteIcon size={20} className="text-[#008070]" />
        </div>

        {/* Quote Text */}
        <blockquote className="font-manrope text-lg md:text-xl text-white leading-relaxed mb-6 mt-4">
          "{quote}"
        </blockquote>

        {/* Author Info */}
        {author && (
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <div className="text-right">
              <p className="font-manrope font-bold text-white">{author}</p>
              {(role || company) && (
                <p className="font-manrope text-sm text-gray-400">
                  {role}{role && company && ', '}{company}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
