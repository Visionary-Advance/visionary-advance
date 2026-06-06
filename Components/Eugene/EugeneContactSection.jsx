'use client'

import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useRecaptcha } from '@/lib/useRecaptcha'
import { trackLeadFormSubmit, trackLeadFormError } from '@/lib/analytics'

const businessTypes = [
  'Service business',
  'Contractor / trades',
  'Restaurant / hospitality',
  'Retail / e-commerce',
  'Professional services',
  'Other',
]

export default function EugeneContactSection({ content }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    timeline: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('idle')
  const { executeRecaptcha } = useRecaptcha()
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    try {
      const recaptchaToken = await executeRecaptcha('contact_form')

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
          conversion_page: '/eugene-web-design',
        }),
      })

      if (response.ok) {
        setStatus('success')
        trackLeadFormSubmit('/eugene-web-design', formData.projectType)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          timeline: '',
          message: '',
        })
      } else {
        setStatus('error')
        trackLeadFormError('/eugene-web-design', `HTTP ${response.status}`)
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      trackLeadFormError('/eugene-web-design', err?.message || 'network_error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="relative bg-[#050505] overflow-hidden py-20 md:py-28 px-4 md:px-16"
    >
      {/* Floating orbs */}
      <div className="circle circle1" style={{ left: '-5%', top: '5%' }} aria-hidden="true" />
      <div className="circle circle2" style={{ right: '-5%', bottom: '5%', left: 'auto' }} aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-white/70 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
            {content.eyebrow}
          </span>
          <h2 className="font-inter-display font-semibold text-3xl md:text-5xl text-white tracking-tight mt-5">
            {content.heading}
          </h2>
          <p className="font-manrope text-white/60 mt-4 text-base md:text-lg">
            {content.sub}
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="relative rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <Field
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                hint="Optional"
              />
            </div>

            <Field
              label="Business name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
              hint="Optional"
            />

            <div>
              <label
                htmlFor="projectType"
                className="block text-sm font-manrope font-semibold text-white/85 mb-2"
              >
                Business type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white font-manrope focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/30 transition-colors min-h-[48px]"
              >
                <option value="" className="bg-[#0a0a0a]">
                  Select...
                </option>
                {businessTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#0a0a0a]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-manrope font-semibold text-white/85 mb-2"
              >
                Tell us about your project <span className="text-[#008070]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="What do you need help with? Any deadlines, goals, or existing site we should know about?"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder:text-white/35 font-manrope focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/30 transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/40 text-[#10b981]"
              >
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-manrope text-sm">
                  Thanks — message received. We'll reply within one business day.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div
                role="alert"
                aria-live="polite"
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-manrope text-sm"
              >
                Sorry, something went wrong sending your message. Please try again or email brandon@visionaryadvance.com directly.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#008070] hover:bg-[#009e89] disabled:bg-[#008070]/40 disabled:cursor-not-allowed text-white font-manrope font-semibold px-8 py-4 rounded-xl transition-colors min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center font-manrope text-xs text-white/40">
              Protected by reCAPTCHA. We respond within one business day.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', value, onChange, required, hint, autoComplete, inputMode }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-manrope font-semibold text-white/85 mb-2">
        {label}
        {required && <span className="text-[#008070] ml-1">*</span>}
        {hint && !required && <span className="text-white/40 font-normal ml-2 text-xs">{hint}</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder:text-white/35 font-manrope focus:outline-none focus:border-[#008070] focus:ring-2 focus:ring-[#008070]/30 transition-colors min-h-[48px]"
      />
    </div>
  )
}
