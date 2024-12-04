import type { CollectionConfig } from 'payload'

import { publishedOnly } from '../access/publishedOnly'
import { FormBlock } from '../blocks/Form'
import { slugField } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: publishedOnly,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: {
        en: 'Title',
        pl: 'Nazwa',
      },
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
              label: {
                en: 'Layout',
                pl: 'Układ',
              },
              type: 'blocks',
              blocks: [FormBlock],
              required: true,
            },
          ],
          label: {
            en: 'Content',
            pl: 'Treść',
          },
        },
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
