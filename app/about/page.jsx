'use client'
import React, { useState, useEffect } from 'react';
import {
  Code,
  Users,
  Lightbulb,
  Rocket,
  Star,
  Globe,
  Clock,
  CheckCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import Image from 'next/image';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Link from 'next/link';
import CTA from '@/Components/CTA';



const CounterStat = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const PlaceholderImage = ({ className = "" }) => (
  <div
    className={`bg-gray-300 rounded-2xl flex items-center justify-center ${className}`}
  >
    <div className="w-16 h-16 bg-gray-400 rounded-lg opacity-50"></div>
  </div>
);

export default function AboutPage() {
  const businessStats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: 10,
      suffix: "k+",
      label: "People Reached",
      color: "text-[#008070]"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: 100,
      suffix: "%",
      label: "Project Success Rate",
      color: "text-[#008070]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      number: 2.3,
      suffix: "s",
      label: "Average page load time",
      color: "text-[#008070]"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: 340,
      suffix: "%",
      label: "Average traffic increase",
      color: "text-[#008070]"
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
              <span className="font-manrope text-[#008070] font-semibold">About Visionary Advance</span>
            </div>
            <div className="space-y-6">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Built on Expertise, Driven by Excellence
              </h1>
              <p className="font-manrope text-xl text-gray-300 max-w-3xl leading-relaxed">
                We build premium web experiences for professionals who understand that quality matters. Your business deserves a digital presence that reflects the expertise and standards you've spent years building.
              </p>
              <p className="font-manrope text-lg text-gray-400 max-w-3xl leading-relaxed">
                Based in Eugene, Oregon, we specialize in creating high-performance websites that don't just look professional—they position you as the premium choice in your market.
              </p>
            </div>

            {/* Hero Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {businessStats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-black/30 rounded-2xl border border-white/10">
                  <div className={`${stat.color} mb-4 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-anton text-white mb-2">
                    <CounterStat end={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="font-manrope text-sm text-gray-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="font-manrope font-semibold text-[#008070]">Our Philosophy</p>
                <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
                  Quality Isn't Optional—It's Everything
                </h2>
                <p className="font-manrope text-lg text-gray-300 leading-relaxed">
                  We build websites for professionals who refuse to compromise on quality. Every project is approached with the same attention to detail and commitment to excellence that you bring to your own work.
                </p>
                <p className="font-manrope text-lg text-gray-300 leading-relaxed">
                  Our focus isn't on being the cheapest or the fastest—it's on being the best choice for businesses that value expertise, reliability, and long-term results.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">Technical Excellence</h3>
                    <p className="font-manrope text-gray-300">Clean, efficient code built on modern architecture. Fast-loading, secure, and engineered to perform flawlessly under real-world conditions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">Strategic Positioning</h3>
                    <p className="font-manrope text-gray-300">SEO architecture that ensures you're found by the right clients. We position you in front of people searching for quality, not discounts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">Long-Term Partnership</h3>
                    <p className="font-manrope text-gray-300">We're invested in your success beyond launch day. Ongoing support, optimization, and guidance to ensure your digital presence continues to perform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src='/Img/coding.jpg' className="w-full rounded-2xl h-96 md:h-[500px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-[#191E1E] p-6 rounded-xl border border-[#008070]/30 max-w-xs">
                <p className="font-manrope text-sm text-gray-300 italic">
                  "Your expertise deserves a digital presence that does it justice."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Why Visionary Advance</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Built For Professionals Who Demand More
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              We're not the right fit for everyone—and that's intentional. We work with businesses that value quality, understand the importance of professional positioning, and are ready to invest in their digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#191E1E] rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-anton text-2xl text-white mb-4">No Cookie-Cutter Solutions</h3>
              <p className="font-manrope text-gray-300 leading-relaxed">
                Every business is unique. We don't use templates or one-size-fits-all approaches. Your website is custom-built to reflect your specific expertise and market position.
              </p>
            </div>

            <div className="p-8 bg-[#191E1E] rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-anton text-2xl text-white mb-4">Strategic, Not Just Pretty</h3>
              <p className="font-manrope text-gray-300 leading-relaxed">
                Design matters, but strategy matters more. We build websites that position you correctly in your market and attract the clients you actually want to work with.
              </p>
            </div>

            <div className="p-8 bg-[#191E1E] rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-anton text-2xl text-white mb-4">Quality Over Quantity</h3>
              <p className="font-manrope text-gray-300 leading-relaxed">
                We limit our client roster to ensure every project receives the attention it deserves. You're not just another ticket in a queue—you're a partnership we're invested in.
              </p>
            </div>

            <div className="p-8 bg-[#191E1E] rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-anton text-2xl text-white mb-4">Long-Term Thinking</h3>
              <p className="font-manrope text-gray-300 leading-relaxed">
                We're not interested in quick wins that fade. Every decision is made with longevity in mind—building digital assets that continue to perform and appreciate over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Our Approach</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              A Process Built on Precision and Partnership
            </h2>
            <p className="font-manrope text-lg text-gray-300 max-w-3xl mx-auto">
              Quality doesn't happen by accident. It's the result of a disciplined, strategic approach where every detail is considered and every decision is intentional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <div className="text-sm font-manrope text-[#008070] font-semibold">PHASE 01</div>
                <h3 className="font-anton text-2xl text-white">Discovery & Strategy</h3>
                <p className="font-manrope text-gray-300">
                  We begin by understanding your business, your market, and your goals. This isn't about what we want to build—it's about what you need to succeed.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Code className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <div className="text-sm font-manrope text-[#008070] font-semibold">PHASE 02</div>
                <h3 className="font-anton text-2xl text-white">Design & Development</h3>
                <p className="font-manrope text-gray-300">
                  Custom design that reflects your professional standard. Clean, efficient code built on modern architecture. Every detail engineered for performance and longevity.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <div className="text-sm font-manrope text-[#008070] font-semibold">PHASE 03</div>
                <h3 className="font-anton text-2xl text-white">Launch & Optimization</h3>
                <p className="font-manrope text-gray-300">
                  Flawless deployment with ongoing support and strategic optimization. Your success is measured over months and years, not just launch day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
     <CTA />
     
    </div>
  );
}