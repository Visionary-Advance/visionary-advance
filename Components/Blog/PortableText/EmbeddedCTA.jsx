// Components/Blog/PortableText/EmbeddedCTA.jsx
// Inline CTA component for use within blog content

'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function EmbeddedCTA({ value }) {
  const { title, description, buttonText = 'Get Started' } = value;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    // TODO: Add HubSpot integration
    try {
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
      <div className="my-8 bg-[#008070]/10 border border-[#008070]/30 rounded-xl p-6">
        <div className="flex items-center gap-3 text-[#008070]">
          <CheckCircle size={24} />
          <p className="font-manrope font-medium">
            Thanks! Check your inbox for your free resource.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 bg-gradient-to-r from-[#008070]/10 to-[#006b5d]/5 border border-[#008070]/30 rounded-xl p-6 md:p-8">
      {title && (
        <h4 className="font-anton text-xl md:text-2xl text-white mb-3">
          {title}
        </h4>
      )}
      {description && (
        <p className="font-manrope text-gray-300 mb-6">
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === 'loading'}
          className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white font-manrope placeholder-gray-500 focus:outline-none focus:border-[#008070]/50 focus:ring-2 focus:ring-[#008070]/20 disabled:opacity-50"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Submitting...' : buttonText}
          {status !== 'loading' && <ArrowRight size={18} />}
        </button>
      </form>

      {status === 'error' && errorMessage && (
        <p className="text-red-400 font-manrope text-sm mt-3">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
