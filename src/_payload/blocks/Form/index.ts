import type { Block } from 'payload'

import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      label: {
        en: 'Enable Intro Content',
        pl: 'Dodaj tekst wprowadzający',
      },
      type: 'checkbox',
    },
    {
      name: 'introContent',
      label: {
        en: 'Intro Content',
        pl: 'Tekst wprowadzający'
      },
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] })]
        },
      }),
    },
  ],
  labels: {
    plural: {
      en: 'Form Blocks',
      pl: 'Bloki formularza'
    },
    singular: {
      en: 'Form Block',
      pl: 'Blok formularza',
    },
  },
}
