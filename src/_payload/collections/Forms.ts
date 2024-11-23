import { CollectionConfig, Field } from "payload";
import { confirmationEmailContentField } from "../globals/EmailTemplates";
import { UserConfirmationRequired } from "./UserConfirmationRequired";

export const Forms: Omit<CollectionConfig, 'fields' | 'slug'> & { fields: (args: { defaultFields: Field[] }) => Field[] } = {
  fields: ({ defaultFields }) => {
    const emailField = defaultFields[defaultFields.length - 1]
    const confirmationFields = defaultFields.slice(3, -1)
    const otherFields = defaultFields.slice(0, 3)
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
        label: {
          en: 'Confirmation email content',
          pl: 'Treść emaila potwierdzającego',
        },
        admin: {
          description: {
            en: 'Email content that will be sent to the user after submitting the form.',
            pl: 'Treść emaila, która zostanie wysłana do użytkownika po wysłaniu formularza.',
          },
          condition: (args) => {
            return args.confirmation.userConfirmationRequired
          },
        },
      }
    ]
  },
}