// app/works/[slug]/layout.js
// The work-detail page is a client component; per-project metadata (incl. a
// self-referential canonical and a real description) is generated here.

import { worksData } from '@/lib/works-data'

const OG_IMAGE = 'https://visionaryadvance.com/Img/VaLogo_Large.png'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = worksData[slug]

  if (!project) {
    return { title: 'Project Not Found' }
  }

  const url = `https://visionaryadvance.com/works/${slug}`
  const title = `${project.name} | ${project.category} Case Study`
  const description = (project.subtitle || project.overview || '').slice(0, 160)
  const image = project.gallery?.[0]
    ? `https://visionaryadvance.com${project.gallery[0]}`
    : OG_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Visionary Advance',
      type: 'article',
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default function WorkDetailLayout({ children }) {
  return children
}
