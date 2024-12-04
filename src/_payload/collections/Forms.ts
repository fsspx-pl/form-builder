import { CollectionConfig, Field } from "payload";
import { cancellationEmailContentField, confirmationEmailContentField } from "../globals/EmailTemplates";
import { UserConfirmationRequired } from "./UserConfirmationRequired";
import { getPayload } from "payload";
import config from '@payload-config';
import { revalidatePath, revalidateTag } from "next/cache";

export const Forms: Omit<CollectionConfig, 'fields' | 'slug'> & { fields: (args: { defaultFields: Field[] }) => Field[] } = {
  fields: ({ defaultFields }) => {
    const emailField = defaultFields[defaultFields.length - 1]
    const confirmationFields = defaultFields.slice(3, -1)
    const otherFields = defaultFields.slice(0, 3)

    const getDefaultEmailContent = (type: 'confirmation' | 'cancellation') => async () => {
      try {
        const payload = await getPayload({ config })
        const emailTemplates = await payload.findGlobal({
          slug: 'email-templates'
        })
        return type === 'confirmation' ? emailTemplates.confirmationEmail : emailTemplates.cancellationEmail
      } catch (err) {
        console.error(`Error getting ${type} email content:`, err)
        return null
      }
    }

    const getDefaultConfirmationEmailContent = getDefaultEmailContent('confirmation')
    const getDefaultCancellationEmailContent = getDefaultEmailContent('cancellation')
    return [
      ...otherFields,
      {
        type: 'group',
        name: 'confirmation',
        fields: [
          ...confirmationFields,
          UserConfirmationRequired,
        ],
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
    afterChange: [
      async ({ doc }) => {
        const payload = await getPayload({ config })
        const pages = await payload.find({
          collection: 'pages',
          where: {
            'layout.form': {
              equals: doc.id
            }
          }
        })
        
        pages.docs.forEach(page => {
          revalidateTag(`page-${page.slug}`)
        })
      }
    ]
  }
}
