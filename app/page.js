'use client'
import React from 'react';
import {
  ChevronRight,
  Star,
  Globe,
  Smartphone,
  BarChart3,
  Eye,
  SearchX,
  MessageCircleX,
  ShieldCheck,
  Search,
  Award,
} from "lucide-react";
import Image from 'next/image';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Footer from '@/Components/Footer';
import SquareOAuthButton from '@/Components/SquareOAuthButton';
import CTA from '@/Components/CTA';

const DarkVeil = dynamic(() => import('@/Components/DarkVeil'), { ssr: false });

const PlaceholderImage = ({ className = "" }) => (
  <div
    className={`bg-gray-300 rounded-2xl flex items-center justify-center ${className}`}
  >
    <div className="w-16 h-16 bg-gray-400 rounded-lg opacity-50"></div>
  </div>
);



export default function LandingPage() {
  return (
    <>
      {/* Dark Veil Background Animation */}
      <div className='absolute top-0 overflow-x-hidden left-0 w-full h-full z-0 pointer-events-none' style={{minHeight: '100vh'}}>
        <DarkVeil 
          hueShift={53}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={0.6}
          scanlineFrequency={0.1}
          warpAmount={0.5}
          resolutionScale={1}
        />
      </div>
      
      <div className="min-h-screen bg-transparent  text-white relative z-10">
        {/* Glass Navigation Header */}
        
        {/* Hero Section */}
        <section className="min-h-screen  text-center relative">
          <div className="lg:max-w-4xl w-full mt-16 mx-auto justify-center -translate-y-1/2 top-1/2 absolute left-1/2 -translate-x-1/2 space-y-5">
            <div className="space-y-6 ">
              
              <h1 className="pb-2 font-anton text-5xl lg:text-6xl text-white leading-tight tracking-tight lg:max-w-4xl mx-auto animate-fade-up">
                Custom Websites, SEO &amp; Business Systems Built Around How You Work
              </h1>

<p className="text-lg md:text-xl">We design modern, SEO-driven websites and custom business systems from dashboards to inventory built around your workflow, not the other way around. Serving Eugene, Lane County & Oregon businesses.</p>

          
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-11/12 mx-auto">
              <a href="/contact" className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                Map Your Workflow
              </a>
              <a href="/services" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                See Our Approach
              </a>
            </div>
          </div>
        </section>



        {/* <iframe width="100%" height="640" frameBorder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowFullScreen scrolling="yes" src="https://kuula.co/share/collection/7HFB6?logo=0&info=0&fs=0&vr=0&sd=1&thumbs=1"></iframe> */}

        {/* Problem/Gap Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 relative bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <p className="font-manrope font-semibold text-[#008070]">The Gap</p>
              <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-4xl mx-auto animate-fade-up">
                Built in Eugene. Designed for Real Businesses.
              </h2>
              <p className="font-manrope text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
                No templates. No bloated platforms. Just custom solutions that fit how your business already operates.
              </p>
            </div>

            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:space-y-0">
              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <Eye className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  First Impressions Still Decide
                </h3>
                <p className="font-manrope text-gray-300">
                 When potential clients search your business, your website sets expectations instantly. An outdated or generic site signals outdated systems, even if your work is excellent.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <SearchX className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                 Invisible to the Right Buyers
                </h3>
                <p className="font-manrope text-gray-300">
                 Your best work doesn't matter if it isn't found. Without SEO built into your website, competitors win visibility simply by showing up first.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <MessageCircleX className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  The Wrong Message
                </h3>
                <p className="font-manrope text-gray-300">
                 Template sites and DIY builds don't reflect premium services. When your website undersells you, high-value clients never reach out.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  Your Reputation, Online
                </h3>
                <p className="font-manrope text-gray-300">
                  You don't cut corners for clients. Your website and systems shouldn't either. Your digital presence is part of how you deliver trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 md:px-16 py-16 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
            <p className="font-manrope font-semibold text-[#008070]">The Solution</p>

             <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-4xl mx-auto animate-fade-up">
               Websites &amp; Systems That Match How You Work
             </h2>
<p className='font-manrope text-base md:text-lg text-gray-300 max-w-3xl mx-auto'>We build custom websites and business systems for professionals who take their operations seriously. Your experience, reputation, and workflow deserve more than templates — they deserve solutions built specifically for you.</p>

              
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0 mb-12 md:mb-16">
              <div className="text-center space-y-6 md:space-y-8">
                <div className="relative w-full h-48 md:h-60">
                  <Image
                    src='/Img/Design.jpg'
                    alt="Design that reflects professional standards"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Design That Reflects Your Standards
                  </h3>
                  <p className="font-manrope text-gray-300">
Every interaction, every detail, every decision is intentional. We design websites and dashboards that reflect the level of quality you deliver. No shortcuts, no recycled layouts, no compromises.                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:space-y-8">
                <div className="relative w-full h-48 md:h-60">
                  <Image
                    src='/Img/Clients.jpg'
                    alt="SEO strategy to be found by the right clients"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Found By The Right Clients
                  </h3>
                  <p className="font-manrope text-gray-300">
SEO isn’t about traffic — it’s about alignment. We build SEO into the foundation so the right clients find you first: the ones who value expertise, professionalism, and long-term partnerships.                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:space-y-8">
                <div className="relative w-full h-48 md:h-60">
                  <Image
                    src='/Img/communication.jpg'
                    alt="High-performance websites built to last"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                   Built To Perform. Built To Scale.
                  </h3>
                  <p className="font-manrope text-gray-300">
                   Fast, secure, and engineered for long-term performance. From modern websites to internal systems, everything we build is designed to scale as your business grows, not hold it back.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <a href="/services" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                See Our Approach
              </a>
              <a href="/contact" className="text-white hover:text-gray-300 flex items-center gap-2 w-full sm:w-auto justify-center transition-colors">
                Start Your Project
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Split Content Section */}
        <section className="px-4 md:px-16 py-16 md:py-28 relative bg-white/5">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 order-2 lg:order-1">
              <div className="space-y-6 text-left">
                <p className="font-manrope font-semibold text-[#008070]">Built to Represent You</p>
                  <h2 className="pb-2 font-anton text-3xl text-left md:text-4xl lg:text-6xl text-white leading-tight tracking-tight max-w-4xl mx-auto animate-fade-up">
                    A Digital Presence That Matches How You Work
                  </h2>

<p className='font-manrope text-left text-base md:text-lg text-gray-300 max-w-3xl mx-auto'>We build custom websites and business systems for professionals who take pride in their craft. Your experience, precision, and operational standards deserve a digital presence that reflects the same level of quality.</p>

              </div>

              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">
                    Attract the Right Opportunities
                  </h3>
                  <p className="font-manrope text-gray-300">
Your digital presence should work as a filter — drawing in clients who value professionalism and pushing away those who don’t.                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">Stand Out for the Right Reasons</h3>
                  <p className="font-manrope text-gray-300">
                    When potential clients search, your website should immediately communicate trust, quality, and capability.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <a href="/contact" className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                  Elevate Your Presence
                </a>
                <a href="/services" className="text-white hover:text-gray-300 flex items-center gap-2 w-full sm:w-auto justify-center transition-colors">
                  See Our Approach
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex-1 w-full order-1 lg:order-2">
              <div className="relative w-full h-80 md:h-[640px]">
                <Image
                  src='/Img/Work.jpg'
                  alt="Digital presence that matches your craftsmanship"
                  fill
                  className="rounded-2xl object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Web Hosting Section */}
        <section className="px-4 md:px-16 py-16 md:py-28 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <p className="font-manrope font-semibold text-[#008070]">Built to Perform</p>
              <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-3xl mx-auto">
                A Digital Presence Built for Real Operations
              </h2>
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Globe className="w-12 h-12 text-[#008070]" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Precision in Every Detail
                  </h3>
                  <p className="font-manrope text-gray-300">
                   Every line of code, every interaction, every system is built with intention. From public-facing websites to internal dashboards, everything we create is designed to perform as precisely as you run your business.
                  </p>
                </div>
                <a href="/services" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  See Our Approach
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Search className="w-12 h-12 text-[#008070]" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Found by Clients Who Value Quality
                  </h3>
                  <p className="font-manrope text-gray-300">
                   SEO isn’t about being everywhere — it’s about showing up where it matters. We position you in front of clients actively searching for expertise, professionalism, and long-term quality, not the lowest price.
                  </p>
                </div>
                <a href="/contact" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  Start Your Project
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Award className="w-12 h-12 text-[#008070]" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Reliability You Can Count On
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Fast load times, secure architecture, and modern technology built to last. Your website and systems should perform reliably year after year — without constant fixes or compromises.
                  </p>
                </div>
                <a href="/about" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="px-4 md:px-16 py-16 md:py-28 relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 md:mb-20">
              <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-6">
                Client Feedback
              </h2>
              <p className="font-manrope text-base md:text-lg text-white">
                Their commitment to community is truly inspiring.
              </p>
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
              {[
                {
                  quote: "Working with them transformed our online presence!",
                  name: "Alice Johnson",
                  role: "CEO, Local Co.",
                },
                {
                  quote: "Their support has been invaluable to our growth!",
                  name: "Mark Smith",
                  role: "Founder, Tech Hub",
                },
                {
                  quote: "A fantastic partner in building our community!",
                  name: "Emily Davis",
                  role: "Director, Art Space",
                },
              ].map((testimonial, i) => (
                <div key={i} className="space-y-6 md:space-y-8">
                  <StarRating />
                  <blockquote className="font-anton text-lg md:text-xl text-white leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="font-manrope font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="font-manrope text-white">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Custom Systems Section */}
        <section className="px-4 md:px-16 py-16 md:py-28 relative bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <p className="font-manrope font-semibold text-[#008070]">Custom Systems</p>
              <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-4xl mx-auto">
                Custom Systems Built Around Your Workflow
              </h2>
              <p className="font-manrope text-lg md:text-xl text-[#008070] max-w-3xl mx-auto">
                Not platforms you have to adapt to.
              </p>
              <p className="font-manrope text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
                Built in Eugene, serving Lane County + Oregon. Modern frameworks, custom code, secure dashboards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Link href="/contractor-systems" className="group">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                  <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                    Contractor Systems
                  </h3>
                  <p className="font-manrope text-gray-400 text-sm">
                    Job tracking, labor management, inventory, and reporting designed for contractors.
                  </p>
                </div>
              </Link>

              <Link href="/warehouse-inventory-systems" className="group">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                  <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                    Warehouse & Inventory
                  </h3>
                  <p className="font-manrope text-gray-400 text-sm">
                    Real-time inventory tracking, stock alerts, and warehouse dashboards.
                  </p>
                </div>
              </Link>

              <Link href="/custom-dashboards-analytics" className="group">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                  <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                    Custom Dashboards
                  </h3>
                  <p className="font-manrope text-gray-400 text-sm">
                    Analytics and reporting dashboards that show exactly what matters.
                  </p>
                </div>
              </Link>

              <Link href="/custom-cms-development" className="group">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:border-[#008070]/50 transition-colors">
                  <h3 className="font-anton text-xl text-white mb-3 group-hover:text-[#008070] transition-colors">
                    Custom CMS
                  </h3>
                  <p className="font-manrope text-gray-400 text-sm">
                    Secure, scalable content management tailored to your workflow.
                  </p>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/custom-business-systems"
                className="inline-flex items-center gap-2 bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded transition-colors"
              >
                Explore Custom Business Systems
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
      <CTA />
       
       

       
      </div>

    </>
  );
}