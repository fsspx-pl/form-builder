import { CollectionConfig, Field } from "payload";

export const Forms: Omit<CollectionConfig, 'fields' | 'slug'> & { fields: (args: { defaultFields: Field[] }) => Field[] } = {
  fields: ({ defaultFields }) => {
    const lastField = defaultFields[defaultFields.length - 1]
    const otherFields = defaultFields.slice(0, -1)
    return [
      ...otherFields,
      {
        name: 'userConfirmationRequired',
        type: 'checkbox', 
        label: {
          en: 'Requires user\'s confirmation',
          pl: 'Wymaga potwierdzenia użytkownika',
        },
        admin: {
          description: {
            en: 'If checked, user will be required to click a confirmation link, received in confirmation email.',
            pl: 'Aby potwierdzić zgłoszenie, użytkownik będzie musiał kliknąć w link potwierdzający, otrzymany w emailu po wysłaniu formularza.',
          },
        },
        defaultValue: false,
        options: [
          {
            label: {
              en: 'Yes',
              pl: 'Tak',
            },
            value: true,
          },
          {
            label: {
              en: 'No',
              pl: 'Nie',
            },
            value: false,
          }
        ],
      },
      lastField
    ]
  },
}