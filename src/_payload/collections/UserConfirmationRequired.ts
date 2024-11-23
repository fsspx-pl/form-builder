import { CheckboxField } from "payload";

export const UserConfirmationRequired: CheckboxField = {
  name: 'userConfirmationRequired',
  type: 'checkbox',
  label: {
    en: 'Requires user\'s confirmation',
    pl: 'Wymaga potwierdzenia użytkownika',
  },
  admin: {
    description: {
      en: 'If checked, user will be required to click the confirmation link, received in the email after submitting the form.',
      pl: 'Aby potwierdzić zgłoszenie, użytkownik będzie musiał kliknąć w link potwierdzający, otrzymany w emailu po wysłaniu formularza.',
    },
  },
  defaultValue: false
};
