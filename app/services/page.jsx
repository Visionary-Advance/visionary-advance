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
      title: "Custom Websites",
      description: "No templates. No page builders. Every website is designed and coded specifically for your business, your workflow, and how you serve your clients.",
      features: [
        "Custom Design & Development",
        "SEO Built Into the Foundation",
        "Mobile-First Architecture",
        "Fast Load Times & Performance",
        "Easy Content Management"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Custom Business Systems",
      description: "Dashboards, inventory systems, job tracking, and internal tools built around how your business actually operates — not platforms you have to adapt to.",
      features: [
        "Custom Dashboards & Analytics",
        "Inventory & Warehouse Systems",
        "Job Tracking & Labor Management",
        "Client Portals & Reporting",
        "API Integrations"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: "SEO & Visibility",
      description: "Strategic SEO that positions you in front of the right clients — the ones searching for expertise and quality, not the lowest price.",
      features: [
        "Local SEO (Eugene & Oregon)",
        "Technical SEO Architecture",
        "Content Strategy",
        "Google Business Optimization",
        "Ongoing Visibility Improvements"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Server className="w-12 h-12" />,
      title: "Hosting & Support",
      description: "Reliable infrastructure and ongoing support so your website and systems perform consistently — without you having to think about it.",
      features: [
        "99.9% Uptime Guarantee",
        "Security & SSL Certificates",
        "Automated Daily Backups",
        "Performance Monitoring",
        "Priority Technical Support"
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
      description: "We start by understanding your business, your workflow, and what you actually need — not what we want to sell you.",
      icon: <Search className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Design & Architecture",
      description: "Custom design and system architecture built specifically for how your business operates. No templates, no shortcuts.",
      icon: <Eye className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Build & Test",
      description: "Clean, efficient code with rigorous testing. Everything is built to perform reliably under real-world conditions.",
      icon: <Code className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Launch & Support",
      description: "Smooth deployment with ongoing support. We're invested in your success beyond launch day.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Built for Performance",
      description: "Fast load times, clean code, and modern architecture. Everything we build is engineered to perform reliably under real-world conditions."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure by Default",
      description: "Security built into every layer — not added as an afterthought. Your data and your clients' data protected properly."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Found by the Right Clients",
      description: "SEO that positions you in front of people searching for quality and expertise — not bargain hunters looking for the lowest price."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Direct Communication",
      description: "Work directly with the people building your systems. No account managers, no outsourcing, no telephone games."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Built to Scale",
      description: "Systems designed with growth in mind. What we build today should support your business for years — not need replacing in six months."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Clear Process, Reliable Results",
      description: "Disciplined approach. Clear communication. Commitments honored. We operate the way you'd expect a serious partner to operate."
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#191E1E] text-white">
     

      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">Our Services</span>
            </div>
            <div className="space-y-6">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Websites & Systems Built Around How You Work
              </h1>
              <p className="font-manrope text-xl text-gray-300 max-w-3xl leading-relaxed">
                We build custom websites and business systems for professionals who take their operations seriously. No templates. No bloated platforms. Just solutions designed specifically for your business and workflow.
              </p>
              <p className="font-manrope text-lg text-gray-400 max-w-3xl leading-relaxed">
                Based in Eugene, serving Lane County and Oregon businesses — from custom websites and SEO to dashboards, inventory systems, and internal tools that match how you actually operate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">What We Build</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Custom Solutions for Real Operations
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              Everything we build is designed to support how your business actually works — not force you into someone else's workflow.
            </p>
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

                <p className="font-manrope text-gray-300 mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${service.color} flex-shrink-0`} />
                      <span className="font-manrope text-gray-300">{feature}</span>
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
            <p className="font-manrope font-semibold text-[#008070]">How We Work</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Designed for Serious Operators
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              We partner with businesses that care how things are built. If you value precision, reliability, and long-term thinking — you'll feel at home here.
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
                <p className="font-manrope text-gray-300">
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
              Built on Precision and Partnership
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              Quality doesn't happen by accident. It's the result of a disciplined approach where every detail is considered and every decision is intentional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  
                  <div className="absolute -top-4 -left-0 w-12 h-12 bg-[#191E1E] border-2 border-[#008070] rounded-full flex items-center justify-center">
                    <span className="font-anton text-[#008070] text-sm">{step.number}</span>
                  </div>

                  <h3 className="font-anton text-xl text-white mb-4">
                    {step.title}
                  </h3>

                  <p className="font-manrope text-gray-300">
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