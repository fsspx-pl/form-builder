import { Form, FormSubmission } from "@payloadcms/plugin-form-builder/types";
import { serializeLexical } from "node_modules/@payloadcms/plugin-form-builder/dist/utilities/lexical/serializeLexical";
import { replaceDoubleCurlys } from "node_modules/@payloadcms/plugin-form-builder/dist/utilities/replaceDoubleCurlys";
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
          const form = await req.payload.findByID({
            collection: 'forms',
            id: (doc.form as Form).id
          })
          if(!form.confirmation?.userConfirmationRequired) return

          if(previousDoc.status === doc.status) return
          if(doc.status === SubmissionStatus.CANCELLED) return
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

          const link = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/form-submissions/${doc.id}`
          const cancellationLink = `${link}/cancel`
          const confirmationLink = `${link}/confirm`

          const title = form.title
          const messageTemplate = doc.status === SubmissionStatus.PENDING
            ? form.confirmationEmail
            : doc.status === SubmissionStatus.CONFIRMED
            ? form.cancellationEmail
            : undefined
          const serialized = await serializeLexical(messageTemplate)
          const message = replaceDoubleCurlys(serialized, [
            { field: 'cancellationLink', value: cancellationLink },
            { field: 'confirmationLink', value: confirmationLink },
          ])
          await req.payload.sendEmail({
              to: email,
              // TODO: add translations from globals
              subject: `${ title } - form submission status changed to ${doc.status}`,
              html: `<div>${message}</div>`,
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