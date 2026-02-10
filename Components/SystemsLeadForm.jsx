'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Send } from 'lucide-react'
import { trackLeadFormSubmit, trackLeadFormError } from '@/lib/analytics'
import { useRecaptcha } from '@/lib/useRecaptcha'

const businessTypes = [
  'Contractor',
  'Warehouse/Inventory',
  'Other'
]

export default function SystemsLeadForm() {
  const pathname = usePathname()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    current_tools: '',
    biggest_bottleneck: '',
    desired_outcome: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const { executeRecaptcha } = useRecaptcha()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('systems_lead')

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          page_path: pathname,
          recaptchaToken,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        trackLeadFormSubmit(pathname, formData.business_type)
        setFormData({
          name: '',
          email: '',
          phone: '',
          business_type: '',
          current_tools: '',
          biggest_bottleneck: '',
          desired_outcome: '',
        })
      } else {
        const errorData = await response.json()
        setSubmitStatus('error')
        trackLeadFormError(pathname, errorData.error || 'Unknown error')
      }
    } catch (error) {
      setSubmitStatus('error')
      trackLeadFormError(pathname, error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="lead-form" className="py-16 md:py-24 px-4 md:px-16 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="font-anton text-3xl md:text-4xl text-white">
              Let&apos;s Talk About Your System
            </h2>
            <p className="font-manrope text-gray-300">
              Tell us about your current workflow and what you&apos;re looking to improve.
              No pressure, just clarity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Phone and Business Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
                />
              </div>
              <div>
                <label htmlFor="business_type" className="block text-sm font-semibold text-white mb-2">
                  Business Type
                </label>
                <select
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#008070] transition-colors"
                >
                  <option value="">Select...</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#191E1E]">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Tools */}
            <div>
              <label htmlFor="current_tools" className="block text-sm font-semibold text-white mb-2">
                What tools are you currently using?
              </label>
              <input
                type="text"
                id="current_tools"
                name="current_tools"
                value={formData.current_tools}
                onChange={handleInputChange}
                placeholder="e.g., Spreadsheets, QuickBooks, Jobber, paper forms..."
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
              />
            </div>

            {/* Biggest Bottleneck */}
            <div>
              <label htmlFor="biggest_bottleneck" className="block text-sm font-semibold text-white mb-2">
                What&apos;s your biggest bottleneck or pain point?
              </label>
              <textarea
                id="biggest_bottleneck"
                name="biggest_bottleneck"
                rows={3}
                value={formData.biggest_bottleneck}
                onChange={handleInputChange}
                placeholder="Tell us what's slowing you down or causing frustration..."
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors resize-none"
              />
            </div>

            {/* Desired Outcome */}
            <div>
              <label htmlFor="desired_outcome" className="block text-sm font-semibold text-white mb-2">
                What would success look like for you?
              </label>
              <textarea
                id="desired_outcome"
                name="desired_outcome"
                rows={3}
                value={formData.desired_outcome}
                onChange={handleInputChange}
                placeholder="Describe your ideal workflow or the results you're hoping to achieve..."
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors resize-none"
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                Thank you! We&apos;ve received your information and will be in touch soon to discuss your system needs.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                Sorry, there was an error submitting your information. Please try again or contact us directly.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#008070] hover:bg-[#006b5d] text-white px-8 py-4 rounded-lg font-manrope font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Get My Free Consultation'}
              <Send className="w-4 h-4" />
            </button>

            <p className="text-center text-gray-500 text-sm">
              Free consultation. No obligation. We&apos;ll review your workflow and share our honest recommendations.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
