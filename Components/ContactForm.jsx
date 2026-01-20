'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

const projectTypes = [
  'Website Design',
  'E-commerce',
  'Mobile App',
  'Web Application',
  'Branding',
  'Other'
]

const timelines = [
  'ASAP',
  '1-2 months',
  '3-6 months',
  '6+ months',
  'Flexible'
]

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    timeline: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')

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
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          timeline: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="lg:col-span-2">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="font-anton text-3xl md:text-4xl text-white">
            Tell Us About Your Project
          </h2>
          <p className="font-manrope text-white">
            The more details you can share, the better we can tailor our response to your needs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-white mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-white mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
                required
              />
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address *
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
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                Phone Number
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
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-semibold text-white mb-2">
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors"
            />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectType" className="block text-sm font-semibold text-white mb-2">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#008070] transition-colors"
              >
                <option value="">Select...</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#191E1E]">{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-white mb-2">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#008070] transition-colors"
              >
                <option value="">Select...</option>
                {timelines.map((time) => (
                  <option key={time} value={time} className="bg-[#191E1E]">{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
              Tell us about your project *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe your project goals, any specific requirements, inspiration sites, or questions you have..."
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:border-[#008070] transition-colors resize-none"
              required
            />
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
              Thank you! Your message has been sent successfully. We'll get back to you soon!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              Sorry, there was an error sending your message. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#008070] hover:bg-[#006b5d] text-white px-8 py-4 rounded-lg font-manrope font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}