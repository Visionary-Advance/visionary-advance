'use client'
import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Coffee,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  Globe
} from "lucide-react";





export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Drop us a line anytime",
      contact: "info@visionaryadvance.com",
      action: "mailto:info@visionaryadvance.com",
      color: "text-blue-400"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Mon-Fri, 9am-6pm PST",
      contact: "541-868-7019",
      action: "tel:+15418687019",
      color: "text-green-400"
    }
  ];

  const projectTypes = [
    "New Website",
    "Website Redesign", 
    "E-commerce Site",
    "Web Application",
    "Maintenance & Support",
    "Hosting Services",
    "Other"
  ];

  const budgetRanges = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
    "Not sure yet"
  ];

  const timelines = [
    "ASAP",
    "Within 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
    "Just exploring"
  ];

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer: "Most websites take 4-8 weeks from start to finish, depending on complexity and content readiness."
    },
    {
      question: "Do you work with businesses outside Oregon?",
      answer: "Absolutely! While we're based in Eugene, we work with clients across the country and internationally."
    },
    {
      question: "What's included in your hosting service?",
      answer: "Our hosting includes SSL certificates, daily backups, security monitoring, and 99.9% uptime guarantee."
    },
   
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#191E1E] text-white">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">Contact</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Let's Start Something Great Together
              </h1>
              <p className="font-manrope text-lg text-white max-w-3xl">
                Ready to transform your digital presence? We'd love to hear about your project and explore how we can help bring your vision to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      {/* <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <a 
                key={index}
                href={method.action}
                className="block p-6 bg-black/30 rounded-2xl border border-white/10 hover:border-[#008070]/50 transition-all duration-300 group"
              >
                <div className={`${method.color} mb-4`}>
                  {method.icon}
                </div>
                <h3 className="font-anton text-xl text-white mb-2 group-hover:text-[#008070] transition-colors">
                  {method.title}
                </h3>
                <p className="font-manrope text-gray-300 text-sm mb-3">
                  {method.description}
                </p>
                <p className="font-manrope text-white font-semibold">
                  {method.contact}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Form & Info */}
      <section className="px-4 md:px-16 py-16 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Form */}
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

                <form className="space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <label htmlFor="budget" className="block text-sm font-semibold text-white mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#008070] transition-colors"
                      >
                        <option value="">Select...</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range} className="bg-[#191E1E]">{range}</option>
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#008070] hover:bg-[#006b5d] text-white px-8 py-4 rounded-lg font-manrope font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Response Time */}
              <div className="p-6 bg-black/30 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#008070]" />
                  <h3 className="font-anton text-xl text-white">Quick Response</h3>
                </div>
                <p className="font-manrope text-white mb-4">
                  We typically respond to all inquiries within 24 hours (often much sooner).
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-manrope text-sm text-white">Free consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-manrope text-sm text-white">No obligation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="font-manrope text-sm text-white">Honest advice</span>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="p-6 bg-black/30 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-6 h-6 text-[#008070]" />
                  <h3 className="font-anton text-xl text-white">What to Expect</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">01</span>
                    <div>
                      <p className="font-manrope text-white text-sm">
                        <strong>Quick Response:</strong> We'll get back to you within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">02</span>
                    <div>
                      <p className="font-manrope text-white text-sm">
                        <strong>Discovery Call:</strong> We'll schedule a consultation to understand your needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">03</span>
                    <div>
                      <p className="font-manrope text-white text-sm">
                        <strong>Custom Proposal:</strong> We'll create a tailored plan and timeline
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">FAQ</p>
            <h2 className="font-anton text-3xl md:text-4xl text-white leading-tight">
              Questions We Get Asked a Lot
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-[#191E1E] rounded-2xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  {faq.question}
                </h3>
                <p className="font-manrope text-white">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="font-manrope text-white mb-4">
              Don't see your question here?
            </p>
            <button className="inline-flex items-center gap-2 text-[#008070] hover:text-white transition-colors font-semibold">
              Ask us anything
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      

     
    </div>
  );
}