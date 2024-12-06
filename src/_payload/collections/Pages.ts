import type { CollectionConfig } from 'payload'

import { publishedOnly } from '../access/publishedOnly'
import { FormBlock } from '../blocks/Form'
import { slugField } from '../fields/slug'
import { revalidateTag } from 'next/cache'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: publishedOnly,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidateTag(`page-${doc.slug}`)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [FormBlock],
              required: true,
            },
          ],
          label: 'Content',
        },
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
