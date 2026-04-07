'use client';

import { useState, useEffect } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';

export default function SocialShare({ title, url }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-manrope text-sm text-gray-500">Share:</span>

      <a
        href={shareUrls.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1DA1F2]/20 text-gray-500 hover:text-[#1DA1F2] transition-all"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>

      <a
        href={shareUrls.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#0A66C2]/20 text-gray-500 hover:text-[#0A66C2] transition-all"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <a
        href={shareUrls.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1877F2]/20 text-gray-500 hover:text-[#1877F2] transition-all"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>

      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#008070]/20 text-gray-500 hover:text-[#008070] transition-all"
        aria-label="Copy link"
      >
        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
      </button>

      {canShare && (
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#008070]/20 text-gray-500 hover:text-[#008070] transition-all"
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
      )}
    </div>
  );
}
