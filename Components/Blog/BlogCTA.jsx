// Components/Blog/BlogCTA.jsx
// Lead capture CTA component for blog posts

'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useRecaptcha } from '@/lib/useRecaptcha';

const CTA_VARIANTS = {
  'web-design': {
    title: 'Ready to Transform Your Website?',
    description: 'Get a free website audit and discover how we can help your construction business stand out online.',
    buttonText: 'Get Your Free Audit',
    inputPlaceholder: 'Enter your email',
  },
  'seo': {
    title: 'Boost Your Search Rankings',
    description: 'Download our free SEO checklist designed specifically for construction companies.',
    buttonText: 'Get the Checklist',
    inputPlaceholder: 'Enter your email',
  },
  'construction': {
    title: 'Grow Your Construction Business',
    description: 'Get our free guide on digital marketing strategies that work for contractors.',
    buttonText: 'Download the Guide',
    inputPlaceholder: 'Enter your email',
  },
  default: {
    title: 'Start Your Project Today',
    description: 'Ready to take your online presence to the next level? Let\'s talk about your goals.',
    buttonText: 'Get Started',
    inputPlaceholder: 'Enter your email',
  },
};

export default function BlogCTA({ variant = 'default', categories = [] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const { executeRecaptcha } = useRecaptcha();

  // Determine variant based on categories
  let ctaVariant = CTA_VARIANTS.default;
  if (variant !== 'default') {
    ctaVariant = CTA_VARIANTS[variant] || CTA_VARIANTS.default;
  } else if (categories.length > 0) {
    const categoryTitles = categories.map(c => c.title.toLowerCase());
    if (categoryTitles.some(t => t.includes('web design') || t.includes('design'))) {
      ctaVariant = CTA_VARIANTS['web-design'];
    } else if (categoryTitles.some(t => t.includes('seo') || t.includes('search'))) {
      ctaVariant = CTA_VARIANTS.seo;
    } else if (categoryTitles.some(t => t.includes('construction') || t.includes('contractor'))) {
      ctaVariant = CTA_VARIANTS.construction;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Basic validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('blog_cta');

      // TODO: Add HubSpot integration here when ready
      // For now, just simulate a successful submission
      // When ready, include recaptchaToken in the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-gradient-to-br from-[#008070]/20 to-[#006b5d]/10 border border-[#008070]/30 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#008070]/20 border-2 border-[#008070] flex items-center justify-center mb-6">
            <CheckCircle size={32} className="text-[#008070]" />
          </div>
          <h3 className="font-anton text-2xl md:text-3xl text-white mb-3">
            You're All Set!
          </h3>
          <p className="font-manrope text-gray-300 max-w-md">
            Check your inbox for your free resource. We'll also be in touch soon to see how we can help your business grow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#008070]/20 to-[#006b5d]/10 border border-[#008070]/30 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h3 className="font-anton text-2xl md:text-4xl text-white mb-4 text-center">
          {ctaVariant.title}
        </h3>

        {/* Description */}
        <p className="font-manrope text-lg text-gray-300 mb-8 text-center">
          {ctaVariant.description}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ctaVariant.inputPlaceholder}
            disabled={status === 'loading'}
            className="flex-1 px-6 py-4 bg-black/30 border border-white/10 rounded-lg text-white font-manrope placeholder-gray-500 focus:outline-none focus:border-[#008070]/50 focus:ring-2 focus:ring-[#008070]/20 disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              'Submitting...'
            ) : (
              <>
                {ctaVariant.buttonText}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {status === 'error' && errorMessage && (
          <p className="text-red-400 font-manrope text-sm mt-4 text-center">
            {errorMessage}
          </p>
        )}

        {/* Privacy Note */}
        <p className="font-manrope text-xs text-gray-500 mt-6 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
