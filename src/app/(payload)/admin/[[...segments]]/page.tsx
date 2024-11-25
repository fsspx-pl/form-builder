/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from "../importMap.js"

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({ config, importMap, params, searchParams })
}

export default Page
