import { Form } from "@/payload-types";
import { FormSubmission } from "node_modules/@payloadcms/plugin-form-builder/dist/types";
import { CollectionConfig, Field, PayloadRequest, RequestContext } from "payload";

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
    access: {
      update: () => true,
    },
    hooks: {
      afterChange: [
        async ({ previousDoc, doc, req, context }: { previousDoc: FormSubmission & { status: SubmissionStatus }, doc: { id: string } & FormSubmission & { status: SubmissionStatus }, req: PayloadRequest, context: RequestContext }) => {          
          if(previousDoc.status === doc.status) return
          const email = doc.submissionData.find(({ field }) => field === 'email')?.value
          if(!email) {
            console.warn(`No email found in submission data ${context.id}, sending email cancelled.`)
            return
          }
          const name = doc.submissionData.find(({ field }) => field === 'firstName')?.value
          const lastName = doc.submissionData.find(({ field }) => field === 'lastName')?.value
          if(!name || !lastName) {
            console.warn(`No name found in submission data ${context.id}, sending email cancelled.`)
            return
          }
          const formTitle = (doc.form as Form).title
          const firstLine = `Dear ${name} ${lastName}, your submission for ${formTitle} has been changed to ${doc.status}.`
          const cancelLink = `If you wish to cancel your submission, please click the link below: \n ${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/form-submissions/${doc.id}/cancel`
          const text = [
            firstLine,
            doc.status === SubmissionStatus.CONFIRMED ? cancelLink : undefined,
          ].filter(Boolean).join('\n')
          await req.payload.sendEmail({
              to: email,
              // TODO: add translations from globals
              subject: `${ formTitle } - form submission status changed to ${doc.status}`,
              text,
            }).catch(err => {
              console.error('Failed to send status change email:', err)
            })
        }
      ],
    },
    fields: ({ defaultFields }) => {
      return [
        // fields are disabled by default, we'd like to keep it so
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
          ]
        },
      ]
    },
}