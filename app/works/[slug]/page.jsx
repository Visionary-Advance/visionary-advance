'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { worksData } from '@/lib/works-data'

// ─── Tabs ────────────────────────────────────────────────────────────────────

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'approach', label: 'Approach' },
  { key: 'results', label: 'Results' },
]

// ─── PillBadge (matches homepage) ────────────────────────────────────────────

function PillBadge({ text }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-full px-7 py-3 font-manrope font-bold text-base border border-gray-300 text-gray-700">
      <span className="w-3.5 h-3.5 rounded-full bg-[#008070]" />
      {text}
    </span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WorkDetailPage({ params }) {
  const { slug } = use(params)
  const project = worksData[slug]

  if (!project) notFound()

  const [activeTab, setActiveTab] = useState('overview')

  return (
    <main className="bg-white min-h-screen pt-32 overflow-hidden">
      {/* ── Decorative grid lines ──────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[375px] pointer-events-none hidden md:block">
        {[240, 480, 720, 1010, 1250].map((x, i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-r border-black/5"
            style={{ left: `${(x / 1440) * 100}%` }}
          />
        ))}
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 md:px-16 text-center">
        <div className="mb-6">
          <Link href="/works">
            <PillBadge text="Our Works" />
          </Link>
        </div>

        <h1 className="font-inter-display font-bold text-4xl md:text-[40px] text-black">
          {project.name}
        </h1>

        <p className="mx-auto mt-4 max-w-[650px] font-inter-display text-base md:text-xl text-black text-center">
          {project.subtitle}
        </p>
      </section>

      {/* ── Hero image ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 md:px-16 mt-10">
        <div className="relative w-full aspect-[1159/478] bg-[#d9d9d9] rounded-[10px] overflow-hidden">
          {project.gallery ? (
            <div className="absolute inset-0 grid grid-cols-2 gap-1">
              <div className="relative">
                <Image src={project.gallery[0]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative">
                <Image src={project.gallery[4]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-manrope text-lg">
              Project Screenshot
            </div>
          )}
        </div>
      </section>

      {/* ── Meta bar ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 md:px-16 mt-6">
        <div className="border border-black/20 rounded-[10px] py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-inter-display text-2xl md:text-[32px] font-semibold text-black">Client:</p>
            <p className="font-inter-display text-2xl text-black/50">{project.client}</p>
          </div>
          <div>
            <p className="font-inter-display text-2xl md:text-[32px] font-semibold text-black">Launched:</p>
            <p className="font-inter-display text-2xl text-black/50">{project.launched}</p>
          </div>
          <div>
            <p className="font-inter-display text-2xl md:text-[32px] font-semibold text-black">Tools:</p>
            <p className="font-inter-display text-2xl  text-black/50">{project.tools}</p>
          </div>
        </div>
      </section>

      {/* ── Content section (text + tab nav) ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 md:px-16 mt-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left — content box */}
          <div className="flex-1 border border-black/20 rounded-[10px] p-6 md:p-8 min-h-[165px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="font-inter-display text-base md:text-xl text-black/50 leading-relaxed"
              >
                {project[activeTab]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Right — section nav */}
          <div className="flex flex-row md:flex-col gap-4 md:gap-6 md:pt-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#008070] border-[#008070]'
                        : 'bg-transparent border-black/20 group-hover:border-[#008070]/50'
                    }`}
                  />
                  <span
                    className={`font-inter-display text-xl md:text-[32px] transition-colors duration-200 ${
                      isActive ? 'text-black' : 'text-black/40 group-hover:text-black/70'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Image gallery ─────────────────────────────────────────────── */}
      {/* Mobile: 2-col grid → row of 2, full-width spanning 2 cols, row of 2 */}
      {/* Desktop: 3-col layout → left stack, tall center, right stack */}
      <section className="mx-auto max-w-[1260px] px-4 md:px-16 mt-16 mb-24">
        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[300px_1fr_300px] gap-5">
          <div className="flex flex-col gap-5">
            {project.gallery ? (
              <>
                <div className="aspect-square rounded-[10px] overflow-hidden relative">
                  <Image src={project.gallery[0]} alt={project.name} fill className="object-cover" sizes="300px" />
                </div>
                <div className="aspect-square rounded-[10px] overflow-hidden relative">
                  <Image src={project.gallery[1]} alt={project.name} fill className="object-cover" sizes="300px" />
                </div>
              </>
            ) : (
              <>
                <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
                <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
              </>
            )}
          </div>
          {project.gallery ? (
            <div className="rounded-[10px] overflow-hidden relative h-full">
              <Image src={project.gallery[2]} alt={project.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
            </div>
          ) : (
            <div className="bg-[#d9d9d9] rounded-[10px] h-full" />
          )}
          <div className="flex flex-col gap-5">
            {project.gallery ? (
              <>
                <div className="aspect-square rounded-[10px] overflow-hidden relative">
                  <Image src={project.gallery[3]} alt={project.name} fill className="object-cover" sizes="300px" />
                </div>
                <div className="aspect-square rounded-[10px] overflow-hidden relative">
                  <Image src={project.gallery[4]} alt={project.name} fill className="object-cover" sizes="300px" />
                </div>
              </>
            ) : (
              <>
                <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
                <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
              </>
            )}
          </div>
        </div>

        {/* Mobile layout: 2, 1 (big), 2 */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {project.gallery ? (
            <>
              <div className="aspect-square rounded-[10px] overflow-hidden relative">
                <Image src={project.gallery[0]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="aspect-square rounded-[10px] overflow-hidden relative">
                <Image src={project.gallery[1]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="col-span-2 aspect-square rounded-[10px] overflow-hidden relative">
                <Image src={project.gallery[2]} alt={project.name} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="aspect-square rounded-[10px] overflow-hidden relative">
                <Image src={project.gallery[3]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
              <div className="aspect-square rounded-[10px] overflow-hidden relative">
                <Image src={project.gallery[4]} alt={project.name} fill className="object-cover" sizes="50vw" />
              </div>
            </>
          ) : (
            <>
              <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
              <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
              <div className="col-span-2 aspect-square bg-[#d9d9d9] rounded-[10px]" />
              <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
              <div className="aspect-square bg-[#d9d9d9] rounded-[10px]" />
            </>
          )}
        </div>
      </section>
    </main>
  )
}
