// app/page.jsx
'use client'

import { useState } from 'react'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          website: '',
          message: ''
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white py-32 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30" 
             style={{
               backgroundImage: 'linear-gradient(90deg, rgba(255,107,0,0.1) 1px, transparent 1px), linear-gradient(rgba(255,107,0,0.1) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Turn Your Construction Website Into a Lead-Generating Machine
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Professional websites designed specifically for construction companies that need more qualified leads
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-[#ff6b00] text-white px-12 py-4 text-lg font-semibold rounded-md border-2 border-transparent transition-all duration-300 hover:bg-[#ff8533] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,107,0,0.3)]"
          >
            Get Your Free Website Audit
          </a>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-24 px-5 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            Is Your Website Costing You Jobs?
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Most construction websites fail to generate leads. Here&apos;s why.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Invisible on Google',
                description: "When homeowners search for contractors in your area, your competitors show up first. You're losing jobs before they even know you exist."
              },
              {
                title: 'Outdated Design',
                description: "Your website looks like it's from 2010. Potential clients take one look and assume you're out of business or don't care about quality."
              },
              {
                title: 'Poor Mobile Experience',
                description: "Most people search for contractors on their phone, but your site is impossible to navigate on mobile. They give up and call someone else."
              },
              {
                title: 'Zero Lead Capture',
                description: "Your website is just a digital brochure. It doesn't capture leads, showcase your work effectively, or give people a reason to contact you."
              }
            ].map((problem, index) => (
              <div 
                key={index}
                className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#ff6b00]"
              >
                <h3 className="text-[#0f0f0f] mb-4 text-xl font-semibold">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-5 text-[#0f0f0f] tracking-tight">
            What You Get With a Professional Construction Website
          </h2>
          <p className="text-center text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Built to rank higher, look better, and convert more visitors into paying clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Search Engine Dominance',
                description: 'SEO-optimized for construction keywords in your area. When someone searches for what you do, they find you first.'
              },
              {
                title: 'Mobile-First Design',
                description: 'Looks perfect on every device. Fast loading, easy navigation, and designed to convert visitors into leads.'
              },
              {
                title: 'Project Gallery',
                description: 'Showcase your best work with before and after photos that prove your quality and build trust instantly.'
              },
              {
                title: 'Strategic Call-to-Actions',
                description: 'Contact forms, click-to-call buttons, and quote requests strategically placed to capture every opportunity.'
              },
              {
                title: 'Social Proof Integration',
                description: "Display reviews and testimonials that convince visitors you're the right choice for their project."
              },
              {
                title: 'Ongoing SEO Management',
                description: 'Monthly optimization to keep you ranking higher and attracting more qualified leads over time.'
              }
            ].map((solution, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-10 rounded-xl border-l-4 border-[#ff6b00] transition-all duration-300 hover:bg-gray-100 hover:border-l-6"
              >
                <h3 className="text-[#0f0f0f] mb-4 text-xl font-semibold">
                  {solution.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 px-5 bg-[#0f0f0f] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            Results That Speak for Themselves
          </h2>
          <p className="text-xl text-gray-300 mb-16">
            Here&apos;s what happens when construction companies invest in professional websites
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
            {[
              { number: '3x', label: 'More Qualified Leads' },
              { number: '67%', label: 'Increase in Website Traffic' },
              { number: 'Page 1', label: 'Google Rankings' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-8 bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
              >
                <div className="text-6xl font-bold text-[#ff6b00] mb-3 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-5 bg-gradient-to-br from-[#ff6b00] to-[#ff8533] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Stop Losing Jobs to Your Competition?
          </h2>
          <p className="text-xl mb-12 opacity-95">
            Get a free audit of your current website and see exactly what&apos;s holding you back
          </p>
          <a 
            href="#contact" 
            className="inline-block bg-white text-[#ff6b00] px-12 py-4 text-lg font-semibold rounded-md transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          >
            Get Your Free Audit Now
          </a>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 px-5 bg-gray-50" id="contact">
        <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-center mb-3 text-[#0f0f0f] text-4xl font-bold tracking-tight">
            Get Your Free Website Audit
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            We&apos;ll analyze your site and show you exactly how to get more leads
          </p>
          
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-center">
              Thank you! We&apos;ll be in touch soon with your free audit.
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-center">
              Something went wrong. Please try again or email us directly.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="company" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="website" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                Current Website (if you have one)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-semibold text-[#0f0f0f] text-sm">
                What&apos;s your biggest challenge with getting leads online?
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-[#ff6b00] focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-[#ff6b00] text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 mt-2 hover:bg-[#ff8533] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,107,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Get My Free Audit'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}