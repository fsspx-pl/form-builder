import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { SubmissionStatus } from "@/_payload/collections/FormSubmissions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ submissionId: string }> } 
) {
  const { submissionId } = await params;

  const payload = await getPayload({ config });
  await payload.update({
    collection: 'form-submissions',
    id: submissionId,
    data: {
      status: SubmissionStatus.CONFIRMED,
    },
  });
  

  return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/submission-confirmed`, request.url));
}
