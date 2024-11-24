import type { Description, GlobalConfig, RichTextField } from 'payload'
import { getText } from './getLexicalText'

const CONFIRMATION_LINK_REPLACEMENT_TOKEN = '{{confirmationLink}}'
const CANCELLATION_LINK_REPLACEMENT_TOKEN = '{{cancellationLink}}'

const getEmailContentField = ({
  label,
  name,
  requiredToken,
  description,
}: {
  label: string
  name: string
  requiredToken: string
  description: Description
}): RichTextField => ({
  name,
  label,
  type: 'richText',
  required: true,
  validate: (value) => {
    if (!value) return true
    const textContent = getText(value.root.children)
    if (!textContent.includes(requiredToken)) {
      return `${requiredToken} token is missing from the email content.`
    }
    return true
  },
  admin: {
    description
  },
})

export const confirmationEmailContentField = getEmailContentField({
  label: 'Confirmation email content',
  name: 'confirmationEmail',
  requiredToken: CONFIRMATION_LINK_REPLACEMENT_TOKEN,
  description: {
    en: 'Email content that will be sent to the user after submitting the form.',
    pl: 'Treść emaila, która zostanie wysłana do użytkownika po wysłaniu formularza.',
  },
})
export const cancellationEmailContentField = getEmailContentField({
  label: 'Cancellation email content',
  name: 'cancellationEmail',
  requiredToken: CANCELLATION_LINK_REPLACEMENT_TOKEN,
  description: {
    en: 'Email content that will be sent to the user after cancelling the form.',
    pl: 'Treść emaila, która zostanie wysłana do użytkownika po anulowaniu formularza.',
  },
})

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
  fields: [confirmationEmailContentField, cancellationEmailContentField],
}
