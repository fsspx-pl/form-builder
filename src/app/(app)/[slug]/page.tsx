import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import Blocks from '../../../components/Blocks'
import { Metadata } from 'next'
import { metadata } from '../metadata.constants'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPage(params.slug)
  
  if (!page) return metadata

  return {
    title: `${page.title} - FSSPX - Bractwo Św. Piusa X`,
    openGraph: {
      title: page.title,
    },
  }
}

export default async function Page({ params: { slug = 'home' } }) {
  const page = await getPage(slug)

  if (!page) {
    return notFound()
  }

  return (
    <React.Fragment>
      <Blocks blocks={page.layout} />
    </React.Fragment>
  )
}

export const getPage = async (slug: string) => {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1,
      overrideAccess: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
  
    return pages.docs[0]
  }
  catch(err) {
    console.error('Error in getPage', err)
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
    })

    return pages.docs.map((doc) => doc.slug!)
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return [] // Return an empty array if there's an error
  }
}
