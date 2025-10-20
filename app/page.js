'use client'
import React from 'react';
import {
  ChevronRight,
  Star,
  Globe,
  Smartphone,
  BarChart3,
  AlertCircle,
  TrendingDown,
  Search,
  Award,
} from "lucide-react";
import Image from 'next/image';

import Footer from '@/Components/Footer';
import DarkVeil from '@/Components/DarkVeil';
import SplitText from '@/Components/SplitText';
import SquareOAuthButton from '@/Components/SquareOAuthButton';
import CTA from '@/Components/CTA';

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
              
              <SplitText
  text="Your Work Is Exceptional. Your Website Should Reflect That."
  className="pb-2 font-anton text-5xl lg:text-6xl text-white leading-tight tracking-tight lg:max-w-4xl mx-auto"
  delay={100}
  duration={0.7}
  ease="power3.out"
  splitType="words"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"

/>

<p className="text-lg md:text-xl">Premium web design and strategic SEO for businesses that refuse to settle for &apos;good enough.&apos; When someone searches for what you do, they should immediately see the quality and professionalism you bring to every project.</p>

          
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/contact" className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                Elevate Your Presence
              </a>
              <a href="/services" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                See Our Approach
              </a>
            </div>
          </div>
        </section>

        {/* Problem/Gap Section */}
        <section className="px-4 md:px-16 py-16 md:py-24 relative bg-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
              <p className="font-manrope font-semibold text-[#008070]">The Gap</p>
              <SplitText
                text="Does Your Website Match the Quality You Deliver?"
                className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-4xl mx-auto"
                delay={100}
                duration={0.7}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
              <p className="font-manrope text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
                You deliver exceptional results. But online? You&apos;re being judged before they ever meet you.
              </p>
            </div>

            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:space-y-0">
              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <TrendingDown className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  First Impressions Matter
                </h3>
                <p className="font-manrope text-gray-300">
                  Potential clients search your business and see an outdated website. They assume your quality matches your site—and move on to competitors.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <Search className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  Invisible Excellence
                </h3>
                <p className="font-manrope text-gray-300">
                  Your best work is hidden because you don&apos;t rank for the searches that matter. Competitors show up first simply because they invested in SEO.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <AlertCircle className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  Misrepresentation
                </h3>
                <p className="font-manrope text-gray-300">
                  A DIY website or cheap template doesn&apos;t represent the premium service you deliver. The disconnect costs you high-value clients.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white/5 rounded-lg border border-white/10">
                <Award className="w-10 h-10 text-[#008070]" />
                <h3 className="font-anton text-xl text-white">
                  Professional Standard
                </h3>
                <p className="font-manrope text-gray-300">
                  You wouldn&apos;t deliver mediocre work to clients—why accept it for yourself? Your online presence is an extension of your reputation.
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

             <SplitText
  text="Web Design That Honors Your Expertise"
  className=" font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-4xl mx-auto"
  delay={100}
  duration={0.7}
  ease="power3.out"
  splitType="words"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"

/>
<p className='font-manrope text-base md:text-lg text-gray-300 max-w-3xl mx-auto'>We build websites for professionals who understand that quality matters—and who demand it in everything they do. Your years of experience and commitment to excellence deserve a digital presence that does it justice.</p>

              
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0 mb-12 md:mb-16">
              <div className="text-center space-y-6 md:space-y-8">
                <div className="relative w-full h-48 md:h-60">
                  <Image
                    src='/Img/performance.jpg'
                    alt="Design that reflects professional standards"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Design That Reflects Your Standard
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Every pixel, every interaction, every detail crafted to showcase the level of quality you bring to your work. No templates. No shortcuts. Built to represent excellence.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:space-y-8">
                <div className="relative w-full h-48 md:h-60">
                  <Image
                    src='/Img/partner.jpg'
                    alt="SEO strategy to be found by the right clients"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Found By The Right People
                  </h3>
                  <p className="font-manrope text-gray-300">
                    SEO strategy that puts you in front of clients who value expertise and quality. Show up first for searches that matter, with a presence that commands respect.
                  </p>
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
                    Built To Last, Built To Perform
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Fast, secure, and engineered for long-term performance. Your website should work as flawlessly as your business runs—no compromises.
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
                <p className="font-manrope font-semibold text-[#008070]">Honor</p>
                  <SplitText
  text="A Digital Presence That Matches Your Craftsmanship"
  className="pb-2 font-anton text-3xl text-left md:text-4xl lg:text-6xl text-white leading-tight tracking-tight max-w-4xl mx-auto"
  delay={100}
  duration={0.7}
  ease="power3.out"
  splitType="words"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="left"

/>

<p className='font-manrope text-left text-base md:text-lg text-gray-300 max-w-3xl mx-auto'>We build websites for professionals who understand that quality matters—and who demand it in everything they do. Your years of experience, your attention to detail, your commitment to excellence—it all deserves a digital presence that does it justice.</p>

              </div>

              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">
                    Premium Positioning
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Attract clients who value expertise and quality over price. Your website should filter for the right opportunities, not just any opportunities.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">Professional Standard</h3>
                  <p className="font-manrope text-gray-300">
                    Establish your brand as the premium choice in your market. When they search, they should see quality before they see your competitors.
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

            <div className="flex-1 order-1 lg:order-2">
              <div className="relative w-full h-80 md:h-[640px]">
                <Image
                  src='/Img/success.png'
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
              <p className="font-manrope font-semibold text-[#008070]">Excellence</p>
              <h2 className="font-anton text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight max-w-3xl mx-auto">
                The Professional Standard for Web Presence
              </h2>
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Globe className="w-12 h-12 text-[#008070]" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Built With Obsessive Attention to Detail
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Every line of code, every interaction designed for flawless performance. Your website should work as precisely as you operate your business.
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
                    Found By Clients Who Value Quality
                  </h3>
                  <p className="font-manrope text-gray-300">
                    Sophisticated SEO strategy that positions you in front of high-value clients searching for expertise, not the cheapest option.
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
                    Lightning-fast load times, rock-solid security, and technical excellence that performs year after year without compromise.
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

        {/* CTA Section */}
      <CTA />
       
       

       
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }
      `}</style>
    </>
  );
}