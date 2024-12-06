import config from '@payload-config'
import { notFound } from 'next/navigation'
import React from 'react'

import { Title } from '@/components/Title'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import Blocks from '../../../components/Blocks'
import { metadata } from '../metadata.constants'

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
