import { cookies } from 'next/headers'
import HomeClient from '@/Components/Home/HomeClient'
import { HOME_TITLE_TEST, resolveVariant } from '@/lib/ab-tests'

export const metadata = {
  alternates: { canonical: 'https://visionaryadvance.com' },
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const variant = resolveVariant(
    HOME_TITLE_TEST,
    cookieStore.get(HOME_TITLE_TEST.cookieName)?.value
  )

  return <HomeClient title={HOME_TITLE_TEST.variants[variant]} titleVariant={variant} />
}
