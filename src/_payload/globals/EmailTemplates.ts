import type { Field, GlobalConfig } from 'payload'
import { getText } from './getLexicalText'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'

const CONFIRMATION_LINK_REPLACEMENT_TOKEN = '{{confirmationLink}}'
const CANCELLATION_LINK_REPLACEMENT_TOKEN = '{{cancellationLink}}'

const getEmailContentField = ({ label, name, requiredToken }: { label: string, name: string, requiredToken: string }): Field => ({
  type: 'collapsible',
  label,
  fields: [
    {
      name,
      type: 'richText',
      required: true,
      defaultValue: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "d",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
              textFormat: 0,
              textStyle: "",
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      validate: (value) => {
        if (!value) return true;
        const textContent = getText(value.root.children)
        if (!textContent.includes(requiredToken)) {
          return `${requiredToken} token is missing from the email content.`
        }
        return true
      },
    },
  ],
})

export const confirmationEmailContentField = getEmailContentField({ label: 'Confirmation email content', name: 'confirmationEmail', requiredToken: CONFIRMATION_LINK_REPLACEMENT_TOKEN })
export const cancellationEmailContentField = getEmailContentField({ label: 'Cancellation email content', name: 'cancellationEmail', requiredToken: CANCELLATION_LINK_REPLACEMENT_TOKEN })

export const EmailTemplates: GlobalConfig = {
  slug: 'email-templates',
  admin: {
    description:
      'Email templates used in the application. They can be overridden in respective form settings.',
  },
  access: {
    // TODO admins only?
    read: () => true,
  },
  fields: [
    confirmationEmailContentField,
    cancellationEmailContentField,
  ],
}
