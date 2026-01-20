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
      description: "Professional inquiries welcome",
      contact: "info@visionaryadvance.com",
      action: "mailto:info@visionaryadvance.com",
      color: "text-[#008070]"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Mon-Fri, 9am-6pm PST",
      contact: "541-868-7019",
      action: "tel:+15418687019",
      color: "text-[#008070]"
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
      answer: "Absolutely! While we're based in Eugene, we work with clients everywhere."
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
            <div className="space-y-6">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Start Your Project With Confidence
              </h1>
              <p className="font-manrope text-xl text-gray-300 max-w-3xl leading-relaxed">
                Your expertise deserves a digital presence built to the same standards you maintain in your own work. Let's discuss how we can create a website worthy of your professional reputation.
              </p>
              <p className="font-manrope text-lg text-gray-400 max-w-3xl leading-relaxed">
                We work with professionals who value quality, understand the importance of strategic positioning, and are ready to invest in a digital presence that performs.
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
                  <p className="font-manrope text-gray-300">
                    Provide details about your business and objectives so we can understand how best to serve your needs.
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
                  <h3 className="font-anton text-xl text-white">Response Time</h3>
                </div>
                <p className="font-manrope text-gray-300 mb-4">
                  We respond to all professional inquiries within 24 hours with a thoughtful, detailed assessment of your project.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    <span className="font-manrope text-sm text-gray-300">Strategic consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    <span className="font-manrope text-sm text-gray-300">No obligation required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#008070]" />
                    <span className="font-manrope text-sm text-gray-300">Honest expert guidance</span>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="p-6 bg-black/30 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-[#008070]" />
                  <h3 className="font-anton text-xl text-white">Our Process</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">01</span>
                    <div>
                      <p className="font-manrope text-gray-300 text-sm">
                        <strong className="text-white">Initial Review:</strong> Detailed assessment of your project requirements and objectives
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">02</span>
                    <div>
                      <p className="font-manrope text-gray-300 text-sm">
                        <strong className="text-white">Strategic Consultation:</strong> In-depth discussion of your business goals and technical needs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-anton text-[#008070] text-sm mt-1">03</span>
                    <div>
                      <p className="font-manrope text-gray-300 text-sm">
                        <strong className="text-white">Custom Proposal:</strong> Comprehensive plan with timeline, deliverables, and investment details
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
              Common Questions About Our Services
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-[#191E1E] rounded-2xl border border-white/10">
                <h3 className="font-anton text-xl text-white mb-3">
                  {faq.question}
                </h3>
                <p className="font-manrope text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="font-manrope text-gray-300 mb-4">
              Have additional questions about working with us?
            </p>
            <button className="inline-flex items-center gap-2 text-[#008070] hover:text-white transition-colors font-manrope font-semibold">
              Contact us for answers
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      

     
    </div>
  );
}