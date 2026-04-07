'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, LayoutDashboard, Search, Wrench } from 'lucide-react'
import SplitText from '@/Components/SplitText'

import { portfolioProjects, worksData } from '@/lib/works-data'
import FAQ from '@/Components/FAQ'

const categoryIcons = {
  Website: Globe,
  Dashboard: LayoutDashboard,
  SEO: Search,
  Systems: Wrench,
}

// ─── FAQ data ────────────────────────────────────────────────────────────────


// ─── Animation helpers ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  },
})

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

// ─── PillBadge (matches homepage) ────────────────────────────────────────────

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

// ─── ProjectCard (matches homepage) ──────────────────────────────────────────

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
            /* Full-width: collage of 3 images */
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
            /* Half-width: mockup image (center/index 2) */
            <Image src={gallery[2]} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-manrope">
            Project Screenshot
          </div>
        )}
        {/* Category overlay top-left */}
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


// ─── Main page ───────────────────────────────────────────────────────────────

export default function WorksPage() {
  return (
    <main className="min-h-screen bg-white pt-32">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 text-center md:px-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeUp()}
            className="font-inter-display text-6xl font-bold text-black md:text-8xl lg:text-[128px] lg:leading-none"
          >
            <SplitText text="Our Works" />
          </motion.h1>

          <motion.p
            variants={fadeUp(0.15)}
            className="mx-auto mt-6 max-w-[680px] font-inter-display text-xl font-bold leading-snug text-black md:text-[28px] lg:text-[32px]"
          >
            Building digital experiences that elevate brands and drive real results.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Portfolio grid (matches homepage layout) ─────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <PillBadge text="Our Works" />
          </div>

          <div className="space-y-6">
            {portfolioProjects.map((project, i) => {
              if (project.span === 'full') {
                return <ProjectCard key={i} project={project} />
              }
              // Check if next project is also 'half' to pair them
              const next = portfolioProjects[i + 1]
              const prev = portfolioProjects[i - 1]
              if (project.span === 'half' && prev?.span === 'half' && portfolioProjects[i - 2]?.span !== 'half') {
                // This is the second in a pair — already rendered
                return null
              }
              if (project.span === 'half' && next?.span === 'half') {
                return (
                  <div key={i} className="grid md:grid-cols-2 gap-6">
                    <ProjectCard project={project} />
                    <ProjectCard project={next} />
                  </div>
                )
              }
              // Lone half — render full width
              return <ProjectCard key={i} project={project} />
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQ />
    </main>
  )
}
