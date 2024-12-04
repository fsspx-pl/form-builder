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
  label: string | { en: string, pl: string }
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
  label: {
    en: 'Confirmation email content',
    pl: 'Treść emaila potwierdzającego',
  },
  name: 'confirmationEmail',
  requiredToken: CONFIRMATION_LINK_REPLACEMENT_TOKEN,
  description: {
    en: 'Email content that will be sent to the user after submitting the form.',
    pl: 'Treść emaila, która zostanie wysłana do użytkownika po wysłaniu formularza.',
  },
})
export const cancellationEmailContentField = getEmailContentField({
  label: {
    en: 'Cancellation email content',
    pl: 'Treść emaila anulującego',
  },
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
    description: {
      en: 'Email templates used in the application. They can be overridden in respective form settings.',
      pl: 'Szablony maili używanych w aplikacji. Mogą zostać nadpisane przy edycji konkretnych formularzy.',
    },
  },
  access: {
    // TODO admins only?
    read: () => true,
  },
  fields: [confirmationEmailContentField, cancellationEmailContentField],
}
