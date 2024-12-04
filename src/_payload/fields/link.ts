import { deepMerge, GroupField, type Field } from 'payload'

export const appearanceOptions = {
  default: {
    label: {
      en:'Default',
      pl: 'Standardowy',
    },
    value: 'default',
  },
  primary: {
    label: {
      en: 'Primary Button',
      pl: 'Przycisk główny',
    },
    value: 'primary',
  },
  secondary: {
    label: {
      en: 'Secondary Button',
      pl: 'Przycisk drugorzędny',
    },
    value: 'secondary',
  },
}

export type LinkAppearances = 'default' | 'primary' | 'secondary'

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group' as const,
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: {
                  en: 'Internal link',
                  pl: 'Link wewnętrzny',
                },
                value: 'reference',
              },
              {
                label: {
                  en: 'Custom URL',
                  pl: 'Link niestandardowy'
                },
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: {
              en: 'Open in new tab',
              pl: 'Otwórz w nowym oknie',
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: {
        en: 'Document to link to',
        pl: 'Dokument do którego prowadzi link',
      },
      maxDepth: 1,
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: {
        en: 'Custom URL',
        pl: 'Link niestandardowy'
      },
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes[0].admin!.width = '50%'
    linkTypes[1].admin!.width = '50%'

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: {
            en: 'Label',
            pl: 'Etykieta',
          },
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.primary,
      appearanceOptions.secondary,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides) as GroupField
}

export default link
