import { CollectionConfig, Field } from 'payload'
import {
  cancellationEmailContentField,
  confirmationEmailContentField,
} from '../globals/EmailTemplates'
import { UserConfirmationRequired } from './UserConfirmationRequired'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Form } from '@/payload-types'

export const Forms: Omit<CollectionConfig, 'fields' | 'slug'> & {
  fields: (args: { defaultFields: Field[] }) => Field[]
} = {
  fields: ({ defaultFields }) => {
    const emailField = defaultFields[defaultFields.length - 1]
    const confirmationFields = defaultFields.slice(3, -1)
    const [titleField, ...otherFields] = defaultFields.slice(0, 3)

    const getDefaultEmailContent = (type: 'confirmation' | 'cancellation') => async () => {
      try {
        const payload = await getPayload({ config })
        const emailTemplates = await payload.findGlobal({
          slug: 'email-templates',
        })
        return type === 'confirmation'
          ? emailTemplates.confirmationEmail
          : emailTemplates.cancellationEmail
      } catch (err) {
        console.error(`Error getting ${type} email content:`, err)
        return null
      }
    }

    const getDefaultConfirmationEmailContent = getDefaultEmailContent('confirmation')
    const getDefaultCancellationEmailContent = getDefaultEmailContent('cancellation')
    return [
      titleField,
      {
        name: 'basicInformation',
        type: 'group',
        label: 'Basic Information',
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'visible',
                type: 'checkbox',
                label: 'Visible',
                defaultValue: true,
                admin: {
                  description: 'If the form is visible, it will be displayed in the event list.',
                },
              },
              {
                name: 'active',
                type: 'checkbox',
                label: 'Active',
                defaultValue: true,
                admin: {
                  width: '50%',
                },
              },
            ],
          },
          {
            name: 'statusMessage',
            type: 'text',
            label: 'Status Message',
            admin: {
              description:
                'This message will be displayed underneath to the form in the event list.',
            },
          },
          {
            type: 'row',
            fields: [
              {
                type: 'group',
                name: 'start',
                label: '',
                fields: [
                  {
                    name: 'date',
                    type: 'date',
                    label: 'Start Date',
                    admin: {
                      width: '50%',
                      date: {
                        pickerAppearance: 'dayAndTime',
                        displayFormat: 'MMM d, yyyy h:mma',
                      },
                    },
                    validate: (val, { data }: { data: Form }) => {
                      if (!val) return true
                      if (data.basicInformation?.end?.skip) return true
                      const start = new Date(val)
                      const end = new Date(data.basicInformation?.end?.date as string)

                      if (start > end) {
                        return 'Start date must be before end date'
                      }
                      return true
                    },
                  },
                ],
                admin: {
                  width: '50%',
                }
              },
              {
                type: 'group',
                name: 'end',
                label: '',
                fields: [
                  {
                    name: 'date',
                    type: 'date',
                    label: 'End Date',
                    admin: {
                      date: {
                        pickerAppearance: 'dayAndTime',
                        displayFormat: 'MMM d, yyyy h:mma',
                      },
                      description:
                        'After end date, form will be automatically set to hidden and inactive.',
                    },
                  },
                  {
                    name: 'skip',
                    type: 'checkbox',
                    label: 'No End Date',
                    defaultValue: false,
                  },
                ],
                admin: {
                  width: '50%',
                }
              },
            ],
          },
        ],
      },
      ...otherFields,
      {
        type: 'group',
        name: 'confirmation',
        fields: [...confirmationFields, UserConfirmationRequired],
      },
      emailField,
      {
        ...confirmationEmailContentField,
        defaultValue: getDefaultConfirmationEmailContent,
        admin: {
          condition: (args) => {
            return args.confirmation.userConfirmationRequired
          },
        },
      },
      {
        ...cancellationEmailContentField,
        defaultValue: getDefaultCancellationEmailContent,
        admin: {
          condition: (args) => {
            return args.confirmation.userConfirmationRequired
          },
        },
      },
    ]
  },
  hooks: {
    beforeRead: [
      async ({ doc, req }) => {
        if (doc.basicInformation?.dueDate && !doc.basicInformation.noDueDate) {
          const now = new Date()
          const dueDate = new Date(doc.basicInformation.dueDate)

          if (now > dueDate) {
            const updatedDoc = await req.payload.update({
              collection: 'forms',
              id: doc.id,
              data: {
                basicInformation: {
                  active: false,
                  visible: false,
                },
              },
            })

            return updatedDoc
          }
        }
        return doc
      },
    ],
  },
}
