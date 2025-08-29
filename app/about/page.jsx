'use client'
import React, { useState, useEffect } from 'react';
import {
  Code,
  Coffee,
  Zap,
  Heart,
  Users,
  Lightbulb,
  Rocket,
  Star,
  Globe,
  Music,
  Gamepad2,
  Pizza,
  Clock,
  Bug,
  CheckCircle,
  TrendingUp
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
  const funStats = [
    {
      icon: <Coffee className="w-8 h-8" />,
      number: 2847,
      suffix: " cups",
      label: "Coffee consumed this year",
      color: "text-amber-400"
    },
    {
      icon: <Code className="w-8 h-8" />,
      number: 50,
      suffix: "k+",
      label: "Lines of code written",
      color: "text-green-400"
    },
    {
      icon: <Bug className="w-8 h-8" />,
      number: 23,
      suffix: "",
      label: "Bugs that made us laugh",
      color: "text-red-400"
    },
    {
      icon: <Pizza className="w-8 h-8" />,
      number: 156,
      suffix: " slices",
      label: "Pizza consumed during late nights",
      color: "text-yellow-400"
    },
    {
      icon: <Music className="w-8 h-8" />,
      number: 8760,
      suffix: " hours",
      label: "Lo-fi beats listened to",
      color: "text-purple-400"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      number: 31,
      suffix: "",
      label: "Gaming breaks taken (for inspiration)",
      color: "text-blue-400"
    }
  ];

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

  const quirkyFacts = [
    
    "We've solved 47% of our bugs while in the shower",
    "Our code reviews include emoji ratings",
    "We have a rubber duck debugging collection",
    "Team meetings start with dad jokes (it's mandatory)"
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#191E1E] text-white">
    

      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">About</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Who We Are
              </h1>
              <p className="font-manrope text-lg text-white max-w-3xl">
                We're a team of digital craftspeople who happen to be really good at turning caffeine into beautiful, functional websites. Based in Eugene, we build digital experiences that actually work.
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
                <p className="font-manrope font-semibold text-[#008070]">What We Actually Do</p>
                <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
                  We Turn Coffee Into Code (And Code Into Magic)
                </h2>
                <p className="font-manrope text-lg text-white">
                  We're a team of digital architects who specialize in building websites that don't suck. 
                  Our mission? Creating digital experiences so smooth, your users will think we used actual magic.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">Lightning-Fast Websites</h3>
                    <p className="font-manrope text-white">We make websites that load faster than you can say "why is this taking so long?"</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">User-Obsessed Design</h3>
                    <p className="font-manrope text-white">We design with your users in mind (and occasionally our mothers, they give great feedback).</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#008070] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-anton text-xl text-white mb-2">24/7 Support</h3>
                    <p className="font-manrope text-white">We're here when you need us. Seriously, we practically live in our office (send help).</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img src='/Img/coding.jpg' className="w-full rounded-2xl h-96 md:h-[500px]" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#008070] rounded-full flex items-center justify-center">
                <Code className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Stats Section */}
      <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">The Real Numbers</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              What Really Powers Our Agency
            </h2>
            <p className="font-manrope text-lg text-white max-w-3xl mx-auto">
              Behind every great website is a team fueled by caffeine, passion, and an unhealthy amount of pizza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {funStats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-[#191E1E] rounded-2xl border border-white/10 hover:border-[#008070]/50 transition-colors">
                <div className={`${stat.color} mb-6 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-anton text-white mb-4">
                  <CounterStat end={stat.number} suffix={stat.suffix} />
                </div>
                <p className="font-manrope text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quirky Facts Section */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Random But True</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Things You Probably Didn't Need to Know
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quirkyFacts.map((fact, index) => (
              <div key={index} className="flex items-center gap-4 p-6 bg-black/30 rounded-2xl border border-white/10">
                <div className="w-8 h-8 bg-[#008070] rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <p className="font-manrope text-white">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="px-4 md:px-16 py-16 md:py-28 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">How We Work</p>
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Our Secret Sauce (It's Not Actually Secret)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="font-anton text-2xl text-white">Listen & Learn</h3>
                <p className="font-manrope text-white">
                  We actually listen to what you want (revolutionary, we know). Then we ask really good questions until we understand your vision.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Code className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="font-anton text-2xl text-white">Design & Build</h3>
                <p className="font-manrope text-white">
                  We craft pixel-perfect designs and write clean code. No duct tape solutions here (we promise).
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[#008070] rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="font-anton text-2xl text-white">Launch & Support</h3>
                <p className="font-manrope text-white">
                  We launch your site and stick around to make sure everything runs smoothly. Think of us as your digital bodyguards.
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