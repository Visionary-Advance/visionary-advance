'use client'
import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Code,
  Server,
  Shield,
    Zap,
  Users,
  Smartphone,
  Search,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Clock,
  Heart,
  Globe,
  Wrench,
  Database,
  Lock,
  TrendingUp,
  Eye,
  Palette,
  Coffee
} from "lucide-react";
import CTA from '@/Components/CTA';


export default function ServicesPage() {
  const services = [
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Web Design",
      description: "Beautiful, user-friendly designs that convert visitors into customers.",
      features: [
        "Custom UI/UX Design",
        "Mobile-First Approach", 
        "Brand Identity Integration",
        "Conversion Optimization",
        "Accessibility Compliance"
      ],
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: "Web Development", 
      description: "Clean, efficient code that brings your designs to life.",
      features: [
        "Modern Frameworks (React, Next.js)",
        "Responsive Development",
        "SEO Optimization",
        "Performance Optimization",
        "Cross-Browser Compatibility"
      ],
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Web Maintenance",
      description: "Keep your website running smoothly with our ongoing support.",
      features: [
        "Regular Updates & Patches",
        "Security Monitoring",
        "Content Management",
        "Bug Fixes & Improvements",
        "24/7 Technical Support"
      ],
      color: "text-green-400",
      bgColor: "bg-green-400/10", 
      borderColor: "border-green-400/20"
    },
    {
      icon: <Server className="w-12 h-12" />,
      title: "Web Hosting",
      description: "Reliable, fast hosting on our own secure servers.",
      features: [
        "99.9% Uptime Guarantee",
        "SSL Certificates Included",
        "Daily Backups",
        "CDN Integration",
        "Scalable Infrastructure"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Planning",
      description: "We dive deep into your business goals, target audience, and technical requirements.",
      icon: <Search className="w-8 h-8" />
    },
    {
      number: "02", 
      title: "Design & Prototype",
      description: "Creating wireframes and mockups that align with your brand and user experience goals.",
      icon: <Eye className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Development & Testing",
      description: "Building your website with clean code, rigorous testing, and optimization.",
      icon: <Code className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "Deploying your site and providing ongoing maintenance and support.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Our sites load in under 3 seconds (because life's too short for slow websites)."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure by Design",
      description: "Built with security best practices from day one, not as an afterthought."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "SEO Optimized",
      description: "Your site will be Google-friendly right out of the gate."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Personal Touch",
      description: "You'll work directly with our team, not a chatbot or call center."
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Caffeine-Powered",
      description: "We fuel our creativity with quality coffee and deliver quality results."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "On-Time Delivery", 
      description: "We respect your timeline and deliver projects when we say we will."
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#191E1E] text-white">
     

      {/* Hero Section - Variation 3 */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">Services</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                How We Help Your Business Grow
              </h1>
              <p className="font-manrope text-lg text-white max-w-3xl">
                We believe great websites are built on four pillars: thoughtful design, solid development, reliable hosting, and ongoing care. Here's how we deliver on each.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">What We Do Best</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Four Core Services, Infinite Possibilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-2xl border ${service.borderColor} ${service.bgColor} hover:border-opacity-50 transition-all duration-300 group`}
              >
                <div className={`${service.color} mb-6`}>
                  {service.icon}
                </div>
                
                <h3 className="font-anton text-2xl md:text-3xl text-white mb-4">
                  {service.title}
                </h3>
                
                <p className="font-manrope text-white mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${service.color} flex-shrink-0`} />
                      <span className="font-manrope text-white">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`${service.color} hover:text-white hover:bg-current hover:bg-opacity-10 px-4 py-2 rounded-lg font-manrope font-semibold border border-current transition-all duration-300 group-hover:translate-x-1`}>
                  Learn More <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Why Us</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              What Makes Us Different
            </h2>
            <p className="font-manrope text-lg text-white max-w-3xl mx-auto">
              Sure, there are other web agencies out there. But here's why smart businesses choose us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-[#191E1E] border border-white/10 hover:border-[#008070]/50 transition-colors">
                <div className="text-[#008070] mb-4 flex justify-center">
                  {reason.icon}
                </div>
                <h3 className="font-anton text-xl text-white mb-3">
                  {reason.title}
                </h3>
                <p className="font-manrope text-white">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Our Process</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              How We Transform Ideas Into Digital Reality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#191E1E] border-2 border-[#008070] rounded-full flex items-center justify-center">
                    <span className="font-anton text-[#008070] text-sm">{step.number}</span>
                  </div>

                  <h3 className="font-anton text-xl text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="font-manrope text-white">
                    {step.description}
                  </p>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-[#008070]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      {/* <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Our Stack</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Built With Modern Technology
            </h2>
            <p className="font-manrope text-lg text-white max-w-3xl mx-auto">
              We use the latest and greatest tools to ensure your website is fast, secure, and future-proof.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "React", "Next.js", "TypeScript", "Tailwind CSS", 
              "Node.js", "PostgreSQL", "AWS", "Vercel",
              "Figma", "Git", "Docker", "Cloudflare"
            ].map((tech, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-[#191E1E] border border-white/10 hover:border-[#008070]/50 transition-colors">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-3"></div>
                <p className="font-manrope text-white text-sm">{tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
    <CTA />

     
    </div>
  );
}