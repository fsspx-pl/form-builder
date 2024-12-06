import config from '@payload-config'
import { notFound } from 'next/navigation'
import React from 'react'

import { getPayload } from 'payload'
import { Metadata } from 'next'
import Blocks from '../../../components/Blocks'
import { metadata } from '../metadata.constants'
import { unstable_cache } from 'next/cache'
import { Gutter } from '@/components/Gutter'

import { EB_Garamond } from 'next/font/google'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400'],
})

const Title = ({ text }: { text: string }) => {
  return (
    <Gutter>
      <h3 className={ebGaramond.className} style={{ fontWeight: '400' }}>{text}</h3>
    </Gutter>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug
  const page = await getPage(slug)
  
  if (!page) return metadata

  return {
    title: `${page.title} - FSSPX - Bractwo Św. Piusa X`,
    openGraph: {
      title: page.title,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const page = await getPage(slug)

  if (!page) {
    return notFound()
  }

  return (
    <>
      <Title text={page.title} />
      <React.Fragment>
        <Blocks blocks={page.layout} />
      </React.Fragment>
    </>
  )
}

export const getPage = async (slug: string) => {
  try {
    const payload = await getPayload({ config })
    const getCachedPagesBySlug = unstable_cache(
      async () =>
        await payload.find({
          collection: 'pages',
          draft: false,
          limit: 1,
          overrideAccess: false,
          where: {
            slug: {
              equals: slug,
            },
          },
        }),
      [`page-${slug}`],
      {
        tags: [`page-${slug}`],
      },
    )
    const pages = await getCachedPagesBySlug()
  
    return pages.docs[0]
  }
  catch(err) {
    console.error('Error in getPage', err)
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
    })

    return pages.docs.map((doc) => ({
      slug: doc.slug,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return [] // Return an empty array if there's an error
  }
}
