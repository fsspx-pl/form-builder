import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { fields, formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { Block, buildConfig, FieldBase } from 'payload'
import { fileURLToPath } from 'url'

import { FormSubmissions } from './_payload/collections/FormSubmissions'
import { Forms } from './_payload/collections/Forms'
import { Pages } from './_payload/collections/Pages'
import { Users } from './_payload/collections/Users'
import { MainMenu } from './_payload/globals/MainMenu'
import { EmailTemplates } from './_payload/globals/EmailTemplates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: 'src/components/Logo/index.tsx#Logo',
      }
    }
  },
  collections: [Pages, Users],
  // We need to set CORS rules pointing to our hosted domains for the frontend to be able to submit to our API
  cors: [process.env.NEXT_PUBLIC_PAYLOAD_URL || ''],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor(
  {
    features: () => {
      return [
        BoldFeature(),
        ItalicFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ]
    },
  }
  ),
  globals: [MainMenu, EmailTemplates],
  plugins: [
    formBuilderPlugin({
      fields: {
        payment: false,
        birthYear: {
          // @ts-ignore - https://github.com/payloadcms/payload/issues/7787
          slug: 'birthYear',
          fields: [
            ...(fields.select as Block).fields.filter((field) => (field as FieldBase).name !== 'options')
          ],
          label: {
            pl: 'Rok urodzenia',
            en: 'Birth Year',
          },
        },
      },
      formOverrides: Forms,
      formSubmissionOverrides: FormSubmissions,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.FROM_ADDRESS ?? '',
    defaultFromName: process.env.FROM_NAME ?? '',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
})
