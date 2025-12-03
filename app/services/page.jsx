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
      title: "Custom Web Design",
      description: "Sophisticated design that reflects your professional standard and positions you as the premium choice in your market.",
      features: [
        "Custom UI/UX Design",
        "Strategic Brand Integration",
        "Mobile-First Architecture",
        "Conversion-Focused Layout",
        "Professional Visual Identity"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: "Premium Development",
      description: "Clean, efficient code built on modern architecture. Engineered for performance, security, and long-term reliability.",
      features: [
        "Modern Framework Implementation",
        "SEO Architecture",
        "Performance Optimization",
        "Security Best Practices",
        "Cross-Platform Compatibility"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Ongoing Optimization",
      description: "Continuous improvement and technical excellence. Your website evolves with your business and market demands.",
      features: [
        "Proactive Maintenance",
        "Security Monitoring & Updates",
        "Performance Optimization",
        "Strategic Enhancements",
        "Priority Technical Support"
      ],
      color: "text-[#008070]",
      bgColor: "bg-[#008070]/10",
      borderColor: "border-[#008070]/20"
    },
    {
      icon: <Server className="w-12 h-12" />,
      title: "Professional Hosting",
      description: "Enterprise-grade infrastructure with the reliability and performance your professional presence demands.",
      features: [
        "99.9% Uptime Guarantee",
        "SSL & Security Certificates",
        "Automated Daily Backups",
        "Global CDN Integration",
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
      title: "Discovery & Strategy",
      description: "Comprehensive analysis of your business, market position, and objectives. Strategic planning that aligns with your goals.",
      icon: <Search className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Design & Architecture",
      description: "Custom design and technical architecture that reflects your professional standard and positions you for success.",
      icon: <Eye className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Development & QA",
      description: "Precision engineering with rigorous testing. Every detail examined to ensure flawless performance.",
      icon: <Code className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Launch & Optimization",
      description: "Seamless deployment with ongoing support and strategic optimization for continued excellence.",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  const whyChooseUs = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance Engineering",
      description: "Optimized for speed from the ground up. Fast load times aren't a bonus—they're a requirement for professional presence."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security First",
      description: "Enterprise-grade security built into every layer. Your reputation and client data protected with industry-leading practices."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Strategic SEO",
      description: "Sophisticated search optimization that positions you in front of high-value clients. Built to be found by the right people."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Direct Partnership",
      description: "Work directly with experienced professionals who understand your business. No outsourcing, no junior teams, no compromises."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Long-Term Value",
      description: "Websites engineered to perform and appreciate over time. Strategic decisions made with longevity and growth in mind."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Proven Reliability",
      description: "Disciplined process. Clear communication. Commitments honored. The professional standards you expect from a premium service."
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
                Premium Web Solutions Built to Last
              </h1>
              <p className="font-manrope text-xl text-gray-300 max-w-3xl leading-relaxed">
                We deliver comprehensive web services designed for professionals who refuse to compromise on quality. Every solution is strategically crafted to position you as the premium choice in your market.
              </p>
              <p className="font-manrope text-lg text-gray-400 max-w-3xl leading-relaxed">
                From custom design to strategic SEO, reliable hosting to ongoing optimization—we provide everything you need to maintain a professional digital presence that performs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Core Capabilities</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Comprehensive Solutions for Professional Success
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              Four integrated services that work together to create and maintain a digital presence worthy of your expertise.
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
            <p className="font-manrope font-semibold text-[#008070]">Our Standards</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Why Professionals Choose Visionary Advance
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              We maintain the highest standards in every aspect of our work—because your reputation depends on the quality of your digital presence.
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
            <p className="font-manrope font-semibold text-[#008070]">Our Approach</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              A Disciplined Process for Exceptional Results
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              Quality doesn't happen by accident. Our structured approach ensures every project meets the highest standards from discovery through launch and beyond.
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