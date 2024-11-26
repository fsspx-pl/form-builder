import config from '@payload-config';
import { getPayload } from 'payload';
import { NextResponse } from 'next/server';
import { CollectionSlug } from 'payload';

interface BatchRequest {
  submissionIds: string[];
}

export async function POST(request: Request) {
  try {
    const { submissionIds }: BatchRequest = await request.json();
    
    const payload = await getPayload({ config });
    const submissions = await payload.find({
      collection: 'form-submissions' as CollectionSlug,
      where: {
        id: {
          in: submissionIds
        }
      },
      depth: 2,
      limit: 100
    });

    return NextResponse.json(submissions.docs);
  } catch (error) {
    console.error('Failed to fetch form submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch form submissions' }, { status: 500 });
  }
} 