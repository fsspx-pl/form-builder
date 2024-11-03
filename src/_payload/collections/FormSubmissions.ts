import { CollectionConfig, Field } from "payload";

export enum SubmissionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export const FormSubmissions: Omit<CollectionConfig, 'fields' | 'slug'> & { fields: (args: { defaultFields: Field[] }) => Field[] } = {
    admin: {
      components: {
        beforeListTable: ['src/components/ExportButton/index.tsx#ExportButton'],
      },
    },
    fields: ({ defaultFields }) => {
      return [
        ...defaultFields,
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          defaultValue: SubmissionStatus.PENDING,
          options: [
            {
              label: 'Pending',
              value: SubmissionStatus.PENDING,
            },
            {
              label: 'Confirmed',
              value: SubmissionStatus.CONFIRMED,
            },
            {
              label: 'Cancelled',
              value: SubmissionStatus.CANCELLED,
            },
          ],
          disabled: true,
        },
      ]
    },
}