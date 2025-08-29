'use client'
import React from 'react';
import {
  ChevronRight,
  Star,
  Globe,
  Smartphone,
  BarChart3,
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

const StarRating = () => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-white text-white" />
    ))}
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
  text="Building Stronger Communities Through  Digital Solutions"
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

<p>At our core, we believe that strong communities are built on
                meaningful relationships. Let us help you create a digital
                presence that fosters connection and engagement.</p>

          
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/services" className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                Learn More
              </a>
              <a href="/contact" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                Get Started
              </a>
            </div>
          </div>
        </section>

      

       

        {/* Services Section */}
        <section className="px-4 md:px-16 py-16 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 md:mb-16">
            <p className="font-manrope font-semibold text-white">Connect</p>
 
             <SplitText
  text="Your Success Is Our Mission"
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
<p className='font-manrope text-base md:text-lg text-white max-w-3xl mx-auto'>Our approach focuses on fostering relationships within
                communities. We leverage our web design and hosting services to
                empower local connections.</p>

              
            </div>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0 mb-12 md:mb-16">
              <div className="text-center space-y-6 md:space-y-8">
                <img src='/Img/performance.jpg' className="w-full h-48 md:h-60" />
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                   Performance Focused Implementation
                  </h3>
                  <p className="font-manrope text-white">
                   Our development approach prioritizes speed, security, and user experience to ensure your digital presence delivers measurable business impact.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:space-y-8">
                <img src='/Img/partner.jpg' className="w-full h-48 md:h-60" />
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Strategic Digital Partnerships
                  </h3>
                  <p className="font-manrope text-white">
                    We become an extension of your team, working collaboratively to achieve your business objectives through innovative web solutions.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-6 md:space-y-8">
                <img src='/Img/communication.jpg' className="w-full h-48 md:h-60" />
                <div className="space-y-4 md:space-y-6">
                  <h3 className="font-anton text-2xl md:text-3xl text-white leading-tight">
                    Transparent Communication Process
                  </h3>
                  <p className="font-manrope text-white">
                  We maintain open dialogue throughout every project, providing regular updates and insights so you're always informed about your investment's progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <a href="/services" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                Learn More
              </a>
              <a href="/contact" className="text-white hover:text-gray-300 flex items-center gap-2 w-full sm:w-auto justify-center transition-colors">
                Get Started
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Split Content Section */}
        <section className="px-4 md:px-16 py-16 md:py-28 relative">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8 order-2 lg:order-1">
              <div className="space-y-6 text-left">
                <p className="font-manrope font-semibold text-white">Connect</p>
                  <SplitText
  text="Premium Web Solutions That Drive Business Success"
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

<p className='font-manrope text-left text-base md:text-lg text-white max-w-3xl mx-auto'>We craft exceptional digital experiences that reflect your brand's excellence. From sophisticated design to seamless functionality, we deliver websites that convert visitors into loyal customers.</p>

              </div>

              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">
                    Engage Locally
                  </h3>
                  <p className="font-manrope text-white">
                    Empower your community with a website that reflects its unique
                    spirit and needs.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">Build Authority</h3>
                  <p className="font-manrope text-white">
                    Establish your brand as an industry leader with professional web presence that commands trust and credibility.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <a href="/services" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors text-center">
                  Learn More
                </a>
                <a href="/contact" className="text-white hover:text-gray-300 flex items-center gap-2 w-full sm:w-auto justify-center transition-colors">
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <img src='/Img/success.png' className="w-full h-80 rounded-2xl md:h-[640px]" />
            </div>
          </div>
        </section>

        {/* Web Hosting Section */}
        <section className="px-4 md:px-16 py-16 md:py-28 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-anton text-3xl md:text-4xl text-white leading-tight tracking-tight mb-12 md:mb-20 max-w-3xl">
              Reliable Web Hosting Solutions for Your Growing Online Presence
            </h2>

            <div className="space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Globe className="w-12 h-12 text-white" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Custom Web Development Tailored to Your Unique Business Needs
                  </h3>
                  <p className="font-manrope text-white">
                    Our web hosting services ensure your site is fast, secure, and
                    always online.
                  </p>
                </div>
                <a href="/services" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <Smartphone className="w-12 h-12 text-white" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Expert Web Development with Code for Optimal Performance
                  </h3>
                  <p className="font-manrope text-white">
                    We build responsive websites that engage users and drive
                    conversions.
                  </p>
                </div>
                <a href="/contact" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <BarChart3 className="w-12 h-12 text-white" />
                  <h3 className="font-anton text-xl md:text-2xl text-white leading-tight">
                    Data-Driven Analytics to Enhance Your Online Strategy
                  </h3>
                  <p className="font-manrope text-white">
                    Our analytics services provide insights to help you make
                    informed decisions.
                  </p>
                </div>
                <a href="/about" className="text-white hover:text-gray-300 flex items-center gap-2 p-0 transition-colors">
                  Discover
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