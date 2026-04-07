'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Globe, LayoutDashboard, Search, Wrench } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ServicesAccordion from '@/Components/Home/ServicesAccordion'
import PricingSection from '@/Components/Home/PricingSection'
import TestimonialsCarousel from '@/Components/Home/TestimonialsCarousel'
import CTA from '@/Components/CTA'
import ScrollReveal from '@/Components/Home/ScrollReveal'
import { client } from '@/sanity/lib/client'

function PillBadge({ text, filled = false }) {
  return (
    <span
      className={`inline-flex items-center gap-3 rounded-full px-7 py-3 font-manrope font-bold text-base ${
        filled
          ? 'bg-[#008070] border border-[#008070] text-white'
          : 'border border-gray-300 text-gray-700'
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-full ${
          filled ? 'bg-white' : 'bg-[#008070]'
        }`}
      />
      {text}
    </span>
  )
}

import { portfolioProjects, worksData } from '@/lib/works-data'

const categoryIcons = {
  Website: Globe,
  Dashboard: LayoutDashboard,
  SEO: Search,
  Systems: Wrench,
}

function ProjectCard({ project }) {
  const Icon = categoryIcons[project.category] ?? Globe
  const data = worksData[project.slug]
  const gallery = data?.gallery
  const isFull = project.span === 'full'

  return (
    <Link href={`/works/${project.slug}`} className="group block">
      <div className="relative h-60 md:h-80 bg-gray-200 rounded-xl overflow-hidden">
        {gallery ? (
          isFull ? (
            <div className="absolute inset-0 grid grid-cols-3 gap-1">
              <div className="relative">
                <Image src={gallery[0]} alt={project.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="relative">
                <Image src={gallery[2]} alt={project.name} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="relative">
                <Image src={gallery[3]} alt={project.name} fill className="object-cover" sizes="33vw" />
              </div>
            </div>
          ) : (
            <Image src={gallery[2]} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-manrope">
            Project Screenshot
          </div>
        )}
        {/* Category overlay top-left — text + icon only, no background */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-white drop-shadow-md">
          <Icon className="w-5 h-5" />
          <span className="font-manrope font-bold text-lg">{project.category}</span>
        </div>
      </div>
      {/* Name tag — turns teal on hover */}
      <div className="flex items-center justify-between px-4 py-3 mt-1 rounded-xl bg-gray-100 group-hover:bg-[#008070] transition-colors duration-200">
        <p className="font-manrope font-bold text-lg text-gray-900 group-hover:text-white transition-colors duration-200">
          {project.name}
        </p>
        <p className="font-manrope font-bold text-lg text-gray-900 group-hover:text-white transition-colors duration-200">
          {project.year}
        </p>
      </div>
    </Link>
  )
}

const BLOG_QUERY = `*[_type == "post" && publishedAt < now()] | order(publishedAt desc) [0...3] {
  title,
  "slug": slug.current,
  excerpt,
  "category": categories[0]->{ title, color },
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt
}`

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [marqueeReady, setMarqueeReady] = useState(false)

  useEffect(() => {
    client.fetch(BLOG_QUERY).then(setBlogPosts)
  }, [])

  return (
    <div className="bg-white overflow-x-hidden">
      {/* ===== SECTION 1: HERO ===== */}
      <section className="bg-[#050505] min-h-screen relative flex flex-col">
        {/* Gradient grid pattern background */}
        <div className="hero-pattern" />

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 pt-28 md:pt-32 pb-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-inter-display font-semibold text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
              Custom Websites, SEO &amp; Business Systems Built Around How You Work
            </h1>
            <p className="font-manrope text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
              We design modern, SEO-driven websites and custom business systems — from dashboards to inventory — built around your workflow, not the other way around.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/audit"
                className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto transition-colors text-center text-lg"
              >
                Run an Audit
              </Link>
              <Link
                href="/works"
                className="bg-white/10 backdrop-blur border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto hover:bg-white/20 transition-colors text-center text-lg"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>

        {/* V-shaped image row (desktop) / scrolling marquee (mobile) */}
        {/* Desktop: static V layout */}
        <div className="relative z-10 w-[80%] mx-auto mb-8 hidden md:block">
          <div className="flex items-end justify-center gap-4">
            <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="relative w-1/5 h-80 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/Img/Design.jpg" alt="Web design" fill className="object-cover" sizes="20vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }} className="relative w-1/5 h-64 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/Img/Clients.jpg" alt="Client work" fill className="object-cover" sizes="20vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} className="relative w-1/5 h-52 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/Img/coding.jpg" alt="Development" fill className="object-cover" sizes="20vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }} className="relative w-1/5 h-64 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/Img/communication.jpg" alt="Communication" fill className="object-cover" sizes="20vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} className="relative w-1/5 h-80 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/Img/Work.jpg" alt="Our work" fill className="object-cover" sizes="20vw" />
            </motion.div>
          </div>
        </div>

        {/* Mobile: scrolling marquee with staggered fade-up */}
        <div className="relative z-10 w-full overflow-hidden mb-8 md:hidden">
          <div className={`flex gap-4 ${marqueeReady ? 'animate-marquee' : ''}`}>
            {[
              '/Img/Design.jpg', '/Img/Clients.jpg', '/Img/coding.jpg', '/Img/communication.jpg', '/Img/Work.jpg',
              '/Img/Design.jpg', '/Img/Clients.jpg', '/Img/coding.jpg', '/Img/communication.jpg', '/Img/Work.jpg',
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                onAnimationComplete={i === 9 ? () => setMarqueeReady(true) : undefined}
                className="relative h-48 w-48 flex-shrink-0 rounded-xl overflow-hidden"
              >
                <Image src={src} alt="" fill className="object-cover" sizes="192px" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: ABOUT ===== */}
      <section className="bg-white py-20 md:py-28 px-4 md:px-16">
        <div className="max-w-6xl ml-0 mr-auto">
          {/* Image collage grid */}


          {/* About content */}
          <div className="max-w-7xl mr-auto ml-0">
            <PillBadge text="About Us" />
            <ScrollReveal
              baseColor="rgb(200, 200, 200)"
              revealColor="rgb(23, 23, 23)"
              containerClassName="mt-6"
              textClassName="font-inter-display font-semibold"
            >
              At Visionary Advance, our web development process is built around your business — not the other way around. As an experienced website designer, we craft custom business systems, high-performance websites, and internal tools that streamline your operations and strengthen your online
            </ScrollReveal>
          </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <div className="relative h-60 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/Img/Design.jpg"
                alt="Custom web design services"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative h-60 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/Img/Brandon_Headshot_Square.jpg"
                alt="Business systems and tools"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative h-60 md:h-80 rounded-xl overflow-hidden flex flex-col justify-start items-start md:justify-end p-4">
              <p className="text-black font-inter-display font-semibold text-xl mb-3">
                Get to know more about what drives us
              </p> 
              <Link
                href="/about"
                className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-4 rounded-lg transition-colors text-center text-lg"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SERVICES INFO ===== */}
      <div className="-translate-y-16 md:-translate-y-0">
      <section className="bg-white -translate-y-16 pb-16 md:pt-4 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          

          <div className="flex flex-col items-center text-center gap-6">
            <PillBadge text="Services" />
            <p className="font-inter-display font-semibold text-black text-base md:text-2xl max-w-3xl leading-relaxed">
              We build custom websites and business systems for professionals who take their operations seriously. Your experience, reputation, and workflow deserve more than templates — they deserve solutions built specifically for you.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: SERVICES ACCORDION ===== */}
      <section className="bg-white pb-16 md:pb-24 px-4 md:px-16">
        <ServicesAccordion />
      </section>
      </div>

      {/* ===== SECTION 5: PORTFOLIO ===== */}
      <section className="bg-white -trans md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <PillBadge text="Our Works" />
          </div>

          <div className="space-y-6">
            {/* Row 1: Two projects side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioProjects.slice(0, 2).map((project, i) => (
                <ProjectCard key={i} project={project} />
              ))}
            </div>

            {/* Row 2: Full width */}
            <ProjectCard project={portfolioProjects[2]} />

            {/* Row 3: Two projects side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {portfolioProjects.slice(3, 5).map((project, i) => (
                <ProjectCard key={i} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: TESTIMONIALS ===== */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto mb-4 flex justify-center">
          <PillBadge text="Testimonials" />
        </div>
        <div className="px-0 md:px-16">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* ===== SECTION 7: PRICING ===== */}
      <PricingSection />

    

      {/* ===== SECTION 9: BLOG / INSIGHTS ===== */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <PillBadge text="Our Blog" />
              <h2 className="font-anton text-3xl md:text-4xl text-gray-900 tracking-tight mt-4">
                Insights
              </h2>
            </div>
            <p className="font-manrope text-gray-500 text-sm md:text-base max-w-xs mt-4 md:mt-0">
              Practical advice on web design, SEO, and building systems that work for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-48 bg-gray-200 rounded-xl overflow-hidden mb-4">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                {post.category && (
                  <span
                    className="inline-block text-white font-manrope font-bold text-xs px-4 py-1.5 rounded-md mb-3"
                    style={{ backgroundColor: post.category.color || '#008070' }}
                  >
                    {post.category.title}
                  </span>
                )}
                <h3 className="font-anton text-xl md:text-2xl text-gray-900 mb-2 tracking-tight group-hover:text-[#008070] transition-colors">
                  {post.title}
                </h3>
                <p className="font-manrope text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold text-lg px-8 py-4 rounded-lg transition-colors"
            >
              View All Posts
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
