import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { SubmissionStatus } from "@/_payload/collections/FormSubmissions";

export async function GET(request: Request, { params }: { params: { submissionId: string } }) {
  const { submissionId } = params;

  const payload = await getPayloadHMR({ config });
  const submission = await payload.update({
    collection: 'form-submissions',
    id: submissionId,
    data: {
      status: SubmissionStatus.CONFIRMED,
    },
  });
  console.log(submission);
  

  return NextResponse.redirect(new URL('/submission-confirmed', request.url));
}
