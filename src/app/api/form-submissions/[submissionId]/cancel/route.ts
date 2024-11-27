import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { SubmissionStatus } from "@/_payload/collections/FormSubmissions";

export async function GET(request: Request, { params }: { params: { submissionId: string } }) {
  const { submissionId } = params;

  const payload = await getPayload({ config });
  await payload.update({
    collection: 'form-submissions',
    id: submissionId,
    data: {
      status: SubmissionStatus.CANCELLED,
    },
  });

  return NextResponse.redirect(new URL('/submission-cancelled', request.url));
}
