// Components/Blog/PortableText/CodeBlock.jsx
// Syntax-highlighted code block component

'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ value }) {
  const [copied, setCopied] = useState(false);
  const { code, language = 'javascript', filename } = value;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden bg-[#1E1E1E] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="font-manrope text-sm text-gray-400">{filename}</span>
          )}
          {!filename && (
            <span className="font-manrope text-sm text-gray-500 uppercase">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-manrope text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
